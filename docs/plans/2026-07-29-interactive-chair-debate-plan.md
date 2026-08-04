<!-- agent-notes: { ctx: "implementation plan for interactive chair debate stage & animations", deps: [prd.md, docs/plans/quickstart-backlog.md], state: active, last: "pat@2026-07-29" } -->

# Implementation Plan: Interactive Chair Debate Stage & Animations

## 1. Goal
Build an interactive, animated debate stage ("Chair Arena") in Next.js featuring:
- Visual character "Chairs" (Persona A, Persona B, and optional 3rd User Chair).
- Paced turn animations with a 5-second countdown timer ring around the active speaker.
- Interactive chair actions ("Steal Mic", "Take 3rd Chair", "Pause Stage").
- Smooth transition animations (glowing speaker halo, floating speech bubbles, interjection slide-ins).
- Direct integration with `@google/genai` Gemini 3.5 streaming SDK and token minimizer state engine.

---

## 2. Constraints & Technical Boundaries
- **Framework:** Next.js (App Router, React 19 Client Components, Framer Motion / CSS Animations).
- **Styling:** Tailwind CSS with modern dark glassmorphism aesthetic.
- **Backend/API:** Pure frontend execution calling Gemini 3.5 API (`gemini-3.5-flash`).
- **Token Efficiency:** Must adhere to the $K=2$ sliding window + rolling state JSON engine defined in `prd.md`.

---

## 3. Architecture Gate Items
- **Item 1: Client-Side State Engine & Stream Scheduler (`/src/lib/debate-engine.ts`)**  
  *Why Architectural:* Controls async timer scheduling, Gemini 3.5 streaming, sliding window payload assembly, and user interjection queuing.  
  *Decision:* Pure client-side React Hook (`useDebateEngine`) managing state via `useReducer` and `setInterval` without server DB.

---

## 4. Proposed Design Direction (Converged Sacrificial Concepts)

Combining the best elements of the sacrificial concepts:
1. **Glassmorphism Spotlight Arena:** 3 main chairs (Persona A, Persona B, User 3rd Center Chair) rendered with sleek glass cards, active speaker neon halos, and subtle hover tilt effects.
2. **Paced Timer Ring:** Animated SVG circular countdown timer around the active speaker's chair card (5s default).
3. **Interactive Chair Action Dock:**
   - **Take 3rd Chair / Steal Mic:** Smoothly slides the user avatar into the center chair.
   - **Pause / Resume Stage:** Freezes the timer and auto-turns.
   - **Reaction Badges:** Quick buttons to challenge, agree, or ask a question.
4. **Speech Stream Bubbles:** Real-time text streaming with typing/pulsing indicator and direct persona-to-persona / persona-to-user visual link.

---

## 5. Step-by-Step Implementation Approach (TDD)

### Step 5.1: Package Dependencies
- Install `@google/genai` and `framer-motion` (or Tailwind animation utilities) for smooth chair transitions.

### Step 5.2: Core Data Types & Mock Persona Repository
- Implement `/src/types/debate.ts` (Persona interface, Turn state, Stage Mode, Debate Phase).
- Implement `/src/lib/personas.ts` (Built-in historical personas: Charlie Chaplin, Adolf Hitler, Nikola Tesla, Thomas Edison, Socrates, Machiavelli).

### Step 5.3: Token Minimizer & Gemini 3.5 Client
- Implement `/src/lib/gemini.ts` (Gemini 3.5 Flash streaming client).
- Implement `/src/lib/token-minimizer.ts` (Sliding window $K=2$ + Rolling JSON State engine).

### Step 5.4: Debate Engine Hook (`useDebateEngine.ts`)
- Implement phase management (Greetings $\rightarrow$ Stances $\rightarrow$ Deep Debate).
- Implement 5s timer scheduler with pause/resume and user interjection queue.

### Step 5.5: UI Stage Components
- `/src/components/ChairCard.tsx`: Individual speaker chair with active glow halo & SVG timer ring.
- `/src/components/DebateStage.tsx`: Arena layout containing chairs, connection links, and speaker spotlight.
- `/src/components/UserDock.tsx`: "Steal Mic / Take 3rd Chair" interactive control bar.
- `/src/components/TranscriptFeed.tsx`: Paced dialogue stream bubbles.
- `/src/components/CharacterModal.tsx`: Dynamic custom character creator ("Who is he").

---

## 6. Personas Involved
- **Dani:** Visual UX design, chair animations, timer ring, and glassmorphism styling.
- **Tara:** Unit tests for token minimizer logic, sliding window truncation, and turn queue state transitions.
- **Sato:** TDD implementation of Next.js components and Gemini 3.5 streaming hook.

---

## 7. Acceptance Criteria
- [ ] 3-Chair Stage layout renders smoothly with dark glassmorphism styling.
- [ ] Active speaker chair glows with neon highlight and animated 5s countdown ring.
- [ ] Clicking "Steal Mic" pauses the timer and animates user entry into the 3rd chair.
- [ ] AI personas address the user by name and reply in logical turn-by-turn sequence.
- [ ] Gemini 3.5 streams turns with low token overhead (< 300 tokens per payload).
