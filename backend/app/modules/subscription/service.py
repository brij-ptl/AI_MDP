from __future__ import annotations
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import PaymentRequiredException
from app.modules.subscription import repository as sub_repo
from app.database.models.subscription import Subscription


def get_subscription(db: Session, user_id: str) -> Subscription:
    return sub_repo.get_or_create(db, user_id)


def enforce_prediction_quota(db: Session, user_id: str) -> Subscription:
    """Raises 402 PaymentRequired once the free tier is exhausted and the user isn't premium."""
    sub = sub_repo.get_or_create(db, user_id)
    if sub.is_premium_active():
        return sub
    if sub.predictions_used >= settings.FREE_PREDICTIONS_LIMIT:
        raise PaymentRequiredException(
            f"You've used all {settings.FREE_PREDICTIONS_LIMIT} free predictions. "
            "Upgrade to Premium for unlimited disease predictions.",
            error_code="FREE_LIMIT_REACHED",
        )
    return sub


def enforce_symptom_check_quota(db: Session, user_id: str) -> Subscription:
    sub = sub_repo.get_or_create(db, user_id)
    if sub.is_premium_active():
        return sub
    if sub.symptom_checks_used >= settings.FREE_SYMPTOM_CHECKS_LIMIT:
        raise PaymentRequiredException(
            f"You've used all {settings.FREE_SYMPTOM_CHECKS_LIMIT} free symptom checks. "
            "Upgrade to Premium for unlimited AI symptom analysis.",
            error_code="FREE_LIMIT_REACHED",
        )
    return sub


def consume_prediction_credit(db: Session, user_id: str) -> Subscription:
    sub = sub_repo.get_or_create(db, user_id)
    sub.predictions_used += 1
    return sub_repo.save(db, sub)


def consume_symptom_check_credit(db: Session, user_id: str) -> Subscription:
    sub = sub_repo.get_or_create(db, user_id)
    sub.symptom_checks_used += 1
    return sub_repo.save(db, sub)


def activate_premium(db: Session, user_id: str, plan: str) -> Subscription:
    sub = sub_repo.get_or_create(db, user_id)
    sub.plan = plan
    sub.status = "active"
    sub.starts_at = datetime.utcnow()
    sub.expires_at = datetime.utcnow() + (timedelta(days=365) if plan == "premium_yearly" else timedelta(days=30))
    return sub_repo.save(db, sub)


def remaining_quota(sub: Subscription) -> dict:
    if sub.is_premium_active():
        return {"predictions_remaining": "unlimited", "symptom_checks_remaining": "unlimited"}
    return {
        "predictions_remaining": max(0, settings.FREE_PREDICTIONS_LIMIT - sub.predictions_used),
        "symptom_checks_remaining": max(0, settings.FREE_SYMPTOM_CHECKS_LIMIT - sub.symptom_checks_used),
    }
