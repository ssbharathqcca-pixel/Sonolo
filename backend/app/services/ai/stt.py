"""Speech-to-text providers (SN-016)."""

import logging
from typing import Protocol

logger = logging.getLogger(__name__)

MOCK_USER_PHRASE = "Could I get a medium double-double, please?"
MOCK_USER_PHRASE_LONG = (
    "I would also like a maple dip, and could I pay with debit, thanks."
)


class STTProvider(Protocol):
    """Async speech-to-text interface."""

    async def transcribe(self, audio_bytes: bytes) -> str:
        """Return the transcript for one turn of audio."""
        ...  # pragma: no cover - protocol


class MockSTTProvider:
    """Deterministic STT for CI and key-less dev."""

    async def transcribe(self, audio_bytes: bytes) -> str:
        """Pick a canned phrase from the audio length."""
        if len(audio_bytes) > 5000:
            return MOCK_USER_PHRASE_LONG
        return MOCK_USER_PHRASE


class FasterWhisperSTTProvider:
    """faster-whisper STT with blocking inference off the event loop.

    Requires the optional `faster-whisper` extra (requirements-ai.txt);
    the import happens lazily so environments without it fall back to
    the Mock provider at bundle-build time.
    """

    def __init__(self, model_size: str = "base") -> None:
        from faster_whisper import WhisperModel  # noqa: PLC0415

        self._model = WhisperModel(model_size, device="cpu", compute_type="int8")

    async def transcribe(self, audio_bytes: bytes) -> str:
        """Run whisper in a worker thread and return the text."""
        import asyncio
        import tempfile
        from pathlib import Path

        def _run() -> str:
            with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as handle:
                handle.write(audio_bytes)
                path = Path(handle.name)
            segments, _info = self._model.transcribe(str(path), beam_size=1)
            path.unlink(missing_ok=True)
            return "".join(segment.text for segment in segments).strip()

        try:
            return await asyncio.to_thread(_run)
        except Exception:  # noqa: BLE001 - surface as empty transcript, log
            logger.exception("faster-whisper transcription failed.")
            return ""
