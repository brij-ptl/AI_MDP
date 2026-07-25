from datetime import datetime
from pydantic import BaseModel


class SubscriptionOut(BaseModel):
    plan: str
    status: str
    predictions_used: int
    symptom_checks_used: int
    free_predictions_limit: int
    free_symptom_checks_limit: int
    is_premium_active: bool
    starts_at: datetime | None = None
    expires_at: datetime | None = None

    class Config:
        from_attributes = True
