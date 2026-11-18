import { renderSnippet } from '@/src/lib/render'

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return Response.json({ error: 'Missing API key' }, { status: 401 })
  }
  const { code, theme } = await request.json()
  const png = await renderSnippet(code, theme)
  return new Response(png, { headers: { 'content-type': 'image/png' } })
}
