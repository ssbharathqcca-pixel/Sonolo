"""In-memory voice session manager.

Tracks one `VoiceSession` per active WebSocket, owns the turn-taking
state machine (IDLE -> LISTENING -> PROCESSING -> SPEAKING -> IDLE), and
runs a silence watchdog that auto-ends a turn when audio stops arriving.

The registry is a plain dict guarded by an asyncio.Lock — shaped so a
Redis-backed implementation can replace it without touching callers.
"""

import asyncio
import time
from collections.abc import Awaitable, Callable
from uuid import UUID

from fastapi import WebSocket

from app.voice.protocol import ServerMessage, VoiceState, state_change


class SessionAlreadyActiveError(RuntimeError):
    """Raised when a session_id registers while already active."""


class VoiceSession:
    """State for a single live voice connection."""

    def __init__(
        self,
        session_id: UUID,
        websocket: WebSocket,
        user_id: UUID | None = None,
    ) -> None:
        self.session_id = session_id
        self.user_id = user_id
        self.websocket = websocket
        self.state: VoiceState = VoiceState.IDLE
        self.lock = asyncio.Lock()
        self.send_lock = asyncio.Lock()
        self.audio_buffer: list[str] = []
        self.last_audio_at: float = 0.0
        self.silence_task: asyncio.Task[None] | None = None
        self.turn_task: asyncio.Task[None] | None = None

    async def send(self, message: ServerMessage) -> None:
        """Serialize and send one server message (frame-safe via lock)."""
        async with self.send_lock:
            await self.websocket.send_json(message.model_dump(mode="json"))

    def drain_audio(self) -> str:
        """Return and clear the buffered audio chunks as one string."""
        joined = "".join(self.audio_buffer)
        self.audio_buffer.clear()
        return joined

    def __repr__(self) -> str:
        return (
            f"VoiceSession(session_id={self.session_id!r}, "
            f"state={self.state!r})"
        )


TurnEndHandler = Callable[[VoiceSession], Awaitable[None]]


class SessionManager:
    """Registry and state machine for active voice sessions."""

    def __init__(
        self,
        silence_timeout: float = 2.0,
        turn_end_handler: TurnEndHandler | None = None,
    ) -> None:
        self._sessions: dict[UUID, VoiceSession] = {}
        self._registry_lock = asyncio.Lock()
        self.silence_timeout = silence_timeout
        self._turn_end_handler = turn_end_handler

    @property
    def active_session_count(self) -> int:
        """Number of currently registered sessions."""
        return len(self._sessions)

    def get(self, session_id: UUID) -> VoiceSession | None:
        """Return the live session for `session_id`, if any."""
        return self._sessions.get(session_id)

    async def register(
        self,
        session_id: UUID,
        websocket: WebSocket,
        user_id: UUID | None = None,
    ) -> VoiceSession:
        """Register a new connection; rejects duplicate session_ids."""
        async with self._registry_lock:
            if session_id in self._sessions:
                raise SessionAlreadyActiveError(
                    f"Session {session_id} is already active."
                )
            session = VoiceSession(session_id, websocket, user_id)
            self._sessions[session_id] = session
            return session

    async def unregister(self, session_id: UUID) -> None:
        """Cancel pending tasks and drop the session (on disconnect)."""
        async with self._registry_lock:
            session = self._sessions.pop(session_id, None)
        if session is None:
            return
        for task in (session.silence_task, session.turn_task):
            if task is not None and not task.done():
                task.cancel()
        for task in (session.silence_task, session.turn_task):
            if task is not None:
                try:
                    await task
                except (asyncio.CancelledError, Exception):
                    pass

    async def mark_audio(self, session: VoiceSession) -> bool:
        """Record an audio chunk; transitions to LISTENING.

        Returns False (and changes nothing) when a turn is already being
        processed or spoken — callers should surface a `busy` error.
        """
        async with session.lock:
            if session.state in (VoiceState.PROCESSING, VoiceState.SPEAKING):
                return False
            was_listening = session.state is VoiceState.LISTENING
            session.state = VoiceState.LISTENING
            session.last_audio_at = time.monotonic()
            if session.silence_task is None:
                session.silence_task = asyncio.create_task(
                    self._watch_silence(session)
                )
        if not was_listening:
            await session.send(state_change(VoiceState.LISTENING))
        return True

    async def begin_turn(self, session: VoiceSession) -> bool:
        """Try to move LISTENING/IDLE -> PROCESSING (exactly one turn).

        Returns False when a turn is already running. The pipeline is
        responsible for emitting the `state_change` to the client; this
        only locks the state internally.
        """
        async with session.lock:
            if session.state in (VoiceState.PROCESSING, VoiceState.SPEAKING):
                return False
            session.state = VoiceState.PROCESSING
            watcher = session.silence_task
            session.silence_task = None
        if watcher is not None and not watcher.done():
            watcher.cancel()
            try:
                await watcher
            except asyncio.CancelledError:
                pass
        return True

    async def apply_state(self, session: VoiceSession, state: VoiceState) -> None:
        """Mirror a pipeline-driven state_change into the session."""
        async with session.lock:
            session.state = state

    async def _watch_silence(self, session: VoiceSession) -> None:
        """Auto-trigger end-of-turn after `silence_timeout` without audio."""
        poll_interval = min(0.25, max(self.silence_timeout / 4.0, 0.05))
        try:
            while True:
                await asyncio.sleep(poll_interval)
                async with session.lock:
                    if session.state is not VoiceState.LISTENING:
                        return
                    elapsed = time.monotonic() - session.last_audio_at
                    if elapsed < self.silence_timeout:
                        continue
                handler = self._turn_end_handler
                if handler is not None:
                    await handler(session)
                return
        finally:
            session.silence_task = None
