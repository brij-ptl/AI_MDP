from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Feedback(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "feedbacks"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    prediction_id = Column(String(36), ForeignKey("predictions.id"), nullable=True)
    rating = Column(Integer, nullable=False)          # 1-5
    comment = Column(Text, nullable=True)
    category = Column(String(30), default="general", nullable=False)   # general|prediction_accuracy|bug|feature
    status = Column(String(20), default="open", nullable=False)         # open|reviewed|resolved

    user = relationship("User", back_populates="feedbacks")
