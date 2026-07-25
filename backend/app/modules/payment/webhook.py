"""Razorpay webhook endpoint logic — verifies the HMAC signature header before processing."""
from fastapi import Request
from sqlalchemy.orm import Session

from app.core.exceptions import UnauthorizedException
from app.modules.payment import razorpay as rp
from app.modules.payment import service as payment_service


async def handle_razorpay_webhook(request: Request, db: Session) -> dict:
    raw_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not rp.verify_webhook_signature(raw_body, signature):
        raise UnauthorizedException("Invalid webhook signature.")

    event = await request.json()
    payment_service.handle_webhook_event(db, event)
    return {"status": "ok"}
