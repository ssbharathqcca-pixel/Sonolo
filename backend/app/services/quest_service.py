"""Daily quest generation and progress (SN-014).

Quests are generated lazily per user per local date with conflict-safe
inserts; progress is monotonic and completions award XP exactly once.
"""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import dialect_name
from app.models.gamification import DailyQuest
from app.services.analytics import EVENT_QUEST_COMPLETED, record_event


@dataclass(frozen=True)
class QuestDefinition:
    """Static definition of one daily quest."""

    code: str
    title: str
    description: str
    target_count: int
    reward_xp: int


QUEST_DEFINITIONS: tuple[QuestDefinition, ...] = (
    QuestDefinition(
        code="session_1",
        title="Warm-up conversation",
        description="Complete one Sonolo voice session to build confidence.",
        target_count=1,
        reward_xp=20,
    ),
    QuestDefinition(
        code="session_2",
        title="Double practice",
        description="Complete two Sonolo voice sessions today.",
        target_count=2,
        reward_xp=30,
    ),
    QuestDefinition(
        code="vocab_10",
        title="Vocabulary refresher",
        description="Review ten vocabulary cards.",
        target_count=10,
        reward_xp=20,
    ),
)


@dataclass(frozen=True)
class QuestCompletionResult:
    """Outcome of progressing one quest."""

    code: str
    completed: bool
    newly_completed: bool
    reward_xp_awarded: int


def quest_to_result(quest: DailyQuest) -> "QuestCompletionResult":
    """Project a quest row into its API result shape."""
    return QuestCompletionResult(
        code=quest.code,
        completed=quest.completed,
        newly_completed=False,
        reward_xp_awarded=0,
    )


class QuestService:
    """Daily quest operations on an externally-managed transaction."""

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def ensure_daily_quests(
        self, user_id: UUID, quest_date: date
    ) -> list[DailyQuest]:
        """Lazily create the three daily quests; reuse existing rows."""
        existing = await self._quests_for_date(user_id, quest_date)
        existing_codes = {quest.code for quest in existing}
        for definition in QUEST_DEFINITIONS:
            if definition.code in existing_codes:
                continue
            await self._conflict_safe_insert(user_id, quest_date, definition)
        if len(existing) < len(QUEST_DEFINITIONS):
            existing = await self._quests_for_date(user_id, quest_date)
        return existing

    async def get_today_quests(
        self, user_id: UUID, quest_date: date
    ) -> list[DailyQuest]:
        """Return today's quests (ensuring they exist)."""
        return await self.ensure_daily_quests(user_id, quest_date)

    async def progress_session_quests(
        self,
        user_id: UUID,
        quest_date: date,
        now: datetime,
        increment: int = 1,
    ) -> list[QuestCompletionResult]:
        """Advance session_1/session_2 by `increment` eligible sessions."""
        return await self._progress_codes(
            user_id, quest_date, now, ("session_1", "session_2"), increment
        )

    async def progress_vocab_quest(
        self,
        user_id: UUID,
        quest_date: date,
        now: datetime,
        increment: int = 1,
    ) -> list[QuestCompletionResult]:
        """Advance vocab_10 by `increment` successful reviews."""
        return await self._progress_codes(
            user_id, quest_date, now, ("vocab_10",), increment
        )

    async def award_quest_xp(self, quest: DailyQuest) -> int:
        """XP granted for a quest: reward once, zero when already paid."""
        if quest.completed and quest.completed_at is not None:
            return quest.xp_reward
        return 0

    # ------------------------------------------------------------------

    async def _quests_for_date(
        self, user_id: UUID, quest_date: date
    ) -> list[DailyQuest]:
        result = await self._db.execute(
            select(DailyQuest)
            .where(
                DailyQuest.user_id == user_id,
                DailyQuest.quest_date == quest_date,
            )
            .order_by(DailyQuest.code.asc())
        )
        return list(result.scalars().all())

    async def _conflict_safe_insert(
        self, user_id: UUID, quest_date: date, definition: QuestDefinition
    ) -> None:
        """INSERT ... ON CONFLICT DO NOTHING, per database dialect."""
        values = {
            "user_id": user_id,
            "quest_date": quest_date,
            "quest_type": definition.code,
            "code": definition.code,
            "title": definition.title,
            "description": definition.description,
            "target_count": definition.target_count,
            "progress_count": 0,
            "xp_reward": definition.reward_xp,
            "completed": False,
        }
        dialect = dialect_name(self._db)
        if dialect == "postgresql":
            statement = (
                pg_insert(DailyQuest)
                .values(**values)
                .on_conflict_do_nothing(
                    index_elements=["user_id", "quest_date", "code"]
                )
            )
        else:
            statement = (
                sqlite_insert(DailyQuest)
                .values(**values)
                .on_conflict_do_nothing(
                    index_elements=["user_id", "quest_date", "code"]
                )
            )
        await self._db.execute(statement)

    async def _progress_codes(
        self,
        user_id: UUID,
        quest_date: date,
        now: datetime,
        codes: tuple[str, ...],
        increment: int,
    ) -> list[QuestCompletionResult]:
        quests = await self.ensure_daily_quests(user_id, quest_date)
        results: list[QuestCompletionResult] = []
        for quest in quests:
            if quest.code not in codes:
                continue
            if quest.completed:
                results.append(
                    QuestCompletionResult(
                        code=quest.code,
                        completed=True,
                        newly_completed=False,
                        reward_xp_awarded=0,
                    )
                )
                continue
            quest.progress_count = min(
                quest.progress_count + increment, quest.target_count
            )
            reached = quest.progress_count >= quest.target_count
            if reached and quest.completed_at is None:
                quest.completed_at = now
                quest.completed = True
                results.append(
                    QuestCompletionResult(
                        code=quest.code,
                        completed=True,
                        newly_completed=True,
                        reward_xp_awarded=quest.xp_reward,
                    )
                )
                await record_event(
                    self._db,
                    user_id,
                    EVENT_QUEST_COMPLETED,
                    {"quest_code": quest.code, "local_date": quest_date.isoformat()},
                )
            else:
                results.append(
                    QuestCompletionResult(
                        code=quest.code,
                        completed=False,
                        newly_completed=False,
                        reward_xp_awarded=0,
                    )
                )
            quest.updated_at = now
        return results
