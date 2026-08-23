"""Tests for the health endpoint and CORS configuration."""

from datetime import datetime

from fastapi.testclient import TestClient

from app.core.config import Settings


def test_health_returns_ok(client: TestClient, test_settings: Settings) -> None:
    response = client.get(f"{test_settings.api_prefix}/health")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/json")

    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == test_settings.app_name
    assert body["version"] == test_settings.app_version
    assert body["environment"] == test_settings.environment
    parsed_timestamp = datetime.fromisoformat(body["timestamp"])
    assert parsed_timestamp.tzinfo is not None


def test_cors_allows_configured_origins(
    client: TestClient, test_settings: Settings
) -> None:
    origin = test_settings.cors_origins[0]

    response = client.get(
        f"{test_settings.api_prefix}/health", headers={"Origin": origin}
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_cors_blocks_unconfigured_origins(
    client: TestClient, test_settings: Settings
) -> None:
    response = client.get(
        f"{test_settings.api_prefix}/health",
        headers={"Origin": "https://example.com"},
    )

    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers
