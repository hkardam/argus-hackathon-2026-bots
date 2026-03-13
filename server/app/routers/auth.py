from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.models.user import User
from app.models.organisation import OrganisationProfile
from app.schemas.auth import LoginRequest, RegisterRequest, DemoLoginRequest, TokenResponse, UserInfo

router = APIRouter(prefix="/api/auth", tags=["auth"])

DEMO_ROLES = {
    "applicant": ("demo_applicant@grantflow.in", "Demo Applicant", "APPLICANT"),
    "officer": ("demo_officer@grantflow.in", "Demo Officer", "OFFICER"),
    "reviewer": ("demo_reviewer@grantflow.in", "Demo Reviewer", "REVIEWER"),
    "finance": ("demo_finance@grantflow.in", "Demo Finance Officer", "FINANCE"),
    "admin": ("demo_admin@grantflow.in", "Demo Admin", "ADMIN"),
}


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email, User.is_active == True).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, user=UserInfo.model_validate(user))


@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=request.email,
        password_hash=get_password_hash(request.password),
        full_name=request.full_name,
        role="APPLICANT",
    )
    db.add(user)
    db.flush()
    # Create empty org profile
    profile = OrganisationProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, user=UserInfo.model_validate(user))


@router.post("/demo-login", response_model=TokenResponse)
def demo_login(request: DemoLoginRequest, db: Session = Depends(get_db)):
    role_key = request.role.lower()
    if role_key not in DEMO_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Choose from: {', '.join(DEMO_ROLES.keys())}")
    email, full_name, role = DEMO_ROLES[role_key]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found. Run seed.py first.")
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, user=UserInfo.model_validate(user))


@router.get("/me", response_model=UserInfo)
def get_me(current_user: User = Depends(get_current_user)):
    return UserInfo.model_validate(current_user)
