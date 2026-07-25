def test_symptom_analysis_matches_relevant_diseases(client, registered_user):
    resp = client.post("/api/v1/symptom-checker/analyze", json={
        "text": "I have chest pain, shortness of breath and fatigue for the last two days",
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert "chest pain" in data["detected_symptoms"]
    assert len(data["possible_diseases"]) > 0


def test_symptom_analysis_rejects_too_short_input(client, registered_user):
    resp = client.post("/api/v1/symptom-checker/analyze", json={"text": "sick"})
    assert resp.status_code in (400, 422)
