<!-- agent-notes: { ctx: "plan to fix double turn generation and speaker rotation lock", deps: [src/hooks/useDebateEngine.ts], state: active, last: "pat@2026-07-29" } -->

# Implementation Plan: Fix Double Turn Execution & Speaker Rotation Lock

## 1. Goal
Completely fix two critical turn engine bugs in Checko:
1. **Double Turn Execution ("Two time it telling"):** Fix race condition where turns are triggered twice per 15-second cycle.
2. **Speaker Rotation Lock ("Chaplin only speaking"):** Fix stale speaker index reference so characters strictly alternate (Chaplin $\rightarrow$ Hitler $\rightarrow$ Chaplin $\rightarrow$ Hitler).

---

## 2. Root Cause Analysis
- **Bug 1 (Double Turn Execution):** `triggerNextTurn()` was being invoked inside a React state updater function (`setTimerSeconds((prev) => ...)`). In React 18 / StrictMode, state updater functions execute twice per render cycle, causing two API calls/turns per tick. In addition, `submitUserInterjection` had a competing `setTimeout` alongside unpausing the timer.
- **Bug 2 (Speaker Rotation Lock):** `stateRef.current.currentSpeakerIndex` was captured as `0` at initialization and never updated synchronously inside `triggerNextTurn()`. Therefore, `activePersonas[currentSpeakerIndex % length]` always evaluated to `activePersonas[0]` (Charlie Chaplin).

---

## 3. Architecture Gate Items
- None (Internal state hook refactoring within `src/hooks/useDebateEngine.ts`).

---

## 4. Proposed Solution & Implementation Steps

### Step 1: Deterministic Speaker Derivation
- Replace `currentSpeakerIndex` state with deterministic speaker selection:
  ```ts
  const personaTurns = turns.filter((t) => t.speakerId !== 'user');
  const activeSpeakerIndex = personaTurns.length % activePersonas.length;
  const currentSpeaker = activePersonas[activeSpeakerIndex];
  ```
- This guarantees that every non-user turn alternates perfectly between Persona A (Chaplin) and Persona B (Hitler) regardless of user interjections or async delays.

### Step 2: Clean Single-Execution Timer (No Double Invocation)
- Separate countdown interval state from turn execution:
  ```ts
  useEffect(() => {
    if (isPaused || isGenerating) return;

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          return 15; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isGenerating]);
  ```
- Use a dedicated `useEffect` listening to `timerSeconds === 0` (or explicit trigger) outside React state updaters to call `triggerNextTurn()`.

### Step 3: Direct User Interjection Flow
- In `submitUserInterjection(text)`:
  1. Construct `userTurn`.
  2. Append `userTurn` to `turns`.
  3. Immediately invoke `generateTurnForNextSpeaker(updatedTurns)` passing the new turns array directly, eliminating `setTimeout` race conditions.

---

## 5. Personas Involved
- **Sato (Lead Dev):** Hook state refactoring & deterministic speaker rotation implementation.
- **Tara (QA/Testing):** Unit tests verifying alternating turns (Chaplin $\rightarrow$ Hitler $\rightarrow$ Chaplin) and zero double invocations.

---

## 6. Acceptance Criteria
- [ ] Turn 1 is Chaplin, Turn 2 is Hitler, Turn 3 is Chaplin, Turn 4 is Hitler (100% strict alternating sequence).
- [ ] Exactly ONE turn generates per 15-second timer cycle (no double turns).
- [ ] User interjection triggers exactly ONE response turn from the next persona in sequence, addressing the user by name.
