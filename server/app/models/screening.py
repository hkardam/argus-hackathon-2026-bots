from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class ScreeningReport(Base):
    __tablename__ = "screening_reports"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)

    # Hard rule results stored as JSON list
    hard_check_results = Column(Text, default="[]")  # [{rule_id, criterion, result, note}]

    # AI soft check results
    ai_flags = Column(Text, default="[]")  # [{flag_type, description, severity}]
    thematic_alignment_score = Column(Float)
    narrative_quality_score = Column(Float)
    recommended_outcome = Column(String)  # ELIGIBLE, INELIGIBLE, REVIEW_NEEDED

    # Officer decision
    officer_decision = Column(String)  # CONFIRM_ELIGIBLE, OVERRIDE_INELIGIBLE, CLARIFICATION
    officer_notes = Column(Text)
    officer_id = Column(Integer, ForeignKey("users.id"))
    decided_at = Column(DateTime)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application", back_populates="screening_report")
    officer = relationship("User", foreign_keys=[officer_id])
