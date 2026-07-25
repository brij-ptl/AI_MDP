from app.modules.prediction.exceptions import DiseaseNotFoundException
from app.ml.registry.model_registry import list_disease_slugs


def assert_valid_disease(slug: str) -> None:
    if slug not in list_disease_slugs():
        raise DiseaseNotFoundException(slug)
