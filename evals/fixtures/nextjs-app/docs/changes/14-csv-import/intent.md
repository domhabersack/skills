# Intent: import tasks from CSV

Issue: #14 · Author: @todo-app-owner · Status: approved

## Problem

People moving from other todo apps bring hundreds of tasks in exported spreadsheets. Today they retype them one at a time; three support requests last month asked for a bulk import.

## Proposed outcome

A user uploads a CSV of tasks on the import page and sees them in their task list, with a summary of what was imported and what was skipped.

## Affected users and systems

Users moving from other todo apps. `app/import/actions.ts`, the tasks store.

## Constraints

No new server infrastructure. Imports finish within the 10-second server action limit.

## Open questions

1. What is the largest file we accept?
2. What happens to rows that duplicate an existing task?
