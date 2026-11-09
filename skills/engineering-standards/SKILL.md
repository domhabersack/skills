---
name: engineering-standards
description: Use when writing, changing, refactoring, testing, or reviewing code in any language, and when writing commit messages, opening or describing pull requests, adding dependencies, or deleting files. Covers keeping changes small and in the surrounding style, strict test-first development, conventional commits, what a PR description contains, dependency rules, and hard rules (never bypass hooks or CI, never touch secrets, never rewrite shared history, delete with trash). Use it even when the request only says “fix this”, “add a button”, or “ship it”.
---

# Engineering standards

How code gets written and committed. Each change should be easy to review and revert, and proven to work by evidence rather than by a claim. These rules hold in every language and stack. Stack-specific conventions live in their own skills and in each repository’s `CLAUDE.md`, which wins on details of its stack. The commit format and the hard rules below hold everywhere.

## Keep changes small

- Write the simplest thing that works. Do not add abstractions, options, or extension points for needs that do not exist yet. Three similar lines are cheaper than the wrong abstraction.
- Readability wins over cleverness. Identifiers should be descriptive, the path through the code should be easy to follow.
- Match the surrounding code in naming conventions, idioms, structure, style, and comment density.
- Comments explain why, not what. Do not write comments that narrate the change (e.g. “added this to fix the bug”).
- Touch only what the change needs. No drive-by refactors, renames, or formatting of unrelated code, because they hide the real change in review. Note anything else worth fixing under “Noticed, not changed” in the PR description.
- One concern per pull request. If a change turns out to need a second, unrelated change first, make that its own pull request.

## Dependencies

- Prefer the platform and the dependencies the repository already has. A new dependency is code you did not write, cannot easily review, and have to keep updating.
- When a new dependency is still the right call, justify it in one line in the PR description: what does it replace and why was it not written by hand.
- Always pin exact versions, in every ecosystem: `"zod": "3.25.76"` (not `"^3.25.76"` or `"~3.25.76"`). Ranges let installs drift without a commit that shows it.

## Test first

Every change to behavior starts with a failing test, features included. A test written first proves it can fail, and its failure proves the change was needed. Changes with no behavior to test (documentation, comments, CI configuration, a dependency bump with no code change) skip the test and rely on the repository’s checks.

1. Write a test that describes the new behavior or reproduces the bug.
2. Run it and confirm it fails **for the expected reason** (not a typo, import error, or missing fixture).
3. For a bug fix, commit the failing test on its own (`test: reproduce …`), then fix the code **without editing that test**.
4. Write the code that makes it pass. Run the tests again.
5. Refactor while the tests stay green.

- Write tests in the style the repository already uses: unit tests, Storybook stories with play functions, end-to-end tests.
- Changes that are only visual (spacing, color, layout) are driven by a failing visual test, such as a Playwright screenshot comparison or a story snapshot. There are no exemptions for “just CSS”.
- If the repository has no test setup, or no visual test setup for a visual change, add that setup first in a separate pull request that contains nothing else. The actual change builds on it.
- If a test fails, fix the code, not the test. Change a test only when the behavior it describes was meant to change, and say so in the PR description.

## Verifying before calling it done

- Run the repository’s build, test, and lint commands (see its `CLAUDE.md`) before reporting a task complete.
- Show the real output, trimmed to what matters. “Tests pass” without output is a claim, not evidence.
- For UI changes, include a screenshot of the result.

## Commits

Always use [Conventional Commits](https://www.conventionalcommits.org), including in repositories whose history uses a different style.

```
type(scope): subject in imperative mood, lowercase

Optional body explaining why, when the subject does not make it obvious.

Refs: #42
```

- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `perf`, `build`, `ci`, `chore`.
- Add a scope only when the change sits in one clearly named area: `docs(ui-microcopy): add rule against em dashes`, `fix(editor): keep caret visible in highlighted lines`. Leave it out for changes that cut across areas. Never use an issue number as the scope.
- The subject says what the commit does, in at most 72 characters, without a trailing period.
- Reference issues in a `Refs: #42` footer. The pull request, not the commit, closes the issue.
- Make each commit one logical step that builds and passes its tests, except the deliberately failing test commit of a bug fix.

## Pull requests

Every pull request description follows this structure. Leave out a section when it would be empty, rather than writing “None”.

```markdown
One or two sentences on why this change exists.

Closes #42
Intent, spec, and plan: docs/changes/42-slug/

## Changes

- What changed, as bullets a reviewer can check against the diff

## Verification

$ npm test -- --run
Test Files 41 passed (41)

## Acceptance criteria

- [x] Each criterion, with the evidence that proves it (test name, output, screenshot)

## Risks

- What could break, and how likely it is

## Rollback

- How to undo this safely (revert, flag, data migration to reverse)

## Noticed, not changed

- Problems seen nearby that this pull request leaves alone on purpose
```

- Take the acceptance criteria from the change’s `spec.md` if there is one, otherwise from the issue. If neither has criteria, leave the section out.
- Link the intent, spec, and plan files only when they exist.
- List every new dependency under Changes, with its one-line justification.

## Hard rules

These have no exceptions. If one blocks the task, stop and say so instead of working around it.

- **Never bypass hooks or CI.** Do not use `--no-verify`, and do not skip, disable, or loosen failing tests, lint rules, or checks to get a green result. Fix the cause. A bypassed check turns a visible failure into a hidden one that ships.
- **Secrets are untouchable.** Never read, print, copy, or commit `.env*` files, credential files, keys, or tokens. You may refer to them by name. Tests and fixtures use made-up values. Anything read into a session can end up in a transcript, a log, or a commit.
- **Delete with `trash`, never `rm`,** so a mistaken removal can be restored from the Trash instead of being gone for good.
- **Never rewrite shared history.** No force-push or rebase of the default branch or of anyone else’s branch. Amend or squash only commits that have not been pushed. Rewritten history breaks every other checkout and can silently drop someone’s work.

## Other skills

Apply other installed skills whenever their descriptions match the work, for example `ui-microcopy` for any user-facing string a change adds or edits. These standards do not replace them.

## Checklist before finishing

1. The diff contains only what the change needs, in the surrounding style.
2. Every behavior change has a test that was seen failing first. Bug-fix tests were committed before the fix and left untouched.
3. Build, test, and lint ran, and their real output is in the PR description.
4. New dependencies are justified and pinned to exact versions.
5. Every commit follows Conventional Commits, with issues in a `Refs:` footer.
6. The PR description follows the structure above, including “Noticed, not changed” when anything was noticed.
7. No hook or check was bypassed, no secret was read, nothing was deleted with `rm`, and no shared history was rewritten.
