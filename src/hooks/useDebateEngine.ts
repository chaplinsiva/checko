import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Persona,
  DebateTurn,
  DebateStateSummary,
  DebateMode,
  DebatePhase,
  UserProfile,
  TokenStats,
} from '@/types/debate';
import { getAllPersonas } from '@/lib/personas';
import { prepareMinimizedPayload, MinimizedPayload } from '@/lib/token-minimizer';
import { generateDebateTurnResponse } from '@/lib/gemini';
import { useTextToSpeech } from './useTextToSpeech';

export interface DebateEngineOptions {
  initialTopic?: string;
  initialMode?: DebateMode;
  initialPersonaIds?: string[];
  userProfile?: UserProfile;
  turnDelaySeconds?: number;
  allPersonas?: Persona[];
}

export function useDebateEngine(options: DebateEngineOptions = {}) {
  const [topic, setTopicState] = useState<string>(
    options.initialTopic || 'Humor, Freedom & Propaganda in Modern Technology'
  );
  const [mode, setMode] = useState<DebateMode>(options.initialMode || '1v1');
  const [activePersonaIds, setActivePersonaIdsState] = useState<string[]>(
    options.initialPersonaIds || ['chaplin', 'hitler']
  );
  const [userProfile, setUserProfileState] = useState<UserProfile>(
    options.userProfile || { name: 'Alex', role: 'debater' }
  );
  const [selectedModel, setSelectedModelState] = useState<string>('meta-llama/llama-3.2-1b-instruct');

  const tts = useTextToSpeech();

  // Sync topic, userProfile, active personas, and selected model from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTopic = localStorage.getItem('checko_active_topic');
      if (savedTopic && savedTopic.trim().length > 0) {
        setTopicState(savedTopic);
      }

      const savedProfile = localStorage.getItem('checko_user_profile');
      if (savedProfile) {
        setUserProfileState(JSON.parse(savedProfile));
      }

      const savedPersonas = localStorage.getItem('checko_active_personas');
      if (savedPersonas) {
        const parsed = JSON.parse(savedPersonas);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActivePersonaIdsState(parsed);
        }
      }

      const savedModel = localStorage.getItem('checko_selected_model');
      if (savedModel) {
        setSelectedModelState(savedModel);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  const setSelectedModel = (modelId: string) => {
    setSelectedModelState(modelId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('checko_selected_model', modelId);
      } catch (e) {
        console.error('Failed to save selected model to localStorage', e);
      }
    }
  };

  const setTopic = (newTopic: string) => {
    setTopicState(newTopic);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('checko_active_topic', newTopic);
      } catch (e) {
        console.error('Failed to save topic to localStorage', e);
      }
    }
  };

  const setActivePersonaIds = (ids: string[]) => {
    setActivePersonaIdsState(ids);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('checko_active_personas', JSON.stringify(ids));
      } catch (e) {
        console.error('Failed to save active personas to localStorage', e);
      }
    }
  };

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('checko_user_profile', JSON.stringify(profile));
      } catch (e) {
        console.error('Failed to save userProfile to localStorage', e);
      }
    }
  };

  const [turnDelay, setTurnDelay] = useState<number>(options.turnDelaySeconds || 5);

  const [turns, setTurns] = useState<DebateTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true); // Start paused so user can inspect stage
  const [timerSeconds, setTimerSeconds] = useState<number>(5);

  // Sync chat turns from localStorage on topic change or mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const topicKey = `checko_turns_${topic}`;
      const savedTurns = localStorage.getItem(topicKey) || localStorage.getItem('checko_debate_turns');
      if (savedTurns) {
        const parsed = JSON.parse(savedTurns);
        if (Array.isArray(parsed)) {
          setTurns(parsed);
          return;
        }
      }
      setTurns([]);
    } catch (e) {
      console.error('Failed to load turns from localStorage', e);
    }
  }, [topic]);

  // Save chat turns to localStorage on any change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (turns.length > 0) {
        const topicKey = `checko_turns_${topic}`;
        localStorage.setItem(topicKey, JSON.stringify(turns));
        localStorage.setItem('checko_debate_turns', JSON.stringify(turns));
      }
    } catch (e) {
      console.error('Failed to save turns to localStorage', e);
    }
  }, [turns, topic]);

  const [tokenStats, setTokenStats] = useState<TokenStats>({
    totalPromptTokens: 0,
    totalResponseTokens: 0,
    estimatedTokensSaved: 0,
  });

  const [lastPayload, setLastPayload] = useState<MinimizedPayload | null>(null);

  // Active Personas list (including custom personas from local storage)
  const availablePersonas = options.allPersonas && options.allPersonas.length > 0
    ? options.allPersonas
    : getAllPersonas();
  const activePersonas: Persona[] = activePersonaIds
    .map((id) => availablePersonas.find((p) => p.id === id))
    .filter(Boolean) as Persona[];

  // Deterministic Active Speaker calculation (Chaplin -> Hitler -> Chaplin -> Hitler...)
  const personaTurnsCount = turns.filter((t) => t.speakerId !== 'user').length;
  const activeSpeakerIndex =
    activePersonas.length > 0 ? personaTurnsCount % activePersonas.length : 0;
  const currentSpeaker = activePersonas[activeSpeakerIndex];

  // Determine current debate phase based on turn count
  const currentPhase: DebatePhase =
    turns.length < activePersonas.length
      ? 'greeting'
      : turns.length < activePersonas.length * 2
      ? 'stance'
      : 'debate';

  // Construct active state summary
  const stateSummary: DebateStateSummary = {
    topic,
    currentPhase,
    personaStances: activePersonas.reduce((acc, p) => {
      const lastP = [...turns].reverse().find((t) => t.speakerId === p.id);
      acc[p.name] = lastP ? lastP.content.slice(0, 50) + '...' : p.defaultStance;
      return acc;
    }, {} as Record<string, string>),
    latestConflict:
      turns.length > 0 ? turns[turns.length - 1].content.slice(0, 60) : 'Opening arena greetings',
    turnCount: turns.length,
  };

  // Internal turn generator accepting explicit turns list
  const executeTurnForSpeaker = useCallback(
    async (explicitTurns?: DebateTurn[]) => {
      if (isGenerating || activePersonas.length === 0) return;

      const currentTurns = explicitTurns || turns;
      const currentPersonaCount = currentTurns.filter((t) => t.speakerId !== 'user').length;
      const speakerIdx = activePersonas.length > 0 ? currentPersonaCount % activePersonas.length : 0;
      const speaker = activePersonas[speakerIdx];

      if (!speaker) return;

      setIsGenerating(true);

      try {
        const payload = prepareMinimizedPayload(
          speaker,
          activePersonas,
          topic,
          currentTurns,
          stateSummary,
          userProfile
        );

        setLastPayload(payload);

        const responseText = await generateDebateTurnResponse(speaker, payload, userProfile, selectedModel);

        const newTurn: DebateTurn = {
          id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          speakerId: speaker.id,
          speakerName: speaker.name,
          content: responseText,
          timestamp: Date.now(),
          phase: stateSummary.currentPhase,
        };

        setTurns((prev) => [...prev, newTurn]);

        // Auto-trigger Text-To-Speech voice narration for new turn
        tts.speak(responseText, speaker, newTurn.id);

        // Update token stats
        const outputTokens = Math.ceil(responseText.length / 4);
        setTokenStats((prev) => ({
          totalPromptTokens: prev.totalPromptTokens + payload.estimatedPromptTokens,
          totalResponseTokens: prev.totalResponseTokens + outputTokens,
          estimatedTokensSaved: prev.estimatedTokensSaved + payload.estimatedTokensSaved,
        }));
      } catch (err) {
        console.error('Error generating turn:', err);
      } finally {
        setIsGenerating(false);
        setTimerSeconds(turnDelay);
      }
    },
    [isGenerating, activePersonas, turns, topic, stateSummary, userProfile, turnDelay, tts]
  );

  const triggerNextTurn = useCallback(() => {
    executeTurnForSpeaker();
  }, [executeTurnForSpeaker]);

  // Paced 15s timer countdown effect
  useEffect(() => {
    if (isPaused || isGenerating) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isGenerating]);

  // Single side-effect trigger when timer reaches 0
  useEffect(() => {
    if (timerSeconds === 0 && !isPaused && !isGenerating) {
      setTimerSeconds(turnDelay);
      triggerNextTurn();
    }
  }, [timerSeconds, isPaused, isGenerating, triggerNextTurn, turnDelay]);

  // User Interjection Handler ("Steal Mic")
  const submitUserInterjection = (userText: string) => {
    const userTurn: DebateTurn = {
      id: `user_turn_${Date.now()}`,
      speakerId: 'user',
      speakerName: userProfile.name,
      content: userText,
      timestamp: Date.now(),
      phase: currentPhase,
      isUserInterjection: true,
    };

    const newTurnsList = [...turns, userTurn];
    setTurns(newTurnsList);
    setIsPaused(false); // Resume auto debate
    setTimerSeconds(turnDelay);

    // Execute response turn immediately with the updated turns array
    executeTurnForSpeaker(newTurnsList);
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  const resetDebate = () => {
    setTurns([]);
    setIsPaused(true);
    setTimerSeconds(turnDelay);
    tts.stop();
    if (typeof window !== 'undefined') {
      try {
        const topicKey = `checko_turns_${topic}`;
        localStorage.removeItem(topicKey);
        localStorage.removeItem('checko_debate_turns');
      } catch (e) {
        console.error('Failed to clear turns from localStorage', e);
      }
    }
  };

  const playTurnVoice = useCallback(
    (turn: DebateTurn) => {
      const speaker = availablePersonas.find((p) => p.id === turn.speakerId);
      tts.speak(turn.content, speaker, turn.id);
    },
    [availablePersonas, tts]
  );

  return {
    topic,
    setTopic,
    mode,
    setMode,
    activePersonaIds,
    setActivePersonaIds,
    activePersonas,
    userProfile,
    setUserProfile,
    turns,
    currentSpeaker,
    currentSpeakerIndex: activeSpeakerIndex,
    isGenerating,
    isPaused,
    togglePause,
    timerSeconds,
    turnDelay,
    setTurnDelay,
    triggerNextTurn,
    submitUserInterjection,
    resetDebate,
    tokenStats,
    lastPayload,
    tts,
    playTurnVoice,
    selectedModel,
    setSelectedModel,
  };
}
