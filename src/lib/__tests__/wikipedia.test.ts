import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  searchWikipediaFigures,
  fetchWikipediaPersonaSummary,
  convertWikiSummaryToPersona,
  WikiSummaryResponse,
} from '../wikipedia';

describe('Wikipedia Persona Integration Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('convertWikiSummaryToPersona', () => {
    it('should convert complete Wikipedia summary into a rich Persona object', () => {
      const mockWikiData: WikiSummaryResponse = {
        title: 'Marcus Aurelius',
        description: 'Roman emperor and Stoic philosopher',
        extract:
          'Marcus Aurelius Antoninus was Roman emperor from 161 to 180 and a Stoic philosopher. He was the last of the rulers known as the Five Good Emperors.',
        thumbnail: {
          source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/marcus.jpg',
          width: 300,
          height: 400,
        },
      };

      const persona = convertWikiSummaryToPersona(mockWikiData);

      expect(persona.name).toBe('Marcus Aurelius');
      expect(persona.title).toBe('Roman emperor and Stoic philosopher');
      expect(persona.bio).toContain('Marcus Aurelius Antoninus was Roman emperor');
      expect(persona.avatarImage).toBe('https://upload.wikimedia.org/wikipedia/commons/thumb/marcus.jpg');
      expect(persona.isCustom).toBe(true);
      expect(persona.tone).toBeTruthy();
      expect(persona.defaultStance).toBeTruthy();
      expect(persona.avatarColor).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should handle missing description and thumbnail gracefully with sensible defaults', () => {
      const mockWikiData: WikiSummaryResponse = {
        title: 'Alan Turing',
        extract: 'Alan Mathison Turing was an English mathematician, computer scientist, logician, and cryptanalyst.',
      };

      const persona = convertWikiSummaryToPersona(mockWikiData);

      expect(persona.name).toBe('Alan Turing');
      expect(persona.title).toBe('Historical & Intellectual Figure');
      expect(persona.bio).toContain('Alan Mathison Turing was an English mathematician');
      expect(persona.avatarImage).toBeUndefined();
      expect(persona.avatarIcon).toBe('✨');
      expect(persona.isCustom).toBe(true);
    });

    it('should strip citation footnotes like [1], [2] from the bio extract', () => {
      const mockWikiData: WikiSummaryResponse = {
        title: 'Cleopatra',
        description: 'Queen of the Ptolemaic Kingdom of Egypt',
        extract: 'Cleopatra VII Philopator was queen of the Ptolemaic Kingdom of Egypt[1] from 51 to 30 BC.[2]',
      };

      const persona = convertWikiSummaryToPersona(mockWikiData);

      expect(persona.bio).toBe('Cleopatra VII Philopator was queen of the Ptolemaic Kingdom of Egypt from 51 to 30 BC.');
    });
  });

  describe('fetchWikipediaPersonaSummary', () => {
    it('should fetch and parse Wikipedia page summary for a valid title', async () => {
      const mockResponse = {
        title: 'Ada Lovelace',
        description: 'English mathematician and writer',
        extract: 'Augusta Ada King, Countess of Lovelace was an English mathematician and writer.',
        thumbnail: {
          source: 'https://upload.wikimedia.org/ada.jpg',
          width: 200,
          height: 200,
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchWikipediaPersonaSummary('Ada Lovelace');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://en.wikipedia.org/api/rest_v1/page/summary/Ada_Lovelace'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Api-User-Agent': expect.any(String),
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return null when Wikipedia page is not found (404)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      const result = await fetchWikipediaPersonaSummary('NonExistentPerson12345XYZ');

      expect(result).toBeNull();
    });

    it('should handle network errors gracefully without crashing', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      const result = await fetchWikipediaPersonaSummary('Alan Turing');

      expect(result).toBeNull();
    });
  });

  describe('searchWikipediaFigures', () => {
    it('should search OpenSearch API and return suggestions with titles and snippets', async () => {
      const mockOpenSearch = [
        'Tesla',
        ['Nikola Tesla', 'Tesla (unit)', 'Tesla, Inc.'],
        [
          'Serbian-American engineer and inventor',
          'SI derived unit of magnetic flux density',
          'American multinational automotive company',
        ],
        ['https://en.wikipedia.org/wiki/Nikola_Tesla', '', ''],
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockOpenSearch,
      } as Response);

      const results = await searchWikipediaFigures('Tesla');

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({
        title: 'Nikola Tesla',
        description: 'Serbian-American engineer and inventor',
        url: 'https://en.wikipedia.org/wiki/Nikola_Tesla',
      });
    });

    it('should return empty list if query is empty or API fails', async () => {
      const resultsEmpty = await searchWikipediaFigures('');
      expect(resultsEmpty).toEqual([]);

      global.fetch = vi.fn().mockRejectedValue(new Error('API error'));
      const resultsError = await searchWikipediaFigures('Unknown');
      expect(resultsError).toEqual([]);
    });
  });
});
