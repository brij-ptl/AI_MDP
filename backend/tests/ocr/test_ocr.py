import io


def test_upload_rejects_unsupported_file_type(client, registered_user):
    resp = client.post(
        "/api/v1/ocr/upload",
        files={"file": ("report.txt", io.BytesIO(b"hello"), "text/plain")},
        data={"disease": "diabetes"},
    )
    assert resp.status_code == 422
    assert resp.json()["error_code"] == "VALIDATION_ERROR"
