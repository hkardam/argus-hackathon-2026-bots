import json
import os
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import require_role
from app.core.config import settings
from app.models.user import User
from app.models.application import Application
from app.models.grant_programme import GrantProgramme
from app.models.organisation import OrganisationProfile
from app.models.document import Document
from app.models.message import MessageThread, Message
from app.models.notification import Notification
from app.models.award import GrantAward
from app.models.disbursement import DisbursementTranche
from app.models.report import ProgressReport, ExpenditureRecord
from app.models.screening import ScreeningReport
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut, ApplicationListItem, ChatbotMessageRequest
from app.schemas.report import ReportSubmitRequest, MessageSendRequest, MessageOut, ThreadOut, NotificationOut
from app.schemas.finance import ExpenditureRecordCreate
from app.services import audit as audit_service
from app.services import notifications as notif_service
from app.services import workflow

router = APIRouter(prefix="/api/applicant", tags=["applicant"])
RequireApplicant = Depends(require_role("APPLICANT"))


def _generate_reference_id(grant_code: str, db: Session) -> str:
    count = db.query(Application).count()
    return f"GF-{grant_code}-2026-{(count + 1):04d}"


def _get_section_data(app: Application) -> dict:
    try:
        return json.loads(app.section_data or "{}")
    except Exception:
        return {}


# ---- Organisation Profile ----

@router.get("/profile")
def get_profile(current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    profile = db.query(OrganisationProfile).filter(OrganisationProfile.user_id == current_user.id).first()
    if not profile:
        return {}
    return {
        "id": profile.id,
        "legal_name": profile.legal_name,
        "registration_number": profile.registration_number,
        "org_type": profile.org_type,
        "year_established": profile.year_established,
        "state": profile.state,
        "district": profile.district,
        "annual_budget_inr": profile.annual_budget_inr,
        "contact_person_name": profile.contact_person_name,
        "contact_email": profile.contact_email,
        "contact_phone": profile.contact_phone,
        "website": profile.website,
        "address": profile.address,
        "pincode": profile.pincode,
        "mission": profile.mission,
        "pan_number": profile.pan_number,
        "fcra_number": profile.fcra_number,
        "reg_12a": profile.reg_12a,
        "reg_80g": profile.reg_80g,
        "profile_complete_pct": profile.profile_complete_pct,
    }


@router.put("/profile")
def update_profile(data: dict, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    profile = db.query(OrganisationProfile).filter(OrganisationProfile.user_id == current_user.id).first()
    if not profile:
        profile = OrganisationProfile(user_id=current_user.id)
        db.add(profile)

    for key, value in data.items():
        if hasattr(profile, key):
            setattr(profile, key, value)

    # Calculate completion percentage
    fields = ["legal_name", "registration_number", "org_type", "year_established",
              "state", "district", "annual_budget_inr", "contact_person_name",
              "contact_email", "contact_phone"]
    filled = sum(1 for f in fields if getattr(profile, f))
    profile.profile_complete_pct = round(filled / len(fields) * 100, 1)

    db.commit()
    return {"success": True, "profile_complete_pct": profile.profile_complete_pct}


# ---- Documents ----

@router.get("/documents")
def list_documents(current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    docs = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.status == "ACTIVE"
    ).order_by(Document.uploaded_at.desc()).all()
    return [{"id": d.id, "file_name": d.file_name, "original_name": d.original_name,
             "category": d.category, "file_size": d.file_size, "uploaded_at": d.uploaded_at,
             "status": d.status} for d in docs]


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form(...),
    current_user: User = RequireApplicant,
    db: Session = Depends(get_db)
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename)[1]
    stored_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_name)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Mark any previous active doc of same category as replaced
    db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.category == category,
        Document.status == "ACTIVE"
    ).update({"status": "REPLACED"})

    doc = Document(
        user_id=current_user.id,
        file_name=stored_name,
        original_name=file.filename,
        category=category,
        file_path=file_path,
        file_size=len(content),
        mime_type=file.content_type,
        status="ACTIVE",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "file_name": doc.original_name, "category": doc.category,
            "uploaded_at": doc.uploaded_at}


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.status = "REPLACED"
    db.commit()
    return {"success": True}


# ---- Applications ----

@router.get("/applications")
def list_applications(status: Optional[str] = None, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    q = db.query(Application).filter(Application.applicant_id == current_user.id)
    if status:
        q = q.filter(Application.status == status.upper())
    apps = q.order_by(Application.updated_at.desc()).all()
    result = []
    for a in apps:
        sd = _get_section_data(a)
        project = sd.get("project", sd.get("innovation", sd.get("environment", {})))
        result.append({
            "id": a.id,
            "reference_id": a.reference_id,
            "status": a.status,
            "workflow_stage": a.workflow_stage,
            "grant_programme_name": a.grant_programme.name if a.grant_programme else None,
            "grant_programme_code": a.grant_programme.code if a.grant_programme else None,
            "project_title": project.get("project_title") or project.get("title"),
            "submitted_at": a.submitted_at,
            "updated_at": a.updated_at,
        })
    return result


@router.post("/applications")
def create_application(data: ApplicationCreate, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    programme = db.query(GrantProgramme).filter(GrantProgramme.id == data.grant_programme_id).first()
    if not programme:
        raise HTTPException(status_code=404, detail="Grant programme not found")

    ref_id = _generate_reference_id(programme.code, db)
    app = Application(
        reference_id=ref_id,
        applicant_id=current_user.id,
        grant_programme_id=data.grant_programme_id,
        status="DRAFT",
        workflow_stage="Draft",
        section_data=json.dumps(data.section_data or {}),
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return {"id": app.id, "reference_id": app.reference_id, "status": app.status}


@router.get("/applications/{app_id}")
def get_application(app_id: int, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.applicant_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    sd = _get_section_data(app)
    return {
        "id": app.id,
        "reference_id": app.reference_id,
        "status": app.status,
        "workflow_stage": app.workflow_stage,
        "section_data": sd,
        "locked": app.locked,
        "submitted_at": app.submitted_at,
        "updated_at": app.updated_at,
        "grant_programme_id": app.grant_programme_id,
        "grant_programme_name": app.grant_programme.name if app.grant_programme else None,
        "grant_programme_code": app.grant_programme.code if app.grant_programme else None,
    }


@router.put("/applications/{app_id}")
def update_application(app_id: int, data: ApplicationUpdate,
                        current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.applicant_id == current_user.id,
        Application.locked == False
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found or locked")
    app.section_data = json.dumps(data.section_data)
    db.commit()
    return {"success": True, "last_saved": datetime.now(timezone.utc)}


@router.post("/applications/{app_id}/submit")
def submit_application(app_id: int, background_tasks: BackgroundTasks,
                        current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.applicant_id == current_user.id,
        Application.locked == False
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found or already submitted")

    app.status = "SUBMITTED"
    app.workflow_stage = "Submitted"
    app.locked = True
    app.submitted_at = datetime.now(timezone.utc)

    notif_service.notify_application_submitted(db, current_user.id, app.reference_id)
    audit_service.log_action(db, current_user.id, current_user.email, "APPLICATION_SUBMITTED",
                              "Application", str(app.id), {"reference_id": app.reference_id})
    db.commit()

    # Background: run AI eligibility screening
    background_tasks.add_task(_run_screening_background, app_id)

    return {"success": True, "reference_id": app.reference_id, "status": app.status}


def _run_screening_background(app_id: int):
    """Background task: run eligibility checks and generate screening report"""
    from app.database import SessionLocal
    from app.services.eligibility import run_hard_eligibility_checks
    from app.services.ai_service import run_eligibility_screening

    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            return

        app.status = "SCREENING"
        app.workflow_stage = "Eligibility Screening"
        db.flush()

        sd = json.loads(app.section_data or "{}")
        grant_code = app.grant_programme.code if app.grant_programme else "CDG"

        # Hard rules
        hard_results = run_hard_eligibility_checks(grant_code, sd)
        hard_failures = [r for r in hard_results if r["result"] == "FAIL"]

        # AI soft checks
        ai_result = run_eligibility_screening(sd, grant_code)

        # Determine outcome
        if hard_failures:
            outcome = "INELIGIBLE"
            app.status = "INELIGIBLE"
            app.workflow_stage = "Ineligible"
        else:
            outcome = ai_result.get("recommended_outcome", "ELIGIBLE")
            app.status = "ELIGIBLE" if outcome in ("ELIGIBLE", "REVIEW_NEEDED") else "INELIGIBLE"
            app.workflow_stage = "Eligible — Awaiting Review" if app.status == "ELIGIBLE" else "Ineligible"

        # Save screening report
        report = ScreeningReport(
            application_id=app_id,
            hard_check_results=json.dumps(hard_results),
            ai_flags=json.dumps(ai_result.get("flags", [])),
            thematic_alignment_score=ai_result.get("thematic_alignment_score"),
            narrative_quality_score=ai_result.get("narrative_quality_score"),
            recommended_outcome=outcome,
        )
        db.add(report)

        notif_service.notify_screening_complete(db, app.applicant_id, app.reference_id, app.status == "ELIGIBLE")
        db.commit()
    except Exception as e:
        db.rollback()
        import logging
        logging.getLogger(__name__).error(f"Screening background task failed: {e}")
    finally:
        db.close()


# ---- Grants (active) ----

@router.get("/grants")
def list_grants(current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    awards = db.query(GrantAward).join(Application).filter(
        Application.applicant_id == current_user.id,
        GrantAward.decision == "APPROVED"
    ).all()
    result = []
    for award in awards:
        app = award.application
        sd = _get_section_data(app)
        project = sd.get("project", sd.get("innovation", sd.get("environment", {})))
        tranches = db.query(DisbursementTranche).filter(DisbursementTranche.grant_award_id == award.id).all()
        result.append({
            "id": award.id,
            "application_id": app.id,
            "reference_id": app.reference_id,
            "programme_name": app.grant_programme.name if app.grant_programme else None,
            "project_title": project.get("project_title"),
            "award_amount": award.award_amount,
            "status": app.status,
            "workflow_stage": app.workflow_stage,
            "decided_at": award.decided_at,
            "agreement_acknowledged_at": award.agreement_acknowledged_at,
            "tranches": [{"id": t.id, "label": t.label, "amount_inr": t.amount_inr,
                          "status": t.status, "disbursed_at": t.disbursed_at} for t in tranches],
        })
    return result


@router.post("/grants/{award_id}/acknowledge-agreement")
def acknowledge_agreement(award_id: int, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    award = db.query(GrantAward).join(Application).filter(
        GrantAward.id == award_id,
        Application.applicant_id == current_user.id
    ).first()
    if not award:
        raise HTTPException(status_code=404, detail="Grant award not found")
    award.agreement_acknowledged_at = datetime.now(timezone.utc)
    award.application.status = "ACTIVE"
    award.application.workflow_stage = "Active Grant"
    db.commit()
    return {"success": True}


@router.post("/grants/{award_id}/reports")
def submit_report(award_id: int, data: ReportSubmitRequest,
                  background_tasks: BackgroundTasks,
                  current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    award = db.query(GrantAward).join(Application).filter(
        GrantAward.id == award_id,
        Application.applicant_id == current_user.id
    ).first()
    if not award:
        raise HTTPException(status_code=404, detail="Grant award not found")

    report = ProgressReport(
        grant_award_id=award_id,
        report_type=data.report_type,
        report_data=json.dumps(data.report_data),
        status="SUBMITTED",
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    background_tasks.add_task(_run_compliance_analysis, report.id, award_id)
    return {"success": True, "report_id": report.id}


def _run_compliance_analysis(report_id: int, award_id: int):
    """Background: run AI compliance analysis on report"""
    from app.database import SessionLocal
    from app.services.ai_service import analyze_compliance
    from app.models.report import ComplianceAnalysis
    import json

    db = SessionLocal()
    try:
        report = db.query(ProgressReport).filter(ProgressReport.id == report_id).first()
        award = db.query(GrantAward).filter(GrantAward.id == award_id).first()
        if not report or not award:
            return

        report_data = json.loads(report.report_data or "{}")
        app_sd = json.loads(award.application.section_data or "{}")
        budget = app_sd.get("budget", {})

        analysis = analyze_compliance(report_data, app_sd, budget)
        ca = ComplianceAnalysis(
            report_id=report_id,
            content_rating=analysis.get("content_rating", "SATISFACTORY"),
            flags=json.dumps(analysis.get("content_flags", []) + analysis.get("financial_flags", [])),
            recommended_action=analysis.get("overall_recommendation", ""),
            financial_summary=json.dumps({
                "underspend_alert": analysis.get("underspend_alert", False)
            }),
        )
        db.add(ca)
        db.commit()
    except Exception as e:
        db.rollback()
        import logging
        logging.getLogger(__name__).error(f"Compliance analysis failed: {e}")
    finally:
        db.close()


@router.post("/grants/{award_id}/expenditures")
def submit_expenditure(award_id: int, data: ExpenditureRecordCreate,
                        current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    award = db.query(GrantAward).join(Application).filter(
        GrantAward.id == award_id,
        Application.applicant_id == current_user.id
    ).first()
    if not award:
        raise HTTPException(status_code=404, detail="Grant award not found")

    rec = ExpenditureRecord(
        grant_award_id=award_id,
        date=data.date,
        payee=data.payee,
        amount_inr=data.amount_inr,
        budget_category=data.budget_category,
        description=data.description,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"success": True, "expenditure_id": rec.id}


# ---- Messages ----

@router.get("/messages")
def list_message_threads(current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    threads = (db.query(MessageThread)
               .join(Application)
               .filter(Application.applicant_id == current_user.id)
               .all())
    result = []
    for t in threads:
        last_msg = (db.query(Message)
                    .filter(Message.thread_id == t.id, Message.is_internal_note == False)
                    .order_by(Message.created_at.desc()).first())
        app = t.application
        sd = _get_section_data(app)
        project = sd.get("project", sd.get("innovation", sd.get("environment", {})))
        result.append({
            "id": t.id,
            "application_id": app.id,
            "application_reference": app.reference_id,
            "project_title": project.get("project_title"),
            "last_message": last_msg.content[:100] if last_msg else None,
            "last_updated": last_msg.created_at if last_msg else t.created_at,
        })
    return result


@router.get("/messages/{thread_id}")
def get_thread_messages(thread_id: int, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    thread = (db.query(MessageThread)
              .join(Application)
              .filter(MessageThread.id == thread_id, Application.applicant_id == current_user.id)
              .first())
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    messages = (db.query(Message)
                .filter(Message.thread_id == thread_id, Message.is_internal_note == False)
                .order_by(Message.created_at).all())
    return [{"id": m.id, "sender_name": m.sender.full_name, "sender_role": m.sender.role,
             "content": m.content, "created_at": m.created_at} for m in messages]


@router.post("/messages/{thread_id}/reply")
def reply_to_thread(thread_id: int, data: MessageSendRequest,
                     current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    thread = (db.query(MessageThread)
              .join(Application)
              .filter(MessageThread.id == thread_id, Application.applicant_id == current_user.id)
              .first())
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    msg = Message(thread_id=thread_id, sender_id=current_user.id, content=data.content, is_internal_note=False)
    db.add(msg)
    db.commit()
    return {"success": True, "message_id": msg.id}


# ---- Notifications ----

@router.get("/notifications")
def get_notifications(current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    notifs = (db.query(Notification)
              .filter(Notification.user_id == current_user.id)
              .order_by(Notification.created_at.desc())
              .limit(50).all())
    return [{"id": n.id, "type": n.type, "title": n.title, "content": n.content,
             "is_read": n.is_read, "created_at": n.created_at} for n in notifs]


@router.post("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, current_user: User = RequireApplicant, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(
        Notification.id == notif_id, Notification.user_id == current_user.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"success": True}


# ---- Chatbot ----

@router.post("/chatbot")
def chatbot(data: ChatbotMessageRequest, current_user: User = RequireApplicant):
    from app.services.ai_service import chatbot_message
    result = chatbot_message(data.conversation_history, data.grant_type, data.current_section)
    return result
