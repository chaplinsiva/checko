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
  Check,
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
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';

import { ModelSwitcher } from './ModelSwitcher';
import { NewGroupModal } from './NewGroupModal';
import { getStoredApiKey, getOpenRouterApiKey } from '@/lib/gemini';

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
  setTurnDelay?: (delay: number) => void;
  triggerNextTurn: () => void;
  resetDebate: () => void;
  turns: DebateTurn[];
  submitUserInterjection: (text: string) => void;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  tokenStats: TokenStats;
  lastPayload: MinimizedPayload | null;
  onPlayTurnVoice?: (turn: DebateTurn) => void;
  currentlySpeakingTurnId?: string | null;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isSpeaking?: boolean;
  selectedModel?: string;
  onSelectModel?: (modelId: string) => void;
  onBackToHistory?: () => void;
  onSwitchGroup?: (group: SavedGroupItem) => void;
  onGroupCreated?: (topic: string, personaIds: string[], autoGroupName: string) => void;
}

export interface SavedGroupItem {
  id: string;
  groupTitle: string;
  debateMotion: string;
  personaIds: string[];
  lastMessage: string;
  time: string;
  createdAt: number;
}

export const DEFAULT_PRESET_GROUPS: SavedGroupItem[] = [
  {
    id: 'group_1',
    groupTitle: 'Coffee with Einstein & Stephen',
    debateMotion: 'Is backward time travel & the grandfather paradox possible?',
    personaIds: ['einstein', 'hawking', 'buddha', 'chaplin'],
    lastMessage: 'Spacetime curvature allows closed timelike curves theoretically...',
    time: '10:12 AM',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'group_2',
    groupTitle: 'The Great Dictator & Satirist Circle',
    debateMotion: 'Humor, Freedom & Propaganda in Modern Technology',
    personaIds: ['chaplin', 'hitler', 'socrates'],
    lastMessage: 'Human freedom and laughter transcend rigid machine control...',
    time: 'Yesterday',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'group_3',
    groupTitle: 'AC vs DC: Voltage & Power Vault',
    debateMotion: 'Commercial Grid Capitalism vs Free Energy for All',
    personaIds: ['tesla', 'edison'],
    lastMessage: 'Wireless energy must be free to uplift all humanity...',
    time: '2 days ago',
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'group_4',
    groupTitle: 'Ethics, Power & Wisdom Council',
    debateMotion: 'The Ethics of Power & Realpolitik in Global Diplomacy',
    personaIds: ['machiavelli', 'socrates'],
    lastMessage: 'The unexamined life is not worth living...',
    time: '3 days ago',
    createdAt: Date.now() - 259200000,
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
  setTurnDelay,
  triggerNextTurn,
  resetDebate,
  turns,
  submitUserInterjection,
  userProfile,
  setUserProfile,
  tokenStats,
  lastPayload,
  onPlayTurnVoice,
  currentlySpeakingTurnId,
  isMuted = false,
  onToggleMute,
  isSpeaking = false,
  selectedModel = 'meta-llama/llama-3.2-1b-instruct',
  onSelectModel,
  onBackToHistory,
  onSwitchGroup,
  onGroupCreated,
}) => {
  const [inputText, setInputText] = useState('');
  
  // Header inline title & motion editing state
  const [isEditingHeaderDetails, setIsEditingHeaderDetails] = useState(false);
  const [headerTitleInput, setHeaderTitleInput] = useState('');
  const [headerTopicInput, setHeaderTopicInput] = useState('');

  // Previous chats drawer state
  const [isChatsDrawerOpen, setIsChatsDrawerOpen] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupTitleInput, setEditingGroupTitleInput] = useState('');

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'engine' | 'pacing' | 'memory'>('profile');
  const [userNameInput, setUserNameInput] = useState(userProfile.name);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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

  const [savedGroups, setSavedGroups] = useState<SavedGroupItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('checko_saved_groups');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load saved groups from localStorage', e);
      }
    }
    return DEFAULT_PRESET_GROUPS;
  });

  const [groupTitle, setGroupTitle] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTitle = localStorage.getItem('checko_active_group_title');
        if (savedTitle && savedTitle.trim().length > 0) return savedTitle;
      } catch (e) {}
    }
    return 'Coffee with Einstein & Stephen';
  });

  // Sync last turn message to active saved group item
  useEffect(() => {
    if (turns.length > 0) {
      const lastTurn = turns[turns.length - 1];
      setSavedGroups((prev) => {
        const updated = prev.map((g) => {
          if (g.groupTitle === groupTitle || g.debateMotion === topic) {
            return {
              ...g,
              lastMessage: `${lastTurn.speakerName}: ${lastTurn.content.substring(0, 60)}...`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return g;
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });
    }
  }, [turns, groupTitle, topic]);

  // Handle saving header title & motion edits
  const handleSaveHeaderDetails = () => {
    const newTitle = headerTitleInput.trim();
    const newTopic = headerTopicInput.trim();

    const activeTitle = newTitle || groupTitle;
    if (newTitle) {
      setGroupTitle(newTitle);
    }
    if (newTopic && newTopic !== topic) {
      setTopic(newTopic);
    }

    setSavedGroups((prev) => {
      const updated = prev.map((g) => {
        if (g.groupTitle === groupTitle || g.debateMotion === topic) {
          return {
            ...g,
            groupTitle: activeTitle,
            debateMotion: newTopic || g.debateMotion,
          };
        }
        return g;
      });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
          if (newTitle) localStorage.setItem('checko_active_group_title', newTitle);
        } catch (e) {}
      }
      return updated;
    });

    setIsEditingHeaderDetails(false);
  };

  // Handle inline group title renaming inside Previous Chats drawer
  const handleSaveDrawerGroupRename = (groupId: string) => {
    const newTitle = editingGroupTitleInput.trim();
    if (newTitle) {
      setSavedGroups((prev) => {
        const updated = prev.map((g) => (g.id === groupId ? { ...g, groupTitle: newTitle } : g));
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });
      if (savedGroups.find((g) => g.id === groupId)?.groupTitle === groupTitle) {
        setGroupTitle(newTitle);
      }
    }
    setEditingGroupId(null);
  };

  // Delete a saved group chat
  const handleDeleteGroup = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    setSavedGroups((prev) => {
      const updated = prev.filter((g) => g.id !== groupId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  const handleCreateNewChat = () => {
    setIsNewGroupModalOpen(true);
    setIsChatsDrawerOpen(false);
  };

  const handleGroupCreatedFromModal = (
    newMotion: string,
    personaIds: string[],
    autoGroupName: string
  ) => {
    if (onGroupCreated) {
      onGroupCreated(newMotion, personaIds, autoGroupName);
      setIsEditingHeaderDetails(false);
      setIsChatsDrawerOpen(false);
      return;
    }

    onSelectPersonas(personaIds);
    setGroupTitle(autoGroupName);
    setTopic(newMotion);

    const newGroupItem: SavedGroupItem = {
      id: `group_${Date.now()}`,
      groupTitle: autoGroupName,
      debateMotion: newMotion,
      personaIds,
      lastMessage: `Group created. Topic: "${newMotion}"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    setSavedGroups((prev) => {
      const updated = [newGroupItem, ...prev.filter((g) => g.groupTitle !== autoGroupName)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
          localStorage.setItem('checko_active_group_title', autoGroupName);
        } catch (e) {}
      }
      return updated;
    });

    setIsEditingHeaderDetails(false);
    setIsChatsDrawerOpen(false);
  };

  const handleSelectGroup = (g: SavedGroupItem) => {
    if (onSwitchGroup) {
      onSwitchGroup(g);
      setIsChatsDrawerOpen(false);
      return;
    }

    setGroupTitle(g.groupTitle);
    setTopic(g.debateMotion);
    onSelectPersonas(g.personaIds);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('checko_active_group_title', g.groupTitle);
      } catch (e) {}
    }
    setIsChatsDrawerOpen(false);
  };

  const handleSaveUser = () => {
    if (userNameInput.trim()) {
      setUserProfile({ ...userProfile, name: userNameInput.trim() });
    }
    setShowSettingsModal(false);
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredGroups = savedGroups.filter(
    (g) =>
      g.groupTitle.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      g.debateMotion.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      g.lastMessage.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex-1 bg-[#0b141a] text-[#e9edef] flex flex-col overflow-hidden font-sans relative selection:bg-[#00a884] selection:text-white">
      {/* 1. Minimalist Header */}
      <header className="bg-[#111b21]/95 backdrop-blur-md border-b border-[#222d34]/70 px-4 py-3 flex items-center justify-between shrink-0 z-30 shadow-sm">
        {/* Left Section: Drawer Toggle, Group Avatar & Editable Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button
            onClick={() => {
              if (onBackToHistory) {
                onBackToHistory();
              } else {
                setIsChatsDrawerOpen(true);
              }
            }}
            className="p-2 bg-[#202c33]/80 hover:bg-[#2a3942] text-[#00a884] rounded-xl transition-all shrink-0 flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Back to Chat History & Arenas"
          >
            <ArrowLeft className="w-4 h-4 text-[#00a884]" />
            <span className="hidden sm:inline">Chats</span>
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00a884] to-teal-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            ☕
          </div>

          <div className="flex-1 min-w-0">
            {/* Group Name & Topic Header */}
            {!isEditingHeaderDetails ? (
              <div>
                <div className="flex items-center space-x-2">
                  <h2
                    onClick={() => {
                      setHeaderTitleInput(groupTitle);
                      setHeaderTopicInput(topic);
                      setIsEditingHeaderDetails(true);
                    }}
                    className="text-sm sm:text-base font-bold text-[#e9edef] truncate cursor-pointer hover:text-[#00a884] transition-colors flex items-center gap-1.5 group"
                    title="Click to edit group title & debate motion"
                  >
                    <span className="truncate">{groupTitle}</span>
                    <span className="p-1 rounded-md bg-[#202c33] group-hover:bg-[#00a884]/20 text-[#8696a0] group-hover:text-[#00a884] transition-all shrink-0">
                      <Edit2 className="w-3 h-3" />
                    </span>
                  </h2>
                </div>

                <div className="text-[11px] text-[#8696a0] truncate font-medium flex items-center gap-1">
                  {isGenerating && currentSpeaker ? (
                    <span className="text-[#00a884] font-semibold animate-pulse flex items-center gap-1">
                      <span>{currentSpeaker.avatarIcon || '💬'}</span>
                      <span>{currentSpeaker.name} is speaking...</span>
                    </span>
                  ) : (
                    <span className="truncate">
                      <strong className="text-purple-300/90 font-semibold">Motion:</strong> {topic}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Inline Editable Popover Card */
              <div className="bg-[#202c33] border border-[#00a884]/60 rounded-2xl p-3 shadow-2xl space-y-2.5 max-w-md w-full animate-in fade-in duration-150 z-40 relative">
                <div className="flex items-center justify-between text-xs font-bold text-[#00a884]">
                  <span className="flex items-center gap-1">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Group Details
                  </span>
                  <button
                    onClick={() => setIsEditingHeaderDetails(false)}
                    className="text-[#8696a0] hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <label className="text-[10px] text-[#8696a0] font-semibold block mb-1">Group Name:</label>
                  <input
                    type="text"
                    value={headerTitleInput}
                    onChange={(e) => setHeaderTitleInput(e.target.value)}
                    placeholder="Enter Group Name..."
                    className="w-full bg-[#111b21] border border-[#222d34] focus:border-[#00a884] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8696a0] font-semibold block mb-1">Debate Motion / Topic:</label>
                  <input
                    type="text"
                    value={headerTopicInput}
                    onChange={(e) => setHeaderTopicInput(e.target.value)}
                    placeholder="Enter Debate Motion..."
                    className="w-full bg-[#111b21] border border-[#222d34] focus:border-[#00a884] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveHeaderDetails()}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingHeaderDetails(false)}
                    className="px-3 py-1 bg-[#111b21] hover:bg-[#202c33] text-[#8696a0] text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHeaderDetails}
                    className="px-3.5 py-1 bg-[#00a884] hover:bg-teal-600 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Clean Compact Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCreateNewChat}
            className="px-3 py-1.5 bg-[#00a884] hover:bg-teal-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all shadow-sm"
            title="Create New Debate Chat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-xl transition-all border ${
                isMuted
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                  : isSpeaking
                  ? 'bg-[#00a884]/20 text-[#00a884] border-[#00a884]/50 animate-pulse'
                  : 'bg-[#202c33]/80 hover:bg-[#2a3942] text-[#8696a0] hover:text-white border-[#222d34]'
              }`}
              title={isMuted ? 'Unmute Audio Voice' : isSpeaking ? 'Mute Speaking Voice' : 'Mute Audio Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 bg-[#202c33]/80 hover:bg-[#2a3942] text-[#8696a0] hover:text-white rounded-xl transition-all border border-[#222d34]"
            title="Arena Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-[#202c33]/80 hover:bg-[#2a3942] text-[#8696a0] hover:text-white rounded-xl transition-all border border-[#222d34]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#00a884]" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Minimalist Group Members Bar */}
      <div className="bg-[#111b21]/70 border-b border-[#222d34]/50 px-4 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5 flex-1 scroll-smooth">
          <span className="text-[10px] text-[#8696a0] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Users className="w-3 h-3 text-[#00a884]" /> Members:
          </span>

          {activePersonas.map((p) => {
            const isSpeaking = currentSpeaker?.id === p.id && isGenerating;

            return (
              <div key={p.id} className="relative shrink-0 flex items-center">
                <div
                  className="px-2.5 py-1 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all border bg-[#202c33] text-white border-[#00a884]/60 shadow-sm"
                  style={{
                    boxShadow: isSpeaking ? `0 0 8px ${p.avatarColor}77` : undefined,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 overflow-hidden"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.avatarIcon || '👤'
                    )}
                  </span>
                  <span className="truncate max-w-[100px]">{p.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] shrink-0" />

                  {/* Allow removing member if group size > 2 */}
                  {activePersonas.length > 2 && (
                    <button
                      onClick={() => {
                        onSelectPersonas(activePersonas.filter((ap) => ap.id !== p.id).map((ap) => ap.id));
                      }}
                      className="ml-1 text-[#8696a0] hover:text-rose-400 p-0.5 rounded transition-colors"
                      title={`Remove ${p.name} from group`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {p.isCustom && onDeletePersona && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePersona(p.id);
                    }}
                    className="ml-1 p-1 text-[#8696a0] hover:text-rose-400 rounded-lg transition-colors"
                    title="Delete custom persona"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* 3. Minimalist Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0b141a] relative scroll-smooth">
        {/* System Notice Pill */}
        <div className="flex justify-center my-1">
          <div className="bg-[#182229]/80 border border-[#222d34]/60 text-[#8696a0] text-[10px] px-3 py-1 rounded-full shadow-sm max-w-sm text-center flex items-center justify-center space-x-1.5">
            <Lock className="w-3 h-3 text-[#00a884] shrink-0" />
            <span>AI historical persona debate arena. Low token state mode active.</span>
          </div>
        </div>

        {/* Empty State */}
        {turns.length === 0 && (
          <div className="text-center py-16 px-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#111b21] border border-[#222d34] flex items-center justify-center mx-auto mb-3 text-xl shadow-inner">
              ☕
            </div>
            <h3 className="text-sm font-bold text-[#e9edef] mb-1">
              Ready to begin debate
            </h3>
            <p className="text-xs text-[#8696a0] leading-relaxed mb-4">
              Topic: <strong className="text-[#00a884]">"{topic}"</strong>
              <br />
              Click <strong className="text-white">"Next Speaker ➔"</strong> below to prompt the first persona to speak!
            </p>
          </div>
        )}

        {/* Conversation Turns */}
        {turns.map((turn) => {
          const isUser = turn.speakerId === 'user';
          const speakerPersona = activePersonas.find((p) => p.id === turn.speakerId);
          const color = speakerPersona?.avatarColor || '#00a884';

          if (isUser) {
            return (
              <div key={turn.id} className="flex flex-col items-end my-1.5">
                <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[85%] sm:max-w-[70%] shadow-md border border-[#005c4b]/40 relative group">
                  <div className="text-[10px] font-bold text-[#aebac1] mb-0.5">
                    You ({userProfile.name})
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {turn.content}
                  </p>
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-[#8696a0]">
                    <span>{formatTimestamp(turn.timestamp)}</span>
                    <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={turn.id} className="flex items-start space-x-2.5 my-1.5 max-w-[90%] sm:max-w-[78%]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow border border-[#222d34] mt-0.5 overflow-hidden"
                style={{ backgroundColor: color }}
              >
                {speakerPersona?.avatarImage ? (
                  <img src={speakerPersona.avatarImage} alt={turn.speakerName} className="w-full h-full object-cover" />
                ) : (
                  speakerPersona?.avatarIcon || '🎭'
                )}
              </div>

              <div className="bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-none px-3.5 py-2 shadow border border-[#2a3942]/60 relative flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-bold truncate" style={{ color: color }}>
                    {turn.speakerName}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {onPlayTurnVoice && (
                      <button
                        onClick={() => onPlayTurnVoice(turn)}
                        title="Play Voice Audio"
                        className={`p-1 rounded hover:bg-[#2a3942] transition-colors ${
                          currentlySpeakingTurnId === turn.id
                            ? 'text-[#00a884] animate-pulse'
                            : 'text-[#8696a0] hover:text-[#e9edef]'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                    {speakerPersona?.title && (
                      <span className="text-[9px] text-[#8696a0] truncate font-medium hidden sm:inline">
                        {speakerPersona.title}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-[#d1d7db]">
                  {turn.content}
                </p>

                <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-[#8696a0]">
                  <span>{formatTimestamp(turn.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isGenerating && currentSpeaker && (
          <div className="flex items-center space-x-2.5 my-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow border border-[#222d34] overflow-hidden"
              style={{ backgroundColor: currentSpeaker.avatarColor }}
            >
              {currentSpeaker.avatarImage ? (
                <img src={currentSpeaker.avatarImage} alt={currentSpeaker.name} className="w-full h-full object-cover" />
              ) : (
                currentSpeaker.avatarIcon || '💬'
              )}
            </div>
            <div className="bg-[#202c33] border border-[#2a3942]/60 rounded-2xl rounded-tl-none px-3.5 py-2 shadow flex items-center space-x-2">
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

      {/* 4. Minimalist Bottom Footer Control Bar */}
      <footer className="bg-[#202c33]/90 border-t border-[#2a3942]/60 p-2.5 shrink-0 z-30">
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePause}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              isPaused
                ? 'bg-[#111b21] text-[#00a884] border-[#00a884]/40 hover:bg-[#2a3942]'
                : 'bg-rose-950/60 text-rose-300 border-rose-800/60 hover:bg-rose-900'
            }`}
            title={isPaused ? 'Resume Auto Debate' : 'Pause Auto Debate'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? 'Auto Play' : `Pause (${timerSeconds}s)`}</span>
          </button>

          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                isMuted
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 hover:bg-rose-900'
                  : isSpeaking
                  ? 'bg-[#00a884]/20 text-[#00a884] border-[#00a884]/40 animate-pulse'
                  : 'bg-[#111b21] text-[#8696a0] hover:text-white border-[#222d34]'
              }`}
              title={isMuted ? 'Unmute Audio Voice' : 'Mute Audio Voice'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#00a884]" />
              )}
              <span className="hidden md:inline">{isMuted ? 'Muted' : isSpeaking ? 'Speaking...' : 'Mute'}</span>
            </button>
          )}

          <button
            onClick={triggerNextTurn}
            disabled={isGenerating}
            className="px-3 py-2 bg-[#00a884] hover:bg-teal-600 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 disabled:opacity-40 shrink-0"
            title="Prompt next speaker turn"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Next Speaker ➔</span>
          </button>

          <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2 min-w-0">
            <div className="flex-1 bg-[#2a3942]/80 rounded-xl px-3.5 py-1.5 flex items-center space-x-2 border border-[#222d34] focus-within:border-[#00a884]">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message as ${userProfile.name}...`}
                className="w-full bg-transparent text-white placeholder-[#8696a0] text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="w-8 h-8 rounded-xl bg-[#00a884] hover:bg-teal-600 text-white flex items-center justify-center shadow disabled:opacity-40 transition-all shrink-0"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </footer>

      {/* 5. Consolidated Arena Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111b21] border border-[#222d34] rounded-3xl p-5 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3 border-b border-[#222d34] pb-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#00a884]" /> Arena & Chat Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-[#8696a0] hover:text-white bg-[#202c33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center bg-[#202c33] p-1 rounded-xl border border-[#222d34] mb-3 text-xs font-medium">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'engine', label: 'AI Model' },
                { id: 'pacing', label: 'Speed' },
                { id: 'memory', label: 'Tokens' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSettingsTab(tab.id as any)}
                  className={`flex-1 py-1 rounded-lg text-center transition-all ${
                    activeSettingsTab === tab.id
                      ? 'bg-[#00a884] text-white shadow-sm font-bold'
                      : 'text-[#8696a0] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSettingsTab === 'profile' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8696a0] font-medium mb-1">
                    Display Name:
                  </label>
                  <input
                    type="text"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    className="w-full bg-[#202c33] border border-[#222d34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00a884]"
                    placeholder="Your name..."
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveUser}
                    className="px-4 py-1.5 bg-[#00a884] hover:bg-teal-600 text-white font-bold rounded-xl shadow transition-colors"
                  >
                    Save Name
                  </button>
                </div>
              </div>
            )}

            {activeSettingsTab === 'engine' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8696a0] font-medium mb-1">
                    Active Model Engine:
                  </label>
                  {onSelectModel && (
                    <ModelSwitcher
                      selectedModel={selectedModel}
                      onSelectModel={onSelectModel}
                    />
                  )}
                </div>

                <div className="bg-[#202c33] p-2.5 rounded-xl border border-[#222d34] space-y-1.5">
                  <span className="text-[#8696a0] font-bold block text-[10px] uppercase">
                    Detected API Keys:
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#d1d7db]">OpenRouter API:</span>
                    {getOpenRouterApiKey() ? (
                      <span className="text-emerald-400 font-semibold">Active (.env)</span>
                    ) : (
                      <span className="text-[#8696a0]">Not Set</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#111b21]">
                    <span className="text-[#d1d7db]">Google Gemini API:</span>
                    {getStoredApiKey() ? (
                      <span className="text-emerald-400 font-semibold">Active (.env)</span>
                    ) : (
                      <span className="text-[#8696a0]">Not Set</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSettingsTab === 'pacing' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8696a0] font-medium mb-2">
                    Turn Delay: <strong className="text-[#00a884]">{turnDelay}s</strong>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 5, 8, 12].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setTurnDelay && setTurnDelay(sec)}
                        className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          turnDelay === sec
                            ? 'bg-[#00a884] border-[#00a884] text-white shadow'
                            : 'bg-[#202c33] border-[#222d34] text-[#d1d7db] hover:bg-[#2a3942]'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSettingsTab === 'memory' && (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#202c33] p-2 rounded-xl border border-[#222d34] text-center">
                    <span className="text-[9px] text-[#8696a0] block font-bold">Prompt</span>
                    <span className="text-sm font-bold text-white">{tokenStats.totalPromptTokens}</span>
                  </div>
                  <div className="bg-[#202c33] p-2 rounded-xl border border-[#222d34] text-center">
                    <span className="text-[9px] text-[#8696a0] block font-bold">Response</span>
                    <span className="text-sm font-bold text-white">{tokenStats.totalResponseTokens}</span>
                  </div>
                  <div className="bg-[#202c33] p-2 rounded-xl border border-[#222d34] text-center">
                    <span className="text-[9px] text-[#8696a0] block font-bold">Saved</span>
                    <span className="text-sm font-bold text-[#00a884]">{tokenStats.estimatedTokensSaved}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#222d34] flex items-center justify-between">
              <button
                onClick={() => {
                  resetDebate();
                  setShowSettingsModal(false);
                }}
                className="px-3 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear Turns
              </button>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 bg-[#202c33] hover:bg-[#2a3942] text-white font-semibold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. New Group Creation Popup Modal */}
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        allPersonas={allPersonas}
        onCreateGroup={handleGroupCreatedFromModal}
      />

      {/* 7. Minimalist Previous Group Chats Drawer Overlay */}
      {isChatsDrawerOpen && (
        <div className="absolute inset-0 z-50 bg-[#111b21] flex flex-col font-sans animate-in fade-in duration-150">
          <div className="bg-[#202c33] border-b border-[#222d34] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsChatsDrawerOpen(false)}
                className="p-1 rounded-lg text-[#00a884] hover:bg-[#2a3942] transition-colors"
                title="Back to Chat"
              >
                <ArrowLeft className="w-5 h-5 text-[#00a884]" />
              </button>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00a884]" /> Previous Group Chats
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onOpenCharacterModal();
                  setIsChatsDrawerOpen(false);
                }}
                className="px-3 py-1.5 bg-[#202c33] hover:bg-[#2a3942] text-[#00a884] border border-[#00a884]/40 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                title="Create Custom Persona Character"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#00a884]" />
                <span>+ Character</span>
              </button>
              <button
                onClick={handleCreateNewChat}
                className="px-3 py-1.5 bg-[#00a884] text-white text-xs font-bold rounded-xl shadow hover:bg-teal-600 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> New Group Chat
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-[#222d34] bg-[#111b21]">
            <div className="bg-[#202c33] rounded-xl px-3 py-1.5 flex items-center space-x-2 border border-[#222d34]">
              <Search className="w-4 h-4 text-[#8696a0]" />
              <input
                type="text"
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                placeholder="Search chats by title or topic..."
                className="w-full bg-transparent text-white text-xs placeholder-[#8696a0] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]">
            {filteredGroups.map((g) => {
              const isActive = g.groupTitle === groupTitle || g.debateMotion === topic;
              const memberPersonas = g.personaIds
                .map((id) => allPersonas.find((p) => p.id === id))
                .filter(Boolean) as Persona[];

              const isEditing = editingGroupId === g.id;

              return (
                <div
                  key={g.id}
                  className={`w-full p-3.5 flex items-center space-x-3 text-left transition-colors ${
                    isActive ? 'bg-[#202c33] border-l-4 border-[#00a884]' : 'hover:bg-[#202c33]/50'
                  }`}
                >
                  <div
                    onClick={() => !isEditing && handleSelectGroup(g)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00a884] to-teal-800 flex items-center justify-center text-white text-sm font-bold shadow border border-[#111b21] cursor-pointer shrink-0"
                  >
                    ☕
                  </div>

                  <div className="flex-1 min-w-0">
                    {!isEditing ? (
                      <>
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4
                            onClick={() => handleSelectGroup(g)}
                            className="text-xs sm:text-sm font-bold text-[#e9edef] truncate cursor-pointer hover:text-[#00a884] transition-colors"
                          >
                            {g.groupTitle}
                          </h4>
                          <span className="text-[10px] text-[#8696a0] shrink-0 font-medium">{g.time}</span>
                        </div>

                        <div className="text-[11px] text-purple-300/90 font-medium truncate mb-0.5">
                          Motion: {g.debateMotion}
                        </div>

                        <div className="flex items-center space-x-1.5 text-[10px] text-[#8696a0] truncate">
                          <span className="font-semibold text-[#00a884]">
                            {memberPersonas.map((p) => p.name).join(', ')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2 my-1">
                        <input
                          type="text"
                          value={editingGroupTitleInput}
                          onChange={(e) => setEditingGroupTitleInput(e.target.value)}
                          className="bg-[#111b21] border border-[#00a884] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none flex-1"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveDrawerGroupRename(g.id)}
                        />
                        <button
                          onClick={() => handleSaveDrawerGroupRename(g.id)}
                          className="p-1.5 bg-[#00a884] text-white rounded-lg hover:bg-teal-600"
                          title="Save title"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingGroupId(null)}
                          className="p-1.5 bg-[#111b21] text-[#8696a0] hover:text-white rounded-lg"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions for each group item: Rename & Delete */}
                  {!isEditing && (
                    <div className="flex items-center space-x-1 shrink-0 opacity-80 hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGroupId(g.id);
                          setEditingGroupTitleInput(g.groupTitle);
                        }}
                        className="p-1.5 text-[#8696a0] hover:text-[#00a884] hover:bg-[#111b21] rounded-lg transition-colors"
                        title="Rename Group Title"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteGroup(e, g.id)}
                        className="p-1.5 text-[#8696a0] hover:text-rose-400 hover:bg-[#111b21] rounded-lg transition-colors"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
