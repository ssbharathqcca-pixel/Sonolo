"""Integration tests for the session feedback API endpoint (SN-011 + auth)."""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app

SESSION_ID = "00000000-0000-4000-8000-0000000000aa"
FEEDBACK_PATH = f"/api/sessions/{SESSION_ID}/feedback"


@pytest.fixture
def client(db_engine, db_session) -> Iterator[TestClient]:
    """App client with the DB session overridden (auth hits the DB)."""
    app = create_app(Settings(_env_file=None))

    def override_session():
        yield db_session

    app.dependency_overrides[get_db] = override_session
    with TestClient(app) as test_client:
        yield test_client


def make_body(
    user_text: str = "Could I get a medium double-double please?",
    session_id: str = SESSION_ID,
    duration: float = 4.0,
) -> dict:
    return {
        "session_id": session_id,
        "transcript": [
            {"role": "tutor", "text": "Welcome! What can I get you?"},
            {"role": "user", "text": user_text},
        ],
        "scenario_targets": {"vocabulary": ["double-double"], "grammar": []},
        "duration_seconds": duration,
    }


def auth_headers(client: TestClient) -> dict[str, str]:
    register = client.post(
        "/api/auth/register",
        json={
            "email": "pavan@example.com",
            "name": "Pavan",
            "password": "maple-syrup-99",
            "native_language": "hi",
            "target_language": "en-CA",
        },
    )
    assert register.status_code == 201
    login = client.post(
        "/api/auth/login",
        json={"email": "pavan@example.com", "password": "maple-syrup-99"},
    )
    assert login.status_code == 200
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


def test_feedback_returns_full_structure(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post(FEEDBACK_PATH, json=make_body(), headers=headers)

    assert response.status_code == 200
    body = response.json()
    assert 0.0 <= body["speaking_power_score"] <= 100.0
    assert {skill["dimension"] for skill in body["skills"]} == {
        "fluency", "pronunciation", "grammar",
        "vocabulary", "coherence", "task_completion",
    }
    for skill in body["skills"]:
        assert 0.0 <= skill["score"] <= 100.0
        assert skill["feedback"]
    assert isinstance(body["xp_earned"], int)
    assert body["insights"]


def test_feedback_evaluates_transcript_content(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post(
        FEEDBACK_PATH, json=make_body(duration=2.0), headers=headers
    )

    assert response.status_code == 200
    body = response.json()
    insight_texts = [insight["text"] for insight in body["insights"]]
    assert any("Excellent use of the word 'double-double'" in t for t in insight_texts)
    assert any(t == "Great speaking pace!" for t in insight_texts)


def test_feedback_rejects_session_id_mismatch(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post(
        FEEDBACK_PATH,
        json=make_body(session_id="00000000-0000-4000-8000-0000000000bb"),
        headers=headers,
    )

    assert response.status_code == 422
    assert "match" in response.json()["detail"]


def test_feedback_rejects_invalid_body(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post(
        FEEDBACK_PATH, json={"session_id": SESSION_ID}, headers=headers
    )

    assert response.status_code == 422


def test_feedback_requires_authentication(client: TestClient) -> None:
    response = client.post(FEEDBACK_PATH, json=make_body())
    assert response.status_code == 401
