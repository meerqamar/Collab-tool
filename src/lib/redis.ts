import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory fallback map for local development without active Upstash credentials
const memoryCache = new Map<string, { value: string; expireAt: number }>();

export const redis = (redisUrl && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

/**
 * Helper: Cache-aside wrapper with automatic local fallback
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const now = Date.now();

  // Try Redis first
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached !== null && cached !== undefined) {
        return (typeof cached === 'string' ? JSON.parse(cached) : cached) as T;
      }
    } catch (err) {
      console.warn(`[Redis Caching] Error fetching key "${key}":`, err);
    }
  } else {
    // Check in-memory fallback
    const memItem = memoryCache.get(key);
    if (memItem && memItem.expireAt > now) {
      return JSON.parse(memItem.value) as T;
    }
  }

  // Fetch fresh data
  const fresh = await fetcher();
  const serialized = JSON.stringify(fresh);

  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, serialized);
    } catch (err) {
      console.warn(`[Redis Caching] Error setting key "${key}":`, err);
    }
  } else {
    memoryCache.set(key, { value: serialized, expireAt: now + ttlSeconds * 1000 });
  }

  return fresh;
}
