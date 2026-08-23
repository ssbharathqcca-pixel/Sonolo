"""XP, streak, and badge rules (SN-014).

All mutations run on the caller's transaction; the users row is locked
with SELECT ... FOR UPDATE on PostgreSQL before any XP/streak write.
"""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.time import get_local_date_for_user, is_consecutive_day, utc_now
from app.db.session import dialect_name
from app.models.gamification import DailyQuest, UserBadge
from app.models.session import SpeakingSession
from app.models.user import User
from app.schemas.gamification import (
    BadgeOut,
    GamificationSummaryOut,
    XPAwardOut,
)
from app.services.analytics import EVENT_BADGE_AWARDED, EVENT_STREAK_UPDATED, record_event


@dataclass(frozen=True)
class BadgeDefinition:
    """Static definition of one badge."""

    code: str
    title: str
    description: str


BADGE_DEFINITIONS: dict[str, BadgeDefinition] = {
    badge.code: badge
    for badge in (
        BadgeDefinition(
            code="first_session",
            title="First session",
            description="Completed your first Sonolo voice session.",
        ),
        BadgeDefinition(
            code="streak_3",
            title="Three-day rhythm",
            description="Reached a three-day practice streak.",
        ),
        BadgeDefinition(
            code="streak_7",
            title="Seven-day momentum",
            description="Reached a seven-day practice streak.",
        ),
        BadgeDefinition(
            code="xp_500",
            title="Momentum builder",
            description="Earned 500 total XP.",
        ),
        BadgeDefinition(
            code="quest_day_complete",
            title="Full daily circuit",
            description="Completed all daily quests in one day.",
        ),
    )
}


def level_for_xp(xp_total: int) -> int:
    """Derived level: floor(xp_total / 100) + 1."""
    return xp_total // 100 + 1


def progress_into_level(xp_total: int) -> int:
    """XP earned within the current level."""
    return xp_total % 100


def badge_display_title(badge: UserBadge) -> str:
    """Prefer the stored title; fall back to the definition."""
    if badge.title:
        return badge.title
    definition = BADGE_DEFINITIONS.get(badge.badge_id)
    return definition.title if definition is not None else badge.badge_id


class GamificationService:
    """XP, streak, and badge operations on an external transaction."""

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def lock_user_for_update(self, user_id: UUID) -> User:
        """Fetch the user row, locking it on PostgreSQL."""
        statement = select(User).where(User.id == user_id)
        if dialect_name(self._db) == "postgresql":
            statement = statement.with_for_update()
        user = (await self._db.execute(statement)).scalar_one()
        return user

    async def apply_session_xp(
        self,
        user: User,
        xp: int,
        current_local_date: date,
        now: datetime,
    ) -> None:
        """Add XP to totals, resetting xp_today on a new local date."""
        if xp == 0:
            if user.xp_today_date != current_local_date:
                user.xp_today = 0
                user.xp_today_date = current_local_date
            return
        if user.xp_today_date != current_local_date:
            user.xp_today = 0
            user.xp_today_date = current_local_date
        user.xp_today += xp
        user.total_xp += xp

    async def update_streak(
        self, user: User, current_local_date: date, now: datetime
    ) -> None:
        """Apply the four streak rules and persist activity markers."""
        previous = user.streak_last_date
        if previous is None:
            user.streak_count = 1
        elif previous == current_local_date:
            pass  # Same local date: streak unchanged.
        elif is_consecutive_day(previous, current_local_date):
            user.streak_count += 1
        else:
            user.streak_count = 1
        user.longest_streak = max(user.longest_streak, user.streak_count)
        user.last_activity_at = now
        user.streak_last_date = current_local_date
        await record_event(
            self._db,
            user.id,
            EVENT_STREAK_UPDATED,
            {
                "current_streak": user.streak_count,
                "longest_streak": user.longest_streak,
                "local_date": current_local_date.isoformat(),
            },
        )

    async def award_badges(
        self,
        user: User,
        current_local_date: date,
        now: datetime,
        eligible_session_count: int,
        quests_for_date: list[DailyQuest],
    ) -> list[UserBadge]:
        """Insert any newly-earned badges (idempotent) and return them."""
        existing_result = await self._db.execute(
            select(UserBadge.badge_id).where(UserBadge.user_id == user.id)
        )
        existing_codes: set[str] = set(existing_result.scalars().all())

        all_quests_complete = (
            len(quests_for_date) > 0
            and all(quest.completed for quest in quests_for_date)
        )
        conditions: dict[str, bool] = {
            "first_session": eligible_session_count >= 1,
            "streak_3": user.streak_count >= 3,
            "streak_7": user.streak_count >= 7,
            "xp_500": user.total_xp >= 500,
            "quest_day_complete": all_quests_complete,
        }

        newly_awarded: list[UserBadge] = []
        for code, earned in conditions.items():
            if not earned or code in existing_codes:
                continue
            definition = BADGE_DEFINITIONS[code]
            await self._conflict_safe_badge_insert(user.id, definition, now)
            stored = (
                await self._db.execute(
                    select(UserBadge).where(
                        UserBadge.user_id == user.id,
                        UserBadge.badge_id == code,
                    )
                )
            ).scalar_one()
            newly_awarded.append(stored)
            await record_event(
                self._db,
                user.id,
                EVENT_BADGE_AWARDED,
                {"badge_code": code, "local_date": current_local_date.isoformat()},
            )
        return newly_awarded

    async def get_summary(self, user: User) -> GamificationSummaryOut:
        """Read-only snapshot; stale xp_today is reported as zero."""
        now = utc_now()
        local_date = get_local_date_for_user(now, user.timezone)
        effective_today = (
            user.xp_today if user.xp_today_date == local_date else 0
        )
        badges = (
            (
                await self._db.execute(
                    select(UserBadge)
                    .where(UserBadge.user_id == user.id)
                    .order_by(UserBadge.earned_at.asc())
                )
            )
            .scalars()
            .all()
        )
        return GamificationSummaryOut(
            xp_total=user.total_xp,
            xp_today=effective_today,
            xp_today_date=user.xp_today_date,
            level=level_for_xp(user.total_xp),
            progress_to_next_level=progress_into_level(user.total_xp),
            next_level_xp_threshold=level_for_xp(user.total_xp) * 100,
            current_streak=user.streak_count,
            longest_streak=user.longest_streak,
            last_activity_at=user.last_activity_at,
            last_activity_local_date=user.streak_last_date,
            badges=[
                BadgeOut(
                    code=badge.badge_id,
                    title=badge_display_title(badge),
                    description=badge.description,
                    awarded_at=badge.earned_at,
                )
                for badge in badges
            ],
        )

    async def count_eligible_sessions(self, user_id: UUID) -> int:
        """Total XP-eligible sessions completed by the user."""
        result = await self._db.execute(
            select(func.count())
            .select_from(SpeakingSession)
            .where(
                SpeakingSession.user_id == user_id,
                SpeakingSession.is_xp_eligible.is_(True),
            )
        )
        return int(result.scalar_one())

    def build_xp_award(
        self,
        user: User,
        session_xp: int,
        quest_xp: int,
    ) -> XPAwardOut:
        """Assemble the response XP breakdown from current user state."""
        return XPAwardOut(
            session_xp=session_xp,
            quest_xp=quest_xp,
            total_xp=session_xp + quest_xp,
            xp_total=user.total_xp,
            xp_today=user.xp_today,
            level=level_for_xp(user.total_xp),
            progress_to_next_level=progress_into_level(user.total_xp),
        )

    async def _conflict_safe_badge_insert(
        self, user_id: UUID, definition: BadgeDefinition, now: datetime
    ) -> None:
        values = {
            "user_id": user_id,
            "badge_id": definition.code,
            "title": definition.title,
            "description": definition.description,
            "earned_at": now,
        }
        if dialect_name(self._db) == "postgresql":
            statement = (
                pg_insert(UserBadge)
                .values(**values)
                .on_conflict_do_nothing(index_elements=["user_id", "badge_id"])
            )
        else:
            statement = (
                sqlite_insert(UserBadge)
                .values(**values)
                .on_conflict_do_nothing(index_elements=["user_id", "badge_id"])
            )
        await self._db.execute(statement)
