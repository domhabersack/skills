---
name: adopt-ai-sdlc
description: Use when opting a GitHub repository into the agent pipeline (grill, plan, build, review), or when asked to adopt, onboard, or set up a repo for the AI SDLC, the agent workflow, or the work-issues loop, including `/skills:adopt-ai-sdlc`. Creates the pipeline labels (`agent`, `intent:needs-grilling`, `spec:approved`, `plan:*`, `build:*`, `pr:needs-review`), makes sure CLAUDE.md has one-command build, test, and lint with healthy output under “Commands” and “Verifying your work”, and adds a REVIEW.md, all through a pull request. Use it even when the request only says “set up the agent labels”, “get this repo ready for the agents”, or “the loop says this repo isn’t adopted”. Not for applying a label to an issue or for running a pipeline stage.
---

# Adopt the AI SDLC

Opting a repository in gives the pipeline what it needs from that repository:

- **Labels**, so issues and pull requests can move through the stages.
- **Commands and verification in `CLAUDE.md`**, so agents can build, test, and lint without guessing, and can tell a healthy run from a broken one.
- **A review policy in `REVIEW.md`**, so reviewers agree on what blocks a change and what does not.

A repository counts as adopted when its default branch has a `CLAUDE.md` with both sections below and a `REVIEW.md`. Labels alone don’t count, because they exist before the pull request is merged.

## Before you start

- Confirm `gh auth status` succeeds and the repository has a GitHub remote. Without them, stop and say what is missing.
- Find the default branch with `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`, and fetch it.
- Look for an open pull request from an earlier run: `gh pr list --head agent/adopt-ai-sdlc --state open`. If one exists, update that branch instead of opening a second pull request.
- Work in a git worktree on the branch `agent/adopt-ai-sdlc`, created from the default branch, so the person’s checkout is left alone. Never commit to the default branch.

## 1. Labels

Run `scripts/labels.sh owner/repo` from this skill’s folder. It creates any of these labels that are missing and leaves existing ones alone, including their colors and descriptions:

| Label                     | Meaning                                         |
| ------------------------- | ----------------------------------------------- |
| `agent`                   | The pipeline may work on this issue             |
| `intent:needs-grilling`   | Waiting for a grilling session with the owner   |
| `spec:approved`           | Intent and spec approved; the plan comes next   |
| `plan:needs-review`       | The plan is waiting for the owner’s review      |
| `plan:changes-requested`  | The owner asked for changes to the plan         |
| `plan:approved`           | Plan approved; the build comes next             |
| `build:in-progress`       | An agent is building the plan                   |
| `build:blocked`           | The build needs the owner before it can go on   |
| `pr:needs-review`         | The pull request is waiting for the owner       |

Labels are repository settings, not files, so they are created directly rather than through the pull request. Report what the script printed.

## 2. Commands and verification in CLAUDE.md

Agents need exactly one command each for **build**, **test**, and **lint**, and a description of what a healthy run of each looks like. With one command there is nothing to choose between, and with the healthy output an agent can tell a passing run from one that only exited 0 or ran zero tests.

1. Read `CLAUDE.md`. If it only imports another file (such as `@AGENTS.md`), make the changes in that file instead.
2. Find the commands, in this order: what `CLAUDE.md` already says, then the manifest scripts (`package.json`, `Makefile`, `pyproject.toml`, `Cargo.toml`, and so on), then the CI workflows in `.github/workflows/`. Prefer the form CI runs, with flags that make it run once and exit (for example `npm test -- --run` for Vitest).
3. If a command is unknown, or the sources disagree, ask the person. Never guess. If the repository has no linter or no build step, ask whether to record it as “none”, and record that answer.
4. Run each command once and keep its real output. Healthy output is the last few lines that show success: the pass count, “0 errors”, the build summary. If a command fails, or can’t run because dependencies aren’t installed, show the person the output and ask how to proceed. Never write example output you didn’t see: agents compare their runs against it, so invented output teaches them the wrong signal.
5. Make sure `CLAUDE.md` has both sections, keeping everything that is already there:

   ````markdown
   ## Commands

   - `npm run build`: production build
   - `npm test -- --run`: unit tests (Vitest)
   - `npm run lint`: Biome

   ## Verifying your work

   Run build, test, and lint before calling a change done, and show their output. A healthy run ends like this:

   ```
   $ npm test -- --run
    Test Files  12 passed (12)
         Tests  87 passed (87)
   ```
   ````

   - If a section exists, add only what is missing. Don’t reword or reorder lines that are already correct.
   - If `CLAUDE.md` doesn’t exist, create it with just these two sections.

## 3. Review policy in REVIEW.md

- If the repository has no `REVIEW.md`, copy `templates/REVIEW.md` from this skill’s folder to the repository root. Fill in the do-not-report list from what the repository’s tools already enforce: if Biome, Prettier, ESLint, Ruff, or `gofmt` runs in CI or a hook, formatting they fix is not reported.
- If it exists, check that it has severity definitions (what makes a finding Important), review passes, a cap on nits, and a do-not-report list. Add only the parts that are missing, using the template’s wording. The repository’s existing policy wins wherever it says something different.

## 4. Pull request

- If steps 2 and 3 changed nothing, don’t create a branch or a pull request. Say that the repository is already adopted, and list the labels the script created, if any.
- Otherwise, commit each file on its own with a Conventional Commit, such as `docs: add commands and verification to CLAUDE.md` and `docs: add review policy`.
- Push, then open the pull request (or update the open one). Its description follows the pull request structure in `engineering-standards`, with the real command output under Verification.
- Never merge it. Adoption takes effect when the owner merges.

## Running it again

Every step checks before it changes anything, so a second run on an adopted repository creates no labels, no commits, and no pull request. If it would change something, something drifted. Say what, and open a pull request only for that.
