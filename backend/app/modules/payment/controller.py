from sqlalchemy.orm import Session

from app.database.models.user import User
from app.modules.payment import service as payment_service
from app.modules.payment import repository as payment_repo
from app.schemas.payment import CreateOrderRequest, VerifyPaymentRequest


def handle_create_order(db: Session, user: User, payload: CreateOrderRequest) -> dict:
    return payment_service.create_order(db, user, payload.plan)


def handle_verify_payment(db: Session, user: User, payload: VerifyPaymentRequest) -> dict:
    return payment_service.verify_and_activate(
        db, user, payload.razorpay_order_id, payload.razorpay_payment_id, payload.razorpay_signature
    )


def handle_list_payments(db: Session, user: User):
    return payment_repo.list_for_user(db, user.id)
