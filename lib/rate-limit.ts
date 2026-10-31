import "server-only";

type Bucket = { count: number; resetAt: number };

const MAX_BUCKETS = 10_000;

// In-memory, so limits are per server process and reset on restart.
const buckets = new Map<string, Bucket>();

function removeExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Fixed-window limiter. Returns false once `limit` hits have been recorded
 * for `key` inside the current window.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (buckets.size >= MAX_BUCKETS) removeExpiredBuckets(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
