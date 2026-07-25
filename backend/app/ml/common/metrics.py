"""Thin wrapper re-exporting sklearn metrics used consistently across training/evaluation."""
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
)


def full_report(y_true, y_pred, y_proba=None) -> dict:
    report = {
        "accuracy": round(accuracy_score(y_true, y_pred), 4),
        "precision": round(precision_score(y_true, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_true, y_pred, zero_division=0), 4),
        "f1_score": round(f1_score(y_true, y_pred, zero_division=0), 4),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
    }
    if y_proba is not None:
        try:
            report["roc_auc"] = round(roc_auc_score(y_true, y_proba), 4)
        except ValueError:
            report["roc_auc"] = None
    return report
