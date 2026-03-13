from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class OrganisationProfile(Base):
    __tablename__ = "organisation_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    legal_name = Column(String)
    registration_number = Column(String)
    org_type = Column(String)  # NGO, Trust, Section 8 Company, etc.
    year_established = Column(Integer)
    state = Column(String)
    district = Column(String)
    annual_budget_inr = Column(Float)
    contact_person_name = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    website = Column(String)
    address = Column(String)
    pincode = Column(String)
    mission = Column(String)
    pan_number = Column(String)
    fcra_number = Column(String)
    reg_12a = Column(String)
    reg_80g = Column(String)
    profile_complete_pct = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="organisation_profile")
