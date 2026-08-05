'use client';

import React, { useState } from 'react';
import { DebateMode, TokenStats, UserProfile } from '@/types/debate';
import { getStoredApiKey } from '@/lib/gemini';
import { Key, Sparkles, User, Settings, Zap } from 'lucide-react';
import { SpeechControls } from './SpeechControls';

interface HeaderProps {
  mode: DebateMode;
  setMode: (mode: DebateMode) => void;
  tokenStats: TokenStats;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  onOpenCharacterModal: () => void;
  isMuted?: boolean;
  isSpeaking?: boolean;
  toggleMute?: () => void;
  stopSpeech?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  tokenStats,
  userProfile,
  setUserProfile,
  onOpenCharacterModal,
  isMuted,
  isSpeaking,
  toggleMute,
  stopSpeech,
}) => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userNameInput, setUserNameInput] = useState(userProfile.name);

  const handleSaveUser = () => {
    setUserProfile({ ...userProfile, name: userNameInput });
    setShowUserModal(false);
  };

  const savedPercentage =
    tokenStats.totalPromptTokens > 0
      ? Math.round(
          (tokenStats.estimatedTokensSaved /
            (tokenStats.totalPromptTokens + tokenStats.estimatedTokensSaved)) *
            100
        )
      : 74; // Default baseline showcase metric

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Checko <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold ml-1">Gemini 3.5</span>
            </h1>
            <p className="text-xs text-slate-400">AI Persona Debate & 3rd-Party Interactive Arena</p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {(['1v1', '2v2', 'group'] as DebateMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                mode === m
                  ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {m === '1v1' ? '1v1 Match' : m === '2v2' ? '2v2 Team' : 'Group Discussion'}
            </button>
          ))}
        </div>

        {/* Controls & Token Counter */}
        <div className="flex items-center space-x-3">
          {/* TTS Audio Controls */}
          {toggleMute && (
            <SpeechControls
              isMuted={Boolean(isMuted)}
              isSpeaking={Boolean(isSpeaking)}
              toggleMute={toggleMute}
              stopSpeech={stopSpeech}
            />
          )}

          {/* Live Token Savings Meter */}
          <div className="hidden md:flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-400">
            <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
            <div>
              <span className="font-bold text-white">{tokenStats.estimatedTokensSaved}</span> tokens saved ({savedPercentage}%)
            </div>
          </div>

          {/* Add Character Button */}
          <button
            onClick={onOpenCharacterModal}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700/60 transition-all"
          >
            + New Persona
          </button>

          {/* User Profile Settings Button */}
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700/60 transition-all"
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span>{userProfile.name}</span>
          </button>

          {/* Gemini API Key Button */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700/60 transition-all"
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" /> Gemini API Configuration
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              The Gemini API key is loaded exclusively from environment variables (<code className="text-rose-400 bg-slate-950 px-1 py-0.5 rounded">NEXT_PUBLIC_GEMINI_API_KEY</code> in <code className="text-rose-400 bg-slate-950 px-1 py-0.5 rounded">.env</code>). Keys are never stored in browser local storage.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Environment Status:</span>
                {getStoredApiKey() ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Key Detected (.env)
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> Key Missing
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Settings Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" /> Participant Profile
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Set your display name. AI personas will explicitly address you by this name during debates.
            </p>
            <input
              type="text"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/20"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
