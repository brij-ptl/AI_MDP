"""
Optional deeper explainability using the real `shap` library (TreeExplainer for
RandomForest models). Not used on the hot request path by default (feature_importance.py
is used there for speed); admins can request a SHAP breakdown for a specific past
prediction from the admin 'AI Model Monitoring' screen.

Requires: pip install shap
"""
from __future__ import annotations


def shap_available() -> bool:
    try:
        import shap  # noqa: F401
        return True
    except ImportError:
        return False


def explain_with_shap(pipeline, raw_features: dict, feature_names: list[str], background_df=None) -> list[dict]:
    import shap
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier

    classifier = pipeline.named_steps["classifier"]
    preprocess = pipeline.named_steps["preprocess"]
    if not isinstance(classifier, RandomForestClassifier):
        raise NotImplementedError("SHAP TreeExplainer wired up for RandomForest models only in this build.")

    X_row = pd.DataFrame([{k: raw_features.get(k) for k in feature_names}])
    X_transformed = preprocess.transform(X_row)
    if hasattr(X_transformed, "toarray"):
        X_transformed = X_transformed.toarray()

    explainer = shap.TreeExplainer(classifier)
    shap_values = explainer.shap_values(X_transformed)
    values = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]

    try:
        names = preprocess.get_feature_names_out()
    except Exception:
        names = [f"f{i}" for i in range(len(values))]

    ranked = sorted(zip(names, values), key=lambda t: -abs(t[1]))[:6]
    return [{"feature": n.split("__")[-1].replace("_", " "), "shap_value": round(float(v), 4)} for n, v in ranked]
