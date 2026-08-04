'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Persona, DebateMode, UserProfile, DebateTurn, TokenStats } from '@/types/debate';
import { MinimizedPayload } from '@/lib/token-minimizer';
import {
  Send,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  UserPlus,
  Smile,
  Paperclip,
  CheckCheck,
  Sparkles,
  Settings,
  X,
  MessageSquare,
  Search,
  MoreVertical,
  Plus,
  Trash2,
  Lock,
  Edit2,
  ArrowLeft,
  Users,
} from 'lucide-react';


interface WhatsAppGroupChatProps {
  topic: string;
  setTopic: (t: string) => void;
  mode: DebateMode;
  setMode: (m: DebateMode) => void;
  activePersonas: Persona[];
  allPersonas: Persona[];
  onSelectPersonas: (ids: string[]) => void;
  onDeletePersona: (id: string) => void;
  onOpenCharacterModal: () => void;
  currentSpeaker: Persona | undefined;
  isGenerating: boolean;
  isPaused: boolean;
  togglePause: () => void;
  timerSeconds: number;
  turnDelay: number;
  triggerNextTurn: () => void;
  resetDebate: () => void;
  turns: DebateTurn[];
  submitUserInterjection: (text: string) => void;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  tokenStats: TokenStats;
  lastPayload: MinimizedPayload | null;
}

const PRESET_GROUPS = [
  {
    id: 'group_1',
    topic: 'Is backward time travel truly possible?',
    personaIds: ['einstein', 'hawking', 'buddha', 'chaplin'],
    lastMessage: 'Spacetime curvature allows closed timelike curves theoretically...',
    time: '10:12 AM',
  },
  {
    id: 'group_2',
    topic: 'Humor, Freedom & Propaganda in Modern Technology',
    personaIds: ['chaplin', 'hitler', 'socrates'],
    lastMessage: 'Human freedom and laughter transcend rigid machine control...',
    time: 'Yesterday',
  },
  {
    id: 'group_3',
    topic: 'Is Artificial Intelligence a Threat to Human Dignity?',
    personaIds: ['tesla', 'edison', 'hawking', 'einstein'],
    lastMessage: 'Empirical science must serve human elevation and ethics...',
    time: 'Yesterday',
  },
  {
    id: 'group_4',
    topic: 'Commercial Grid Capitalism vs Free Energy for All',
    personaIds: ['tesla', 'edison'],
    lastMessage: 'Wireless energy must be free to uplift all humanity...',
    time: '2 days ago',
  },
  {
    id: 'group_5',
    topic: 'The Ethics of Power & Realpolitik in Global Diplomacy',
    personaIds: ['machiavelli', 'socrates'],
    lastMessage: 'The unexamined life is not worth living...',
    time: '3 days ago',
  },
];

export const WhatsAppGroupChat: React.FC<WhatsAppGroupChatProps> = ({
  topic,
  setTopic,
  mode,
  setMode,
  activePersonas,
  allPersonas,
  onSelectPersonas,
  onDeletePersona,
  onOpenCharacterModal,
  currentSpeaker,
  isGenerating,
  isPaused,
  togglePause,
  timerSeconds,
  turnDelay,
  triggerNextTurn,
  resetDebate,
  turns,
  submitUserInterjection,
  userProfile,
  setUserProfile,
  tokenStats,
  lastPayload,
}) => {
  const [inputText, setInputText] = useState('');
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicInput, setTopicInput] = useState(topic);
  const [isChatsDrawerOpen, setIsChatsDrawerOpen] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [userNameInput, setUserNameInput] = useState(userProfile.name);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat feed when new turns arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isGenerating]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    submitUserInterjection(inputText.trim());
    setInputText('');
  };

  const handleSaveTopic = () => {
    if (topicInput.trim()) {
      setTopic(topicInput.trim());
    }
    setIsEditingTopic(false);
  };



  const handleSaveUser = () => {
    if (userNameInput.trim()) {
      setUserProfile({ ...userProfile, name: userNameInput.trim() });
    }
    setShowUserModal(false);
  };

  const handleSelectGroup = (g: typeof PRESET_GROUPS[0]) => {
    setTopic(g.topic);
    setTopicInput(g.topic);
    onSelectPersonas(g.personaIds);
    resetDebate();
    setIsChatsDrawerOpen(false);
  };

  // Participant names summary for group header subtitle
  const participantNames = [
    ...activePersonas.map((p) => p.name),
    `${userProfile.name} (You)`,
  ].join(', ');

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredGroups = PRESET_GROUPS.filter(
    (g) =>
      g.topic.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      g.lastMessage.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto h-[88vh] bg-[#0b141a] text-[#e9edef] rounded-3xl border border-[#222d34] shadow-2xl flex flex-col overflow-hidden font-sans relative selection:bg-[#00a884] selection:text-white">
      {/* 1. WhatsApp Realistic Group Header */}
      <header className="bg-[#111b21] border-b border-[#222d34] px-4 py-3 flex items-center justify-between shrink-0 z-30 shadow-md">
        {/* Left: WhatsApp Back Button & Group Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* WhatsApp Back Button */}
          <button
            onClick={() => setIsChatsDrawerOpen(true)}
            className="p-2 bg-[#202c33] hover:bg-[#2a3942] text-[#00a884] hover:text-white rounded-xl transition-colors shrink-0 flex items-center gap-1 font-semibold text-xs"
            title="Back to Previous Group Chats"
          >
            <ArrowLeft className="w-5 h-5 text-[#00a884]" />
            <span className="hidden sm:inline">Chats</span>
          </button>

          {/* Group Avatar Stack */}
          <div className="relative flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00a884] to-teal-700 flex items-center justify-center text-white font-bold text-base shadow-md border-2 border-[#111b21]">
              🌐
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00a884] rounded-full border-2 border-[#111b21]" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Group Name = Active Topic Motion */}
            <div className="flex items-center space-x-2">
              {isEditingTopic ? (
                <div className="flex items-center space-x-2 w-full max-w-lg">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="bg-[#202c33] text-white border border-[#00a884] rounded-lg px-3 py-1 text-sm focus:outline-none w-full"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTopic()}
                  />
                  <button
                    onClick={handleSaveTopic}
                    className="px-3 py-1 bg-[#00a884] text-white text-xs rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => setIsEditingTopic(true)}>
                  <h2 className="text-base font-bold text-[#e9edef] truncate hover:text-[#00a884] transition-colors">
                    {topic}
                  </h2>
                  <Edit2 className="w-3.5 h-3.5 text-[#8696a0] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              )}
            </div>

            {/* Subtitle: Participants */}
            <p className="text-xs text-[#8696a0] truncate font-medium">
              {isGenerating && currentSpeaker ? (
                <span className="text-[#00a884] font-semibold animate-pulse flex items-center gap-1">
                  <span>{currentSpeaker.avatarIcon || '💬'}</span>
                  <span>{currentSpeaker.name} is typing...</span>
                </span>
              ) : (
                participantNames
              )}
            </p>
          </div>
        </div>

        {/* Right Header Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* User Profile Button */}
          <button
            onClick={() => setShowUserModal(true)}
            className="px-3 py-1.5 bg-[#202c33] hover:bg-[#2a3942] rounded-xl text-xs font-semibold text-[#d1d7db] flex items-center space-x-1.5 transition-colors border border-[#222d34]"
            title="Edit User Profile"
          >
            <span>👤</span>
            <span className="hidden sm:inline">{userProfile.name}</span>
          </button>

          {/* Add Character Button */}
          <button
            onClick={onOpenCharacterModal}
            className="px-3 py-1.5 bg-[#00a884]/20 hover:bg-[#00a884]/30 text-[#00a884] border border-[#00a884]/40 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
            title="Add Historical Character"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">+ Character</span>
          </button>



          {/* Debug / Token Stats Button */}
          <button
            onClick={() => setShowDebugModal(true)}
            className="p-2 bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white rounded-xl transition-colors"
            title="Token Minimizer Debugger"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </button>

          {/* Reset Debate Button */}
          <button
            onClick={resetDebate}
            className="p-2 bg-[#202c33] hover:bg-rose-900/40 text-[#8696a0] hover:text-rose-400 rounded-xl transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Character Picker Bar (Placed directly before the chat feed) */}
      <div className="bg-[#111b21]/90 border-b border-[#222d34] px-4 py-2 flex items-center justify-between gap-3 shrink-0">
        <span className="text-[11px] text-[#8696a0] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-[#00a884]" /> Group Members:
        </span>

        {/* Scrollable Row of Historical Figures */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 flex-1 scroll-smooth">
          {allPersonas.map((p) => {
            const isSelected = activePersonas.some((ap) => ap.id === p.id);
            const isSpeaking = currentSpeaker?.id === p.id && isGenerating;

            return (
              <div key={p.id} className="relative group shrink-0 flex items-center">
                <button
                  onClick={() => {
                    if (isSelected) {
                      if (activePersonas.length > 1) {
                        onSelectPersonas(activePersonas.filter((ap) => ap.id !== p.id).map((ap) => ap.id));
                      }
                    } else {
                      onSelectPersonas([...activePersonas.map((ap) => ap.id), p.id]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                    isSelected
                      ? 'bg-[#202c33] text-white border-[#00a884] shadow-sm'
                      : 'bg-[#0b141a] text-[#8696a0] hover:text-[#d1d7db] border-[#222d34]'
                  }`}
                  style={{
                    boxShadow: isSpeaking ? `0 0 10px ${p.avatarColor}66` : undefined,
                  }}
                >
                  <span
                    suppressHydrationWarning
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 overflow-hidden"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.avatarIcon || '👤'
                    )}
                  </span>
                  <span className="truncate max-w-[110px]">{p.name}</span>
                  {p.isCustom && (
                    <span className="text-[9px] bg-purple-950 text-purple-300 px-1 rounded font-mono border border-purple-800">
                      Local
                    </span>
                  )}
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#00a884] shrink-0" />}
                </button>

                {/* Delete button for local store custom personas */}
                {p.isCustom && onDeletePersona && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePersona(p.id);
                    }}
                    className="ml-1 p-1 text-[#8696a0] hover:text-rose-400 hover:bg-[#202c33] rounded-lg transition-colors"
                    title="Delete custom persona"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Preset Topic Quick Chips Dropdown */}
        <div className="shrink-0 hidden lg:flex items-center space-x-1">
          {PRESET_GROUPS.slice(0, 2).map((g, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectGroup(g)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#202c33] text-[#8696a0] hover:text-white border border-[#222d34] truncate max-w-[130px]"
              title={g.topic}
            >
              {g.topic}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Realistic WhatsApp Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b141a] relative scroll-smooth">
        {/* Sticky System Info Pill */}
        <div className="flex justify-center my-2">
          <div className="bg-[#182229] border border-[#222d34] text-[#8696a0] text-[11px] px-4 py-1.5 rounded-xl shadow-sm max-w-md text-center flex items-center justify-center space-x-1.5">
            <Lock className="w-3 h-3 text-[#00a884] shrink-0" />
            <span>
              Messages in this group chat are generated live by historical AI figures using Gemini 3.5.
            </span>
          </div>
        </div>

        {/* Empty Chat Welcome State */}
        {turns.length === 0 && (
          <div className="text-center py-12 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#111b21] border border-[#222d34] flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              💬
            </div>
            <h3 className="text-base font-bold text-[#e9edef] mb-1">
              Welcome to the Historical Figure Group Chat
            </h3>
            <p className="text-xs text-[#8696a0] leading-relaxed mb-4">
              Group Topic: <strong className="text-[#00a884]">"{topic}"</strong>
              <br />
              Type a message below to start chatting with Albert Einstein, Stephen Hawking, Buddha, and more, or click <strong className="text-white">"Next Speaker ➔"</strong> to trigger their debate turns!
            </p>
          </div>
        )}

        {/* Conversation Turn Bubbles */}
        {turns.map((turn) => {
          const isUser = turn.speakerId === 'user';
          const speakerPersona = activePersonas.find((p) => p.id === turn.speakerId);
          const color = speakerPersona?.avatarColor || '#00a884';

          if (isUser) {
            {/* User Message Bubble (Right-Aligned, WhatsApp Green) */}
            return (
              <div key={turn.id} className="flex flex-col items-end my-2">
                <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[85%] sm:max-w-[70%] shadow-md border border-[#005c4b]/50 relative group">
                  <div className="text-[11px] font-bold text-[#aebac1] mb-1 flex items-center justify-between gap-4">
                    <span>You ({userProfile.name})</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {turn.content}
                  </p>
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-[#8696a0]">
                    <span>{formatTimestamp(turn.timestamp)}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            );
          }

          {/* Historical Figure Message Bubble (Left-Aligned, Dark Gray) */}
          return (
            <div key={turn.id} className="flex items-start space-x-2.5 my-2 max-w-[90%] sm:max-w-[78%]">
              {/* Speaker Avatar Image / Icon */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-md border border-[#222d34] mt-0.5 overflow-hidden"
                style={{ backgroundColor: color }}
              >
                {speakerPersona?.avatarImage ? (
                  <img src={speakerPersona.avatarImage} alt={turn.speakerName} className="w-full h-full object-cover" />
                ) : (
                  speakerPersona?.avatarIcon || '🎭'
                )}
              </div>

              {/* Message Card */}
              <div className="bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-none px-4 py-2.5 shadow-md border border-[#2a3942] relative flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold truncate" style={{ color: color }}>
                    {turn.speakerName}
                  </span>
                  {speakerPersona?.title && (
                    <span className="text-[10px] text-[#8696a0] truncate font-medium hidden sm:inline">
                      {speakerPersona.title}
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-[#d1d7db]">
                  {turn.content}
                </p>

                <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-[#8696a0]">
                  <span>{formatTimestamp(turn.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isGenerating && currentSpeaker && (
          <div className="flex items-center space-x-2.5 my-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-md border border-[#222d34] overflow-hidden"
              style={{ backgroundColor: currentSpeaker.avatarColor }}
            >
              {currentSpeaker.avatarImage ? (
                <img src={currentSpeaker.avatarImage} alt={currentSpeaker.name} className="w-full h-full object-cover" />
              ) : (
                currentSpeaker.avatarIcon || '💬'
              )}
            </div>
            <div className="bg-[#202c33] border border-[#2a3942] rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex items-center space-x-2">
              <span className="text-xs font-semibold" style={{ color: currentSpeaker.avatarColor }}>
                {currentSpeaker.name}
              </span>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 4. WhatsApp Bottom Control & Chat Bar */}
      <footer className="bg-[#202c33] border-t border-[#2a3942] p-3 shrink-0 z-30">
        <div className="flex items-center space-x-2">
          {/* Stop / Auto-Play Toggle */}
          <button
            onClick={togglePause}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all border ${
              isPaused
                ? 'bg-[#111b21] text-[#00a884] border-[#00a884]/40 hover:bg-[#2a3942]'
                : 'bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-rose-900'
            }`}
            title={isPaused ? 'Resume Automatic Group Debate' : 'Pause Auto Chat'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPaused ? 'Auto Play' : `Pause (${timerSeconds}s)`}</span>
          </button>

          {/* Next Speaker Button (Manual Trigger for Next Person) */}
          <button
            onClick={triggerNextTurn}
            disabled={isGenerating}
            className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all shrink-0 border border-purple-500/30"
            title="Prompt Next Historical Figure to Speak"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            <span>Next Speaker ➔</span>
          </button>

          {/* WhatsApp Text Chat Input */}
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2 min-w-0">
            <div className="flex-1 bg-[#2a3942] rounded-2xl px-4 py-2 flex items-center space-x-2 border border-[#222d34] focus-within:border-[#00a884]">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type a message to group as ${userProfile.name}...`}
                className="w-full bg-transparent text-white placeholder-[#8696a0] text-sm focus:outline-none"
              />
            </div>

            {/* WhatsApp Green Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-teal-600 text-white flex items-center justify-center shadow-lg disabled:opacity-40 transition-all shrink-0"
              title="Send message to group"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </footer>

      {/* 5. Modals (User Profile, API Key, Token Debugger) */}
      {/* User Profile Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111b21] border border-[#222d34] rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#222d34] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                👤 Edit User Profile
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-lg text-[#8696a0] hover:text-white bg-[#202c33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8696a0] font-medium mb-1">Your Name in Chat:</label>
                <input
                  type="text"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  className="w-full bg-[#202c33] border border-[#222d34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00a884]"
                  placeholder="e.g. Alex"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button onClick={() => setShowUserModal(false)} className="px-4 py-2 text-[#8696a0]">
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-5 py-2 bg-[#00a884] text-white font-bold rounded-xl shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Token Minimizer Debugger Modal */}
      {showDebugModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111b21] border border-[#222d34] rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#222d34] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Token Minimizer Stats
              </h3>
              <button
                onClick={() => setShowDebugModal(false)}
                className="p-1 rounded-lg text-[#8696a0] hover:text-white bg-[#202c33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#202c33] p-3 rounded-xl border border-[#222d34] text-center">
                  <span className="text-[10px] text-[#8696a0] block font-bold">Prompt Tokens</span>
                  <span className="text-base font-bold text-white">{tokenStats.totalPromptTokens}</span>
                </div>
                <div className="bg-[#202c33] p-3 rounded-xl border border-[#222d34] text-center">
                  <span className="text-[10px] text-[#8696a0] block font-bold">Response Tokens</span>
                  <span className="text-base font-bold text-white">{tokenStats.totalResponseTokens}</span>
                </div>
                <div className="bg-[#202c33] p-3 rounded-xl border border-[#222d34] text-center">
                  <span className="text-[10px] text-[#8696a0] block font-bold">Tokens Saved</span>
                  <span className="text-base font-bold text-[#00a884]">{tokenStats.estimatedTokensSaved}</span>
                </div>
              </div>
              {lastPayload && (
                <div className="mt-2">
                  <span className="text-slate-400 font-bold block mb-1">Last Payload System Instruction:</span>
                  <pre className="bg-[#0b141a] p-3 rounded-xl border border-[#222d34] text-[10px] text-slate-300 font-mono overflow-x-auto max-h-40 whitespace-pre-wrap">
                    {lastPayload.systemInstruction}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 6. WhatsApp Previous Group Chats Drawer Overlay */}
      {isChatsDrawerOpen && (
        <div className="absolute inset-0 z-50 bg-[#111b21] flex flex-col font-sans">
          {/* Chats Header */}
          <div className="bg-[#202c33] border-b border-[#222d34] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsChatsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#00a884] hover:bg-[#2a3942] transition-colors"
                title="Back to Active Chat"
              >
                <ArrowLeft className="w-6 h-6 text-[#00a884]" />
              </button>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00a884]" /> Previous Group Chats
              </h2>
            </div>
            <button
              onClick={() => {
                setIsChatsDrawerOpen(false);
                setIsEditingTopic(true);
              }}
              className="px-3 py-1.5 bg-[#00a884] text-white text-xs font-bold rounded-xl shadow-md hover:bg-teal-600 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> New Group Chat
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[#222d34] bg-[#111b21]">
            <div className="bg-[#202c33] rounded-xl px-3 py-2 flex items-center space-x-2 border border-[#222d34]">
              <Search className="w-4 h-4 text-[#8696a0]" />
              <input
                type="text"
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                placeholder="Search previous debate group topics..."
                className="w-full bg-transparent text-white text-xs placeholder-[#8696a0] focus:outline-none"
              />
            </div>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]">
            {filteredGroups.map((g) => {
              const isActive = g.topic === topic;
              const memberPersonas = g.personaIds
                .map((id) => allPersonas.find((p) => p.id === id))
                .filter(Boolean) as Persona[];

              return (
                <button
                  key={g.id}
                  onClick={() => handleSelectGroup(g)}
                  className={`w-full p-4 flex items-center space-x-3.5 text-left transition-colors ${
                    isActive ? 'bg-[#202c33]' : 'hover:bg-[#202c33]/60'
                  }`}
                >
                  {/* Group Avatar Stack */}
                  <div className="relative shrink-0 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00a884] to-teal-800 flex items-center justify-center text-white text-lg font-bold shadow-md border-2 border-[#111b21] overflow-hidden">
                      {memberPersonas[0]?.avatarImage ? (
                        <img src={memberPersonas[0].avatarImage} alt={memberPersonas[0].name} className="w-full h-full object-cover" />
                      ) : (
                        '💬'
                      )}
                    </div>
                  </div>

                  {/* Group Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#e9edef] truncate">
                        {g.topic}
                      </h4>
                      <span className="text-[10px] text-[#8696a0] shrink-0 font-medium">{g.time}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-[#8696a0] truncate mb-1">
                      <span className="font-semibold text-[#00a884]">
                        {memberPersonas.map((p) => p.name).join(', ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#8696a0] truncate italic">
                      "{g.lastMessage}"
                    </p>
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
