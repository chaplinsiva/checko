import { Persona, DebateTurn, DebateStateSummary, DebatePhase, UserProfile } from '@/types/debate';

export interface MinimizedPayload {
  systemInstruction: string;
  stateSummaryText: string;
  topic: string;
  slidingWindowTurns: DebateTurn[];
  estimatedPromptTokens: number;
  estimatedTokensSaved: number;
}

/**
 * Builds an ultra-compact system instruction for a specific persona
 * adhering to strict token constraints while strongly enforcing topic focus.
 */
export function buildSystemInstruction(
  persona: Persona,
  opponentPersonas: Persona[],
  topic: string,
  userProfile?: UserProfile,
  phase: DebatePhase = 'greeting'
): string {
  const opponentNames = opponentPersonas.map((p) => p.name).join(', ');
  const userName = userProfile?.name || 'User';

  let phaseRule = '';
  if (phase === 'greeting') {
    phaseRule = `Say a quick 1-line in-character greeting to ${userName} and the group, then give your opening take on "${topic}" with a real fact or principle in 1 line.`;
  } else if (phase === 'stance') {
    phaseRule = `State your core stance on "${topic}" using a real historical or scientific fact in 1-2 short sentences.`;
  } else {
    phaseRule = `Respond directly to the last point about "${topic}". Bring a specific real-world fact, scientific law, or historical lesson in 1-2 short sentences.`;
  }

  return `You are ${persona.name}, ${persona.title}. ${persona.bio}
Your voice: ${persona.tone}.

You are in a fast-paced WhatsApp group chat discussing: "${topic}"

${phaseRule}

STRICT CHAT RULES:
- Length: EXACTLY 1 OR 2 SHORT LINES ONLY (maximum 25-35 words).
- Real Data: Ground your argument in real historical facts, scientific theories, mathematical laws, or philosophical tenets authentic to ${persona.name}.
- Format: Natural WhatsApp chat style. Plain text only. Never use headers, bullet points, asterisks, or quotes. Finish every sentence completely.`;
}

/**
 * Creates a lightweight text representation of the current rolling debate state.
 */
export function buildStateSummaryText(
  topic: string,
  stateSummary: DebateStateSummary,
  userProfile?: UserProfile
): string {
  const userName = userProfile?.name || 'User';
  let stances = '';
  for (const [personaName, stance] of Object.entries(stateSummary.personaStances)) {
    stances += `${personaName}: "${stance}" | `;
  }

  return `[DEBATE STATE] Topic Motion: "${topic}" | Phase: ${stateSummary.currentPhase} | Stances: ${stances} ${stateSummary.userStance ? `${userName}: "${stateSummary.userStance}" | ` : ''
    }Conflict: ${stateSummary.latestConflict || 'Initial debate setup'}`;
}

/**
 * Prepares the minimized API payload using a Sliding Window of K=4 last turns.
 */
export function prepareMinimizedPayload(
  persona: Persona,
  allPersonas: Persona[],
  topic: string,
  fullTurns: DebateTurn[],
  stateSummary: DebateStateSummary,
  userProfile?: UserProfile
): MinimizedPayload {
  const opponentPersonas = allPersonas.filter((p) => p.id !== persona.id);
  const systemInstruction = buildSystemInstruction(
    persona,
    opponentPersonas,
    topic,
    userProfile,
    stateSummary.currentPhase
  );
  const stateSummaryText = buildStateSummaryText(topic, stateSummary, userProfile);

  // Expanded sliding window: last 4 turns for richer debate context
  const slidingWindowTurns = fullTurns.slice(-4);

  // Token calculations estimation (~4 chars per token)
  const systemTokens = Math.ceil(systemInstruction.length / 4);
  const stateTokens = Math.ceil(stateSummaryText.length / 4);
  const slidingTurnsTokens = Math.ceil(
    slidingWindowTurns.reduce((acc, t) => acc + t.content.length, 0) / 4
  );

  const estimatedPromptTokens = systemTokens + stateTokens + slidingTurnsTokens;

  // Unoptimized token count if full turns history were sent
  const fullTurnsTokens = Math.ceil(
    fullTurns.reduce((acc, t) => acc + t.content.length, 0) / 4
  );
  const unoptimizedTokens = systemTokens * 2 + fullTurnsTokens;

  const estimatedTokensSaved = Math.max(0, unoptimizedTokens - estimatedPromptTokens);

  return {
    systemInstruction,
    stateSummaryText,
    topic,
    slidingWindowTurns,
    estimatedPromptTokens,
    estimatedTokensSaved,
  };
}

