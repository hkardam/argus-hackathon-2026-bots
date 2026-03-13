from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"))
    file_name = Column(String, nullable=False)  # stored filename
    original_name = Column(String, nullable=False)  # user's original filename
    category = Column(String)  # Registration Certificate, Audited Financials, etc.
    file_path = Column(String, nullable=False)
    file_size = Column(Float)  # bytes
    mime_type = Column(String)
    status = Column(String, default="ACTIVE")  # ACTIVE, REPLACED
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="documents")
    application = relationship("Application", back_populates="documents")
