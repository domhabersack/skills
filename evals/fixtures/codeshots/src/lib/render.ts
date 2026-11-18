export async function renderSnippet(code: string, theme: string): Promise<Uint8Array> {
  // Rendering is stubbed in this fixture.
  return new TextEncoder().encode(`${theme}:${code}`)
}
