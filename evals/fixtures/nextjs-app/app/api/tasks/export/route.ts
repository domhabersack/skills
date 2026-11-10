import { rateLimits } from '@/src/config'
import { rateLimit } from '@/src/lib/rate-limit'
import { listTasks } from '@/src/lib/tasks'

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'Missing API key' }, { status: 401 })
  }
  if (!(await rateLimit(`export:${apiKey}`, rateLimits.api))) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  return Response.json({ tasks: await listTasks() })
}
