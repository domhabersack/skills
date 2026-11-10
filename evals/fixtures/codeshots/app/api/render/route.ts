import { rateLimits } from '@/src/config'
import { rateLimit } from '@/src/lib/rate-limit'
import { renderSnippet } from '@/src/lib/render'

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'Missing API key' }, { status: 401 })
  }
  if (!(await rateLimit(`render:${apiKey}`, rateLimits.render))) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  const { code, theme } = await request.json()
  const png = await renderSnippet(code, theme)
  return new Response(png, { headers: { 'content-type': 'image/png' } })
}
