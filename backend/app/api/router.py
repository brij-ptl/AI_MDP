from fastapi import APIRouter

from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.users.router import router as users_router
from app.modules.dashboard.router import router as dashboard_router
from app.modules.prediction.router import router as prediction_router
from app.modules.symptom_checker.router import router as symptom_checker_router
from app.modules.ocr.router import router as ocr_router
from app.modules.recommendation.router import router as recommendation_router
from app.modules.reports.router import router as reports_router
from app.modules.history.router import router as history_router
from app.modules.notifications.router import router as notifications_router
from app.modules.subscription.router import router as subscription_router
from app.modules.payment.router import router as payment_router
from app.modules.analytics.router import router as analytics_router
from app.modules.admin.router import router as admin_router

api_router = APIRouter(prefix=settings.API_V1_PREFIX)

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(dashboard_router)
api_router.include_router(prediction_router)
api_router.include_router(symptom_checker_router)
api_router.include_router(ocr_router)
api_router.include_router(recommendation_router)
api_router.include_router(reports_router)
api_router.include_router(history_router)
api_router.include_router(notifications_router)
api_router.include_router(subscription_router)
api_router.include_router(payment_router)
api_router.include_router(analytics_router)
api_router.include_router(admin_router)
