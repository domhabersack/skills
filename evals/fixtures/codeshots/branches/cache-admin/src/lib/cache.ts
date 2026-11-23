import { redis } from './redis'

const TTL_SECONDS = 60 * 60

export function imageKey(userId: string, hash: string): string {
  return `image:${userId}:${hash}`
}

export async function getCachedImage(userId: string, hash: string): Promise<Buffer | null> {
  return redis.getBuffer(imageKey(userId, hash))
}

export async function cacheImage(userId: string, hash: string, image: Uint8Array): Promise<void> {
  await redis.set(imageKey(userId, hash), Buffer.from(image), 'EX', TTL_SECONDS)
}

export async function clearUserCache(userId: string): Promise<number> {
  const keys = await redis.keys(`image:${userId}:*`)
  return keys.length > 0 ? redis.del(...keys) : 0
}
