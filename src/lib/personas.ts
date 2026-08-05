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
    avatarImage: '/albert.jpg',
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
    avatarImage: '/stephen.jpg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg/440px-Buddha_in_Sarnath_Museum_%28Dhammajak_Mutra%29.jpg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Charlie_Chaplin.jpg/440px-Charlie_Chaplin.jpg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/440px-Tesla_circa_1890.jpeg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Thomas_Edison2.jpg/440px-Thomas_Edison2.jpg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Socrates_Louvre.jpg/440px-Socrates_Louvre.jpg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Santi_di_Tito_-_Niccol%C3%B2_Machiavelli_-_Google_Art_Project.jpg/440px-Santi_di_Tito_-_Niccol%C3%B2_Machiavelli_-_Google_Art_Project.jpg',
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
    avatarImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/440px-Hitler_portrait_crop.jpg',
    voiceProfile: { pitch: 0.75, rate: 0.9, lang: 'en-US', genderHint: 'male' },
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

export function getAllPersonas(): Persona[] {
  return [...BUILTIN_PERSONAS, ...getCustomPersonas()];
}

