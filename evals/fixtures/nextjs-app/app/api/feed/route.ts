import { rateLimits } from '@/src/config'
import { rateLimit } from '@/src/lib/rate-limit'
import { listTasks } from '@/src/lib/tasks'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) {
    return new Response('Missing token', { status: 400 })
  }
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!(await rateLimit(`feed:${ip}`, rateLimits.api))) {
    return new Response('Too many requests', { status: 429 })
  }
  const tasks = (await listTasks()).filter((task) => task.dueDate)
  const events = tasks.map((task) => `BEGIN:VEVENT\nSUMMARY:${task.title}\nEND:VEVENT`)
  const calendar = ['BEGIN:VCALENDAR', ...events, 'END:VCALENDAR'].join('\n')
  return new Response(calendar, { headers: { 'content-type': 'text/calendar' } })
}
