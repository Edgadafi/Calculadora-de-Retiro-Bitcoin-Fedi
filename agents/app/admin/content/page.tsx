'use client';

import { useCallback, useEffect, useState } from 'react';

type Draft = {
  id: string;
  alert_id: string | null;
  channel: string;
  body: string;
  cta_url: string | null;
  status: string;
  buffer_update_id: string | null;
  error: string | null;
  created_at: string;
};

const CHANNEL_LABEL: Record<string, string> = {
  x_thread: 'Hilo X',
  reels_30s: 'Reels 30s',
  seo: 'SEO',
};

export default function AdminContentPage() {
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState('draft');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [bufferConfigured, setBufferConfigured] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/content?status=${encodeURIComponent(status)}`, {
        headers: { 'X-Admin-Secret': secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar');
      setDrafts(data.drafts ?? []);
      setBufferConfigured(Boolean(data.bufferConfigured));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [secret, status]);

  useEffect(() => {
    if (secret.length >= 8) load();
  }, [secret, load]);

  async function act(draftId: string, action: 'queue' | 'reject' | 'regenerate') {
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': secret,
      },
      body: JSON.stringify({ draftId, action }),
    });
    const data = await res.json();
    if (!res.ok) {
      window.alert(data.error || 'Error');
      return;
    }
    load();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">Contenido P1 — Retiro BTC</h1>
      <p className="text-sm text-zinc-400 mb-4">
        Borradores desde alertas legales aprobadas. Revisión humana, luego Buffer. Un CTA con UTM por
        pieza.
      </p>
      <p className="text-xs text-zinc-500 mb-6">
        Buffer: {bufferConfigured ? 'configurado' : 'falta BUFFER_ACCESS_TOKEN / BUFFER_PROFILE_ID'}
        {' · '}
        <a href="/admin/alerts" className="text-orange-400 underline cursor-pointer">
          Alertas legales
        </a>
      </p>

      <label className="block mb-4">
        <span className="text-sm text-zinc-400">Admin secret</span>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          placeholder="ADMIN_SECRET"
        />
      </label>

      <div className="flex gap-2 mb-4">
        {['draft', 'queued', 'rejected'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`cursor-pointer rounded px-3 py-1 text-xs ${
              status === s ? 'bg-orange-500 text-black' : 'border border-zinc-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-zinc-500">Cargando…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <ul className="space-y-4 mt-4">
        {drafts.map((d) => (
          <li key={d.id} className="rounded-lg border border-zinc-800 p-4">
            <p className="text-xs text-orange-400">
              {CHANNEL_LABEL[d.channel] || d.channel}
              {d.buffer_update_id ? ` · Buffer ${d.buffer_update_id}` : ''}
            </p>
            <pre className="text-xs text-zinc-300 mt-2 whitespace-pre-wrap font-sans">{d.body}</pre>
            {d.cta_url && (
              <a
                href={d.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-400 mt-2 inline-block cursor-pointer"
              >
                {d.cta_url}
              </a>
            )}
            {d.status === 'draft' && (
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => act(d.id, 'queue')}
                  className="cursor-pointer rounded bg-orange-500 px-3 py-1 text-xs font-medium text-black"
                >
                  Encolar en Buffer
                </button>
                <button
                  type="button"
                  onClick={() => act(d.id, 'regenerate')}
                  className="cursor-pointer rounded border border-zinc-600 px-3 py-1 text-xs"
                >
                  Regenerar
                </button>
                <button
                  type="button"
                  onClick={() => act(d.id, 'reject')}
                  className="cursor-pointer rounded border border-zinc-600 px-3 py-1 text-xs"
                >
                  Rechazar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!loading && drafts.length === 0 && secret.length >= 8 && (
        <p className="text-sm text-zinc-500">No hay piezas en este estado. Aprueba una alerta legal primero.</p>
      )}
    </main>
  );
}
