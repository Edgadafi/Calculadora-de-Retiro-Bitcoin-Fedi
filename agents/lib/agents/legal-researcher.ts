import { generateText } from 'ai';
import { getRitoChatModel, isChatLlmConfigured } from '@/lib/ai/models';
import { LEGAL_KEYWORDS, isSupabaseConfigured } from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';
import { ingestDocument } from '@/lib/rag';

export type DofItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

const DOF_RSS_URL =
  process.env.DOF_RSS_URL ||
  'https://www.dof.gob.mx/rss.php?format=rss2';

export async function fetchDofFeed(): Promise<DofItem[]> {
  const res = await fetch(DOF_RSS_URL, {
    headers: { 'User-Agent': 'RetiroBTC-LegalMonitor/1.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`DOF feed HTTP ${res.status}`);
  const xml = await res.text();
  return parseRssItems(xml);
}

function parseRssItems(xml: string): DofItem[] {
  const items: DofItem[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  for (const block of itemBlocks) {
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const description = stripHtml(extractTag(block, 'description'));
    const pubDate = extractTag(block, 'pubDate');
    if (title) items.push({ title, link, description, pubDate });
  }
  return items;
}

function extractTag(block: string, tag: string): string {
  const cdata = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i').exec(block);
  if (cdata) return cdata[1].trim();
  const plain = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i').exec(block);
  return plain ? plain[1].trim() : '';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function matchesLegalKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return LEGAL_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));
}

export async function summarizeLegalItem(item: DofItem): Promise<string> {
  if (!isChatLlmConfigured()) {
    return `${item.title}. ${item.description.slice(0, 500)}`;
  }
  const { text } = await generateText({
    model: getRitoChatModel(),
    prompt: `Resume en español (máx 200 palabras) la relevancia para ahorro para retiro, AFOREs, fintech o Bitcoin en México:

Título: ${item.title}
Extracto: ${item.description.slice(0, 1500)}
Fuente: ${item.link}

Sé factual. No inventes artículos de ley.`,
  });
  return text;
}

export async function runLegalMonitor(): Promise<{ scanned: number; created: number }> {
  if (!isSupabaseConfigured()) {
    const items = await fetchDofFeed();
    const relevant = items.filter((i) => matchesLegalKeywords(`${i.title} ${i.description}`).length > 0);
    return { scanned: items.length, created: relevant.length };
  }

  const supabase = getSupabase();
  const items = await fetchDofFeed();
  let created = 0;

  for (const item of items) {
    const keywords = matchesLegalKeywords(`${item.title} ${item.description}`);
    if (!keywords.length) continue;

    const { data: existing } = await supabase
      .from('legal_alerts')
      .select('id')
      .eq('source_url', item.link)
      .maybeSingle();

    if (existing) continue;

    const summary = await summarizeLegalItem(item);
    const { error } = await supabase.from('legal_alerts').insert({
      title: item.title,
      summary,
      source_url: item.link,
      raw_excerpt: item.description.slice(0, 4000),
      keywords,
      status: 'pending_review',
    });

    if (!error) created += 1;
  }

  return { scanned: items.length, created };
}

export async function approveLegalAlert(alertId: string, reviewedBy: string): Promise<void> {
  const supabase = getSupabase();
  const { data: alert, error } = await supabase
    .from('legal_alerts')
    .select('*')
    .eq('id', alertId)
    .single();

  if (error || !alert) throw error ?? new Error('Alert not found');
  if (alert.status !== 'pending_review') throw new Error('Alert is not pending review');

  const slug = `legal-${alertId.slice(0, 8)}`;
  const content = `# ${alert.title}\n\n${alert.summary}\n\nFuente: ${alert.source_url ?? 'DOF'}\n\nPalabras clave: ${(alert.keywords ?? []).join(', ')}`;

  await ingestDocument({
    slug,
    title: alert.title,
    content,
    sourcePath: alert.source_url ?? undefined,
  });

  await supabase
    .from('legal_alerts')
    .update({
      status: 'ingested',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq('id', alertId);
}

export async function rejectLegalAlert(alertId: string, reviewedBy: string): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from('legal_alerts')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq('id', alertId);
}
