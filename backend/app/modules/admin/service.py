from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException, ValidationException
from app.modules.admin import repository as admin_repo
from app.modules.subscription import service as subscription_service
from app.ml.evaluation.evaluator import get_all_model_metadata


def list_users(db: Session, limit: int, offset: int):
    return admin_repo.list_users(db, limit, offset)


def _token_user_out(db: Session, user):
    subscription = subscription_service.get_subscription(db, user.id)
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "prediction_tokens": user.prediction_tokens,
        "subscription": subscription.plan,
        "subscription_status": subscription.status,
        "role": user.role,
        "is_active": user.is_active,
    }


def search_token_users(db: Session, query: str | None, limit: int = 50):
    return [_token_user_out(db, user) for user in admin_repo.search_users(db, query, limit)]


def update_prediction_tokens(db: Session, admin_id: str, user_id: str, operation: str,
                             amount: int | None, reason: str | None):
    user = admin_repo.get_user(db, user_id)
    if not user:
        raise NotFoundException("User not found.")
    if operation not in {"add", "remove", "set", "reset"}:
        raise ValidationException("Token operation must be add, remove, set, or reset.")
    if operation in {"add", "remove", "set"} and amount is None:
        raise ValidationException("An amount is required for this token operation.")

    old_value = user.prediction_tokens
    if operation == "add":
        new_value = old_value + amount
    elif operation == "remove":
        new_value = max(0, old_value - amount)
    elif operation == "set":
        new_value = amount
    else:
        new_value = 0

    user = admin_repo.set_prediction_tokens(db, user, new_value)
    admin_repo.log_admin_action(
        db, admin_id, f"PREDICTION_TOKENS_{operation.upper()}", target_type="user", target_id=user.id,
        metadata={"operation": operation, "old_value": old_value, "new_value": new_value, "reason": reason},
    )
    return _token_user_out(db, user)


def token_history(db: Session, user_id: str):
    if not admin_repo.get_user(db, user_id):
        raise NotFoundException("User not found.")
    return admin_repo.list_token_logs(db, user_id)


def toggle_user_active(db: Session, admin_id: str, user_id: str, is_active: bool):
    user = admin_repo.get_user(db, user_id)
    if not user:
        raise NotFoundException("User not found.")
    updated = admin_repo.set_user_active(db, user, is_active)
    admin_repo.log_admin_action(
        db, admin_id, "USER_SUSPENDED" if not is_active else "USER_REACTIVATED",
        target_type="user", target_id=user_id,
    )
    return updated


def list_diseases(db: Session):
    return admin_repo.list_diseases(db)


def toggle_disease_active(db: Session, admin_id: str, slug: str, is_active: bool):
    disease = admin_repo.set_disease_active(db, slug, is_active)
    if not disease:
        raise NotFoundException("Disease module not found.")
    admin_repo.log_admin_action(
        db, admin_id, "DISEASE_ENABLED" if is_active else "DISEASE_DISABLED",
        target_type="disease", target_id=slug,
    )
    return disease


def list_payments(db: Session, limit: int):
    return admin_repo.list_payments(db, limit)


def list_feedback(db: Session, status: str | None):
    return admin_repo.list_feedback(db, status)


def moderate_feedback(db: Session, admin_id: str, feedback_id: str, status: str):
    fb = admin_repo.update_feedback_status(db, feedback_id, status)
    if not fb:
        raise NotFoundException("Feedback not found.")
    admin_repo.log_admin_action(db, admin_id, "FEEDBACK_MODERATED", target_type="feedback", target_id=feedback_id)
    return fb


def model_accuracy_reports():
    return get_all_model_metadata()


def list_logs(db: Session, limit: int):
    return admin_repo.list_logs(db, limit)
