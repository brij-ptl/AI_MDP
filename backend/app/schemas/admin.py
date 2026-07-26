from pydantic import BaseModel, Field


class PredictionTokenUpdateRequest(BaseModel):
    operation: str  # add | remove | set | reset
    amount: int | None = Field(default=None, ge=0)
    reason: str | None = Field(default=None, max_length=500)
