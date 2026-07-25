"""Given a final (already-enriched) feature dict, runs the model and returns a PredictionResult."""
from __future__ import annotations
from typing import Any, Dict

from app.core.constants import RISK_THRESHOLDS
from app.ml.common.base_predictor import PredictionResult
from app.ml.registry.model_factory import get_model


def _risk_level(probability: float) -> str:
    if probability < RISK_THRESHOLDS["low"]:
        return "Low Risk"
    if probability < RISK_THRESHOLDS["moderate"]:
        return "Moderate Risk"
    if probability < RISK_THRESHOLDS["high"]:
        return "High Risk"
    return "Critical Risk"


def _confidence(probability: float) -> float:
    # distance from the decision boundary (0.5), rescaled to 0.5-1.0 range
    return round(0.5 + abs(probability - 0.5), 4)


def predict(slug: str, features: Dict[str, Any]) -> PredictionResult:
    model = get_model(slug)
    probability = model.predict_proba(features)
    importance = model.feature_importance(features)
    metadata = model.bundle.get("metadata", {})

    return PredictionResult(
        disease_slug=slug,
        probability=round(probability, 4),
        prediction_label="Positive" if probability >= 0.5 else "Negative",
        risk_level=_risk_level(probability),
        confidence_score=_confidence(probability),
        feature_importance=importance,
        model_version=metadata.get("model_version", "1.0.0"),
        warnings=(["This module uses a demo model trained on synthetic data, not verified "
                    "clinical records. Treat results as illustrative only."]
                   if metadata.get("data_source") == "synthetic_demo" else []),
    )
