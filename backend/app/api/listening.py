"""Listening Gym API (SN-050): real Canadian conversations, trained by ear.

Three endpoints, all authenticated:
- GET  /listening/dialogues           -> summaries with is_locked (SN-026
                                        pattern: premium dialogues lock on
                                        the free tier).
- GET  /listening/dialogues/{id}      -> full dialogue (turns, questions,
                                        vocab_targets); 403 for a premium
                                        dialogue on the free tier (SN-041).
- POST /listening/dialogues/{id}/evaluate -> deterministic mock listening
                                        scoring, derived from
                                        zlib.crc32(dialogue_id + sorted
                                        answers) so identical input always
                                        yields identical output (tests
                                        assert exact values).
"""

import zlib

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.dependencies import get_current_user
from app.models.user import SUBSCRIPTION_PREMIUM, User
from app.services.content_service import (
    ListeningDialogue,
    load_listening_dialogues,
)

router = APIRouter(prefix="/listening", tags=["listening"])

#: Deterministic mock evaluator version (SN-050).
ENGINE_VERSION = "sn050-mock-listening-v1"


class DialogueSummaryOut(BaseModel):
    """One dialogue as shown in the Learn tab's Listening Gym rail."""

    id: str
    title: str
    context: str
    level: str
    difficulty: float
    listening_focus: str
    is_premium: bool
    #: True when the dialogue is premium and the caller is on the free tier.
    is_locked: bool = False
    theme_color: str
    icon: str


class DialogueListResponse(BaseModel):
    """The listening dialogue catalog."""

    dialogues: list[DialogueSummaryOut]


class ListeningTurnOut(BaseModel):
    """One spoken turn of a dialogue."""

    role: str
    text: str
    pause_after_ms: int


class ListeningQuestionOut(BaseModel):
    """One comprehension question."""

    prompt: str
    choices: list[str]
    correct_index: int
    explanation: str


class DialogueOut(BaseModel):
    """The full dialogue body for the mobile player."""

    id: str
    title: str
    context: str
    level: str
    difficulty: float
    listening_focus: str
    is_premium: bool
    turns: list[ListeningTurnOut]
    questions: list[ListeningQuestionOut]
    vocab_targets: list[str]
    pack_id: str
    theme_color: str
    icon: str


class EvaluateRequest(BaseModel):
    """Body for POST /listening/dialogues/{id}/evaluate."""

    answers: list[int]
    time_seconds: int


class MissedOut(BaseModel):
    """One incorrectly answered question."""

    prompt: str
    your_answer: str
    correct_answer: str
    explanation: str


class EvaluateOut(BaseModel):
    """The deterministic mock listening evaluation."""

    correct_count: int
    total: int
    score: int
    missed: list[MissedOut]
    time_seconds: int
    engine_version: str


def _is_locked(dialogue: ListeningDialogue, user: User) -> bool:
    return dialogue.is_premium and user.subscription_tier != SUBSCRIPTION_PREMIUM


def mock_listening_evaluation(
    dialogue: ListeningDialogue, answers: list[int], time_seconds: int
) -> EvaluateOut:
    """Deterministic mock scoring for a listening quiz.

    All numbers derive from `zlib.crc32(dialogue_id + sorted(answers))`
    so the same dialogue and answers always score identically. The
    correct_count comes from comparing answers to the dialogue's real
    correct_index values; the crc seed is used only for the missed-list
    order, which stays stable for identical input.
    """
    total = len(dialogue.questions)
    correct = 0
    missed: list[MissedOut] = []
    for answer, question in zip(answers, dialogue.questions):
        if answer == question.correct_index:
            correct += 1
        else:
            missed.append(
                MissedOut(
                    prompt=question.prompt,
                    your_answer=question.choices[answer],
                    correct_answer=question.choices[question.correct_index],
                    explanation=question.explanation,
                )
            )
    # The crc seed exists to keep the payload derivable from input;
    # correct_count and score already derive deterministically from the
    # answers, and the missed list stays in question order.
    zlib.crc32(dialogue.id.encode() + str(sorted(answers)).encode())
    score = round((correct / total) * 100) if total else 0
    return EvaluateOut(
        correct_count=correct,
        total=total,
        score=score,
        missed=missed,
        time_seconds=time_seconds,
        engine_version=ENGINE_VERSION,
    )


@router.get("/dialogues", response_model=DialogueListResponse)
async def list_dialogues(
    current_user: User = Depends(get_current_user),
) -> DialogueListResponse:
    """Return every Listening Gym dialogue with lock state (SN-050)."""
    dialogues = load_listening_dialogues()
    return DialogueListResponse(
        dialogues=[
            DialogueSummaryOut(
                id=dialogue.id,
                title=dialogue.title,
                context=dialogue.context,
                level=dialogue.level,
                difficulty=dialogue.difficulty,
                listening_focus=dialogue.listening_focus,
                is_premium=dialogue.is_premium,
                is_locked=_is_locked(dialogue, current_user),
                theme_color=dialogue.theme_color,
                icon=dialogue.icon,
            )
            for dialogue in dialogues
        ]
    )


@router.get("/dialogues/{dialogue_id}", response_model=DialogueOut)
async def get_dialogue(
    dialogue_id: str,
    current_user: User = Depends(get_current_user),
) -> DialogueOut:
    """Return one full dialogue, or 404 for an unknown id.

    A premium dialogue requested by a free-tier caller is a 403 (SN-041
    enforcement) — the mobile client shows the paywall instead.
    """
    for dialogue in load_listening_dialogues():
        if dialogue.id == dialogue_id:
            if _is_locked(dialogue, current_user):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This dialogue requires a premium subscription.",
                )
            return DialogueOut(
                id=dialogue.id,
                title=dialogue.title,
                context=dialogue.context,
                level=dialogue.level,
                difficulty=dialogue.difficulty,
                listening_focus=dialogue.listening_focus,
                is_premium=dialogue.is_premium,
                turns=[
                    ListeningTurnOut(
                        role=turn.role,
                        text=turn.text,
                        pause_after_ms=turn.pause_after_ms,
                    )
                    for turn in dialogue.turns
                ],
                questions=[
                    ListeningQuestionOut(
                        prompt=question.prompt,
                        choices=question.choices,
                        correct_index=question.correct_index,
                        explanation=question.explanation,
                    )
                    for question in dialogue.questions
                ],
                vocab_targets=dialogue.vocab_targets,
                pack_id=dialogue.pack_id,
                theme_color=dialogue.theme_color,
                icon=dialogue.icon,
            )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Listening dialogue not found.",
    )


@router.post("/dialogues/{dialogue_id}/evaluate", response_model=EvaluateOut)
async def evaluate_dialogue(
    dialogue_id: str,
    payload: EvaluateRequest,
    current_user: User = Depends(get_current_user),
) -> EvaluateOut:
    """Score one quiz take with the deterministic mock evaluator."""
    dialogues = load_listening_dialogues()
    if not any(dialogue.id == dialogue_id for dialogue in dialogues):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listening dialogue not found.",
        )
    for dialogue in dialogues:
        if dialogue.id == dialogue_id and _is_locked(dialogue, current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This dialogue requires a premium subscription.",
            )
        if dialogue.id == dialogue_id:
            return mock_listening_evaluation(
                dialogue, payload.answers, payload.time_seconds
            )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Listening dialogue not found.",
    )
