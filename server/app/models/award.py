from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class GrantAward(Base):
    __tablename__ = "grant_awards"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=False)
    decision = Column(String, nullable=False)  # APPROVED, REJECTED, WAITLISTED
    reason = Column(Text, nullable=False)
    award_amount = Column(Float)

    decided_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decided_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    agreement_sent_at = Column(DateTime)
    agreement_acknowledged_at = Column(DateTime)
    special_conditions = Column(Text)

    application = relationship("Application", back_populates="grant_award")
    decided_by = relationship("User", foreign_keys=[decided_by_id])
    disbursement_tranches = relationship("DisbursementTranche", back_populates="grant_award")
    bank_details = relationship("BankDetails", back_populates="grant_award", uselist=False)
    progress_reports = relationship("ProgressReport", back_populates="grant_award")
    expenditure_records = relationship("ExpenditureRecord", back_populates="grant_award")
