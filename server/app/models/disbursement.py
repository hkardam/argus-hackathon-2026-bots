from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class DisbursementTranche(Base):
    __tablename__ = "disbursement_tranches"

    id = Column(Integer, primary_key=True, index=True)
    grant_award_id = Column(Integer, ForeignKey("grant_awards.id"), nullable=False)
    label = Column(String, nullable=False)
    amount_inr = Column(Float, nullable=False)
    tranche_type = Column(String)  # INCEPTION, MID_PROJECT, FINAL, MILESTONE
    trigger_condition = Column(String)
    status = Column(String, default="PENDING")  # PENDING, READY, DISBURSED

    disbursed_at = Column(DateTime)
    disbursed_by_id = Column(Integer, ForeignKey("users.id"))
    transaction_reference = Column(String)
    notes = Column(Text)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    grant_award = relationship("GrantAward", back_populates="disbursement_tranches")
    disbursed_by = relationship("User", foreign_keys=[disbursed_by_id])


class BankDetails(Base):
    __tablename__ = "bank_details"

    id = Column(Integer, primary_key=True, index=True)
    grant_award_id = Column(Integer, ForeignKey("grant_awards.id"), unique=True, nullable=False)
    account_number = Column(String)  # In production, encrypt this
    ifsc_code = Column(String)
    beneficiary_name = Column(String)
    bank_name = Column(String)
    added_by_id = Column(Integer, ForeignKey("users.id"))
    added_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    grant_award = relationship("GrantAward", back_populates="bank_details")
    added_by = relationship("User", foreign_keys=[added_by_id])
