import { timingSafeEqual } from 'crypto';

/**
 * Compara dos secretos en tiempo constante para no filtrar información por
 * diferencias de tiempo de respuesta. Devuelve false si el esperado está vacío,
 * de modo que un secreto sin configurar nunca autoriza.
 */
export function matchesSecret(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;

  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');

  // timingSafeEqual exige longitudes iguales; comparar contra un hash de longitud
  // fija evitaría la fuga de longitud, pero aquí basta con rechazar y no ramificar
  // sobre el contenido del secreto.
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
