from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.modules.admin import repository as admin_repo
from app.ml.evaluation.evaluator import get_all_model_metadata


def list_users(db: Session, limit: int, offset: int):
    return admin_repo.list_users(db, limit, offset)


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
