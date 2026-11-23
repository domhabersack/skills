import { clearUserCache } from '~/src/lib/cache'

export default function CacheAdminPage() {
  async function clear(formData: FormData) {
    'use server'
    await clearUserCache(String(formData.get('userId')))
  }

  return (
    <main>
      <h1>Image cache</h1>
      <form action={clear}>
        <label htmlFor="userId">User ID</label>
        <input id="userId" name="userId" />
        <button type="submit">Clear cache</button>
      </form>
    </main>
  )
}
