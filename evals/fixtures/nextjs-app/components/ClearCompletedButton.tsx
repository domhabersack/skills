'use client'

export function ClearCompletedButton({ onClear }: { onClear: () => void }) {
  return <button onClick={onClear}>Clear completed</button>
}
