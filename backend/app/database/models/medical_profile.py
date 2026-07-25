from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class MedicalProfile(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Baseline demographic/lifestyle data reused as defaults across disease forms."""
    __tablename__ = "medical_profiles"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)

    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)     # male | female | other
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    blood_group = Column(String(5), nullable=True)
    smoking = Column(String(10), nullable=True)     # never | former | current
    alcohol = Column(String(10), nullable=True)     # never | occasional | regular
    physical_activity = Column(String(15), nullable=True)  # sedentary | moderate | active
    family_history = Column(String(500), nullable=True)     # comma separated disease names
    existing_conditions = Column(String(500), nullable=True)

    user = relationship("User", back_populates="medical_profile")
