import json
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.application import Application
from app.models.screening import ScreeningReport
from app.models.review import ReviewAssignment, ReviewPackage, Review
from app.models.award import GrantAward
from app.models.disbursement import DisbursementTranche
from app.models.report import ProgressReport, ComplianceAnalysis
from app.models.message import MessageThread, Message
from app.schemas.application import ScreeningDecisionRequest, AssignReviewersRequest, AwardDecisionRequest
from app.schemas.report import MessageSendRequest, ReportReviewRequest
from app.services import audit as audit_service
from app.services import notifications as notif_service

router = APIRouter(prefix="/api/officer", tags=["officer"])
RequireOfficer = Depends(require_role("OFFICER"))


def _get_sd(app: Application) -> dict:
    try:
        return json.loads(app.section_data or "{}")
    except Exception:
        return {}


@router.get("/dashboard/stats")
def dashboard_stats(current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    pending_screening = db.query(Application).filter(Application.status.in_(["SUBMITTED", "SCREENING"])).count()
    eligible = db.query(Application).filter(Application.status == "ELIGIBLE").count()
    review_complete = db.query(Application).filter(Application.status.in_(["REVIEW_COMPLETE", "DECISION_PENDING"])).count()
    active = db.query(Application).filter(Application.status == "ACTIVE").count()
    reports_pending = db.query(ProgressReport).filter(ProgressReport.status == "SUBMITTED").count()
    return {
        "pending_screening": pending_screening,
        "pending_review_assignment": eligible,
        "pending_award_decision": review_complete,
        "active_grants": active,
        "reports_pending_review": reports_pending,
    }


@router.get("/applications")
def list_applications(
    status: Optional[str] = None,
    search: Optional[str] = None,
    grant_type: Optional[str] = None,
    current_user: User = RequireOfficer,
    db: Session = Depends(get_db)
):
    q = db.query(Application)
    if status:
        q = q.filter(Application.status == status.upper())
    if grant_type:
        from app.models.grant_programme import GrantProgramme
        q = q.join(GrantProgramme).filter(GrantProgramme.code == grant_type.upper())
    apps = q.order_by(Application.updated_at.desc()).all()

    result = []
    for a in apps:
        sd = _get_sd(a)
        project = sd.get("project", sd.get("innovation", sd.get("environment", {})))
        org = sd.get("organisation", {})
        if search:
            search_lower = search.lower()
            combined = f"{a.reference_id} {org.get('legal_name', '')} {project.get('project_title', '')}".lower()
            if search_lower not in combined:
                continue
        result.append({
            "id": a.id,
            "reference_id": a.reference_id,
            "status": a.status,
            "workflow_stage": a.workflow_stage,
            "grant_programme_code": a.grant_programme.code if a.grant_programme else None,
            "grant_programme_name": a.grant_programme.name if a.grant_programme else None,
            "organisation_name": org.get("legal_name"),
            "project_title": project.get("project_title") or project.get("title"),
            "applicant_email": a.applicant.email if a.applicant else None,
            "submitted_at": a.submitted_at,
            "updated_at": a.updated_at,
        })
    return result


@router.get("/applications/{app_id}")
def get_application_detail(app_id: int, current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    sd = _get_sd(app)
    screening = db.query(ScreeningReport).filter(ScreeningReport.application_id == app_id).first()
    reviews = db.query(Review).filter(Review.application_id == app_id, Review.status == "SUBMITTED").all()

    screening_data = None
    if screening:
        try:
            hard_results = json.loads(screening.hard_check_results or "[]")
            ai_flags = json.loads(screening.ai_flags or "[]")
        except Exception:
            hard_results, ai_flags = [], []
        screening_data = {
            "hard_check_results": hard_results,
            "ai_flags": ai_flags,
            "thematic_alignment_score": screening.thematic_alignment_score,
            "narrative_quality_score": screening.narrative_quality_score,
            "recommended_outcome": screening.recommended_outcome,
            "officer_decision": screening.officer_decision,
            "officer_notes": screening.officer_notes,
        }

    review_data = []
    for r in reviews:
        try:
            scores = json.loads(r.scores or "{}")
        except Exception:
            scores = {}
        review_data.append({
            "reviewer_name": r.reviewer.full_name,
            "reviewer_email": r.reviewer.email,
            "scores": scores,
            "composite_score": r.composite_score,
            "overall_comment": r.overall_comment,
            "submitted_at": r.submitted_at,
        })

    # Get AI review package
    pkg = db.query(ReviewPackage).filter(ReviewPackage.application_id == app_id).first()
    pkg_data = None
    if pkg:
        try:
            pkg_data = {
                "summary_text": pkg.summary_text,
                "suggested_scores": json.loads(pkg.suggested_scores or "{}"),
                "risk_flags": json.loads(pkg.risk_flags or "[]"),
            }
        except Exception:
            pass

    return {
        "id": app.id,
        "reference_id": app.reference_id,
        "status": app.status,
        "workflow_stage": app.workflow_stage,
        "section_data": sd,
        "grant_programme_code": app.grant_programme.code if app.grant_programme else None,
        "grant_programme_name": app.grant_programme.name if app.grant_programme else None,
        "applicant_email": app.applicant.email if app.applicant else None,
        "submitted_at": app.submitted_at,
        "screening_report": screening_data,
        "reviews": review_data,
        "ai_review_package": pkg_data,
    }


@router.post("/applications/{app_id}/screening-decision")
def make_screening_decision(app_id: int, data: ScreeningDecisionRequest,
                             current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    screening = db.query(ScreeningReport).filter(ScreeningReport.application_id == app_id).first()
    if not screening:
        screening = ScreeningReport(application_id=app_id, hard_check_results="[]", ai_flags="[]")
        db.add(screening)

    screening.officer_decision = data.decision
    screening.officer_notes = data.notes
    screening.officer_id = current_user.id
    screening.decided_at = datetime.now(timezone.utc)

    if data.decision == "CONFIRM_ELIGIBLE":
        app.status = "ELIGIBLE"
        app.workflow_stage = "Eligible — Awaiting Review Assignment"
        notif_service.notify_screening_complete(db, app.applicant_id, app.reference_id, True)
    elif data.decision == "OVERRIDE_INELIGIBLE":
        if not data.notes:
            raise HTTPException(status_code=400, detail="Written reason required for ineligibility override")
        app.status = "INELIGIBLE"
        app.workflow_stage = "Ineligible"
        notif_service.notify_screening_complete(db, app.applicant_id, app.reference_id, False)
    elif data.decision == "CLARIFICATION":
        # Create message thread if needed
        thread = db.query(MessageThread).filter(MessageThread.application_id == app_id).first()
        if not thread:
            thread = MessageThread(application_id=app_id)
            db.add(thread)
            db.flush()
        msg = Message(thread_id=thread.id, sender_id=current_user.id, content=data.notes or "Clarification requested", is_internal_note=False)
        db.add(msg)

    audit_service.log_action(db, current_user.id, current_user.email, "SCREENING_DECISION",
                              "Application", str(app_id), {"decision": data.decision})
    db.commit()
    return {"success": True, "new_status": app.status}


@router.get("/applications/{app_id}/reviewers")
def get_available_reviewers(app_id: int, current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    applicant_domain = app.applicant.email.split("@")[1] if app.applicant else ""
    reviewers = db.query(User).filter(User.role == "REVIEWER", User.is_active == True).all()

    result = []
    for r in reviewers:
        reviewer_domain = r.email.split("@")[1]
        conflict = reviewer_domain == applicant_domain
        result.append({
            "id": r.id,
            "full_name": r.full_name,
            "email": r.email,
            "has_conflict": conflict,
        })
    return result


@router.post("/applications/{app_id}/assign-reviewers")
def assign_reviewers(app_id: int, data: AssignReviewersRequest,
                      current_user: User = RequireOfficer, db: Session = Depends(get_db),
                      background_tasks: BackgroundTasks = BackgroundTasks()):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    grant_code = app.grant_programme.code if app.grant_programme else "CDG"
    required = 2 if grant_code == "EIG" else 1
    if len(data.reviewer_ids) < required:
        raise HTTPException(status_code=400, detail=f"{grant_code} requires {required} reviewer(s)")

    # Check conflicts
    applicant_domain = app.applicant.email.split("@")[1] if app.applicant else ""
    deadline = data.deadline or (datetime.now(timezone.utc) + timedelta(days=7 if grant_code != "EIG" else 10))

    for reviewer_id in data.reviewer_ids:
        reviewer = db.query(User).filter(User.id == reviewer_id, User.role == "REVIEWER").first()
        if not reviewer:
            raise HTTPException(status_code=404, detail=f"Reviewer {reviewer_id} not found")
        if reviewer.email.split("@")[1] == applicant_domain:
            raise HTTPException(status_code=400, detail=f"Reviewer {reviewer.email} has conflict of interest")

        # Remove existing assignment if any
        db.query(ReviewAssignment).filter(
            ReviewAssignment.application_id == app_id,
            ReviewAssignment.reviewer_id == reviewer_id
        ).delete()

        assignment = ReviewAssignment(
            application_id=app_id,
            reviewer_id=reviewer_id,
            assigned_by_id=current_user.id,
            deadline=deadline,
            status="PENDING",
        )
        db.add(assignment)
        notif_service.notify_reviewer_assigned(db, reviewer_id, app.reference_id)

    app.status = "UNDER_REVIEW"
    app.workflow_stage = "Under Review"
    audit_service.log_action(db, current_user.id, current_user.email, "REVIEWERS_ASSIGNED",
                              "Application", str(app_id), {"reviewer_ids": data.reviewer_ids})
    db.commit()

    # Background: generate AI review package
    background_tasks.add_task(_generate_review_package_bg, app_id)

    return {"success": True}


def _generate_review_package_bg(app_id: int):
    from app.database import SessionLocal
    from app.services.ai_service import generate_review_package

    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            return

        # Don't regenerate if already exists
        existing = db.query(ReviewPackage).filter(ReviewPackage.application_id == app_id).first()
        if existing:
            return

        sd = json.loads(app.section_data or "{}")
        grant_code = app.grant_programme.code if app.grant_programme else "CDG"

        rubric = []
        if app.grant_programme and app.grant_programme.scoring_rubric:
            try:
                rubric = json.loads(app.grant_programme.scoring_rubric)
            except Exception:
                pass

        pkg_data = generate_review_package(sd, grant_code, rubric)
        pkg = ReviewPackage(
            application_id=app_id,
            summary_text=pkg_data.get("summary", ""),
            suggested_scores=json.dumps(pkg_data.get("suggested_scores", {})),
            risk_flags=json.dumps(pkg_data.get("risk_flags", [])),
        )
        db.add(pkg)
        db.commit()
    except Exception as e:
        db.rollback()
        import logging
        logging.getLogger(__name__).error(f"Review package generation failed: {e}")
    finally:
        db.close()


@router.get("/applications/{app_id}/reviews")
def get_application_reviews(app_id: int, current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.application_id == app_id).all()
    result = []
    for r in reviews:
        try:
            scores = json.loads(r.scores or "{}")
        except Exception:
            scores = {}
        result.append({
            "id": r.id,
            "reviewer_name": r.reviewer.full_name,
            "reviewer_email": r.reviewer.email,
            "status": r.status,
            "scores": scores,
            "composite_score": r.composite_score,
            "overall_comment": r.overall_comment,
            "submitted_at": r.submitted_at,
        })
    return result


@router.post("/applications/{app_id}/award-decision")
def make_award_decision(app_id: int, data: AwardDecisionRequest,
                         current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Create award record
    award = GrantAward(
        application_id=app_id,
        decision=data.decision,
        reason=data.reason,
        award_amount=data.award_amount,
        decided_by_id=current_user.id,
        special_conditions=data.special_conditions,
    )
    db.add(award)
    db.flush()

    app.status = data.decision
    app.workflow_stage = {"APPROVED": "Approved", "REJECTED": "Rejected", "WAITLISTED": "Waitlisted"}.get(data.decision, data.decision)

    if data.decision == "APPROVED" and data.award_amount:
        # Create default tranches for CDG/ECAG
        grant_code = app.grant_programme.code if app.grant_programme else "CDG"
        if grant_code in ("CDG", "ECAG"):
            inception_pct = 0.40
            mid_pct = 0.40
            final_pct = 0.20
            db.add(DisbursementTranche(grant_award_id=award.id, label="Inception Tranche",
                                       amount_inr=data.award_amount * inception_pct,
                                       tranche_type="INCEPTION", trigger_condition="On agreement acknowledgement", status="PENDING"))
            db.add(DisbursementTranche(grant_award_id=award.id, label="Mid-Project Tranche",
                                       amount_inr=data.award_amount * mid_pct,
                                       tranche_type="MID_PROJECT", trigger_condition="On 6-month report approval", status="PENDING"))
            db.add(DisbursementTranche(grant_award_id=award.id, label="Final Tranche",
                                       amount_inr=data.award_amount * final_pct,
                                       tranche_type="FINAL", trigger_condition="On final report approval", status="PENDING"))
        elif grant_code == "EIG":
            db.add(DisbursementTranche(grant_award_id=award.id, label="Inception Tranche",
                                       amount_inr=data.award_amount * 0.30, tranche_type="INCEPTION",
                                       trigger_condition="On agreement acknowledgement", status="PENDING"))
            db.add(DisbursementTranche(grant_award_id=award.id, label="Milestone 1 Tranche",
                                       amount_inr=data.award_amount * 0.40, tranche_type="MILESTONE",
                                       trigger_condition="On Milestone 1 approval", status="PENDING"))
            db.add(DisbursementTranche(grant_award_id=award.id, label="Final Tranche",
                                       amount_inr=data.award_amount * 0.30, tranche_type="FINAL",
                                       trigger_condition="On final report approval", status="PENDING"))

    notif_service.notify_award_decision(db, app.applicant_id, app.reference_id, data.decision)
    audit_service.log_action(db, current_user.id, current_user.email, "AWARD_DECISION",
                              "Application", str(app_id), {"decision": data.decision, "amount": data.award_amount})
    db.commit()
    return {"success": True, "award_id": award.id}


@router.post("/applications/{app_id}/send-agreement")
def send_agreement(app_id: int, current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app or app.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Application must be in APPROVED status")
    award = db.query(GrantAward).filter(GrantAward.application_id == app_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="No award found")
    award.agreement_sent_at = datetime.now(timezone.utc)
    app.status = "AGREEMENT_SENT"
    app.workflow_stage = "Agreement Sent"
    notif_service.notify_agreement_sent(db, app.applicant_id, app.reference_id)
    db.commit()
    return {"success": True}


@router.get("/applications/{app_id}/generate-agreement")
def generate_agreement(app_id: int, current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    """Generate agreement text with merge fields"""
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    sd = json.loads(app.section_data or "{}")
    org = sd.get("organisation", {})
    project = sd.get("project", sd.get("innovation", sd.get("environment", {})))
    award = db.query(GrantAward).filter(GrantAward.application_id == app_id).first()

    tranches = []
    if award:
        for t in db.query(DisbursementTranche).filter(DisbursementTranche.grant_award_id == award.id).all():
            tranches.append({"label": t.label, "amount": t.amount_inr, "trigger": t.trigger_condition})

    return {
        "grantee_organisation_name": org.get("legal_name"),
        "grantee_registration_number": org.get("registration_number"),
        "project_title": project.get("project_title"),
        "grant_reference": app.reference_id,
        "programme_name": app.grant_programme.name if app.grant_programme else None,
        "award_amount": award.award_amount if award else None,
        "start_date": project.get("project_start_date"),
        "end_date": project.get("project_end_date"),
        "special_conditions": award.special_conditions if award else None,
        "disbursement_schedule": tranches,
        "program_officer_name": current_user.full_name,
        "program_officer_email": current_user.email,
    }


@router.get("/grants")
def list_all_grants(current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    awards = db.query(GrantAward).filter(GrantAward.decision == "APPROVED").all()
    result = []
    for award in awards:
        app = award.application
        sd = json.loads(app.section_data or "{}")
        org = sd.get("organisation", {})
        project = sd.get("project", sd.get("innovation", sd.get("environment", {})))
        result.append({
            "award_id": award.id,
            "reference_id": app.reference_id,
            "organisation_name": org.get("legal_name"),
            "project_title": project.get("project_title"),
            "award_amount": award.award_amount,
            "status": app.status,
            "workflow_stage": app.workflow_stage,
            "decided_at": award.decided_at,
        })
    return result


@router.get("/reports")
def list_reports(current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    reports = (db.query(ProgressReport)
               .filter(ProgressReport.status == "SUBMITTED")
               .order_by(ProgressReport.submitted_at.desc()).all())
    result = []
    for r in reports:
        award = r.grant_award
        app = award.application if award else None
        org = {}
        if app:
            try:
                sd = json.loads(app.section_data or "{}")
                org = sd.get("organisation", {})
            except Exception:
                pass
        ca = db.query(ComplianceAnalysis).filter(ComplianceAnalysis.report_id == r.id).first()
        result.append({
            "id": r.id,
            "report_type": r.report_type,
            "status": r.status,
            "submitted_at": r.submitted_at,
            "reference_id": app.reference_id if app else None,
            "organisation_name": org.get("legal_name"),
            "compliance_rating": ca.content_rating if ca else None,
        })
    return result


@router.post("/reports/{report_id}/review")
def review_report(report_id: int, data: ReportReviewRequest,
                   current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    report = db.query(ProgressReport).filter(ProgressReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.reviewed_by_id = current_user.id
    report.reviewed_at = datetime.now(timezone.utc)
    report.reviewer_notes = data.notes

    if data.action == "APPROVE":
        report.status = "APPROVED"
        # Mark relevant tranche as READY
        if report.report_type in ("SIX_MONTH", "MID_POINT", "QUARTERLY"):
            tranche = (db.query(DisbursementTranche)
                       .filter(DisbursementTranche.grant_award_id == report.grant_award_id,
                               DisbursementTranche.tranche_type == "MID_PROJECT",
                               DisbursementTranche.status == "PENDING")
                       .first())
            if tranche:
                tranche.status = "READY"
        elif report.report_type == "FINAL":
            final_tranche = (db.query(DisbursementTranche)
                             .filter(DisbursementTranche.grant_award_id == report.grant_award_id,
                                     DisbursementTranche.tranche_type == "FINAL",
                                     DisbursementTranche.status == "PENDING")
                             .first())
            if final_tranche:
                final_tranche.status = "READY"
            # Close the grant
            if report.grant_award:
                report.grant_award.application.status = "CLOSED"
                report.grant_award.application.workflow_stage = "Closed"

        notif_service.notify_report_approved(db, report.grant_award.application.applicant_id, report.report_type)

    elif data.action == "COMPLIANCE_FLAG":
        report.compliance_action = data.compliance_action or "WARNING"

    db.commit()
    return {"success": True}


# ---- Messages ----

@router.get("/messages")
def list_all_threads(current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    threads = db.query(MessageThread).all()
    result = []
    for t in threads:
        last_msg = db.query(Message).filter(Message.thread_id == t.id).order_by(Message.created_at.desc()).first()
        app = t.application
        sd = {}
        if app:
            try:
                sd = json.loads(app.section_data or "{}")
            except Exception:
                pass
        org = sd.get("organisation", {})
        result.append({
            "id": t.id,
            "application_id": app.id if app else None,
            "application_reference": app.reference_id if app else None,
            "organisation_name": org.get("legal_name"),
            "last_message": last_msg.content[:100] if last_msg else None,
            "last_updated": last_msg.created_at if last_msg else t.created_at,
        })
    return result


@router.post("/messages/{app_id}/send")
def send_message(app_id: int, data: MessageSendRequest,
                  current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    thread = db.query(MessageThread).filter(MessageThread.application_id == app_id).first()
    if not thread:
        thread = MessageThread(application_id=app_id)
        db.add(thread)
        db.flush()

    msg = Message(thread_id=thread.id, sender_id=current_user.id,
                  content=data.content, is_internal_note=data.is_internal_note)
    db.add(msg)
    db.commit()
    return {"success": True, "message_id": msg.id}


@router.get("/messages/{app_id}/thread")
def get_app_thread(app_id: int, current_user: User = RequireOfficer, db: Session = Depends(get_db)):
    thread = db.query(MessageThread).filter(MessageThread.application_id == app_id).first()
    if not thread:
        return []
    messages = db.query(Message).filter(Message.thread_id == thread.id).order_by(Message.created_at).all()
    return [{"id": m.id, "sender_name": m.sender.full_name, "sender_role": m.sender.role,
             "content": m.content, "is_internal_note": m.is_internal_note,
             "created_at": m.created_at} for m in messages]
