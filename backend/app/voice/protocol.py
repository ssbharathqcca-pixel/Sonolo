"""Wire protocol for the Sonolo voice WebSocket.

Client-to-server frames form a discriminated union on the `type` field;
parse them with `parse_client_message`. Server-to-client frames are built
from the `*Message` models and serialized with `model_dump(mode="json")`.
"""

import base64
from enum import StrEnum
from typing import Annotated, Literal, Union
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter


class VoiceState(StrEnum):
    """Turn-taking states for a voice session."""

    IDLE = "idle"
    LISTENING = "listening"
    PROCESSING = "processing"
    SPEAKING = "speaking"


# -----------------------------------------------------------------------
# Client -> Server
# -----------------------------------------------------------------------


class AudioChunkPayload(BaseModel):
    """A streamed chunk of learner audio."""

    session_id: UUID
    audio: str = Field(description="Base64-encoded audio chunk.")


class EndTurnPayload(BaseModel):
    """Learner finished speaking (button release or explicit end)."""

    session_id: UUID


class TextInputPayload(BaseModel):
    """Text fallback for anxiety mode / silent practice."""

    session_id: UUID
    text: str = Field(min_length=1)


class CancelPayload(BaseModel):
    """Learner asked to stop playback / abort the current turn."""

    session_id: UUID


class AudioChunkMessage(BaseModel):
    type: Literal["audio_chunk"] = "audio_chunk"
    payload: AudioChunkPayload


class EndTurnMessage(BaseModel):
    type: Literal["end_turn"] = "end_turn"
    payload: EndTurnPayload


class TextInputMessage(BaseModel):
    type: Literal["text_input"] = "text_input"
    payload: TextInputPayload


class CancelMessage(BaseModel):
    type: Literal["cancel"] = "cancel"
    payload: CancelPayload


ClientMessage = Annotated[
    Union[
        AudioChunkMessage,
        EndTurnMessage,
        TextInputMessage,
        CancelMessage,
    ],
    Field(discriminator="type"),
]

_client_message_adapter: TypeAdapter = TypeAdapter(ClientMessage)


def parse_client_message(data: object) -> ClientMessage:
    """Validate an inbound frame into a typed client message."""
    return _client_message_adapter.validate_python(data)


# -----------------------------------------------------------------------
# Server -> Client
# -----------------------------------------------------------------------


class AiTextChunkPayload(BaseModel):
    """A piece of a transcript or AI reply; `is_final` closes the stream."""

    text: str
    is_final: bool
    role: Literal["user", "assistant"] | None = None


class AiAudioPayloadPayload(BaseModel):
    """A complete TTS audio buffer (base64 MP3), sent as one frame."""

    audio: str
    format: Literal["mp3", "wav"] = "mp3"


class AiAudioChunkPayload(BaseModel):
    """A streamed chunk of synthesized tutor speech (base64)."""

    audio: str


class TurnCompletePayload(BaseModel):
    """One tutor turn finished; playback of its audio is done."""

    turn_id: UUID


class SessionCompletePayload(BaseModel):
    """The whole conversation session finished."""

    session_id: UUID


class HintPayload(BaseModel):
    """A nudge for the learner, optionally with an L1 translation."""

    text: str
    l1_translation: str | None = None


class ErrorPayload(BaseModel):
    """A protocol- or state-level error (never a transport close)."""

    code: str
    message: str


class StateChangePayload(BaseModel):
    """The session moved to a new turn-taking state."""

    state: Literal["idle", "listening", "processing", "speaking"]


class AiTextChunkMessage(BaseModel):
    type: Literal["ai_text_chunk"] = "ai_text_chunk"
    payload: AiTextChunkPayload


class AiAudioChunkMessage(BaseModel):
    type: Literal["ai_audio_chunk"] = "ai_audio_chunk"
    payload: AiAudioChunkPayload


class AiAudioPayloadMessage(BaseModel):
    type: Literal["audio_payload"] = "audio_payload"
    payload: AiAudioPayloadPayload


class TurnCompleteMessage(BaseModel):
    type: Literal["turn_complete"] = "turn_complete"
    payload: TurnCompletePayload


class SessionCompleteMessage(BaseModel):
    type: Literal["session_complete"] = "session_complete"
    payload: SessionCompletePayload


class HintMessage(BaseModel):
    type: Literal["hint"] = "hint"
    payload: HintPayload


class ErrorMessage(BaseModel):
    type: Literal["error"] = "error"
    payload: ErrorPayload


class StateChangeMessage(BaseModel):
    type: Literal["state_change"] = "state_change"
    payload: StateChangePayload


class SessionEvaluationPayload(BaseModel):
    """SN-011 evaluation scores as delivered in the summary frame."""

    model_config = ConfigDict(extra="forbid")

    scores: dict[str, float]
    overall_score: float
    insights: list[str] = Field(default_factory=list)
    engine_version: str = "sn011-deterministic-v1"


class SessionTranscriptTurn(BaseModel):
    """One final transcript turn in the summary frame."""

    role: Literal["user", "assistant"]
    text: str


class SessionSummaryPayload(BaseModel):
    """Final evaluation + transcript sent when a session closes."""

    evaluation: SessionEvaluationPayload
    transcript: list[SessionTranscriptTurn]


class SessionSummaryMessage(BaseModel):
    type: Literal["session_summary"] = "session_summary"
    payload: SessionSummaryPayload


ServerMessage = Union[
    AiTextChunkMessage,
    AiAudioChunkMessage,
    AiAudioPayloadMessage,
    TurnCompleteMessage,
    SessionCompleteMessage,
    SessionSummaryMessage,
    HintMessage,
    ErrorMessage,
    StateChangeMessage,
]


def audio_payload(audio_bytes: bytes, format_: str = "mp3") -> AiAudioPayloadMessage:
    """Build a complete-buffer `audio_payload` server message."""
    return AiAudioPayloadMessage(
        payload=AiAudioPayloadPayload(
            audio=base64.b64encode(audio_bytes).decode("ascii"),
            format=format_,  # type: ignore[arg-type]
        )
    )


def state_change(state: VoiceState) -> StateChangeMessage:
    """Build a `state_change` server message."""
    return StateChangeMessage(payload=StateChangePayload(state=state))


def error(code: str, message: str) -> ErrorMessage:
    """Build an `error` server message."""
    return ErrorMessage(payload=ErrorPayload(code=code, message=message))
