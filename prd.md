# Product Requirement Document (PRD)
## Checko — AI Persona Debate & Interactive Multi-Format Arena

---

## 1. Executive Summary & Product Vision

**Product Name:** Checko (Interactive AI Persona Debate & Multi-Format Arena)  
**Architecture:** Next.js 16 (App Router, Client-First Multi-View Architecture)  
**Test Framework:** Vitest (Strict TDD Methodology)  
**AI Engines:** Google Gemini API (`gemini-2.5-flash` / `gemini-2.5-pro`) & OpenRouter AI Engine (`meta-llama/llama-3.2-1b-instruct`, `deepseek/deepseek-r1`, `meta-llama/llama-3.3-70b-instruct`)  

### Vision
Checko is a real-time, browser-first interactive debate platform where iconic historical figures (e.g. *Albert Einstein, Stephen Hawking, Buddha, Charlie Chaplin, Nikola Tesla, Thomas Edison, Socrates, Machiavelli*) and user-created custom personas engage in structured, satirical, or intense group discussions and debates.

### Key Differentiators
1. **Multi-View Application Flow:** Structured 3-tier view navigation (`Landing Page` ➔ `Chat History & Create Hub` ➔ `Active Chat Arena` ➔ `Back to History / Home`).
2. **Wikipedia-Powered Persona Studio:** Instant 1-click import and automated profile generation for any historical, scientific, or cultural figure via Wikipedia REST and OpenSearch APIs.
3. **WhatsApp-Inspired Minimalist Group Chat UI:** Provides a familiar, highly responsive chat layout with active speaker avatars, live typing indicators (`is typing...`), editable group titles/topics, and per-group isolated session histories.
4. **Modern Context Lens ("If They Lived Today"):** Historical personas project their foundational philosophies onto 21st-century modern topics (AI ethics, space travel, quantum mechanics, capitalism vs. free energy, social media).
5. **Frontend-First Execution (Zero Backend Overhead):** Direct browser-based execution via modern React 19 hooks and `@google/genai` SDK / OpenRouter REST APIs.
6. **Low-Token Minimization Architecture:** Sliding window ($K=2$ to $K=4$) + rolling JSON state summarization (`src/lib/token-minimizer.ts`) reducing prompt token consumption by **65% to 80%**.
7. **Real-time Voice Narration (TTS) & Mute Controls:** Integrated text-to-speech engine with customizable pitch, speed, and real-time toggleable voice muting.

---

## 2. User Experience & Core Features

### 2.1 Multi-View Navigation Architecture (`page.tsx`)
- **Landing Page View (`LandingPage.tsx`):**
  - High-aesthetic hero section with ambient glow effects, responsive typography, and release badges.
  - Interactive live debate preview card simulating real-time dialogue between Einstein, Hawking, and Chaplin.
  - Feature highlights grid (WhatsApp Multi-Persona, Sliding Context Token Saver, Voice TTS, Steal Mic, Custom Character Studio, Multi-Model Switcher).
  - Persona showcase chips and primary CTAs: *"Open Chat Hub"* and *"Create New Chat"*.
- **Chat History & Create Hub View (`ChatHistoryHub.tsx`):**
  - Dedicated Arena Lounge displaying all saved and preset debate groups with participant avatar clusters, debate motion badges, and last turn snippets.
  - Real-time search bar filtering across titles, topics, and message transcripts.
  - Quick action controls: inline group renaming, session deletion with confirmation, and direct launch into any arena.
  - Quick launch preset banners and "+ Create Debate Group" wizard trigger.
  - `< Home` navigation button smoothly returning to the Landing Page.
- **Active WhatsApp-Style Chat Arena View (`WhatsAppGroupChat.tsx`):**
  - Top header `< Chats` back button navigating directly back to the Chat History Hub.

### 2.2 Wikipedia-Powered Custom Character Studio (`CharacterModal.tsx` & `src/lib/wikipedia.ts`)
- **Real-Time Wikipedia Search:** Integrated OpenSearch API with debounced autocomplete suggestions and figure descriptions.
- **1-Click Auto-Population:**
  - Fetches summary, official title, and biographical excerpt via Wikipedia REST v1 API (`/page/summary/{title}`).
  - Automatically cleans footnote citations (`[1]`, `[2]`, `[citation needed]` stripped).
  - Automatically infers character speech tone and philosophical worldview stance based on domain keywords.
  - Auto-selects deterministic color palette and high-resolution Wikipedia Commons portrait thumbnail.
- **Preset Inspiration Chips:** One-click quick creation for prominent figures (*Alan Turing, Marie Curie, Marcus Aurelius, Leonardo da Vinci, Cleopatra, Friedrich Nietzsche*).
- **Group Wizard Integration:** Dedicated `🌐 Add from Wikipedia` button directly accessible inside the New Group Creation modal (`NewGroupModal.tsx`).

### 2.3 Isolated Per-Group Chat History & Natural Greeting Start
- **Per-Group Transcripts:** Each debate group maintains its own isolated message history keyed under `checko_group_turns_${groupId}`.
- **Safe Group Switching:** Switching groups via `switchGroup()` preserves all historical messages and active state without accidental data loss.
- **Natural Greeting Phase Start:**
  - When opening a new or empty chat (`turns.length === 0`), the debate automatically begins in the **`greeting`** phase.
  - System instructions require the opening speaker to deliver a warm, in-character greeting acknowledging the room and user before advancing the motion.

### 2.4 User Interjection ("Steal Mic") & Voice Narration (TTS)
- **User Participant Dock:** Users can message the group as an active debater (e.g. *"Alex"*).
- **Logical AI Reply Queue:** AI figures recognize the user by name, address their arguments, and dynamically adapt debate flow.
- **Text-to-Speech (TTS):**
  - Web Speech API integration with voice assignment, pitch, and rate configuration per persona.
  - One-click voice replay button per message bubble.
  - Instant mute toggle in header and footer controls.

---

## 3. Technical Architecture & System Design

### 3.1 Tech Stack
- **Framework:** Next.js 16 (App Router, React 19 Client-First Architecture)
- **Language:** TypeScript 5.x
- **Testing:** Vitest (Strict TDD Workflow)
- **Styling:** Vanilla CSS & Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons:** `lucide-react`
- **External Data:** Wikipedia OpenSearch & REST v1 APIs (`en.wikipedia.org`)
- **AI Integrations:**
  - `@google/genai` (Google Gemini 2.5 SDK)
  - OpenRouter REST API (Meta Llama 3.2/3.3, DeepSeek R1)

### 3.2 Codebase Structure

```text
src/
├── app/
│   ├── layout.tsx             # Root HTML/Body Shell & Metadata
│   ├── page.tsx               # Central Navigation Controller (landing | history | chat)
│   └── globals.css            # Core Dark Theme Design Tokens & Custom Scrollbars
├── components/
│   ├── LandingPage.tsx        # High-Aesthetic Hero & Feature Showcase
│   ├── ChatHistoryHub.tsx     # Arena Lounge & Debate Transcript Manager
│   ├── WhatsAppGroupChat.tsx  # WhatsApp-Style Active Debate Stage & Controls
│   ├── CharacterModal.tsx     # Wikipedia-Powered Character Studio Modal
│   ├── NewGroupModal.tsx      # New Group Debate Setup Wizard
│   └── ModelSwitcher.tsx      # OpenRouter & Gemini AI Engine Dropdown
├── hooks/
│   ├── useDebateEngine.ts     # Multi-Party Turn Queue, Per-Group Persistence & Pacing
│   └── useTextToSpeech.ts     # Voice Synthesis & Audio Mute Controller
├── lib/
│   ├── gemini.ts              # Gemini & OpenRouter API Call Drivers
│   ├── personas.ts            # Built-in Historical Personas & Local Storage
│   ├── wikipedia.ts           # Wikipedia Search, REST Summary & Persona Converter
│   └── token-minimizer.ts     # Sliding Window & Rolling JSON State Summarizer
├── types/
│   └── debate.ts              # TypeScript Type Definitions & Models
└── lib/__tests__/
    ├── token-minimizer.test.ts # Token Minimizer & Prompt Unit Tests
    └── wikipedia.test.ts       # Wikipedia API & Persona Converter Unit Tests
```

---

## 4. Token Minimization & Cost Optimization Architecture

### 4.1 Low-Token Pipeline Design (`src/lib/token-minimizer.ts`)

```
┌─────────────────────────────────────────────────────────────┐
│                    Gemini / LLM System Prompt               │
│  • Active Persona Profile (< 80 tokens per speaker)         │
│  • Phase Constraint: [GREETING / STANCE / DEBATE]           │
│  • User Addressing Rule: Refer to User by [USER_NAME]       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                Rolling Multi-Party Debate State             │
│  • Concise Persona Stances JSON (< 150 tokens)              │
│  • Active Conflict & Latest User Point                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Sliding Dialogue Window                    │
│  • Turn N-3 to Turn N (Last 4 turns sliding context)        │
└──────────────────────────────┴──────────────────────────────┘
```

### 4.2 Optimization Metrics

| Technique | Implementation | Token Savings |
| :--- | :--- | :--- |
| **Sliding Window ($K=4$)** | Retains only the last 4 turn entries in active context | ~65% mid-debate |
| **Rolling State Summary** | Compresses historical turns into a compact JSON state summary | ~75% long-term |
| **Phase-Based Prompt Bounds** | Greeting phase: concise introduction. Debate phase: targeted rebuttals | ~50% response tokens |

---

## 5. Non-Functional & Quality Requirements

1. **Performance:** Page load < 1s; client-side turn generation request dispatch < 100ms.
2. **Persistence:** Zero server database dependencies; all custom personas, per-group transcripts, and preferences store reliably in `localStorage`.
3. **Aesthetics & UI Polish:** Dark mode palette (`#0b141a`, `#111b21`, `#182229`), high-contrast typography (`#e9edef`), emerald teal accents (`#00a884`), smooth scroll-to-bottom transitions, and full mobile & desktop responsiveness.
4. **Security & Privacy:** API keys remain strictly in browser memory / local storage and are never transmitted to third-party tracking databases.

---

## 6. Verification & Test Plan

- **Automated Vitest Suite:**
  - `src/lib/__tests__/wikipedia.test.ts` (Validates OpenSearch, REST v1 summary fetch, citation sanitization, tone/stance heuristics, and error fallbacks).
  - `src/lib/__tests__/token-minimizer.test.ts` (Validates sliding window truncation, prompt building, and greeting phase formatting).
- **Manual Verification Matrix:**
  - Navigation flow: Landing Page ➔ Chat History Hub ➔ Active Chat Arena ➔ Back to History / Landing.
  - Wikipedia search, auto-fill, and custom character creation.
  - Per-group turn storage persistence across group switches.
  - Natural greeting phase start on new debates.
  - Sound mute / unmute behavior during active speech.
