from pydantic import BaseModel


class FeatureSchemaItem(BaseModel):
    name: str
    label: str
    type: str
    unit: str | None = None
    min: float | None = None
    max: float | None = None
    default: float | str | None = None
    categories: list[str] | None = None


class DiseaseSummaryOut(BaseModel):
    slug: str
    name: str
    category: str
    icon: str | None = None
    short_description: str | None = None
    risk_factors: list[str] = []
    common_symptoms: list[str] = []
    recommended_tests: list[str] = []
    recommended_specialist: str | None = None
    feature_schema: list[dict] = []
    data_source: str | None = None
    model_available: bool
    model_accuracy: float | None = None
    model_version: str | None = None
    trained_at: str | None = None
