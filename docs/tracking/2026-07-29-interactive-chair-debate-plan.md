<!-- agent-notes: { ctx: "tracking artifact for interactive chair debate plan", deps: [docs/plans/2026-07-29-interactive-chair-debate-plan.md], state: active, last: "pat@2026-07-29" } -->

# Tracking Artifact: Interactive Chair Debate Stage & Animations

- **Topic:** Interactive Chair Debate Stage & Animations
- **Date:** 2026-07-29
- **Prior Phase:** None
- **Current Phase:** Implementation Completed (Sprint 1 MVP)

## Summary
Implementation plan for the Checko interactive chair debate stage featuring 3D/glassmorphism speaker chairs, active speaker neon halos, animated 5-second countdown timer rings, user "Steal Mic / Take 3rd Chair" interjections, and Gemini 3.5 low-token streaming integration.

## Key Approach
1. Install `@google/genai` and `framer-motion` / Tailwind animation utilities.
2. Build data models & built-in persona repository (Chaplin, Hitler, Tesla, Edison, Socrates, Machiavelli).
3. Implement `TokenMinimizer` (sliding window $K=2$ + rolling JSON state).
4. Implement `useDebateEngine` React hook managing phase transitions, 5s paced timer, and user interjection queue.
5. Construct interactive UI components (`ChairCard`, `DebateStage`, `UserDock`, `TranscriptFeed`, `CharacterModal`).

## Acceptance Criteria
- 3-Chair visual stage layout with glassmorphism styling.
- Active speaker chair glow + SVG 5-second countdown timer ring.
- Steal Mic button pauses timer and animates user entry into 3rd chair.
- AI personas recognize user display name and respond in logical sequence.
- Low-token Gemini 3.5 streaming payload execution.
