import { Persona, DebateTurn, DebateStateSummary, DebatePhase, UserProfile } from '@/types/debate';

export interface MinimizedPayload {
  systemInstruction: string;
  stateSummaryText: string;
  topic: string;
  slidingWindowTurns: DebateTurn[];
  estimatedPromptTokens: number;
  estimatedTokensSaved: number;
  language?: 'en' | 'ta';
}

/**
 * Builds an ultra-compact system instruction for a specific persona
 * adhering to strict token constraints while strongly enforcing topic focus,
 * natural WhatsApp banter, stance preservation, and multi-language support (English / Tamil).
 */
export function buildSystemInstruction(
  persona: Persona,
  opponentPersonas: Persona[],
  topic: string,
  userProfile?: UserProfile,
  phase: DebatePhase = 'greeting',
  language: 'en' | 'ta' = 'en'
): string {
  const opponentNames = opponentPersonas.map((p) => p.name).join(', ');
  const firstOpponent = opponentPersonas[0]?.name || 'everyone';
  const userName = userProfile?.name || 'User';

  let phaseRule = '';
  if (language === 'ta') {
    if (phase === 'greeting') {
      phaseRule = `தொடக்க நிலை: குழுவினருக்கு சுருக்கமாக 1 வரியில் தொடக்க வணக்கம் கூறி, "${topic}" பற்றிய உங்கள் பார்வையை 1 வரியில் உண்மையான வரலாற்று/அறிவியல் ஆதாரத்துடன் கூறுங்கள்.`;
    } else if (phase === 'stance') {
      phaseRule = `நிலைப்பாடு: "${topic}" பற்றிய உங்கள் உறுதியான நிலைப்பாட்டை 1-2 வரிகளில் தமிழ் மொழியில் முன்வையுங்கள்.`;
    } else {
      phaseRule = `விவாதம்: நேரடி குழு உரையாடல் / கால் சாட் (live call chat) பாணியில் பேசுங்கள். ஒவ்வொரு முறையும் நபரின் பெயரை விளித்து அழைக்காமல் (no forced name prefixing), நேரடியாக வாதத்தை மறுக்கலாம், கேள்வி கேட்கலாம் அல்லது அறிவியல் உண்மையை பேசலாம் (எ.கா: "காரண-காரிய விதி இதை அனுமதிக்காது", "அப்படியென்றால் தாத்தா முரண்பாட்டை எப்படி தீர்ப்பீர்கள்?", "இதில் ஒரு அடிப்படை அறிவியல் பிழை உள்ளது").`;
    }
  } else {
    if (phase === 'greeting') {
      phaseRule = `Opening turn: Greet the group with a natural quick opening, then state your opening take on "${topic}" with a real fact in 1 line.`;
    } else if (phase === 'stance') {
      phaseRule = `Stance turn: State your core stance on "${topic}" using a real historical or scientific principle in 1-2 short sentences.`;
    } else {
      phaseRule = `Debate turn: Talk like real people in a live group voice call or active chat. Do NOT repeatedly prefix every single line with the opponent's name. Jump directly into your counter-argument, ask a sharp question, or state the physical/historical fact directly (e.g. "That completely breaks causality.", "How do you explain the paradox then?", "General relativity proves otherwise.").`;
    }
  }

  const languageDirective = language === 'ta'
    ? `LANGUAGE: TAMIL (தமிழ்). You MUST write your response in natural, authentic Tamil script (தமிழ்) as a real person chatting on WhatsApp. Keep your tone and stance intact.`
    : `LANGUAGE: ENGLISH. Write in natural WhatsApp banter English.`;

  return `You are ${persona.name}, ${persona.title}. ${persona.bio}
Your voice: ${persona.tone}.
Your philosophical stance: "${persona.defaultStance}".

You are in a fast-paced WhatsApp group chat debating: "${topic}"

${languageDirective}

${phaseRule}

STRICT CHAT RULES:
- Length: EXACTLY 1 OR 2 SHORT LINES ONLY (maximum 20-35 words).
- CONTINUITY & EVOLUTION: Follow the natural thread of the ongoing dialogue. Do NOT repeat points or circle around the same topic. Continually advance the debate into new angles, deeper scientific mechanisms, or historical implications.
- Live Call Flow (No Robotic Formulas): Do NOT mechanically start every reply with the debater's name (avoid "Stephen, ...", "Albert, ...", "ஸ்டீபன், ..."). Vary your openers naturally like a real group phone call or fast chat.
- NO Affirmation Loops: NEVER start with "Yes", "Yeah", "ஆம்", "ஆமாம்", "சரி", or "I agree".
- Stance & Facts: Strictly maintain ${persona.name}'s core stance ("${persona.defaultStance}") using real historical, scientific, or mathematical facts.
- Format: Plain text only. Never use headers, bullet points, asterisks, or quotes. Finish every sentence completely.`;
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
 * Compiles a token-minimized prompt payload applying sliding window (K=8)
 * and rolling state summary.
 */
export function prepareMinimizedPayload(
  persona: Persona,
  activePersonas: Persona[],
  topic: string,
  turns: DebateTurn[],
  stateSummary: DebateStateSummary,
  userProfile?: UserProfile,
  language: 'en' | 'ta' = 'en'
): MinimizedPayload {
  const opponentPersonas = activePersonas.filter((p) => p.id !== persona.id);
  const systemInstruction = buildSystemInstruction(
    persona,
    opponentPersonas,
    topic,
    userProfile,
    stateSummary.currentPhase,
    language
  );
  const stateSummaryText = buildStateSummaryText(topic, stateSummary, userProfile);

  // Sliding window K=8 (keep last 8 turns for rich dialogue continuity)
  const slidingWindowTurns = turns.slice(-8);

  // Token estimates (approx 1 token per 4 characters)
  const systemTokens = Math.ceil(systemInstruction.length / 4);
  const summaryTokens = Math.ceil(stateSummaryText.length / 4);
  const turnsTokens = slidingWindowTurns.reduce(
    (acc, t) => acc + Math.ceil(t.content.length / 4) + 10,
    0
  );
  const estimatedPromptTokens = systemTokens + summaryTokens + turnsTokens;

  // Calculate tokens saved compared to full history
  const fullTurnsTokens = turns.reduce(
    (acc, t) => acc + Math.ceil(t.content.length / 4) + 10,
    0
  );
  const estimatedTokensSaved = Math.max(0, fullTurnsTokens - turnsTokens);

  return {
    systemInstruction,
    stateSummaryText,
    topic,
    slidingWindowTurns,
    estimatedPromptTokens,
    estimatedTokensSaved,
    language,
  };
}
