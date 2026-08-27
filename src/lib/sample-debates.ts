export interface SampleDebateQuote {
  personaId: string;
  quote: string;
}

export interface SampleDebate {
  id: string;
  title: string;
  category: 'Tech & Computing' | 'Philosophy & Spirituality' | 'Science & Physics' | 'Politics & History' | 'Art & Satire';
  badge: string;
  motion: string;
  tagline: string;
  personaIds: string[];
  accentColor: string;
  bgGradient: string;
  previewQuotes: SampleDebateQuote[];
  featured?: boolean;
}

export const SAMPLE_DEBATES: SampleDebate[] = [
  {
    id: 'ac-vs-dc',
    title: 'AC vs DC: War of the Currents',
    category: 'Science & Physics',
    badge: '⚡ Iconic Clash',
    motion: 'Commercial Grid Capitalism vs Free Wireless Energy for Humanity',
    tagline: 'Nikola Tesla and Thomas Edison clash over high-voltage AC transmission versus centralized direct current commercial grids.',
    personaIds: ['tesla', 'edison'],
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-950/40 via-[#111b21] to-amber-950/30',
    featured: true,
    previewQuotes: [
      {
        personaId: 'tesla',
        quote: 'Alternating current and wireless power transmission can electrify the entire globe freely and harmoniously!',
      },
      {
        personaId: 'edison',
        quote: 'Visionary dreams don’t run factories. Practical, reliable DC grids and sound business models build modern civilization.',
      },
    ],
  },
  {
    id: 'buddhism-vs-jainism',
    title: 'Buddhism vs Jainism: Paths to Liberation',
    category: 'Philosophy & Spirituality',
    badge: '🪷 Ancient Wisdom',
    motion: 'The Middle Way vs Absolute Non-Violence (Ahimsa) & Anekantavada: The True Path to Enlightenment',
    tagline: 'Gautama Buddha and Lord Mahavira examine extreme asceticism versus the Middle Way, multi-faceted truth, and ending suffering.',
    personaIds: ['buddha', 'mahavira'],
    accentColor: '#eab308',
    bgGradient: 'from-amber-950/40 via-[#111b21] to-yellow-950/30',
    featured: true,
    previewQuotes: [
      {
        personaId: 'buddha',
        quote: 'Extreme ascetic mortification is like tuning a lute string too tight. Liberation blooms along the Middle Way.',
      },
      {
        personaId: 'mahavira',
        quote: 'Without absolute Ahimsa in thought, word, and deed, subtle karmic bonds remain. Truth has infinite facets (Anekantavada).',
      },
    ],
  },
  {
    id: 'windows-vs-linux',
    title: 'Windows vs Linux: The OS Battlefield',
    category: 'Tech & Computing',
    badge: '🐧 Kernel Wars',
    motion: 'Open Source Unix Freedom & Developer Sovereignty vs Proprietary Desktop Ecosystems',
    tagline: 'Linus Torvalds and Bill Gates debate open source technical meritocracy against commercial software ubiquity.',
    personaIds: ['linus', 'billgates'],
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-950/40 via-[#111b21] to-sky-950/30',
    featured: true,
    previewQuotes: [
      {
        personaId: 'linus',
        quote: 'Talk is cheap. Show me the code! An open kernel where developers own their tools will outlive any closed licensing monopoly.',
      },
      {
        personaId: 'billgates',
        quote: 'Standardized commercial platforms incentivize trillions in developer software ecosystems and bring computers to every home.',
      },
    ],
  },
  {
    id: 'apple-vs-microsoft',
    title: 'Apple vs Microsoft: Closed Elegance vs Open Ubiquity',
    category: 'Tech & Computing',
    badge: '💻 Silicon Rivals',
    motion: 'Closed End-to-End Intuitive Elegance vs Standardized Mass Platform Accessibility',
    tagline: 'Steve Jobs and Bill Gates battle over design perfectionism, hardware-software integration, and market dominance.',
    personaIds: ['stevejobs', 'billgates'],
    accentColor: '#8b5cf6',
    bgGradient: 'from-purple-950/40 via-[#111b21] to-blue-950/30',
    featured: true,
    previewQuotes: [
      {
        personaId: 'stevejobs',
        quote: 'Design is not just what it looks like and feels like. Design is how it works! People don’t know what they want until you show it to them.',
      },
      {
        personaId: 'billgates',
        quote: 'Broad compatibility, backwards support, and an open hardware ecosystem enable billions of people to build their businesses.',
      },
    ],
  },
  {
    id: 'quantum-vs-relativity',
    title: 'Relativity vs Quantum: Nature of Reality',
    category: 'Science & Physics',
    badge: '⚛️ Cosmic Physics',
    motion: 'Is the Universe Strictly Deterministic or Fundamentally Probabilistic?',
    tagline: 'Albert Einstein and Stephen Hawking contest spacetime geometry, black hole information loss, and quantum uncertainty.',
    personaIds: ['einstein', 'hawking'],
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-950/40 via-[#111b21] to-indigo-950/30',
    featured: true,
    previewQuotes: [
      {
        personaId: 'einstein',
        quote: 'God does not play dice with the cosmos! Quantum mechanics is incomplete without an underlying deterministic reality.',
      },
      {
        personaId: 'hawking',
        quote: 'Not only does God play dice, but he sometimes throws them where they cannot be seen—inside black hole event horizons!',
      },
    ],
  },
  {
    id: 'machiavelli-vs-socrates',
    title: 'Virtue vs Realpolitik: Philosophy of Power',
    category: 'Politics & History',
    badge: '👑 Statecraft & Ethics',
    motion: 'Should State Power be Governed by Moral Virtue or Pragmatic Political Realism?',
    tagline: 'Socrates and Niccolò Machiavelli spar over truth, justice, deception, and the brutal mechanics of rulership.',
    personaIds: ['socrates', 'machiavelli'],
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/40 via-[#111b21] to-slate-950/30',
    featured: false,
    previewQuotes: [
      {
        personaId: 'socrates',
        quote: 'The unexamined life is not worth living. A ruler who harms virtue damages their own immortal soul above all.',
      },
      {
        personaId: 'machiavelli',
        quote: 'A prince who wishes to keep his state must learn how not to be good, and use this knowledge according to necessity.',
      },
    ],
  },
  {
    id: 'chaplin-vs-hitler',
    title: 'Satire & Liberty vs Authoritarian Dogma',
    category: 'Art & Satire',
    badge: '🎭 Cinema & Tyranny',
    motion: 'Human Freedom, Laughter and Satire vs Rigid Militaristic Totalitarianism',
    tagline: 'Charlie Chaplin takes on totalitarian propaganda with the unyielding power of humanism, humor, and empathy.',
    personaIds: ['chaplin', 'hitler'],
    accentColor: '#e11d48',
    bgGradient: 'from-rose-950/40 via-[#111b21] to-zinc-950/30',
    featured: false,
    previewQuotes: [
      {
        personaId: 'chaplin',
        quote: 'Greed has poisoned men’s souls. We think too much and feel too little. More than machinery we need humanity!',
      },
      {
        personaId: 'hitler',
        quote: 'The state demands strict discipline, national order, and the subordination of individual whims to the collective will.',
      },
    ],
  },
  {
    id: 'mindfulness-vs-technology',
    title: 'Digital Overload vs Inner Stillness',
    category: 'Philosophy & Spirituality',
    badge: '🧠 Modern Dilemma',
    motion: 'Does Hyper-Connected Computing Elevate Human Potential or Erode Mental Presence?',
    tagline: 'Gautama Buddha, Steve Jobs, and Stephen Hawking debate mindfulness in the era of artificial intelligence and smartphones.',
    personaIds: ['buddha', 'stevejobs', 'hawking'],
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-950/40 via-[#111b21] to-teal-950/30',
    featured: false,
    previewQuotes: [
      {
        personaId: 'buddha',
        quote: 'When the mind is constantly grasping at digital notifications, it loses contact with the peace of the present moment.',
      },
      {
        personaId: 'stevejobs',
        quote: 'A computer is a bicycle for our minds! Used thoughtfully, it amplifies human creative potential to cosmic heights.',
      },
    ],
  },
];

export function getSampleDebateById(id: string): SampleDebate | undefined {
  return SAMPLE_DEBATES.find((d) => d.id === id);
}

export function launchSampleDebate(sample: SampleDebate) {
  return {
    id: `group_${sample.id}_${Date.now()}`,
    groupTitle: sample.title,
    debateMotion: sample.motion,
    personaIds: sample.personaIds,
    lastMessage: sample.previewQuotes[0]?.quote || `Debate started: ${sample.motion}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
  };
}
