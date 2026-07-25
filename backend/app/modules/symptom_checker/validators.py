from app.core.exceptions import ValidationException


def assert_meaningful_text(text: str) -> None:
    words = [w for w in text.strip().split() if w]
    if len(words) < 2:
        raise ValidationException("Please describe your symptoms in a bit more detail.")
