import { Persona, DebateTurn } from './debate';

export type BrainstormCategory =
  | 'startup_dev'
  | 'ai_deeptech'
  | 'product_ux'
  | 'growth_marketing'
  | 'social_impact';

export type BrainstormFocus =
  | 'all_round'
  | 'pros_cons'
  | 'features_improvement'
  | 'stress_test';

export interface BrainstormIdea {
  id: string;
  title: string;
  category: BrainstormCategory;
  tagline: string;
  problem: string;
  solution: string;
  targetAudience: string;
  personaIds: string[];
  focus: BrainstormFocus;
  badge?: string;
  accentColor?: string;
  initialPros?: string[];
  initialCons?: string[];
  initialImprovements?: string[];
}

export interface ProsConsMatrix {
  pros: string[];
  cons: string[];
  improvements: string[];
  feasibilityScore?: number;
}

export interface BrainstormSquadRole {
  persona: Persona;
  roleTitle: string;
  specialtyBadge: string;
  brainstormDuty: string;
}
