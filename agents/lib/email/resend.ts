import { Resend } from 'resend';
import { AGENTS_BASE_URL, isResendConfigured } from '@/lib/config';
import { redactEmail } from '@/lib/privacy/hash';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Retiro BTC <onboarding@retirobtc.mx>';

export async function sendGuideEmail(params: {
  to: string;
  name: string;
  guideUrl: string;
}): Promise<{ ok: boolean; id?: string; skipped?: boolean }> {
  if (!isResendConfigured()) {
    console.info('[resend] skipped (no API key)', { to: redactEmail(params.to) });
    return { ok: true, skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: 'Tu guía: Tu Retiro en México — retirobtc.mx',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 1.25rem;">Hola ${escapeHtml(params.name)},</h1>
        <p>Gracias por descargar la guía <strong>Tu Retiro en México</strong>.</p>
        <p>En 7 claves entenderás retiro, inflación y el papel de Bitcoin en tu planeación — sin custodia de terceros.</p>
        <p style="margin: 24px 0;">
          <a href="${params.guideUrl}" style="background: #f7931a; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Descargar guía
          </a>
        </p>
        <p style="font-size: 0.875rem; color: #666;">
          Este enlace expira en 7 días. ¿Dudas? Visita <a href="https://retirobtc.mx">retirobtc.mx</a> y pregunta a Rito.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 0.75rem; color: #999;">
          Ramesa S.A. de C.V. · retirobtc.mx · <a href="https://retirobtc.mx/aviso-privacidad">Aviso de Privacidad</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[resend]', error);
    return { ok: false };
  }
  return { ok: true, id: data?.id };
}

export async function sendEscalationEmail(params: {
  sessionKey: string;
  userMessage: string;
}): Promise<void> {
  const to = process.env.ESCALATION_EMAIL || 'calculadora.retirobtc@gmail.com';
  if (!isResendConfigured()) {
    console.info('[escalation]', params);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `[Rito] Escalamiento humano — sesión ${params.sessionKey.slice(0, 8)}`,
    text: `Sesión: ${params.sessionKey}\n\nMensaje del usuario:\n${params.userMessage}\n\nPanel: ${AGENTS_BASE_URL}/admin/alerts`,
  });
}

export async function sendLegalAlertNotification(params: {
  title: string;
  count: number;
}): Promise<void> {
  const to = process.env.ESCALATION_EMAIL || 'calculadora.retirobtc@gmail.com';
  if (!isResendConfigured() || params.count === 0) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `[Legal Monitor] ${params.count} alerta(s) nueva(s) — DOF`,
    text: `Se detectaron ${params.count} publicación(es) relevantes en el DOF.\n\nÚltima: ${params.title}\n\nRevisar: ${AGENTS_BASE_URL}/admin/alerts`,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
