from datetime import datetime
from pydantic import BaseModel


class CreateOrderRequest(BaseModel):
    plan: str    # starter | care_plus | family | annual (legacy premium IDs are also accepted)


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str
    plan: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentOut(BaseModel):
    id: str
    plan: str
    amount: int
    currency: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
