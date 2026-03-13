from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime
import json


class ReportSubmitRequest(BaseModel):
    report_type: str  # SIX_MONTH, QUARTERLY, MID_POINT, FINAL
    report_data: Dict[str, Any]


class ReportReviewRequest(BaseModel):
    action: str  # APPROVE, CLARIFICATION, COMPLIANCE_FLAG
    notes: Optional[str] = None
    compliance_action: Optional[str] = None  # WARNING, DISBURSEMENT_HOLD


class ReportOut(BaseModel):
    id: int
    grant_award_id: int
    report_type: str
    report_data: Any
    status: str
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]
    compliance_action: Optional[str]
    application_reference: Optional[str] = None
    grantee_name: Optional[str] = None

    model_config = {"from_attributes": True}

    def model_post_init(self, __context: Any) -> None:
        if isinstance(self.report_data, str):
            try:
                self.report_data = json.loads(self.report_data)
            except Exception:
                self.report_data = {}


class MessageSendRequest(BaseModel):
    content: str
    is_internal_note: bool = False


class MessageOut(BaseModel):
    id: int
    thread_id: int
    sender_id: int
    sender_name: Optional[str] = None
    sender_role: Optional[str] = None
    content: str
    is_internal_note: bool
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class ThreadOut(BaseModel):
    id: int
    application_id: int
    application_reference: Optional[str] = None
    project_title: Optional[str] = None
    last_message: Optional[str] = None
    last_updated: Optional[datetime] = None
    unread_count: int = 0

    model_config = {"from_attributes": True}


class NotificationOut(BaseModel):
    id: int
    type: Optional[str]
    title: str
    content: Optional[str]
    is_read: bool
    link: Optional[str]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}
