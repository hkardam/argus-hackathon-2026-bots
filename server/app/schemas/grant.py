from pydantic import BaseModel
from typing import Optional, List, Any
import json


class GrantProgrammeOut(BaseModel):
    id: int
    code: str
    name: str
    purpose: Optional[str]
    funding_min: Optional[float]
    funding_max: Optional[float]
    duration_min_months: Optional[int]
    duration_max_months: Optional[int]
    eligible_org_types: Optional[Any]
    geographic_focus: Optional[str]
    annual_cycle: Optional[str]
    max_awards_per_cycle: Optional[int]
    total_budget_crore: Optional[float]
    is_active: bool
    image_color: Optional[str]

    model_config = {"from_attributes": True}

    def model_post_init(self, __context: Any) -> None:
        if isinstance(self.eligible_org_types, str):
            try:
                self.eligible_org_types = json.loads(self.eligible_org_types)
            except Exception:
                pass


class EligibilityCheckRequest(BaseModel):
    org_type: str
    district: str
    amount_requested: float
    year_established: Optional[int] = None
    project_duration_months: Optional[int] = None


class EligibilityCheckResult(BaseModel):
    programme_id: int
    programme_name: str
    programme_code: str
    status: str  # LIKELY_ELIGIBLE, LIKELY_NOT_ELIGIBLE
    reasons: List[str]


class EligibilityCheckResponse(BaseModel):
    results: List[EligibilityCheckResult]
