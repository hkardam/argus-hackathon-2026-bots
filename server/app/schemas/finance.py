from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime, date
import json


class BankDetailsCreate(BaseModel):
    account_number: str
    ifsc_code: str
    beneficiary_name: str
    bank_name: Optional[str] = None


class BankDetailsOut(BaseModel):
    id: int
    grant_award_id: int
    account_number: str
    ifsc_code: str
    beneficiary_name: str
    bank_name: Optional[str]

    model_config = {"from_attributes": True}


class DisbursementTrancheOut(BaseModel):
    id: int
    grant_award_id: int
    label: str
    amount_inr: float
    tranche_type: Optional[str]
    trigger_condition: Optional[str]
    status: str
    disbursed_at: Optional[datetime]
    transaction_reference: Optional[str]
    application_reference: Optional[str] = None
    grantee_name: Optional[str] = None
    grant_programme_name: Optional[str] = None

    model_config = {"from_attributes": True}


class MarkDisbursedRequest(BaseModel):
    transaction_reference: Optional[str] = None
    notes: Optional[str] = None


class ExpenditureRecordCreate(BaseModel):
    date: date
    payee: str
    amount_inr: float
    budget_category: str
    description: Optional[str] = None


class ExpenditureVerifyRequest(BaseModel):
    decision: str  # VERIFIED, QUERIED
    notes: Optional[str] = None


class ExpenditureRecordOut(BaseModel):
    id: int
    grant_award_id: int
    date: Optional[date]
    payee: Optional[str]
    amount_inr: float
    budget_category: Optional[str]
    description: Optional[str]
    verification_status: str
    created_at: Optional[datetime]
    application_reference: Optional[str] = None
    grantee_name: Optional[str] = None

    model_config = {"from_attributes": True}


class FinanceDashboardStats(BaseModel):
    total_committed: float
    total_disbursed: float
    pending_tranches: int
    reported_expenditure: float
    active_grants: int
