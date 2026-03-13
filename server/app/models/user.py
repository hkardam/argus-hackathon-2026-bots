from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # APPLICANT, OFFICER, REVIEWER, FINANCE, ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    organisation_profile = relationship("OrganisationProfile", back_populates="user", uselist=False)
    applications = relationship("Application", back_populates="applicant", foreign_keys="Application.applicant_id")
    review_assignments = relationship("ReviewAssignment", back_populates="reviewer", foreign_keys="ReviewAssignment.reviewer_id")
    reviews = relationship("Review", back_populates="reviewer")
    sent_messages = relationship("Message", back_populates="sender")
    notifications = relationship("Notification", back_populates="user")
    documents = relationship("Document", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="actor")
