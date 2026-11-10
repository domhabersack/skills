const themes = ['dark', 'light', 'solarized']

export function ThemePicker({ value, onChange }: { value: string; onChange: (theme: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {themes.map((theme) => (
        <option key={theme}>{theme}</option>
      ))}
    </select>
  )
}
