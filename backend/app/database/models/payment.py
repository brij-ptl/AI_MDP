from sqlalchemy import Column, String, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Payment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payments"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    plan = Column(String(30), nullable=False)               # premium_monthly | premium_yearly
    amount = Column(Integer, nullable=False)                 # paise
    currency = Column(String(5), default="INR", nullable=False)
    status = Column(String(20), default="created", nullable=False)  # created|pending|success|failed|refunded

    razorpay_order_id = Column(String(100), nullable=True, index=True)
    razorpay_payment_id = Column(String(100), nullable=True, index=True)
    razorpay_signature = Column(String(255), nullable=True)
    raw_webhook_payload = Column(JSON, nullable=True)

    user = relationship("User", back_populates="payments")
