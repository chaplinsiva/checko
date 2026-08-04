<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Project Instructions for Antigravity

## Project Overview

**Project Name:** Checko  
**Description:** Interactive AI Persona Debate & Multi-Format Arena with Gemini 3.5 API and low-token optimization.  
**Tech Stack:** TypeScript, Next.js 15 (App Router), React 19, Tailwind CSS, `@google/genai` (Google Gen AI SDK).  

**Codebase Map:** `src/app/` — Main App Router views & components.  
**Key Plan:** `docs/plans/2026-07-29-interactive-chair-debate-plan.md` — Implementation plan for the interactive chair debate stage & animations.  

---

## Process & Team Rules

1. **Methodology:** TDD + Phase-dependent hybrid teams (Cam, Archie, Wei, Dani, Pat, Sato, Tara, Pierrot).
2. **Token Optimization:** All debate features must maintain low token consumption using sliding window $K=2$ + rolling JSON state summarization (`src/lib/token-minimizer.ts`).
3. **Frontend-First:** Client-side Next.js execution calling Gemini 3.5 API directly via `@google/genai`.
