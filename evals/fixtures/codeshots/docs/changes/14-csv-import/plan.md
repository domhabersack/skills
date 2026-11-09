# Plan: import snippets from CSV

Issue: #14 · Author: @codeshots-owner · Status: draft

## Files that change

- `app/import/actions.ts`
- `app/import/parse.ts` (new)
- `app/import/parse.test.ts` (new)
- `package.json`

## Order of work

1. Parse CSV rows
   - Test first: `app/import/parse.test.ts` "reads title, language and code columns"
   - Files: `app/import/parse.ts`, `package.json`
   - Example to copy: `src/lib/dates.test.ts:1` (Vitest test layout)
   - Conventions: pin dependency versions exactly
   - Commit: `feat(import): parse snippet rows from csv`
2. Save valid rows from the server action
   - Test first: `app/import/parse.test.ts` "skips rows without code"
   - Files: `app/import/actions.ts`
   - Example to copy: `app/import/actions.ts:3` (form data handling)
   - Conventions: server actions return `{ error }` or a result object
   - Commit: `feat(import): import snippets from csv`

## Risks

- papaparse adds 45 kB to the server bundle. Acceptable for a server action.

## Proof

- Importing works well for normal files → `parse.test.ts`
