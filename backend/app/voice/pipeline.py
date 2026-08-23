"""Real voice pipeline orchestrator (SN-016).

One turn = STT over the accumulated audio -> LLM tutor reply ->
TTS synthesis streamed back as a single complete-buffer frame. The
provider bundle (real or Mock) is selected by settings at startup; the
state machine wrapper (PROCESSING / SPEAKING / IDLE) is identical for
both, so CI exercises the real flow with deterministic mocks.
"""

import asyncio
import logging
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
)
from app.voice.session_manager import VoiceSession

logger = logging.getLogger(__name__)

STT_DELAY_SECONDS = 0.05  # Keep the mock pipeline visually testable.
LLM_DELAY_SECONDS = 0.05


async def process_turn(
    session: VoiceSession, override_text: str | None = None
) -> AsyncIterator[ServerMessage]:
    """Run one full tutor turn for the session, yielding server frames.

    `override_text` (typed input path) bypasses STT: the text is used
    directly as the user turn.
    """
    bundle = get_ai_bundle()
    logger.debug(
        "Processing turn for session %s (audio=%d bytes, text=%s, mocks=%s)",
        session.session_id,
        sum(len(chunk) for chunk in session.audio_bytes),
        override_text is not None,
        bundle.using_mocks,
    )

    yield StateChangeMessage(
        payload=StateChangePayload(state=VoiceState.PROCESSING)
    )

    # STT: accumulated audio (or typed text) -> user transcript.
    if override_text is not None:
        user_text = override_text
    else:
        audio = b"".join(session.audio_bytes)
        session.audio_bytes = []
        session.audio_buffer = []
        await asyncio.sleep(STT_DELAY_SECONDS)
        user_text = await bundle.stt.transcribe(audio)
    if user_text == "":
        user_text = "…"  # Empty STT still advances the conversation.
    session.history.append({"role": "user", "content": user_text})
    yield AiTextChunkMessage(
        payload=AiTextChunkPayload(text=user_text, is_final=True, role="user")
    )

    # LLM: history + scenario prompt -> tutor reply.
    await asyncio.sleep(LLM_DELAY_SECONDS)
    tutor_reply = await bundle.llm.generate_response(
        session.system_prompt, session.history
    )
    session.history.append({"role": "assistant", "content": tutor_reply})
    yield AiTextChunkMessage(
        payload=AiTextChunkPayload(
            text=tutor_reply, is_final=True, role="assistant"
        )
    )

    # TTS: reply -> one complete audio buffer frame.
    yield StateChangeMessage(
        payload=StateChangePayload(state=VoiceState.SPEAKING)
    )
    audio_bytes = await bundle.tts.synthesize(tutor_reply)
    yield audio_payload(audio_bytes)

    yield TurnCompleteMessage(payload=TurnCompletePayload(turn_id=uuid4()))
    yield StateChangeMessage(payload=StateChangePayload(state=VoiceState.IDLE))
