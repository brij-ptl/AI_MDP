from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Report(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "reports"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    prediction_id = Column(String(36), ForeignKey("predictions.id"), nullable=False, unique=True)

    file_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    download_count = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="reports")
    prediction = relationship("Prediction", back_populates="report")
