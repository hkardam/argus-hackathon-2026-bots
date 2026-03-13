import json
import csv
import io
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.award import GrantAward
from app.models.application import Application
from app.models.disbursement import DisbursementTranche, BankDetails
from app.models.report import ExpenditureRecord
from app.schemas.finance import (BankDetailsCreate, MarkDisbursedRequest,
                                   ExpenditureVerifyRequest)
from app.services import audit as audit_service
from app.services import notifications as notif_service

router = APIRouter(prefix="/api/finance", tags=["finance"])
RequireFinance = Depends(require_role("FINANCE"))


@router.get("/dashboard/stats")
def dashboard_stats(current_user: User = RequireFinance, db: Session = Depends(get_db)):
    total_committed = db.query(func.sum(GrantAward.award_amount)).filter(GrantAward.decision == "APPROVED").scalar() or 0
    total_disbursed = db.query(func.sum(DisbursementTranche.amount_inr)).filter(DisbursementTranche.status == "DISBURSED").scalar() or 0
    pending_tranches = db.query(DisbursementTranche).filter(DisbursementTranche.status.in_(["PENDING", "READY"])).count()
    reported_expenditure = db.query(func.sum(ExpenditureRecord.amount_inr)).filter(ExpenditureRecord.verification_status == "VERIFIED").scalar() or 0
    active_grants = db.query(Application).filter(Application.status == "ACTIVE").count()
    return {
        "total_committed": total_committed,
        "total_disbursed": total_disbursed,
        "pending_tranches": pending_tranches,
        "reported_expenditure": reported_expenditure,
        "active_grants": active_grants,
    }


@router.get("/disbursements")
def list_disbursements(status: Optional[str] = None,
                        current_user: User = RequireFinance, db: Session = Depends(get_db)):
    q = db.query(DisbursementTranche)
    if status:
        q = q.filter(DisbursementTranche.status == status.upper())
    tranches = q.order_by(DisbursementTranche.created_at.desc()).all()

    result = []
    for t in tranches:
        award = t.grant_award
        app = award.application if award else None
        sd = {}
        if app:
            try:
                sd = json.loads(app.section_data or "{}")
            except Exception:
                pass
        org = sd.get("organisation", {})
        result.append({
            "id": t.id,
            "grant_award_id": t.grant_award_id,
            "label": t.label,
            "amount_inr": t.amount_inr,
            "tranche_type": t.tranche_type,
            "trigger_condition": t.trigger_condition,
            "status": t.status,
            "disbursed_at": t.disbursed_at,
            "transaction_reference": t.transaction_reference,
            "application_reference": app.reference_id if app else None,
            "grantee_name": org.get("legal_name"),
            "grant_programme_name": app.grant_programme.name if app and app.grant_programme else None,
        })
    return result


@router.get("/disbursements/{tranche_id}")
def get_disbursement_detail(tranche_id: int, current_user: User = RequireFinance, db: Session = Depends(get_db)):
    tranche = db.query(DisbursementTranche).filter(DisbursementTranche.id == tranche_id).first()
    if not tranche:
        raise HTTPException(status_code=404, detail="Tranche not found")

    award = tranche.grant_award
    app = award.application if award else None
    sd = {}
    if app:
        try:
            sd = json.loads(app.section_data or "{}")
        except Exception:
            pass
    org = sd.get("organisation", {})

    # Bank details (Finance Officer only)
    bank = db.query(BankDetails).filter(BankDetails.grant_award_id == award.id).first() if award else None

    return {
        "id": tranche.id,
        "label": tranche.label,
        "amount_inr": tranche.amount_inr,
        "tranche_type": tranche.tranche_type,
        "trigger_condition": tranche.trigger_condition,
        "status": tranche.status,
        "disbursed_at": tranche.disbursed_at,
        "transaction_reference": tranche.transaction_reference,
        "grantee_name": org.get("legal_name"),
        "application_reference": app.reference_id if app else None,
        "bank_details": {
            "account_number": bank.account_number if bank else None,
            "ifsc_code": bank.ifsc_code if bank else None,
            "beneficiary_name": bank.beneficiary_name if bank else None,
            "bank_name": bank.bank_name if bank else None,
        } if bank else None,
    }


@router.post("/disbursements/{tranche_id}/mark-disbursed")
def mark_disbursed(tranche_id: int, data: MarkDisbursedRequest,
                    current_user: User = RequireFinance, db: Session = Depends(get_db)):
    tranche = db.query(DisbursementTranche).filter(DisbursementTranche.id == tranche_id).first()
    if not tranche:
        raise HTTPException(status_code=404, detail="Tranche not found")
    if tranche.status == "DISBURSED":
        raise HTTPException(status_code=400, detail="Already disbursed")

    tranche.status = "DISBURSED"
    tranche.disbursed_at = datetime.now(timezone.utc)
    tranche.disbursed_by_id = current_user.id
    tranche.transaction_reference = data.transaction_reference
    tranche.notes = data.notes

    # Notify applicant
    award = tranche.grant_award
    if award and award.application:
        notif_service.notify_tranche_disbursed(
            db, award.application.applicant_id, tranche.amount_inr, tranche.label
        )
        # Activate grant if inception tranche
        if tranche.tranche_type == "INCEPTION" and award.application.status == "AGREEMENT_SENT":
            award.application.status = "ACTIVE"
            award.application.workflow_stage = "Active Grant"

    audit_service.log_action(db, current_user.id, current_user.email, "TRANCHE_DISBURSED",
                              "DisbursementTranche", str(tranche_id),
                              {"amount": tranche.amount_inr, "reference": data.transaction_reference})
    db.commit()
    return {"success": True}


@router.post("/grants/{award_id}/bank-details")
def add_bank_details(award_id: int, data: BankDetailsCreate,
                      current_user: User = RequireFinance, db: Session = Depends(get_db)):
    award = db.query(GrantAward).filter(GrantAward.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Grant award not found")

    existing = db.query(BankDetails).filter(BankDetails.grant_award_id == award_id).first()
    if existing:
        existing.account_number = data.account_number
        existing.ifsc_code = data.ifsc_code
        existing.beneficiary_name = data.beneficiary_name
        existing.bank_name = data.bank_name
    else:
        bd = BankDetails(
            grant_award_id=award_id,
            account_number=data.account_number,
            ifsc_code=data.ifsc_code,
            beneficiary_name=data.beneficiary_name,
            bank_name=data.bank_name,
            added_by_id=current_user.id,
        )
        db.add(bd)
    db.commit()
    return {"success": True}


@router.get("/expenditures")
def list_expenditures(status: Optional[str] = None,
                       current_user: User = RequireFinance, db: Session = Depends(get_db)):
    q = db.query(ExpenditureRecord)
    if status:
        q = q.filter(ExpenditureRecord.verification_status == status.upper())
    records = q.order_by(ExpenditureRecord.created_at.desc()).all()

    result = []
    for r in records:
        award = r.grant_award
        app = award.application if award else None
        sd = {}
        if app:
            try:
                sd = json.loads(app.section_data or "{}")
            except Exception:
                pass
        org = sd.get("organisation", {})
        result.append({
            "id": r.id,
            "grant_award_id": r.grant_award_id,
            "date": r.date,
            "payee": r.payee,
            "amount_inr": r.amount_inr,
            "budget_category": r.budget_category,
            "description": r.description,
            "verification_status": r.verification_status,
            "created_at": r.created_at,
            "application_reference": app.reference_id if app else None,
            "grantee_name": org.get("legal_name"),
        })
    return result


@router.put("/expenditures/{record_id}/verify")
def verify_expenditure(record_id: int, data: ExpenditureVerifyRequest,
                        current_user: User = RequireFinance, db: Session = Depends(get_db)):
    record = db.query(ExpenditureRecord).filter(ExpenditureRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    record.verification_status = data.decision
    record.verified_by_id = current_user.id
    record.verified_at = datetime.now(timezone.utc)
    record.query_notes = data.notes
    db.commit()
    return {"success": True}


@router.get("/grants/{award_id}/fund-utilisation")
def get_fund_utilisation(award_id: int, current_user: User = RequireFinance, db: Session = Depends(get_db)):
    award = db.query(GrantAward).filter(GrantAward.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")

    total_award = award.award_amount or 0
    total_disbursed = db.query(func.sum(DisbursementTranche.amount_inr)).filter(
        DisbursementTranche.grant_award_id == award_id,
        DisbursementTranche.status == "DISBURSED"
    ).scalar() or 0
    total_expended = db.query(func.sum(ExpenditureRecord.amount_inr)).filter(
        ExpenditureRecord.grant_award_id == award_id,
        ExpenditureRecord.verification_status == "VERIFIED"
    ).scalar() or 0

    # Budget line breakdown
    records = db.query(ExpenditureRecord).filter(ExpenditureRecord.grant_award_id == award_id).all()
    by_category = {}
    for r in records:
        cat = r.budget_category or "Other"
        by_category[cat] = by_category.get(cat, 0) + r.amount_inr

    tranches = db.query(DisbursementTranche).filter(DisbursementTranche.grant_award_id == award_id).all()

    return {
        "total_awarded": total_award,
        "total_disbursed": total_disbursed,
        "total_expended": total_expended,
        "utilisation_pct": round(total_expended / total_award * 100, 1) if total_award else 0,
        "by_budget_category": by_category,
        "tranches": [{"label": t.label, "amount": t.amount_inr, "status": t.status,
                      "disbursed_at": t.disbursed_at} for t in tranches],
    }


@router.get("/export/disbursements")
def export_disbursements(current_user: User = RequireFinance, db: Session = Depends(get_db)):
    tranches = db.query(DisbursementTranche).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Label", "Amount (INR)", "Type", "Status", "Disbursed At", "Transaction Ref", "Application Ref"])
    for t in tranches:
        app = t.grant_award.application if t.grant_award else None
        writer.writerow([t.id, t.label, t.amount_inr, t.tranche_type, t.status,
                         t.disbursed_at, t.transaction_reference,
                         app.reference_id if app else ""])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=disbursements.csv"})
