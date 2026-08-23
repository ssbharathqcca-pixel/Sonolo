"""Text-to-speech providers (SN-016)."""

import logging
from typing import Protocol

logger = logging.getLogger(__name__)

# One minimal, structurally valid silent MPEG-1 Layer III frame
# (128 kbps, 44.1 kHz, mono): sync header + zeroed payload.
_MP3_HEADER = b"\xff\xfb\x90\x64"
_MP3_FRAME_SIZE = 417  # 128kbps @ 44100Hz => 417.96 bytes/frame


def build_silent_mp3(frames: int = 1) -> bytes:
    """Return `frames` of silent MP3 bytes (header + zero payload)."""
    body = b"\x00" * (_MP3_FRAME_SIZE - len(_MP3_HEADER))
    return (_MP3_HEADER + body) * frames


class TTSProvider(Protocol):
    """Async text-to-speech interface."""

    async def synthesize(self, text: str) -> bytes:
        """Return complete MP3 bytes for the text."""
        ...  # pragma: no cover - protocol


class MockTTSProvider:
    """Deterministic TTS returning valid silent MP3 bytes."""

    async def synthesize(self, text: str) -> bytes:
        """Scale silence with the text length; always valid MP3."""
        frames = max(1, min(len(text) // 40 + 1, 8))
        return build_silent_mp3(frames)


class EdgeTTSProvider:
    """edge-tts synthesis (requires the optional extra, lazily imported)."""

    def __init__(self, voice: str = "en-CA-LiamNeural") -> None:
        self._voice = voice

    async def synthesize(self, text: str) -> bytes:
        """Stream edge-tts audio into a complete MP3 buffer."""
        try:
            import edge_tts  # noqa: PLC0415

            communicate = edge_tts.Communicate(text, self._voice)
            chunks: list[bytes] = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    chunks.append(bytes(chunk["data"]))
            mp3 = b"".join(chunks)
            if mp3 == b"":
                return build_silent_mp3()
            return mp3
        except Exception:  # noqa: BLE001 - degrade, never crash the socket
            logger.exception("edge-tts synthesis failed; using silence.")
            return build_silent_mp3()
