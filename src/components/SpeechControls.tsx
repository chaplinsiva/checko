'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeechControlsProps {
  isMuted: boolean;
  isSpeaking: boolean;
  toggleMute: () => void;
  stopSpeech?: () => void;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  isMuted,
  isSpeaking,
  toggleMute,
  stopSpeech,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute Debate Voice Synthesis (TTS)' : 'Mute Debate Voice Synthesis (TTS)'}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
          isMuted
            ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
        }`}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Voice Muted</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <span className="hidden sm:inline">
              {isSpeaking ? 'Speaking...' : 'Voice On'}
            </span>
          </>
        )}
      </button>

      {isSpeaking && stopSpeech && (
        <button
          onClick={stopSpeech}
          title="Stop current speech"
          className="text-[10px] uppercase font-bold text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 px-2 py-1.5 rounded-lg transition-colors"
        >
          Stop Audio
        </button>
      )}
    </div>
  );
};
