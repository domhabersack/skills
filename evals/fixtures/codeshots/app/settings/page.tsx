export default function SettingsPage() {
  return (
    <main>
      <h1>Account Settings</h1>
      <section>
        <h2>Default Theme</h2>
        <label htmlFor="theme">Editor theme</label>
        <select id="theme" />
      </section>
      <section>
        <h2>API keys</h2>
        <button type="button">Generate New Key</button>
      </section>
    </main>
  )
}
