import { describe, expect, it, vi } from 'vitest'
import { rateLimit } from './rate-limit'

const counts = new Map<string, number>()
vi.mock('./redis', () => ({
  redis: {
    incr: async (key: string) => {
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts.get(key)
    },
    expire: async () => 1,
  },
}))

describe('rateLimit', () => {
  it('blocks requests once the window is used up', async () => {
    const limit = { limit: 2, windowSeconds: 60 }
    expect(await rateLimit('test', limit)).toBe(true)
    expect(await rateLimit('test', limit)).toBe(true)
    expect(await rateLimit('test', limit)).toBe(false)
  })
})
