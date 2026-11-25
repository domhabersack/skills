import { cancelReminder, upcomingReminders } from '@/src/lib/reminders'

export default async function RemindersPage() {
  const taskIds = await upcomingReminders()

  async function cancel(formData: FormData) {
    'use server'
    await cancelReminder(String(formData.get('taskId')))
  }

  return (
    <main>
      <h1>Upcoming reminders</h1>
      <ul>
        {taskIds.map((taskId) => (
          <li key={taskId}>
            <form action={cancel}>
              <input type="hidden" name="taskId" value={taskId} />
              {taskId}
              <button type="submit">Cancel reminder</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  )
}
