from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base


class GrantProgramme(Base):
    __tablename__ = "grant_programmes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)  # CDG, EIG, ECAG
    name = Column(String, nullable=False)
    purpose = Column(Text)
    funding_min = Column(Float)
    funding_max = Column(Float)
    duration_min_months = Column(Integer)
    duration_max_months = Column(Integer)
    eligible_org_types = Column(Text)  # JSON string
    geographic_focus = Column(String)
    annual_cycle = Column(String)
    max_awards_per_cycle = Column(Integer)
    total_budget_crore = Column(Float)
    is_active = Column(Boolean, default=True)
    eligibility_rules = Column(Text)  # JSON string
    scoring_rubric = Column(Text)  # JSON string
    image_color = Column(String, default="#3B82F6")  # for UI

    applications = relationship("Application", back_populates="grant_programme")
