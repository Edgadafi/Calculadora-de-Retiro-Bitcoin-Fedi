/**
 * Marca del plan dentro del memo de la factura Lightning.
 *
 * El memo lo fija el servidor al crear la factura, así que al confirmar el pago
 * es una fuente confiable del plan comprado: el cliente no puede alterarlo sin
 * invalidar la factura. Se usa un marcador legible por máquina porque el resto
 * del memo está localizado y no sirve para identificar el plan.
 */

const MARKER = /\[plan:(monthly|lifetime)\]/;

export function buildPlanMemo(memo, plan) {
  if (!plan) return memo;
  return `${memo} [plan:${plan}]`;
}

/** @returns {'monthly'|'lifetime'|null} */
export function parsePlanFromMemo(memo) {
  if (typeof memo !== 'string') return null;
  const match = memo.match(MARKER);
  return match ? match[1] : null;
}
