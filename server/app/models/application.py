from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True)  # GF-CDG-2026-0001
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    grant_programme_id = Column(Integer, ForeignKey("grant_programmes.id"), nullable=False)

    # Status & workflow
    status = Column(String, default="DRAFT")
    # DRAFT, SUBMITTED, SCREENING, ELIGIBLE, INELIGIBLE,
    # UNDER_REVIEW, REVIEW_COMPLETE, DECISION_PENDING,
    # APPROVED, REJECTED, WAITLISTED, AGREEMENT_SENT, ACTIVE, REPORTING, CLOSED
    workflow_stage = Column(String, default="Draft")

    # Application data — all form sections stored as JSON
    section_data = Column(Text, default="{}")  # JSON

    # Lock after submission
    locked = Column(Boolean, default=False)

    # Timestamps
    submitted_at = Column(DateTime)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    applicant = relationship("User", back_populates="applications", foreign_keys=[applicant_id])
    grant_programme = relationship("GrantProgramme", back_populates="applications")
    screening_report = relationship("ScreeningReport", back_populates="application", uselist=False)
    review_assignments = relationship("ReviewAssignment", back_populates="application")
    review_package = relationship("ReviewPackage", back_populates="application", uselist=False)
    reviews = relationship("Review", back_populates="application")
    grant_award = relationship("GrantAward", back_populates="application", uselist=False)
    message_thread = relationship("MessageThread", back_populates="application", uselist=False)
    documents = relationship("Document", back_populates="application")
