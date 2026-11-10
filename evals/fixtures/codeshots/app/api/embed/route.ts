import { rateLimits } from '@/src/config'
import { rateLimit } from '@/src/lib/rate-limit'
import { renderSnippet } from '@/src/lib/render'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  if (!code) {
    return new Response('Missing code', { status: 400 })
  }
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!(await rateLimit(`embed:${ip}`, rateLimits.render))) {
    return new Response('Too many requests', { status: 429 })
  }
  const png = await renderSnippet(code, url.searchParams.get('theme') ?? 'dark')
  return new Response(png, { headers: { 'content-type': 'image/png' } })
}
