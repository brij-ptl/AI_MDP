from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.database.models.user import User
from app.schemas.payment import CreateOrderRequest, VerifyPaymentRequest, PaymentOut
from app.modules.payment import controller
from app.modules.payment.webhook import handle_razorpay_webhook
from app.utils.response import success_response

router = APIRouter(prefix="/payment", tags=["Payment"])


@router.post("/create-order")
def create_order(payload: CreateOrderRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    data = controller.handle_create_order(db, user, payload)
    return success_response(data, "Order created.")


@router.post("/verify")
def verify_payment(payload: VerifyPaymentRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    data = controller.handle_verify_payment(db, user, payload)
    return success_response(data, "Payment verified. Premium activated!")


@router.get("/history")
def payment_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    payments = controller.handle_list_payments(db, user)
    return success_response([PaymentOut.model_validate(p) for p in payments], "Payment history fetched.")


@router.post("/webhook", include_in_schema=False)
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    return await handle_razorpay_webhook(request, db)
