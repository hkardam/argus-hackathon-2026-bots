from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime
import json


class ReviewSaveRequest(BaseModel):
    scores: Dict[str, Any]  # {dimension: {reviewer_score, comment}}
    overall_comment: Optional[str] = None
    highlights: Optional[list] = []


class ReviewSubmitRequest(BaseModel):
    scores: Dict[str, Any]
    overall_comment: str
    highlights: Optional[list] = []


class ReviewOut(BaseModel):
    id: int
    assignment_id: int
    application_id: int
    reviewer_id: int
    scores: Any
    composite_score: Optional[float]
    overall_comment: Optional[str]
    status: str
    submitted_at: Optional[datetime]

    model_config = {"from_attributes": True}

    def model_post_init(self, __context: Any) -> None:
        if isinstance(self.scores, str):
            try:
                self.scores = json.loads(self.scores)
            except Exception:
                self.scores = {}


class ReviewAssignmentOut(BaseModel):
    id: int
    application_id: int
    reviewer_id: int
    deadline: Optional[datetime]
    status: str
    reviewer_name: Optional[str] = None
    reviewer_email: Optional[str] = None
    application_reference: Optional[str] = None
    grant_type: Optional[str] = None
    project_title: Optional[str] = None

    model_config = {"from_attributes": True}


class ReviewPackageOut(BaseModel):
    id: int
    application_id: int
    summary_text: Optional[str]
    suggested_scores: Any
    risk_flags: Any
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}

    def model_post_init(self, __context: Any) -> None:
        if isinstance(self.suggested_scores, str):
            try:
                self.suggested_scores = json.loads(self.suggested_scores)
            except Exception:
                self.suggested_scores = {}
        if isinstance(self.risk_flags, str):
            try:
                self.risk_flags = json.loads(self.risk_flags)
            except Exception:
                self.risk_flags = []
