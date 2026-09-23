'use client';

import React, { useState } from 'react';
import { Persona } from '@/types/debate';
import { BrainstormCategory, BrainstormFocus, BrainstormIdea } from '@/types/brainstorm';
import { SAMPLE_BRAINSTORMS } from '@/lib/sample-brainstorms';
import { getBrainstormSquad, getBrainstormRoleForPersona } from '@/lib/brainstorm-personas';
import {
  Lightbulb,
  X,
  Sparkles,
  Rocket,
  Layers,
  Users,
  Target,
  Check,
  ChevronRight,
  ShieldAlert,
  Flame,
  Bot,
} from 'lucide-react';

interface BrainstormModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPersonas: Persona[];
  onLaunchBrainstorm: (idea: BrainstormIdea) => void;
  onOpenCharacterModal?: () => void;
}

export const BrainstormModal: React.FC<BrainstormModalProps> = ({
  isOpen,
  onClose,
  allPersonas,
  onLaunchBrainstorm,
  onOpenCharacterModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<BrainstormCategory>('startup_dev');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('devvoice');

  // Custom Form Fields
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customTagline, setCustomTagline] = useState<string>('');
  const [customProblem, setCustomProblem] = useState<string>('');
  const [customSolution, setCustomSolution] = useState<string>('');
  const [customAudience, setCustomAudience] = useState<string>('');
  const [focus, setFocus] = useState<BrainstormFocus>('all_round');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Selected Personas
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([
    'elena_pm',
    'devon_tech',
    'priya_analyzer',
    'marcus_vc',
  ]);

  if (!isOpen) return null;

  const categories: { id: BrainstormCategory; label: string; icon: string }[] = [
    { id: 'startup_dev', label: 'Startup Development', icon: '🚀' },
    { id: 'ai_deeptech', label: 'AI & DeepTech', icon: '⚡' },
    { id: 'product_ux', label: 'Product & UX', icon: '🎨' },
    { id: 'growth_marketing', label: 'Growth & Business', icon: '💰' },
    { id: 'social_impact', label: 'Social Impact', icon: '🌱' },
  ];

  const presetsForCategory = SAMPLE_BRAINSTORMS.filter((b) => b.category === activeCategory);

  const handleSelectPreset = (preset: BrainstormIdea) => {
    setSelectedPresetId(preset.id);
    setIsCustomMode(false);
    setCustomTitle(preset.title);
    setCustomTagline(preset.tagline);
    setCustomProblem(preset.problem);
    setCustomSolution(preset.solution);
    setCustomAudience(preset.targetAudience);
    setFocus(preset.focus);
    setSelectedPersonaIds(preset.personaIds);
  };

  const handleCategoryChange = (cat: BrainstormCategory) => {
    setActiveCategory(cat);
    const suggestedSquad = getBrainstormSquad(cat).map((p) => p.id);
    setSelectedPersonaIds(suggestedSquad);

    const firstPreset = SAMPLE_BRAINSTORMS.find((b) => b.category === cat);
    if (firstPreset) {
      handleSelectPreset(firstPreset);
    } else {
      setIsCustomMode(true);
    }
  };

  const togglePersonaSelection = (id: string) => {
    setSelectedPersonaIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // At least 2 personas
        return prev.filter((p) => p !== id);
      } else {
        if (prev.length >= 6) return prev; // Max 6 personas
        return [...prev, id];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentPreset = SAMPLE_BRAINSTORMS.find((b) => b.id === selectedPresetId);

    const finalIdea: BrainstormIdea = {
      id: isCustomMode ? `custom_idea_${Date.now()}` : (currentPreset?.id || `idea_${Date.now()}`),
      title: isCustomMode ? customTitle || 'My Innovative App Idea' : (currentPreset?.title || 'Startup Brainstorm'),
      category: activeCategory,
      tagline: isCustomMode ? customTagline || 'Solving real user friction' : (currentPreset?.tagline || ''),
      problem: isCustomMode ? customProblem || 'Users face high friction in daily workflow' : (currentPreset?.problem || ''),
      solution: isCustomMode ? customSolution || customTitle : (currentPreset?.solution || ''),
      targetAudience: isCustomMode ? customAudience || 'Target customers' : (currentPreset?.targetAudience || 'General'),
      personaIds: selectedPersonaIds,
      focus,
      initialPros: currentPreset?.initialPros || ['High value proposition', 'Strong target market demand'],
      initialCons: currentPreset?.initialCons || ['Initial customer acquisition', 'Technical scalability'],
      initialImprovements: currentPreset?.initialImprovements || ['Define minimum viable feature set'],
    };

    onLaunchBrainstorm(finalIdea);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#111b21] border border-[#222d34] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#222d34] flex items-center justify-between shrink-0 bg-[#182229]/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Brainstorming Idea Arena
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  New Feature
                </span>
              </h2>
              <p className="text-[11px] text-[#8696a0]">
                Assemble an AI incubation squad to critique, improve & analyze pros & cons
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8696a0] hover:text-white bg-[#202c33] hover:bg-[#2a3942] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* 1. Category Selection Tabs */}
          <div>
            <label className="text-[11px] font-bold text-[#8696a0] uppercase tracking-wider block mb-2">
              1. Choose Domain / Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-2.5 rounded-2xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00a884]/20 border-[#00a884] text-white shadow-md shadow-[#00a884]/10 font-bold'
                        : 'bg-[#202c33]/70 border-[#2a3942] text-[#8696a0] hover:text-white hover:bg-[#202c33]'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Choose Mode: Ready-to-Test Preset vs Custom Idea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-[#8696a0] uppercase tracking-wider">
                2. Select Idea or Create Custom
              </label>
              <div className="flex items-center space-x-1 bg-[#202c33] p-0.5 rounded-xl border border-[#2a3942]">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    !isCustomMode ? 'bg-[#00a884] text-white shadow-sm' : 'text-[#8696a0] hover:text-white'
                  }`}
                >
                  Presets ({presetsForCategory.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    isCustomMode ? 'bg-[#00a884] text-white shadow-sm' : 'text-[#8696a0] hover:text-white'
                  }`}
                >
                  Custom Pitch
                </button>
              </div>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2">
                {presetsForCategory.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#202c33] border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-[#182229]/60 border-[#222d34] hover:border-[#2a3942]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>💡</span> {preset.title}
                        </span>
                        {preset.badge && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {preset.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8696a0] leading-snug line-clamp-2">
                        {preset.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5 bg-[#182229]/60 p-3.5 rounded-2xl border border-[#222d34]">
                <div>
                  <label className="text-[10px] font-semibold text-[#8696a0] block mb-1">
                    App / Startup Name:
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. PetPulse: AI Veterinary On-Demand"
                    className="w-full bg-[#111b21] border border-[#222d34] focus:border-[#00a884] rounded-xl px-3 py-2 text-white focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[#8696a0] block mb-1">
                    One-line Tagline / Value Prop:
                  </label>
                  <input
                    type="text"
                    value={customTagline}
                    onChange={(e) => setCustomTagline(e.target.value)}
                    placeholder="e.g. Real-time optical triage for pet skin and symptom checks"
                    className="w-full bg-[#111b21] border border-[#222d34] focus:border-[#00a884] rounded-xl px-3 py-2 text-white focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-[#8696a0] block mb-1">
                      Problem Solved:
                    </label>
                    <textarea
                      value={customProblem}
                      onChange={(e) => setCustomProblem(e.target.value)}
                      placeholder="What severe friction exists today?"
                      rows={2}
                      className="w-full bg-[#111b21] border border-[#222d34] focus:border-[#00a884] rounded-xl px-3 py-1.5 text-white focus:outline-none text-xs resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#8696a0] block mb-1">
                      Target Audience:
                    </label>
                    <textarea
                      value={customAudience}
                      onChange={(e) => setCustomAudience(e.target.value)}
                      placeholder="Who are the high-retention ideal users?"
                      rows={2}
                      className="w-full bg-[#111b21] border border-[#222d34] focus:border-[#00a884] rounded-xl px-3 py-1.5 text-white focus:outline-none text-xs resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Brainstorm Focus */}
          <div>
            <label className="text-[11px] font-bold text-[#8696a0] uppercase tracking-wider block mb-2">
              3. Brainstorm Focus & Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'all_round', label: 'All-Round Incubation', icon: '🌟' },
                { id: 'pros_cons', label: 'Pros & Cons Analysis', icon: '⚖️' },
                { id: 'features_improvement', label: 'Feature Expansion', icon: '🛠️' },
                { id: 'stress_test', label: 'Brutal Stress-Test', icon: '🔥' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFocus(m.id as BrainstormFocus)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    focus === m.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                      : 'bg-[#202c33] border-[#2a3942] text-[#8696a0] hover:text-white'
                  }`}
                >
                  <div className="text-sm mb-0.5">{m.icon}</div>
                  <div className="text-[10px] font-medium leading-tight">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Incubator Squad Personas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-[#8696a0] uppercase tracking-wider">
                4. Brainstorm Incubator Squad ({selectedPersonaIds.length} members)
              </label>
              {onOpenCharacterModal && (
                <button
                  type="button"
                  onClick={onOpenCharacterModal}
                  className="text-[10px] text-[#00a884] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Bot className="w-3 h-3" /> Add Character
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {allPersonas.map((p) => {
                const isSelected = selectedPersonaIds.includes(p.id);
                const roleMeta = getBrainstormRoleForPersona(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => togglePersonaSelection(p.id)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-2.5 ${
                      isSelected
                        ? 'bg-[#202c33] border-[#00a884] shadow-sm'
                        : 'bg-[#182229]/40 border-[#222d34] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.avatarImage ? (
                        <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        p.avatarIcon || '👤'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#00a884] shrink-0" />}
                      </div>
                      <span className="text-[9px] text-amber-300/90 font-medium truncate block">
                        {roleMeta?.specialtyBadge || p.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-[#222d34] bg-[#182229]/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#00a884] hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-[#00a884]/20 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Launch Brainstorm Room 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
