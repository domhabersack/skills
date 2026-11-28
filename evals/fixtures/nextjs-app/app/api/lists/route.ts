const lists = ['Inbox', 'Work', 'Personal']

export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get('name')
  if (name && !lists.includes(name)) {
    return Response.json({ error: 'Unknown list' }, { status: 404 })
  }
  return Response.json({ lists })
}
