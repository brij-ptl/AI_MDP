ALLOWED_FEEDBACK_STATUSES = {"open", "reviewed", "resolved"}


def valid_feedback_status(status: str) -> bool:
    return status in ALLOWED_FEEDBACK_STATUSES
