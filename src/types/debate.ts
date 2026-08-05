export type DebateMode = '1v1' | '2v2' | 'group';

export type DebatePhase = 'greeting' | 'stance' | 'debate';

export interface PersonaVoiceProfile {
  pitch: number; // 0.5 to 1.5
  rate: number;  // 0.5 to 1.5
  lang?: string; // e.g., 'en-US', 'en-GB'
  genderHint?: 'male' | 'female' | 'neutral';
}

export interface Persona {
  id: string;
  name: string;
  title: string;
  bio: string;
  tone: string;
  defaultStance: string;
  avatarColor: string;
  avatarIcon?: string;
  avatarImage?: string;
  isCustom?: boolean;
  voiceProfile?: PersonaVoiceProfile;
}

export interface DebateTurn {
  id: string;
  speakerId: string; // persona id or 'user'
  speakerName: string;
  content: string;
  timestamp: number;
  phase: DebatePhase;
  targetName?: string;
  isUserInterjection?: boolean;
}

export interface DebateStateSummary {
  topic: string;
  currentPhase: DebatePhase;
  personaStances: Record<string, string>;
  userStance?: string;
  latestConflict: string;
  turnCount: number;
}

export interface UserProfile {
  name: string;
  role: 'moderator' | 'challenger' | 'debater';
}

export interface TokenStats {
  totalPromptTokens: number;
  totalResponseTokens: number;
  estimatedTokensSaved: number;
}
