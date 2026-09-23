'use client';

import React, { useState, useMemo } from 'react';
import { DebateTurn } from '@/types/debate';
import { BrainstormIdea, ProsConsMatrix } from '@/types/brainstorm';
import { extractProsAndConsFromTurns } from '@/lib/brainstorm-prompts';
import {
  Lightbulb,
  ThumbsUp,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Plus,
  X,
  TrendingUp,
} from 'lucide-react';

interface ProsConsAnalyzerPanelProps {
  topic: string;
  turns: DebateTurn[];
  initialIdea?: BrainstormIdea;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const ProsConsAnalyzerPanel: React.FC<ProsConsAnalyzerPanelProps> = ({
  topic,
  turns,
  initialIdea,
  isOpen,
  onToggleOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'pros' | 'cons' | 'improvements'>('pros');
  const [copied, setCopied] = useState<boolean>(false);
  const [customItems, setCustomItems] = useState<{
    pros: string[];
    cons: string[];
    improvements: string[];
  }>({
    pros: [],
    cons: [],
    improvements: [],
  });
  const [newItemText, setNewItemText] = useState<string>('');

  // Extract pros & cons live from current chat turns + base idea
  const baseMatrix: ProsConsMatrix = useMemo(() => {
    return extractProsAndConsFromTurns(turns, initialIdea);
  }, [turns, initialIdea]);

  const allPros = useMemo(
    () => [...baseMatrix.pros, ...customItems.pros],
    [baseMatrix.pros, customItems.pros]
  );
  const allCons = useMemo(
    () => [...baseMatrix.cons, ...customItems.cons],
    [baseMatrix.cons, customItems.cons]
  );
  const allImprovements = useMemo(
    () => [...baseMatrix.improvements, ...customItems.improvements],
    [baseMatrix.improvements, customItems.improvements]
  );

  const displayScore = baseMatrix.feasibilityScore ?? 78;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    setCustomItems((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItemText.trim()],
    }));
    setNewItemText('');
  };

  const handleCopySummary = () => {
    const summary = `💡 **Brainstorm Idea Summary: ${topic}**
    
🎯 **Core Pitch**: ${initialIdea?.solution || topic}
👥 **Target Audience**: ${initialIdea?.targetAudience || 'General Users'}
📊 **Feasibility & Moat Index**: ${displayScore}/100

✅ **Key Pros & Strengths**:
${allPros.map((p) => `- ${p}`).join('\n')}

⚠️ **Key Cons, Risks & Vulnerabilities**:
${allCons.map((c) => `- ${c}`).join('\n')}

🚀 **Actionable Improvements**:
${allImprovements.map((i) => `- ${i}`).join('\n')}

_Generated via Checko AI Idea Incubator_`;

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111b21]/95 border-b border-[#222d34] backdrop-blur-md transition-all">
      {/* Top Banner Header Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs truncate">
                {initialIdea?.title || 'Idea Incubator & Pros/Cons Analyzer'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 shrink-0">
                Live Analysis
              </span>
            </div>
            <p className="text-[10px] text-[#8696a0] truncate hidden sm:block">
              {initialIdea?.tagline || 'AI persona panel actively dissecting trade-offs, features, and viability.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Feasibility score badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#202c33] border border-[#2a3942] text-[11px] font-semibold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{displayScore}/100</span>
            <span className="text-[9px] text-[#8696a0] hidden md:inline">Index</span>
          </div>

          <button
            onClick={handleCopySummary}
            className="p-1.5 rounded-lg bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white transition-colors border border-[#2a3942]"
            title="Copy Executive Pitch & Pros/Cons Summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00a884]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleOpen}
            className="px-2.5 py-1 rounded-lg bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white transition-colors border border-[#2a3942] flex items-center gap-1 text-[11px] font-medium"
          >
            <span>{isOpen ? 'Hide Matrix' : 'Show Matrix'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Matrix Content */}
      {isOpen && (
        <div className="px-4 pb-3.5 pt-1 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Tabs */}
          <div className="flex items-center bg-[#202c33] p-1 rounded-xl border border-[#2a3942] text-xs">
            <button
              onClick={() => setActiveTab('pros')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all ${
                activeTab === 'pros'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-[#8696a0] hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pros & Advantages ({allPros.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cons')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all ${
                activeTab === 'cons'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-[#8696a0] hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Cons & Risks ({allCons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('improvements')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all ${
                activeTab === 'improvements'
                  ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-[#8696a0] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Feature Improvements ({allImprovements.length})</span>
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 text-xs">
            {activeTab === 'pros' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {allPros.map((pro, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-2.5 text-emerald-200/90 flex items-start gap-2"
                  >
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <p className="leading-snug text-[11px]">{pro}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cons' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {allCons.map((con, idx) => (
                  <div
                    key={idx}
                    className="bg-rose-950/20 border border-rose-800/30 rounded-xl p-2.5 text-rose-200/90 flex items-start gap-2"
                  >
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <p className="leading-snug text-[11px]">{con}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'improvements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {allImprovements.map((imp, idx) => (
                  <div
                    key={idx}
                    className="bg-sky-950/20 border border-sky-800/30 rounded-xl p-2.5 text-sky-200/90 flex items-start gap-2"
                  >
                    <span className="text-sky-400 font-bold shrink-0">★</span>
                    <p className="leading-snug text-[11px]">{imp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Custom Pro / Con / Improvement */}
          <form onSubmit={handleAddItem} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={`Add a custom ${activeTab === 'pros' ? 'Pro' : activeTab === 'cons' ? 'Risk / Con' : 'Improvement'}...`}
              className="flex-1 bg-[#202c33] border border-[#2a3942] focus:border-[#00a884] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none placeholder-[#8696a0]"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="px-3 py-1.5 bg-[#00a884] hover:bg-teal-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
