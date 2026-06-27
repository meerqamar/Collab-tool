import { redis } from './redis';

// Local in-memory sliding window fallback for dev without Redis
const memoryRateLimits = new Map<string, number[]>();

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 900000 // 15 minutes
) {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  if (redis) {
    try {
      const pipeline = redis.pipeline();
      pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
      pipeline.zremrangebyscore(key, 0, windowStart);
      pipeline.zcard(key);
      pipeline.expire(key, Math.ceil(windowMs / 1000));

      const results = await pipeline.exec();
      const requestCount = (results[2] as number) || 1;

      return {
        allowed: requestCount <= maxRequests,
        remaining: Math.max(0, maxRequests - requestCount),
        resetAt: new Date(now + windowMs),
      };
    } catch (err) {
      console.warn(`[RateLimit Redis] Error checking limit for "${identifier}":`, err);
    }
  }

  // Memory fallback
  let timestamps = memoryRateLimits.get(key) || [];
  timestamps = timestamps.filter((t) => t > windowStart);
  timestamps.push(now);
  memoryRateLimits.set(key, timestamps);

  const count = timestamps.length;
  return {
    allowed: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetAt: new Date(now + windowMs),
  };
}
