import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { ingestDocument } from '@/lib/rag';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'content', 'knowledge');

const FAQ_ENTRIES: { slug: string; title: string; content: string }[] = [
  {
    slug: 'faq-afore',
    title: 'FAQ AFORE vs Bitcoin',
    content: `Comparador AFORE vs Bitcoin: rendimiento real histórico ~5,02% anual.
Reforma 2026: hasta 30% AFORE a obra pública.
Calculadora compara misma aportación e horizonte.`,
  },
  {
    slug: 'faq-fedi',
    title: 'FAQ Fedi',
    content: `Fedi (fedi.xyz): wallet comunitaria con federaciones y mini-apps.
Instalar app → unirse a federación → catálogo → Calculadora /calc.`,
  },
  {
    slug: 'faq-premium',
    title: 'FAQ Premium',
    content: `Premium: escenarios avanzados, PDF. Mercado Pago MXN o Lightning LNbits.`,
  },
  {
    slug: 'faq-brujula',
    title: 'FAQ Brújula',
    content: `Brújula /brujula: 8 preguntas, Índice de Rumbo. Guía gratis por email.`,
  },
];

export async function seedKnowledgeBase(): Promise<{ documents: number; chunks: number }> {
  let documents = 0;
  let chunks = 0;

  try {
    const files = await readdir(KNOWLEDGE_DIR);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const content = await readFile(path.join(KNOWLEDGE_DIR, file), 'utf8');
      const slug = file.replace(/\.md$/, '');
      const result = await ingestDocument({
        slug,
        title: slug.replace(/-/g, ' '),
        content,
        sourcePath: `content/knowledge/${file}`,
      });
      documents += 1;
      chunks += result.chunks;
    }
  } catch (e) {
    console.warn('[seed] knowledge dir:', e);
  }

  for (const faq of FAQ_ENTRIES) {
    const result = await ingestDocument({
      slug: faq.slug,
      title: faq.title,
      content: faq.content,
      sourcePath: 'seed/faq',
    });
    documents += 1;
    chunks += result.chunks;
  }

  return { documents, chunks };
}
