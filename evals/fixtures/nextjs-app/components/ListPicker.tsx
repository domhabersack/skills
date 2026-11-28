const lists = ['Inbox', 'Work', 'Personal']

export function ListPicker({ value, onChange }: { value: string; onChange: (list: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {lists.map((list) => (
        <option key={list}>{list}</option>
      ))}
    </select>
  )
}
