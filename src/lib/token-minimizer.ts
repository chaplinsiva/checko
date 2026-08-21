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
    phaseRule = `You are joining this group chat for the first time. Start with a warm, natural, in-character greeting acknowledging the room and ${userName}, then introduce your opening perspective on "${topic}".`;
  } else if (phase === 'stance') {
    phaseRule = `Share your core philosophical stance on "${topic}" with the group. Keep it to 2-3 sentences.`;
  } else {
    phaseRule = `Reply directly to what the previous speaker said about "${topic}". Challenge their point or build on it with your unique historical insight.`;
  }

  return `You are ${persona.name}, ${persona.title}. ${persona.bio}
Your voice: ${persona.tone}.

You are in a WhatsApp group chat discussing: "${topic}"

${phaseRule}

Write like a real person chatting — keep it to 2-3 natural sentences. Start with a quick greeting or acknowledgment of who you're replying to, then get into your actual point about the topic. Always finish every sentence completely. Never use headers, labels, or numbered lists in your response.`;
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

