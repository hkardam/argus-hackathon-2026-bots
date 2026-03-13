from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class ReviewAssignment(Base):
    __tablename__ = "review_assignments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    deadline = Column(DateTime)
    status = Column(String, default="PENDING")  # PENDING, SUBMITTED

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application", back_populates="review_assignments")
    reviewer = relationship("User", back_populates="review_assignments", foreign_keys=[reviewer_id])
    assigned_by = relationship("User", foreign_keys=[assigned_by_id])
    review = relationship("Review", back_populates="assignment", uselist=False)


class ReviewPackage(Base):
    __tablename__ = "review_packages"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    summary_text = Column(Text)
    suggested_scores = Column(Text, default="{}")  # JSON
    risk_flags = Column(Text, default="[]")  # JSON
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application", back_populates="review_package")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("review_assignments.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Scores per dimension stored as JSON
    # {dimension_name: {ai_score: int, reviewer_score: int, comment: str}}
    scores = Column(Text, default="{}")
    composite_score = Column(Float)
    overall_comment = Column(Text)
    highlights = Column(Text, default="[]")  # [{text, note}]

    status = Column(String, default="DRAFT")  # DRAFT, SUBMITTED
    submitted_at = Column(DateTime)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assignment = relationship("ReviewAssignment", back_populates="review")
    application = relationship("Application", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")
