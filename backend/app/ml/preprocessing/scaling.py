"""Standalone scaling helpers (mostly used ad-hoc / in notebooks; pipelines use encoding.py)."""
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import numpy as np


def standard_scale(X: np.ndarray) -> tuple[np.ndarray, StandardScaler]:
    scaler = StandardScaler()
    return scaler.fit_transform(X), scaler


def minmax_scale(X: np.ndarray) -> tuple[np.ndarray, MinMaxScaler]:
    scaler = MinMaxScaler()
    return scaler.fit_transform(X), scaler
