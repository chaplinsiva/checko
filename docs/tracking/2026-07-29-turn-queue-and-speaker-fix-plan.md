<!-- agent-notes: { ctx: "tracking artifact for turn queue and speaker fix plan", deps: [docs/plans/2026-07-29-turn-queue-and-speaker-fix-plan.md], state: active, last: "pat@2026-07-29" } -->

# Tracking Artifact: Fix Double Turn Execution & Speaker Rotation Lock

- **Topic:** Fix Double Turn Execution & Speaker Rotation Lock
- **Date:** 2026-07-29
- **Prior Phase:** Implementation Completed (Sprint 1 MVP)
- **Current Phase:** Implementation Completed

## Summary
Plan to fix double turn invocations ("two time it telling") and speaker lock ("chaplin only speaking") by deriving active speakers deterministically (`personaTurns % length`) and decoupling timer countdown state from async side-effect triggers.

## Key Approach
1. Derive active speaker deterministically from non-user turn count (`personaTurns.length % activePersonas.length`).
2. Move `triggerNextTurn` side-effect outside React state updater callbacks.
3. Pass updated turns directly to `generateTurnForNextSpeaker(turns)` during user interjection to eliminate `setTimeout` race conditions.

## Acceptance Criteria
- Strict alternating persona sequence (Chaplin $\rightarrow$ Hitler $\rightarrow$ Chaplin $\rightarrow$ Hitler).
- Exactly ONE turn generated per 15-second cycle.
- Zero double invocations on user interjection.
