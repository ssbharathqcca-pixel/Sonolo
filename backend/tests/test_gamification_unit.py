"""Unit tests for SN-014 business rules: streaks, XP, skills, quests, badges."""

import uuid
from datetime import UTC, date, datetime, timedelta

import pytest
from sqlalchemy import select

from app.models.gamification import DailyQuest, UserBadge
from app.models.user import User, UserSkill
from app.schemas.gamification import EvaluationScores
from app.services.gamification_service import GamificationService
from app.services.quest_service import QUEST_DEFINITIONS, QuestService
from app.services.session_service import calculate_session_xp

pytestmark = pytest.mark.asyncio

NOW = datetime(2026, 8, 22, 20, 0, tzinfo=UTC)  # 16:00 Toronto, 01:30+1d Kolkata
LOCAL_DATE = date(2026, 8, 22)


def make_user(**overrides: object) -> User:
    defaults: dict[str, object] = {
        "name": "Pavan",
        "native_language": "hi",
        "target_language": "en-CA",
        "learning_goal": "casual",
        "current_level": "seed",
    }
    defaults.update(overrides)
    return User(**defaults)  # type: ignore[arg-type]


def sample_scores(**overrides: float) -> EvaluationScores:
    values: dict[str, float] = {
        "fluency": 80.0,
        "pronunciation": 80.0,
        "grammar": 80.0,
        "vocabulary": 80.0,
        "coherence": 80.0,
        "task_completion": 80.0,
    }
    values.update(overrides)
    return EvaluationScores(**values)


async def add_user(db_session, **overrides: object) -> User:
    user = make_user(**overrides)
    db_session.add(user)
    await db_session.flush()
    return user


# -----------------------------------------------------------------------
# Streaks
# -----------------------------------------------------------------------


async def test_streak_first_activity_sets_one(db_session) -> None:
    user = await add_user(db_session)
    await GamificationService(db_session).update_streak(user, LOCAL_DATE, NOW)
    assert user.streak_count == 1
    assert user.longest_streak == 1
    assert user.streak_last_date == LOCAL_DATE
    assert user.last_activity_at == NOW


async def test_streak_same_local_date_unchanged(db_session) -> None:
    user = await add_user(db_session, streak_count=4, longest_streak=4, streak_last_date=LOCAL_DATE)
    await GamificationService(db_session).update_streak(user, LOCAL_DATE, NOW)
    assert user.streak_count == 4


async def test_streak_consecutive_day_increments(db_session) -> None:
    user = await add_user(db_session, streak_count=2, longest_streak=2, streak_last_date=LOCAL_DATE - timedelta(days=1))
    await GamificationService(db_session).update_streak(user, LOCAL_DATE, NOW)
    assert user.streak_count == 3
    assert user.longest_streak == 3


async def test_streak_resets_after_gap(db_session) -> None:
    user = await add_user(db_session, streak_count=9, longest_streak=9, streak_last_date=LOCAL_DATE - timedelta(days=3))
    await GamificationService(db_session).update_streak(user, LOCAL_DATE, NOW)
    assert user.streak_count == 1
    assert user.longest_streak == 9  # longest never decreases


async def test_streak_utc_midnight_crossing_local_unchanged(db_session) -> None:
    # 01:00 UTC Aug 23 is still Aug 22 21:00 in Toronto.
    late_utc = datetime(2026, 8, 23, 1, 0, tzinfo=UTC)
    user = await add_user(db_session, streak_count=2, streak_last_date=date(2026, 8, 22))
    await GamificationService(db_session).update_streak(user, date(2026, 8, 22), late_utc)
    assert user.streak_count == 2  # Same local date: no change.


async def test_streak_local_date_change_before_utc_midnight(db_session) -> None:
    # 04:00 UTC Aug 22 is 00:00 Aug 22 Toronto; previous local date Aug 21.
    just_past_midnight_local = datetime(2026, 8, 22, 4, 0, tzinfo=UTC)
    user = await add_user(db_session, streak_count=2, streak_last_date=date(2026, 8, 21))
    await GamificationService(db_session).update_streak(user, date(2026, 8, 22), just_past_midnight_local)
    assert user.streak_count == 3


# -----------------------------------------------------------------------
# XP
# -----------------------------------------------------------------------


async def test_xp_today_resets_on_local_date_change(db_session) -> None:
    user = await add_user(db_session, total_xp=100, xp_today=60, xp_today_date=date(2026, 8, 21))
    service = GamificationService(db_session)
    await service.apply_session_xp(user, 25, LOCAL_DATE, NOW)
    assert user.xp_today == 25
    assert user.xp_today_date == LOCAL_DATE
    assert user.total_xp == 125


async def test_session_xp_formula_exact_values() -> None:
    # Eligible, 300s (5), overall 82 (8), difficulty 3 (15), streak 1 -> 48.
    assert (
        calculate_session_xp(
            xp_eligible=True,
            duration_seconds=300,
            overall_score=82.0,
            scenario_difficulty=3,
            updated_streak=1,
        )
        == 48
    )
    # Missing difficulty defaults the bonus to 5; streak >= 3 adds 5.
    assert (
        calculate_session_xp(
            xp_eligible=True,
            duration_seconds=60,
            overall_score=50.0,
            scenario_difficulty=None,
            updated_streak=3,
        )
        == 20 + 1 + 5 + 5 + 5
    )


async def test_session_xp_never_exceeds_cap() -> None:
    for difficulty in (5, 9, 100):
        xp = calculate_session_xp(
            xp_eligible=True,
            duration_seconds=7200,
            overall_score=100.0,
            scenario_difficulty=difficulty,
            updated_streak=7,
        )
        assert xp <= 100
    # Difficulty bonus itself is capped at 25.
    assert (
        calculate_session_xp(
            xp_eligible=True,
            duration_seconds=0,
            overall_score=0.0,
            scenario_difficulty=9,
            updated_streak=0,
        )
        == 20 + 0 + 0 + 25
    )


async def test_non_eligible_session_awards_zero_xp() -> None:
    assert (
        calculate_session_xp(
            xp_eligible=False,
            duration_seconds=3600,
            overall_score=100.0,
            scenario_difficulty=5,
            updated_streak=7,
        )
        == 0
    )


# -----------------------------------------------------------------------
# Skills
# -----------------------------------------------------------------------


async def test_skill_update_creates_first_scores(db_session) -> None:
    from app.services.session_service import SessionService

    user = await add_user(db_session)
    updates = await SessionService(db_session).update_skills(
        user, sample_scores(fluency=62.5), NOW
    )
    assert len(updates) == 6
    fluency = next(u for u in updates if u.dimension == "fluency")
    assert fluency.previous_score is None  # No prior score existed.
    assert fluency.new_score == 62.5
    stored = (
        await db_session.execute(select(UserSkill))
    ).scalar_one()
    assert stored.fluency_score == 62.5


async def test_skill_update_ema_and_clamping(db_session) -> None:
    from app.models.user import UserSkill
    from app.services.session_service import SessionService

    user = await add_user(db_session)
    existing = UserSkill(
        user_id=user.id,
        fluency_score=80.0,
        pronunciation_score=99.0,
    )
    db_session.add(existing)
    await db_session.flush()
    updates = await SessionService(db_session).update_skills(
        user, sample_scores(fluency=60.0, pronunciation=100.0), NOW
    )
    fluency = next(u for u in updates if u.dimension == "fluency")
    assert fluency.new_score == pytest.approx(0.7 * 80.0 + 0.3 * 60.0)
    pronunciation = next(u for u in updates if u.dimension == "pronunciation")
    assert pronunciation.new_score <= 100.0  # Clamped.


# -----------------------------------------------------------------------
# Quests
# -----------------------------------------------------------------------


async def test_quest_generation_creates_three_quests(db_session) -> None:
    user = await add_user(db_session)
    quests = await QuestService(db_session).ensure_daily_quests(user.id, LOCAL_DATE)
    assert [q.code for q in quests] == ["session_1", "session_2", "vocab_10"]
    assert [q.xp_reward for q in quests] == [20, 30, 20]


async def test_quest_generation_is_idempotent(db_session) -> None:
    user = await add_user(db_session)
    service = QuestService(db_session)
    first = await service.ensure_daily_quests(user.id, LOCAL_DATE)
    second = await service.ensure_daily_quests(user.id, LOCAL_DATE)
    assert {q.id for q in first} == {q.id for q in second}


async def test_quest_session_1_completes_after_one_session(db_session) -> None:
    user = await add_user(db_session)
    service = QuestService(db_session)
    results = await service.progress_session_quests(user.id, LOCAL_DATE, NOW)
    by_code = {r.code: r for r in results}
    assert by_code["session_1"].completed and by_code["session_1"].newly_completed
    assert by_code["session_1"].reward_xp_awarded == 20
    assert not by_code["session_2"].completed


async def test_quest_session_2_completes_after_two_sessions(db_session) -> None:
    user = await add_user(db_session)
    service = QuestService(db_session)
    await service.progress_session_quests(user.id, LOCAL_DATE, NOW)
    results = await service.progress_session_quests(user.id, LOCAL_DATE, NOW)
    by_code = {r.code: r for r in results}
    assert by_code["session_2"].completed and by_code["session_2"].newly_completed
    assert by_code["session_2"].reward_xp_awarded == 30


async def test_quest_completion_not_reawarded(db_session) -> None:
    user = await add_user(db_session)
    service = QuestService(db_session)
    await service.progress_session_quests(user.id, LOCAL_DATE, NOW)
    await service.progress_session_quests(user.id, LOCAL_DATE, NOW)
    third = await service.progress_session_quests(user.id, LOCAL_DATE, NOW)
    by_code = {r.code: r for r in third}
    assert by_code["session_1"].reward_xp_awarded == 0
    assert by_code["session_2"].reward_xp_awarded == 0


async def test_vocab_quest_increments_per_review(db_session) -> None:
    user = await add_user(db_session)
    service = QuestService(db_session)
    for _ in range(10):
        results = await service.progress_vocab_quest(user.id, LOCAL_DATE, NOW)
    by_code = {r.code: r for r in results}
    assert by_code["vocab_10"].completed
    assert by_code["vocab_10"].reward_xp_awarded == 20
    # Session quests untouched by vocab reviews.
    quests = await service.ensure_daily_quests(user.id, LOCAL_DATE)
    session_one = next(q for q in quests if q.code == "session_1")
    assert session_one.progress_count == 0


# -----------------------------------------------------------------------
# Badges
# -----------------------------------------------------------------------


def quest_rows(**completed: bool) -> list[DailyQuest]:
    rows = []
    for definition in QUEST_DEFINITIONS:
        row = DailyQuest(
            user_id=uuid.uuid4(),
            quest_date=LOCAL_DATE,
            quest_type=definition.code,
            code=definition.code,
            title=definition.title,
            description=definition.description,
            target_count=definition.target_count,
            progress_count=definition.target_count,
            xp_reward=definition.reward_xp,
            completed=completed.get(definition.code, False),
            completed_at=NOW if completed.get(definition.code, False) else None,
        )
        rows.append(row)
    return rows


async def test_badge_first_session_awards_once(db_session) -> None:
    user = await add_user(db_session)
    service = GamificationService(db_session)
    first = await service.award_badges(user, LOCAL_DATE, NOW, 1, quest_rows())
    assert [b.badge_id for b in first] == ["first_session"]
    second = await service.award_badges(user, LOCAL_DATE, NOW, 2, quest_rows())
    assert second == []


async def test_badge_streak_3_awards_at_threshold(db_session) -> None:
    user = await add_user(db_session, streak_count=3)
    awarded = await GamificationService(db_session).award_badges(
        user, LOCAL_DATE, NOW, 1, quest_rows()
    )
    codes = [b.badge_id for b in awarded]
    assert "streak_3" in codes
    assert "streak_7" not in codes


async def test_badge_xp_500_awards_at_threshold(db_session) -> None:
    user = await add_user(db_session, total_xp=500)
    awarded = await GamificationService(db_session).award_badges(
        user, LOCAL_DATE, NOW, 1, quest_rows()
    )
    assert "xp_500" in [b.badge_id for b in awarded]


async def test_badge_quest_day_complete_requires_all_quests(db_session) -> None:
    user = await add_user(db_session)
    gamification = GamificationService(db_session)
    partial = await gamification.award_badges(
        user, LOCAL_DATE, NOW, 1, quest_rows(session_1=True)
    )
    assert "quest_day_complete" not in [b.badge_id for b in partial]

    all_done = await gamification.award_badges(
        user, LOCAL_DATE, NOW, 1, quest_rows(session_1=True, session_2=True, vocab_10=True)
    )
    assert "quest_day_complete" in [b.badge_id for b in all_done]


async def test_level_and_summary_reflect_state(db_session) -> None:
    from app.core.time import get_local_date_for_user, utc_now

    # Use the real current local date so the xp_today staleness check
    # in get_summary sees today's bucket, not a hardcoded one.
    today = get_local_date_for_user(utc_now(), "America/Toronto")
    user = await add_user(
        db_session,
        total_xp=250,
        xp_today=40,
        xp_today_date=today,
        streak_count=3,
        longest_streak=5,
        last_activity_at=NOW,
        streak_last_date=LOCAL_DATE,
    )
    db_session.add(
        UserBadge(
            user_id=user.id,
            badge_id="first_session",
            title="First session",
            description="Completed your first Sonolo voice session.",
            earned_at=NOW,
        )
    )
    await db_session.flush()
    summary = await GamificationService(db_session).get_summary(user)
    assert summary.level == 3
    assert summary.progress_to_next_level == 50
    assert summary.next_level_xp_threshold == 300
    assert summary.xp_today == 40
    assert summary.current_streak == 3
    assert [b.code for b in summary.badges] == ["first_session"]
