"""
Module-local façade over app.ml.registry, so the prediction module only ever imports
from here rather than reaching into app.ml directly — keeps the ML layer swappable
without touching this module's public surface.
"""
from app.ml.registry.model_registry import list_disease_slugs, get_disease_summary, list_all_disease_summaries
from app.ml.registry.model_loader import load_disease_config

__all__ = ["list_disease_slugs", "get_disease_summary", "list_all_disease_summaries", "load_disease_config"]
