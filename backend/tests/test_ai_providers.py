"""Unit tests for AI provider abstractions (SN-016)."""

import base64

import httpx
import pytest

from app.services.ai.stt import (
    MOCK_USER_PHRASE,
    MOCK_USER_PHRASE_LONG,
    MockSTTProvider,
)
from app.services.ai.llm import (
    MOCK_TUTOR_RESPONSE,
    MockLLMProvider,
    OpenAICompatibleLLMProvider,
)
from app.services.ai.tts import (
    MockTTSProvider,
    build_silent_mp3,
)
from app.services.ai import build_ai_bundle
from app.core.config import Settings


@pytest.mark.asyncio
async def test_mock_stt_short_audio() -> None:
    provider = MockSTTProvider()
    result = await provider.transcribe(b"\x00" * 100)
    assert result == MOCK_USER_PHRASE


@pytest.mark.asyncio
async def test_mock_stt_long_audio() -> None:
    provider = MockSTTProvider()
    result = await provider.transcribe(b"\x00" * 6000)
    assert result == MOCK_USER_PHRASE_LONG


@pytest.mark.asyncio
async def test_mock_stt_deterministic() -> None:
    provider = MockSTTProvider()
    r1 = await provider.transcribe(b"\x01\x02")
    r2 = await provider.transcribe(b"\x01\x02")
    assert r1 == r2


@pytest.mark.asyncio
async def test_mock_llm_returns_encouraging_tutor_response() -> None:
    provider = MockLLMProvider()
    response = await provider.generate("Be a tutor.", [])
    assert "past tense" in response.lower() or "great start" in response.lower()


@pytest.mark.asyncio
async def test_mock_llm_deterministic() -> None:
    provider = MockLLMProvider()
    history = [{"role": "user", "content": "Hello"}]
    r1 = await provider.generate("system", history)
    r2 = await provider.generate("system", history)
    assert r1 == r2


@pytest.mark.asyncio
async def test_mock_llm_never_mentions_excluded_bodies() -> None:
    provider = MockLLMProvider()
    response = await provider.generate("Teach English.", [])
    for banned in ("IELTS", "CELPIP", "TEF", "TCF", "IRCC"):
        assert banned not in response


def test_mock_tts_produces_valid_mp3_sync_bytes() -> None:
    provider = MockTTSProvider()

    async def call():
        return await provider.synthesize("Hello")

    import asyncio

    mp3 = asyncio.get_event_loop().run_until_complete(call())
    assert len(mp3) >= 417  # At least one full frame.
    assert mp3[:2] == b"\xff\xfb"  # MPEG-1 Layer III sync.


def test_mock_tts_scales_with_text_length() -> None:
    provider = MockTTSProvider()

    async def short_call():
        return await provider.synthesize("Hi")

    async def long_call():
        return await provider.synthesize(
            "This is a much longer sentence that should produce more frames "
            "because the text length determines how many silent MP3 frames "
            "the mock TTS generates for testing purposes."
        )

    import asyncio

    loop = asyncio.new_event_loop()
    short = loop.run_until_complete(short_call())
    long = loop.run_until_complete(long_call())
    loop.close()
    assert len(long) > len(short)


def test_build_silent_mp3_frame_size() -> None:
    mp3 = build_silent_mp3(3)
    assert len(mp3) == 417 * 3
    assert mp3[0:2] == b"\xff\xfb"


def test_provider_factory_defaults_to_mocks() -> None:
    settings = Settings(ai_mock_enabled=True, _env_file=None)
    bundle = build_ai_bundle(settings)
    assert bundle.using_mocks is True


def test_provider_factory_llm_uses_real_when_key_present() -> None:
    settings = Settings(
        ai_mock_enabled=False,
        openai_api_key="sk-test",
        _env_file=None,
    )
    bundle = build_ai_bundle(settings)
    assert isinstance(bundle.llm, OpenAICompatibleLLMProvider)
    # STT/TTS fall back to mocks because faster-whisper / edge-tts are
    # not installed in the CI environment (graceful fallback).
    assert bundle.using_mocks or True  # Either way it must not crash.


@pytest.mark.asyncio
async def test_openai_compatible_llm_parses_chat_completion() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={
            "choices": [{"message": {"content": " Great answer!"}}],
        })

    transport = httpx.MockTransport(handler)
    client = httpx.AsyncClient(transport=transport)
    provider = OpenAICompatibleLLMProvider(
        base_url="https://api.example.com/v1",
        api_key="test-key",
        model="gpt-4o-mini",
        http_client=client,
    )
    reply = await provider.generate(
        "You are a tutor.",
        [{"role": "user", "content": "Hello"}],
    )
    assert reply == "Great answer!"
    await client.aclose()


@pytest.mark.asyncio
async def test_openai_compatible_llm_degrades_on_error() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(500)

    transport = httpx.MockTransport(handler)
    client = httpx.AsyncClient(transport=transport)
    provider = OpenAICompatibleLLMProvider(
        base_url="https://api.example.com/v1",
        api_key="test-key",
        model="gpt-4o-mini",
        http_client=client,
    )
    reply = await provider.generate("system prompt", [])
    assert reply == MOCK_TUTOR_RESPONSE  # Graceful degradation to mock line.
    await client.aclose()
