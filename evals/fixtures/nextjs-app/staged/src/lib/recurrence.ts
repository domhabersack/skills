export type Recurrence = { every: number; unit: 'day' | 'week' | 'month'; until?: Date }

export function isValidRecurrence(rule: Recurrence, dueDate: Date): boolean {
  if (!Number.isInteger(rule.every) || rule.every < 1 || rule.every > 365) return false
  return !rule.until || rule.until > dueDate
}

export function nextDueDate(dueDate: Date, rule: Recurrence): Date | null {
  if (!isValidRecurrence(rule, dueDate)) return null
  const next = new Date(dueDate)
  if (rule.unit === 'day') next.setUTCDate(next.getUTCDate() + rule.every)
  if (rule.unit === 'week') next.setUTCDate(next.getUTCDate() + rule.every * 7)
  if (rule.unit === 'month') next.setUTCMonth(next.getUTCMonth() + rule.every)
  return rule.until && next > rule.until ? null : next
}
