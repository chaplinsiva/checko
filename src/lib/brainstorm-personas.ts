import { Persona } from '@/types/debate';
import { BrainstormCategory, BrainstormSquadRole } from '@/types/brainstorm';
import { BUILTIN_PERSONAS } from './personas';

export const STARTUP_PERSONAS: Persona[] = [
  {
    id: 'elena_pm',
    name: 'Elena Vance',
    title: 'Principal Product Architect & UX Visionary',
    bio: 'Former head of product at iconic tech scale-ups. Obsessed with ruthless MVP scoping, frictionless user workflows, and high-retention onboarding loops.',
    tone: 'Empathetic, crisp, user-focused, structured, visionary',
    defaultStance: 'A product succeeds only when user pain is solved with zero cognitive load. Build less, polish ruthlessly, and validate retention before scaling.',
    avatarColor: '#EC4899', // Hot Pink / Fuchsia
    avatarIcon: '🎯',
    avatarImage: '/avatars/stevejobs.jpg',
    voiceProfile: { pitch: 1.1, rate: 1.0, lang: 'en-US', genderHint: 'female' },
  },
  {
    id: 'devon_tech',
    name: 'Devon Reed',
    title: 'Lead System Architect & Tech Co-founder',
    bio: 'Distributed systems veteran and open-source contributor. Expert in low-latency cloud infrastructure, database indexing, API contracts, and real-time reliability.',
    tone: 'Technical, pragmatic, sharp, engineering-first, candid',
    defaultStance: 'Architecture is about trade-offs. Avoid premature microservices, choose boring battle-tested databases, and optimize for developer velocity and uptime.',
    avatarColor: '#06B6D4', // Cyan
    avatarIcon: '⚡',
    avatarImage: '/avatars/linus.jpg',
    voiceProfile: { pitch: 0.95, rate: 1.05, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'marcus_vc',
    name: 'Marcus Sterling',
    title: 'Pragmatic VC Investor & Market Analyst',
    bio: 'Early-stage venture capitalist and seed syndicate lead. Deep expertise in unit economics, customer acquisition costs (CAC), payback cycles, and market moats.',
    tone: 'Analytical, business-savvy, questioning, direct, financially disciplined',
    defaultStance: 'Product genius without sustainable distribution and high gross margins is just an expensive hobby. Where is the unfair distribution moat?',
    avatarColor: '#10B981', // Emerald
    avatarIcon: '💼',
    avatarImage: '/avatars/billgates.jpg',
    voiceProfile: { pitch: 0.9, rate: 0.95, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'priya_analyzer',
    name: 'Dr. Priya Nair',
    title: 'Pros & Cons Analyzer & Decision Auditor',
    bio: 'Former senior operations strategist and systems decision scientist. Specializes in objective risk-benefit matrices, failure mode analysis, and unbiased trade-off audits.',
    tone: 'Objective, methodical, balanced, forensic, razor-sharp on trade-offs',
    defaultStance: 'Every architectural or business choice has hidden liabilities and trade-offs. I systematically map every Pro against its counter-Con to expose vulnerabilities and guarantee bulletproof decision making.',
    avatarColor: '#8B5CF6', // Purple
    avatarIcon: '⚖️',
    avatarImage: '/avatars/socrates.jpg',
    voiceProfile: { pitch: 1.05, rate: 0.95, lang: 'en-US', genderHint: 'female' },
  },
  {
    id: 'kaelen_growth',
    name: 'Kaelen Frost',
    title: 'Growth Hacker & Contrarian Devil’s Advocate',
    bio: 'Specialist in viral loops, organic user acquisition, and edge-case stress testing. Relentlessly challenges assumptions, friction points, and premature complacency.',
    tone: 'Provocative, energetic, contrarian, fast-moving, innovative',
    defaultStance: 'If your users won’t passionately tell their friends in 48 hours, you have no product. Stress test the worst-case churn traps now.',
    avatarColor: '#F97316', // Orange
    avatarIcon: '🔥',
    avatarImage: '/avatars/edison.jpg',
    voiceProfile: { pitch: 1.0, rate: 1.1, lang: 'en-US', genderHint: 'male' },
  },
];

const BRAINSTORM_ROLES: Record<string, { specialtyBadge: string; duty: string }> = {
  elena_pm: {
    specialtyBadge: '🎨 UX & Product Lead',
    duty: 'Focuses on user journey, UX clarity, core feature set, and high-retention onboarding loops.',
  },
  devon_tech: {
    specialtyBadge: '⚙️ Tech Co-founder',
    duty: 'Focuses on scalable architecture, tech stack selection, APIs, database performance, and security.',
  },
  marcus_vc: {
    specialtyBadge: '💰 VC & Business Moat',
    duty: 'Evaluates market size, monetization models, CAC:LTV, unit economics, and competitive advantage.',
  },
  priya_analyzer: {
    specialtyBadge: '⚖️ Pros & Cons Analyzer',
    duty: 'Conducts systematic trade-off analysis, highlighting core pros, critical cons, and risk mitigations.',
  },
  kaelen_growth: {
    specialtyBadge: '🚀 Growth & Devil’s Advocate',
    duty: 'Pinpoints user churn traps, viral acquisition loops, and challenges rosy assumptions.',
  },
  stevejobs: {
    specialtyBadge: '🍎 Design Visionary',
    duty: 'Pushes for radical simplicity, intuitive elegance, and unforgettable brand touchpoints.',
  },
  linus: {
    specialtyBadge: '🐧 Kernel & Open Source',
    duty: 'Advocates for open standards, robust modular code, and avoiding vendor lock-in.',
  },
  billgates: {
    specialtyBadge: '📊 Enterprise Scale',
    duty: 'Emphasizes standardized platforms, enterprise distribution, and ecosystem partnerships.',
  },
  tesla: {
    specialtyBadge: '⚡ Radical Innovator',
    duty: 'Envisions zero-marginal cost breakthroughs and high-impact technology shifts.',
  },
  socrates: {
    specialtyBadge: '🏛️ Critical Inquirer',
    duty: 'Questions fundamental value propositions and uncovers hidden logical contradictions.',
  },
};

export function isBrainstormPersona(id: string): boolean {
  return STARTUP_PERSONAS.some((p) => p.id === id);
}

export function getAllBrainstormPersonas(): Persona[] {
  return [...STARTUP_PERSONAS, ...BUILTIN_PERSONAS];
}

export function getBrainstormRoleForPersona(personaId: string): BrainstormSquadRole | undefined {
  const all = getAllBrainstormPersonas();
  const persona = all.find((p) => p.id === personaId);
  if (!persona) return undefined;

  const roleMeta = BRAINSTORM_ROLES[personaId] || {
    specialtyBadge: '💡 Brainstormer',
    duty: `Contributes perspective based on ${persona.defaultStance}`,
  };

  return {
    persona,
    roleTitle: persona.title,
    specialtyBadge: roleMeta.specialtyBadge,
    brainstormDuty: roleMeta.duty,
  };
}

export function getBrainstormSquad(category: BrainstormCategory): Persona[] {
  switch (category) {
    case 'startup_dev':
      return [
        STARTUP_PERSONAS.find((p) => p.id === 'elena_pm')!,
        STARTUP_PERSONAS.find((p) => p.id === 'devon_tech')!,
        STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!,
        STARTUP_PERSONAS.find((p) => p.id === 'marcus_vc')!,
      ].filter(Boolean);

    case 'ai_deeptech':
      return [
        STARTUP_PERSONAS.find((p) => p.id === 'devon_tech')!,
        STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!,
        BUILTIN_PERSONAS.find((p) => p.id === 'tesla') || STARTUP_PERSONAS[0],
        STARTUP_PERSONAS.find((p) => p.id === 'marcus_vc')!,
      ].filter(Boolean);

    case 'product_ux':
      return [
        STARTUP_PERSONAS.find((p) => p.id === 'elena_pm')!,
        BUILTIN_PERSONAS.find((p) => p.id === 'stevejobs') || STARTUP_PERSONAS[1],
        STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!,
        STARTUP_PERSONAS.find((p) => p.id === 'kaelen_growth')!,
      ].filter(Boolean);

    case 'growth_marketing':
      return [
        STARTUP_PERSONAS.find((p) => p.id === 'kaelen_growth')!,
        STARTUP_PERSONAS.find((p) => p.id === 'marcus_vc')!,
        STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!,
        STARTUP_PERSONAS.find((p) => p.id === 'elena_pm')!,
      ].filter(Boolean);

    case 'social_impact':
      return [
        STARTUP_PERSONAS.find((p) => p.id === 'elena_pm')!,
        STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!,
        BUILTIN_PERSONAS.find((p) => p.id === 'buddha') || STARTUP_PERSONAS[2],
        STARTUP_PERSONAS.find((p) => p.id === 'marcus_vc')!,
      ].filter(Boolean);

    default:
      return [
        STARTUP_PERSONAS.find((p) => p.id === 'elena_pm')!,
        STARTUP_PERSONAS.find((p) => p.id === 'devon_tech')!,
        STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!,
      ].filter(Boolean);
  }
}
