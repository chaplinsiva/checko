// @vitest-environment happy-dom
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeAll, beforeEach, vi } from 'vitest';
import { useTextToSpeech } from '../useTextToSpeech';
import { Persona } from '@/types/debate';

describe('useTextToSpeech Hook', () => {
  const mockPersona: Persona = {
    id: 'chaplin',
    name: 'Charlie Chaplin',
    title: 'The Great Dictator',
    bio: 'Satirist and film pioneer.',
    tone: 'Witty',
    defaultStance: 'Humanity over machines',
    avatarColor: '#E11D48',
    voiceProfile: { pitch: 1.15, rate: 1.05, lang: 'en-GB', genderHint: 'male' },
  };

  const mockUtterance = {
    text: '',
    pitch: 1.0,
    rate: 1.0,
    voice: null as any,
    onstart: null as any,
    onend: null as any,
    onerror: null as any,
  };

  const mockSpeechSynthesis = {
    speak: vi.fn((utt: any) => {
      if (utt.onstart) utt.onstart();
    }),
    cancel: vi.fn(),
    getVoices: vi.fn(() => [
      { name: 'Google UK English Male', lang: 'en-GB' },
      { name: 'Google US English', lang: 'en-US' },
    ]),
    onvoiceschanged: null,
  };

  beforeAll(() => {
    (global as any).SpeechSynthesisUtterance = vi.fn().mockImplementation(function (this: any, text: string) {
      mockUtterance.text = text;
      Object.assign(this, mockUtterance);
      return this;
    });
    Object.defineProperty(window, 'speechSynthesis', {
      value: mockSpeechSynthesis,
      writable: true,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with supported status and loads voices', () => {
    const { result } = renderHook(() => useTextToSpeech());
    expect(result.current.isSupported).toBe(true);
    expect(result.current.voices.length).toBe(2);
    expect(result.current.isMuted).toBe(false);
  });

  test('toggleMute toggles mute state and stops active speech', () => {
    const { result } = renderHook(() => useTextToSpeech());
    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(true);
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();

    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(false);
  });

  test('speak invokes window.speechSynthesis.speak with clean text and persona voice settings', () => {
    const { result } = renderHook(() => useTextToSpeech());

    act(() => {
      result.current.speak('[GREETING] *Laughter defeats dogma!*', mockPersona, 'turn_1');
    });

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    const passedUtterance = mockSpeechSynthesis.speak.mock.calls[0][0];
    expect(passedUtterance.text).toBe('Laughter defeats dogma!');
    expect(passedUtterance.pitch).toBe(1.15);
    expect(passedUtterance.rate).toBe(1.05);
    expect(result.current.currentlySpeakingTurnId).toBe('turn_1');
    expect(result.current.currentlySpeakingSpeakerId).toBe('chaplin');
  });

  test('stop cancels active speech synthesis', () => {
    const { result } = renderHook(() => useTextToSpeech());
    act(() => {
      result.current.stop();
    });
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.currentlySpeakingTurnId).toBeNull();
  });
});
