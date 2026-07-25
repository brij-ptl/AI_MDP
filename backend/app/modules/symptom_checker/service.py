"""
Rule-based symptom analyzer: normalizes the user's free-text description, then scores it
against every disease's symptom-phrase set (built in app.ml.registry.disease_mapper from
each config.json's `common_symptoms` + synonym expansion). This avoids depending on a
heavyweight NLP model while still handling natural language like "I have a headache,
fever and body pain for the last three days."
"""
from __future__ import annotations
import re

from app.ml.registry.disease_mapper import build_symptom_knowledge_base, _normalize


def _extract_detected_symptoms(text: str, kb: dict) -> set[str]:
    normalized = _normalize(text)
    detected = set()
    all_phrases = {phrase for entry in kb.values() for phrase in entry["symptom_phrases"]}
    for phrase in all_phrases:
        if phrase and phrase in normalized:
            detected.add(phrase)
    return detected


def analyze(text: str, top_k: int = 3) -> dict:
    kb = build_symptom_knowledge_base()
    detected = _extract_detected_symptoms(text, kb)

    scored = []
    for slug, entry in kb.items():
        phrase_set = set(entry["symptom_phrases"])
        matched = detected & phrase_set
        if not matched:
            continue
        confidence = min(0.95, len(matched) / max(len(phrase_set), 1) * 1.8 + 0.1 * len(matched))
        scored.append({
            "slug": slug, "name": entry["name"], "category": entry["category"],
            "confidence": round(confidence, 3), "matched_symptoms": sorted(matched),
            "overview": entry["overview"], "recommended_tests": entry["recommended_tests"],
            "recommended_specialist": entry["recommended_specialist"],
        })

    scored.sort(key=lambda x: -x["confidence"])
    top = scored[:top_k]

    next_steps = (
        ["Book an appointment with the suggested specialist(s) below for a proper clinical evaluation.",
         "Get the recommended tests done to confirm or rule out these possibilities.",
         "Monitor your symptoms and seek urgent care if they worsen suddenly."]
        if top else
        ["We couldn't confidently match your symptoms to a specific module. Please consult a "
         "general physician for an in-person evaluation."]
    )

    return {
        "input_text": text,
        "detected_symptoms": sorted(detected),
        "possible_diseases": top,
        "next_steps": next_steps,
        "disclaimer": "This AI symptom analysis is for informational purposes only and is not a "
                       "medical diagnosis. Always consult a qualified healthcare professional.",
    }
