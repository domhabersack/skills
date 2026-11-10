const themes = ['dark', 'light', 'solarized']

export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get('name')
  if (name && !themes.includes(name)) {
    return Response.json({ error: 'Unknown theme' }, { status: 404 })
  }
  return Response.json({ themes })
}
