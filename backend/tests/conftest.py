import os
import tempfile
import uuid

import pytest
from fastapi.testclient import TestClient

# Point at an isolated throwaway SQLite file BEFORE importing the app, so tests never
# touch the real dev database.
_TMP_DB = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP_DB.name}"
os.environ["EMAIL_ENABLED"] = "False"

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def registered_user(client):
    """Registers (and logs in, via the returned cookies) a fresh, uniquely-emailed user
    for each test — keeping free-tier quota counters isolated between tests even though
    the underlying TestClient/DB is shared for the whole session."""
    email = f"pytest_{uuid.uuid4().hex[:10]}@example.com"
    resp = client.post("/api/v1/auth/register", json={
        "full_name": "Pytest User", "email": email, "password": "Passw0rd123", "phone": "9000000000",
    })
    assert resp.status_code == 200
    return resp
