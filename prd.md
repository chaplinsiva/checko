# Product Requirement Document (PRD)
## Checko — AI Persona Debate & Interactive Multi-Format Arena

---

## 1. Executive Summary & Product Vision

**Product Name:** Checko (Interactive AI Persona Debate & Multi-Format Arena)  
**Architecture:** Next.js 15 (App Router, Client-First Single Page Application)  
**AI Engines:** Google Gemini 3.5 API (`gemini-2.5-flash` / `gemini-3.5-pro`) & OpenRouter AI Engine (`meta-llama/llama-3.2-1b-instruct`, `deepseek/deepseek-r1`, `meta-llama/llama-3.3-70b-instruct`)  

### Vision
Checko is a real-time, browser-first interactive debate platform where iconic historical figures (e.g. *Albert Einstein, Stephen Hawking, Buddha, Charlie Chaplin, Nikola Tesla, Thomas Edison, Socrates, Machiavelli*) and user-created custom personas engage in structured, satirical, or intense group discussions and debates.

### Key Differentiators
1. **WhatsApp-Inspired Minimalist Group Chat UI:** Provides a familiar, highly responsive chat layout with active speaker avatars, live typing indicators (`is typing...`), editable group titles/topics, and previous group session history.
2. **Modern Context Lens ("If They Lived Today"):** Historical personas project their foundational philosophies onto 21st-century modern topics (AI ethics, space travel, quantum mechanics, capitalism vs. free energy, social media).
3. **Frontend-First Execution (Zero Backend Overhead):** Direct browser-based execution via modern React 19 hooks and `@google/genai` SDK / OpenRouter REST APIs.
4. **Low-Token Minimization Architecture:** Sliding window ($K=2$) + rolling JSON state summarization (`src/lib/token-minimizer.ts`) reducing prompt token consumption by **65% to 80%**.
5. **Real-time Voice Narration (TTS) & Mute Controls:** Integrated text-to-speech engine with customizable pitch, speed, and real-time toggleable voice muting.

---

## 2. User Experience & Core Features

### 2.1 WhatsApp-Inspired Group Chat Interface (`WhatsAppGroupChat.tsx`)
- **Editable Group Name & Debate Motion:**
  - Users can click directly on the header group title or pencil edit icon to update both the **Group Title** (e.g. *"Coffee with Einstein & Stephen"*) and the **Debate Motion / Topic Abstract** in real time.
  - Changes instantly update local component state, sync with active persona debate context, and persist to `localStorage` (`checko_saved_groups` & `checko_active_group_title`).
- **Filtered Group Members Bar:**
  - Displays avatar chips strictly for personas participating in the active group.
  - Provides quick member removal (`X` button) when group size exceeds 2 members.
- **Previous Group Chats Drawer Overlay:**
  - Accessible via the top left "Chats" button.
  - Features real-time topic search, chat motion previews, group title renaming (`Edit2`), and chat session deletion (`Trash2`).
- **Minimalist Header Toolbar:**
  - Streamlined controls: `+ New Chat`, `Mute Audio` toggle (`Volume2`/`VolumeX`), `Arena Settings` gear, and browser `Fullscreen` toggle (`Maximize2`/`Minimize2`).

### 2.2 Dynamic Custom Persona Creator (`CharacterModal.tsx`)
- **Home Screen & Drawer Access:** Accessible from the main Previous Group Chats drawer view (`UserPlus` icon).
- **Custom Persona Fields:**
  - **Name & Title:** (e.g., *Marcus Aurelius — Stoic Emperor*)
  - **Avatar Color & Custom Icon / Image URL.**
  - **Bio & Worldview:** Detailed background, historical context, philosophical stance.
  - **Speech Tone & Style:** Satirical, formal, aggressive, poetic, or analytical.
- Custom personas are saved in local storage and instantly selectable when creating new groups.

### 2.3 Incremental Conversation Flow & Paced Execution
- **Progressive Debate Phases:**
  - **Greetings Phase (Turns 1–2):** Short, contextual salutations between historical figures.
  - **Stance Phase (Turns 3–4):** Positioning on the debate motion.
  - **Debate Phase (Turns 5+):** Deep counter-arguments and inter-persona exchanges.
- **Turn-Delay Timer & Auto Play:**
  - Configurable pacing delay (2s, 5s, 8s, 12s).
  - Manual "Next Speaker ➔" button allows single-turn step execution.
  - Pause / Resume auto-play button with live countdown timer display.

### 2.4 User Interjection & Speech Narration (TTS)
- **User Participant Dock:** Users can message the group as a participant (e.g. *"Alex"*).
- **Logical AI Reply Queue:** AI figures recognize the user by name, address their input logically, and resume character debate sequence.
- **Text-to-Speech (TTS):**
  - Web Speech API integration with voice assignment, pitch, and rate configuration per persona.
  - One-click voice replay button per message bubble.
  - Instant mute toggle in header and footer controls.

---

## 3. Technical Architecture & System Design

### 3.1 Tech Stack
- **Framework:** Next.js 15 (App Router, React 19 Client-First Architecture)
- **Language:** TypeScript 5.x
- **Styling:** Vanilla CSS & Tailwind CSS (`@tailwindcss/postcss`)
- **Icons:** `lucide-react`
- **AI SDK & API Integrations:**
  - `@google/genai` (Google Gemini 3.5 SDK)
  - OpenRouter REST API (Meta Llama 3.2/3.3, DeepSeek R1)

### 3.2 Codebase Structure

```text
src/
├── app/
│   ├── layout.tsx         # Root HTML/Body Shell & Metadata
│   ├── page.tsx           # Main Page Container (Full Screen Layout)
│   └── globals.css        # Core Dark Theme Design Tokens & Reset
├── components/
│   ├── WhatsAppGroupChat.tsx  # Primary Minimalist Chat Interface & Drawer
│   ├── CharacterModal.tsx     # Custom Persona Creator Modal
│   ├── NewGroupModal.tsx       # New Group Debate Setup Modal
│   └── ModelSwitcher.tsx      # OpenRouter & Gemini AI Engine Dropdown
├── hooks/
│   ├── useDebateEngine.ts     # Central Debate State, Turn Queue & Pacing
│   └── useTextToSpeech.ts     # Voice Synthesis & Audio Mute Controller
├── lib/
│   ├── gemini.ts              # Gemini 3.5 & OpenRouter API Call Drivers
│   ├── personas.ts            # Built-in Historical Personas & Local Storage
│   └── token-minimizer.ts     # Sliding Window & Rolling JSON State Summarizer
└── types/
    └── debate.ts              # TypeScript Type Definitions & Models
```

---

## 4. Token Minimization & Cost Optimization Architecture

### 4.1 Problem Definition
In multi-party debates with 4+ AI personas and user interjections, including full turn history in prompt payloads leads to exponential token bloat:
$$\text{Prompt Tokens} = \text{System Instructions} + \text{All Persona Cards} + \sum_{i=1}^{N} \text{Turn}_i$$

### 4.2 Low-Token Pipeline Design (`src/lib/token-minimizer.ts`)

```
┌─────────────────────────────────────────────────────────────┐
│                    Gemini 3.5 System Prompt                 │
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
│  • Turn N-1 (Last speaker's turn)                           │
│  • Turn N (Current prompt trigger for speaker)              │
└──────────────────────────────┴──────────────────────────────┘
```

### 4.3 Optimization Metrics

| Technique | Implementation | Token Savings |
| :--- | :--- | :--- |
| **Sliding Window ($K=2$)** | Retains only the last 2 turn entries in active context | ~65% mid-debate |
| **Rolling State Summary** | Compresses historical turns into a compact JSON state summary | ~75% long-term |
| **Phase-Based Length Bounds** | Greeting phase: max 25 words. Debate phase: max 65 words | ~50% response tokens |

---

## 5. Non-Functional & Quality Requirements

1. **Performance:** Page load < 1s; client-side turn generation request dispatch < 100ms.
2. **Persistence:** Zero server database requirements; all custom personas, active turn histories, and group titles store reliably in `localStorage`.
3. **Accessibility & Aesthetics:** Dark mode first (`#0b141a`), high-contrast typography (`#e9edef`), smooth scroll-to-bottom transitions, and full responsive design for desktop & mobile viewports.
4. **Security & Privacy:** API keys remain strictly in browser memory / local `.env` variables and are never transmitted to third-party databases.

---

## 6. Verification & Test Plan

- **Automated Unit Tests:** `src/lib/__tests__/token-minimizer.test.ts` (Validates sliding window truncation & payload building).
- **Manual Verification Matrix:**
  - Group title & topic inline editing.
  - Previous chats drawer rename & delete functionality.
  - Sound mute / unmute behavior during active speech.
  - Browser fullscreen mode toggle.
  - Custom persona creation and group member selection.
