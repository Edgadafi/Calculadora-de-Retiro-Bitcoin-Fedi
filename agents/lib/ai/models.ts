import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { isGeminiConfigured, isOpenAIConfigured, RITO_CHAT_MODEL } from '@/lib/config';

/** Modelo de chat Rito: Gemini Flash por defecto; fallback OpenAI en transición. */
export function getRitoChatModel() {
  if (isGeminiConfigured()) {
    return google(RITO_CHAT_MODEL);
  }
  if (isOpenAIConfigured()) {
    return openai('gpt-4o-mini');
  }
  throw new Error('No chat LLM configured (GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY)');
}

export function isChatLlmConfigured(): boolean {
  return isGeminiConfigured() || isOpenAIConfigured();
}
