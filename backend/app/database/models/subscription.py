from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Subscription(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "subscriptions"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    plan = Column(String(30), default="free", nullable=False)          # free | starter | care_plus | family | annual
    status = Column(String(20), default="active", nullable=False)      # active | expired | cancelled | none

    predictions_used = Column(Integer, default=0, nullable=False)        # lifetime free-tier usage counter
    symptom_checks_used = Column(Integer, default=0, nullable=False)

    starts_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    auto_renew = Column(Integer, default=0, nullable=False)  # 0/1 boolean flag (kept int for sqlite simplicity)

    user = relationship("User", back_populates="subscription")

    def is_premium_active(self) -> bool:
        from datetime import datetime
        if self.plan == "free":
            return False
        if self.status != "active":
            return False
        if self.expires_at and self.expires_at < datetime.utcnow():
            return False
        return True
