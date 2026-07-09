import { getSupabase } from '@/lib/db/supabase';
import { isSupabaseConfigured } from '@/lib/config';

type MemoryBucket = { count: number; windowStart: number };

const memoryBuckets = new Map<string, MemoryBucket>();

function windowKey(bucket: string, windowMs: number): string {
  const slot = Math.floor(Date.now() / windowMs);
  return `${bucket}:${slot}`;
}

async function incrementSupabase(bucket: string, limit: number, windowMs: number): Promise<boolean> {
  const supabase = getSupabase();
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);

  const { data: existing } = await supabase
    .from('rate_limit_buckets')
    .select('count, window_start')
    .eq('bucket_key', bucket)
    .maybeSingle();

  if (!existing || new Date(existing.window_start).getTime() < windowStart.getTime()) {
    await supabase.from('rate_limit_buckets').upsert({
      bucket_key: bucket,
      count: 1,
      window_start: windowStart.toISOString(),
    });
    return true;
  }

  if (existing.count >= limit) return false;

  await supabase
    .from('rate_limit_buckets')
    .update({ count: existing.count + 1 })
    .eq('bucket_key', bucket);

  return true;
}

function incrementMemory(bucket: string, limit: number, windowMs: number): boolean {
  const key = windowKey(bucket, windowMs);
  const current = memoryBuckets.get(key);
  if (!current) {
    memoryBuckets.set(key, { count: 1, windowStart: Date.now() });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

/** Returns true if request is allowed, false if rate limited. */
export async function checkRateLimit(
  bucket: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      return await incrementSupabase(bucket, limit, windowMs);
    } catch {
      return incrementMemory(bucket, limit, windowMs);
    }
  }
  return incrementMemory(bucket, limit, windowMs);
}
