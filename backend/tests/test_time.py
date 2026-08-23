"""Unit tests for the timezone helper utilities (SN-014)."""

from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from app.core.time import (
    as_utc,
    get_local_date,
    get_local_date_for_user,
    get_zone,
    is_consecutive_day,
)


def test_local_date_america_toronto() -> None:
    # 02:00 UTC on Aug 23 is still Aug 22 evening in Toronto (UTC-4).
    now = datetime(2026, 8, 23, 2, 0, tzinfo=UTC)
    assert get_local_date(now, "America/Toronto") == date(2026, 8, 22)


def test_local_date_asia_kolkata() -> None:
    # 20:00 UTC on Aug 22 is 01:30 on Aug 23 in Kolkata (UTC+5:30).
    now = datetime(2026, 8, 22, 20, 0, tzinfo=UTC)
    assert get_local_date(now, "Asia/Kolkata") == date(2026, 8, 23)


def test_invalid_timezone_falls_back_to_toronto() -> None:
    assert get_zone("Mars/Olympus") == ZoneInfo("America/Toronto")
    assert get_local_date_for_user(
        datetime(2026, 8, 23, 2, 0, tzinfo=UTC), "Not/AZone"
    ) == date(2026, 8, 22)


def test_as_utc_rejects_naive_and_converts() -> None:
    with pytest.raises(ValueError):
        as_utc(datetime(2026, 8, 22, 12, 0))
    kolkata = datetime(
        2026, 8, 22, 20, 0, tzinfo=ZoneInfo("Asia/Kolkata")
    )
    assert as_utc(kolkata) == datetime(2026, 8, 22, 14, 30, tzinfo=UTC)


def test_is_consecutive_day() -> None:
    assert is_consecutive_day(date(2026, 8, 21), date(2026, 8, 22))
    assert not is_consecutive_day(date(2026, 8, 20), date(2026, 8, 22))
    assert not is_consecutive_day(date(2026, 8, 22), date(2026, 8, 22))
    assert not is_consecutive_day(date(2026, 8, 23), date(2026, 8, 22))
    # Non-leap-year February boundary: Feb 28 -> Mar 1.
    assert is_consecutive_day(date(2026, 2, 28), date(2026, 3, 1))
