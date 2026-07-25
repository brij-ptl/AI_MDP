"""Abstract base wrapper around a trained scikit-learn pipeline for one disease."""
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseDiseaseModel(ABC):
    slug: str

    @abstractmethod
    def predict_proba(self, features: Dict[str, Any]) -> float:
        """Return probability (0-1) of the positive (disease-present) class."""
        raise NotImplementedError

    @abstractmethod
    def feature_importance(self, features: Dict[str, Any]) -> list[dict]:
        """Return a ranked list of {feature, contribution} for this specific prediction."""
        raise NotImplementedError
