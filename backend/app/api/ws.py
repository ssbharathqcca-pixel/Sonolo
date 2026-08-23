"""Real-time voice WebSocket endpoint.

Protocol: see `app.voice.protocol`. The endpoint stays responsive on the
receive loop while turns run as background tasks, so `cancel` works even
mid-speech, and the session manager's silence watchdog can auto-end a
turn without any client message.
"""

import asyncio
import base64
import json
import logging
from contextlib import suppress
from typing import cast
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi import HTTPException as FastAPIHTTPException
from pydantic import ValidationError

from app.core.config import get_settings
from app.core.security import decode_access_token
from app.db.session import AsyncSessionLocal
from app.learning.evaluator import SessionEvaluator
from app.learning.schemas import (
    EvaluationRequest as EvaluatorEvaluationRequest,
)
from app.learning.schemas import TranscriptTurn as EvaluatorTranscriptTurn
from app.models.scenario import Scenario
from app.voice.pipeline import process_turn
from app.voice.protocol import (
    AudioChunkMessage,
    CancelMessage,
    ClientMessage,
    EndTurnMessage,
    ServerMessage,
    SessionSummaryMessage,
    SessionSummaryPayload,
    SessionEvaluationPayload,
    SessionTranscriptTurn,
    StateChangeMessage,
    TextInputMessage,
    VoiceState,
    error,
    parse_client_message,
    state_change,
)
from app.voice.session_manager import SessionManager, VoiceSession
from sqlalchemy import select

router = APIRouter()
logger = logging.getLogger(__name__)


async def _run_turn(
    session: VoiceSession, *, override_text: str | None
) -> None:
    """Drive one pipeline turn, sending every yielded message.

    Duplicate end-of-turn triggers (button + silence watchdog) are
    idempotent: `begin_turn` rejects a second concurrent turn.
    """
    if not await manager.begin_turn(session):
        return
    try:
        message: ServerMessage
        async for message in process_turn(session, override_text=override_text):
            try:
                await session.send(message)
            except RuntimeError:
                # Socket closed mid-turn; the receive loop will clean up.
                return
            if isinstance(message, StateChangeMessage):
                await manager.apply_state(
                    session, VoiceState(message.payload.state)
                )
    except asyncio.CancelledError:
        with suppress(RuntimeError):
            await session.send(state_change(VoiceState.IDLE))
        await manager.apply_state(session, VoiceState.IDLE)
        raise
    finally:
        session.turn_task = None


def _start_turn(session: VoiceSession, *, text: str | None = None) -> None:
    """Launch a turn as a background task (audio comes from the buffer)."""
    session.turn_task = asyncio.create_task(
        _run_turn(session, override_text=text)
    )


async def _silence_end_turn(session: VoiceSession) -> None:
    """Turn-end callback fired by the silence watchdog."""
    _start_turn(session)


async def _cancel_turn(session: VoiceSession) -> None:
    """Abort the running turn (if any) and return to IDLE."""
    task = session.turn_task
    if task is not None and not task.done():
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task
        return
    await session.send(state_change(VoiceState.IDLE))
    await manager.apply_state(session, VoiceState.IDLE)


async def _send_session_summary(websocket: WebSocket, session: VoiceSession) -> None:
    """Evaluate the real transcript, send `session_summary`, close 1000."""
    if session.history:
        evaluator_turns = [
            EvaluatorTranscriptTurn(
                role="user" if turn["role"] == "user" else "tutor",
                text=turn["content"],
            )
            for turn in session.history
        ]
        evaluation = await SessionEvaluator().evaluate(
            EvaluatorEvaluationRequest(
                session_id=session.session_id,
                transcript=evaluator_turns,
            )
        )
        summary = SessionSummaryMessage(
            payload=SessionSummaryPayload(
                evaluation=SessionEvaluationPayload(
                    scores={
                        skill.dimension: skill.score
                        for skill in evaluation.skills
                    },
                    overall_score=evaluation.speaking_power_score,
                    insights=[
                        insight.text for insight in evaluation.insights
                    ],
                ),
                transcript=[
                    SessionTranscriptTurn(
                        role="user" if turn["role"] == "user" else "assistant",
                        text=turn["content"],
                    )
                    for turn in session.history
                ],
            )
        )
        with suppress(RuntimeError):
            await session.send(summary)
    await websocket.close(code=1000)


async def _load_scenario_prompt(scenario_id_raw: str | None) -> str:
    """Resolve the scenario's tutor prompt (default when unavailable)."""
    from app.voice.session_manager import DEFAULT_TUTOR_PROMPT

    if scenario_id_raw is None:
        return DEFAULT_TUTOR_PROMPT
    try:
        scenario_uuid = UUID(scenario_id_raw)
    except ValueError:
        return DEFAULT_TUTOR_PROMPT
    async with AsyncSessionLocal() as db:
        prompt = (
            await db.execute(
                select(Scenario.system_prompt).where(
                    Scenario.id == scenario_uuid
                )
            )
        ).scalar_one_or_none()
    return prompt if prompt else DEFAULT_TUTOR_PROMPT


manager = SessionManager(
    silence_timeout=get_settings().voice_silence_timeout,
    turn_end_handler=_silence_end_turn,
)


def _payload_session_id(message: ClientMessage) -> UUID | None:
    """Return the payload session_id for session-scoped client messages."""
    payload = message.payload
    return cast(UUID | None, getattr(payload, "session_id", None))


WS_UNAUTHORIZED_CLOSE_CODE = 4401


def _authenticate_websocket_user(websocket: WebSocket) -> UUID | None:
    """Resolve the verified JWT `sub` claim to a user UUID.

    The token is validated with the SN-010 logic (signature + expiry).
    Binding trusts the verified claim without a DB round-trip per
    socket; tokens are only issued for existing users at login.
    """
    token = websocket.query_params.get("token")
    if token is None:
        return None
    try:
        payload = decode_access_token(token)
        subject = payload.get("sub")
        if not isinstance(subject, str) or subject == "":
            return None
        return UUID(subject)
    except (FastAPIHTTPException, ValueError):
        return None


@router.websocket("/ws/voice/{session_id}")
async def voice_session(websocket: WebSocket, session_id: UUID) -> None:
    """One learner's real-time voice conversation (JWT-authenticated)."""
    user_id = _authenticate_websocket_user(websocket)
    if user_id is None:
        await websocket.close(
            code=WS_UNAUTHORIZED_CLOSE_CODE,
            reason="Missing or invalid authentication token.",
        )
        return

    if manager.get(session_id) is not None:
        await websocket.close(code=1008, reason="Session already active.")
        return

    system_prompt = await _load_scenario_prompt(
        websocket.query_params.get("scenario_id")
    )
    await websocket.accept()
    session = await manager.register(
        session_id, websocket, user_id, system_prompt
    )
    logger.info(
        "Voice session opened: session_id=%s user_id=%s", session_id, user_id
    )
    try:
        await session.send(state_change(VoiceState.IDLE))

        while True:
            try:
                raw = await websocket.receive_text()
                data: object = json.loads(raw)
            except ValueError:
                await session.send(
                    error("invalid_json", "Frame is not valid JSON.")
                )
                continue

            try:
                message = parse_client_message(data)
            except ValidationError:
                await session.send(
                    error(
                        "invalid_message",
                        "Frame does not match the voice protocol.",
                    )
                )
                continue

            payload_session_id = _payload_session_id(message)
            if payload_session_id is not None and payload_session_id != session_id:
                await session.send(
                    error(
                        "session_mismatch",
                        "payload.session_id does not match the connected "
                        "session.",
                    )
                )
                continue

            if isinstance(message, AudioChunkMessage):
                accepted = await manager.mark_audio(session)
                if accepted:
                    session.audio_buffer.append(message.payload.audio)
                    try:
                        session.audio_bytes.append(
                            base64.b64decode(message.payload.audio)
                        )
                    except (ValueError, TypeError):
                        await session.send(
                            error("invalid_message", "Audio chunk not base64.")
                        )
                else:
                    await session.send(
                        error(
                            "busy",
                            "A turn is already being processed or spoken.",
                        )
                    )
            elif isinstance(message, EndTurnMessage):
                _start_turn(session)
            elif isinstance(message, TextInputMessage):
                _start_turn(session, text=message.payload.text)
            elif isinstance(message, CancelMessage):
                await _cancel_turn(session)
                await _send_session_summary(websocket, session)
                return
    except WebSocketDisconnect:
        logger.info(
            "Voice session disconnected: session_id=%s", session_id
        )
    finally:
        await manager.unregister(session_id)
        logger.info("Voice session closed: session_id=%s", session_id)
