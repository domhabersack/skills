export default function SettingsPage() {
  return (
    <main>
      <h1>Account Settings</h1>
      <section>
        <h2>Default List</h2>
        <label htmlFor="list">New tasks go to</label>
        <select id="list" />
      </section>
      <section>
        <h2>API keys</h2>
        <button type="button">Generate New Key</button>
      </section>
    </main>
  )
}
