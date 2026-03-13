"""Create notification records for users"""
from sqlalchemy.orm import Session
from app.models.notification import Notification


def create_notification(db: Session, user_id: int, type: str, title: str,
                         content: str = "", link: str = "") -> Notification:
    n = Notification(
        user_id=user_id,
        type=type,
        title=title,
        content=content,
        link=link,
    )
    db.add(n)
    db.flush()
    return n


def notify_application_submitted(db: Session, applicant_id: int, reference_id: str):
    create_notification(
        db, applicant_id,
        "APPLICATION_SUBMITTED",
        "Application Submitted Successfully",
        f"Your application {reference_id} has been submitted and is now under eligibility screening.",
        f"/applicant/applications"
    )


def notify_screening_complete(db: Session, applicant_id: int, reference_id: str, eligible: bool):
    if eligible:
        create_notification(
            db, applicant_id,
            "SCREENING_ELIGIBLE",
            "Application Passed Screening",
            f"Your application {reference_id} has passed initial screening and will now be reviewed by our team.",
            "/applicant/applications"
        )
    else:
        create_notification(
            db, applicant_id,
            "SCREENING_INELIGIBLE",
            "Application Did Not Pass Screening",
            f"Your application {reference_id} did not meet eligibility criteria. Please check the details in your application.",
            "/applicant/applications"
        )


def notify_reviewer_assigned(db: Session, reviewer_id: int, application_reference: str):
    create_notification(
        db, reviewer_id,
        "REVIEW_ASSIGNED",
        "New Application Assigned for Review",
        f"Application {application_reference} has been assigned to you for review.",
        "/reviewer/reviews"
    )


def notify_award_decision(db: Session, applicant_id: int, reference_id: str, decision: str):
    if decision == "APPROVED":
        create_notification(
            db, applicant_id,
            "AWARD_APPROVED",
            "Grant Application Approved!",
            f"Congratulations! Your application {reference_id} has been approved. Please check your portal for the grant agreement.",
            "/applicant/grants"
        )
    elif decision == "REJECTED":
        create_notification(
            db, applicant_id,
            "APPLICATION_REJECTED",
            "Grant Application Not Selected",
            f"We regret to inform you that your application {reference_id} was not selected in this cycle.",
            "/applicant/applications"
        )
    elif decision == "WAITLISTED":
        create_notification(
            db, applicant_id,
            "APPLICATION_WAITLISTED",
            "Application Waitlisted",
            f"Your application {reference_id} has been waitlisted. You will be notified if a spot becomes available.",
            "/applicant/applications"
        )


def notify_agreement_sent(db: Session, applicant_id: int, reference_id: str):
    create_notification(
        db, applicant_id,
        "AGREEMENT_SENT",
        "Grant Agreement Ready for Acknowledgement",
        f"The grant agreement for {reference_id} has been sent. Please review and acknowledge it in your portal.",
        "/applicant/grants"
    )


def notify_tranche_disbursed(db: Session, applicant_id: int, amount: float, label: str):
    create_notification(
        db, applicant_id,
        "TRANCHE_DISBURSED",
        f"Disbursement Processed: {label}",
        f"A disbursement of INR {amount:,.0f} ({label}) has been processed to your registered bank account.",
        "/applicant/grants"
    )


def notify_new_message(db: Session, recipient_id: int, sender_name: str, application_ref: str):
    create_notification(
        db, recipient_id,
        "NEW_MESSAGE",
        f"New Message from {sender_name}",
        f"You have received a new message regarding application {application_ref}.",
        "/applicant/messages"
    )


def notify_report_approved(db: Session, applicant_id: int, report_type: str):
    create_notification(
        db, applicant_id,
        "REPORT_APPROVED",
        "Progress Report Approved",
        f"Your {report_type} report has been approved. The next disbursement tranche will be processed shortly.",
        "/applicant/grants"
    )
