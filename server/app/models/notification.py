from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String)  # APPLICATION_SUBMITTED, SCREENING_COMPLETE, etc.
    title = Column(String, nullable=False)
    content = Column(Text)
    is_read = Column(Boolean, default=False)
    link = Column(String)  # optional deep link
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
