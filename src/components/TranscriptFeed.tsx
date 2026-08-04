'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DebateTurn, Persona, UserProfile } from '@/types/debate';
import { MinimizedPayload } from '@/lib/token-minimizer';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface TranscriptFeedProps {
  turns: DebateTurn[];
  activePersonas: Persona[];
  userProfile: UserProfile;
  lastPayload: MinimizedPayload | null;
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({
  turns,
  activePersonas,
  userProfile,
  lastPayload,
}) => {
  const [showDebugger, setShowDebugger] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest turn on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns.length]);

  return (
    <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col h-[520px]">
      {/* Transcript Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-400" /> Debate Stream ({turns.length} turns)
        </h3>

        {/* Expandable Memory State Debugger Toggle */}
        <button
          onClick={() => setShowDebugger((prev) => !prev)}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 transition-all"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Token Memory Engine</span>
          {showDebugger ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Memory Debugger Panel */}
      {showDebugger && lastPayload && (
        <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 mb-4 text-xs font-mono text-cyan-300/90 overflow-x-auto">
          <div className="flex items-center justify-between mb-2 text-[11px] text-cyan-400 font-bold border-b border-cyan-900/60 pb-1">
            <span>LOW-TOKEN ENGINE DEBUGGER</span>
            <span>Sliding Window K=2 Active</span>
          </div>
          <div className="mb-2">
            <span className="text-slate-500 block">System Prompt (&lt;100 tokens):</span>
            <pre className="whitespace-pre-wrap text-[10px] bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
              {lastPayload.systemInstruction}
            </pre>
          </div>
          <div>
            <span className="text-slate-500 block">State Summary:</span>
            <pre className="whitespace-pre-wrap text-[10px] bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
              {lastPayload.stateSummaryText}
            </pre>
          </div>
        </div>
      )}

      {/* Transcript Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {turns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <p className="mb-2">Arena ready. Click "Play" or "Steal Mic" to start opening greetings.</p>
          </div>
        ) : (
          <AnimatePresence>
            {turns.map((turn, idx) => {
              const isUser = turn.speakerId === 'user';
              const persona = activePersonas.find((p) => p.id === turn.speakerId);
              const avatarColor = isUser ? '#A855F7' : persona?.avatarColor || '#E11D48';
              const avatarIcon = isUser ? '👤' : persona?.avatarIcon || turn.speakerName.charAt(0);
              const displayName = isUser ? (turn.speakerName || userProfile.name) : turn.speakerName;

              return (
                <motion.div
                  key={turn.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Speaker Avatar */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-md flex-shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {avatarIcon}
                  </div>

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed border ${
                      isUser
                        ? 'bg-purple-950/40 border-purple-500/40 text-purple-100 rounded-tr-none'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Speaker Header */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {displayName}
                        {turn.isUserInterjection && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                            3rd Party Interjection
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        {turn.phase}
                      </span>
                    </div>

                    {/* Turn Content */}
                    <p className="text-slate-200">{turn.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

