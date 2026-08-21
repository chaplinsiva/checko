'use client';

import React, { useState } from 'react';
import { Persona } from '@/types/debate';
import { SavedGroupItem } from './WhatsAppGroupChat';
import {
  ArrowLeft,
  Search,
  Plus,
  MessageSquare,
  Sparkles,
  Users,
  Trash2,
  Edit2,
  Check,
  X,
  Play,
  Bot,
  Compass,
  Flame,
  ChevronRight,
} from 'lucide-react';

interface ChatHistoryHubProps {
  savedGroups: SavedGroupItem[];
  allPersonas: Persona[];
  activeGroupTitle: string;
  onSelectGroup: (group: SavedGroupItem) => void;
  onCreateNewChat: () => void;
  onDeleteGroup: (groupId: string) => void;
  onRenameGroup: (groupId: string, newTitle: string) => void;
  onBackToLanding: () => void;
  onOpenCharacterModal: () => void;
}

export const ChatHistoryHub: React.FC<ChatHistoryHubProps> = ({
  savedGroups,
  allPersonas,
  activeGroupTitle,
  onSelectGroup,
  onCreateNewChat,
  onDeleteGroup,
  onRenameGroup,
  onBackToLanding,
  onOpenCharacterModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingTitleInput, setEditingTitleInput] = useState('');

  const filteredGroups = savedGroups.filter(
    (g) =>
      g.groupTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.debateMotion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartRename = (e: React.MouseEvent, g: SavedGroupItem) => {
    e.stopPropagation();
    setEditingGroupId(g.id);
    setEditingTitleInput(g.groupTitle);
  };

  const handleSaveRename = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (editingTitleInput.trim()) {
      onRenameGroup(groupId, editingTitleInput.trim());
    }
    setEditingGroupId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGroupId(null);
  };

  const handleDelete = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat session?')) {
      onDeleteGroup(groupId);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#0b141a] text-[#e9edef] flex flex-col overflow-hidden font-sans selection:bg-[#00a884] selection:text-white">
      {/* Top Header */}
      <header className="bg-[#111b21] border-b border-[#222d34] px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLanding}
            className="p-2 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-[#00a884] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4 text-[#00a884]" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-6 w-[1px] bg-[#222d34]" />

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-[#00a884]/40 flex items-center justify-center shadow-sm">
              <img src="/logo.svg" alt="Checko Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Chat History & Arenas
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30 font-semibold">
                  {savedGroups.length} Chats
                </span>
              </h1>
              <p className="text-[11px] text-[#8696a0] hidden sm:block">Select a debate to enter or create a new room</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenCharacterModal}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-[#8696a0] hover:text-white border border-[#2a3942] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-[#00a884]" />
            <span className="hidden md:inline">Personas</span>
          </button>

          <button
            onClick={onCreateNewChat}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#00a884] hover:bg-[#028b6d] text-white transition-all shadow-md shadow-[#00a884]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8696a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chats by title, motion topic, or dialogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111b21] border border-[#222d34] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#8696a0] focus:outline-none focus:border-[#00a884] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8696a0] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Launch & Create CTA Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111b21] via-[#16222b] to-[#111b21] border border-[#00a884]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00a884]/20 border border-[#00a884]/40 flex items-center justify-center text-2xl shrink-0">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Start a Brand New Multi-Persona Arena
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00a884]/20 text-[#00a884] font-semibold">
                  Customizable
                </span>
              </h2>
              <p className="text-xs text-[#8696a0] mt-0.5">
                Pick your debaters, set the topic or motion, and launch real-time AI arguments.
              </p>
            </div>
          </div>
          <button
            onClick={onCreateNewChat}
            className="px-4 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#028b6d] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#00a884]/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Debate Group</span>
          </button>
        </div>

        {/* Saved Groups List / Grid */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8696a0] flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#00a884]" />
              <span>Available Chat Arenas ({filteredGroups.length})</span>
            </h3>
            {searchQuery && (
              <span className="text-xs text-[#8696a0]">
                Filtering by "{searchQuery}"
              </span>
            )}
          </div>

          {filteredGroups.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[#111b21] border border-[#222d34] text-center">
              <div className="w-12 h-12 rounded-full bg-[#202c33] text-[#8696a0] flex items-center justify-center mx-auto mb-3 text-xl">
                🔍
              </div>
              <p className="text-sm font-semibold text-white mb-1">No debate sessions found</p>
              <p className="text-xs text-[#8696a0] mb-4">Try a different search query or create a new debate group.</p>
              <button
                onClick={onCreateNewChat}
                className="px-4 py-2 rounded-xl bg-[#00a884] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Chat</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroups.map((group) => {
                const isActive = group.groupTitle === activeGroupTitle;
                const groupPersonas = group.personaIds
                  .map((id) => allPersonas.find((p) => p.id === id))
                  .filter(Boolean) as Persona[];

                return (
                  <div
                    key={group.id}
                    onClick={() => onSelectGroup(group)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                      isActive
                        ? 'bg-[#182229] border-[#00a884] shadow-lg shadow-[#00a884]/10'
                        : 'bg-[#111b21] border-[#222d34] hover:border-[#00a884]/50 hover:bg-[#152026]'
                    }`}
                  >
                    {/* Active Accent Indicator */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#00a884]" />
                    )}

                    <div>
                      {/* Card Header: Title & Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00a884] to-teal-700 flex items-center justify-center text-white text-base shrink-0 shadow-sm">
                            ☕
                          </div>

                          <div className="flex-1 min-w-0">
                            {editingGroupId === group.id ? (
                              <div
                                className="flex items-center space-x-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={editingTitleInput}
                                  onChange={(e) => setEditingTitleInput(e.target.value)}
                                  className="w-full bg-[#202c33] text-white text-xs font-bold px-2 py-1 rounded border border-[#00a884] focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={(e) => handleSaveRename(e, group.id)}
                                  className="p-1 rounded bg-[#00a884] text-white hover:bg-[#028b6d]"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={handleCancelRename}
                                  className="p-1 rounded bg-[#202c33] text-[#8696a0] hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <h4 className="font-bold text-sm text-white truncate group-hover:text-[#00a884] transition-colors flex items-center gap-1.5">
                                <span className="truncate">{group.groupTitle}</span>
                                {isActive && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00a884]/20 text-[#00a884] font-semibold">
                                    Active
                                  </span>
                                )}
                              </h4>
                            )}
                            <span className="text-[10px] text-[#8696a0]">{group.time}</span>
                          </div>
                        </div>

                        {/* Card Top Right Action Icons */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={(e) => handleStartRename(e, group)}
                            className="p-1.5 rounded-lg text-[#8696a0] hover:text-white hover:bg-[#202c33] transition-all"
                            title="Rename Chat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, group.id)}
                            className="p-1.5 rounded-lg text-[#8696a0] hover:text-red-400 hover:bg-red-950/40 transition-all"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Debate Motion / Topic */}
                      <div className="bg-[#202c33]/40 p-2.5 rounded-xl border border-[#2a3942]/60 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                          Debate Motion
                        </span>
                        <p className="text-xs text-[#d1d7db] line-clamp-2 leading-relaxed">
                          {group.debateMotion}
                        </p>
                      </div>

                      {/* Last Message Preview */}
                      <div className="text-xs text-[#8696a0] line-clamp-1 mb-3 italic">
                        "{group.lastMessage}"
                      </div>
                    </div>

                    {/* Card Footer: Personas List & Enter Arena Button */}
                    <div className="pt-3 border-t border-[#222d34] flex items-center justify-between gap-2 mt-auto">
                      <div className="flex items-center space-x-1.5 overflow-hidden">
                        {groupPersonas.slice(0, 4).map((p) => (
                          <div
                            key={p.id}
                            className="w-6 h-6 rounded-full bg-[#202c33] border border-[#2a3942] flex items-center justify-center text-xs shrink-0"
                            title={p.name}
                          >
                            {p.avatarIcon || '👤'}
                          </div>
                        ))}
                        {groupPersonas.length > 4 && (
                          <span className="text-[10px] text-[#8696a0] font-semibold pl-1">
                            +{groupPersonas.length - 4}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectGroup(group)}
                        className="px-3 py-1.5 rounded-lg bg-[#202c33] group-hover:bg-[#00a884] text-[#8696a0] group-hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Enter Chat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
