import { GoogleGenAI } from '@google/genai';
import { Persona, DebateTurn, UserProfile } from '@/types/debate';
import { MinimizedPayload } from './token-minimizer';

export interface AIModelOption {
  id: string;
  name: string;
  provider: 'OpenRouter' | 'Google Gemini';
  badge: string;
  isFree?: boolean;
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  { id: 'meta-llama/llama-3.2-1b-instruct', name: 'Llama 3.2 1B (Ultra Fast)', provider: 'OpenRouter', badge: 'Ultra Fast', isFree: true },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'OpenRouter', badge: 'High Quality', isFree: true },
  { id: 'qwen/qwen-2.5-7b-instruct', name: 'Qwen 2.5 7B', provider: 'OpenRouter', badge: 'Balanced', isFree: true },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', provider: 'OpenRouter', badge: 'Strong Reasoning', isFree: true },
  { id: 'microsoft/phi-3-mini-128k-instruct', name: 'Phi-3 Mini 128k', provider: 'OpenRouter', badge: 'Compact', isFree: true },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash Native', provider: 'Google Gemini', badge: 'Native API' },
];

export function getStoredApiKey(): string {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
}

export function getOpenRouterApiKey(): string {
  return (
    process.env.NEXT_PUBLIC_OPENROUTER_API ||
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    ''
  );
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

  // Strip repetitive affirmative prefixes (e.g. "ஆம்,", "ஆமாம்,", "Yes,", "Yeah,")
  text = text.replace(/^(ஆம்|ஆமாம்|சரி)\s*[,.:\-–—]?\s*/iu, '');
  text = text.replace(/^(yes|yeah|sure|indeed|absolutely)\s*[,.:\-–—]?\s*/i, '');
  text = text.replace(/^I (completely )?agree (with [^,.!?]+ )?that /i, '');

  // Capitalize first character if lowercase after stripping
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

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

async function generateOpenRouterTurnResponse(
  openRouterKey: string,
  system: string,
  prompt: string,
  preferredModel?: string
): Promise<string | null> {
  const fallbackModels = [
    'meta-llama/llama-3.2-1b-instruct',
    'google/gemini-2.5-flash',
    'qwen/qwen-2.5-7b-instruct',
    'mistralai/mistral-7b-instruct',
    'microsoft/phi-3-mini-128k-instruct',
  ];

  const modelsToTry = preferredModel && preferredModel.includes('/')
    ? [preferredModel, ...fallbackModels.filter((m) => m !== preferredModel)]
    : [process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'meta-llama/llama-3.2-1b-instruct', ...fallbackModels];

  for (const model of modelsToTry) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://checko.app',
          'X-Title': 'Checko Debate Arena',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
          max_tokens: 350,
          temperature: 0.85,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content && typeof content === 'string' && content.trim().length > 0) {
          return cleanModelOutput(content);
        }
      } else {
        const errText = await res.text();
        console.warn(`OpenRouter model '${model}' returned status ${res.status}:`, errText);
      }
    } catch (err) {
      console.warn(`OpenRouter request error for model '${model}':`, err);
    }
  }

  return null;
}

export async function generateDebateTurnResponse(
  persona: Persona,
  payload: MinimizedPayload,
  userProfile?: UserProfile,
  selectedModel?: string
): Promise<string> {
  const apiKey = getStoredApiKey();
  const openRouterKey = getOpenRouterApiKey();

  const userName = userProfile?.name || 'User';
  const lastTurn = payload.slidingWindowTurns[payload.slidingWindowTurns.length - 1];
  const topic = payload.topic;
  const isTamil = payload.language === 'ta';

  // Use the pre-compiled system instruction from token-minimizer
  const system = payload.systemInstruction;

  // Format conversation history of recent turns (Speaker vs Opponent)
  const conversationThread = payload.slidingWindowTurns
    .map((t) => `${t.speakerName}: "${t.content}"`)
    .join('\n');

  let prompt: string;
  if (isTamil) {
    const rulesTa = `நீளம்: சரியாக 1 அல்லது 2 வரிகள் மட்டுமே (20-35 சொற்கள்). எளிய உரை (plain text), தமிழ் எழுத்துக்கள் மட்டுமே. எக்காரணம் கொண்டும் "ஆம்/ஆமாம்/சரி" என்று தொடங்காதீர்கள். நபரின் பெயரை திரும்பத் திரும்ப அழைக்காதீர்கள்.`;
    if (!lastTurn) {
      prompt = `குழுவினருக்கு ஒரு வரியில் சுருக்கமான தொடக்க வணக்கம் கூறி, "${topic}" பற்றிய உங்கள் தொடக்க பார்வையை அறிவியல்/வரலாற்று உண்மையுடன் 1 வரியில் கூறுங்கள். ${rulesTa}`;
    } else if (lastTurn.speakerId === 'user') {
      prompt = `சமீபத்திய உரையாடல்:\n${conversationThread}\n\n${userName} கூறினார்: "${lastTurn.content}"\n\n${userName}-க்கு ${persona.name}-ஆக நேரடியாக பதிலளித்து "${topic}" பற்றி புதிய கோணத்தில் வாதத்தை 1-2 வரிகளில் கூறுங்கள். ${rulesTa}`;
    } else {
      prompt = `சமீபத்திய உரையாடல் ஓட்டம்:\n${conversationThread}\n\nவழிகாட்டுதல் (${persona.name}-க்கு):\nமுந்தைய உரையாடலின் தொடர்ச்சியாக (continuity), ஒரே கருத்தை திரும்பத் திரும்ப பேசாமல் (no repetition loops), விவாதத்தை அடுத்த புதிய அறிவியல்/வரலாற்று அல்லது தத்துவ பகுதிக்கு கொண்டு செல்லுங்கள் (topic evolution). "${topic}" குறித்த உங்கள் நிலைப்பாட்டை ("${persona.defaultStance}") புதிய உண்மையுடன் 1-2 வரிகளில் பேசுங்கள். ${rulesTa}`;
    }
  } else {
    const rulesEn = `Length constraint: exactly 1 or 2 short lines only (max 20-35 words). Live call chat tone. Plain text only. NEVER start with "Yes", "Yeah", "I agree", or robotic name prefixes.`;
    if (!lastTurn) {
      prompt = `Greet the group briefly with a natural opening, then state your core perspective on "${topic}" using a real fact in 1-2 short lines. ${rulesEn}`;
    } else if (lastTurn.speakerId === 'user') {
      prompt = `Recent thread:\n${conversationThread}\n\n${userName} said: "${lastTurn.content}"\n\nAnswer ${userName} directly as ${persona.name} with real factual or philosophical insight advancing "${topic}" in 1-2 short lines. ${rulesEn}`;
    } else {
      prompt = `[Recent Conversation Thread]:\n${conversationThread}\n\nInstructions for ${persona.name}:\n- CONTINUITY & TOPIC EVOLUTION: Advance the discussion into a fresh sub-aspect or deeper scientific/philosophical dimension of "${topic}". DO NOT repeat or loop over what was already said in recent turns. Build upon the thread and present a fresh argument or thought-provoking point.\n- Stance: Firmly maintain "${persona.defaultStance}".\n- ${rulesEn}`;
    }
  }

  // 1. Primary: Try OpenRouter API with low-end lightweight models if key is provided
  if (openRouterKey && openRouterKey.trim().length > 0) {
    const openRouterResult = await generateOpenRouterTurnResponse(openRouterKey, system, prompt, selectedModel);
    if (openRouterResult) {
      return openRouterResult;
    }
    console.warn('OpenRouter API call failed or unfulfilled. Falling back to Gemini API...');
  }

  if (!apiKey || apiKey.trim().length === 0) {
    return `⚠️ Please set NEXT_PUBLIC_OPENROUTER_API or NEXT_PUBLIC_GEMINI_API_KEY in your .env file to start the conversation.`;
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


