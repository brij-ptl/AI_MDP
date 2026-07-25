from sqlalchemy.orm import Session
from app.modules.notifications import service as notif_service


def handle_list(db: Session, user_id: str, unread_only: bool):
    return notif_service.get_notifications(db, user_id, unread_only)


def handle_mark_read(db: Session, user_id: str, notif_id: str):
    return notif_service.mark_notification_read(db, user_id, notif_id)


def handle_mark_all_read(db: Session, user_id: str):
    return notif_service.mark_all_read(db, user_id)


def handle_unread_count(db: Session, user_id: str):
    return notif_service.get_unread_count(db, user_id)
