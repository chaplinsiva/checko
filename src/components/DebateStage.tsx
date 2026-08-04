'use client';

import React from 'react';
import { Persona, DebateMode, UserProfile } from '@/types/debate';
import { ChairCard } from './ChairCard';
import { Play, Pause, SkipForward, RefreshCw, MessageSquarePlus, Compass, Trash2 } from 'lucide-react';

interface DebateStageProps {
  topic: string;
  setTopic: (t: string) => void;
  mode: DebateMode;
  activePersonas: Persona[];
  allPersonas: Persona[];
  onSelectPersonas: (ids: string[]) => void;
  onDeletePersona?: (id: string) => void;
  currentSpeaker: Persona | undefined;
  isGenerating: boolean;
  isPaused: boolean;
  togglePause: () => void;
  timerSeconds: number;
  turnDelay: number;
  triggerNextTurn: () => void;
  resetDebate: () => void;
  userProfile: UserProfile;
  onOpenUserDock: () => void;
}

const SAMPLE_TOPICS = [
  'Humor, Freedom & Propaganda in Modern Technology',
  'Is Artificial Intelligence a Threat to Human Dignity?',
  'The Ethics of Power & Realpolitik in Global Diplomacy',
  'Commercial Grid Capitalism vs Free Energy for All',
];

export const DebateStage: React.FC<DebateStageProps> = ({
  topic,
  setTopic,
  mode,
  activePersonas,
  allPersonas,
  onSelectPersonas,
  onDeletePersona,
  currentSpeaker,
  isGenerating,
  isPaused,
  togglePause,
  timerSeconds,
  turnDelay,
  triggerNextTurn,
  resetDebate,
  userProfile,
  onOpenUserDock,
}) => {
  return (
    <div className="w-full bg-slate-950/60 rounded-3xl border border-slate-800/80 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Topic Header & Selector */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1 mb-1">
            <Compass className="w-3.5 h-3.5" /> Active Debate Motion
          </span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2 text-lg font-bold text-white focus:outline-none transition-all"
          />
        </div>

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap items-center gap-1.5 max-w-md">
          {SAMPLE_TOPICS.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setTopic(t)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700 transition-all truncate max-w-[140px]"
              title={t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Persona Selection Bar */}
      <div className="mb-6 flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800/60">
        <span className="text-xs text-slate-400 font-medium">Select Arena Personas:</span>
        <div className="flex flex-wrap gap-2">
          {allPersonas.map((p) => {
            const isSelected = activePersonas.some((ap) => ap.id === p.id);
            return (
              <div key={p.id} className="relative group inline-flex items-center">
                <button
                  onClick={() => {
                    if (isSelected) {
                      if (activePersonas.length > 1) {
                        onSelectPersonas(activePersonas.filter((ap) => ap.id !== p.id).map((ap) => ap.id));
                      }
                    } else {
                      if (mode === '1v1' && activePersonas.length >= 2) {
                        onSelectPersonas([activePersonas[1].id, p.id]);
                      } else {
                        onSelectPersonas([...activePersonas.map((ap) => ap.id), p.id]);
                      }
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{p.avatarIcon || '🎭'}</span>
                  <span>{p.name}</span>
                  {p.isCustom && (
                    <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1 rounded font-mono">
                      Local
                    </span>
                  )}
                </button>
                {p.isCustom && onDeletePersona && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePersona(p.id);
                    }}
                    title="Delete custom persona from local store"
                    className="ml-1 p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chairs Stage Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-stretch">
        {/* Persona A Chair */}
        {activePersonas[0] && (
          <ChairCard
            persona={activePersonas[0]}
            isActiveSpeaker={currentSpeaker?.id === activePersonas[0].id}
            isGenerating={isGenerating}
            timerSeconds={timerSeconds}
            maxTimerSeconds={turnDelay}
          />
        )}

        {/* User Center 3rd Chair (Interactive Entry) */}
        <ChairCard
          persona={{
            id: 'user_chair',
            name: userProfile.name,
            title: '3rd Party Interjector',
            bio: 'Active user participant steering the debate arguments.',
            tone: 'Direct, logical, inquiring',
            defaultStance: `Participating as ${userProfile.name}. Ready to challenge or ask questions.`,
            avatarColor: '#A855F7',
            avatarIcon: '👤',
          }}
          isActiveSpeaker={false}
          timerSeconds={0}
          maxTimerSeconds={turnDelay}
          isUserChair={true}
          userName={userProfile.name}
          onClickChair={onOpenUserDock}
        />

        {/* Persona B Chair */}
        {activePersonas[1] && (
          <ChairCard
            persona={activePersonas[1]}
            isActiveSpeaker={currentSpeaker?.id === activePersonas[1].id}
            isGenerating={isGenerating}
            timerSeconds={timerSeconds}
            maxTimerSeconds={turnDelay}
          />
        )}
      </div>

      {/* Paced Stage Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/90 rounded-2xl p-4 border border-slate-800 gap-4">
        {/* Active Speaker Status */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-slate-300 font-medium">
            {isGenerating ? (
              <span className="text-rose-400 font-semibold animate-pulse">
                {currentSpeaker?.name} is composing response...
              </span>
            ) : isPaused ? (
              <span className="text-amber-400 font-medium">Stage Paused (Click Play or Steal Mic to interject)</span>
            ) : (
              <span>
                Active Speaker: <strong className="text-white">{currentSpeaker?.name}</strong> (Next turn in {timerSeconds}s)
              </span>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Steal Mic Button */}
          <button
            onClick={onOpenUserDock}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Steal Mic / Interject</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePause}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              isPaused
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isPaused ? 'Resume Auto-Debate' : 'Pause Auto-Debate'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Trigger Immediate Next Turn */}
          <button
            onClick={triggerNextTurn}
            disabled={isGenerating}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs transition-all disabled:opacity-50"
            title="Step Next Turn Immediately"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset Arena */}
          <button
            onClick={resetDebate}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs transition-all"
            title="Reset Arena Transcript"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
