---
name: sdlc-artifacts
description: Use when writing, updating, or reviewing a change’s intent.md, spec.md, or plan.md, or when asked to write up an intent, requirements, a spec, a design, or an implementation plan for an issue or feature before building it. Covers where the files live (docs/changes/ in the target repo), their sections and status line, measurable acceptance criteria, test-first plan steps, recording decisions, and keeping plan.md in sync when the code departs from it. Use it even when the request only says “plan this issue”, “write up what we decided”, or “mark the spec approved”.
---

# SDLC artifacts

A change moves through three files, and each one is committed before the next stage starts:

1. **intent.md** says what is wrong and what should be true afterwards. Approving it starts the spec.
2. **spec.md** says what the change must do, how it will work, and how to tell it is done. Approving it starts the plan.
3. **plan.md** says which files change, in which order, and which tests prove it. Approving it starts the build.

Together with the diff and the review findings, they are the record of what was asked for, what was decided, and why. Someone who never saw the conversation should be able to pick up any stage from the files alone.

## Where they live

- In the target repository at `docs/changes/<issue#>-<slug>/`, for example `docs/changes/42-theme-persistence/`. The slug is the issue title in kebab-case, at most five words.
- Without an issue, use `docs/changes/<slug>/`, and rename the folder once an issue exists.
- Commit the artifacts on the same branch as the code they describe, so the pull request contains both.

## Templates

Start every file from its template in this skill’s `templates/` folder, and keep the section order and headings:

- `templates/intent.md`
- `templates/spec.md`
- `templates/plan.md`

Leave out a section only when it would be empty, never by renaming or merging sections. Readers and agents look for the headings. Problem and Proposed outcome in intent.md, Requirements and Acceptance criteria in spec.md, and Order of work and Proof in plan.md are never empty.

## Status line

Every file has one line under its title:

```
Issue: #42 · Author: @octocat · Status: draft
```

- **Issue** is left out until an issue exists.
- **Author** is whoever asked for the change, usually the issue author, not the agent that drafted it. If you cannot tell, use the GitHub handle or `git config user.name` of the person you are working for.
- **Status** is `draft`, `approved`, or `superseded`. A file is `draft` until a person approves it. Whoever records the approval changes the line and commits it. Never mark an artifact approved on your own judgment.
- When a person asks you to change an approved intent or spec, make the change, set it back to `draft`, and say that it needs approval again. Approval covers the text that was read, not later edits.
- When a later change replaces an artifact, set it to `superseded` and add `Superseded by docs/changes/<folder>/` to the line.

## Size to the change

Every change gets all three files, including one-line fixes. Their length shows how big the change is: a typo fix gets a three-line intent, a spec with one criterion, and a one-step plan. Never skip a file, and never pad one to look thorough.

## intent.md

- Describe the problem and the outcome, not the solution. “Customers see their claim status in the portal” is an outcome; “add a StatusPanel component” is a solution and belongs in the spec.
- Ground the problem in evidence: an issue, a report, a number, a reproduction.
- **Open questions** lists what only a person can answer. Look up anything the code can answer, rather than asking.

## spec.md

- **Requirements** are numbered, so the plan and the review can refer to them (“R2”).
- **Design** names the files, patterns, and data involved, so the plan can build on it.
- **Acceptance criteria** are checkboxes. Each is a measurable statement followed by a `Verified by:` line naming the test (file and test name), the command and its expected output, or the screenshot that proves it. “Works well on mobile” is not a criterion; “The pricing cards have 24px of padding below 640px. Verified by: PricingCards.test.tsx "uses mobile padding"” is.
- **Out of scope** names what a reader might expect but this change leaves out.
- **Concerns** lists risks, open questions carried forward, and conflicts with policies: a `CLAUDE.md` rule or a repository skill (such as `ui-microcopy` for user-facing text) that the requested behavior would break. Say what resolving each conflict needs. Never resolve a policy conflict silently.
- **Decisions** has one bullet per choice: what was chosen and why, plus the rejected option when it was close. Every open question from intent.md ends up either answered under Decisions or carried forward under Concerns.

## plan.md

The bar for a plan: an engineer who has never seen the conversation could implement the change from the plan alone, without searching the codebase.

- **Files that change** lists every file, marking new ones with `(new)`.
- **Order of work** is a numbered list of steps. Each step ends in one commit and lists:
  - **Test first:** the failing test it starts with (file and test name). Steps with no behavior to test, such as documentation, say “none: no behavior change”.
  - **Files:** the files the step touches.
  - **Example to copy:** the `path:line` of an existing pattern the step should follow, with a few words on what it shows, or “none: new pattern”. Check that the line exists and shows what you say it shows.
  - **Conventions:** the rules from `CLAUDE.md` and repository skills that apply to this step.
  - **Commit:** the planned commit message.
- **Risks** says what could break, how likely it is, and what guards against it.
- **Proof** maps every acceptance criterion in spec.md to the test, command, or screenshot that proves it. A criterion without proof means the plan is incomplete.

## When the code departs from the artifacts

- **plan.md:** when the implementation departs from the plan (a different file, order, library, or approach), update plan.md in the same commit as the code. The plan should always describe what was actually built.
- **spec.md:** an approved spec is never edited to match the code. If the implementation cannot meet a requirement or criterion, stop, set the spec back to `draft`, describe the conflict under Concerns, and ask for approval again.
- **intent.md:** if the problem itself turns out to be different, say so and ask before changing anything else.

## Writing style

- Write plain, specific sentences. Name files, functions, numbers, and people instead of describing them.
- Refer to code as `path:line`.
- No filler, no restating the template’s instructions, no summary at the end.
