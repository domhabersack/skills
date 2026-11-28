import { redis } from './redis'

type Limit = { limit: number; windowSeconds: number }

// Fixed-window counter in Redis. Returns false once the key has used up its window.
export async function rateLimit(key: string, { limit, windowSeconds }: Limit): Promise<boolean> {
  const count = await redis.incr(`ratelimit:${key}`)
  if (count === 1) {
    await redis.expire(`ratelimit:${key}`, windowSeconds)
  }
  return count <= limit
}
