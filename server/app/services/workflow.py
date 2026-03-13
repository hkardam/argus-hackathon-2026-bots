"""Application status state machine"""
from typing import Optional

VALID_TRANSITIONS = {
    "DRAFT": ["SUBMITTED"],
    "SUBMITTED": ["SCREENING"],
    "SCREENING": ["ELIGIBLE", "INELIGIBLE"],
    "ELIGIBLE": ["UNDER_REVIEW"],
    "INELIGIBLE": ["CLOSED"],
    "UNDER_REVIEW": ["REVIEW_COMPLETE"],
    "REVIEW_COMPLETE": ["DECISION_PENDING"],
    "DECISION_PENDING": ["APPROVED", "REJECTED", "WAITLISTED"],
    "APPROVED": ["AGREEMENT_SENT"],
    "REJECTED": ["CLOSED"],
    "WAITLISTED": ["APPROVED", "REJECTED", "CLOSED"],
    "AGREEMENT_SENT": ["ACTIVE"],
    "ACTIVE": ["REPORTING", "CLOSED"],
    "REPORTING": ["CLOSED"],
    "CLOSED": [],
}

STAGE_LABELS = {
    "DRAFT": "Draft",
    "SUBMITTED": "Submitted",
    "SCREENING": "Eligibility Screening",
    "ELIGIBLE": "Eligible — Awaiting Review Assignment",
    "INELIGIBLE": "Ineligible",
    "UNDER_REVIEW": "Under Review",
    "REVIEW_COMPLETE": "Review Complete",
    "DECISION_PENDING": "Decision Pending",
    "APPROVED": "Approved",
    "REJECTED": "Rejected",
    "WAITLISTED": "Waitlisted",
    "AGREEMENT_SENT": "Agreement Sent",
    "ACTIVE": "Active Grant",
    "REPORTING": "Reporting",
    "CLOSED": "Closed",
}


def can_transition(current_status: str, target_status: str) -> bool:
    return target_status in VALID_TRANSITIONS.get(current_status, [])


def get_stage_label(status: str) -> str:
    return STAGE_LABELS.get(status, status)
