import { GoogleGenAI } from '@google/genai';
import { Persona, DebateTurn, UserProfile } from '@/types/debate';
import { MinimizedPayload } from './token-minimizer';

export function getStoredApiKey(): string {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
}

export function saveStoredApiKey(_key: string): void {
  // No-op: API key is configured strictly via environment variables (.env)
}

/**
 * Cleans raw model output:
 * - Strips ALL markdown formatting (bold, italic, bullets, headers)
 * - Strips meta-commentary ("Let's try again", "Here's my response")
 * - Strips leaked system prompt fragments
 * - Trims incomplete final sentences
 */
function cleanModelOutput(raw: string): string {
  let text = raw.trim();

  // Nuclear option: remove ALL asterisks and underscores used for formatting
  text = text.replace(/\*/g, '');
  text = text.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1');

  // Strip markdown headers
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Split into lines, filter out junk
  const lines = text.split('\n');
  const cleanLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) return false;
    const lower = trimmed.toLowerCase();
    // Remove any line with "draft", "option", "version", "response:" meta-labels
    if (/\b(draft|option|version)\s*\d/i.test(trimmed)) return false;
    // Remove echoed prompt instructions
    if (lower.includes('keep it to') || lower.includes('finish every sentence') || lower.includes('plain text only')) return false;
    if (lower.includes('write plain text') || lower.includes('no asterisks') || lower.includes('no markdown')) return false;
    if (lower.includes('no bullet points') || lower.includes('no headers') || lower.includes('speak naturally')) return false;
    // Remove meta-commentary
    if (/^(let'?s try|here'?s my|wait,|okay,? let|trying again)/i.test(trimmed)) return false;
    // Remove leaked numbered rules
    if (/^\d+\.\s+(SHORT|CONCISE|ALWAYS|NO|DIRECT|NATURAL|MANDATORY|PHASE|STRICT)/i.test(trimmed)) return false;
    return true;
  });
  text = cleanLines.join(' ').trim();

  // Strip quotes wrapping entire response
  text = text.replace(/^[""]([\s\S]*)[""]$/, '$1').trim();

  // Strip repetitive intro headers if present (e.g. "I agree with...", "I completely agree...")
  text = text.replace(/^I (completely )?agree (with [^,.!?]+ )?that /i, '');

  // Ensure text ends with proper sentence completion punctuation
  if (text.length > 0 && !/[.?!"]$/.test(text)) {
    const lastPunctuation = Math.max(text.lastIndexOf('.'), text.lastIndexOf('?'), text.lastIndexOf('!'));
    if (lastPunctuation > 20 && lastPunctuation > text.length * 0.6) {
      text = text.substring(0, lastPunctuation + 1);
    } else {
      text = text + '.';
    }
  }

  // Clean up double spaces
  text = text.replace(/\s{2,}/g, ' ').trim();

  return text;
}

export async function generateDebateTurnResponse(
  persona: Persona,
  payload: MinimizedPayload,
  userProfile?: UserProfile
): Promise<string> {
  const apiKey = getStoredApiKey();

  if (!apiKey || apiKey.trim().length === 0) {
    return `⚠️ Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file to start the conversation.`;
  }

  const userName = userProfile?.name || 'User';
  const lastTurn = payload.slidingWindowTurns[payload.slidingWindowTurns.length - 1];
  const topic = payload.topic;

  // System: who you are + STRICT topic lock & tone
  const system = `You are ${persona.name}, ${persona.title}. ${persona.bio} Tone: ${persona.tone}. You are in a group chat debating: "${topic}". Speak directly in character as ${persona.name}. Every sentence must be about "${topic}". Write plain text only with NO markdown, NO asterisks, and NO bullet points. Always finish every sentence with a period.`;

  let prompt: string;
  const rules = `Stay strictly on "${topic}". Plain text only, no formatting or markdown. Always end every sentence with proper punctuation.`;

  if (!lastTurn) {
    prompt = `Introduce yourself briefly as ${persona.name} and share your unique, sharp perspective on "${topic}" in 2-3 complete sentences. ${rules}`;
  } else if (lastTurn.speakerId === 'user') {
    prompt = `${userName} said: "${lastTurn.content}"\n\nAnswer ${userName} directly from your unique perspective as ${persona.name} in 2-3 complete sentences about "${topic}". ${rules}`;
  } else {
    prompt = `${lastTurn.speakerName} argued about "${topic}": "${lastTurn.content}"\n\nRespond directly as ${persona.name}. Do NOT start your response with "I agree with ${lastTurn.speakerName}" or repeat their exact words. Challenge their point or present a NEW, distinct scientific/philosophical counter-argument on "${topic}" in 2-3 complete sentences. ${rules}`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';

    let response;
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: system,
          temperature: 0.85,
          maxOutputTokens: 500,
        },
      });
    } catch (primaryErr: unknown) {
      const primaryMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      // Fallback to gemini-2.0-flash if model name not found (404) or gemini-1.5-flash
      if (primaryMsg.includes('404') || primaryMsg.includes('NOT_FOUND') || primaryMsg.includes('gemini-3.5')) {
        console.warn(`Primary model '${modelName}' not found. Falling back to 'gemini-2.0-flash'...`);
        response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: system,
            temperature: 0.85,
            maxOutputTokens: 500,
          },
        });
      } else {
        throw primaryErr;
      }
    }

    if (response && response.text) {
      return cleanModelOutput(response.text);
    }

    return `⚠️ Empty response from Gemini. Please try again.`;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Gemini API error:', msg);

    if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
      return `⚠️ Gemini API Error (403 Permission Denied): Your GCP project or API key was denied access. Please check that Generative Language API is enabled and your API key in .env is valid.`;
    }
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      return `⚠️ Gemini API Error (429 Quota Exceeded): Rate limit or quota exceeded. Please wait a moment before trying again or check your plan in Google AI Studio.`;
    }
    if (msg.includes('404') || msg.includes('NOT_FOUND')) {
      return `⚠️ Gemini API Error (404 Model Not Found): The requested model is not available for your API key.`;
    }

    return `⚠️ Gemini API Error: ${msg}`;
  }
}


