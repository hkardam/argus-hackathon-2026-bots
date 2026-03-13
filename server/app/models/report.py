from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class ProgressReport(Base):
    __tablename__ = "progress_reports"

    id = Column(Integer, primary_key=True, index=True)
    grant_award_id = Column(Integer, ForeignKey("grant_awards.id"), nullable=False)
    report_type = Column(String)  # SIX_MONTH, QUARTERLY, MID_POINT, FINAL
    report_data = Column(Text, default="{}")  # JSON — all template fields
    status = Column(String, default="SUBMITTED")  # SUBMITTED, REVIEWED, APPROVED

    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    reviewed_at = Column(DateTime)
    reviewed_by_id = Column(Integer, ForeignKey("users.id"))
    reviewer_notes = Column(Text)
    compliance_action = Column(String)  # None, WARNING, DISBURSEMENT_HOLD

    grant_award = relationship("GrantAward", back_populates="progress_reports")
    reviewed_by = relationship("User", foreign_keys=[reviewed_by_id])
    compliance_analysis = relationship("ComplianceAnalysis", back_populates="report", uselist=False)
    expenditure_records = relationship("ExpenditureRecord", back_populates="report")


class ComplianceAnalysis(Base):
    __tablename__ = "compliance_analyses"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("progress_reports.id"), unique=True, nullable=False)
    content_rating = Column(String)  # SATISFACTORY, NEEDS_CLARIFICATION, CONCERNS_FOUND
    flags = Column(Text, default="[]")  # JSON list of {type, description, field_reference}
    recommended_action = Column(Text)
    financial_summary = Column(Text)  # JSON
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    report = relationship("ProgressReport", back_populates="compliance_analysis")


class ExpenditureRecord(Base):
    __tablename__ = "expenditure_records"

    id = Column(Integer, primary_key=True, index=True)
    grant_award_id = Column(Integer, ForeignKey("grant_awards.id"), nullable=False)
    report_id = Column(Integer, ForeignKey("progress_reports.id"))
    date = Column(Date)
    payee = Column(String)
    amount_inr = Column(Float, nullable=False)
    budget_category = Column(String)
    description = Column(Text)
    receipt_file_path = Column(String)
    verification_status = Column(String, default="PENDING")  # PENDING, VERIFIED, QUERIED
    verified_by_id = Column(Integer, ForeignKey("users.id"))
    verified_at = Column(DateTime)
    query_notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    grant_award = relationship("GrantAward", back_populates="expenditure_records")
    report = relationship("ProgressReport", back_populates="expenditure_records")
    verified_by = relationship("User", foreign_keys=[verified_by_id])
