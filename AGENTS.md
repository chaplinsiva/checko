<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Project Instructions for Antigravity

## Project Overview

**Project Name:** Checko  
**Description:** Interactive AI Persona Debate & WhatsApp-style Multi-Persona Group Chat Arena with Gemini API & low-token optimization.  
**Tech Stack:** TypeScript, Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), `@google/genai` (Google Gen AI SDK).  

**Codebase Map:** 
- `src/app/` — Main App Router views & layout (`globals.css`, `page.tsx`).
- `src/components/` — WhatsApp Group Chat UI (`WhatsAppGroupChat.tsx`, `Header.tsx`, `TranscriptFeed.tsx`, `UserDock.tsx`, `ModelSwitcher.tsx`, `NewGroupModal.tsx`).
- `src/hooks/` — Debate engine hook (`useDebateEngine.ts`).
- `src/lib/` — Gemini API integration & persona definitions (`gemini.ts`, `personas.ts`).
- `.agents/skills/` — Custom project skills (e.g. `deploy/SKILL.md`).

---

## Development & Environment Setup

1. **WSL Linux Runtime:** Run in Linux Node v20 LTS (`~/.local/bin/node`).
2. **Dev Server Command:** `npm run dev` (configured with `next dev --webpack` to avoid WSL Turbopack HMR chunk issues).
3. **Deployment Skill:** Use `.agents/skills/deploy/SKILL.md` for pre-flight build checks and Vercel/Node deployment workflows.

---

## Process & Team Rules

1. **Methodology:** TDD + Phase-dependent hybrid teams.
2. **Token Optimization:** All debate features must maintain low token consumption using sliding window $K=2$ + rolling JSON state summarization (`src/lib/token-minimizer.ts`).
3. **Frontend-First:** Client-side Next.js execution calling Gemini API directly via `@google/genai`.
