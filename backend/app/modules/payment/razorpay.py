"""
Thin wrapper around the `razorpay` Python SDK. Uses Razorpay's test-mode keys by default
(see app/core/config.py) — swap in live keys via environment variables for production.
"""
from __future__ import annotations
import hmac
import hashlib

import razorpay

from app.core.config import settings
from app.core.exceptions import AppException


def _client() -> razorpay.Client:
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    return client


def create_order(amount_paise: int, receipt: str, notes: dict | None = None) -> dict:
    client = _client()
    try:
        order = client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "notes": notes or {},
            "payment_capture": 1,
        })
        return order
    except Exception as e:
        raise AppException(f"Could not create payment order: {e}", status_code=502, error_code="PAYMENT_GATEWAY_ERROR")


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    client = _client()
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
        })
        return True
    except razorpay.errors.SignatureVerificationError:
        return False


def verify_webhook_signature(raw_body: bytes, signature: str) -> bool:
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
