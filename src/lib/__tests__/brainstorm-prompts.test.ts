import { describe, it, expect } from 'vitest';
import {
  buildBrainstormSystemInstruction,
  extractProsAndConsFromTurns,
} from '../brainstorm-prompts';
import { STARTUP_PERSONAS } from '../brainstorm-personas';
import { SAMPLE_BRAINSTORMS } from '../sample-brainstorms';
import { DebateTurn } from '@/types/debate';

describe('Brainstorm Prompts & Pros/Cons Extraction', () => {
  const priya = STARTUP_PERSONAS.find((p) => p.id === 'priya_analyzer')!;
  const elena = STARTUP_PERSONAS.find((p) => p.id === 'elena_pm')!;
  const devon = STARTUP_PERSONAS.find((p) => p.id === 'devon_tech')!;
  const sampleIdea = SAMPLE_BRAINSTORMS[0]; // DevVoice

  it('should build brainstorm system instruction containing the app pitch and constructive critique directive', () => {
    const sys = buildBrainstormSystemInstruction(
      priya,
      [elena, devon],
      sampleIdea.title,
      sampleIdea.solution,
      sampleIdea.targetAudience,
      'pros_cons'
    );

    expect(sys).toContain(priya.name);
    expect(sys).toContain(sampleIdea.title);
    expect(sys).toMatch(/pros.*cons|trade-off|analyz/i);
    expect(sys).toMatch(/constructive|improv|critique/i);
  });

  it('should include Tamil guidance when language is ta', () => {
    const sysTa = buildBrainstormSystemInstruction(
      elena,
      [priya],
      sampleIdea.title,
      sampleIdea.solution,
      sampleIdea.targetAudience,
      'all_round',
      undefined,
      'ta'
    );

    expect(sysTa).toContain('TAMIL');
    expect(sysTa).toContain('தமிழ்');
  });

  it('should extract structured pros and cons from debate turns', () => {
    const turns: DebateTurn[] = [
      {
        id: 'turn_1',
        speakerId: 'priya_analyzer',
        speakerName: 'Dr. Priya Nair',
        content: 'Pro: Zero screen fatigue for developers. Con: High latency in live speech parsing.',
        timestamp: Date.now() - 3000,
        phase: 'debate',
      },
      {
        id: 'turn_2',
        speakerId: 'devon_tech',
        speakerName: 'Devon Reed',
        content: '[IMPROVEMENT] We should use local quantized models with WebAssembly for instant diff summaries.',
        timestamp: Date.now() - 2000,
        phase: 'debate',
      },
      {
        id: 'turn_3',
        speakerId: 'elena_pm',
        speakerName: 'Elena Vance',
        content: 'Strength: High retention because developers do code reviews daily. Risk: Noise interference in busy office environments.',
        timestamp: Date.now() - 1000,
        phase: 'debate',
      },
    ];

    const matrix = extractProsAndConsFromTurns(turns, sampleIdea);

    expect(matrix.pros.length).toBeGreaterThanOrEqual(2);
    expect(matrix.cons.length).toBeGreaterThanOrEqual(2);
    expect(matrix.improvements.length).toBeGreaterThanOrEqual(1);

    // Initial pros from the sample should be preserved as base
    expect(matrix.pros.some((p) => p.includes('Zero screen fatigue') || p.includes('productivity'))).toBe(true);
    expect(matrix.cons.some((c) => c.includes('High latency') || c.includes('Voice input'))).toBe(true);
    expect(matrix.improvements.some((i) => i.includes('quantized') || i.includes('AST'))).toBe(true);

    expect(matrix.feasibilityScore).toBeGreaterThanOrEqual(1);
    expect(matrix.feasibilityScore).toBeLessThanOrEqual(100);
  });
});
