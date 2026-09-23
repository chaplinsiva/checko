import { describe, it, expect } from 'vitest';
import {
  SAMPLE_BRAINSTORMS,
  getSampleBrainstormById,
  launchSampleBrainstorm,
} from '../sample-brainstorms';
import { getAllBrainstormPersonas } from '../brainstorm-personas';

describe('Sample Brainstorms - Startup & App Presets', () => {
  it('should define a rich set of startup development and app presets', () => {
    expect(SAMPLE_BRAINSTORMS.length).toBeGreaterThanOrEqual(4);

    const ids = SAMPLE_BRAINSTORMS.map((b) => b.id);
    expect(ids).toContain('devvoice');
    expect(ids).toContain('freshloop');
    expect(ids).toContain('taxpilot');
  });

  it('all sample brainstorms should have required fields, valid category, and initial pros/cons', () => {
    const validPersonas = new Set(getAllBrainstormPersonas().map((p) => p.id));

    for (const b of SAMPLE_BRAINSTORMS) {
      expect(b.id).toBeTruthy();
      expect(b.title).toBeTruthy();
      expect(b.tagline).toBeTruthy();
      expect(b.problem).toBeTruthy();
      expect(b.solution).toBeTruthy();
      expect(b.targetAudience).toBeTruthy();
      expect(b.personaIds.length).toBeGreaterThanOrEqual(3);

      for (const pId of b.personaIds) {
        expect(validPersonas.has(pId)).toBe(true);
      }

      expect(b.initialPros && b.initialPros.length).toBeGreaterThanOrEqual(2);
      expect(b.initialCons && b.initialCons.length).toBeGreaterThanOrEqual(2);
      expect(b.initialImprovements && b.initialImprovements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should retrieve a sample brainstorm by id', () => {
    const devvoice = getSampleBrainstormById('devvoice');
    expect(devvoice).toBeDefined();
    expect(devvoice?.title).toMatch(/DevVoice/i);
    expect(devvoice?.category).toBe('startup_dev');

    const nonExistent = getSampleBrainstormById('random_none');
    expect(nonExistent).toBeUndefined();
  });

  it('should launch sample brainstorm into a valid SavedGroupItem with brainstorm metadata', () => {
    const sample = SAMPLE_BRAINSTORMS[0];
    const groupItem = launchSampleBrainstorm(sample);

    expect(groupItem.id).toMatch(new RegExp(`^group_brainstorm_${sample.id}_`));
    expect(groupItem.groupTitle).toContain(sample.title);
    expect(groupItem.debateMotion).toContain(sample.solution);
    expect(groupItem.personaIds).toEqual(sample.personaIds);
    expect(groupItem.lastMessage).toBeTruthy();
    expect(groupItem.createdAt).toBeGreaterThan(0);
  });
});
