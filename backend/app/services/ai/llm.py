"""Tutor LLM providers (SN-016)."""

import logging
from typing import Any, Protocol

import httpx

logger = logging.getLogger(__name__)

MOCK_TUTOR_RESPONSE = (
    "That is a great start! Let's try using the past tense next — "
    "for example, 'I ordered a coffee yesterday.'"
)

DEFAULT_SYSTEM_PROMPT = (
    "You are Sonolo, a friendly and patient Canadian English tutor. "
    "Keep replies short and encouraging, gently rephrase the learner's "
    "mistakes, and use everyday Canadian context."
)


class LLMProvider(Protocol):
    """Async tutor-LLM interface."""

    async def generate_response(
        self, system_prompt: str, history: list[dict[str, str]]
    ) -> str:
        """Return the tutor's reply for the conversation so far."""
        ...  # pragma: no cover - protocol


class MockLLMProvider:
    """Deterministic, encouraging tutor for CI and key-less dev."""

    async def generate_response(
        self, system_prompt: str, history: list[dict[str, str]]
    ) -> str:
        """Always the same CanadaReady™ coaching line."""
        return MOCK_TUTOR_RESPONSE


class OpenAICompatibleLLMProvider:
    """Chat-completions client for any OpenAI-compatible endpoint."""

    def __init__(
        self,
        base_url: str,
        api_key: str,
        model: str,
        timeout_seconds: float = 30.0,
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._model = model
        self._timeout_seconds = timeout_seconds
        self._client = http_client

    async def generate_response(
        self, system_prompt: str, history: list[dict[str, str]]
    ) -> str:
        """POST /chat/completions and return the assistant message."""
        client = self._client or httpx.AsyncClient(timeout=self._timeout_seconds)
        should_close = self._client is None
        payload: dict[str, Any] = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": system_prompt or DEFAULT_SYSTEM_PROMPT},
                *history,
            ],
            "max_tokens": 200,
            "temperature": 0.7,
        }
        try:
            response = await client.post(
                f"{self._base_url}/chat/completions",
                json=payload,
                headers={"Authorization": f"Bearer {self._api_key}"},
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return str(content).strip()
        except Exception:  # noqa: BLE001 - degrade, never crash the socket
            logger.exception("LLM chat completion failed; using fallback line.")
            return MOCK_TUTOR_RESPONSE
        finally:
            if should_close:
                await client.aclose()
