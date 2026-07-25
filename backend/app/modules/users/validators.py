def valid_gender(value: str | None) -> bool:
    return value in (None, "male", "female", "other")


def valid_bmi_inputs(height_cm: float | None, weight_kg: float | None) -> bool:
    if height_cm is None or weight_kg is None:
        return True
    return 50 <= height_cm <= 250 and 2 <= weight_kg <= 350
