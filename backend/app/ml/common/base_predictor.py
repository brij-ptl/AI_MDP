"""Common prediction result contract used by app.ml.inference.predictor."""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class PredictionResult:
    disease_slug: str
    probability: float                      # 0-1
    prediction_label: str                    # "Positive" | "Negative"
    risk_level: str                          # Low / Moderate / High / Critical
    confidence_score: float                  # 0-1, model's certainty in this specific call
    feature_importance: List[Dict[str, Any]] = field(default_factory=list)
    model_version: str = "1.0.0"
    warnings: List[str] = field(default_factory=list)
