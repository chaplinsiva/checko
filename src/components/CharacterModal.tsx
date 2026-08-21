'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Persona } from '@/types/debate';
import { saveCustomPersona } from '@/lib/personas';
import {
  searchWikipediaFigures,
  fetchWikipediaPersonaSummary,
  convertWikiSummaryToPersona,
  WikiSearchResult,
} from '@/lib/wikipedia';
import {
  UserPlus,
  X,
  Sparkles,
  Search,
  Loader2,
  Globe,
  Check,
  RefreshCw,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonaCreated: (newPersona: Persona) => void;
}

const PRESET_WIKI_SUGGESTIONS = [
  'Alan Turing',
  'Marie Curie',
  'Marcus Aurelius',
  'Leonardo da Vinci',
  'Cleopatra',
  'Friedrich Nietzsche',
];

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  onPersonaCreated,
}) => {
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiSuggestions, setWikiSuggestions] = useState<WikiSearchResult[]>([]);
  const [isSearchingWiki, setIsSearchingWiki] = useState(false);
  const [isFetchingWikiSummary, setIsFetchingWikiSummary] = useState(false);
  const [wikiFetchError, setWikiFetchError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Persona Fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [tone, setTone] = useState('');
  const [defaultStance, setDefaultStance] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  const [avatarImage, setAvatarImage] = useState<string | undefined>(undefined);
  const [avatarIcon, setAvatarIcon] = useState('✨');

  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search on wiki query change
  useEffect(() => {
    if (!wikiQuery.trim() || wikiQuery.length < 2) {
      setWikiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingWiki(true);
      try {
        const results = await searchWikipediaFigures(wikiQuery);
        setWikiSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to search Wikipedia:', err);
      } finally {
        setIsSearchingWiki(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [wikiQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSelectWikiFigure = async (targetTitle: string) => {
    setIsFetchingWikiSummary(true);
    setWikiFetchError(null);
    setShowSuggestions(false);
    setWikiQuery(targetTitle);

    try {
      const summary = await fetchWikipediaPersonaSummary(targetTitle);
      if (!summary) {
        setWikiFetchError(`Could not find Wikipedia entry for "${targetTitle}".`);
        return;
      }

      const generated = convertWikiSummaryToPersona(summary);
      setName(generated.name);
      setTitle(generated.title);
      setBio(generated.bio);
      setTone(generated.tone);
      setDefaultStance(generated.defaultStance);
      setAvatarColor(generated.avatarColor);
      setAvatarImage(generated.avatarImage);
      setAvatarIcon(generated.avatarIcon || '✨');
    } catch (err) {
      console.error('Error auto-populating from Wikipedia:', err);
      setWikiFetchError('Failed to fetch Wikipedia data. Check your connection.');
    } finally {
      setIsFetchingWikiSummary(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bio.trim()) return;

    const created = saveCustomPersona({
      name: name.trim(),
      title: title.trim() || 'Custom Debater',
      bio: bio.trim(),
      tone: tone.trim() || 'Thoughtful, articulate',
      defaultStance: defaultStance.trim() || 'Analyzes truth from a unique historical lens.',
      avatarColor,
      avatarIcon: avatarIcon || '✨',
      avatarImage,
    });

    onPersonaCreated(created);
    onClose();
  };

  const handleResetForm = () => {
    setName('');
    setTitle('');
    setBio('');
    setTone('');
    setDefaultStance('');
    setAvatarColor('#3B82F6');
    setAvatarImage(undefined);
    setAvatarIcon('✨');
    setWikiQuery('');
    setWikiFetchError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111b21] border border-[#222d34] rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222d34] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Create Custom Character
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30 font-semibold">
                  Wikipedia Powered
                </span>
              </h3>
              <p className="text-[11px] text-[#8696a0]">Import from Wikipedia or customize manually</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8696a0] hover:text-white bg-[#202c33] hover:bg-[#2a3942] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
          {/* Wikipedia Auto-Import Section */}
          <div className="p-3.5 rounded-2xl bg-[#182229] border border-[#00a884]/30 relative" ref={suggestionsRef}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00a884] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Auto-Fill from Wikipedia</span>
              </span>
              {name && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-[10px] text-[#8696a0] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Clear Form
                </button>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#8696a0] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={wikiQuery}
                    onChange={(e) => setWikiQuery(e.target.value)}
                    onFocus={() => {
                      if (wikiSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search any historical, scientific, or cultural figure..."
                    className="w-full bg-[#111b21] border border-[#2a3942] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all"
                  />
                  {isSearchingWiki && (
                    <Loader2 className="w-3.5 h-3.5 text-[#00a884] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                <button
                  type="button"
                  disabled={!wikiQuery.trim() || isFetchingWikiSummary}
                  onClick={() => handleSelectWikiFigure(wikiQuery.trim())}
                  className="px-3.5 py-2 rounded-xl bg-[#00a884] hover:bg-[#028b6d] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isFetchingWikiSummary ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Fill</span>
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && wikiSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#111b21] border border-[#2a3942] rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-[#222d34]">
                  {wikiSuggestions.map((item) => (
                    <div
                      key={item.title}
                      onClick={() => handleSelectWikiFigure(item.title)}
                      className="p-2.5 hover:bg-[#202c33] cursor-pointer transition-colors flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-[#8696a0] truncate">{item.description}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00a884]/20 text-[#00a884] shrink-0 font-medium">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {wikiFetchError && (
              <p className="text-[11px] text-red-400 mt-1.5">{wikiFetchError}</p>
            )}

            {/* Quick Preset Suggestion Chips */}
            <div className="mt-2.5 flex items-center space-x-1.5 flex-wrap gap-y-1">
              <span className="text-[10px] text-[#8696a0] font-medium">Try:</span>
              {PRESET_WIKI_SUGGESTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectWikiFigure(preset)}
                  className="px-2 py-0.5 rounded-lg bg-[#202c33] hover:bg-[#00a884]/30 hover:text-[#00a884] text-[#8696a0] text-[10px] transition-all cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Persona Visual Preview Card (if image or name exists) */}
          {name && (
            <div className="p-3 rounded-2xl bg-[#111b21] border border-[#222d34] flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white font-bold shrink-0 overflow-hidden shadow-md"
                style={{ backgroundColor: avatarColor }}
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarImage(undefined)}
                  />
                ) : (
                  <span>{avatarIcon || '✨'}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-white truncate">{name}</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/40 text-purple-300 font-semibold border border-purple-500/30">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-[#8696a0] truncate">{title || 'Custom Debater'}</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form id="persona-form" onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#8696a0] font-medium mb-1">Character Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus Aurelius"
                className="w-full bg-[#111b21] border border-[#222d34] rounded-xl px-3 py-2 text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#8696a0] font-medium mb-1">Title / Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Stoic Roman Emperor & Philosopher"
                className="w-full bg-[#111b21] border border-[#222d34] rounded-xl px-3 py-2 text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#8696a0] font-medium mb-1">Who Is He / Persona Bio *</label>
              <textarea
                required
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief background, core philosophy, and historical context..."
                className="w-full bg-[#111b21] border border-[#222d34] rounded-xl px-3 py-2 text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8696a0] font-medium mb-1">Tone & Style</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. Calm, contemplative, rigorous"
                  className="w-full bg-[#111b21] border border-[#222d34] rounded-xl px-3 py-2 text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all"
                />
              </div>
              <div>
                <label className="block text-[#8696a0] font-medium mb-1">Avatar Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={avatarColor}
                    onChange={(e) => setAvatarColor(e.target.value)}
                    className="w-full h-8 bg-[#111b21] border border-[#222d34] rounded-xl cursor-pointer p-0.5"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#8696a0] font-medium mb-1">Default Worldview / Stance</label>
              <input
                type="text"
                value={defaultStance}
                onChange={(e) => setDefaultStance(e.target.value)}
                placeholder="e.g. Inner virtue, reason, and duty govern human destiny..."
                className="w-full bg-[#111b21] border border-[#222d34] rounded-xl px-3 py-2 text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#222d34] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#8696a0] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="persona-form"
            className="px-5 py-2.5 bg-gradient-to-r from-[#00a884] to-teal-600 hover:from-[#028b6d] hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-[#00a884]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Add Character to Arena</span>
          </button>
        </div>
      </div>
    </div>
  );
};
