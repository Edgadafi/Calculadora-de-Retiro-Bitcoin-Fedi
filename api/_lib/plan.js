/**
 * `external_reference` de Mercado Pago.
 *
 * Formato actual: `<plan>:<correlationId>`. El formato antiguo era sólo `<plan>`,
 * y se sigue aceptando para no romper checkouts creados antes del despliegue.
 */

export function buildExternalReference(plan, correlationId) {
  return correlationId ? `${plan}:${correlationId}` : plan;
}

/** @returns {{plan: 'monthly'|'lifetime'|null, correlationId: string|null}} */
export function parseExternalReference(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return { plan: null, correlationId: null };

  const [planPart, correlationPart] = value.split(':');
  const plan = planPart === 'monthly' || planPart === 'lifetime' ? planPart : null;
  const correlationId = correlationPart && correlationPart.trim() ? correlationPart.trim() : null;

  return { plan, correlationId };
}
