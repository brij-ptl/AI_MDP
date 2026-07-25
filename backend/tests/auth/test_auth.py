def test_register_and_me(client, registered_user):
    data = registered_user.json()
    assert data["success"] is True
    email = data["user"]["email"]

    me = client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == email


def test_duplicate_registration_rejected(client, registered_user):
    email = registered_user.json()["user"]["email"]
    resp = client.post("/api/v1/auth/register", json={
        "full_name": "Dup", "email": email, "password": "Passw0rd123",
    })
    assert resp.status_code == 409
    assert resp.json()["error_code"] == "EMAIL_EXISTS"


def test_login_wrong_password(client, registered_user):
    email = registered_user.json()["user"]["email"]
    resp = client.post("/api/v1/auth/login", json={
        "email": email, "password": "WrongPassword1",
    })
    assert resp.status_code == 401


def test_dashboard_requires_login(client):
    fresh_client = client.__class__(client.app)
    resp = fresh_client.get("/api/v1/dashboard/overview")
    assert resp.status_code == 401
