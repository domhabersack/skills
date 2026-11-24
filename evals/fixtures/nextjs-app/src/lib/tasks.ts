export type Task = { id: string; title: string; done: boolean; dueDate: Date | null }

// Tasks are kept in memory in this fixture.
const tasks: Task[] = []

export async function createTask(title: string, dueDate: Date | null): Promise<Task> {
  const task = { id: crypto.randomUUID(), title, done: false, dueDate }
  tasks.push(task)
  return task
}

export async function listTasks(): Promise<Task[]> {
  return tasks
}
