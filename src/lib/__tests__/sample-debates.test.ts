import { describe, it, expect } from 'vitest';
import { BUILTIN_PERSONAS, getAllPersonas } from '../personas';
import { SAMPLE_DEBATES, getSampleDebateById, launchSampleDebate } from '../sample-debates';

describe('Builtin Personas - Missing Characters Expansion', () => {
  it('should include Nikola Tesla and Thomas Edison', () => {
    const ids = BUILTIN_PERSONAS.map((p) => p.id);
    expect(ids).toContain('tesla');
    expect(ids).toContain('edison');
  });

  it('should include Siddhartha Gautama (Buddha) and Lord Mahavira', () => {
    const ids = BUILTIN_PERSONAS.map((p) => p.id);
    expect(ids).toContain('buddha');
    expect(ids).toContain('mahavira');

    const mahavira = BUILTIN_PERSONAS.find((p) => p.id === 'mahavira');
    expect(mahavira).toBeDefined();
    expect(mahavira?.name).toMatch(/Mahavira/i);
    expect(mahavira?.defaultStance).toBeDefined();
    expect(mahavira?.voiceProfile).toBeDefined();
    expect(mahavira?.avatarColor).toBeDefined();
  });

  it('should include Linus Torvalds and Bill Gates', () => {
    const ids = BUILTIN_PERSONAS.map((p) => p.id);
    expect(ids).toContain('linus');
    expect(ids).toContain('billgates');

    const linus = BUILTIN_PERSONAS.find((p) => p.id === 'linus');
    expect(linus).toBeDefined();
    expect(linus?.name).toMatch(/Linus Torvalds/i);
    expect(linus?.bio).toMatch(/Linux/i);

    const gates = BUILTIN_PERSONAS.find((p) => p.id === 'billgates');
    expect(gates).toBeDefined();
    expect(gates?.name).toMatch(/Bill Gates/i);
    expect(gates?.bio).toMatch(/Microsoft/i);
  });

  it('should include Steve Jobs for tech ecosystem debates', () => {
    const ids = BUILTIN_PERSONAS.map((p) => p.id);
    expect(ids).toContain('stevejobs');

    const jobs = BUILTIN_PERSONAS.find((p) => p.id === 'stevejobs');
    expect(jobs).toBeDefined();
    expect(jobs?.name).toMatch(/Steve Jobs/i);
  });

  it('all builtin personas should have valid non-empty fields, voice profiles, and Wikipedia avatar images', () => {
    for (const p of BUILTIN_PERSONAS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.bio).toBeTruthy();
      expect(p.tone).toBeTruthy();
      expect(p.defaultStance).toBeTruthy();
      expect(p.avatarColor).toMatch(/^#/);
      expect(p.avatarImage).toMatch(/^(\/avatars\/|https:\/\/)/);
      expect(p.voiceProfile?.pitch).toBeGreaterThan(0);
      expect(p.voiceProfile?.rate).toBeGreaterThan(0);
      expect(p.voiceProfile?.lang).toBeTruthy();
    }
  });
});

describe('Sample Debates Presets', () => {
  it('should contain the AC vs DC sample debate with Tesla and Edison', () => {
    const acVsDc = SAMPLE_DEBATES.find((d) => d.id === 'ac-vs-dc');
    expect(acVsDc).toBeDefined();
    expect(acVsDc?.personaIds).toContain('tesla');
    expect(acVsDc?.personaIds).toContain('edison');
    expect(acVsDc?.title).toMatch(/AC vs DC/i);
  });

  it('should contain the Buddhism vs Jainism sample debate with Buddha and Mahavira', () => {
    const buddhismVsJainism = SAMPLE_DEBATES.find((d) => d.id === 'buddhism-vs-jainism');
    expect(buddhismVsJainism).toBeDefined();
    expect(buddhismVsJainism?.personaIds).toContain('buddha');
    expect(buddhismVsJainism?.personaIds).toContain('mahavira');
    expect(buddhismVsJainism?.motion).toBeDefined();
  });

  it('should contain the Windows vs Linux sample debate with Linus Torvalds and Bill Gates', () => {
    const winVsLinux = SAMPLE_DEBATES.find((d) => d.id === 'windows-vs-linux');
    expect(winVsLinux).toBeDefined();
    expect(winVsLinux?.personaIds).toContain('linus');
    expect(winVsLinux?.personaIds).toContain('billgates');
  });

  it('should contain Apple vs Microsoft and Quantum vs Relativity debates', () => {
    const appleVsMs = SAMPLE_DEBATES.find((d) => d.id === 'apple-vs-microsoft');
    expect(appleVsMs).toBeDefined();
    expect(appleVsMs?.personaIds).toContain('stevejobs');
    expect(appleVsMs?.personaIds).toContain('billgates');

    const relativityVsQuantum = SAMPLE_DEBATES.find((d) => d.id === 'quantum-vs-relativity');
    expect(relativityVsQuantum).toBeDefined();
    expect(relativityVsQuantum?.personaIds).toContain('einstein');
    expect(relativityVsQuantum?.personaIds).toContain('hawking');
  });

  it('should retrieve a sample debate by id', () => {
    const debate = getSampleDebateById('ac-vs-dc');
    expect(debate).toBeDefined();
    expect(debate?.id).toBe('ac-vs-dc');

    const notFound = getSampleDebateById('non-existent');
    expect(notFound).toBeUndefined();
  });

  it('all sample debates must reference existing personas in BUILTIN_PERSONAS', () => {
    const validPersonaIds = new Set(BUILTIN_PERSONAS.map((p) => p.id));
    for (const debate of SAMPLE_DEBATES) {
      expect(debate.personaIds.length).toBeGreaterThanOrEqual(2);
      for (const pId of debate.personaIds) {
        expect(validPersonaIds.has(pId)).toBe(true);
      }
    }
  });

  it('should launch a sample debate correctly converting it to a saved group item', () => {
    const debate = SAMPLE_DEBATES[0];
    const launched = launchSampleDebate(debate);
    expect(launched.groupTitle).toBe(debate.title);
    expect(launched.debateMotion).toBe(debate.motion);
    expect(launched.personaIds).toEqual(debate.personaIds);
    expect(launched.lastMessage).toBeTruthy();
    expect(launched.id).toMatch(/^group_ac-vs-dc_/);
  });
});

