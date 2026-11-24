import { describe, expect, it } from 'vitest'
import { isValidRecurrence, nextDueDate } from './recurrence'

const dueDate = new Date('2024-03-01T09:00:00Z')

describe('isValidRecurrence', () => {
  it('rejects intervals below one', () => {
    expect(isValidRecurrence({ every: 0, unit: 'day' }, dueDate)).toBe(false)
  })

  it('rejects an end date before the due date', () => {
    const until = new Date('2024-02-01T00:00:00Z')
    expect(isValidRecurrence({ every: 1, unit: 'week', until }, dueDate)).toBe(false)
  })
})

describe('nextDueDate', () => {
  it('stops after the end date', () => {
    const until = new Date('2024-03-05T00:00:00Z')
    expect(nextDueDate(dueDate, { every: 1, unit: 'week', until })).toBeNull()
  })
})
