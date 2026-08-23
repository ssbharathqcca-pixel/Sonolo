"""AI provider abstractions (SN-016).

Every provider is an async interface with a deterministic Mock
implementation for CI and key-less local dev. Real implementations
(faster-whisper STT, OpenAI-compatible LLM over httpx, edge-tts TTS)
import their heavy libraries lazily and degrade to the Mocks when the
library, key, or model is unavailable — the voice pipeline never
depends on optional dependencies being installed.
"""

from dataclasses import dataclass

from app.core.config import Settings, get_settings
from app.services.ai.llm import (
    MOCK_TUTOR_RESPONSE,
    LLMProvider,
    MockLLMProvider,
    OpenAICompatibleLLMProvider,
)
from app.services.ai.stt import (
    MOCK_USER_PHRASE,
    MOCK_USER_PHRASE_LONG,
    MockSTTProvider,
    STTProvider,
)
from app.services.ai.tts import (
    MockTTSProvider,
    TTSProvider,
    build_silent_mp3,
    EdgeTTSProvider,
)

__all__ = [
    "EdgeTTSProvider",
    "LLMProvider",
    "MockLLMProvider",
    "MockSTTProvider",
    "MockTTSProvider",
    "MOCK_TUTOR_RESPONSE",
    "MOCK_USER_PHRASE",
    "MOCK_USER_PHRASE_LONG",
    "OpenAICompatibleLLMProvider",
    "STTProvider",
    "TTSProvider",
    "build_silent_mp3",
    "build_ai_bundle",
    "get_ai_bundle",
]


@dataclass(frozen=True)
class AIBundle:
    """The selected provider set for this process."""

    stt: STTProvider
    llm: LLMProvider
    tts: TTSProvider
    using_mocks: bool


def _faster_whisper_available() -> bool:
    try:
        import faster_whisper  # noqa: F401
    except ImportError:
        return False
    return True


def _edge_tts_available() -> bool:
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        return False
    return True


def build_ai_bundle(settings: Settings) -> AIBundle:
    """Select real providers where possible, mocks everywhere else."""
    using_mocks = settings.ai_mock_enabled

    stt: STTProvider
    if not settings.ai_mock_enabled and _faster_whisper_available():
        from app.services.ai.stt import FasterWhisperSTTProvider

        stt = FasterWhisperSTTProvider(model_size=settings.whisper_model_size)
    else:
        stt = MockSTTProvider()
        using_mocks = True

    llm: LLMProvider
    if (
        not settings.ai_mock_enabled
        and settings.openai_api_key != ""
    ):
        llm = OpenAICompatibleLLMProvider(
            base_url=settings.openai_base_url,
            api_key=settings.openai_api_key,
            model=settings.openai_model,
            timeout_seconds=settings.ai_request_timeout_seconds,
        )
    else:
        llm = MockLLMProvider()
        using_mocks = True

    tts: TTSProvider
    if not settings.ai_mock_enabled and _edge_tts_available():
        tts = EdgeTTSProvider(voice=settings.edge_tts_voice)
    else:
        tts = MockTTSProvider()
        using_mocks = True

    return AIBundle(stt=stt, llm=llm, tts=tts, using_mocks=using_mocks)


_BUNDLE: AIBundle | None = None


def get_ai_bundle() -> AIBundle:
    """Process-wide provider bundle (built once from settings)."""
    global _BUNDLE
    if _BUNDLE is None:
        _BUNDLE = build_ai_bundle(get_settings())
    return _BUNDLE
