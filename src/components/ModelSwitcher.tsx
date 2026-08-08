'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_MODELS, AIModelOption } from '@/lib/gemini';
import { Cpu, ChevronDown, Check, Sparkles, Zap } from 'lucide-react';

interface ModelSwitcherProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  compact?: boolean;
}

export const ModelSwitcher: React.FC<ModelSwitcherProps> = ({
  selectedModel,
  onSelectModel,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center space-x-2 rounded-xl transition-all border shadow-sm ${
          compact
            ? 'bg-[#202c33] hover:bg-[#2a3942] border-[#222d34] px-2.5 py-1.5 text-xs text-[#e9edef]'
            : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-purple-500/50 px-3 py-1.5 text-xs text-white'
        }`}
        title="Switch Debate AI Engine / Model"
      >
        <div className="flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#00a884] shrink-0" />
          <span className="font-semibold truncate max-w-[130px] sm:max-w-[170px]">
            {activeOption.name}
          </span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 font-bold shrink-0 hidden sm:inline">
          {activeOption.badge}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8696a0] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#111b21] border border-[#222d34] rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-[#222d34] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8696a0] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00a884]" /> Select Model Engine
            </span>
            <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-mono">
              OpenRouter + Gemini
            </span>
          </div>

          <div className="mt-1 max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === activeOption.id;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#00a884]/20 border border-[#00a884]/50 text-white font-bold'
                      : 'hover:bg-[#202c33] text-[#d1d7db] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold truncate">{model.name}</span>
                    </div>
                    <span className="text-[10px] text-[#8696a0] block truncate">
                      Provider: <strong className="text-slate-300">{model.provider}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full border font-mono font-semibold ${
                        model.isFree
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                          : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                      }`}
                    >
                      {model.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#00a884]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
