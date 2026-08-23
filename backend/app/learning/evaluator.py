"""Deterministic session evaluator.

Scores a completed speaking session across the six Sonolo skill
dimensions with transparent, rule-based heuristics that simulate LLM
output. The `SessionEvaluator.evaluate` contract is what a real
LLM-backed evaluator will later implement — same inputs, same schemas.
"""

import re
from collections.abc import Callable
from dataclasses import dataclass
from statistics import mean

from app.learning.schemas import (
    EvaluationRequest,
    EvaluationResponse,
    Insight,
    SkillScore,
    TranscriptTurn,
)

# ---------------------------------------------------------------------
# Tunable constants (deterministic; adjust with product data)
# ---------------------------------------------------------------------

TARGET_WPM = 130.0
WPM_PENALTY = 0.8
FILLER_PENALTY = 4.0
FILLER_PENALTY_CAP = 30.0
GRAMMAR_ERROR_PENALTY = 15.0
TARGET_WORD_BONUS = 8.0
TARGET_BONUS_CAP = 20.0
IDEAL_TTR = 0.6
ESTIMATED_WPM_BASELINE = 2.2  # words per second when no duration is given
FILLER_PAUSE_SECONDS = 0.4
TURN_LEAD_IN_SECONDS = 0.7

FILLERS = frozenset({"um", "uh", "erm"})
#: Tokens after which "like" is a verb, not a filler.
LIKE_VERB_PRECEDERS = frozenset(
    {
        "i", "you", "we", "they", "he", "she", "it", "to", "would", "do",
        "did", "does", "don", "don't", "really", "also", "just", "should",
        "could", "can", "may", "might", "must",
    }
)

DISCOURSE_MARKERS = (
    "however", "therefore", "because", "although", "moreover", "meanwhile",
    "besides", "finally", "first", "then", "next", "instead",
    "for example", "for instance", "in addition", "as a result",
    "on the other hand",
)

_THIRD_PERSON_FORMS: dict[str, str] = {
    "go": "goes", "do": "does", "have": "has", "make": "makes",
    "take": "takes", "want": "wants", "need": "needs", "like": "likes",
    "work": "works", "know": "knows", "think": "thinks", "say": "says",
    "come": "comes", "give": "gives", "get": "gets",
}

_AN_WORDS = (
    "appointment|apple|orange|hour|umbrella|egg|idea|exam|address|email|"
    "opinion|offer|answer|interview|event|error|amount|account|evening|"
    "office|open|operation|extra|upgrade|exchange"
)


@dataclass(frozen=True)
class GrammarPattern:
    """One detectable ESL error family with its fix and advice."""

    name: str
    regex: re.Pattern[str]
    advice: str
    replacement: Callable[[re.Match[str]], str]


GRAMMAR_PATTERNS: tuple[GrammarPattern, ...] = (
    GrammarPattern(
        name="missing_an",
        regex=re.compile(rf"\ba\s+({_AN_WORDS})\b", re.IGNORECASE),
        advice=(
            "Try using 'an' before vowel sounds (e.g., 'an appointment')."
        ),
        replacement=lambda match: f"an {match.group(1)}",
    ),
    GrammarPattern(
        name="third_person_s",
        regex=re.compile(
            r"\b(he|she|it)\s+(" + "|".join(_THIRD_PERSON_FORMS) + r")\b",
            re.IGNORECASE,
        ),
        advice="Add -s to the verb after he/she/it (e.g., 'she goes').",
        replacement=lambda match: (
            f"{match.group(1)} {_THIRD_PERSON_FORMS[match.group(2).lower()]}"
        ),
    ),
    GrammarPattern(
        name="subject_verb_agreement",
        regex=re.compile(
            r"\b(I\s+(?:is|are)|(?:he|she|it)\s+are|(?:we|they|you)\s+is)\b",
            re.IGNORECASE,
        ),
        advice="Match the verb to the subject (I am, she is, they are).",
        replacement=lambda match: {
            "i is": "I am", "i are": "I am",
            "he are": "he is", "she are": "she is", "it are": "it is",
            "we is": "we are", "they is": "they are", "you is": "you are",
        }[match.group(1).lower()],
    ),
    GrammarPattern(
        name="am_agree",
        regex=re.compile(r"\bam\s+agree\b", re.IGNORECASE),
        advice="Use 'agree' as a verb: 'I agree', not 'I am agree'.",
        replacement=lambda _match: "agree",
    ),
)


# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------


def _tokenize(text: str) -> list[str]:
    """Lowercase word tokens (letters and apostrophes)."""
    return re.findall(r"[a-z']+", text.lower())


def _split_sentences(text: str) -> list[str]:
    """Split raw text into trimmed, non-empty sentences."""
    return [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]


def _count_fillers(tokens: list[str]) -> int:
    """Count filler words; 'like' only when it is not acting as a verb."""
    count = sum(1 for token in tokens if token in FILLERS)
    previous = ""
    for token in tokens:
        if token == "like" and previous not in LIKE_VERB_PRECEDERS:
            count += 1
        previous = token
    return count


@dataclass(frozen=True)
class GrammarFinding:
    """A matched grammar error with its corrected sentence."""

    advice: str
    original_text: str
    correction: str


class SessionEvaluator:
    """Rule-based evaluator for completed speaking sessions."""

    async def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        """Score the six dimensions and build wins/growth insights."""
        user_turns: list[TranscriptTurn] = [
            turn for turn in request.transcript if turn.role == "user"
        ]
        user_text = " ".join(turn.text for turn in user_turns)
        tokens = _tokenize(user_text)
        sentences = _split_sentences(user_text)
        fillers = _count_fillers(tokens)
        duration = self._duration_seconds(
            tokens=tokens,
            fillers=fillers,
            user_turn_count=len(user_turns),
            provided=request.duration_seconds,
        )
        targets = request.scenario_targets or []
        target_vocab = targets.vocabulary if targets else []

        wpm = self._words_per_minute(len(tokens), duration)
        fluency = self._score_fluency(wpm, fillers)
        pronunciation = self._score_pronunciation(len(tokens), fillers)
        grammar_score, grammar_findings = self._score_grammar(sentences)
        vocabulary, used_targets = self._score_vocabulary(
            user_text, tokens, target_vocab
        )
        coherence = self._score_coherence(user_text, sentences)
        task_completion = self._score_task_completion(
            len(user_turns), len(tokens)
        )

        skills = [
            fluency,
            pronunciation,
            SkillScore(
                dimension="grammar",
                score=grammar_score,
                feedback=(
                    f"{len(grammar_findings)} grammar slip(s) to polish."
                    if grammar_findings
                    else "Clean grammar this session — nicely done."
                ),
            ),
            vocabulary,
            coherence,
            task_completion,
        ]
        speaking_power = round(mean(skill.score for skill in skills), 1)
        xp_earned = int(round(speaking_power * 0.5)) + 5 * len(user_turns)

        insights = self._build_insights(
            wpm=wpm,
            fillers=fillers,
            grammar_findings=grammar_findings,
            used_targets=used_targets,
            tokens=tokens,
            sentences=sentences,
            skills=skills,
        )

        return EvaluationResponse(
            speaking_power_score=speaking_power,
            skills=skills,
            insights=insights,
            xp_earned=xp_earned,
        )

    # -- dimension scorers ------------------------------------------------

    def _duration_seconds(
        self,
        tokens: list[str],
        fillers: int,
        user_turn_count: int,
        provided: float | None,
    ) -> float:
        """Use the reported duration or estimate one deterministically."""
        if provided is not None:
            return provided
        speaking = len(tokens) / ESTIMATED_WPM_BASELINE
        pauses = fillers * FILLER_PAUSE_SECONDS + user_turn_count * TURN_LEAD_IN_SECONDS
        return max(speaking + pauses, 1.0)

    def _words_per_minute(self, word_count: int, duration: float) -> float:
        """Average speaking pace across the user's turns."""
        if duration <= 0:
            return 0.0
        return word_count / (duration / 60.0)

    def _score_fluency(self, wpm: float, fillers: int) -> SkillScore:
        """Pace relative to 130 WPM plus filler penalties."""
        pace_score = max(0.0, 100.0 - abs(wpm - TARGET_WPM) * WPM_PENALTY)
        filler_penalty = min(fillers * FILLER_PENALTY, FILLER_PENALTY_CAP)
        score = round(max(0.0, min(100.0, pace_score - filler_penalty)), 1)

        if wpm > 150:
            feedback = "Energetic pace — try letting a few ideas breathe."
        elif wpm < 95:
            feedback = (
                "Take your time, but aim for a steadier rhythm — short "
                "phrases, then continue."
            )
        else:
            feedback = "Comfortable, natural speaking pace."
        if fillers >= 3:
            feedback += f" ({fillers} filler words noticed.)"
        return SkillScore(dimension="fluency", score=score, feedback=feedback)

    def _score_pronunciation(
        self, word_count: int, fillers: int
    ) -> SkillScore:
        """Mock heuristic: longer, steadier responses read as clearer."""
        score = round(
            min(100.0, 60.0 + min(word_count, 120) * 0.25 + (4.0 if fillers == 0 else 0.0)),
            1,
        )
        feedback = "Steady, clear delivery (heuristic until the acoustic model lands)."
        return SkillScore(dimension="pronunciation", score=score, feedback=feedback)

    def _score_grammar(
        self, sentences: list[str]
    ) -> tuple[float, list[GrammarFinding]]:
        """Regex checks for common ESL error families."""
        total_errors = 0
        findings: list[GrammarFinding] = []
        seen_patterns: set[str] = set()
        for sentence in sentences:
            for pattern in GRAMMAR_PATTERNS:
                if pattern.regex.search(sentence) is None:
                    continue
                total_errors += len(pattern.regex.findall(sentence))
                if pattern.name not in seen_patterns:
                    seen_patterns.add(pattern.name)
                    findings.append(
                        GrammarFinding(
                            advice=pattern.advice,
                            original_text=sentence,
                            correction=pattern.regex.sub(
                                pattern.replacement, sentence
                            ),
                        )
                    )
        score = round(max(0.0, 100.0 - total_errors * GRAMMAR_ERROR_PENALTY), 1)
        return score, findings

    def _score_vocabulary(
        self, user_text: str, tokens: list[str], targets: list[str]
    ) -> tuple[SkillScore, list[str]]:
        """Type-token ratio plus a bonus for hitting scenario targets."""
        unique_count = len({token for token in tokens if token})
        ttr = (unique_count / len(tokens)) if tokens else 0.0
        used_targets = [
            target
            for target in targets
            if re.search(rf"\b{re.escape(target.lower())}\b", user_text.lower())
            is not None
        ]
        bonus = min(len(used_targets) * TARGET_WORD_BONUS, TARGET_BONUS_CAP)
        score = round(max(0.0, min(100.0, ttr / IDEAL_TTR * 100.0 + bonus)), 1)

        if used_targets:
            feedback = (
                f"Nice range, and you used {len(used_targets)} scenario "
                f"target word(s)."
            )
        elif ttr >= IDEAL_TTR:
            feedback = "Rich, varied word choice."
        else:
            feedback = "Solid core words — swap some repeats for synonyms."
        return SkillScore(dimension="vocabulary", score=score, feedback=feedback), used_targets

    def _score_coherence(self, user_text: str, sentences: list[str]) -> SkillScore:
        """Discourse markers plus balanced sentence length."""
        lowered = user_text.lower()
        distinct_markers = sum(
            1
            for marker in DISCOURSE_MARKERS
            if re.search(rf"\b{re.escape(marker)}\b", lowered) is not None
        )
        average_length = (
            mean(len(_tokenize(sentence)) for sentence in sentences)
            if sentences
            else 0.0
        )
        length_bonus = 10.0 if 6.0 <= average_length <= 22.0 else 0.0
        score = round(
            min(100.0, 35.0 + distinct_markers * 10.0 + length_bonus), 1
        )
        if distinct_markers >= 3:
            feedback = "Ideas flow naturally with good connectors."
        elif distinct_markers >= 1:
            feedback = "Some linking words — add a few more to connect ideas."
        else:
            feedback = (
                "Connect your ideas with words like 'because', 'so', or "
                "'however'."
            )
        return SkillScore(dimension="coherence", score=score, feedback=feedback)

    def _score_task_completion(
        self, user_turn_count: int, word_count: int
    ) -> SkillScore:
        """Mock heuristic: enough turns and words mean the task was done."""
        score = round(
            min(
                100.0,
                25.0 + user_turn_count * 15.0 + min(word_count, 150) * 0.2,
            ),
            1,
        )
        if user_turn_count >= 4:
            feedback = "You stayed in the conversation and finished the task."
        else:
            feedback = "Keep going next time — a few more turns to complete the task."
        return SkillScore(
            dimension="task_completion", score=score, feedback=feedback
        )

    # -- insights ----------------------------------------------------------

    def _build_insights(
        self,
        wpm: float,
        fillers: int,
        grammar_findings: list[GrammarFinding],
        used_targets: list[str],
        tokens: list[str],
        sentences: list[str],
        skills: list[SkillScore],
    ) -> list[Insight]:
        """Wins and growth areas, guaranteed at least one of each."""
        insights: list[Insight] = []

        if wpm > 100:
            insights.append(
                Insight(type="win", text="Great speaking pace!")
            )
        for word in used_targets:
            insights.append(
                Insight(
                    type="win",
                    text=f"Excellent use of the word '{word}'!",
                )
            )
        for finding in grammar_findings:
            insights.append(
                Insight(
                    type="growth",
                    text=finding.advice,
                    original_text=finding.original_text,
                    correction=finding.correction,
                )
            )

        ttr = (
            len({token for token in tokens if token}) / len(tokens)
            if tokens
            else 0.0
        )
        average_length = (
            mean(len(_tokenize(sentence)) for sentence in sentences)
            if sentences
            else 0.0
        )
        if fillers >= 3:
            insights.append(
                Insight(
                    type="growth",
                    text=(
                        "Try reducing filler words like 'um' — pause and "
                        "breathe instead."
                    ),
                )
            )
        if len(tokens) >= 15 and ttr < 0.45:
            insights.append(
                Insight(
                    type="growth",
                    text="Vary your vocabulary: swap repeated words for synonyms.",
                )
            )
        if average_length > 0.0 and average_length < 6.0:
            insights.append(
                Insight(
                    type="growth",
                    text="Aim for full sentences with a bit more detail.",
                )
            )

        if not any(insight.type == "win" for insight in insights):
            best = max(skills, key=lambda skill: skill.score)
            insights.append(
                Insight(
                    type="win",
                    text=(
                        f"Strong {best.dimension.replace('_', ' ')} this "
                        f"session — keep building on it."
                    ),
                )
            )
        if not any(insight.type == "growth" for insight in insights):
            insights.append(
                Insight(
                    type="growth",
                    text="Challenge yourself: add one linking word per answer.",
                )
            )
        return insights
