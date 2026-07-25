from datetime import datetime
from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=2000)
    category: str = "general"
    prediction_id: str | None = None


class FeedbackOut(BaseModel):
    id: str
    rating: int
    comment: str | None
    category: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
