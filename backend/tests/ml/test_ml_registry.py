from app.ml.registry.model_registry import list_disease_slugs, get_disease_summary
from app.ml.registry.model_factory import get_model


def test_all_sixteen_diseases_registered():
    slugs = list_disease_slugs()
    assert len(slugs) == 16
    assert "heart" in slugs and "diabetes" in slugs and "breast_cancer" in slugs


def test_heart_model_loads_and_predicts():
    model = get_model("heart")
    proba = model.predict_proba({
        "age": 63, "sex": "1", "cp": 3, "trestbps": 150, "chol": 270, "fbs": 1,
        "restecg": 0, "thalach": 120, "exang": 1, "oldpeak": 2.5, "slope": 0, "ca": 2, "thal": 3,
    })
    assert 0.0 <= proba <= 1.0


def test_disease_summary_reports_real_vs_synthetic_source():
    heart = get_disease_summary("heart")
    stroke = get_disease_summary("stroke")
    assert heart["data_source"] == "public_dataset"
    assert stroke["data_source"] == "synthetic_demo"
