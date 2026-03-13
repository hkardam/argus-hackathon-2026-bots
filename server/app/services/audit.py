"""Audit logging helper"""
import json
from sqlalchemy.orm import Session
from app.models.audit import AuditLog


def log_action(db: Session, actor_id: int, actor_email: str, action: str,
               object_type: str = "", object_id: str = "", details: dict = None):
    entry = AuditLog(
        actor_id=actor_id,
        actor_email=actor_email,
        action=action,
        object_type=object_type,
        object_id=str(object_id),
        details=json.dumps(details or {}),
    )
    db.add(entry)
    db.flush()
    return entry
