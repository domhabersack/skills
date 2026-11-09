# Spec: import snippets from CSV

Issue: #14 · Author: @codeshots-owner · Status: approved

## Requirements

1. The import page accepts a CSV with the columns `title`, `language`, and `code`.
2. Each valid row becomes a snippet in the user's library.
3. Invalid rows are skipped and reported.

## Design

`importSnippets` in `app/import/actions.ts` parses the uploaded file with papaparse, validates each row, and saves valid rows in one batch.

## Acceptance criteria

- [ ] Importing works well for normal files.
- [ ] Errors are handled nicely.

## Out of scope

- Importing from other formats (JSON, Gist URLs).

## Decisions

- Parse with papaparse: it handles quoted fields and line breaks inside code. (Rejected: splitting on commas, breaks on code containing commas.)
