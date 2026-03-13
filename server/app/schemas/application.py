from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime
import json


class ApplicationCreate(BaseModel):
    grant_programme_id: int
    section_data: Optional[Dict[str, Any]] = {}


class ApplicationUpdate(BaseModel):
    section_data: Dict[str, Any]


class ApplicationOut(BaseModel):
    id: int
    reference_id: str
    grant_programme_id: int
    status: str
    workflow_stage: str
    section_data: Any
    locked: bool
    submitted_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_at: Optional[datetime]
    grant_programme_name: Optional[str] = None
    grant_programme_code: Optional[str] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None

    model_config = {"from_attributes": True}

    def model_post_init(self, __context: Any) -> None:
        if isinstance(self.section_data, str):
            try:
                self.section_data = json.loads(self.section_data)
            except Exception:
                self.section_data = {}


class ApplicationListItem(BaseModel):
    id: int
    reference_id: str
    status: str
    workflow_stage: str
    grant_programme_name: Optional[str]
    grant_programme_code: Optional[str]
    project_title: Optional[str]
    submitted_at: Optional[datetime]
    updated_at: Optional[datetime]
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None

    model_config = {"from_attributes": True}


class ScreeningDecisionRequest(BaseModel):
    decision: str  # CONFIRM_ELIGIBLE, OVERRIDE_INELIGIBLE, CLARIFICATION
    notes: Optional[str] = None


class AssignReviewersRequest(BaseModel):
    reviewer_ids: list[int]
    deadline: Optional[datetime] = None


class AwardDecisionRequest(BaseModel):
    decision: str  # APPROVED, REJECTED, WAITLISTED
    reason: str
    award_amount: Optional[float] = None
    special_conditions: Optional[str] = None


class ChatbotMessageRequest(BaseModel):
    conversation_history: list[dict]
    grant_type: str
    current_section: Optional[str] = None
