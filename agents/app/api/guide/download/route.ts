import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { data: lead } = await supabase
      .from('leads')
      .select('guide_token_expires_at')
      .eq('guide_token', token)
      .maybeSingle();

    if (!lead) {
      return NextResponse.json({ error: 'Enlace inválido o expirado' }, { status: 404 });
    }
    if (lead.guide_token_expires_at && new Date(lead.guide_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Enlace expirado' }, { status: 410 });
    }
  }

  const guideUrl = process.env.GUIDE_PDF_URL || '/guia-retiro-mexico.pdf';
  if (guideUrl.startsWith('http')) {
    return NextResponse.redirect(guideUrl);
  }

  return NextResponse.redirect(new URL(guideUrl, req.url));
}
