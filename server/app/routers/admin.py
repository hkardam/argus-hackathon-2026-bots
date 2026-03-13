from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.core.deps import require_role
from app.core.security import get_password_hash as hash_password
from app.models.user import User
from app.models.application import Application
from app.models.grant_programme import GrantProgramme
from app.models.audit import AuditLog
from app.schemas.admin import CreateUserRequest, UpdateUserRequest
from app.services import audit as audit_service

router = APIRouter(prefix="/api/admin", tags=["admin"])
RequireAdmin = Depends(require_role("ADMIN"))


@router.get("/dashboard/stats")
def dashboard_stats(current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_applications = db.query(Application).count()
    active_grants = db.query(Application).filter(Application.status == "ACTIVE").count()
    by_status = db.query(Application.status, func.count(Application.id)).group_by(Application.status).all()
    by_role = db.query(User.role, func.count(User.id)).group_by(User.role).all()
    return {
        "total_users": total_users,
        "total_applications": total_applications,
        "active_grants": active_grants,
        "applications_by_status": {s: c for s, c in by_status},
        "users_by_role": {r: c for r, c in by_role},
    }


@router.get("/users")
def list_users(role: Optional[str] = None, is_active: Optional[bool] = None,
               current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role.upper())
    if is_active is not None:
        q = q.filter(User.is_active == is_active)
    users = q.order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at,
        }
        for u in users
    ]


@router.post("/users")
def create_user(data: CreateUserRequest, current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        role=data.role.upper(),
        is_active=True,
    )
    db.add(user)
    db.flush()
    audit_service.log_action(db, current_user.id, current_user.email, "USER_CREATED",
                              "User", str(user.id), {"email": data.email, "role": data.role})
    db.commit()
    return {"id": user.id, "email": user.email, "role": user.role}


@router.put("/users/{user_id}")
def update_user(user_id: int, data: UpdateUserRequest,
                current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.role is not None:
        user.role = data.role.upper()
    if data.is_active is not None:
        user.is_active = data.is_active
    if data.full_name is not None:
        user.full_name = data.full_name
    audit_service.log_action(db, current_user.id, current_user.email, "USER_UPDATED",
                              "User", str(user_id), {"role": data.role, "is_active": data.is_active})
    db.commit()
    return {"success": True}


@router.delete("/users/{user_id}")
def deactivate_user(user_id: int, current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    user.is_active = False
    audit_service.log_action(db, current_user.id, current_user.email, "USER_DEACTIVATED",
                              "User", str(user_id), {"email": user.email})
    db.commit()
    return {"success": True}


@router.get("/audit-logs")
def get_audit_logs(page: int = 1, page_size: int = 50,
                   actor_email: Optional[str] = None,
                   action: Optional[str] = None,
                   current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    q = db.query(AuditLog)
    if actor_email:
        q = q.filter(AuditLog.actor_email.ilike(f"%{actor_email}%"))
    if action:
        q = q.filter(AuditLog.action == action.upper())
    total = q.count()
    logs = q.order_by(AuditLog.timestamp.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [
            {
                "id": l.id,
                "actor_email": l.actor_email,
                "action": l.action,
                "object_type": l.object_type,
                "object_id": l.object_id,
                "details": l.details,
                "timestamp": l.timestamp,
            }
            for l in logs
        ],
    }


@router.get("/settings")
def get_settings(current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    # Return platform-level counts and config
    programmes = db.query(GrantProgramme).all()
    return {
        "programmes": [
            {"id": p.id, "code": p.code, "name": p.name, "is_active": p.is_active,
             "funding_min": p.funding_min, "funding_max": p.funding_max}
            for p in programmes
        ],
        "platform": {
            "name": "GrantFlow",
            "version": "1.0.0",
        }
    }


@router.put("/settings")
def update_settings(data: dict, current_user: User = RequireAdmin, db: Session = Depends(get_db)):
    # Update programme active status if provided
    if "programme_updates" in data:
        for upd in data["programme_updates"]:
            prog = db.query(GrantProgramme).filter(GrantProgramme.id == upd["id"]).first()
            if prog and "is_active" in upd:
                prog.is_active = upd["is_active"]
    audit_service.log_action(db, current_user.id, current_user.email, "SETTINGS_UPDATED",
                              "Platform", "1", data)
    db.commit()
    return {"success": True}
