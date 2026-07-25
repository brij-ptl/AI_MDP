"""
Builds a symptom -> disease keyword knowledge base from each disease's `common_symptoms`
(declared in config.json), augmented with a few synonym expansions. Used by
app/modules/symptom_checker to score free-text symptom descriptions against diseases
without requiring a heavy NLP model.
"""
from __future__ import annotations
import re
from functools import lru_cache

from app.ml.registry.model_registry import list_disease_slugs
from app.ml.registry.model_loader import load_disease_config

SYNONYMS = {
    "headache": ["head pain", "head ache", "migraine"],
    "fever": ["high temperature", "temperature", "feverish"],
    "fatigue": ["tiredness", "tired", "exhausted", "low energy", "weakness"],
    "chest pain": ["chest tightness", "chest discomfort", "chest pressure"],
    "shortness of breath": ["breathless", "breathing difficulty", "difficulty breathing", "cant breathe"],
    "dizziness": ["dizzy", "lightheaded", "light headed", "giddiness"],
    "nausea": ["feeling sick", "queasy", "vomiting", "vomit"],
    "joint pain": ["joint ache", "arthralgia"],
    "abdominal pain": ["stomach pain", "belly pain", "stomach ache", "tummy pain"],
    "blurred vision": ["blurry vision", "vision problems", "cant see clearly"],
    "frequent urination": ["peeing a lot", "urinating often", "frequent pee"],
    "increased thirst": ["very thirsty", "excessive thirst"],
    "weight loss": ["losing weight", "lost weight"],
    "cough": ["coughing", "persistent cough"],
    "swelling": ["swollen", "edema"],
    "numbness": ["numb", "tingling", "pins and needles"],
    "tremor": ["shaking", "trembling"],
    "memory loss": ["forgetful", "forgetting things", "memory problems"],
    "pale skin": ["paleness", "looking pale"],
}


def _normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


@lru_cache(maxsize=1)
def build_symptom_knowledge_base() -> dict[str, dict]:
    """Returns {disease_slug: {"name":..., "symptom_phrases": [...]}}"""
    kb = {}
    for slug in list_disease_slugs():
        cfg = load_disease_config(slug)
        phrases = set()
        for s in cfg.get("common_symptoms", []):
            base = _normalize(s)
            phrases.add(base)
            for canon, syns in SYNONYMS.items():
                if canon in base:
                    phrases.update(syns)
        kb[slug] = {
            "name": cfg["name"],
            "category": cfg["category"],
            "symptom_phrases": sorted(phrases),
            "recommended_tests": cfg.get("recommended_tests", []),
            "recommended_specialist": cfg.get("recommended_specialist"),
            "overview": cfg.get("overview"),
        }
    return kb
