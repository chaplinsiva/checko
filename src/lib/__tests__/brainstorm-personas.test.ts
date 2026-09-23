import { describe, it, expect } from 'vitest';
import {
  STARTUP_PERSONAS,
  getBrainstormSquad,
  getAllBrainstormPersonas,
  isBrainstormPersona,
  getBrainstormRoleForPersona,
} from '../brainstorm-personas';

describe('Brainstorm Personas - Startup & Incubation Squad', () => {
  it('should define core startup personas with valid profiles, voice, and default stances', () => {
    expect(STARTUP_PERSONAS.length).toBeGreaterThanOrEqual(5);

    const ids = STARTUP_PERSONAS.map((p) => p.id);
    expect(ids).toContain('elena_pm');
    expect(ids).toContain('devon_tech');
    expect(ids).toContain('marcus_vc');
    expect(ids).toContain('priya_analyzer');
    expect(ids).toContain('kaelen_growth');

    for (const p of STARTUP_PERSONAS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.bio).toBeTruthy();
      expect(p.tone).toBeTruthy();
      expect(p.defaultStance).toBeTruthy();
      expect(p.avatarColor).toMatch(/^#/);
      expect(p.voiceProfile).toBeDefined();
      expect(p.voiceProfile?.pitch).toBeGreaterThan(0);
      expect(p.voiceProfile?.rate).toBeGreaterThan(0);
    }
  });

  it('priya_analyzer should be specialized in objective Pros and Cons analysis', () => {
    const priya = STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer');
    expect(priya).toBeDefined();
    expect(priya?.name).toMatch(/Priya Nair/i);
    expect(priya?.title.toLowerCase()).toMatch(/pros.*cons|analyzer|risk/i);
    expect(priya?.defaultStance.toLowerCase()).toMatch(/trade-off|pros.*cons|vulnerabilit/i);
  });

  it('should identify brainstorm personas accurately', () => {
    expect(isBrainstormPersona('priya_analyzer')).toBe(true);
    expect(isBrainstormPersona('elena_pm')).toBe(true);
    expect(isBrainstormPersona('unknown_random_id')).toBe(false);
  });

  it('should return balanced squad for startup_dev category', () => {
    const squad = getBrainstormSquad('startup_dev');
    expect(squad.length).toBeGreaterThanOrEqual(3);
    const squadIds = squad.map((p) => p.id);
    expect(squadIds).toContain('priya_analyzer');
    expect(squadIds.some((id) => id === 'devon_tech' || id === 'linus')).toBe(true);
    expect(squadIds.some((id) => id === 'elena_pm' || id === 'stevejobs')).toBe(true);
  });

  it('should return balanced squad for ai_deeptech and product_ux categories', () => {
    const aiSquad = getBrainstormSquad('ai_deeptech');
    expect(aiSquad.length).toBeGreaterThanOrEqual(3);
    expect(aiSquad.map((p) => p.id)).toContain('priya_analyzer');

    const uxSquad = getBrainstormSquad('product_ux');
    expect(uxSquad.length).toBeGreaterThanOrEqual(3);
  });

  it('should provide informative role details for brainstorm squad members', () => {
    const priyaRole = getBrainstormRoleForPersona('priya_analyzer');
    expect(priyaRole).toBeDefined();
    expect(priyaRole?.specialtyBadge).toBeDefined();
    expect(priyaRole?.brainstormDuty).toMatch(/pros.*cons|trade-off/i);
  });
});
