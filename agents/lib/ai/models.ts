import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { isGeminiConfigured, isOpenAIConfigured } from '@/lib/config';

/** Modelos Gemini en orden de preferencia (free tier primero). */
export const RITO_CHAT_MODELS = [
  process.env.RITO_CHAT_MODEL || 'gemini-2.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
].filter((m, i, arr) => arr.indexOf(m) === i);

export async function generateRitoText(params: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}): Promise<string> {
  let lastError: unknown;
  for (const modelId of RITO_CHAT_MODELS) {
    try {
      const { text } = await generateText({
        model: google(modelId),
        system: params.system,
        messages: params.messages,
      });
      if (text?.trim()) return text;
    } catch (e) {
      lastError = e;
      console.warn(`[rito] model ${modelId} failed`, e instanceof Error ? e.message : e);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('All Gemini models failed');
}

export function getRitoChatModel() {
  if (isGeminiConfigured()) {
    return google(process.env.RITO_CHAT_MODEL || 'gemini-2.5-flash');
  }
  if (isOpenAIConfigured()) {
    return openai('gpt-4o-mini');
  }
  throw new Error('No chat LLM configured (GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY)');
}

export function isChatLlmConfigured(): boolean {
  return isGeminiConfigured() || isOpenAIConfigured();
}
