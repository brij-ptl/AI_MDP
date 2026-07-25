from __future__ import annotations
from typing import Any, Dict

from app.ml.inference.pipeline import run_pipeline
from app.ml.registry.model_loader import load_disease_config
from app.modules.prediction.response_builder import build_doctor_explanation, build_recommendations


def execute(disease_slug: str, raw_features: Dict[str, Any], profile: Dict[str, Any] | None) -> dict:
    result = run_pipeline(disease_slug, raw_features, profile)
    disease_cfg = load_disease_config(disease_slug)

    doctor_explanation = build_doctor_explanation(result, disease_cfg, raw_features)
    recommendations = build_recommendations(result, disease_cfg)

    return {
        "result": result,
        "doctor_explanation": doctor_explanation,
        "recommendations": recommendations,
        "recommended_tests": disease_cfg.get("recommended_tests", []),
        "recommended_specialist": disease_cfg.get("recommended_specialist"),
    }
