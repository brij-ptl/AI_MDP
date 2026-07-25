"""
Optional LIME-based local explainer, offered as an alternative to SHAP in the admin
'AI Model Monitoring' screen. Requires: pip install lime
"""
from __future__ import annotations


def lime_available() -> bool:
    try:
        import lime  # noqa: F401
        return True
    except ImportError:
        return False


def explain_with_lime(pipeline, X_train_sample, raw_features: dict, feature_names: list[str]) -> list[dict]:
    from lime.lime_tabular import LimeTabularExplainer
    import pandas as pd
    import numpy as np

    preprocess = pipeline.named_steps["preprocess"]
    X_train_transformed = preprocess.transform(X_train_sample)
    if hasattr(X_train_transformed, "toarray"):
        X_train_transformed = X_train_transformed.toarray()

    try:
        out_names = list(preprocess.get_feature_names_out())
    except Exception:
        out_names = [f"f{i}" for i in range(X_train_transformed.shape[1])]

    explainer = LimeTabularExplainer(
        training_data=np.array(X_train_transformed),
        feature_names=out_names,
        class_names=["Negative", "Positive"],
        mode="classification",
    )

    X_row = pd.DataFrame([{k: raw_features.get(k) for k in feature_names}])
    X_row_transformed = preprocess.transform(X_row)
    if hasattr(X_row_transformed, "toarray"):
        X_row_transformed = X_row_transformed.toarray()

    explanation = explainer.explain_instance(
        X_row_transformed[0], pipeline.named_steps["classifier"].predict_proba, num_features=6
    )
    return [{"feature": f, "weight": round(w, 4)} for f, w in explanation.as_list()]
