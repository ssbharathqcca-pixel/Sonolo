"""Mock voice pipeline orchestrator.

Simulates the STT -> LLM -> TTS flow with fixed sleeps so the WebSocket
protocol, state machine, and client UX can be fully exercised before the
real speech models are wired in. The public shape (`process_turn`) is
the contract the real orchestrator will implement.
"""

import asyncio
import base64
import logging
from collections.abc import AsyncIterator
from uuid import UUID, uuid4

from app.voice.protocol import (
    AiAudioChunkMessage,
    AiAudioChunkPayload,
    AiTextChunkMessage,
    AiTextChunkPayload,
    ServerMessage,
    StateChangeMessage,
    StateChangePayload,
    TurnCompleteMessage,
    TurnCompletePayload,
    VoiceState,
)

logger = logging.getLogger(__name__)

MOCK_USER_TRANSCRIPT = "Could I get a medium double-double, please?"
MOCK_AI_RESPONSE = (
    "Great choice! Anything else for you today — maybe a maple dip?"
)
MOCK_TTS_CHUNKS = [
    base64.b64encode(f"sonolo-tts-chunk-{index}".encode()).decode()
    for index in range(3)
]

STT_DELAY_SECONDS = 0.2
LLM_DELAY_SECONDS = 0.5
TTS_DELAY_SECONDS = 0.3


async def process_turn(
    session_id: UUID,
    audio_data: str | None = None,
    *,
    text: str | None = None,
) -> AsyncIterator[ServerMessage]:
    """Run one mock tutor turn, yielding server messages in order.

    `audio_data` is the joined base64 chunks captured while listening;
    `text` is the typed-input fallback. Exactly one should be provided —
    the mock STT returns the typed text verbatim when given.
    """
    logger.debug(
        "Processing turn for session %s (audio=%d chars, text=%s)",
        session_id,
        len(audio_data or ""),
        text is not None,
    )
    yield StateChangeMessage(
        payload=StateChangePayload(state=VoiceState.PROCESSING)
    )

    # STT: audio -> transcript
    await asyncio.sleep(STT_DELAY_SECONDS)
    transcript = text if text is not None else MOCK_USER_TRANSCRIPT
    yield AiTextChunkMessage(
        payload=AiTextChunkPayload(text=transcript, is_final=True)
    )

    # LLM: transcript -> tutor reply
    await asyncio.sleep(LLM_DELAY_SECONDS)
    yield AiTextChunkMessage(
        payload=AiTextChunkPayload(text=MOCK_AI_RESPONSE, is_final=True)
    )

    # TTS: reply -> streamed audio
    yield StateChangeMessage(
        payload=StateChangePayload(state=VoiceState.SPEAKING)
    )
    await asyncio.sleep(TTS_DELAY_SECONDS)
    for chunk in MOCK_TTS_CHUNKS:
        yield AiAudioChunkMessage(payload=AiAudioChunkPayload(audio=chunk))

    yield TurnCompleteMessage(
        payload=TurnCompletePayload(turn_id=uuid4())
    )
    yield StateChangeMessage(payload=StateChangePayload(state=VoiceState.IDLE))
