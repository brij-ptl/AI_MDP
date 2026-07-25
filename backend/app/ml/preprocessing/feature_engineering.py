"""Derived features shared across multiple disease modules (e.g. BMI from height/weight)."""
from typing import Any, Dict


def compute_bmi(weight_kg: float, height_cm: float) -> float:
    if not height_cm:
        return 0.0
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 2)


def bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "underweight"
    if bmi < 25:
        return "normal"
    if bmi < 30:
        return "overweight"
    return "obese"


def enrich_with_profile_defaults(features: Dict[str, Any], profile: Dict[str, Any] | None) -> Dict[str, Any]:
    """Fill in gaps in a disease-specific feature dict using the user's saved medical profile."""
    if not profile:
        return features
    merged = dict(features)
    for key in ("age", "gender", "height_cm", "weight_kg", "smoking", "alcohol", "physical_activity"):
        if merged.get(key) in (None, "", 0) and profile.get(key) not in (None, ""):
            merged[key] = profile[key]
    if "bmi" in merged and (merged.get("bmi") in (None, 0)) and merged.get("height_cm") and merged.get("weight_kg"):
        merged["bmi"] = compute_bmi(merged["weight_kg"], merged["height_cm"])
    return merged
