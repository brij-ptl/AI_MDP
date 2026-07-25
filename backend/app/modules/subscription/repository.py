from sqlalchemy.orm import Session
from app.database.models.subscription import Subscription


def get_or_create(db: Session, user_id: str) -> Subscription:
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if not sub:
        sub = Subscription(user_id=user_id, plan="free", status="active")
        db.add(sub)
        db.commit()
        db.refresh(sub)
    return sub


def save(db: Session, sub: Subscription) -> Subscription:
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub
