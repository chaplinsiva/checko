'use client';

import React, { useState, useEffect } from 'react';
import { useDebateEngine } from '@/hooks/useDebateEngine';
import { BUILTIN_PERSONAS, getAllPersonas, deleteCustomPersona } from '@/lib/personas';
import { WhatsAppGroupChat } from '@/components/WhatsAppGroupChat';
import { CharacterModal } from '@/components/CharacterModal';
import { Persona } from '@/types/debate';

export default function Home() {
  const [allPersonas, setAllPersonas] = useState<Persona[]>(BUILTIN_PERSONAS);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState<boolean>(false);

  // Sync custom personas from local storage after client hydration
  useEffect(() => {
    setAllPersonas(getAllPersonas());
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

  return (
    <main className="h-screen w-screen bg-[#0b141a] text-slate-100 flex flex-col overflow-hidden font-sans selection:bg-[#00a884] selection:text-white">
      {/* WhatsApp Group Chat UI Main View */}
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
        />
      </div>

      {/* Custom Character Creator Modal */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onPersonaCreated={handlePersonaCreated}
      />
    </main>
  );
}

