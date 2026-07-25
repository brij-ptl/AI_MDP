from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.modules.notifications import repository as notif_repo


def get_notifications(db: Session, user_id: str, unread_only: bool = False):
    return notif_repo.list_for_user(db, user_id, unread_only)


def mark_notification_read(db: Session, user_id: str, notif_id: str):
    notif = notif_repo.get_by_id(db, notif_id, user_id)
    if not notif:
        raise NotFoundException("Notification not found.")
    return notif_repo.mark_read(db, notif)


def mark_all_read(db: Session, user_id: str) -> int:
    return notif_repo.mark_all_read(db, user_id)


def get_unread_count(db: Session, user_id: str) -> int:
    return notif_repo.unread_count(db, user_id)
