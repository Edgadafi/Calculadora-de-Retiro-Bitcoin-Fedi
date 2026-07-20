import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateRitoText, isChatLlmConfigured } from '@/lib/ai/models';
import { RITO_DISCLAIMER, RITO_SYSTEM_PROMPT } from '@/lib/agents/rito';
import { RATE_LIMITS, isGeminiConfigured, isOpenAIConfigured, isSupabaseConfigured, RITO_CHAT_MODEL } from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';
import { assertAllowedOrigin, handleOptions, jsonWithCors } from '@/lib/http/cors';
import { getClientIp, hashIp, redactPii } from '@/lib/privacy/hash';
import { checkRateLimit } from '@/lib/privacy/rate-limit';
import { formatContext, searchKnowledgeBase } from '@/lib/rag';

export const maxDuration = 60;

const messageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(4000),
    })
  ),
  sessionKey: z.string().max(64).optional(),
});

export async function GET() {
  return Response.json({
    ok: true,
    geminiConfigured: isGeminiConfigured(),
    openaiConfigured: isOpenAIConfigured(),
    chatConfigured: isChatLlmConfigured(),
    model: RITO_CHAT_MODEL,
    supabase: isSupabaseConfigured(),
  });
}

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    assertAllowedOrigin(req);
  } catch {
    return jsonWithCors(req, { error: 'Origin not allowed' }, { status: 403 });
  }

  if (!isChatLlmConfigured()) {
    return jsonWithCors(req, { error: 'Chat no disponible temporalmente' }, { status: 503 });
  }

  try {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const rateBucket = `chat:ip:${ipHash ?? 'unknown'}`;
  const allowed = await checkRateLimit(rateBucket, RATE_LIMITS.chatPerHour, 60 * 60 * 1000);
  if (!allowed) {
    return jsonWithCors(req, { error: 'Límite de mensajes alcanzado. Intenta en una hora.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWithCors(req, { error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return jsonWithCors(req, { error: 'Validation failed' }, { status: 400 });
  }

  const { messages, sessionKey } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    return jsonWithCors(req, { error: 'No user message' }, { status: 400 });
  }

  const sid = sessionKey ?? `anon-${ipHash ?? Date.now()}`;
  const chunks = await searchKnowledgeBase(lastUser.content);
  const context = formatContext(chunks);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data: session } = await supabase
        .from('chat_sessions')
        .upsert(
          {
            session_key: sid,
            ip_hash: ipHash,
            last_message_at: new Date().toISOString(),
          },
          { onConflict: 'session_key' }
        )
        .select('id')
        .single();

      if (session?.id) {
        await supabase.from('chat_messages').insert({
          session_id: session.id,
          role: 'user',
          content: redactPii(lastUser.content),
        });
      }
    } catch (e) {
      console.warn('[chat] persist user message failed', e);
    }
  }

  try {
    const text = await generateRitoText({
      system: `${RITO_SYSTEM_PROMPT}\n\n--- CONTEXTO RAG ---\n${context}\n\n--- DISCLAIMER ---\n${RITO_DISCLAIMER}`,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    if (isSupabaseConfigured() && text) {
      try {
        const supabase = getSupabase();
        const { data: session } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('session_key', sid)
          .maybeSingle();
        if (session?.id) {
          await supabase.from('chat_messages').insert({
            session_id: session.id,
            role: 'assistant',
            content: redactPii(text.slice(0, 8000)),
          });
        }
      } catch (e) {
        console.warn('[chat] persist assistant message failed', e);
      }
    }

    const origin = req.headers.get('origin');
    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': origin && origin.length ? origin : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        Vary: 'Origin',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown chat error';
    console.error('[chat] stream failed', message);
    return jsonWithCors(
      req,
      {
        error: 'Chat no disponible temporalmente',
        code: 'chat_stream_failed',
        detail: message.slice(0, 180),
      },
      { status: 503 }
    );
  }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown chat error';
    console.error('[chat] request failed', message);
    return jsonWithCors(req, { error: 'Chat no disponible temporalmente', code: 'chat_request_failed' }, { status: 503 });
  }
}
