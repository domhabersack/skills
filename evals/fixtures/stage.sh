#!/bin/bash
# Stages a fixture repo in the current directory (the eval workspace).
# Usage: stage.sh <fixture> [pointer-file]
#
# The fixture becomes a git repo with a short history. A pointer file, if given,
# is appended to the repo's CLAUDE.md before the first commit. Files under the
# fixture's staged/ directory are added on top and left staged, for prompts
# about staged changes.
set -euo pipefail

fixtures="$(cd "$(dirname "$0")" && pwd)"
fixture="$fixtures/$1"
pointer="${2:-}"

rsync -a --exclude staged/ "$fixture"/ ./

if [[ -n "$pointer" ]]; then
  printf '\n' >> CLAUDE.md
  cat "$pointer" >> CLAUDE.md
fi

git init -q -b main
git config user.name "Eval Fixture"
git config user.email "fixture@example.com"

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
commit "Add render API" src/lib/render.ts src/lib/redis.ts app/api
commit "Editor, header and pricing" components
commit "Checkout and import" app/checkout app/import app/settings
commit "Old migrations + review policy" scripts REVIEW.md

if [[ -d "$fixture/staged" ]]; then
  rsync -a "$fixture/staged"/ ./
  git add -A
fi
