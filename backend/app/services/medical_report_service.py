"""LLM-backed, safety-constrained clinical narrative generation.

The ML pipeline remains responsible only for the prediction, probability, risk
level, and feature importance.  This service converts that bounded evidence into
a patient-facing report and never changes the ML result.
"""
from __future__ import annotations

import json
import logging
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.core.config import settings
from app.ml.common.base_predictor import PredictionResult

logger = logging.getLogger(__name__)

SECTION_HEADINGS = (
    "Clinical Summary",
    "Why This Prediction Was Made",
    "Medical Interpretation",
    "Risk Assessment",
    "Immediate Recommendations",
    "Foods to Prefer",
    "Foods to Limit or Avoid",
    "Lifestyle Advice",
    "When to Consult a Doctor",
    "Suggested Medical Tests",
    "Disclaimer",
)


def build_clinical_report(result: PredictionResult, disease_cfg: dict[str, Any],
                          raw_features: dict[str, Any], profile: dict[str, Any] | None) -> str:
    """Generate a structured narrative from model evidence and supplied context only."""
    context = _report_context(result, disease_cfg, raw_features, profile)
    if settings.LLM_ENABLED:
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("LLM_ENABLED requires OPENAI_API_KEY for clinical report generation.")
        report = _generate_with_openai(context)
        if _is_complete_report(report):
            return report.strip()
        raise RuntimeError("The LLM returned an incomplete clinical report; the prediction was not saved.")

    # Offline/test environments deliberately use an evidence-labelled fallback.
    # Production must set LLM_ENABLED=true so a language model writes the narrative.
    return _offline_structured_report(context)


def _report_context(result: PredictionResult, disease_cfg: dict[str, Any], raw_features: dict[str, Any],
                    profile: dict[str, Any] | None) -> dict[str, Any]:
    schema = {field["name"]: field for field in disease_cfg.get("feature_schema", [])}
    important_factors = []
    for item in (result.feature_importance or [])[:6]:
        name = item.get("feature", "").replace(" ", "_")
        field = schema.get(name, {})
        important_factors.append({
            "feature": field.get("label", item.get("feature", name)),
            "observed_value": raw_features.get(name),
            "unit": field.get("unit", ""),
            "model_direction": item.get("direction", "was influential"),
            "contribution": item.get("contribution"),
        })

    safe_profile = {
        key: value for key, value in (profile or {}).items()
        if key in {"age", "gender", "bmi", "smoking", "alcohol", "physical_activity", "family_history", "existing_conditions"}
        and value not in (None, "")
    }
    return {
        "disease": {
            "name": disease_cfg["name"],
            "overview": disease_cfg.get("overview", ""),
            "known_risk_factors": disease_cfg.get("risk_factors", []),
            "recommended_tests": disease_cfg.get("recommended_tests", []),
            "recommended_specialist": disease_cfg.get("recommended_specialist"),
        },
        "ml_assessment": {
            "predicted_label": result.prediction_label,
            "probability_percent": round(result.probability * 100, 1),
            "confidence_percent": round(result.confidence_score * 100, 1),
            "risk_level": result.risk_level,
            "feature_importance": important_factors,
        },
        "observed_inputs": raw_features,
        "patient_context": safe_profile,
    }


def _generate_with_openai(context: dict[str, Any]) -> str:
    instructions = """You are writing a cautious patient-facing clinical interpretation for an AI health-screening product.
The ML assessment is screening evidence, not a diagnosis. Use only the supplied context; never invent symptoms, laboratory reference ranges, diagnoses, medications, test results, patient history, or causal certainty. Clearly distinguish observed inputs from AI interpretation. Do not claim to replace a clinician.

Return 700-1200 words in plain text with exactly these section headings, each followed by a substantive paragraph or practical bullet-style sentences:
Clinical Summary
Why This Prediction Was Made
Medical Interpretation
Risk Assessment
Immediate Recommendations
Foods to Prefer
Foods to Limit or Avoid
Lifestyle Advice
When to Consult a Doctor
Suggested Medical Tests
Disclaimer

Interpret feature importance as model influence, not proof of disease. Explain relevant mechanisms cautiously and use practical, compassionate language. In the warning-sign section, give only appropriate general escalation advice, and say emergency services should be used for severe or rapidly worsening symptoms. The final disclaimer must state that this is an AI-assisted assessment, not a confirmed diagnosis, and that a qualified physician should be consulted."""
    payload = {
        "model": settings.OPENAI_MODEL,
        "instructions": instructions,
        "input": json.dumps(context, ensure_ascii=False),
        "max_output_tokens": 2200,
        "store": False,
    }
    request = Request(
        settings.OPENAI_RESPONSES_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=settings.LLM_TIMEOUT_SECONDS) as response:
            body = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        logger.warning("Clinical report LLM request failed with HTTP %s", exc.code)
        raise RuntimeError("Clinical report generation is temporarily unavailable.") from exc
    except (URLError, TimeoutError) as exc:
        logger.warning("Clinical report LLM connection failed: %s", exc)
        raise RuntimeError("Clinical report generation is temporarily unavailable.") from exc

    return _extract_output_text(body)


def _extract_output_text(response: dict[str, Any]) -> str:
    if isinstance(response.get("output_text"), str):
        return response["output_text"]
    text_parts: list[str] = []
    for output in response.get("output", []):
        for content in output.get("content", []):
            if content.get("type") == "output_text" and isinstance(content.get("text"), str):
                text_parts.append(content["text"])
    return "\n".join(text_parts)


def _is_complete_report(report: str) -> bool:
    headings_present = all(heading.lower() in report.lower() for heading in SECTION_HEADINGS)
    word_count = len(report.split())
    return headings_present and 650 <= word_count <= 1300


def _offline_structured_report(context: dict[str, Any]) -> str:
    """Deterministic development fallback; it labels evidence rather than simulating a diagnosis."""
    disease = context["disease"]
    assessment = context["ml_assessment"]
    factors = assessment["feature_importance"]
    inputs = context["observed_inputs"]
    profile = context["patient_context"]
    factor_text = "; ".join(
        f"{factor['feature']} was recorded as {factor['observed_value']} {factor['unit']} and {factor['model_direction']}"
        for factor in factors if factor["observed_value"] is not None
    ) or "The model did not identify a single dominant supplied feature."
    input_summary = ", ".join(f"{key}: {value}" for key, value in list(inputs.items())[:10]) or "No individual inputs were recorded."
    profile_summary = ", ".join(f"{key.replace('_', ' ')}: {value}" for key, value in profile.items()) or "No additional profile details were supplied."
    tests = ", ".join(disease["recommended_tests"]) or "a clinician-selected evaluation"
    specialist = disease["recommended_specialist"] or "primary-care clinician"
    risk_factors = ", ".join(disease["known_risk_factors"][:5]) or "the factors reviewed in this assessment"

    return f"""Clinical Summary
This AI-assisted screening estimates the likelihood of {disease['name']} from the supplied information. {disease['overview']} The model returned {assessment['predicted_label']} with a {assessment['risk_level'].lower()} classification, an estimated probability of {assessment['probability_percent']}%, and model confidence of {assessment['confidence_percent']}%. These figures describe the model's pattern match and are not a confirmed diagnosis. The importance of this result depends on symptoms, examination findings, repeat testing, and a clinician's judgement.

Why This Prediction Was Made
Observed inputs included {input_summary}. The model's strongest recorded influences were: {factor_text}. These features were weighted by the model because their pattern in the supplied dataset was associated with its predicted category. They should not be read as independent proof that a condition is present. The available patient context was {profile_summary}; it was considered only where supplied and should be reviewed alongside a complete history.

Medical Interpretation
{disease['name']} can involve more than one biological pathway, so a screening result is best treated as a prompt for clinical review rather than a conclusion. The disease module considers risk patterns such as {risk_factors}. A clinician can determine whether the observed pattern reflects a temporary change, a modifiable risk factor, an established condition, or another explanation. If a condition is confirmed, earlier assessment can help identify complications and support appropriate prevention or treatment planning.

Risk Assessment
The model classified this assessment as {assessment['risk_level']}. This category reflects the supplied values and model weighting, not the severity of symptoms or an emergency triage decision. A higher probability may justify earlier follow-up, while a lower probability does not rule out illness when symptoms, family history, or clinical examination suggest otherwise. Discuss the result promptly with a clinician if it conflicts with how you feel or with previous medical results.

Immediate Recommendations
Arrange a non-urgent appointment with a {specialist} or your regular clinician to review this screen in context. Bring any recent laboratory reports, medication list, and relevant family history. Focus on regular meals built around minimally processed foods, adequate hydration, consistent sleep, gradual weight management when advised, and activity matched to your current health and mobility. Do not start, stop, or change prescribed medication based on this report alone.

Foods to Prefer
Choose a varied eating pattern centred on vegetables, fruit, pulses, whole grains, nuts or seeds where suitable, and lean or plant-based protein. Prefer high-fibre, minimally processed options and unsweetened drinks. Individual dietary advice should account for allergies, kidney or liver disease, pregnancy, cultural preferences, and clinician instructions. A dietitian can tailor portions and nutrient targets when a condition is confirmed.

Foods to Limit or Avoid
Limit heavily processed foods, excess added sugar, high-salt packaged foods, and frequent refined-carbohydrate snacks, as these can make cardiometabolic risk management harder for many people. Reduce alcohol or avoid it when advised by a clinician, and avoid tobacco exposure. There is no single food that confirms or cures {disease['name']}; sustainable overall habits are more useful than restrictive short-term diets.

Lifestyle Advice
Aim for regular physical activity appropriate to your fitness and medical status, combining movement, strength work, and less time sitting when safe. Keep a consistent sleep routine, use stress-management practices that are realistic for you, and seek support for smoking cessation if needed. Monitor changes in symptoms rather than relying only on this score. If you have chronic conditions or limited mobility, ask a clinician before beginning a vigorous exercise programme.

When to Consult a Doctor
Book follow-up soon to review this screening result, especially if you have persistent symptoms, a strong family history, or previous abnormal tests. Seek urgent medical assessment for severe, sudden, rapidly worsening, or concerning symptoms, including those that affect breathing, consciousness, chest discomfort, severe weakness, or new neurological changes. Use local emergency services for an emergency rather than waiting for an online report.

Suggested Medical Tests
The disease module suggests: {tests}. These are discussion points rather than automatic orders. A clinician may choose different tests, repeat a result, or add examination findings based on your age, symptoms, medications, and medical history. Testing is useful because it can confirm, refine, or contradict an AI screening estimate.

Disclaimer
This is an AI-assisted assessment based only on the information provided and is not a confirmed diagnosis. It does not replace a medical examination, laboratory interpretation, or advice from a qualified physician. Please consult a qualified healthcare professional for diagnosis, treatment decisions, and personalised follow-up."""
