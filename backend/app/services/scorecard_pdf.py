"""CanadaReady™ Scorecard PDF rendering (SN-048).

Deterministic reportlab layout: Sonolo wordmark, the earned badge,
six band bars with scores and CLB-inspired hints, a stats row, and the
mandatory disclaimer footer. Uses only built-in Helvetica fonts and
fixed coordinates so the output is byte-stable for a given payload —
tests can assert the %PDF header and key strings.
"""

from io import BytesIO

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.schemas.scorecard import ScorecardOut

#: Brand palette (matches the mobile nightSky design system).
NIGHT_SKY = HexColor("#0F172A")
AURORA_TEAL = HexColor("#0EA5E9")
TEXT_SECONDARY = HexColor("#475569")
TEXT_TERTIARY = HexColor("#94A3B8")
SUCCESS = HexColor("#34D399")
WARM_CORAL = HexColor("#F97316")

PAGE_W, PAGE_H = letter
MARGIN = 56
CONTENT_W = PAGE_W - 2 * MARGIN


def _draw_band_bar(
    c: canvas.Canvas,
    y: float,
    label: str,
    score: int,
    clb_hint: str,
    bar_color,
) -> float:
    """Draw one labelled band row; returns the y position of the next row."""
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(NIGHT_SKY)
    c.drawString(MARGIN, y, label)
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_TERTIARY)
    c.drawRightString(MARGIN + CONTENT_W, y, clb_hint)

    bar_y = y - 16
    c.setFillColor(HexColor("#E2E8F0"))
    c.rect(MARGIN, bar_y, CONTENT_W, 8, stroke=0, fill=1)
    c.setFillColor(bar_color)
    c.rect(MARGIN, bar_y, CONTENT_W * score / 100.0, 8, stroke=0, fill=1)

    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(NIGHT_SKY)
    c.drawString(MARGIN, bar_y - 13, f"{score} / 100")
    return bar_y - 30


def build_scorecard_pdf(scorecard: ScorecardOut, sessions_completed: int) -> bytes:
    """Render the scorecard to a PDF byte string."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setTitle("Sonolo CanadaReady™ Scorecard")

    # Wordmark.
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(NIGHT_SKY)
    c.drawString(MARGIN, PAGE_H - MARGIN - 8, "Sonolo")
    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN + 66, PAGE_H - MARGIN - 6, "Sound like you belong.")

    # Badge.
    y = PAGE_H - MARGIN - 64
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(AURORA_TEAL)
    c.drawString(MARGIN, y, scorecard.badge.title)
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN, y - 18, scorecard.badge.tagline)

    # CanadaReady score callout.
    y -= 52
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NIGHT_SKY)
    c.drawString(MARGIN, y, "CanadaReady™ Score")
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(SUCCESS if scorecard.canada_ready_score >= 70 else WARM_CORAL)
    c.drawString(MARGIN + 120, y - 3, f"{scorecard.canada_ready_score} / 100")
    y -= 28

    # Band bars.
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NIGHT_SKY)
    c.drawString(MARGIN, y, "Speaking Readiness")
    y -= 26
    for band in scorecard.bands:
        y = _draw_band_bar(c, y, band.label, band.score, band.clb_hint, AURORA_TEAL)

    # Stats row.
    y -= 20
    stats = scorecard.stats
    stats_items = [
        ("Sessions", str(sessions_completed)),
        ("Speaking", f"{stats.speaking_minutes} min"),
        ("Streak", f"{stats.streak_current} days"),
        ("Total XP", str(stats.total_xp)),
    ]
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(NIGHT_SKY)
    c.drawString(MARGIN, y, "Your stats")
    y -= 16
    for index, (label, value) in enumerate(stats_items):
        x = MARGIN + index * (CONTENT_W / 4)
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(NIGHT_SKY)
        c.drawString(x, y, value)
        c.setFont("Helvetica", 9)
        c.setFillColor(TEXT_TERTIARY)
        c.drawString(x, y - 13, label)

    # Disclaimer footer.
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(TEXT_TERTIARY)
    c.drawCentredString(
        PAGE_W / 2,
        MARGIN - 22,
        scorecard.disclaimer,
    )
    c.setFont("Helvetica", 8)
    c.drawCentredString(
        PAGE_W / 2,
        MARGIN - 34,
        f"Generated {scorecard.generated_at.strftime('%Y-%m-%d %H:%M')} · Sonolo",
    )

    c.showPage()
    c.save()
    return buffer.getvalue()
