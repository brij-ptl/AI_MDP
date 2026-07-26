HEART_FEATURES = {
    "age": 63, "sex": "1", "cp": 3, "trestbps": 150, "chol": 270, "fbs": 1,
    "restecg": 0, "thalach": 120, "exang": 1, "oldpeak": 2.5, "slope": 0, "ca": 2, "thal": 3,
}


def test_list_diseases(client):
    resp = client.get("/api/v1/prediction/diseases")
    assert resp.status_code == 200
    diseases = resp.json()["data"]
    assert len(diseases) == 16
    assert {"heart", "diabetes", "breast_cancer"}.issubset({d["slug"] for d in diseases})


def test_predict_heart_disease(client, registered_user):
    resp = client.post("/api/v1/prediction/heart", json={"features": HEART_FEATURES})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["risk_level"] in ("Low Risk", "Moderate Risk", "High Risk", "Critical Risk")
    assert 0 <= data["probability"] <= 1
    assert data["doctor_explanation"]


def test_free_tier_paywall_blocks_third_prediction(client, registered_user):
    r1 = client.post("/api/v1/prediction/heart", json={"features": HEART_FEATURES})
    r2 = client.post("/api/v1/prediction/diabetes", json={"features": {
        "pregnancies": 1, "glucose": 120, "diastolic": 70, "triceps": 20,
        "insulin": 80, "bmi": 25, "dpf": 0.4, "age": 40,
    }})
    r3 = client.post("/api/v1/prediction/kidney", json={"features": {"age": 55}})

    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r3.status_code == 402
    assert r3.json()["error_code"] == "FREE_LIMIT_REACHED"


def test_prediction_tokens_unlock_access_and_consume_one_credit(client, registered_user):
    """Regression coverage for token-backed access after the free trial is exhausted."""
    from app.database.models.user import User
    from app.database.session import SessionLocal

    email = registered_user.json()["user"]["email"]
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).one()
        user.prediction_tokens = 20
        db.commit()

    before = client.get("/api/v1/subscription/me")
    assert before.status_code == 200
    assert before.json()["data"]["prediction_access"] == {
        "can_predict": True,
        "access_source": "prediction_tokens",
        "predictions_remaining": 20,
    }

    prediction = client.post("/api/v1/prediction/heart", json={"features": HEART_FEATURES})
    assert prediction.status_code == 200

    after = client.get("/api/v1/subscription/me")
    assert after.status_code == 200
    assert after.json()["data"]["prediction_access"] == {
        "can_predict": True,
        "access_source": "prediction_tokens",
        "predictions_remaining": 19,
    }


def test_unknown_disease_returns_404(client, registered_user):
    resp = client.post("/api/v1/prediction/made_up_disease", json={"features": {}})
    assert resp.status_code == 404
