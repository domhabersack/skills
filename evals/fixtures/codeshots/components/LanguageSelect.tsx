const languages = ['typescript', 'python', 'rust', 'go']

export function LanguageSelect({ value, onChange }: { value: string; onChange: (language: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {languages.map((language) => (
        <option key={language}>{language}</option>
      ))}
    </select>
  )
}
