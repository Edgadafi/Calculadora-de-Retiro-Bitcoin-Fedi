/**
 * Chequeo de activación P0 en el proyecto raíz.
 *
 * No autentica: sólo dice si las variables necesarias están presentes, nunca
 * sus valores. Sirve para verificar el deploy de producción sin entrar a Vercel.
 */
import { getP0IngestStatus } from './_lib/purchases.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const status = getP0IngestStatus();
  return res.status(status.ready ? 200 : 503).json({
    phase: 'P0',
    project: 'root',
    ...status,
  });
}
