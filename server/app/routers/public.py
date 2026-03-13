import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.grant_programme import GrantProgramme
from app.schemas.grant import GrantProgrammeOut, EligibilityCheckRequest, EligibilityCheckResponse, EligibilityCheckResult
from app.services.eligibility import quick_eligibility_check

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/programmes", response_model=list[GrantProgrammeOut])
def list_programmes(db: Session = Depends(get_db)):
    programmes = db.query(GrantProgramme).filter(GrantProgramme.is_active == True).all()
    result = []
    for p in programmes:
        out = GrantProgrammeOut.model_validate(p)
        if isinstance(out.eligible_org_types, str):
            try:
                out.eligible_org_types = json.loads(out.eligible_org_types)
            except Exception:
                pass
        result.append(out)
    return result


@router.get("/programmes/{programme_id}", response_model=GrantProgrammeOut)
def get_programme(programme_id: int, db: Session = Depends(get_db)):
    p = db.query(GrantProgramme).filter(GrantProgramme.id == programme_id).first()
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Programme not found")
    out = GrantProgrammeOut.model_validate(p)
    if isinstance(out.eligible_org_types, str):
        try:
            out.eligible_org_types = json.loads(out.eligible_org_types)
        except Exception:
            pass
    return out


@router.post("/eligibility/check", response_model=EligibilityCheckResponse)
def check_eligibility(request: EligibilityCheckRequest, db: Session = Depends(get_db)):
    programmes = db.query(GrantProgramme).filter(GrantProgramme.is_active == True).all()
    results = []
    for p in programmes:
        check = quick_eligibility_check(
            org_type=request.org_type,
            district=request.district,
            amount=request.amount_requested,
            grant_code=p.code,
            grant=p,
        )
        results.append(EligibilityCheckResult(
            programme_id=p.id,
            programme_name=p.name,
            programme_code=p.code,
            status=check["status"],
            reasons=check["reasons"],
        ))
    return EligibilityCheckResponse(results=results)
