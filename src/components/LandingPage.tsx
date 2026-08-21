'use client';

import React from 'react';
import { Persona } from '@/types/debate';
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
} from 'lucide-react';

interface LandingPageProps {
  onEnterChatHub: () => void;
  onCreateNewChat: () => void;
  onOpenCharacterModal: () => void;
  allPersonas: Persona[];
  savedGroupsCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterChatHub,
  onCreateNewChat,
  onOpenCharacterModal,
  allPersonas,
  savedGroupsCount,
}) => {
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
          <button
            onClick={onOpenCharacterModal}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white border border-[#2a3942] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-[#00a884]" />
            <span className="hidden sm:inline">Custom Personas</span>
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

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10 flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#202c33]/90 border border-[#00a884]/30 text-xs text-[#00a884] mb-6 backdrop-blur-sm shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00a884]" />
          <span className="font-semibold">Sliding Context K=2 • 100% Token-Optimized • Audio TTS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          Multi-AI Persona Debates in a{' '}
          <span className="bg-gradient-to-r from-[#00a884] via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            WhatsApp-Style Arena
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#8696a0] text-sm sm:text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Put Einstein, Hawking, Chaplin, Socrates, or your own custom characters into vibrant group discussions. Watch them banter, argue, synthesize speech, and let you jump in at any time with "Steal Mic"!
        </p>

        {/* Primary CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-14">
          <button
            onClick={onEnterChatHub}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00a884] to-teal-600 hover:from-[#028b6d] hover:to-teal-700 text-white font-bold text-base shadow-xl shadow-[#00a884]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Open Chat Hub</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onCreateNewChat}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-[#202c33] hover:bg-[#2a3942] text-white font-semibold text-base border border-[#2a3942] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <PlusCircle className="w-5 h-5 text-[#00a884]" />
            <span>Create New Chat</span>
          </button>
        </div>

        {/* Interactive Visual Teaser Mockup */}
        <div className="w-full max-w-4xl bg-[#111b21]/90 rounded-2xl border border-[#222d34] shadow-2xl p-4 sm:p-6 mb-16 text-left relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-[#222d34]/80 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-md">
                ☕
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  Coffee with Einstein & Stephen
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00a884]/20 text-[#00a884] font-semibold border border-[#00a884]/30">
                    Live Arena
                  </span>
                </h3>
                <p className="text-xs text-[#8696a0]">Motion: Is backward time travel & grandfather paradox possible?</p>
              </div>
            </div>
            <button
              onClick={onEnterChatHub}
              className="px-3 py-1.5 text-xs font-semibold bg-[#202c33] hover:bg-[#00a884] hover:text-white text-[#8696a0] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Join Arena</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sample Chat Bubbles Preview */}
          <div className="space-y-3.5 text-xs sm:text-sm">
            {/* Einstein Message */}
            <div className="flex items-start space-x-3 bg-[#202c33]/40 p-3 rounded-xl border border-[#2a3942]/60">
              <div className="w-8 h-8 rounded-full bg-blue-900/60 flex items-center justify-center text-base shrink-0 border border-blue-500/30">
                🎻
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-400">Albert Einstein</span>
                  <span className="text-[10px] text-[#8696a0]">10:14 AM</span>
                </div>
                <p className="text-[#d1d7db] leading-relaxed">
                  "General relativity permits closed timelike curves under extreme frame-dragging. However, chronology protection must preserve causal consistency!"
                </p>
              </div>
            </div>

            {/* Hawking Message */}
            <div className="flex items-start space-x-3 bg-[#202c33]/40 p-3 rounded-xl border border-[#2a3942]/60">
              <div className="w-8 h-8 rounded-full bg-purple-900/60 flex items-center justify-center text-base shrink-0 border border-purple-500/30">
                🔭
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-400">Stephen Hawking</span>
                  <span className="text-[10px] text-[#8696a0]">10:15 AM</span>
                </div>
                <p className="text-[#d1d7db] leading-relaxed">
                  "I held a party for time travellers with invitations sent *after* the party. Nobody showed up! Quantum energy fluctuations will warp the wormhole shut."
                </p>
              </div>
            </div>

            {/* Chaplin Message */}
            <div className="flex items-start space-x-3 bg-[#202c33]/40 p-3 rounded-xl border border-[#2a3942]/60">
              <div className="w-8 h-8 rounded-full bg-amber-900/60 flex items-center justify-center text-base shrink-0 border border-amber-500/30">
                🎩
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-400">Charlie Chaplin</span>
                  <span className="text-[10px] text-[#8696a0]">10:16 AM</span>
                </div>
                <p className="text-[#d1d7db] leading-relaxed">
                  "Gentlemen, while you debate the mathematics of clocks running in reverse, let us not forget that laughter is the only true way to freeze time!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full text-left">
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

        {/* Persona Spotlight Preview */}
        <div className="mt-16 w-full text-center">
          <h3 className="text-xl font-bold text-white mb-4">Available Personas Ready to Debate</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {allPersonas.map((persona) => (
              <div
                key={persona.id}
                className="px-3 py-2 rounded-xl bg-[#111b21] border border-[#222d34] hover:border-[#00a884]/50 transition-all flex items-center gap-2 text-xs font-medium"
              >
                <span className="text-base">{persona.avatarIcon || '💬'}</span>
                <span className="text-white font-semibold">{persona.name}</span>
                <span className="text-[10px] text-[#8696a0] px-1.5 py-0.5 rounded bg-[#202c33]">
                  {persona.title.split(' ')[0] || persona.tone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Bottom Banner */}
        <div className="mt-16 w-full p-8 rounded-3xl bg-gradient-to-r from-[#111b21] via-[#15232d] to-[#111b21] border border-[#00a884]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-2xl">
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
