"""Real voice pipeline orchestrator (SN-016).

One turn = STT over accumulated audio (emitting `user_text_chunk`)
-> LLM tutor reply (`ai_text_chunk`) -> TTS synthesis streamed back as
a single `audio_payload` MP3 buffer. Provider bundle (real or Mock)
is selected by settings; the state machine wrapper is identical.
"""

import asyncio
import logging
import time
from collections.abc import AsyncIterator
from uuid import uuid4

from app.services.ai import get_ai_bundle
from app.voice.protocol import (
    AiTextChunkMessage,
    AiTextChunkPayload,
    ServerMessage,
    StateChangeMessage,
    StateChangePayload,
    TurnCompleteMessage,
    TurnCompletePayload,
    VoiceState,
    audio_payload,
    user_text_chunk,
)
from app.voice.session_manager import VoiceSession

logger = logging.getLogger(__name__)

MOCK_DELAY_SECONDS = 0.05


async def process_turn(
    session: VoiceSession, override_text: str | None = None
) -> AsyncIterator[ServerMessage]:
    """Run one full tutor turn, yielding server frames in order."""
    bundle = get_ai_bundle()
    yield StateChangeMessage(
        payload=StateChangePayload(state=VoiceState.PROCESSING)
    )

    # --- STT -------------------------------------------------------------
    t0 = time.monotonic()
    if override_text is not None:
        user_text = override_text
    else:
        audio_bytes = b"".join(session.audio_bytes)
        session.audio_bytes = []
        session.audio_buffer = []
        await asyncio.sleep(MOCK_DELAY_SECONDS)
        user_text = await bundle.stt.transcribe(audio_bytes)
    stt_ms = round((time.monotonic() - t0) * 1000)

    if not user_text:
        user_text = "…"
    session.history.append({"role": "user", "content": user_text})
    logger.info(
        "ai.stt_completed session=%s latency_ms=%d", session.session_id, stt_ms
    )
    yield user_text_chunk(user_text)

    # --- LLM ---------------------------------------------------------------
    t1 = time.monotonic()
    reply = await bundle.llm.generate(session.system_prompt, session.history)
    llm_ms = round((time.monotonic() - t1) * 1000)
    session.history.append({"role": "assistant", "content": reply})
    logger.info(
        "ai.llm_completed session=%s latency_ms=%d", session.session_id, llm_ms
    )
    yield AiTextChunkMessage(
        payload=AiTextChunkPayload(text=reply, is_final=True, role="assistant")
    )

    # --- TTS -----------------------------------------------------------------
    yield StateChangeMessage(
        payload=StateChangePayload(state=VoiceState.SPEAKING)
    )
    t2 = time.monotonic()
    mp3_bytes = await bundle.tts.synthesize(reply)
    tts_ms = round((time.monotonic() - t2) * 1000)
    logger.info(
        "ai.tts_completed session=%s latency_ms=%d bytes=%d",
        session.session_id, tts_ms, len(mp3_bytes),
    )

    yield audio_payload(mp3_bytes)
    yield TurnCompleteMessage(payload=TurnCompletePayload(turn_id=uuid4()))
    yield StateChangeMessage(payload=StateChangePayload(state=VoiceState.IDLE))
