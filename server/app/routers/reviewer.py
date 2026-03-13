import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.application import Application
from app.models.review import ReviewAssignment, ReviewPackage, Review
from app.schemas.review import ReviewSaveRequest, ReviewSubmitRequest

router = APIRouter(prefix="/api/reviewer", tags=["reviewer"])
RequireReviewer = Depends(require_role("REVIEWER"))


@router.get("/dashboard/stats")
def dashboard_stats(current_user: User = RequireReviewer, db: Session = Depends(get_db)):
    pending = db.query(ReviewAssignment).filter(
        ReviewAssignment.reviewer_id == current_user.id,
        ReviewAssignment.status == "PENDING"
    ).count()
    completed = db.query(ReviewAssignment).filter(
        ReviewAssignment.reviewer_id == current_user.id,
        ReviewAssignment.status == "SUBMITTED"
    ).count()
    return {"pending_reviews": pending, "completed_reviews": completed}


@router.get("/reviews")
def list_reviews(current_user: User = RequireReviewer, db: Session = Depends(get_db)):
    assignments = db.query(ReviewAssignment).filter(
        ReviewAssignment.reviewer_id == current_user.id
    ).order_by(ReviewAssignment.created_at.desc()).all()

    result = []
    for a in assignments:
        app = a.application
        sd = {}
        try:
            sd = json.loads(app.section_data or "{}")
        except Exception:
            pass
        org = sd.get("organisation", {})
        project = sd.get("project", sd.get("innovation", sd.get("environment", {})))

        # Count risk flags from review package
        pkg = db.query(ReviewPackage).filter(ReviewPackage.application_id == app.id).first()
        risk_count = 0
        if pkg:
            try:
                risk_count = len(json.loads(pkg.risk_flags or "[]"))
            except Exception:
                pass

        result.append({
            "assignment_id": a.id,
            "application_id": app.id,
            "reference_id": app.reference_id,
            "organisation_name": org.get("legal_name"),
            "grant_type": app.grant_programme.code if app.grant_programme else None,
            "project_title": project.get("project_title") or project.get("title"),
            "status": a.status,
            "deadline": a.deadline,
            "risk_flags": risk_count,
            "ai_package_ready": pkg is not None,
        })
    return result


@router.get("/reviews/{assignment_id}")
def get_review_workspace(assignment_id: int, current_user: User = RequireReviewer, db: Session = Depends(get_db)):
    assignment = db.query(ReviewAssignment).filter(
        ReviewAssignment.id == assignment_id,
        ReviewAssignment.reviewer_id == current_user.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Review assignment not found")

    app = assignment.application
    sd = {}
    try:
        sd = json.loads(app.section_data or "{}")
    except Exception:
        pass

    # Get AI review package
    pkg = db.query(ReviewPackage).filter(ReviewPackage.application_id == app.id).first()
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

    # Get existing draft review
    existing_review = db.query(Review).filter(Review.assignment_id == assignment_id).first()
    existing_scores = {}
    if existing_review:
        try:
            existing_scores = json.loads(existing_review.scores or "{}")
        except Exception:
            pass

    # Get scoring rubric
    rubric = []
    if app.grant_programme and app.grant_programme.scoring_rubric:
        try:
            rubric = json.loads(app.grant_programme.scoring_rubric)
        except Exception:
            pass

    return {
        "assignment_id": assignment_id,
        "application": {
            "id": app.id,
            "reference_id": app.reference_id,
            "status": app.status,
            "section_data": sd,
            "grant_type": app.grant_programme.code if app.grant_programme else None,
            "grant_programme_name": app.grant_programme.name if app.grant_programme else None,
        },
        "ai_review_package": pkg_data,
        "scoring_rubric": rubric,
        "existing_scores": existing_scores,
        "review_status": assignment.status,
    }


@router.put("/reviews/{assignment_id}/save")
def save_review_draft(assignment_id: int, data: ReviewSaveRequest,
                       current_user: User = RequireReviewer, db: Session = Depends(get_db)):
    assignment = db.query(ReviewAssignment).filter(
        ReviewAssignment.id == assignment_id,
        ReviewAssignment.reviewer_id == current_user.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    review = db.query(Review).filter(Review.assignment_id == assignment_id).first()
    if not review:
        review = Review(
            assignment_id=assignment_id,
            application_id=assignment.application_id,
            reviewer_id=current_user.id,
            status="DRAFT",
        )
        db.add(review)

    review.scores = json.dumps(data.scores)
    review.overall_comment = data.overall_comment
    review.highlights = json.dumps(data.highlights or [])
    db.commit()
    return {"success": True, "last_saved": datetime.now(timezone.utc)}


@router.post("/reviews/{assignment_id}/submit")
def submit_review(assignment_id: int, data: ReviewSubmitRequest,
                   current_user: User = RequireReviewer, db: Session = Depends(get_db)):
    assignment = db.query(ReviewAssignment).filter(
        ReviewAssignment.id == assignment_id,
        ReviewAssignment.reviewer_id == current_user.id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.status == "SUBMITTED":
        raise HTTPException(status_code=400, detail="Review already submitted")

    # Compute composite score
    rubric = []
    app = assignment.application
    if app.grant_programme and app.grant_programme.scoring_rubric:
        try:
            rubric = json.loads(app.grant_programme.scoring_rubric)
        except Exception:
            pass

    composite = 0.0
    if rubric and data.scores:
        for dim in rubric:
            dim_name = dim.get("dimension", "")
            weight = dim.get("weight", 0) / 100
            score_entry = data.scores.get(dim_name, {})
            score = score_entry.get("reviewer_score", score_entry.get("score", 3))
            composite += float(score) * weight
    elif data.scores:
        scores_list = [v.get("reviewer_score", v.get("score", 3)) if isinstance(v, dict) else v
                       for v in data.scores.values()]
        composite = sum(scores_list) / len(scores_list) if scores_list else 0

    review = db.query(Review).filter(Review.assignment_id == assignment_id).first()
    if not review:
        review = Review(assignment_id=assignment_id, application_id=assignment.application_id,
                        reviewer_id=current_user.id)
        db.add(review)

    review.scores = json.dumps(data.scores)
    review.composite_score = round(composite, 2)
    review.overall_comment = data.overall_comment
    review.highlights = json.dumps(data.highlights or [])
    review.status = "SUBMITTED"
    review.submitted_at = datetime.now(timezone.utc)
    assignment.status = "SUBMITTED"

    # Check if all reviewers submitted → advance application status
    all_assignments = db.query(ReviewAssignment).filter(ReviewAssignment.application_id == assignment.application_id).all()
    all_submitted = all(a.status == "SUBMITTED" for a in all_assignments)
    if all_submitted:
        app.status = "REVIEW_COMPLETE"
        app.workflow_stage = "Review Complete — Decision Pending"

    db.commit()
    return {"success": True, "composite_score": review.composite_score}
