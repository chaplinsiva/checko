import { BrainstormIdea } from '@/types/brainstorm';
import { SavedGroupItem } from '@/components/WhatsAppGroupChat';

export const SAMPLE_BRAINSTORMS: BrainstormIdea[] = [
  {
    id: 'devvoice',
    title: 'DevVoice: AI Voice-First Pair Programmer',
    category: 'startup_dev',
    tagline: 'Ambient voice AI that reviews git diffs, catches race conditions, and explains code while you cook or walk.',
    problem: 'Engineers spend 40% of their workday in fatigue-inducing screen-locked code reviews and deciphering cryptic pull requests.',
    solution: 'An ambient audio-first AI developer copilot with real-time terminal & GitHub webhook streaming and low-latency voice banter.',
    targetAudience: 'Remote software engineers, tech leads, and open-source maintainers.',
    personaIds: ['linus', 'devon_tech', 'elena_pm', 'priya_analyzer'],
    focus: 'all_round',
    badge: '🚀 Developer Tools',
    accentColor: '#06B6D4',
    initialPros: [
      'Huge productivity unlock for remote engineers reducing visual fatigue',
      'High willingness to pay for developer productivity and engineering velocity tools',
      'Strong open-source integration potential with Git CLI and IDE extensions',
    ],
    initialCons: [
      'Voice input in open-plan offices can be awkward without ambient push-to-talk headsets',
      'High latency on AST parsing and LLM token generation could break conversational cadence',
      'Complex codebase context window exceeds typical real-time limits',
    ],
    initialImprovements: [
      'Implement AST tree-sitter chunking so only touched functions are audibly summarized',
      'Add whispered microphone sensitivity and macOS menu bar hotkey',
    ],
  },
  {
    id: 'freshloop',
    title: 'FreshLoop: P2P Food Surplus & Cold-Chain Logistics',
    category: 'social_impact',
    tagline: 'Hyperlocal redistribution network connecting bakeries, cafes, and grocers to local shelters within 60 minutes.',
    problem: 'Over 30% of edible prepared commercial food is dumped daily due to strict expiration regulations and zero micro-logistics.',
    solution: 'An automated routing app combining local courier idle capacity with real-time surplus push alerts for verified community kitchens.',
    targetAudience: 'Urban bakeries, restaurants, grocery managers, and non-profit food hubs.',
    personaIds: ['elena_pm', 'priya_analyzer', 'marcus_vc', 'buddha'],
    focus: 'pros_cons',
    badge: '🌱 Social Impact',
    accentColor: '#10B981',
    initialPros: [
      'Solves severe urban waste and food insecurity simultaneously',
      'Generates positive ESG public relations and tax write-off donation receipts for merchants',
      'Strong local viral loop among conscious neighborhood communities',
    ],
    initialCons: [
      'Food safety liability and cold-chain temperature monitoring risks',
      'Micro-logistics driver unit economics can be challenging without delivery subsidies',
      'Merchant staff friction during busy closing hours',
    ],
    initialImprovements: [
      'Integrate simple QR scan timestamp verification for perishable liability waivers',
      'Partner with existing gig couriers during non-peak afternoon hours',
    ],
  },
  {
    id: 'taxpilot',
    title: 'TaxPilot: Autonomous Micro-SaaS Agent for Freelancers',
    category: 'startup_dev',
    tagline: 'Bank-connected AI agent that auto-categorizes expenses, tracks invoice milestones, and calculates quarterly tax reserves.',
    problem: 'Freelancers and contractors lose thousands yearly in missed write-offs and face massive penalties from surprise tax deadlines.',
    solution: 'A zero-friction WhatsApp/Telegram bot connected to Plaid that prompts you instantly when an expense occurs and drafts tax deduction filings.',
    targetAudience: 'Solopreneurs, digital nomads, freelance designers, and contract developers.',
    personaIds: ['billgates', 'devon_tech', 'marcus_vc', 'priya_analyzer'],
    focus: 'all_round',
    badge: '💼 FinTech SaaS',
    accentColor: '#F59E0B',
    initialPros: [
      'Immediate, quantifiable ROI for users (saving real cash on taxes)',
      'Extremely high customer retention and sticky subscription revenue',
      'Low friction conversational UI over WhatsApp eliminates boring dashboard logins',
    ],
    initialCons: [
      'Strict banking compliance, SOC2 certification, and Plaid API costs',
      'Liability regarding incorrect tax advice or audit disputes',
      'Local tax jurisdiction variance across different states and countries',
    ],
    initialImprovements: [
      'Include a Certified Public Accountant (CPA) human-in-the-loop review add-on tier',
      'Start with a single focused country/tax code (e.g. US 1099 or UK HMRC) before expanding',
    ],
  },
  {
    id: 'medilocal',
    title: 'MediLocal: Offline-First Edge AI Triage Assistant',
    category: 'ai_deeptech',
    tagline: 'Runs quantized local vision and voice models on cheap smartphones to triage emergency symptoms without internet.',
    problem: 'Rural and remote communities lack immediate medical personnel, and cloud medical apps fail during network blackouts.',
    solution: 'A 100% offline quantized edge AI system providing preliminary first-aid protocols, rash analysis, and triage guidance.',
    targetAudience: 'Rural health workers, disaster relief teams, maritime crews, and remote outdoor travelers.',
    personaIds: ['tesla', 'devon_tech', 'priya_analyzer', 'marcus_vc'],
    focus: 'stress_test',
    badge: '🏥 DeepTech Healthcare',
    accentColor: '#8B5CF6',
    initialPros: [
      'Operates reliably during power cuts, natural disasters, and in deep wilderness',
      'Zero user health data transmitted to cloud servers (absolute privacy guarantee)',
      'Enormous humanitarian and public health impact',
    ],
    initialCons: [
      'High regulatory hurdles (FDA/CE medical device classification risk)',
      'Edge model hallucination could deliver dangerously incorrect guidance',
      'Hardware battery and compute constraints on older budget phones',
    ],
    initialImprovements: [
      'Strictly scope as an emergency first-aid triage decision support tool with clear disclaimers',
      'Use rule-based clinical boundary guardrails to constrain edge LLM outputs',
    ],
  },
  {
    id: 'habitzen',
    title: 'HabitZen: Social Accountability & Focus Circles',
    category: 'product_ux',
    tagline: 'Micro-pledge stakes with AI refereeing and peer circles that hold you accountable to deep work and wellness habits.',
    problem: '92% of self-improvement and habit tracking apps are abandoned within 2 weeks due to lack of real social skin-in-the-game.',
    solution: 'Peer escrow accountability rooms where automated AI monitors screen time and task completion with social consequences and rewards.',
    targetAudience: 'Students, knowledge workers, remote teams, and digital mindfulness seekers.',
    personaIds: ['stevejobs', 'elena_pm', 'kaelen_growth', 'priya_analyzer'],
    focus: 'features_improvement',
    badge: '⚡ Product & UX',
    accentColor: '#EC4899',
    initialPros: [
      'Behavioral psychology proves social accountability increases follow-through by 65%',
      'Strong organic community growth and virality as friends invite each other into circles',
      'High daily active usage (DAU/MAU) and micro-transaction gamification',
    ],
    initialCons: [
      'Users might feel shame or anxiety if pledges feel punitive',
      'Anti-cheat detection on habit completion without invading OS privacy',
      'Drop-off when a circle member becomes inactive',
    ],
    initialImprovements: [
      'Implement positive streak incentives and charity donation matching rather than pure penalties',
      'Create team sprint mode for 5-day focused work sprints',
    ],
  },
];

export function getSampleBrainstormById(id: string): BrainstormIdea | undefined {
  return SAMPLE_BRAINSTORMS.find((b) => b.id === id);
}

export function launchSampleBrainstorm(sample: BrainstormIdea): SavedGroupItem {
  const newGroupId = `group_brainstorm_${sample.id}_${Date.now()}`;
  const debateMotion = `[Brainstorming: ${sample.title}] Problem: ${sample.problem} | Solution: ${sample.solution} | Target Audience: ${sample.targetAudience}`;
  const firstPro = sample.initialPros?.[0] || 'High market potential and value unlock';

  return {
    id: newGroupId,
    groupTitle: `💡 ${sample.title}`,
    debateMotion,
    personaIds: sample.personaIds,
    lastMessage: `Brainstorming kicked off: "${sample.tagline}" (Top Pro: ${firstPro})`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
  };
}
