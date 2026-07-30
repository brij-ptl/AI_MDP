"""
Builds the downloadable PDF health report for a single prediction: patient details,
risk badge, a matplotlib feature-importance chart ("figure"), the doctor-voice
explanation, recommended tests/specialist, and a medical disclaimer — matching the
proposal's "AI Generated Report" spec.
"""
from __future__ import annotations
from html import escape
import io
import re

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, Image as RLImage, ListFlowable, ListItem
from reportlab.lib import colors
from reportlab.lib.units import mm

from app.services.pdf_service import new_document, get_styles, divider, risk_badge_table, footer_text
from app.ml.registry.model_loader import load_disease_config
from app.services.medical_report_service import SECTION_HEADINGS


def _render_feature_importance_chart(feature_importance: list[dict]) -> io.BytesIO:
    if not feature_importance:
        feature_importance = []
    labels = [f["feature"].title() for f in feature_importance][::-1]
    values = [f["contribution"] for f in feature_importance][::-1]
    colors_bar = ["#DC2626" if v > 0 else "#16A34A" for v in values]

    fig, ax = plt.subplots(figsize=(6, 2.6), dpi=150)
    if labels:
        ax.barh(labels, values, color=colors_bar)
    ax.set_xlabel("Contribution to risk (this specific result)")
    ax.set_title("What influenced this result the most", fontsize=10, loc="left")
    ax.axvline(0, color="#9CA3AF", linewidth=0.8)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    return buf


def _clinical_report_sections(report: str) -> list[tuple[str, str]]:
    """Split the stored LLM report into PDF headings without changing its API field."""
    sections: list[tuple[str, str]] = []
    matches = []
    for heading in SECTION_HEADINGS:
        match = re.search(rf"(?im)^\s*{re.escape(heading)}\s*:?[ \t]*$", report)
        if match:
            matches.append((match.start(), match.end(), heading))
    for index, (_, end, heading) in enumerate(matches):
        next_start = matches[index + 1][0] if index + 1 < len(matches) else len(report)
        content = report[end:next_start].strip()
        if content:
            sections.append((heading, content))
    return sections


def generate_prediction_report_pdf(prediction, user_name: str) -> bytes:
    cfg = load_disease_config(prediction.disease_slug)
    styles = get_styles()
    buffer = io.BytesIO()
    doc = new_document(buffer)
    story = []

    story.append(Paragraph("Nidaan+", styles["BrandTitle"]))
    story.append(Paragraph("AI-Enabled Multi-Disease Prediction and Precision Healthcare Platform", styles["SectionHeading"]))
    story.append(Paragraph(f"{cfg['name']} — AI Risk Assessment Report", styles["SectionHeading"]))
    story.append(divider())

    patient_table = Table([
        ["Patient", user_name, "Report Date", prediction.created_at.strftime("%d %b %Y")],
        ["Module", cfg["name"], "Category", cfg["category"]],
    ], colWidths=[70, 160, 70, 160])
    patient_table.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 10))

    story.append(risk_badge_table(prediction.risk_level, prediction.probability, prediction.confidence_score))
    story.append(Spacer(1, 14))

    if prediction.feature_importance:
        chart_buf = _render_feature_importance_chart(prediction.feature_importance)
        story.append(RLImage(chart_buf, width=460, height=200))
        story.append(Spacer(1, 6))

    clinical_sections = _clinical_report_sections(prediction.doctor_explanation or "")
    if clinical_sections:
        for heading, content in clinical_sections:
            story.append(Paragraph(heading, styles["SectionHeading"]))
            story.append(Paragraph(escape(content).replace("\n", "<br/>"), styles["Body"]))
            story.append(Spacer(1, 8))
    else:
        story.append(Paragraph("Clinical Interpretation", styles["SectionHeading"]))
        story.append(Paragraph(escape(prediction.doctor_explanation or "No explanation available."), styles["Body"]))
        story.append(Spacer(1, 8))

    if prediction.recommendations:
        story.append(Paragraph("Personalized Recommendations", styles["SectionHeading"]))
        story.append(ListFlowable(
            [ListItem(Paragraph(r, styles["Body"])) for r in prediction.recommendations],
            bulletType="bullet",
        ))
        story.append(Spacer(1, 8))

    if prediction.recommended_tests:
        story.append(Paragraph("Recommended Tests", styles["SectionHeading"]))
        story.append(Paragraph(", ".join(prediction.recommended_tests), styles["Body"]))
        story.append(Spacer(1, 4))

    if prediction.recommended_specialist:
        story.append(Paragraph(f"<b>Recommended Specialist:</b> {prediction.recommended_specialist}", styles["Body"]))
        story.append(Spacer(1, 10))

    if not clinical_sections:
        story.append(Paragraph("Disease Overview", styles["SectionHeading"]))
        story.append(Paragraph(cfg.get("overview", ""), styles["Body"]))
        story.append(Spacer(1, 14))

    story.append(divider())
    story.append(Paragraph(footer_text(), styles["Small"]))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
