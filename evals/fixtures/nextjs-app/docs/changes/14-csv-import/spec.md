# Spec: import tasks from CSV

Issue: #14 · Author: @todo-app-owner · Status: approved

## Requirements

1. The import page accepts a CSV with the columns `title`, `due_date`, and `done`.
2. Each valid row becomes a task in the user's task list.
3. Invalid rows are skipped and reported.

## Design

`importTasks` in `app/import/actions.ts` parses the uploaded file with papaparse, reads due dates with `parseDate`, validates each row, and saves valid rows in one batch.

## Acceptance criteria

- [ ] Importing works well for normal files.
- [ ] Errors are handled nicely.

## Out of scope

- Importing from other formats (JSON, other apps' backup files).

## Decisions

- Parse with papaparse: it handles quoted fields and line breaks inside titles. (Rejected: splitting on commas, breaks on titles containing commas.)
