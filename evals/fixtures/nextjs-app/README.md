# todo-app

A Next.js app (App Router, TypeScript) with:

- a header with a dark mode toggle
- a task list with checkboxes and due dates
- due date parsing and recurring due dates
- pricing cards for a Free and a Pro plan
- a settings page with a default list select and an API key button
- a CSV import action that doesn't parse files yet
- `POST /api/tasks`, which requires an API key and creates a task (kept in memory)
- `GET /api/tasks/export`, which requires an API key and returns every task as JSON
- `GET /api/feed`, a calendar feed of tasks with due dates
- `GET /api/lists`, which returns the list names
