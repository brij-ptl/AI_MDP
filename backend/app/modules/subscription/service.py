from __future__ import annotations
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import PaymentRequiredException
from app.database.models.user import User
from app.modules.subscription import repository as sub_repo
from app.database.models.subscription import Subscription

PLAN_DURATIONS_DAYS = {
    "starter": 30,
    "care_plus": 30,
    "family": 90,
    "annual": 365,
}
LEGACY_PLAN_ALIASES = {
    "premium_monthly": "care_plus",
    "premium_yearly": "annual",
}


def get_subscription(db: Session, user_id: str) -> Subscription:
    return sub_repo.get_or_create(db, user_id)


def get_prediction_access(db: Session, user: "User") -> dict:
    """Return the only state clients need to make prediction-access decisions.

    The order is intentional: granted prediction tokens are spent first, then an
    active subscription, then the free trial.  This same resolver is also used
    immediately before a prediction is run, so UI state can never become an
    authorization mechanism.
    """
    sub = sub_repo.get_or_create(db, user.id)
    if user.role == "admin":
        return {"can_predict": True, "access_source": "admin", "predictions_remaining": "unlimited"}
    if user.prediction_tokens > 0:
        return {
            "can_predict": True,
            "access_source": "prediction_tokens",
            "predictions_remaining": user.prediction_tokens,
        }
    if sub.is_premium_active():
        return {"can_predict": True, "access_source": "subscription", "predictions_remaining": "unlimited"}

    trial_remaining = max(0, settings.FREE_PREDICTIONS_LIMIT - sub.predictions_used)
    return {
        "can_predict": trial_remaining > 0,
        "access_source": "free_trial" if trial_remaining > 0 else "quota_exceeded",
        "predictions_remaining": trial_remaining,
    }


def enforce_prediction_quota(db: Session, user: "User") -> str:
    """Resolve prediction access without consuming a credit until prediction succeeds."""
    access = get_prediction_access(db, user)
    if not access["can_predict"]:
        raise PaymentRequiredException(
            f"You've used all {settings.FREE_PREDICTIONS_LIMIT} free predictions. "
            "Upgrade to Premium for unlimited disease predictions.",
            error_code="FREE_LIMIT_REACHED",
        )
    return access["access_source"]


def enforce_symptom_check_quota(db: Session, user: "User") -> Subscription:
    sub = sub_repo.get_or_create(db, user.id)
    if user.role == "admin" or sub.is_premium_active():
        return sub
    if sub.symptom_checks_used >= settings.FREE_SYMPTOM_CHECKS_LIMIT:
        raise PaymentRequiredException(
            f"You've used all {settings.FREE_SYMPTOM_CHECKS_LIMIT} free symptom checks. "
            "Upgrade to Premium for unlimited AI symptom analysis.",
            error_code="FREE_LIMIT_REACHED",
        )
    return sub


def consume_prediction_credit(db: Session, user: "User", access_source: str) -> Subscription:
    sub = sub_repo.get_or_create(db, user.id)
    if access_source == "admin" or user.role == "admin":
        return sub
    if access_source == "prediction_tokens":
        updated = db.query(User).filter(
            User.id == user.id, User.prediction_tokens > 0,
        ).update({User.prediction_tokens: User.prediction_tokens - 1}, synchronize_session=False)
        if updated != 1:
            db.rollback()
            raise PaymentRequiredException(
                "No prediction token is available. Refresh your account access and try again.",
                error_code="FREE_LIMIT_REACHED",
            )
        db.commit()
        db.refresh(user)
        return sub
    if access_source == "subscription" or sub.is_premium_active():
        return sub
    updated = db.query(Subscription).filter(
        Subscription.id == sub.id,
        Subscription.predictions_used < settings.FREE_PREDICTIONS_LIMIT,
    ).update({Subscription.predictions_used: Subscription.predictions_used + 1}, synchronize_session=False)
    if updated != 1:
        db.rollback()
        raise PaymentRequiredException(
            "No free prediction credit is available. Refresh your account access and try again.",
            error_code="FREE_LIMIT_REACHED",
        )
    db.commit()
    db.refresh(sub)
    return sub


def consume_symptom_check_credit(db: Session, user: "User") -> Subscription:
    sub = sub_repo.get_or_create(db, user.id)
    if user.role == "admin" or sub.is_premium_active():
        return sub
    sub.symptom_checks_used += 1
    return sub_repo.save(db, sub)


def activate_premium(db: Session, user_id: str, plan: str) -> Subscription:
    sub = sub_repo.get_or_create(db, user_id)
    plan = LEGACY_PLAN_ALIASES.get(plan, plan)
    if plan not in PLAN_DURATIONS_DAYS:
        raise ValueError("Unsupported subscription plan.")
    sub.plan = plan
    sub.status = "active"
    sub.starts_at = datetime.utcnow()
    sub.expires_at = datetime.utcnow() + timedelta(days=PLAN_DURATIONS_DAYS[plan])
    return sub_repo.save(db, sub)


def remaining_quota(sub: Subscription, is_admin: bool = False) -> dict:
    if is_admin or sub.is_premium_active():
        return {"predictions_remaining": "unlimited", "symptom_checks_remaining": "unlimited"}
    return {
        "predictions_remaining": max(0, settings.FREE_PREDICTIONS_LIMIT - sub.predictions_used),
        "symptom_checks_remaining": max(0, settings.FREE_SYMPTOM_CHECKS_LIMIT - sub.symptom_checks_used),
    }
