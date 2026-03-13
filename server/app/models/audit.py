from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"))
    actor_email = Column(String, nullable=False)
    action = Column(String, nullable=False)
    object_type = Column(String)  # Application, User, Grant, etc.
    object_id = Column(String)
    details = Column(Text, default="{}")  # JSON
    ip_address = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    actor = relationship("User", back_populates="audit_logs")
