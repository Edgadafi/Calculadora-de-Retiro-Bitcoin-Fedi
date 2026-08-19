/**
 * Encola un update en Buffer (API personal, no OAuth de terceros).
 * Sin token o perfil no publica: el panel deja el borrador en draft.
 */
import { isBufferConfigured } from '@/lib/config';

export { isBufferConfigured };

export async function enqueueBufferUpdate(text: string): Promise<{ id: string } | { skipped: string }> {
  if (!isBufferConfigured()) {
    return { skipped: 'buffer_not_configured' };
  }

  const token = process.env.BUFFER_ACCESS_TOKEN!.trim();
  const profileId = process.env.BUFFER_PROFILE_ID!.trim();
  const body = new URLSearchParams();
  body.set('access_token', token);
  body.set('text', text.slice(0, 4000));
  body.append('profile_ids[]', profileId);
  body.set('now', 'false');

  const res = await fetch('https://api.bufferapp.com/1/updates/create.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const payload = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    updates?: { id?: string }[];
    message?: string;
    error?: string;
  };

  if (!res.ok || payload.success === false) {
    const reason = payload.message || payload.error || `HTTP ${res.status}`;
    throw new Error(reason);
  }

  const id = payload.updates?.[0]?.id;
  if (!id) throw new Error('Buffer no devolvió id de update');
  return { id };
}
