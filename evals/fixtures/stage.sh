#!/bin/bash
# Stages a fixture repo in the current directory (the eval workspace).
# Usage: stage.sh [--staged] <fixture> [pointer-file]
#
# The fixture becomes a git repo with a short history on main. A pointer file,
# if given, is appended to the repo's CLAUDE.md before the first commit. Each
# directory under the fixture's branches/ becomes a branch off main with one
# commit, for prompts about feature branches. With --staged, the files under
# the fixture's staged/ directory are added on top of main and left staged, for
# prompts about staged changes.
set -euo pipefail

staged=false
if [[ "${1:-}" == "--staged" ]]; then
  staged=true
  shift
fi

fixtures="$(cd "$(dirname "$0")" && pwd)"
fixture="$fixtures/$1"
pointer="${2:-}"

rsync -a --exclude staged/ --exclude branches/ "$fixture"/ ./

if [[ -n "$pointer" ]]; then
  printf '\n' >> CLAUDE.md
  cat "$pointer" >> CLAUDE.md
fi

git init -q -b main
git config user.name "Eval Fixture"
git config user.email "fixture@example.com"
# The runner's global signing or hooks must not break or slow down the fixture.
git config commit.gpgsign false
git config core.hooksPath /dev/null

# A plain, non-conventional history, so the eval shows whether conventions come
# from the skill rather than from copying the log.
commit() {
  local message="$1"
  shift
  git add -- "$@"
  git commit -q -m "$message"
}
commit "Initial commit" package.json .gitignore README.md CLAUDE.md vitest.config.ts
commit "Add date parsing" src/lib/dates.ts src/lib/dates.test.ts
commit "Add tasks API" src/lib/tasks.ts src/lib/redis.ts app/api
commit "Task list, header and pricing" components
commit "Recurring tasks, import and settings" src/lib/recurrence.ts app/import app/settings
commit "Old migrations + review policy" scripts REVIEW.md

if [[ -d "$fixture/branches" ]]; then
  for branch_dir in "$fixture/branches"/*/; do
    branch="$(basename "$branch_dir")"
    git switch -q -c "$branch"
    rsync -a "$branch_dir" ./
    git add -A
    git commit -q -m "Add $branch"
    git switch -q main
  done
fi

if [[ "$staged" == true ]]; then
  rsync -a "$fixture/staged"/ ./
  (cd "$fixture/staged" && find . -type f) | git add --pathspec-from-file=-
fi
