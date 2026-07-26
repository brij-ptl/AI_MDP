from __future__ import annotations
import uuid

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import ValidationException
from app.modules.payment import repository as payment_repo
from app.modules.payment import razorpay as rp
from app.modules.subscription import service as sub_service
from app.services.notification_service import notify_payment_success
from app.services.email_service import send_payment_receipt_email
from app.database.models.user import User

PLAN_AMOUNTS = {
    "starter": settings.STARTER_PRICE_INR,
    "care_plus": settings.CARE_PLUS_PRICE_INR,
    "family": settings.FAMILY_PRICE_INR,
    "annual": settings.ANNUAL_PRICE_INR,
    # Preserve compatibility for orders initiated by an earlier frontend build.
    "premium_monthly": settings.CARE_PLUS_PRICE_INR,
    "premium_yearly": settings.ANNUAL_PRICE_INR,
}


def create_order(db: Session, user: User, plan: str) -> dict:
    if plan not in PLAN_AMOUNTS:
        raise ValidationException("Invalid subscription plan selected.")
    amount = PLAN_AMOUNTS[plan]
    receipt = f"rcpt_{uuid.uuid4().hex[:16]}"

    order = rp.create_order(amount, receipt, notes={"user_id": user.id, "plan": plan})

    payment_repo.create_payment(
        db, user_id=user.id, plan=plan, amount=amount, currency="INR",
        status="created", razorpay_order_id=order["id"],
    )
    return {
        "order_id": order["id"], "amount": amount, "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID, "plan": plan,
    }


def verify_and_activate(db: Session, user: User, order_id: str, payment_id: str, signature: str) -> dict:
    payment = payment_repo.get_by_order_id(db, order_id)
    if not payment or payment.user_id != user.id:
        raise ValidationException("Order not found for this user.")

    is_valid = rp.verify_payment_signature(order_id, payment_id, signature)
    if not is_valid:
        payment.status = "failed"
        payment_repo.save(db, payment)
        raise ValidationException("Payment verification failed. If money was deducted, it will be refunded.")

    payment.status = "success"
    payment.razorpay_payment_id = payment_id
    payment.razorpay_signature = signature
    payment_repo.save(db, payment)

    sub_service.activate_premium(db, user.id, payment.plan)
    notify_payment_success(db, user.id, payment.plan)
    send_payment_receipt_email(user.email, user.full_name, payment.plan, payment.amount / 100)

    return {"status": "success", "plan": payment.plan}


def handle_webhook_event(db: Session, event: dict) -> None:
    """Handles Razorpay server-to-server webhook events (payment.captured / payment.failed)
    as a durability backstop in case the client-side verify call never completes."""
    event_type = event.get("event")
    payload = event.get("payload", {}).get("payment", {}).get("entity", {})
    order_id = payload.get("order_id")
    if not order_id:
        return

    payment = payment_repo.get_by_order_id(db, order_id)
    if not payment:
        return

    if event_type == "payment.captured" and payment.status != "success":
        payment.status = "success"
        payment.razorpay_payment_id = payload.get("id")
        payment.raw_webhook_payload = event
        payment_repo.save(db, payment)
        sub_service.activate_premium(db, payment.user_id, payment.plan)
    elif event_type == "payment.failed":
        payment.status = "failed"
        payment.raw_webhook_payload = event
        payment_repo.save(db, payment)
