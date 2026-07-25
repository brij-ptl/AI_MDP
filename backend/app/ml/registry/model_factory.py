"""Wraps a raw (pipeline, config) bundle into a concrete BaseDiseaseModel instance."""
from __future__ import annotations
from typing import Any, Dict

from app.ml.common.base_model import BaseDiseaseModel
from app.ml.common.base_preprocessor import coerce_and_order_features
from app.ml.explainable_ai.feature_importance import explain_prediction
from app.ml.registry.model_loader import load_model_bundle, load_disease_config


class DiseasePipelineModel(BaseDiseaseModel):
    def __init__(self, slug: str):
        self.slug = slug
        self.bundle = load_model_bundle(slug)
        self.config = load_disease_config(slug)
        self.pipeline = self.bundle["pipeline"]
        self.feature_names = self.bundle["feature_names"]
        self.feature_schema = self.bundle["feature_schema"]

    def _prepare(self, features: Dict[str, Any]):
        import pandas as pd
        coerced = coerce_and_order_features(features, self.feature_schema)
        return coerced, pd.DataFrame([coerced])[self.feature_names]

    def predict_proba(self, features: Dict[str, Any]) -> float:
        _, X = self._prepare(features)
        proba = self.pipeline.predict_proba(X)[0][1]
        return float(proba)

    def feature_importance(self, features: Dict[str, Any]) -> list[dict]:
        coerced, _ = self._prepare(features)
        return explain_prediction(self.pipeline, coerced, self.feature_names)


def get_model(slug: str) -> DiseasePipelineModel:
    return DiseasePipelineModel(slug)
