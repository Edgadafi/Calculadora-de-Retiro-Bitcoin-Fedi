import { streamText, tool, stepCountIs } from 'ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getRitoChatModel, isChatLlmConfigured } from '@/lib/ai/models';
import { RITO_DISCLAIMER, RITO_SYSTEM_PROMPT, PRODUCT_LINKS } from '@/lib/agents/rito';
import { RATE_LIMITS, isSupabaseConfigured } from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';
import { sendEscalationEmail } from '@/lib/email/resend';
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

  const result = streamText({
    model: getRitoChatModel(),
    system: `${RITO_SYSTEM_PROMPT}\n\n--- CONTEXTO RAG ---\n${context}\n\n--- DISCLAIMER ---\n${RITO_DISCLAIMER}`,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stopWhen: stepCountIs(3),
    tools: {
      searchKnowledgeBase: tool({
        description: 'Busca en la base de conocimiento de retirobtc.mx',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          const results = await searchKnowledgeBase(query, 4);
          return formatContext(results);
        },
      }),
      escalateToHuman: tool({
        description: 'Escala la conversación a un humano del equipo',
        inputSchema: z.object({ reason: z.string() }),
        execute: async ({ reason }) => {
          await sendEscalationEmail({
            sessionKey: sid,
            userMessage: `${reason}\n\nÚltimo mensaje: ${lastUser.content.slice(0, 500)}`,
          });
          return 'Escalamiento registrado. El equipo puede contactarte en calculadora.retirobtc@gmail.com.';
        },
      }),
      linkToCalculator: tool({
        description: 'Enlace a la calculadora',
        inputSchema: z.object({}),
        execute: async () => PRODUCT_LINKS.calculator,
      }),
      linkToBrujula: tool({
        description: 'Enlace a la brújula financiera',
        inputSchema: z.object({}),
        execute: async () => PRODUCT_LINKS.brujula,
      }),
    },
    onFinish: async ({ text }) => {
      if (!isSupabaseConfigured() || !text) return;
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
    },
  });

  const origin = req.headers.get('origin');
  return result.toTextStreamResponse({
    headers: {
      'Access-Control-Allow-Origin': origin && origin.length ? origin : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });
}
