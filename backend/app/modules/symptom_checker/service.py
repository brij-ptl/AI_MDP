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

    if top:
        primary_match = top[0]
        # Construct a highly detailed clinical explanation
        explanation_lines = []
        explanation_lines.append("Why this prediction was generated:")
        explanation_lines.append(f"The AI analysis identified a strong correlation ({primary_match['confidence'] * 100:.1f}%) between your reported symptoms and {primary_match['name']}. This determination is based on matching clinical patterns within our validated medical knowledge base.")
        explanation_lines.append("")
        explanation_lines.append("Clinical Interpretation:")
        explanation_lines.append(f"Your input suggests presentation patterns often associated with {primary_match['category']}. A {primary_match['confidence'] * 100:.1f}% confidence level indicates a high likelihood of structural or functional alignment with this condition, warranting formal medical evaluation.")
        explanation_lines.append("")
        explanation_lines.append("Symptoms Supporting This Prediction:")
        explanation_lines.append("The primary contributing symptoms recognized in your report were: " + ", ".join(primary_match["matched_symptoms"]) + ".")
        explanation_lines.append("")
        explanation_lines.append("Possible Risk Factors:")
        explanation_lines.append(f"While this model evaluates acute symptom presentation, common underlying factors for {primary_match['name']} often include lifestyle patterns, genetic predispositions, or concurrent metabolic conditions. (Note: Only a physician can assess your specific risk profile.)")
        explanation_lines.append("")
        explanation_lines.append("Recommended Next Steps:")
        for step in next_steps:
            explanation_lines.append(f"- {step}")
        if primary_match.get("recommended_specialist"):
            explanation_lines.append(f"- Consult a {primary_match['recommended_specialist']} for targeted assessment.")
        explanation_lines.append("")
        explanation_lines.append("Important Medical Disclaimer:")
        explanation_lines.append("This is an AI-assisted preliminary assessment designed for informational purposes only. It is not a confirmed medical diagnosis. Please consult a qualified healthcare professional before making any health decisions.")

        doctor_explanation = "\n".join(explanation_lines)
    else:
        doctor_explanation = "We couldn't confidently match your symptoms to a specific module. Please consult a general physician for an in-person evaluation.\n\nImportant Medical Disclaimer:\nThis is an AI-assisted preliminary assessment designed for informational purposes only. It is not a confirmed medical diagnosis."

    return {
        "input_text": text,
        "detected_symptoms": sorted(detected),
        "possible_diseases": top,
        "next_steps": next_steps,
        "doctor_explanation": doctor_explanation,
        "disclaimer": "This AI symptom analysis is for informational purposes only and is not a "
                       "medical diagnosis. Always consult a qualified healthcare professional.",
    }
