"""End-to-end pipeline: raw form/OCR input + saved medical profile -> PredictionResult."""
from __future__ import annotations
from typing import Any, Dict, Optional

from app.ml.preprocessing.feature_engineering import enrich_with_profile_defaults
from app.ml.inference.predictor import predict
from app.ml.common.base_predictor import PredictionResult


def run_pipeline(slug: str, raw_features: Dict[str, Any], profile: Optional[Dict[str, Any]] = None) -> PredictionResult:
    enriched = enrich_with_profile_defaults(raw_features, profile)
    return predict(slug, enriched)
