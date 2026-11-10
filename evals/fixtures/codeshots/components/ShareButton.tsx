'use client'

export function ShareButton({ url }: { url: string }) {
  return <button onClick={() => navigator.share({ url })}>Share image</button>
}
