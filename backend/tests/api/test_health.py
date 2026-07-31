def test_root_and_health(client):
    assert client.get("/").status_code == 200
    assert client.get("/health").json()["status"] == "healthy"


def test_docs_available(client):
    resp = client.get("/api/openapi.json")
    assert resp.status_code == 200
    assert "paths" in resp.json()
