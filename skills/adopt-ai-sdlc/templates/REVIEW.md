# Review policy

How reviewers, people and agents alike, review changes in this repository. `CLAUDE.md` wins on details of the stack.

## Passes

Review every change in these passes, one at a time:

1. **Bugs:** wrong behavior, unhandled errors, edge cases (empty, boundary, concurrent, failing dependency), and tests that don’t prove what they claim.
2. **Security:** secrets in code or logs, injection, missing or weakened authentication and authorization, and data leaking through errors, logs, or responses.
3. **Compliance:** the change does what its `spec.md` requires and follows its `plan.md`, both in `docs/changes/`. Any divergence from the plan is reported, even when it is an improvement.
4. **Simplicity:** code the change doesn’t need, such as speculative abstractions, options nobody asked for, or duplicated logic.

## Severity

- **Important:** breaks behavior, leaks data, breaches a policy (`CLAUDE.md`, a repository skill, or this file), or diverges from the plan. Important findings block the merge.
- **Nit:** everything else. Report at most 5 nits per review, the most useful ones first.

Every finding names the `path:line` and the rule or requirement behind it.

## Do not report

- Formatting that the formatter or linter already enforces.
- Style preferences that the surrounding code doesn’t follow either.
- Problems in code the change doesn’t touch. Note them under “Noticed, not changed” instead.
