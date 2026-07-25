from sqlalchemy import Column, String, Text, JSON, Boolean, Float
from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Disease(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Metadata registry row for each disease module (mirrors app/ml/diseases/<slug>/config.json)."""
    __tablename__ = "diseases"

    slug = Column(String(50), unique=True, index=True, nullable=False)   # "heart"
    name = Column(String(150), nullable=False)                          # "Heart Disease"
    category = Column(String(50), nullable=False)                       # Cardiovascular, etc.
    icon = Column(String(20), nullable=True)
    short_description = Column(Text, nullable=True)
    overview = Column(Text, nullable=True)
    risk_factors = Column(JSON, nullable=True)          # list[str]
    common_symptoms = Column(JSON, nullable=True)        # list[str]
    recommended_tests = Column(JSON, nullable=True)      # list[str]
    recommended_specialist = Column(String(150), nullable=True)
    feature_schema = Column(JSON, nullable=True)          # list of {name, label, type, unit, range}
    model_algorithm = Column(String(50), nullable=True)   # "RandomForest", "XGBoost" ...
    model_accuracy = Column(Float, nullable=True)
    model_version = Column(String(20), nullable=True)
    data_source = Column(String(50), nullable=True)       # "public_dataset" | "synthetic_demo"
    is_active = Column(Boolean, default=True, nullable=False)
