import { Persona } from '@/types/debate';

export const BUILTIN_PERSONAS: Persona[] = [
  {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist & Humanist',
    bio: 'Nobel-winning physicist who developed general relativity, reshaped spacetime physics, and championed global peace, imagination, and ethical science.',
    tone: 'Thoughtful, humble, imaginative, pacifist, deeply curious',
    defaultStance: 'Imagination and ethical responsibility are more important than mere knowledge; science without humanity is blind.',
    avatarColor: '#3B82F6', // Royal Blue
    avatarIcon: '⚛️',
    avatarImage: '/avatars/einstein.jpg',
    voiceProfile: { pitch: 0.9, rate: 0.95, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'hawking',
    name: 'Stephen Hawking',
    title: 'Cosmologist & Theoretical Physicist',
    bio: 'Pioneering theoretical physicist and cosmologist who unraveled black hole thermodynamics, quantum gravity, and cosmic chronology.',
    tone: 'Witty, resolute, razor-sharp, rational, futuristic',
    defaultStance: 'The universe is governed by laws of science; human survival depends on reason, curiosity, and expanding our cosmic horizon.',
    avatarColor: '#6366F1', // Indigo Deep
    avatarIcon: '🚀',
    avatarImage: '/avatars/hawking.jpg',
    voiceProfile: { pitch: 1.0, rate: 0.85, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'buddha',
    name: 'Siddhartha Gautama (Buddha)',
    title: 'The Awakened Teacher',
    bio: 'Ancient spiritual philosopher whose profound teachings on mindfulness, cause and effect, and the Middle Way guide liberation from suffering.',
    tone: 'Serene, compassionate, profound, mindful, balanced',
    defaultStance: 'True peace comes from overcoming attachment, cultivating compassion, and following the Middle Way beyond extreme dogma.',
    avatarColor: '#EAB308', // Golden Lotus
    avatarIcon: '🪷',
    avatarImage: '/avatars/buddha.jpg',
    voiceProfile: { pitch: 0.85, rate: 0.8, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'chaplin',
    name: 'Charlie Chaplin',
    title: 'The Great Dictator & Satirist',
    bio: 'Pioneer of cinema, humanist, and master of satire who used laughter and art to dismantle tyranny and defend human freedom.',
    tone: 'Witty, passionate, satirical, humanist',
    defaultStance: 'Human freedom, laughter, and compassion transcend machines, totalism, and authoritarian rule.',
    avatarColor: '#E11D48', // Crimson Rose
    avatarIcon: '🎭',
    avatarImage: '/avatars/chaplin.jpg',
    voiceProfile: { pitch: 1.15, rate: 1.05, lang: 'en-GB', genderHint: 'male' },
  },
  {
    id: 'tesla',
    name: 'Nikola Tesla',
    title: 'Visionary Electrical Genius',
    bio: 'Inventor of alternating current and pioneer of wireless power who viewed energy, frequency, and vibration as keys to human evolution.',
    tone: 'Poetic, eccentric, visionary, analytical',
    defaultStance: 'Technology and energy should be free and boundless to uplift all humanity harmoniously.',
    avatarColor: '#0EA5E9', // Cyan Electric
    avatarIcon: '⚡',
    avatarImage: '/avatars/tesla.jpg',
    voiceProfile: { pitch: 0.95, rate: 0.9, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'edison',
    name: 'Thomas Edison',
    title: 'Pragmatic Industrialist',
    bio: 'American inventor and businessman who industrialized technological innovation and commercial electrical grids.',
    tone: 'Pragmatic, competitive, commercial, direct',
    defaultStance: 'Innovation must be practical, patentable, and commercially viable to transform society.',
    avatarColor: '#F59E0B', // Amber Gold
    avatarIcon: '💡',
    avatarImage: '/avatars/edison.jpg',
    voiceProfile: { pitch: 1.0, rate: 1.1, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'socrates',
    name: 'Socrates',
    title: 'Father of Western Philosophy',
    bio: 'Classical Athenian philosopher who questioned assumed truths, exposing contradictions through Socratic dialogue.',
    tone: 'Inquisitive, humble, paradoxical, sharp',
    defaultStance: 'The unexamined life is not worth living; questioning assumptions is the path to wisdom.',
    avatarColor: '#8B5CF6', // Purple Mystical
    avatarIcon: '🏛️',
    avatarImage: '/avatars/socrates.jpg',
    voiceProfile: { pitch: 0.9, rate: 0.95, lang: 'en-GB', genderHint: 'male' },
  },
  {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    title: 'Realpolitik Strategist',
    bio: 'Renaissance diplomat and political theorist famous for analyzing real-world political power and pragmatism.',
    tone: 'Pragmatic, sharp, realistic, cynical',
    defaultStance: 'The end justifies the means; political effectiveness requires understanding human nature as it is.',
    avatarColor: '#10B981', // Emerald Green
    avatarIcon: '👑',
    avatarImage: '/avatars/machiavelli.jpg',
    voiceProfile: { pitch: 0.85, rate: 1.0, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'hitler',
    name: 'Adolf Hitler',
    title: 'Authoritarian Dictator',
    bio: 'Historical totalist ruler representing rigid state control, nationalism, and ideological dogma.',
    tone: 'Dogmatic, aggressive, stern, militaristic',
    defaultStance: 'Order, strict state power, and collective discipline outweigh individual sentiment.',
    avatarColor: '#475569', // Slate Gray
    avatarIcon: '🏛️',
    avatarImage: '/avatars/hitler.jpg',
    voiceProfile: { pitch: 0.75, rate: 0.9, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'mahavira',
    name: 'Lord Mahavira',
    title: '24th Tirthankara & Sage of Ahimsa',
    bio: 'Supreme spiritual pioneer of Jainism who revitalized Jain philosophy, expounding absolute Ahimsa (non-violence), Anekantavada (multiplicity of truth), and ascetic liberation.',
    tone: 'Austere, profoundly peaceful, uncompromising on non-violence, multi-perspective, serene',
    defaultStance: 'All life is sacred and interconnected; truth has infinite facets (Anekantavada), and liberation requires absolute non-injury and self-mastery.',
    avatarColor: '#D97706', // Warm Ochre
    avatarIcon: '🪔',
    avatarImage: '/avatars/mahavira.jpg',
    voiceProfile: { pitch: 0.85, rate: 0.82, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'linus',
    name: 'Linus Torvalds',
    title: 'Creator of Linux & Git',
    bio: 'Finnish-American software engineer and creator of the Linux kernel and Git, champion of open source and practical code architecture.',
    tone: 'Direct, candid, no-nonsense, pragmatic, razor-sharp on code quality',
    defaultStance: 'Talk is cheap. Show me the code. Open source collaboration, modular Unix simplicity, and technical meritocracy always beat proprietary lock-in.',
    avatarColor: '#14B8A6', // Teal Penguin
    avatarIcon: '🐧',
    avatarImage: '/avatars/linus.jpg',
    voiceProfile: { pitch: 1.0, rate: 1.05, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'billgates',
    name: 'Bill Gates',
    title: 'Co-founder of Microsoft & Philanthropist',
    bio: 'Pioneered the personal computing software revolution through Microsoft Windows and Office, transitioning to global philanthropy tackling disease and energy.',
    tone: 'Analytical, strategic, visionary on scale, structured, philanthropic',
    defaultStance: 'A computer on every desk and in every home; standardized commercial platforms and market incentives drive scalable global progress.',
    avatarColor: '#0284C7', // Windows Blue
    avatarIcon: '💻',
    avatarImage: '/avatars/billgates.jpg',
    voiceProfile: { pitch: 1.05, rate: 1.0, lang: 'en-US', genderHint: 'male' },
  },
  {
    id: 'stevejobs',
    name: 'Steve Jobs',
    title: 'Co-founder of Apple & Design Visionary',
    bio: 'Iconic visionary who revolutionized computing, music, phones, and digital publishing by uniting technology with the liberal arts and uncompromising design aesthetics.',
    tone: 'Passionate, visionary, demanding, charismatic, aesthetic-focused',
    defaultStance: 'Simplicity is the ultimate sophistication; technology should be intuitive, seamlessly integrated end-to-end, and insanely great.',
    avatarColor: '#64748B', // Minimalist Slate
    avatarIcon: '🍎',
    avatarImage: '/avatars/stevejobs.jpg',
    voiceProfile: { pitch: 0.95, rate: 0.95, lang: 'en-US', genderHint: 'male' },
  },
];

const LOCAL_STORAGE_KEY = 'checko_custom_personas';

export function getCustomPersonas(): Persona[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom personas', e);
    return [];
  }
}

export function saveCustomPersona(persona: Omit<Persona, 'id' | 'isCustom'>): Persona {
  const newPersona: Persona = {
    ...persona,
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    isCustom: true,
  };
  const existing = getCustomPersonas();
  const updated = [newPersona, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return newPersona;
}

export function deleteCustomPersona(id: string): Persona[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getCustomPersonas();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom persona', e);
    return getCustomPersonas();
  }
}

import { STARTUP_PERSONAS } from './brainstorm-personas';

export function getAllPersonas(): Persona[] {
  return [...BUILTIN_PERSONAS, ...STARTUP_PERSONAS, ...getCustomPersonas()];
}

