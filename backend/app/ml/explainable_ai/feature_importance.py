"""
Per-prediction feature contribution explainer.

Used for EVERY prediction (fast, no extra dependency). For RandomForest we combine the
model's global feature_importances_ with how far this specific patient's value sits from
the training population's typical value, so the explanation is patient-specific rather
than a static global ranking. For LogisticRegression we use the true per-feature
coefficient * standardized-value contribution, which is exact.
"""
from __future__ import annotations
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression


def explain_prediction(pipeline, raw_features: dict, feature_names: list[str], top_k: int = 6) -> list[dict]:
    preprocess = pipeline.named_steps["preprocess"]
    classifier = pipeline.named_steps["classifier"]

    try:
        feature_out_names = preprocess.get_feature_names_out()
    except Exception:
        feature_out_names = [f"f{i}" for i in range(preprocess.transform(
            _as_dataframe(raw_features, feature_names)).shape[1])]

    X_row = _as_dataframe(raw_features, feature_names)
    X_transformed = preprocess.transform(X_row)
    if hasattr(X_transformed, "toarray"):
        X_transformed = X_transformed.toarray()
    x = X_transformed[0]

    if isinstance(classifier, LogisticRegression):
        coefs = classifier.coef_[0]
        contributions = coefs * x
    elif isinstance(classifier, RandomForestClassifier):
        importances = classifier.feature_importances_
        # weight global importance by how "extreme" (standardized) this patient's value is
        contributions = importances * np.abs(x)
    else:
        contributions = np.abs(x)

    ranked_idx = np.argsort(-np.abs(contributions))[:top_k]
    result = []
    for i in ranked_idx:
        name = _clean_name(feature_out_names[i])
        result.append({
            "feature": name,
            "contribution": round(float(contributions[i]), 4),
            "direction": "increases risk" if contributions[i] > 0 else "decreases risk",
        })
    return result


def _as_dataframe(raw_features: dict, feature_names: list[str]):
    import pandas as pd
    return pd.DataFrame([{k: raw_features.get(k) for k in feature_names}])


def _clean_name(name: str) -> str:
    # sklearn ColumnTransformer prefixes like "num__age" or "cat__gender_male"
    for prefix in ("num__", "cat__"):
        if name.startswith(prefix):
            name = name[len(prefix):]
    return name.replace("_", " ").strip()
