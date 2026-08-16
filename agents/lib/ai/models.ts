import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { RITO_MAX_OUTPUT_TOKENS } from '@/lib/agents/rito';
import { isGeminiConfigured, isOpenAIConfigured } from '@/lib/config';

const RETIRED_GEMINI = /^(gemini-2\.0|gemini-1\.[05]|gemini-pro$|gemini-1\.0)/i;

/**
 * Modelos Gemini vigentes (ago 2026).
 * gemini-2.0-flash / flash-lite se retiraron el 1 jun 2026; se omiten aunque
 * RITO_CHAT_MODEL aún apunte a ellos en Vercel.
 */
export const RITO_CHAT_MODELS = [
  process.env.RITO_CHAT_MODEL || 'gemini-3.5-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
].filter((m, i, arr) => arr.indexOf(m) === i && !RETIRED_GEMINI.test(m));

export async function generateRitoText(params: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}): Promise<string> {
  let lastError: unknown;

  if (isGeminiConfigured()) {
    for (const modelId of RITO_CHAT_MODELS) {
      try {
        const { text } = await generateText({
          model: google(modelId),
          system: params.system,
          messages: params.messages,
          maxOutputTokens: RITO_MAX_OUTPUT_TOKENS,
          temperature: 0.7,
        });
        if (text?.trim()) return text;
      } catch (e) {
        lastError = e;
        console.warn(`[rito] model ${modelId} failed`, e instanceof Error ? e.message : e);
      }
    }
  }

  if (isOpenAIConfigured()) {
    try {
        const { text } = await generateText({
          model: openai('gpt-4o-mini'),
          system: params.system,
          messages: params.messages,
          maxOutputTokens: RITO_MAX_OUTPUT_TOKENS,
          temperature: 0.7,
        });
      if (text?.trim()) return text;
    } catch (e) {
      lastError = e;
      console.warn('[rito] openai gpt-4o-mini failed', e instanceof Error ? e.message : e);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All chat models failed');
}

export function getRitoChatModel() {
  if (isGeminiConfigured()) {
    return google(process.env.RITO_CHAT_MODEL || 'gemini-3.5-flash');
  }
  if (isOpenAIConfigured()) {
    return openai('gpt-4o-mini');
  }
  throw new Error('No chat LLM configured (GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY)');
}

export function isChatLlmConfigured(): boolean {
  return isGeminiConfigured() || isOpenAIConfigured();
}
