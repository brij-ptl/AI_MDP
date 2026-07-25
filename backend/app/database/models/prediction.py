from sqlalchemy import Column, String, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class OcrDocument(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """An uploaded medical report/document processed via OCR to auto-fill a prediction form."""
    __tablename__ = "ocr_documents"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    disease_slug = Column(String(50), nullable=True)
    file_path = Column(String(500), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)          # pdf | png | jpg
    raw_extracted_text = Column(Text, nullable=True)
    extracted_parameters = Column(JSON, nullable=True)      # {param_name: value}
    normalization_notes = Column(JSON, nullable=True)
    status = Column(String(20), default="processed", nullable=False)  # processed | failed | pending


class Prediction(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "predictions"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    disease_slug = Column(String(50), nullable=False, index=True)     # e.g. "heart"
    input_type = Column(String(20), nullable=False)                   # manual_form | document_upload | symptom_text

    input_features = Column(JSON, nullable=False)          # raw feature dict used for inference
    prediction_label = Column(String(50), nullable=False)  # e.g. "Positive" / "Negative"
    probability = Column(Float, nullable=False)             # 0-1 probability of positive class
    risk_level = Column(String(30), nullable=False)         # Low / Moderate / High / Critical
    confidence_score = Column(Float, nullable=False)

    feature_importance = Column(JSON, nullable=True)        # [{feature, contribution}]
    doctor_explanation = Column(Text, nullable=True)
    recommended_tests = Column(JSON, nullable=True)
    recommended_specialist = Column(String(150), nullable=True)
    recommendations = Column(JSON, nullable=True)

    source_document_id = Column(String(36), ForeignKey("ocr_documents.id"), nullable=True)
    model_version = Column(String(50), nullable=True)

    user = relationship("User", back_populates="predictions")
    report = relationship("Report", back_populates="prediction", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Prediction {self.disease_slug} {self.risk_level}>"
