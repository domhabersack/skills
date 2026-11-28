const priorities = ['low', 'medium', 'high']

export function PrioritySelect({ value, onChange }: { value: string; onChange: (priority: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {priorities.map((priority) => (
        <option key={priority}>{priority}</option>
      ))}
    </select>
  )
}
