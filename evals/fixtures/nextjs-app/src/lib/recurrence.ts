export type Recurrence = { every: number; unit: 'day' | 'week' | 'month' }

export function nextDueDate(dueDate: Date, rule: Recurrence): Date {
  const next = new Date(dueDate)
  if (rule.unit === 'day') next.setUTCDate(next.getUTCDate() + rule.every)
  if (rule.unit === 'week') next.setUTCDate(next.getUTCDate() + rule.every * 7)
  if (rule.unit === 'month') next.setUTCMonth(next.getUTCMonth() + rule.every)
  return next
}
