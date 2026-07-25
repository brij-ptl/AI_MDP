from sqlalchemy.orm import Session
from app.database.models.notification import Notification


def list_for_user(db: Session, user_id: str, unread_only: bool = False, limit: int = 50):
    q = db.query(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        q = q.filter(Notification.is_read.is_(False))
    return q.order_by(Notification.created_at.desc()).limit(limit).all()


def get_by_id(db: Session, notif_id: str, user_id: str) -> Notification | None:
    return db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == user_id).first()


def mark_read(db: Session, notif: Notification) -> Notification:
    notif.is_read = True
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def mark_all_read(db: Session, user_id: str) -> int:
    count = db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read.is_(False)) \
        .update({"is_read": True})
    db.commit()
    return count


def unread_count(db: Session, user_id: str) -> int:
    return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read.is_(False)).count()
