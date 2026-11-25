import type { Task } from '@/src/lib/tasks'

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task">
          <label>
            <input type="checkbox" defaultChecked={task.done} />
            {task.title}
          </label>
          {task.dueDate && <time dateTime={task.dueDate.toISOString()}>{task.dueDate.toLocaleDateString()}</time>}
        </li>
      ))}
    </ul>
  )
}
