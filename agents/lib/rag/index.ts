import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { getSupabase } from '@/lib/db/supabase';
import { isOpenAIConfigured, isSupabaseConfigured } from '@/lib/config';

const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 120;
/** Embeddings RAG: OpenAI hasta re-indexar con modelo Gemini/Google. */
const EMBEDDING_MODEL = 'text-embedding-3-small';

export function chunkText(text: string, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    let end = Math.min(start + size, normalized.length);
    if (end < normalized.length) {
      const breakAt = normalized.lastIndexOf('\n\n', end);
      if (breakAt > start + size * 0.5) end = breakAt;
    }
    chunks.push(normalized.slice(start, end).trim());
    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks.filter(Boolean);
}

export async function createEmbedding(text: string): Promise<number[] | null> {
  if (!isOpenAIConfigured()) return null;
  const { embedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: text.slice(0, 8000),
  });
  return embedding;
}

export async function ingestDocument(params: {
  slug: string;
  title: string;
  content: string;
  sourcePath?: string;
}): Promise<{ chunks: number; documentId: string | null }> {
  if (!isSupabaseConfigured()) {
    return { chunks: chunkText(params.content).length, documentId: null };
  }

  const supabase = getSupabase();
  const chunks = chunkText(params.content);
  const contentHash = Buffer.from(params.content).toString('base64url').slice(0, 32);

  const { data: doc, error: docError } = await supabase
    .from('knowledge_documents')
    .upsert(
      {
        slug: params.slug,
        title: params.title,
        source_path: params.sourcePath ?? null,
        content_hash: contentHash,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();

  if (docError || !doc) throw docError ?? new Error('Failed to upsert document');

  await supabase.from('knowledge_chunks').delete().eq('document_id', doc.id);

  let indexed = 0;
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await createEmbedding(chunks[i]);
    const { error } = await supabase.from('knowledge_chunks').insert({
      document_id: doc.id,
      chunk_index: i,
      content: chunks[i],
      embedding: embedding ?? null,
      metadata: { slug: params.slug, title: params.title },
    });
    if (!error) indexed += 1;
  }

  return { chunks: indexed, documentId: doc.id };
}

export type RetrievedChunk = {
  content: string;
  similarity: number;
  metadata: Record<string, unknown> | null;
};

export async function searchKnowledgeBase(query: string, limit = 5): Promise<RetrievedChunk[]> {
  if (!isSupabaseConfigured() || !isOpenAIConfigured()) {
    return getFallbackKnowledge(query).slice(0, limit);
  }

  const embedding = await createEmbedding(query);
  if (!embedding) return getFallbackKnowledge(query).slice(0, limit);

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: embedding,
    match_count: limit,
    match_threshold: 0.35,
  });

  if (error || !data?.length) {
    return getFallbackKnowledge(query).slice(0, limit);
  }

  return data.map((row: { content: string; similarity: number; metadata: Record<string, unknown> }) => ({
    content: row.content,
    similarity: row.similarity,
    metadata: row.metadata ?? null,
  }));
}

/** Static fallback when Supabase/OpenAI unavailable (dev / cold start). */
function getFallbackKnowledge(query: string): RetrievedChunk[] {
  const q = query.toLowerCase();
  const entries: RetrievedChunk[] = [
    {
      content:
        'La Calculadora de Retiro Bitcoin en retirobtc.mx permite comparar proyecciones de ahorro en Bitcoin vs el sistema AFORE (~5,02% real histórico). La reforma de infraestructura 2026 permite destinar hasta 30% del ahorro AFORE a obra pública.',
      similarity: 0.9,
      metadata: { slug: 'product-fallback' },
    },
    {
      content:
        'Fedi es una wallet comunitaria que permite usar mini-apps como la calculadora en /calc. Para instalar Fedi: visita fedi.xyz, descarga la app y abre el catálogo de mini-apps para acceder a Calculadora de Retiro Bitcoin.',
      similarity: 0.85,
      metadata: { slug: 'fedi-fallback' },
    },
    {
      content:
        'La Brújula Financiera (/brujula) es un cuestionario de 8 preguntas que genera tu Índice de Rumbo sobre preparación financiera. La guía gratuita "Tu Retiro en México" cubre retiro, inflación y Bitcoin como herramienta de planeación.',
      similarity: 0.8,
      metadata: { slug: 'brujula-fallback' },
    },
    {
      content:
        'Premium desbloquea proyecciones avanzadas, exportación PDF y escenarios adicionales. Pagos vía Mercado Pago (MXN) o Lightning Network. retirobtc.mx no custodia fondos ni es asesor financiero.',
      similarity: 0.75,
      metadata: { slug: 'premium-fallback' },
    },
  ];

  const scored = entries.map((e) => ({
    ...e,
    similarity: e.content.toLowerCase().includes(q) ? e.similarity + 0.1 : e.similarity * 0.5,
  }));
  return scored.sort((a, b) => b.similarity - a.similarity);
}

export function formatContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return 'No hay contexto adicional en la base de conocimiento.';
  return chunks
    .map((c, i) => `[${i + 1}] (sim=${c.similarity.toFixed(2)})\n${c.content}`)
    .join('\n\n');
}
