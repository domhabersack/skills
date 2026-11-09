import { describe, expect, it } from 'vitest'
import { parseDate } from './dates'

describe('parseDate', () => {
  it('returns null for empty input', () => {
    expect(parseDate(null)).toBeNull()
    expect(parseDate('')).toBeNull()
  })

  it('reads unix seconds and milliseconds', () => {
    expect(parseDate(1700000000)?.toISOString()).toBe('2023-11-14T22:13:20.000Z')
    expect(parseDate('1700000000000')?.toISOString()).toBe('2023-11-14T22:13:20.000Z')
  })

  it('reads ISO strings', () => {
    expect(parseDate('2024-02-29T12:00:00Z')?.toISOString()).toBe('2024-02-29T12:00:00.000Z')
  })
})
