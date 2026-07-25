import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email))


def is_strong_password(password: str) -> bool:
    return len(password) >= 8 and any(c.isdigit() for c in password) and any(c.isalpha() for c in password)
