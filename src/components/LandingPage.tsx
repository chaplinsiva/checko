'use client';

import React, { useState } from 'react';
import { Persona } from '@/types/debate';
import { SAMPLE_DEBATES, SampleDebate } from '@/lib/sample-debates';
import { SAMPLE_BRAINSTORMS } from '@/lib/sample-brainstorms';
import { BrainstormIdea } from '@/types/brainstorm';
import {
  MessageSquare,
  Sparkles,
  Users,
  Zap,
  Volume2,
  ArrowRight,
  PlusCircle,
  BrainCircuit,
  ChevronRight,
  Flame,
  Bot,
  Play,
  Swords,
  Layers,
  Sparkle,
  Lightbulb,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';

interface LandingPageProps {
  onEnterChatHub: () => void;
  onCreateNewChat: () => void;
  onOpenCharacterModal: () => void;
  onStartSampleDebate?: (debate: SampleDebate) => void;
  onOpenBrainstormModal?: () => void;
  onStartSampleBrainstorm?: (sample: BrainstormIdea) => void;
  allPersonas: Persona[];
  savedGroupsCount: number;
  language?: 'en' | 'ta';
  onToggleLanguage?: (lang: 'en' | 'ta') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterChatHub,
  onCreateNewChat,
  onOpenCharacterModal,
  onStartSampleDebate,
  onOpenBrainstormModal,
  onStartSampleBrainstorm,
  allPersonas,
  savedGroupsCount,
  language = 'en',
  onToggleLanguage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Arenas', icon: '🔥' },
    { id: 'Tech & Computing', label: 'Tech & Computing', icon: '💻' },
    { id: 'Science & Physics', label: 'Science & Physics', icon: '⚡' },
    { id: 'Philosophy & Spirituality', label: 'Philosophy & Wisdom', icon: '🪷' },
    { id: 'Politics & History', label: 'Politics & Power', icon: '👑' },
    { id: 'Art & Satire', label: 'Art & Satire', icon: '🎭' },
  ];

  const filteredDebates =
    selectedCategory === 'all'
      ? SAMPLE_DEBATES
      : SAMPLE_DEBATES.filter((d) => d.category === selectedCategory);

  const getPersona = (id: string) => allPersonas.find((p) => p.id === id);

  return (
    <div className="w-full h-full min-h-screen bg-[#0b141a] text-[#e9edef] overflow-y-auto selection:bg-[#00a884] selection:text-white relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00a884]/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#111b21]/90 backdrop-blur-md border-b border-[#222d34]/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#00a884]/20 ring-2 ring-[#00a884]/40 flex items-center justify-center">
            <img src="/logo.svg" alt="Checko Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">Checko</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40">
                AI Arena
              </span>
            </div>
            <p className="text-[11px] text-[#8696a0] hidden sm:block">WhatsApp-style Multi-Persona Debate Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onToggleLanguage && (
            <button
              onClick={() => onToggleLanguage(language === 'ta' ? 'en' : 'ta')}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                language === 'ta'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white border-[#2a3942]'
              }`}
              title={language === 'ta' ? 'Current: தமிழ். Click for English' : 'Current: English. Click for தமிழ்'}
            >
              <span>{language === 'ta' ? '🇮🇳 தமிழ்' : '🇬🇧 English'}</span>
            </button>
          )}

          {onOpenBrainstormModal && (
            <button
              onClick={onOpenBrainstormModal}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Launch Idea Brainstorming Incubator"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Brainstorm Idea</span>
            </button>
          )}

          <button
            onClick={onOpenCharacterModal}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white border border-[#2a3942] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-[#00a884]" />
            <span className="hidden sm:inline">Add Character</span>
          </button>

          <button
            onClick={onEnterChatHub}
            className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#00a884] hover:bg-[#028b6d] text-white transition-all shadow-md shadow-[#00a884]/20 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Hub</span>
            {savedGroupsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#111b21]/60 text-white text-[10px] rounded-full">
                {savedGroupsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10 flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#202c33]/90 border border-[#00a884]/30 text-xs text-[#00a884] mb-6 backdrop-blur-sm shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00a884]" />
          <span className="font-semibold">Sliding Context K=2 • 100% Token-Optimized • Multi-Persona Audio</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          Iconic Mind Clashes in a{' '}
          <span className="bg-gradient-to-r from-[#00a884] via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            WhatsApp-Style Arena
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#8696a0] text-sm sm:text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Pit history’s greatest thinkers and innovators against each other in real-time sequential banter. Watch Tesla spar with Edison, Buddha discuss truth with Mahavira, or Linus challenge Bill Gates!
        </p>

        {/* Primary CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xl mb-12">
          {onOpenBrainstormModal && (
            <button
              onClick={onOpenBrainstormModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Lightbulb className="w-5 h-5 text-yellow-100 group-hover:rotate-12 transition-transform" />
              <span>Brainstorm Idea</span>
              <Sparkles className="w-4 h-4 text-yellow-100" />
            </button>
          )}

          <button
            onClick={onEnterChatHub}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00a884] to-teal-600 hover:from-[#028b6d] hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-[#00a884]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Open Chat Hub</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onCreateNewChat}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#202c33] hover:bg-[#2a3942] text-white font-semibold text-sm border border-[#2a3942] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-[#00a884]" />
            <span>New Debate</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* STARTUP & APP BRAINSTORMING INCUBATOR SECTION */}
        {/* ============================================================ */}
        <section className="w-full mb-16 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-[#222d34]/80 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Idea Incubator & Pros/Cons Analyzer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Startup & App Ideas Ready to Brainstorm
              </h2>
              <p className="text-xs sm:text-sm text-[#8696a0] mt-1">
                Pitch an app, stress-test business models, discover blind spots, and run live Pros & Cons analysis with specialized AI advisors.
              </p>
            </div>

            {onOpenBrainstormModal && (
              <button
                onClick={onOpenBrainstormModal}
                className="px-4 py-2 bg-[#202c33] hover:bg-[#2a3942] text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Pitch Custom Idea</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_BRAINSTORMS.slice(0, 3).map((idea) => {
              const squadPersonas = idea.personaIds.map((id) => allPersonas.find((p) => p.id === id)).filter(Boolean);
              const topPro = idea.initialPros?.[0];
              const topCon = idea.initialCons?.[0];

              return (
                <div
                  key={idea.id}
                  className="bg-[#111b21] border border-[#222d34] hover:border-amber-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {idea.badge || 'Startup Dev'}
                      </span>

                      {/* Squad Avatars */}
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {squadPersonas.slice(0, 4).map((p) => (
                          <div
                            key={p!.id}
                            className="w-5 h-5 rounded-full border border-[#111b21] overflow-hidden text-[8px] flex items-center justify-center font-bold"
                            style={{ backgroundColor: p!.avatarColor }}
                            title={p!.name}
                          >
                            {p!.avatarImage ? (
                              <img src={p!.avatarImage} alt={p!.name} className="w-full h-full object-cover" />
                            ) : (
                              p!.avatarIcon || '👤'
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-[#8696a0] leading-relaxed line-clamp-2 mb-3">
                      {idea.tagline}
                    </p>

                    {/* Preview Pro & Con Pills */}
                    <div className="space-y-1.5 mb-4 text-[10px]">
                      {topPro && (
                        <div className="flex items-start gap-1.5 text-emerald-300/90 bg-emerald-950/30 border border-emerald-800/30 px-2 py-1 rounded-lg">
                          <ThumbsUp className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{topPro}</span>
                        </div>
                      )}
                      {topCon && (
                        <div className="flex items-start gap-1.5 text-rose-300/90 bg-rose-950/30 border border-rose-800/30 px-2 py-1 rounded-lg">
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{topCon}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {onStartSampleBrainstorm && (
                    <button
                      onClick={() => onStartSampleBrainstorm(idea)}
                      className="w-full py-2.5 bg-[#202c33] group-hover:bg-amber-500 group-hover:text-[#111b21] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Brainstorming</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* FEATURED SAMPLE DEBATES / CLASH ARENA SECTION */}
        {/* ============================================================ */}
        <section className="w-full mb-20 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#222d34]/80 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#00a884] mb-1.5">
                <Flame className="w-4 h-4" />
                <span>Featured Matchups</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Iconic Sample Debates Ready to Clash
              </h2>
              <p className="text-xs sm:text-sm text-[#8696a0] mt-1">
                Choose a pre-configured battle to launch straight into the arena with authentic stances and arguments.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#00a884] text-white shadow-md shadow-[#00a884]/25 scale-105'
                      : 'bg-[#111b21] hover:bg-[#202c33] text-[#8696a0] hover:text-white border border-[#222d34]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sample Debates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDebates.map((debate) => {
              const p1 = getPersona(debate.personaIds[0]);
              const p2 = getPersona(debate.personaIds[1]);
              const p3 = debate.personaIds[2] ? getPersona(debate.personaIds[2]) : null;

              return (
                <div
                  key={debate.id}
                  className="bg-[#111b21]/95 rounded-2xl border border-[#222d34] hover:border-[#00a884]/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col group relative"
                >
                  {/* Top Category & Badge Ribbon */}
                  <div className="px-5 py-3.5 bg-[#15232d]/60 border-b border-[#222d34] flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {debate.badge}
                    </span>
                    <span className="text-[11px] font-medium text-[#8696a0] bg-[#111b21] px-2 py-0.5 rounded border border-[#222d34]">
                      {debate.category}
                    </span>
                  </div>

                  {/* Versus Banner Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between bg-[#0b141a]/60 rounded-xl p-3.5 border border-[#222d34]/60 mb-4">
                      {/* Persona 1 */}
                      <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                        <div
                          className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border-2 shadow-md relative"
                          style={{ borderColor: p1?.avatarColor || '#3b82f6' }}
                        >
                          {p1?.avatarImage ? (
                            <img src={p1.avatarImage} alt={p1.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{p1?.avatarIcon || '💬'}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{p1?.name || 'Debater 1'}</h4>
                          <p className="text-[10px] text-[#8696a0] truncate">{p1?.title || 'Thinker'}</p>
                        </div>
                      </div>

                      {/* VS Badge */}
                      <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/40 text-red-400 text-[10px] font-black tracking-widest uppercase mx-2 shadow-inner">
                        VS
                      </div>

                      {/* Persona 2 */}
                      <div className="flex items-center space-x-2.5 flex-1 min-w-0 justify-end text-right">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{p2?.name || 'Debater 2'}</h4>
                          <p className="text-[10px] text-[#8696a0] truncate">{p2?.title || 'Thinker'}</p>
                        </div>
                        <div
                          className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border-2 shadow-md relative"
                          style={{ borderColor: p2?.avatarColor || '#eab308' }}
                        >
                          {p2?.avatarImage ? (
                            <img src={p2.avatarImage} alt={p2.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{p2?.avatarIcon || '💬'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Debate Title & Motion */}
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#00a884] transition-colors">
                      {debate.title}
                    </h3>
                    <p className="text-xs text-[#8696a0] mb-3.5 leading-relaxed line-clamp-2">
                      {debate.tagline}
                    </p>

                    {/* Motion Quote Card */}
                    <div className="bg-[#202c33]/40 rounded-xl p-3 border border-[#2a3942]/60 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#00a884] mb-1">
                        Debate Motion
                      </div>
                      <p className="text-xs italic text-[#d1d7db] font-medium leading-relaxed">
                        "{debate.motion}"
                      </p>
                    </div>

                    {/* Opening Perspective Snippets */}
                    <div className="space-y-2 mb-4">
                      {debate.previewQuotes.slice(0, 2).map((pq, idx) => {
                        const speaker = getPersona(pq.personaId);
                        return (
                          <div
                            key={idx}
                            className="text-[11px] p-2.5 rounded-lg bg-[#0b141a]/40 border border-[#222d34] flex items-start space-x-2"
                          >
                            <span className="shrink-0">{speaker?.avatarIcon || '💬'}</span>
                            <div className="flex-1">
                              <span className="font-bold text-white mr-1.5">{speaker?.name?.split(' ')[0]}:</span>
                              <span className="text-[#8696a0] italic">"{pq.quote}"</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Launch CTA Action Bar */}
                  <div className="mt-auto px-5 py-3.5 bg-[#0e171d] border-t border-[#222d34] flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#8696a0]">
                      <Users className="w-3.5 h-3.5 text-[#00a884]" />
                      <span>{debate.personaIds.length} Personas Ready</span>
                    </div>

                    <button
                      onClick={() => {
                        if (onStartSampleDebate) {
                          onStartSampleDebate(debate);
                        } else {
                          onEnterChatHub();
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#028b6d] text-white font-bold text-xs shadow-md shadow-[#00a884]/20 transition-all flex items-center gap-1.5 cursor-pointer group-hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Clash</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full text-left mb-16">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#00a884]/20 text-[#00a884] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">WhatsApp-Style Multi-Persona</h4>
            <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">
              Create and manage multiple group chats with customizable AI personas that banter and reply in sequential turns.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Sliding Window Token Saver</h4>
            <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">
              Maintains K=2 turn window + rolling state JSON summary, drastically slashing token usage while retaining high debate context.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Text-To-Speech Narration</h4>
            <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">
              Each persona speaks with distinct pitch and vocal pacing. Replay any turn or mute/unmute with a single click.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Steal Mic Interjections</h4>
            <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">
              Jump into the debate at any moment as an active participant or moderator to redirect arguments and test viewpoints.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-5 rounded-2xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Custom Character Studio</h4>
            <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">
              Design your own AI personas with custom system prompts, avatars, debating styles, stances, and vocal parameters.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-5 rounded-2xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">OpenRouter & Gemini Multi-Model</h4>
            <p className="text-xs sm:text-sm text-[#8696a0] leading-relaxed">
              Switch effortlessly between Gemini 2.5 Flash, Llama 3.2, DeepSeek, Mistral, and Claude models on the fly.
            </p>
          </div>
        </div>

        {/* Character Spotlight Preview */}
        <div className="w-full text-center mb-16">
          <h3 className="text-xl font-bold text-white mb-2">All Characters in Arena</h3>
          <p className="text-xs text-[#8696a0] mb-6">Historical titans, philosophers, and tech pioneers ready to clash</p>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {allPersonas.map((persona) => (
              <div
                key={persona.id}
                className="px-3.5 py-2 rounded-xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/50 transition-all flex items-center gap-2.5 text-xs font-medium"
              >
                <div
                  className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border"
                  style={{ borderColor: persona.avatarColor || '#00a884' }}
                >
                  {persona.avatarImage ? (
                    <img src={persona.avatarImage} alt={persona.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{persona.avatarIcon || '💬'}</span>
                  )}
                </div>
                <span className="text-white font-semibold">{persona.name}</span>
                <span className="text-[10px] text-[#8696a0] px-1.5 py-0.5 rounded bg-[#202c33]">
                  {persona.title.split(' ')[0] || persona.tone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Bottom Banner */}
        <div className="w-full p-8 rounded-3xl bg-gradient-to-r from-[#111b21] via-[#15232d] to-[#111b21] border border-[#00a884]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-2xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Ready to spark an intellectual clash?</h3>
            <p className="text-xs sm:text-sm text-[#8696a0]">Jump into existing debates or configure your custom room in seconds.</p>
          </div>
          <button
            onClick={onEnterChatHub}
            className="px-6 py-3.5 rounded-2xl bg-[#00a884] hover:bg-[#028b6d] text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#00a884]/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Launch Arena Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222d34]/60 py-6 text-center text-xs text-[#8696a0]">
        <p>Checko • AI Persona Debate Arena • Powered by Gemini & OpenRouter</p>
      </footer>
    </div>
  );
};
