import { parseDate } from '@/src/lib/dates'
import { createTask } from '@/src/lib/tasks'

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'Missing API key' }, { status: 401 })
  }
  const { title, dueDate } = await request.json()
  const task = await createTask(title, parseDate(dueDate))
  return Response.json(task, { status: 201 })
}
