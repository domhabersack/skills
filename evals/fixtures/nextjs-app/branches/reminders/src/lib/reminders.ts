import { redis } from './redis'

const KEY = 'reminders'

export async function scheduleReminder(taskId: string, remindAt: Date): Promise<void> {
  await redis.zadd(KEY, remindAt.getTime(), taskId)
}

export async function cancelReminder(taskId: string): Promise<void> {
  await redis.zrem(KEY, taskId)
}

export async function upcomingReminders(now = new Date(), limit = 20): Promise<string[]> {
  return redis.zrangebyscore(KEY, now.getTime(), '+inf', 'LIMIT', 0, limit)
}
