# Intent: import snippets from CSV

Issue: #14 · Author: @codeshots-owner · Status: approved

## Problem

Teams moving from other tools have hundreds of snippets in spreadsheets. Today they paste them in one at a time; three support requests last month asked for a bulk import.

## Proposed outcome

A user uploads a CSV of snippets on the import page and sees them in their library, with a summary of what was imported and what was skipped.

## Affected users and systems

Users migrating from other tools. `app/import/actions.ts`, the snippets store.

## Constraints

No new server infrastructure. Imports finish within the 10-second server action limit.

## Open questions

1. What is the largest file we accept?
2. What happens to rows that duplicate an existing snippet?
