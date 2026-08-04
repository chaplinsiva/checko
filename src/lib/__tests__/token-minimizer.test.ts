import { prepareMinimizedPayload, buildSystemInstruction } from '../token-minimizer';
import { Persona, DebateTurn, DebateStateSummary } from '@/types/debate';

describe('TokenMinimizer Engine', () => {
  const chaplin: Persona = {
    id: 'chaplin',
    name: 'Charlie Chaplin',
    title: 'The Great Dictator',
    bio: 'Pioneer of comedy and satire.',
    tone: 'Witty, passionate',
    defaultStance: 'Laughter defeats totalism.',
    avatarColor: '#E11D48',
  };

  const hitler: Persona = {
    id: 'hitler',
    name: 'Adolf Hitler',
    title: 'Authoritarian Dictator',
    bio: 'Historical totalist ruler.',
    tone: 'Dogmatic, stern',
    defaultStance: 'Order outweighs sentiment.',
    avatarColor: '#475569',
  };

  test('buildSystemInstruction generates compact phase-specific prompt with user name', () => {
    const sysPrompt = buildSystemInstruction(chaplin, [hitler], 'Freedom vs Order', { name: 'Alex', role: 'debater' }, 'greeting');
    expect(sysPrompt).toContain('Charlie Chaplin');
    expect(sysPrompt).toContain('"Alex"');
    expect(sysPrompt).toContain('CURRENT DEBATE MOTION / TOPIC: "Freedom vs Order"');
    expect(sysPrompt).toContain('PHASE: Opening Greeting');
  });

  test('prepareMinimizedPayload keeps sliding window K=4 last turns', () => {
    const turns: DebateTurn[] = [
      { id: '1', speakerId: 'chaplin', speakerName: 'Charlie Chaplin', content: 'Greeting 1', timestamp: 1, phase: 'greeting' },
      { id: '2', speakerId: 'hitler', speakerName: 'Adolf Hitler', content: 'Greeting 2', timestamp: 2, phase: 'greeting' },
      { id: '3', speakerId: 'chaplin', speakerName: 'Charlie Chaplin', content: 'Freedom is essential.', timestamp: 3, phase: 'stance' },
      { id: '4', speakerId: 'hitler', speakerName: 'Adolf Hitler', content: 'State order is essential.', timestamp: 4, phase: 'stance' },
      { id: '5', speakerId: 'chaplin', speakerName: 'Charlie Chaplin', content: 'Laughter breaks control.', timestamp: 5, phase: 'debate' },
      { id: '6', speakerId: 'hitler', speakerName: 'Adolf Hitler', content: 'Discipline reigns supreme.', timestamp: 6, phase: 'debate' },
    ];

    const stateSummary: DebateStateSummary = {
      topic: 'Freedom vs Order',
      currentPhase: 'debate',
      personaStances: { 'Charlie Chaplin': 'Freedom', 'Adolf Hitler': 'Order' },
      latestConflict: 'Stance declaration',
      turnCount: 6,
    };

    const payload = prepareMinimizedPayload(chaplin, [chaplin, hitler], 'Freedom vs Order', turns, stateSummary, { name: 'Alex', role: 'debater' });

    // Sliding window should keep last 4 turns
    expect(payload.slidingWindowTurns.length).toBe(4);
    expect(payload.slidingWindowTurns[0].id).toBe('3');
    expect(payload.slidingWindowTurns[3].id).toBe('6');
    expect(payload.estimatedTokensSaved).toBeGreaterThan(0);
  });
});
