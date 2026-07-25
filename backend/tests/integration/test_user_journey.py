def test_full_user_journey(client, registered_user):
    """register -> profile -> predict -> report -> dashboard, matching the proposal's user journey."""
    email = registered_user.json()["user"]["email"]
    assert email

    profile_resp = client.put("/api/v1/users/me/medical-profile", json={
        "age": 45, "gender": "male", "height_cm": 175, "weight_kg": 80,
    })
    assert profile_resp.status_code == 200

    predict_resp = client.post("/api/v1/prediction/heart", json={"features": {
        "age": 55, "sex": "1", "cp": 2, "trestbps": 140, "chol": 240, "fbs": 0,
        "restecg": 1, "thalach": 140, "exang": 0, "oldpeak": 1.0, "slope": 1, "ca": 0, "thal": 2,
    }})
    assert predict_resp.status_code == 200
    prediction_id = predict_resp.json()["data"]["id"]

    report_resp = client.post(f"/api/v1/reports/generate/{prediction_id}")
    assert report_resp.status_code == 200

    dashboard_resp = client.get("/api/v1/dashboard/overview")
    assert dashboard_resp.status_code == 200
    assert dashboard_resp.json()["data"]["total_predictions"] >= 1
