import { NextRequest } from 'next/server';
import { seedKnowledgeBase } from '@/lib/rag/seed';
import { ingestDocument } from '@/lib/rag';
import { jsonWithCors } from '@/lib/http/cors';

function assertAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-secret') === secret;
}

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) {
    return jsonWithCors(req, { error: 'Unauthorized' }, { status: 401 });
  }

  let body: { action?: string; slug?: string; title?: string; content?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (body.action === 'seed') {
    const result = await seedKnowledgeBase();
    return jsonWithCors(req, { ok: true, ...result });
  }

  if (body.slug && body.title && body.content) {
    const result = await ingestDocument({
      slug: body.slug,
      title: body.title,
      content: body.content,
    });
    return jsonWithCors(req, { ok: true, ...result });
  }

  return jsonWithCors(req, { error: 'Use action=seed or provide slug, title, content' }, { status: 400 });
}
