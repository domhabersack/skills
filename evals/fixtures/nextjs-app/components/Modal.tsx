import type { ReactNode } from 'react'

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div role="dialog" aria-label={title}>
      <h2>{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  )
}
