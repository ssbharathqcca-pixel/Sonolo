"""Integration tests for the session feedback API endpoint."""

from fastapi.testclient import TestClient

SESSION_ID = "00000000-0000-4000-8000-0000000000aa"
FEEDBACK_PATH = f"/api/sessions/{SESSION_ID}/feedback"


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


def test_feedback_returns_full_structure(client: TestClient) -> None:
    response = client.post(FEEDBACK_PATH, json=make_body())

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
    response = client.post(FEEDBACK_PATH, json=make_body(duration=2.0))

    assert response.status_code == 200
    body = response.json()
    insight_texts = [insight["text"] for insight in body["insights"]]
    assert any("Excellent use of the word 'double-double'" in t for t in insight_texts)
    assert any(t == "Great speaking pace!" for t in insight_texts)


def test_feedback_rejects_session_id_mismatch(client: TestClient) -> None:
    response = client.post(
        FEEDBACK_PATH,
        json=make_body(session_id="00000000-0000-4000-8000-0000000000bb"),
    )

    assert response.status_code == 422
    assert "match" in response.json()["detail"]


def test_feedback_rejects_invalid_body(client: TestClient) -> None:
    response = client.post(FEEDBACK_PATH, json={"session_id": SESSION_ID})

    assert response.status_code == 422
