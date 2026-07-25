from sqlalchemy.orm import Session

from app.core.exceptions import ValidationException
from app.modules.admin import service as admin_service
from app.modules.admin.validators import valid_feedback_status


def handle_list_users(db: Session, limit: int, offset: int):
    return admin_service.list_users(db, limit, offset)


def handle_toggle_user(db: Session, admin_id: str, user_id: str, is_active: bool):
    return admin_service.toggle_user_active(db, admin_id, user_id, is_active)


def handle_list_diseases(db: Session):
    return admin_service.list_diseases(db)


def handle_toggle_disease(db: Session, admin_id: str, slug: str, is_active: bool):
    return admin_service.toggle_disease_active(db, admin_id, slug, is_active)


def handle_list_payments(db: Session, limit: int):
    return admin_service.list_payments(db, limit)


def handle_list_feedback(db: Session, status: str | None):
    return admin_service.list_feedback(db, status)


def handle_moderate_feedback(db: Session, admin_id: str, feedback_id: str, status: str):
    if not valid_feedback_status(status):
        raise ValidationException("Invalid feedback status.")
    return admin_service.moderate_feedback(db, admin_id, feedback_id, status)


def handle_model_reports():
    return admin_service.model_accuracy_reports()


def handle_list_logs(db: Session, limit: int):
    return admin_service.list_logs(db, limit)
