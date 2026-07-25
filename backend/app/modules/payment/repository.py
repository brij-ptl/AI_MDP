from sqlalchemy.orm import Session
from app.database.models.payment import Payment


def create_payment(db: Session, **kwargs) -> Payment:
    payment = Payment(**kwargs)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def get_by_order_id(db: Session, order_id: str) -> Payment | None:
    return db.query(Payment).filter(Payment.razorpay_order_id == order_id).first()


def save(db: Session, payment: Payment) -> Payment:
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def list_for_user(db: Session, user_id: str):
    return db.query(Payment).filter(Payment.user_id == user_id).order_by(Payment.created_at.desc()).all()
