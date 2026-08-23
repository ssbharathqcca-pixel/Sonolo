"""Tests for the voice WebSocket endpoint and session state machine.

Covers the SN-007 protocol/state machine plus the SN-014A token
authentication gate and user binding.
"""

import base64
import time
import uuid
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.api.ws import manager
from app.core.security import create_access_token
from app.voice.pipeline import MOCK_AI_RESPONSE, MOCK_USER_TRANSCRIPT

VOICE_PATH = "/ws/voice/{session_id}"
UNAUTHORIZED_CLOSE_CODE = 4401


def make_session_id() -> str:
    return str(uuid.uuid4())


def make_token(subject: str | None = None) -> str:
    """A signed JWT for an arbitrary user id (WS auth trusts the claim)."""
    return create_access_token({"sub": subject or str(uuid.uuid4())})


def ws_url(session_id: str, token: str | None = None) -> str:
    path = VOICE_PATH.format(session_id=session_id)
    return f"{path}?token={token}" if token is not None else path


def audio_chunk(session_id: str, audio: str = "YXVkaW8=") -> dict:
    return {
        "type": "audio_chunk",
        "payload": {"audio": audio, "session_id": session_id},
    }


def end_turn(session_id: str) -> dict:
    return {"type": "end_turn", "payload": {"session_id": session_id}}


def text_input(session_id: str, text: str) -> dict:
    return {
        "type": "text_input",
        "payload": {"text": text, "session_id": session_id},
    }


def cancel(session_id: str) -> dict:
    return {"type": "cancel", "payload": {"session_id": session_id}}


def expect_state(websocket, expected: str) -> dict:
    message = websocket.receive_json()
    assert message == {
        "type": "state_change",
        "payload": {"state": expected},
    }
    return message


def expect_error(websocket, expected_code: str) -> dict:
    message = websocket.receive_json()
    assert message["type"] == "error"
    assert message["payload"]["code"] == expected_code
    return message


def drain_until_idle(websocket) -> list[dict]:
    messages: list[dict] = []
    while True:
        message = websocket.receive_json()
        messages.append(message)
        if (
            message["type"] == "state_change"
            and message["payload"]["state"] == "idle"
        ):
            return messages


def connect(client: TestClient, session_id: str | None = None, user_id=None):
    """Open an authenticated socket (optionally for a specific user id)."""
    token = make_token(str(user_id) if user_id is not None else None)
    return client.websocket_connect(
        ws_url(session_id or make_session_id(), token)
    )


def assert_rejected(client: TestClient, url: str) -> None:
    """Connect and expect the unauthorized close code."""
    with pytest.raises(WebSocketDisconnect) as exc_info:
        with client.websocket_connect(url) as websocket:
            websocket.receive_json()
    assert exc_info.value.code == UNAUTHORIZED_CLOSE_CODE


def test_connection_sends_idle(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")


def test_audio_chunk_transitions_to_listening(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")


def test_end_turn_runs_full_pipeline(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")
        websocket.send_json(end_turn(session_id))

        messages = drain_until_idle(websocket)

    types = [message["type"] for message in messages]
    assert types == [
        "state_change",        # processing
        "ai_text_chunk",       # user transcript
        "ai_text_chunk",       # tutor reply
        "state_change",        # speaking
        "ai_audio_chunk",
        "ai_audio_chunk",
        "ai_audio_chunk",
        "turn_complete",
        "state_change",        # idle
    ]
    assert messages[1]["payload"] == {
        "text": MOCK_USER_TRANSCRIPT,
        "is_final": True,
    }
    assert messages[2]["payload"] == {
        "text": MOCK_AI_RESPONSE,
        "is_final": True,
    }
    for index in range(4, 7):
        decoded = base64.b64decode(messages[index]["payload"]["audio"])
        assert decoded == f"sonolo-tts-chunk-{index - 4}".encode()
    assert uuid.UUID(messages[7]["payload"]["turn_id"])


def test_text_input_runs_pipeline(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(text_input(session_id, "Hi, how much is a monthly pass?"))
        messages = drain_until_idle(websocket)

    assert messages[1]["payload"]["text"] == "Hi, how much is a monthly pass?"
    assert messages[-1]["payload"]["state"] == "idle"


def test_cancel_stops_turn_and_recovers(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(text_input(session_id, "Testing cancel."))
        expect_state(websocket, "processing")
        websocket.receive_json()  # user transcript
        websocket.receive_json()  # tutor reply
        expect_state(websocket, "speaking")

        websocket.send_json(cancel(session_id))
        expect_state(websocket, "idle")

        websocket.send_json(text_input(session_id, "Second turn after cancel."))
        expect_state(websocket, "processing")


def test_invalid_frames_return_errors(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")

        websocket.send_text("{not valid json")
        expect_error(websocket, "invalid_json")

        websocket.send_json({"type": "banana", "payload": {}})
        expect_error(websocket, "invalid_message")


def test_session_mismatch_returns_error(client: TestClient) -> None:
    session_id = make_session_id()
    other_session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(other_session_id))
        expect_error(websocket, "session_mismatch")

        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")


def test_silence_timeout_auto_ends_turn(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")

        messages = drain_until_idle(websocket)

    types = [message["type"] for message in messages]
    assert types[0:2] == ["state_change", "ai_text_chunk"]
    assert messages[0]["payload"]["state"] == "processing"
    assert types[-1] == "state_change"
    assert messages[-1]["payload"]["state"] == "idle"


def test_disconnect_cleans_up_session(client: TestClient) -> None:
    session_id = make_session_id()
    with connect(client, session_id) as websocket:
        expect_state(websocket, "idle")
        assert manager.get(uuid.UUID(session_id)) is not None
        assert manager.active_session_count == 1

    for _ in range(40):
        if manager.get(uuid.UUID(session_id)) is None:
            break
        time.sleep(0.05)

    assert manager.get(uuid.UUID(session_id)) is None
    assert manager.active_session_count == 0


# ---------------------------------------------------------------------
# SN-014A: authentication gate and user binding
# ---------------------------------------------------------------------


def test_missing_token_is_rejected(client: TestClient) -> None:
    assert_rejected(client, ws_url(make_session_id()))
    assert manager.active_session_count == 0


def test_invalid_token_is_rejected(client: TestClient) -> None:
    assert_rejected(client, ws_url(make_session_id(), token="not-a-real-jwt"))
    assert manager.active_session_count == 0


def test_expired_token_is_rejected(client: TestClient) -> None:
    expired = create_access_token(
        {"sub": str(uuid.uuid4())}, expires_delta=timedelta(minutes=-1)
    )
    assert_rejected(client, ws_url(make_session_id(), token=expired))


def test_authenticated_session_binds_user_id(client: TestClient) -> None:
    session_id = make_session_id()
    user_id = uuid.uuid4()
    with connect(client, session_id, user_id=user_id) as websocket:
        expect_state(websocket, "idle")
        bound = manager.get(uuid.UUID(session_id))
        assert bound is not None
        assert bound.user_id == user_id


def test_no_protected_flow_without_authentication(client: TestClient) -> None:
    # A rejected socket never registers, so no pipeline can ever run.
    assert_rejected(client, ws_url(make_session_id()))
    assert manager.active_session_count == 0
