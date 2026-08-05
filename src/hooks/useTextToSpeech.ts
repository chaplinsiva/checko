'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Persona } from '@/types/debate';

export interface UseTextToSpeechOptions {
  autoSpeak?: boolean;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentlySpeakingTurnId, setCurrentlySpeakingTurnId] = useState<string | null>(null);
  const [currentlySpeakingSpeakerId, setCurrentlySpeakingSpeakerId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis & Load Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (synthRef.current) {
          const availVoices = synthRef.current.getVoices();
          setVoices(availVoices);
        }
      };

      updateVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      // Check saved mute state
      try {
        const savedMute = localStorage.getItem('checko_tts_muted');
        if (savedMute !== null) {
          setIsMuted(savedMute === 'true');
        }
      } catch (e) {
        console.error('Failed to read checko_tts_muted', e);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
        setCurrentlySpeakingTurnId(null);
        setCurrentlySpeakingSpeakerId(null);
      }
      try {
        localStorage.setItem('checko_tts_muted', String(next));
      } catch (e) {
        console.error('Failed to save checko_tts_muted', e);
      }
      return next;
    });
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentlySpeakingTurnId(null);
      setCurrentlySpeakingSpeakerId(null);
    }
  }, []);

  // Voice Selection Helper based on persona voice profile & browser voices
  const findBestVoice = useCallback(
    (persona?: Persona): SpeechSynthesisVoice | null => {
      if (!voices.length) return null;
      const vp = persona?.voiceProfile;
      if (!vp) return voices[0] || null;

      // Filter by language first if specified
      const langVoices = vp.lang
        ? voices.filter((v) => v.lang.toLowerCase().includes(vp.lang!.toLowerCase()))
        : voices;
      const candidates = langVoices.length > 0 ? langVoices : voices;

      // Filter by gender hint or name substring
      if (vp.genderHint) {
        const genderMatch = candidates.find(
          (v) =>
            v.name.toLowerCase().includes(vp.genderHint!) ||
            v.name.toLowerCase().includes(vp.genderHint === 'male' ? 'david' : 'zira') ||
            v.name.toLowerCase().includes(vp.genderHint === 'male' ? 'guy' : 'jenny')
        );
        if (genderMatch) return genderMatch;
      }

      return candidates[0] || voices[0];
    },
    [voices]
  );

  // Clean raw AI response (strip phase tags, markdown stars, action notes)
  const cleanSpeechText = (rawText: string): string => {
    return rawText
      .replace(/\[(GREETING|STANCE|DEBATE)\]/gi, '')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speak = useCallback(
    (text: string, persona?: Persona, turnId?: string) => {
      if (isMuted || !isSupported || !synthRef.current) return;

      const cleanedText = cleanSpeechText(text);
      if (!cleanedText) return;

      // Stop current speech before starting new turn
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const voice = findBestVoice(persona);

      if (voice) {
        utterance.voice = voice;
      }

      if (persona?.voiceProfile) {
        utterance.pitch = persona.voiceProfile.pitch ?? 1.0;
        utterance.rate = persona.voiceProfile.rate ?? 1.0;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (turnId) setCurrentlySpeakingTurnId(turnId);
        if (persona) setCurrentlySpeakingSpeakerId(persona.id);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingTurnId(null);
        setCurrentlySpeakingSpeakerId(null);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error event', e);
        setIsSpeaking(false);
        setCurrentlySpeakingTurnId(null);
        setCurrentlySpeakingSpeakerId(null);
      };

      synthRef.current.speak(utterance);
    },
    [isMuted, isSupported, findBestVoice]
  );

  return {
    isSupported,
    isSpeaking,
    currentlySpeakingTurnId,
    currentlySpeakingSpeakerId,
    isMuted,
    toggleMute,
    speak,
    stop,
    voices,
  };
}
