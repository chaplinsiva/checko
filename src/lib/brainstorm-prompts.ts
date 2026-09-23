import { Persona, DebateTurn, UserProfile } from '@/types/debate';
import { BrainstormFocus, BrainstormIdea, ProsConsMatrix } from '@/types/brainstorm';
import { getBrainstormRoleForPersona } from './brainstorm-personas';

export function buildBrainstormSystemInstruction(
  persona: Persona,
  teamPersonas: Persona[],
  appTitle: string,
  solutionPitch: string,
  targetAudience: string,
  focus: BrainstormFocus = 'all_round',
  userProfile?: UserProfile,
  language: 'en' | 'ta' = 'en'
): string {
  const role = getBrainstormRoleForPersona(persona.id);
  const duty = role?.brainstormDuty || `Evaluate the concept based on your philosophy: "${persona.defaultStance}"`;
  const badge = role?.specialtyBadge || '💡 Brainstormer';
  const userName = userProfile?.name || 'Founder';

  let focusDirective = '';
  switch (focus) {
    case 'pros_cons':
      focusDirective = 'Conduct rigorous Pros and Cons analysis. Actively dissect advantages vs liabilities, unit costs, and security risks.';
      break;
    case 'features_improvement':
      focusDirective = 'Propose concrete feature improvements, UX flow enhancements, and technical architecture optimizations.';
      break;
    case 'stress_test':
      focusDirective = 'Brutally stress test the pitch. Find critical failure modes, competitive threats, and reason why users might abandon the app.';
      break;
    default:
      focusDirective = 'Provide balanced startup feedback: praise strong value drivers, point out blind spots, and propose high-impact improvements.';
  }

  const langDirective = language === 'ta'
    ? `LANGUAGE: TAMIL (தமிழ்). You MUST write your response in natural, authentic Tamil script (தமிழ்). தொழில்முனைவோர் மற்றும் ஸ்டார்ட்-அப் (Startup) சிந்தனையுடன் பேசுங்கள்.`
    : `LANGUAGE: ENGLISH. Write in punchy, natural WhatsApp startup room style.`;

  return `You are ${persona.name}, ${persona.title}.
Your Brainstorming Role: [${badge}]
Your Duty: ${duty}
Core Stance: "${persona.defaultStance}"

You are in a live WhatsApp Incubator Room brainstorming a new product idea:
- App / Project Title: "${appTitle}"
- Core Solution Pitch: "${solutionPitch}"
- Target Audience: "${targetAudience}"
- Brainstorm Focus: ${focusDirective}

${langDirective}

BRAINSTORMING GUIDELINES:
- Offer constructive critique and concrete ideas to improve the app.
- When pointing out strong advantages, you may prefix or tag with "Pro:" or "Strength:".
- When pointing out risks, flaws, or trade-offs, tag with "Con:" or "Risk:".
- When proposing innovative additions, tag with "[IMPROVEMENT]" or "Suggestion:".
- Length: Exactly 1 or 2 concise, impactful lines (25-40 words maximum).
- Avoid generic praise like "Great idea!" — dive straight into specific, actionable startup insights.
- Speak naturally like a founder or startup advisor in a real live chat.`;
}

export function extractProsAndConsFromTurns(
  turns: DebateTurn[],
  initialIdea?: BrainstormIdea
): ProsConsMatrix {
  const pros: string[] = [...(initialIdea?.initialPros || [])];
  const cons: string[] = [...(initialIdea?.initialCons || [])];
  const improvements: string[] = [...(initialIdea?.initialImprovements || [])];

  for (const turn of turns) {
    const text = turn.content;
    const lines = text.split(/(?<=[.!?])\s+|\n+/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 10) continue;

      // Extract Pro / Strength / Advantage
      const proMatch = trimmed.match(/(?:(?:\[PRO\])|(?:pro\s*[:\-])|(?:strength\s*[:\-])|(?:advantage\s*[:\-]))\s*([^.!?]+)/i);
      if (proMatch && proMatch[1]) {
        const item = proMatch[1].trim();
        if (!pros.some((p) => p.toLowerCase().includes(item.toLowerCase().slice(0, 20)))) {
          pros.push(item);
        }
      }

      // Extract Con / Risk / Drawback / Liability
      const conMatch = trimmed.match(/(?:(?:\[CON\])|(?:con\s*[:\-])|(?:risk\s*[:\-])|(?:drawback\s*[:\-])|(?:liability\s*[:\-]))\s*([^.!?]+)/i);
      if (conMatch && conMatch[1]) {
        const item = conMatch[1].trim();
        if (!cons.some((c) => c.toLowerCase().includes(item.toLowerCase().slice(0, 20)))) {
          cons.push(item);
        }
      }

      // Extract Improvement / Suggestion / Feature idea
      const impMatch = trimmed.match(/(?:(?:\[(?:IMPROVEMENT|IDEA)\])|(?:suggestion\s*[:\-])|(?:we should\s+)(?:improve|add|use)?)\s*([^.!?]+)/i);
      if (impMatch && impMatch[1]) {
        const item = impMatch[1].trim();
        if (!improvements.some((imp) => imp.toLowerCase().includes(item.toLowerCase().slice(0, 20)))) {
          improvements.push(item.startsWith('improve') ? item : `Improve: ${item}`);
        }
      }
    }
  }

  // Calculate dynamic feasibility score (baseline 75, adjusted by ratio of pros to cons)
  const totalFactors = pros.length + cons.length;
  let score = 75;
  if (totalFactors > 0) {
    const ratio = pros.length / totalFactors;
    score = Math.round(50 + ratio * 45);
    score = Math.max(10, Math.min(98, score));
  }

  return {
    pros,
    cons,
    improvements,
    feasibilityScore: score,
  };
}
