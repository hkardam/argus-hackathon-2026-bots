from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CreateUserRequest(BaseModel):
    email: str
    full_name: str
    role: str  # OFFICER, REVIEWER, FINANCE, ADMIN
    password: Optional[str] = "demo1234"


class UpdateUserRequest(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None
    full_name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class AuditLogOut(BaseModel):
    id: int
    actor_email: str
    action: str
    object_type: Optional[str]
    object_id: Optional[str]
    details: Optional[str]
    timestamp: Optional[datetime]

    model_config = {"from_attributes": True}


class AdminDashboardStats(BaseModel):
    total_users: int
    total_applications: int
    active_grants: int
    total_disbursed: float
    applications_by_status: dict
