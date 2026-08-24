# Sonolo API production image (SN-019).
#
# Multi-stage build: dependencies resolve into a virtualenv in the builder
# stage; the runtime stage ships only that virtualenv plus application code
# as an unprivileged user. The optional AI extras (requirements-ai.txt) are
# deliberately excluded so the base production image stays lean — real
# STT/LLM/TTS providers remain a local/GPU concern (see docs/RUNBOOK.md).

FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

COPY requirements.txt .

RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install -r requirements.txt

FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:${PATH}"

RUN groupadd --system sonolo \
    && useradd --system --gid sonolo --create-home sonolo

COPY --from=builder /opt/venv /opt/venv

WORKDIR /app

COPY alembic.ini ./
COPY alembic ./alembic
COPY scripts ./scripts
COPY app ./app

USER sonolo

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD ["python", "-c", "import sys,urllib.request; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=4).status == 200 else 1)"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
