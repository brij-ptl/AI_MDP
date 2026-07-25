from datetime import datetime
from typing import Any
from pydantic import BaseModel


class PredictionRequest(BaseModel):
    features: dict[str, Any]
    input_type: str = "manual_form"          # manual_form | document_upload
    source_document_id: str | None = None


class FeatureImportanceItem(BaseModel):
    feature: str
    contribution: float
    direction: str


class PredictionOut(BaseModel):
    id: str
    disease_slug: str
    input_type: str
    prediction_label: str
    probability: float
    risk_level: str
    confidence_score: float
    feature_importance: list[dict] | None = None
    doctor_explanation: str | None = None
    recommended_tests: list[str] | None = None
    recommended_specialist: str | None = None
    recommendations: list[str] | None = None
    model_version: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class PredictionListItem(BaseModel):
    id: str
    disease_slug: str
    prediction_label: str
    risk_level: str
    probability: float
    created_at: datetime

    class Config:
        from_attributes = True
