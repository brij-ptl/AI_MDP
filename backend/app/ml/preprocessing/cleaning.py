"""Generic dataframe cleaning used before training any disease model."""
import pandas as pd
import numpy as np


def clean_dataframe(df: pd.DataFrame, target: str) -> pd.DataFrame:
    df = df.copy()
    df = df.drop_duplicates()

    # Replace common missing-value sentinels
    df = df.replace(["?", "", "NA", "N/A", "null", "None"], np.nan)

    # Coerce numeric-looking columns
    for col in df.columns:
        if col == target:
            continue
        converted = pd.to_numeric(df[col], errors="coerce")
        # Only replace if a majority of values successfully converted (avoid nuking real categoricals)
        if converted.notna().sum() >= 0.8 * len(df):
            df[col] = converted

    # Impute
    for col in df.columns:
        if col == target:
            continue
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(df[col].median())
        else:
            mode = df[col].mode()
            df[col] = df[col].fillna(mode.iloc[0] if not mode.empty else "unknown")

    df = df.dropna(subset=[target])
    return df.reset_index(drop=True)
