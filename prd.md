# Product Requirement Document (PRD)
## Checko — AI Persona Debate & Interactive Multi-Format Arena

---

## 1. Executive Summary & Vision

**Product Name:** Checko (Interactive Historical & Custom Persona Debates)  
**Target Architecture:** Next.js (App Router, Pure Frontend-First SPA/Client Architecture)  
**AI Engine:** Google Gemini 3.5 API (`gemini-3.5-flash` / `gemini-3.5-pro`)  

**Vision:**  
Checko is a dynamic, browser-first AI debate platform where iconic historical figures (e.g., *Charlie Chaplin vs. Adolf Hitler*, *Nikola Tesla vs. Thomas Edison*, *Aristotle vs. Machiavelli*) or user-created custom personas engage in structured, humorous, or intense discussions.

**Modern Context Lens ("If They Lived Today"):** Personas project their core historical philosophies onto modern 21st-century issues (AI, digital surveillance, modern social media, global economics), giving users deep multi-perspective insights into how past thinkers would critique today's world.

Rather than dumping full monologues instantly, debates start naturally with turn-by-turn opening greetings (e.g., *"Hi Hitler"* $\rightarrow$ *"Hi the Great Dictator Chaplin"*) and escalate logically. Turns run with a configurable timer delay (e.g., **5-second gap**) to give users time to read or step in.

Users can create new characters on the fly, select flexible debate modes (**1v1**, **2v2 Team Debate**, or **Multi-Persona Group Discussion**), and optionally enter as a 3rd party participant. AI personas listen, recognize the user, address them by name, and reply logically one-by-one.

**Core Technical Differentiator:**  
- **Frontend-First Execution:** Zero backend database dependencies. Runs entirely in the client via Next.js and Gemini 3.5 API.
- **Ultra-Minimized Token Engine:** Maintains character consistency and multi-participant memory across 1v1, 2v2, and group discussions while reducing token consumption by **65% to 80%**.

---

## 2. Core Features & Functional Requirements

### 2.1 Flexible Debate Formats
1. **1v1 Classic Debate:** Two personas face off on a chosen topic.
2. **2v2 Team Debate:** Two teams of two personas defend opposing stances (e.g., Team Optimism vs. Team Pessimism).
3. **Group Discussion (Panel/Roundtable):** 3 or more personas engage in an open-mic roundtable discussion.

### 2.2 Dynamic Custom Character Creation
- **Character Creator Modal:** Users can add new characters instantly without code changes.
- **Required Persona Fields:**
  - **Character Name & Title** (e.g., *Marcus Aurelius — Stoic Emperor*)
  - **Who Is He / Persona Bio:** Detailed background, historical context, core beliefs.
  - **Speech Style & Tone:** Formal, satirical, sarcastic, poetic, aggressive, etc.
  - **Default Debate Stance / Worldview.**
- Custom personas are saved in `localStorage` / `IndexedDB` and immediately selectable in 1v1, 2v2, or Group modes.

### 2.3 Incremental Conversation Flow & Opening Salutations
- **Natural Progressive Lifecycle:**
  - **Turns 1–2 (Greetings & Opening):** Short, contextual salutations (e.g., Chaplin: *"Hi Hitler..."* $\rightarrow$ Hitler: *"Hi, the Great Dictator Chaplin..."*).
  - **Turns 3–4 (Stance Declarations):** Brief positioning on the topic.
  - **Turns 5+ (Deep Argumentation & Counter-Points):** Escalating debate arguments.
- **5-Second Turn Timer (Paced Execution):**
  - Configurable delay (default 5s, adjustable from 2s to 10s) between AI turns.
  - Live visual countdown bar ("*Hitler is thinking... Next turn in 4s*") allows users time to digest or interrupt.

### 2.4 Optional User Entry & Logical Turn Response ("Include Me")
- **Optional Participation:** User participation is 100% optional. The AI debate runs seamlessly on its own if the user remains a spectator.
- **User Participant Profile:** User sets display name (e.g., *"Alex"*).
- **Steal Mic / Interject Button:** User can hit "Steal Mic" at any time, pausing the 5s timer.
- **Logical AI Multi-Turn Queue:** When the user interjects:
  1. The user's input is added to the turn queue.
  2. Persona A responds directly to the user (addressing them as *"Alex"*).
  3. Persona B listens, acknowledges both the user's point and Persona A's answer, and replies logically.
  4. Debate resumes its natural sequence.

### 2.5 Frontend-First Architecture (No Backend Dependency)
- **Client-Side Direct Execution:** All debate logic, state management, and Gemini 3.5 API stream consumption run directly in the browser via Next.js client components / local client services.
- **API Key Management:** User supplies their Gemini API key via UI Settings or `.env.local` for local execution.
- **Zero Database Requirement:** Session state, custom personas, and transcript histories persist locally.

---

## 3. Token Minimization Architecture (Gemini 3.5 Engine)

### 3.1 Multi-Persona Token Bloat Problem
In multi-persona debates (e.g., 4 personas in a 2v2 + 1 User), sending full dialogue history causes token usage to skyrocket exponentially:
$$\text{Tokens per call} = \sum (\text{Persona Cards}) + \text{State} + \sum_{i=1}^{N} \text{Turn}_i$$

### 3.2 Low-Token Multi-Persona Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Gemini 3.5 System Prompt                 │
│  • Active Persona Instructions (< 90 tokens per persona)    │
│  • Phase Indicator: [GREETING / STANCE / DEBATE]            │
│  • User Addressing Rule: Always refer to User as [USER_NAME] │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                Rolling Multi-Party Debate State             │
│  • Current Stance Summary per Persona (< 200 tokens total)  │
│  • Active Conflict Points & User's Last Claim               │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Sliding Dialogue Window                    │
│  • Turn N-1 (Previous speaker's response)                   │
│  • Turn N (Immediate response trigger for current speaker)  │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Token Cost Strategy Matrix

| Technique | Implementation Detail | Token Reduction |
| :--- | :--- | :--- |
| **System Instruction Freezing** | Leverage Gemini 3.5 System Instructions once per turn | ~35% per call |
| **Rolling State Summarization** | Every 4 turns, run background JSON summary pass | ~75% long-term |
| **Sliding Window ($K=2$)** | Attach only last 2 dialogue entries | ~65% mid-debate |
| **Phase-Constrained Length** | Max 25 words for Greetings (Turns 1-2); max 70 words for Debate | ~50% output tokens |

---

## 4. Technical Architecture (Frontend-First Next.js)

### 4.1 Technology Stack
- **Framework:** Next.js 14/15 (App Router, Client Components, React 19 / Modern Hooks)
- **Styling:** Vanilla CSS / CSS Modules / Tailwind CSS (Dark Futuristic Arena Theme)
- **AI SDK:** `@google/genai` (Official Google Gen AI SDK utilizing `gemini-3.5-flash` / `gemini-3.5-pro`)
- **State Management:** React `useReducer` + Context API + `localStorage` / `IndexedDB`
- **Timer / Scheduler:** Web Worker / `setInterval` hook with auto-pause on user interaction

### 4.2 Frontend Architecture Diagram

```
[ Next.js Client App (Browser) ]
 ├── [ Character Manager ] ── (Stores Built-in & Custom Personas in LocalStorage)
 ├── [ Paced Turn Scheduler ] ── (Manages 5s Delay, Pause/Resume, Phase Triggers)
 ├── [ Debate Engine Hook ] ── (Manages Turn Queue: 1v1, 2v2, Group, User Interjection)
 ├── [ Token Minimizer ] ── (Builds System Prompts, State Summaries, Sliding Windows)
 └── [ Gemini 3.5 Direct Client SDK ]
          │
          ▼
    (Google Gemini 3.5 API)
```

---

## 5. Detailed User Experience & UI Specifications

### 5.1 UI Layout & View Modes

1. **Header Bar:**
   - **Mode Toggle:** 1v1 Debate | 2v2 Team | Group Discussion.
   - **Pacing Control:** Turn Gap Timer Slider (e.g. 3s, 5s, 8s, Pause).
   - **Custom Character Creator Button (+ Add Character).**
   - **User Profile Modal:** Set Display Name (e.g. *"Alex"*).
   - **Live Token Savings Gauge.**

2. **Debate Stage Views:**
   - **1v1 Mode:** Two opposite character cards with speaking halos + active 5s timer ring.
   - **2v2 Mode:** Two team columns (Team A vs Team B cards).
   - **Group Discussion Mode:** Circular / Grid panel of 3+ character cards + User avatar card.

3. **Paced Audio/Visual Chat Stream:**
   - Chat bubbles expand smoothly per turn.
   - Distinct colors per character.
   - Turn Countdown progress bar below active speaker.

4. **Interactive User Interjection Dock (Optional 3rd Party):**
   - **"Steal Mic / Interject"** prominent button.
   - Pressing button immediately holds the turn timer.
   - Input box accepts user text; once submitted, AI personas respond to user one-by-one in sequence.

---

## 6. Prompt Engineering for Gemini 3.5

### 6.1 Multi-Persona System Prompt with Pacing & Phase Control

```text
You are roleplaying as [PERSONA_NAME].
Who you are: [PERSONA_BIO].
Tone: [TONE_DESCRIPTION].
Current Phase: [GREETING / STANCE / DEBATE].
User Participant: [USER_NAME] (Present: Yes/No).

RULES:
1. Stay strictly in character.
2. If Phase == GREETING: Provide a short 1-sentence salutation to opponent/user (under 20 words). Example: "Hi Chaplin..."
3. If responding to user interjection: Acknowledge [USER_NAME] directly by name and address their logical point first.
4. If Phase == DEBATE: Limit turn to 2-3 concise sentences (under 60 words).
```

### 6.2 Rolling State Update Prompt (JSON Schema)

```text
Summarize the current debate state:
Topic: [TOPIC]
User Name: [USER_NAME]
Last Speaker ([SPEAKER_NAME]): "[SPEAKER_TEXT]"
Output JSON format:
{
  "topic": "...",
  "current_phase": "GREETING / DEBATE",
  "persona_stances": { "[PERSONA_1]": "...", "[PERSONA_2]": "..." },
  "user_interjection": "...",
  "latest_conflict": "..."
}
```

---

## 7. Verification & Success Metrics

| Metric | Target |
| :--- | :--- |
| **Opening Realism** | Smooth greeting phase (e.g. *"Hi Hitler"* $\rightarrow$ *"Hi Chaplin"*) before deep debate |
| **Turn Pacing** | Configurable ~5-second timer delay between turns with visual countdown |
| **Optional User Flow** | System auto-debates seamlessly without user, but integrates user inputs logically when submitted |
| **Token Reduction** | > 70% saved across 1v1, 2v2, and group debate formats |

---

## 8. Implementation Roadmap (Frontend First)

- [ ] Next.js Client App Scaffolding (App Router + Client Components)
- [ ] Gemini 3.5 Client API Integration (`@google/genai`)
- [ ] Paced Turn Scheduler Hook with 5s delay & visual countdown progress bar
- [ ] Progressive Conversation Lifecycle (Greeting phase $\rightarrow$ Stance phase $\rightarrow$ Debate phase)
- [ ] Custom Character Creator UI & LocalStorage Persistence
- [ ] Multi-Format Debate Engine (1v1, 2v2, Group Discussion logic)
- [ ] Optional User Interjection Dock with logical multi-turn response queue
- [ ] Token Minimization State Buffer & Sliding Window logic
