"""Tests for the voice WebSocket endpoint and session state machine."""

import base64
import time
import uuid

from fastapi.testclient import TestClient

from app.api.ws import manager
from app.voice.pipeline import MOCK_AI_RESPONSE, MOCK_USER_TRANSCRIPT

VOICE_PATH = "/ws/voice/{session_id}"


def make_session_id() -> str:
    return str(uuid.uuid4())


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


def test_connection_sends_idle(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")


def test_audio_chunk_transitions_to_listening(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")


def test_end_turn_runs_full_pipeline(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
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
    assert messages[0]["payload"]["state"] == "processing"
    assert messages[1]["payload"] == {
        "text": MOCK_USER_TRANSCRIPT,
        "is_final": True,
    }
    assert messages[2]["payload"] == {
        "text": MOCK_AI_RESPONSE,
        "is_final": True,
    }
    assert messages[3]["payload"]["state"] == "speaking"
    for index in range(4, 7):
        decoded = base64.b64decode(messages[index]["payload"]["audio"])
        assert decoded == f"sonolo-tts-chunk-{index - 4}".encode()
    assert uuid.UUID(messages[7]["payload"]["turn_id"])
    assert messages[8]["payload"]["state"] == "idle"


def test_text_input_runs_pipeline(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(text_input(session_id, "Hi, how much is a monthly pass?"))
        messages = drain_until_idle(websocket)

    assert messages[1]["payload"]["text"] == "Hi, how much is a monthly pass?"
    assert messages[-1]["payload"]["state"] == "idle"


def test_cancel_stops_turn_and_recovers(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
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
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")

        websocket.send_text("{not valid json")
        expect_error(websocket, "invalid_json")

        websocket.send_json({"type": "banana", "payload": {}})
        expect_error(websocket, "invalid_message")


def test_session_mismatch_returns_error(client: TestClient) -> None:
    session_id = make_session_id()
    other_session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(other_session_id))
        expect_error(websocket, "session_mismatch")

        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")


def test_silence_timeout_auto_ends_turn(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")
        websocket.send_json(audio_chunk(session_id))
        expect_state(websocket, "listening")

        # No end_turn sent: the watchdog must fire after ~2s of silence.
        messages = drain_until_idle(websocket)

    types = [message["type"] for message in messages]
    assert types[0:2] == ["state_change", "ai_text_chunk"]
    assert messages[0]["payload"]["state"] == "processing"
    assert types[-1] == "state_change"
    assert messages[-1]["payload"]["state"] == "idle"


def test_disconnect_cleans_up_session(client: TestClient) -> None:
    session_id = make_session_id()
    with client.websocket_connect(VOICE_PATH.format(session_id=session_id)) as websocket:
        expect_state(websocket, "idle")
        assert manager.get(uuid.UUID(session_id)) is not None
        assert manager.active_session_count == 1

    for _ in range(40):
        if manager.get(uuid.UUID(session_id)) is None:
            break
        time.sleep(0.05)

    assert manager.get(uuid.UUID(session_id)) is None
    assert manager.active_session_count == 0
