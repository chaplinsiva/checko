'use client';

import React, { useState } from 'react';
import { UserProfile, Persona } from '@/types/debate';
import { Send, X, Sparkles, MessageCircle } from 'lucide-react';

interface UserDockProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  activePersonas: Persona[];
  onSubmitInterjection: (text: string) => void;
}

export const UserDock: React.FC<UserDockProps> = ({
  isOpen,
  onClose,
  userProfile,
  activePersonas,
  onSubmitInterjection,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSubmitInterjection(inputText.trim());
    setInputText('');
    onClose();
  };

  const quickPrompts = [
    `Hi ${activePersonas[0]?.name || 'everyone'}, what is your view if this lived in 2026 today?`,
    `I challenge ${activePersonas[1]?.name || 'the opponent'} on the logical fallacies of their stance!`,
    `How does modern AI and digital technology affect human dignity in your view?`,
    `Can humor and satire genuinely defeat authoritarian control?`,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl shadow-purple-500/20 relative animate-in fade-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Steal Mic — Enter Arena</h3>
              <p className="text-xs text-slate-400">
                Participating as <strong className="text-purple-400">{userProfile.name}</strong>. Personas will address you directly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
            Quick Interjection Ideas:
          </span>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(qp)}
                className="text-left text-xs bg-slate-950/80 hover:bg-slate-800/90 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-800/80 transition-all flex items-center justify-between group"
              >
                <span className="truncate">{qp}</span>
                <Sparkles className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="relative mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Type your argument or question as ${userProfile.name}...`}
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-2xl p-4 text-sm text-white focus:outline-none min-h-[100px] resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Enter</kbd> to interject
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Interject Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
