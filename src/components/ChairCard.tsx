'use client';

import React from 'react';
import { Persona } from '@/types/debate';
import { motion } from 'framer-motion';
import { Mic, UserCheck } from 'lucide-react';

interface ChairCardProps {
  persona: Persona;
  isActiveSpeaker: boolean;
  isGenerating?: boolean;
  timerSeconds: number;
  maxTimerSeconds: number;
  isUserChair?: boolean;
  userName?: string;
  isSpeakingVoice?: boolean;
  onClickChair?: () => void;
}

export const ChairCard: React.FC<ChairCardProps> = ({
  persona,
  isActiveSpeaker,
  isGenerating = false,
  timerSeconds,
  maxTimerSeconds,
  isUserChair = false,
  userName = 'User',
  isSpeakingVoice = false,
  onClickChair,
}) => {
  const strokeDashoffset =
    100 - (timerSeconds / Math.max(1, maxTimerSeconds)) * 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClickChair}
      className={`relative rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden border ${
        isActiveSpeaker
          ? 'bg-slate-900/90 border-rose-500/80 shadow-2xl shadow-rose-500/20 ring-1 ring-rose-500/50'
          : isUserChair
          ? 'bg-slate-900/60 border-purple-500/40 hover:border-purple-500/70 shadow-lg'
          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 shadow-lg'
      }`}
    >
      {/* Active Speaker Ambient Glow */}
      {isActiveSpeaker && (
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: persona.avatarColor || '#F43F5E' }}
        />
      )}

      {/* Header Info */}
      <div className="flex items-center space-x-4 mb-3">
        {/* Avatar Ring with SVG Timer */}
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
          {/* Animated Timer Progress Ring */}
          {isActiveSpeaker && !isGenerating && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800 stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-rose-500 stroke-current transition-all duration-1000 ease-linear"
                strokeDasharray="100, 100"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          )}

          {/* Avatar Icon / Circle */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md transition-all ${
              isActiveSpeaker ? 'scale-105 ring-2 ring-white/40' : ''
            }`}
            style={{
              backgroundColor: isUserChair ? '#A855F7' : persona.avatarColor || '#3B82F6',
            }}
          >
            {isUserChair ? '👤' : persona.avatarIcon || persona.name.charAt(0)}
          </div>
        </div>

        {/* Persona Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white truncate">
              {isUserChair ? userName : persona.name}
            </h3>

            <div className="flex items-center gap-1.5">
              {/* Voice Equalizer Soundwave Indicator */}
              {isSpeakingVoice && (
                <div className="flex items-end space-x-0.5 h-3 px-1">
                  <div className="w-0.5 h-full bg-rose-400 animate-[bounce_1s_infinite_100ms]" />
                  <div className="w-0.5 h-full bg-rose-400 animate-[bounce_1s_infinite_300ms]" />
                  <div className="w-0.5 h-full bg-rose-400 animate-[bounce_1s_infinite_200ms]" />
                </div>
              )}

              {isActiveSpeaker && (
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  <Mic className="w-3 h-3" />
                  {isGenerating ? 'Thinking...' : `${timerSeconds}s`}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 truncate">
            {isUserChair ? '3rd Party Debater / Interjector' : persona.title}
          </p>

          {!isUserChair && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {persona.tone.split(',')[0]}
            </span>
          )}
        </div>
      </div>

      {/* Stance Preview */}
      <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60 text-xs text-slate-300 line-clamp-2">
        <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-0.5">
          Stance / Lens:
        </span>
        {isUserChair
          ? `Participating as ${userName}. Ready to interject or question the speakers.`
          : persona.defaultStance}
      </div>
    </motion.div>
  );
};
