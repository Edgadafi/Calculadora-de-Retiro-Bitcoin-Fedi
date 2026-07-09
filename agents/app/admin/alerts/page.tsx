'use client';

import { useCallback, useEffect, useState } from 'react';

type Alert = {
  id: string;
  title: string;
  summary: string;
  source_url: string | null;
  keywords: string[] | null;
  status: string;
  created_at: string;
};

export default function AdminAlertsPage() {
  const [secret, setSecret] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/alerts?status=pending_review', {
        headers: { 'X-Admin-Secret': secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar');
      setAlerts(data.alerts ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    if (secret.length >= 8) load();
  }, [secret, load]);

  async function act(alertId: string, action: 'approve' | 'reject') {
    const res = await fetch('/api/admin/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': secret,
      },
      body: JSON.stringify({ alertId, action, reviewedBy: 'admin-ui' }),
    });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error || 'Error');
    }
  }

  async function seedKb() {
    const res = await fetch('/api/knowledge/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': secret,
      },
      body: JSON.stringify({ action: 'seed' }),
    });
    const data = await res.json();
    alert(res.ok ? `KB seed: ${data.documents} docs, ${data.chunks} chunks` : data.error);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">Legal Alerts — Retiro BTC Agents</h1>
      <p className="text-sm text-zinc-400 mb-6">
        Revisión humana antes de indexar en la base de conocimiento de Rito.
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

      {secret.length >= 8 && (
        <button
          type="button"
          onClick={seedKb}
          className="mb-4 text-sm text-orange-400 underline"
        >
          Re-indexar KB (seed docs del repo)
        </button>
      )}

      {loading && <p className="text-sm text-zinc-500">Cargando…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <ul className="space-y-4 mt-4">
        {alerts.map((a) => (
          <li key={a.id} className="rounded-lg border border-zinc-800 p-4">
            <h2 className="font-medium text-sm">{a.title}</h2>
            <p className="text-xs text-zinc-400 mt-2 whitespace-pre-wrap">{a.summary}</p>
            {a.source_url && (
              <a
                href={a.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-400 mt-2 inline-block"
              >
                Ver fuente DOF
              </a>
            )}
            {a.keywords?.length ? (
              <p className="text-xs text-zinc-500 mt-2">Keywords: {a.keywords.join(', ')}</p>
            ) : null}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => act(a.id, 'approve')}
                className="rounded bg-orange-500 px-3 py-1 text-xs font-medium text-black"
              >
                Aprobar e indexar
              </button>
              <button
                type="button"
                onClick={() => act(a.id, 'reject')}
                className="rounded border border-zinc-600 px-3 py-1 text-xs"
              >
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && alerts.length === 0 && secret.length >= 8 && (
        <p className="text-sm text-zinc-500">No hay alertas pendientes.</p>
      )}
    </main>
  );
}
