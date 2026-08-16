/**
 * Piezas P1: hilo X, guion Reels 30 s y borrador SEO.
 * El LLM no publica: solo redacta. Buffer y el panel admin cierran el ciclo.
 */
import { generateText } from 'ai';
import { getRitoChatModel, isChatLlmConfigured } from '@/lib/ai/models';
import { getSupabase } from '@/lib/db/supabase';
import type { LegalAlertRow } from '@/lib/db/supabase';
import { z } from 'zod';

export const CONTENT_CHANNELS = ['x_thread', 'reels_30s', 'seo'] as const;
export type ContentChannel = (typeof CONTENT_CHANNELS)[number];

export const DISCLAIMER_SHORT =
  'Educación financiera · No es asesoría · Proyecciones hipotéticas';

const HYPE = /garantizado|sin riesgo|82\s*%|hazte rico|number go up|lambo/i;

const draftsSchema = z.object({
  xThread: z.string().min(40).max(2400),
  reelsScript: z.string().min(40).max(1600),
  seoDraft: z.string().min(80).max(5000),
});

export function buildCtaUrl(channel: ContentChannel, alertId: string): string {
  const medium = channel === 'x_thread' ? 'x' : channel === 'reels_30s' ? 'reels' : 'seo';
  const campaign = `legal-${alertId.replace(/-/g, '').slice(0, 8)}`;
  const path = channel === 'seo' ? '/calc' : '/brujula';
  const params = new URLSearchParams({
    utm_source: 'rito-content',
    utm_medium: medium,
    utm_campaign: campaign,
  });
  return `https://www.retirobtc.mx${path}?${params.toString()}`;
}

export function ensureCompliance(body: string, channel: ContentChannel, alertId: string): string {
  let text = body.replace(HYPE, '[omitido]').trim();
  const cta = buildCtaUrl(channel, alertId);
  if (!text.includes(DISCLAIMER_SHORT)) {
    text = `${text}\n\n${DISCLAIMER_SHORT}`;
  }
  if (!text.includes(cta)) {
    const label = channel === 'seo' ? 'Proyecta tu retiro en sats' : 'Descubre tu Índice de Rumbo';
    text = `${text}\n\n${label}: ${cta}`;
  }
  return text.trim();
}

function fallbackDrafts(alert: Pick<LegalAlertRow, 'id' | 'title' | 'summary'>): z.infer<typeof draftsSchema> {
  const hook = alert.title.slice(0, 180);
  const fact = alert.summary.slice(0, 400);
  return {
    xThread: `1/ En México el retiro formal rinde ~5% real. Hoy el DOF toca algo que importa para tu ahorro.\n\n${hook}\n\n2/ ${fact}\n\n3/ No prometemos rendimientos. Comparamos con AFORE real (~5%) y un escenario BTC conservador (15%).`,
    reelsScript: `HOOK: ¿Tu AFORE rinde ~5% real?\n\nPROBLEMA: ${hook}\n\nDATO: ${fact.slice(0, 220)}\n\nCIERRE: Proyecta el mismo ahorro en sats. Conservador, en español.`,
    seoDraft: `## ${hook}\n\n${fact}\n\nEl rendimiento real histórico del sistema AFORE ronda el 5%. Esta pieza no inventa artículos de ley: resume una alerta ya revisada. Usa la calculadora con escenario conservador (15% BTC) y compara poder adquisitivo, no hype.`,
  };
}

async function draftWithLlm(alert: LegalAlertRow): Promise<z.infer<typeof draftsSchema>> {
  if (!isChatLlmConfigured()) return fallbackDrafts(alert);

  const { text } = await generateText({
    model: getRitoChatModel(),
    prompt: `Eres el generador de contenido de retirobtc.mx. Devuelve SOLO JSON válido con claves xThread, reelsScript, seoDraft.

Reglas:
- Español, tono pedagógico. Nada de hype ni "crypto bro".
- Compara con AFORE real (~5%). Proyección BTC conservadora 15%, nunca 82% histórico como promesa.
- No inventes artículos de ley. Usa solo el título y el resumen.
- Un solo CTA (lo añadiremos nosotros). No pongas URLs.
- No digas "garantizado", "sin riesgo" ni "asesoría financiera".

Título: ${alert.title}
Resumen: ${alert.summary}
Fuente: ${alert.source_url ?? 'DOF'}
Keywords: ${(alert.keywords ?? []).join(', ')}

xThread: hilo de 3-5 tuits numerados.
reelsScript: guion de 30 segundos (hook, problema, dato, cierre).
seoDraft: markdown corto (200-400 palabras) para blog.`,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return fallbackDrafts(alert);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return fallbackDrafts(alert);
  }
  const result = draftsSchema.safeParse(parsed);
  return result.success ? result.data : fallbackDrafts(alert);
}

/**
 * Crea o reemplaza los tres borradores de una alerta ya ingerida.
 * No publica. Si el LLM falla, usa plantilla factual.
 */
export async function generateContentForAlert(alert: LegalAlertRow): Promise<{ created: number }> {
  const supabase = getSupabase();
  const raw = await draftWithLlm(alert);
  const rows = CONTENT_CHANNELS.map((channel) => {
    const source =
      channel === 'x_thread' ? raw.xThread : channel === 'reels_30s' ? raw.reelsScript : raw.seoDraft;
    return {
      alert_id: alert.id,
      channel,
      body: ensureCompliance(source, channel, alert.id),
      cta_url: buildCtaUrl(channel, alert.id),
      status: 'draft' as const,
      error: null,
      updated_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase.from('content_drafts').upsert(rows, {
    onConflict: 'alert_id,channel',
  });
  if (error) {
    console.error('[content-generator]', error.message);
    throw new Error('No se pudieron guardar los borradores');
  }
  return { created: rows.length };
}
