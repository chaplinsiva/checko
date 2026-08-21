'use client';

import React, { useState, useEffect } from 'react';
import { useDebateEngine } from '@/hooks/useDebateEngine';
import { BUILTIN_PERSONAS, getAllPersonas, deleteCustomPersona } from '@/lib/personas';
import { WhatsAppGroupChat, SavedGroupItem, DEFAULT_PRESET_GROUPS } from '@/components/WhatsAppGroupChat';
import { LandingPage } from '@/components/LandingPage';
import { ChatHistoryHub } from '@/components/ChatHistoryHub';
import { CharacterModal } from '@/components/CharacterModal';
import { NewGroupModal } from '@/components/NewGroupModal';
import { Persona } from '@/types/debate';

export type AppView = 'landing' | 'history' | 'chat';

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [allPersonas, setAllPersonas] = useState<Persona[]>(BUILTIN_PERSONAS);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState<boolean>(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState<boolean>(false);

  // Saved group items
  const [savedGroups, setSavedGroups] = useState<SavedGroupItem[]>(DEFAULT_PRESET_GROUPS);
  const [activeGroupTitle, setActiveGroupTitle] = useState<string>('Coffee with Einstein & Stephen');

  // Sync custom personas and saved groups from local storage after client hydration
  useEffect(() => {
    setAllPersonas(getAllPersonas());

    if (typeof window !== 'undefined') {
      try {
        const storedGroups = localStorage.getItem('checko_saved_groups');
        if (storedGroups) {
          const parsed = JSON.parse(storedGroups);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedGroups(parsed);
          }
        }

        const storedTitle = localStorage.getItem('checko_active_group_title');
        if (storedTitle && storedTitle.trim().length > 0) {
          setActiveGroupTitle(storedTitle);
        }
      } catch (e) {
        console.error('Failed to load initial data from localStorage', e);
      }
    }
  }, []);

  const engine = useDebateEngine({
    initialTopic: 'Is backward time travel truly possible?',
    initialMode: 'group',
    initialPersonaIds: ['einstein', 'hawking', 'buddha', 'chaplin'],
    allPersonas,
  });

  const handlePersonaCreated = (newPersona: Persona) => {
    const updated = getAllPersonas();
    setAllPersonas(updated);
    engine.setActivePersonaIds([...engine.activePersonaIds, newPersona.id]);
  };

  const handleDeletePersona = (personaId: string) => {
    deleteCustomPersona(personaId);
    const updated = getAllPersonas();
    setAllPersonas(updated);
    if (engine.activePersonaIds.includes(personaId)) {
      const remaining = engine.activePersonaIds.filter((id) => id !== personaId);
      engine.setActivePersonaIds(remaining.length > 0 ? remaining : ['chaplin']);
    }
  };

  const handleSelectGroup = (g: SavedGroupItem) => {
    setActiveGroupTitle(g.groupTitle);
    engine.switchGroup(g.id, g.debateMotion, g.personaIds);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('checko_active_group_title', g.groupTitle);
        localStorage.setItem('checko_active_group_id', g.id);
      } catch (e) {}
    }

    setCurrentView('chat');
  };

  const handleGroupCreatedFromModal = (
    newMotion: string,
    personaIds: string[],
    autoGroupName: string
  ) => {
    const newGroupId = `group_${Date.now()}`;
    setActiveGroupTitle(autoGroupName);
    engine.switchGroup(newGroupId, newMotion, personaIds);

    const newGroupItem: SavedGroupItem = {
      id: newGroupId,
      groupTitle: autoGroupName,
      debateMotion: newMotion,
      personaIds,
      lastMessage: `Group created. Motion: "${newMotion}"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    setSavedGroups((prev) => {
      const updated = [newGroupItem, ...prev.filter((g) => g.groupTitle !== autoGroupName)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
          localStorage.setItem('checko_active_group_title', autoGroupName);
          localStorage.setItem('checko_active_group_id', newGroupId);
        } catch (e) {}
      }
      return updated;
    });

    setIsNewGroupModalOpen(false);
    setCurrentView('chat');
  };

  const handleDeleteGroup = (groupId: string) => {
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

  const handleRenameGroup = (groupId: string, newTitle: string) => {
    setSavedGroups((prev) => {
      const updated = prev.map((g) => (g.id === groupId ? { ...g, groupTitle: newTitle } : g));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('checko_saved_groups', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    if (savedGroups.find((g) => g.id === groupId)?.groupTitle === activeGroupTitle) {
      setActiveGroupTitle(newTitle);
    }
  };

  return (
    <main className="h-screen w-screen bg-[#0b141a] text-slate-100 flex flex-col overflow-hidden font-sans selection:bg-[#00a884] selection:text-white">
      {/* 1. Landing Page View */}
      {currentView === 'landing' && (
        <LandingPage
          onEnterChatHub={() => setCurrentView('history')}
          onCreateNewChat={() => setIsNewGroupModalOpen(true)}
          onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
          allPersonas={allPersonas}
          savedGroupsCount={savedGroups.length}
        />
      )}

      {/* 2. Chat History & Create Hub View */}
      {currentView === 'history' && (
        <ChatHistoryHub
          savedGroups={savedGroups}
          allPersonas={allPersonas}
          activeGroupTitle={activeGroupTitle}
          onSelectGroup={handleSelectGroup}
          onCreateNewChat={() => setIsNewGroupModalOpen(true)}
          onDeleteGroup={handleDeleteGroup}
          onRenameGroup={handleRenameGroup}
          onBackToLanding={() => setCurrentView('landing')}
          onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
        />
      )}

      {/* 3. Active WhatsApp-Style Chat Arena View */}
      {currentView === 'chat' && (
        <div className="w-full h-full flex-1 flex flex-col">
          <WhatsAppGroupChat
            topic={engine.topic}
            setTopic={engine.setTopic}
            mode={engine.mode}
            setMode={engine.setMode}
            activePersonas={engine.activePersonas}
            allPersonas={allPersonas}
            onSelectPersonas={engine.setActivePersonaIds}
            onDeletePersona={handleDeletePersona}
            onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
            currentSpeaker={engine.currentSpeaker}
            isGenerating={engine.isGenerating}
            isPaused={engine.isPaused}
            togglePause={engine.togglePause}
            timerSeconds={engine.timerSeconds}
            turnDelay={engine.turnDelay}
            setTurnDelay={engine.setTurnDelay}
            triggerNextTurn={engine.triggerNextTurn}
            resetDebate={engine.resetDebate}
            turns={engine.turns}
            submitUserInterjection={engine.submitUserInterjection}
            userProfile={engine.userProfile}
            setUserProfile={engine.setUserProfile}
            tokenStats={engine.tokenStats}
            lastPayload={engine.lastPayload}
            onPlayTurnVoice={engine.playTurnVoice}
            currentlySpeakingTurnId={engine.tts.currentlySpeakingTurnId}
            isMuted={engine.tts.isMuted}
            onToggleMute={engine.tts.toggleMute}
            isSpeaking={engine.tts.isSpeaking}
            selectedModel={engine.selectedModel}
            onSelectModel={engine.setSelectedModel}
            onBackToHistory={() => setCurrentView('history')}
            onSwitchGroup={handleSelectGroup}
            onGroupCreated={handleGroupCreatedFromModal}
          />
        </div>
      )}

      {/* Character Modal (Accessible across views) */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onPersonaCreated={handlePersonaCreated}
      />

      {/* New Group Creation Modal (Accessible across views) */}
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        allPersonas={allPersonas}
        onCreateGroup={handleGroupCreatedFromModal}
        onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
      />
    </main>
  );
}
