import { NextRequest } from 'next/server';
import { runLegalMonitor } from '@/lib/agents/legal-researcher';
import { sendLegalAlertNotification } from '@/lib/email/resend';
import { jsonWithCors } from '@/lib/http/cors';

function assertCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get('x-cron-secret');
  const auth = req.headers.get('authorization');
  return header === secret || auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!assertCron(req)) {
    return jsonWithCors(req, { error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runLegalMonitor();
    if (result.created > 0) {
      await sendLegalAlertNotification({ title: 'DOF scan', count: result.created });
    }
    return jsonWithCors(req, { ok: true, ...result });
  } catch (e) {
    console.error('[legal-monitor]', e);
    return jsonWithCors(req, { error: 'Monitor failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
