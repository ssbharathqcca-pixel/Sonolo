"""Timezone-aware time utilities.

All persisted timestamps are timezone-aware UTC. User-facing calendar
logic (streaks, daily quests, XP resets) uses IANA timezones via
zoneinfo, defaulting to America/Toronto.
"""

import logging
from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

logger = logging.getLogger(__name__)

DEFAULT_TIMEZONE = "America/Toronto"


def utc_now() -> datetime:
    """Current timezone-aware UTC datetime."""
    return datetime.now(UTC)


def get_zone(timezone_name: str) -> ZoneInfo:
    """Resolve an IANA timezone, falling back to America/Toronto."""
    try:
        return ZoneInfo(timezone_name)
    except (ZoneInfoNotFoundError, ValueError, KeyError) as exc:
        logger.warning(
            "Invalid timezone %r (%s); falling back to %s.",
            timezone_name,
            exc,
            DEFAULT_TIMEZONE,
        )
        return ZoneInfo(DEFAULT_TIMEZONE)


def as_utc(dt: datetime) -> datetime:
    """Convert an aware datetime to UTC; naive datetimes are rejected."""
    if dt.tzinfo is None:
        raise ValueError("Naive datetimes are not allowed; use aware UTC.")
    return dt.astimezone(UTC)


def get_local_date(now_utc: datetime, timezone_name: str) -> date:
    """Calendar date of `now_utc` in the given IANA timezone."""
    return as_utc(now_utc).astimezone(get_zone(timezone_name)).date()


def get_local_date_for_user(now_utc: datetime, user_timezone: str) -> date:
    """Calendar date of `now_utc` in the user's timezone."""
    return get_local_date(now_utc, user_timezone)


def is_consecutive_day(
    previous_local_date: date, current_local_date: date
) -> bool:
    """True only when current is exactly the day after previous."""
    return previous_local_date + timedelta(days=1) == current_local_date
