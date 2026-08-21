'use client';

import React, { useState, useMemo } from 'react';
import { Persona } from '@/types/debate';
import { X, Sparkles, Users, Compass, Check } from 'lucide-react';

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPersonas: Persona[];
  onCreateGroup: (topic: string, personaIds: string[], autoGroupName: string) => void;
  onOpenCharacterModal?: () => void;
}

const SAMPLE_MOTIONS = [
  'Is backward time travel & the grandfather paradox possible?',
  'Is Artificial Intelligence a Threat to Human Dignity?',
  'Humor, Freedom & Propaganda in Modern Technology',
  'Commercial Grid Capitalism vs Free Energy for All',
  'The Ethics of Power & Realpolitik in Global Diplomacy',
];

export function generateCreativeGroupName(topic: string, selectedPersonas: Persona[]): string {
  const lowerTopic = topic.toLowerCase();
  const names = selectedPersonas.map((p) => p.name.split(' ')[0] || p.name);

  // Time Travel / Grandfather Paradox Topics
  if (
    lowerTopic.includes('time travel') ||
    lowerTopic.includes('grandfather') ||
    lowerTopic.includes('paradox') ||
    lowerTopic.includes('relativity') ||
    lowerTopic.includes('wormhole')
  ) {
    if (names.includes('Albert') && names.includes('Stephen')) {
      return 'Coffee with Einstein & Stephen';
    }
    if (names.includes('Albert')) {
      return 'Coffee with Einstein & Time Travellers';
    }
    return 'The Quantum Time Travellers Salon';
  }

  // Humor / Satire / Dictatorship Topics
  if (
    lowerTopic.includes('humor') ||
    lowerTopic.includes('freedom') ||
    lowerTopic.includes('propaganda') ||
    lowerTopic.includes('satire') ||
    lowerTopic.includes('totalitarian')
  ) {
    if (names.includes('Charlie') && names.includes('Adolf')) {
      return 'The Great Dictator & Satirist Circle';
    }
    if (names.includes('Charlie')) {
      return 'Coffee with Chaplin & Free Thinkers';
    }
    return 'Freedom, Satire & Power Roundtable';
  }

  // Energy / Tech / Electricity Topics
  if (
    lowerTopic.includes('energy') ||
    lowerTopic.includes('grid') ||
    lowerTopic.includes('electricity') ||
    lowerTopic.includes('capitalism')
  ) {
    if (names.includes('Nikola') && names.includes('Thomas')) {
      return 'AC vs DC: Voltage & Power Vault';
    }
    if (names.includes('Nikola')) {
      return 'Coffee with Tesla & Electrical Visionaries';
    }
    return 'Energy & Commercial Innovation Hub';
  }

  // Philosophy / Ethics / Politics
  if (
    lowerTopic.includes('ethics') ||
    lowerTopic.includes('power') ||
    lowerTopic.includes('realpolitik') ||
    lowerTopic.includes('diplomacy') ||
    lowerTopic.includes('socrates')
  ) {
    if (names.includes('Niccolò') && names.includes('Socrates')) {
      return 'Philosophers & Realpolitik Strategists';
    }
    return 'Ethics, Power & Wisdom Council';
  }

  // General Fallback based on selected character names
  if (selectedPersonas.length >= 2) {
    const firstName = selectedPersonas[0]?.name.split(' ')[0] || 'Thinker';
    const secondName = selectedPersonas[1]?.name.split(' ')[0] || 'Visionary';
    return `Coffee with ${firstName} & ${secondName}`;
  }

  return `The Arena Debate Salon`;
}

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  isOpen,
  onClose,
  allPersonas,
  onCreateGroup,
  onOpenCharacterModal,
}) => {
  const [topic, setTopic] = useState('Is backward time travel & the grandfather paradox possible?');
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([
    'einstein',
    'hawking',
    'buddha',
    'chaplin',
  ]);

  const selectedPersonas = useMemo(() => {
    return selectedPersonaIds
      .map((id) => allPersonas.find((p) => p.id === id))
      .filter(Boolean) as Persona[];
  }, [selectedPersonaIds, allPersonas]);

  const autoGroupName = useMemo(() => {
    return generateCreativeGroupName(topic, selectedPersonas);
  }, [topic, selectedPersonas]);

  if (!isOpen) return null;

  const togglePersona = (id: string) => {
    if (selectedPersonaIds.includes(id)) {
      if (selectedPersonaIds.length > 2) {
        setSelectedPersonaIds(selectedPersonaIds.filter((pid) => pid !== id));
      }
    } else {
      setSelectedPersonaIds([...selectedPersonaIds, id]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || selectedPersonaIds.length < 2) return;
    onCreateGroup(topic.trim(), selectedPersonaIds, autoGroupName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111b21] border border-[#222d34] rounded-3xl p-6 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222d34] pb-4 mb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00a884]/20 border border-[#00a884]/40 flex items-center justify-center text-[#00a884]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Create New AI Persona Group
              </h2>
              <p className="text-xs text-[#8696a0]">
                Set the debate motion topic and select characters to join.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8696a0] hover:text-white bg-[#202c33] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Section 1: Topic Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#8696a0] mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#00a884]" /> Debate Motion / Topic:
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Is backward time travel & the grandfather paradox possible?"
              rows={2}
              className="w-full bg-[#202c33] border border-[#222d34] focus:border-[#00a884] rounded-2xl p-3.5 text-sm text-white focus:outline-none resize-none font-medium"
              required
            />

            {/* Topic Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SAMPLE_MOTIONS.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(m)}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-[#d1d7db] hover:text-white border border-[#222d34] transition-colors truncate max-w-[260px]"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Character Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase text-[#8696a0] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" /> Select Characters ({selectedPersonaIds.length} chosen):
              </label>
              {onOpenCharacterModal && (
                <button
                  type="button"
                  onClick={onOpenCharacterModal}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] font-semibold border border-[#00a884]/40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>+ Add Character</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {allPersonas.map((p) => {
                const isSelected = selectedPersonaIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePersona(p.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                      isSelected
                        ? 'bg-[#00a884]/15 border-[#00a884]/60 shadow-md ring-1 ring-[#00a884]/40'
                        : 'bg-[#202c33] border-[#222d34] hover:bg-[#2a3942]'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 shadow overflow-hidden"
                      style={{ backgroundColor: p.avatarColor || '#00a884' }}
                    >
                      {p.avatarImage ? (
                        <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        p.avatarIcon || '🎭'
                      )}
                    </div>

                    {/* Character Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8696a0] truncate">{p.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: AI Creative Group Name Preview Box */}
          <div className="bg-[#202c33] p-3.5 rounded-2xl border border-[#00a884]/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#00a884] block mb-0.5">
                🤖 Auto-Decided Group Title:
              </span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>☕</span>
                <span>"{autoGroupName}"</span>
              </h3>
            </div>
            <span className="text-[9px] bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 px-2 py-1 rounded-full font-bold">
              Auto Named
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-2 border-t border-[#222d34] flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-[#8696a0] hover:text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!topic.trim() || selectedPersonaIds.length < 2}
              className="px-6 py-2.5 bg-gradient-to-r from-[#00a884] to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#00a884]/20 disabled:opacity-40 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Group & Start Arena 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
