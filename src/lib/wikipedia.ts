import { Persona } from '@/types/debate';

export interface WikiThumbnail {
  source: string;
  width: number;
  height: number;
}

export interface WikiSummaryResponse {
  title: string;
  extract?: string;
  description?: string;
  thumbnail?: WikiThumbnail;
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface WikiSearchResult {
  title: string;
  description: string;
  url?: string;
}

const PALETTE = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#6366F1', // Indigo
];

function sanitizeExtract(text: string): string {
  if (!text) return '';
  // Remove reference markers like [1], [2], [citation needed]
  return text.replace(/\[(?:\d+|citation needed)\]/gi, '').trim();
}

function inferToneFromBio(title: string, description: string = '', extract: string = ''): string {
  const combined = (title + ' ' + description + ' ' + extract).toLowerCase();

  if (combined.includes('philosopher') || combined.includes('stoic') || combined.includes('ethics')) {
    return 'Calm, contemplative, rigorous, philosophical';
  }
  if (combined.includes('physicist') || combined.includes('mathematician') || combined.includes('scientist')) {
    return 'Analytical, empirical, visionary, logical';
  }
  if (combined.includes('comedian') || combined.includes('satir') || combined.includes('humor') || combined.includes('actor')) {
    return 'Witty, satirical, expressive, charming';
  }
  if (combined.includes('emperor') || combined.includes('king') || combined.includes('president') || combined.includes('general') || combined.includes('ruler')) {
    return 'Authoritative, strategic, statesmanlike, commanding';
  }
  if (combined.includes('inventor') || combined.includes('engineer') || combined.includes('tech')) {
    return 'Inventive, daring, pragmatic, forward-looking';
  }
  return 'Articulate, impassioned, intellectually sharp';
}

function inferStanceFromBio(name: string, description: string = '', extract: string = ''): string {
  const desc = description || '';
  if (desc) {
    return `Argues firmly through the perspective of a ${desc.toLowerCase()}, emphasizing reason, historical lessons, and first principles.`;
  }
  return `Advocates for deeper inquiry, critical thinking, and truth drawn from historical experience.`;
}

/**
 * Searches Wikipedia using OpenSearch API
 */
export async function searchWikipediaFigures(query: string): Promise<WikiSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&limit=6&search=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url, {
      headers: {
        'Api-User-Agent': 'CheckoArena/1.0 (https://checko.app; contact@checko.app)',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data) || data.length < 3) return [];

    const titles: string[] = Array.isArray(data[1]) ? data[1] : [];
    const descriptions: string[] = Array.isArray(data[2]) ? data[2] : [];
    const urls: string[] = Array.isArray(data[3]) ? data[3] : [];

    return titles.map((title, idx) => ({
      title,
      description: descriptions[idx] || 'Historical or Notable Figure',
      url: urls[idx],
    }));
  } catch (err) {
    console.error('Failed to search Wikipedia:', err);
    return [];
  }
}

/**
 * Fetches the structured summary & thumbnail for a specific Wikipedia page title
 */
export async function fetchWikipediaPersonaSummary(title: string): Promise<WikiSummaryResponse | null> {
  const trimmed = title.trim();
  if (!trimmed) return null;

  try {
    const formattedTitle = trimmed.replace(/\s+/g, '_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedTitle)}`;

    const response = await fetch(url, {
      headers: {
        'Api-User-Agent': 'CheckoArena/1.0 (https://checko.app; contact@checko.app)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as WikiSummaryResponse;
  } catch (err) {
    console.error('Error fetching Wikipedia summary:', err);
    return null;
  }
}

/**
 * Converts a Wikipedia summary response into a full Checko Persona
 */
export function convertWikiSummaryToPersona(wikiData: WikiSummaryResponse): Persona {
  const name = wikiData.title.trim();
  const rawBio = wikiData.extract || '';
  const bio = sanitizeExtract(rawBio) || `${name} is a notable historical and intellectual figure.`;
  const title = wikiData.description ? wikiData.description.trim() : 'Historical & Intellectual Figure';
  
  // Pick deterministic palette color from name string hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % PALETTE.length;
  const avatarColor = PALETTE[colorIndex];

  const personaId = `custom_wiki_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36)}`;

  return {
    id: personaId,
    name,
    title,
    bio,
    tone: inferToneFromBio(name, wikiData.description, rawBio),
    defaultStance: inferStanceFromBio(name, wikiData.description, rawBio),
    avatarColor,
    avatarIcon: '✨',
    avatarImage: wikiData.thumbnail?.source || wikiData.originalimage?.source,
    isCustom: true,
  };
}
