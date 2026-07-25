"""K-fold cross validation helper for evaluating a disease pipeline before persisting it."""
from sklearn.model_selection import cross_val_score, StratifiedKFold
import numpy as np


def run_cross_validation(pipeline, X, y, k: int = 5, scoring: str = "roc_auc") -> dict:
    skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)
    scores = cross_val_score(pipeline, X, y, cv=skf, scoring=scoring)
    return {
        "scoring": scoring,
        "folds": k,
        "scores": [round(s, 4) for s in scores],
        "mean": round(float(np.mean(scores)), 4),
        "std": round(float(np.std(scores)), 4),
    }
