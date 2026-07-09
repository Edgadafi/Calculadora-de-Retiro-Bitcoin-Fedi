import { NextRequest, NextResponse } from 'next/server';
import { ALLOWED_ORIGINS } from '@/lib/config';

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/([a-z0-9-]+\.)?fedi\.xyz$/i.test(origin)) return true;
  return false;
}

export function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Secret, X-Cron-Secret',
    Vary: 'Origin',
  };
  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

export function handleOptions(req: NextRequest): NextResponse {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export function jsonWithCors(
  req: NextRequest,
  body: unknown,
  init?: { status?: number; headers?: HeadersInit }
): NextResponse {
  const origin = req.headers.get('origin');
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: { ...corsHeaders(origin), ...(init?.headers as Record<string, string>) },
  });
}

export function assertAllowedOrigin(req: NextRequest): void {
  const origin = req.headers.get('origin');
  if (origin && !isAllowedOrigin(origin)) {
    throw new OriginNotAllowedError();
  }
}

export class OriginNotAllowedError extends Error {
  constructor() {
    super('Origin not allowed');
    this.name = 'OriginNotAllowedError';
  }
}
