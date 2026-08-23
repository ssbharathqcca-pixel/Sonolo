"""Unit tests for the session evaluator's scoring logic."""

import pytest
from pydantic import ValidationError

from app.learning.evaluator import SessionEvaluator
from app.learning.schemas import (
    EvaluationRequest,
    ScenarioTargets,
    TranscriptTurn,
)

pytestmark = pytest.mark.asyncio

evaluator = SessionEvaluator()


def make_request(
    user_texts: list[str],
    duration: float | None = None,
    vocabulary: list[str] | None = None,
) -> EvaluationRequest:
    transcript = [
        turn
        for user_text in user_texts
        for turn in (
            TranscriptTurn(role="tutor", text="And what would you like?"),
            TranscriptTurn(role="user", text=user_text),
        )
    ]
    return EvaluationRequest(
        session_id="00000000-0000-4000-8000-000000000001",
        transcript=transcript,
        scenario_targets=ScenarioTargets(vocabulary=vocabulary or []),
        duration_seconds=duration,
    )


def get_skill(response, dimension: str) -> float:
    matching = [s for s in response.skills if s.dimension == dimension]
    assert matching, f"missing dimension: {dimension}"
    return matching[0].score


def growth_insights(response):
    return [i for i in response.insights if i.type == "growth"]


def win_insights(response):
    return [i for i in response.insights if i.type == "win"]


def skill_by_dimension(response, dimension):
    return next(s for s in response.skills if s.dimension == dimension)


SPEECH = (
    "Hi, could I get a medium double-double please? I would also like a "
    "maple dip because my friend recommended it, and honestly it is my "
    "first time at this coffee shop so I want to try everything that looks "
    "good on the menu today"
)


async def test_fast_speech_outscores_slow_speech() -> None:
    fast = await evaluator.evaluate(make_request([SPEECH], duration=20.0))
    slow = await evaluator.evaluate(make_request([SPEECH], duration=150.0))

    fast_fluency = get_skill(fast, "fluency")
    slow_fluency = get_skill(slow, "fluency")
    assert fast_fluency > slow_fluency
    assert 0.0 <= fast_fluency <= 100.0
    assert 0.0 <= slow_fluency <= 100.0
    assert any(w.text == "Great speaking pace!" for w in win_insights(fast))


async def test_filler_words_reduce_fluency() -> None:
    clean = await evaluator.evaluate(make_request([SPEECH], duration=40.0))
    filled = await evaluator.evaluate(
        make_request(["um, " + SPEECH + " uh, um"], duration=40.0)
    )
    assert get_skill(filled, "fluency") < get_skill(clean, "fluency")


async def test_missing_article_detected_and_corrected() -> None:
    response = await evaluator.evaluate(
        make_request(["I want to make a appointment tomorrow."])
    )
    assert get_skill(response, "grammar") < 100.0

    growths = growth_insights(response)
    article = [g for g in growths if "vowel sounds" in g.text]
    assert article, "expected missing-article growth insight"
    assert article[0].original_text is not None
    assert "a appointment" in article[0].original_text
    assert article[0].correction is not None
    assert "an appointment" in article[0].correction


async def test_third_person_verb_detected_and_corrected() -> None:
    response = await evaluator.evaluate(
        make_request(["She go to work by bus every morning."])
    )
    growths = growth_insights(response)
    third_person = [g for g in growths if "he/she/it" in g.text]
    assert third_person, "expected third-person growth insight"
    assert third_person[0].correction == "She goes to work by bus every morning"


async def test_target_vocabulary_bonus_and_win() -> None:
    # Same wording both times: only the target list differs, so the
    # vocabulary gap is exactly the target-word bonus (below the cap).
    wording = (
        "I like my coffee and I like my double-double and I like my morning"
    )
    with_target = await evaluator.evaluate(
        make_request([wording], vocabulary=["double-double"])
    )
    without_target = await evaluator.evaluate(
        make_request([wording], vocabulary=["timbit"])
    )
    assert (
        get_skill(with_target, "vocabulary")
        > get_skill(without_target, "vocabulary")
    )
    wins = win_insights(with_target)
    assert any("double-double" in w.text for w in wins)
    assert not any("timbit" in w.text for w in win_insights(without_target))


async def test_lexical_diversity_rewards_varied_wording() -> None:
    repetitive = await evaluator.evaluate(
        make_request(
            ["I like coffee. I like coffee. I like coffee and I like coffee."]
        )
    )
    varied = await evaluator.evaluate(
        make_request(
            [
                "Honestly, my favourite morning ritual is a fresh filter "
                "coffee with a hint of maple syrup before work."
            ]
        )
    )
    assert get_skill(varied, "vocabulary") > get_skill(repetitive, "vocabulary")


async def test_coherence_rewards_discourse_markers() -> None:
    plain = await evaluator.evaluate(
        make_request(["The bus was late. I arrived at work. I was tired."])
    )
    connected = await evaluator.evaluate(
        make_request(
            [
                "The bus was late, so I arrived at work after nine, "
                "because the traffic was terrible; however, my manager "
                "was kind about it."
            ]
        )
    )
    assert get_skill(connected, "coherence") > get_skill(plain, "coherence")


async def test_response_shape_and_bounds() -> None:
    response = await evaluator.evaluate(make_request([SPEECH]))
    dimensions = {skill.dimension for skill in response.skills}
    assert dimensions == {
        "fluency",
        "pronunciation",
        "grammar",
        "vocabulary",
        "coherence",
        "task_completion",
    }
    assert 0.0 <= response.speaking_power_score <= 100.0
    assert response.xp_earned >= 0
    assert response.speaking_power_score > 0


async def test_at_least_one_win_and_one_growth_always() -> None:
    # Clean, short, marker-free speech: fallbacks must still fire.
    response = await evaluator.evaluate(make_request(["Hello there."]))
    assert win_insights(response), "expected at least one win"
    assert growth_insights(response), "expected at least one growth"


async def test_transcript_without_user_turn_is_rejected() -> None:
    with pytest.raises(ValidationError):
        EvaluationRequest(
            session_id="00000000-0000-4000-8000-000000000001",
            transcript=[TranscriptTurn(role="tutor", text="Hello?")],
        )
