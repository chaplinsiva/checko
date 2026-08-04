'use client';

import React, { useState } from 'react';
import { Persona } from '@/types/debate';
import { saveCustomPersona } from '@/lib/personas';
import { UserPlus, X, Sparkles } from 'lucide-react';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonaCreated: (newPersona: Persona) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  onPersonaCreated,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [tone, setTone] = useState('');
  const [defaultStance, setDefaultStance] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');

  if (!isOpen) return null;

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
      avatarIcon: '✨',
    });

    onPersonaCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-rose-400" /> Create Custom Persona
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Character Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marcus Aurelius"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Title / Role:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stoic Roman Emperor"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Who Is He / Persona Bio:</label>
            <textarea
              required
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief background, core philosophy, and historical context..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Tone & Speech Style:</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Calm, philosophical, firm"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Avatar Color:</label>
              <input
                type="color"
                value={avatarColor}
                onChange={(e) => setAvatarColor(e.target.value)}
                className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Default Worldview / Stance:</label>
            <input
              type="text"
              value={defaultStance}
              onChange={(e) => setDefaultStance(e.target.value)}
              placeholder="e.g. Inner virtue and reason govern human destiny..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20"
            >
              Add Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
