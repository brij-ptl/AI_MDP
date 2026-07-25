def is_positive_number(value) -> bool:
    try:
        return float(value) >= 0
    except (TypeError, ValueError):
        return False


def in_range(value, lo, hi) -> bool:
    try:
        v = float(value)
        return lo <= v <= hi
    except (TypeError, ValueError):
        return False


def is_non_empty_str(value) -> bool:
    return isinstance(value, str) and len(value.strip()) > 0
