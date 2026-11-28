#!/usr/bin/env bash
# Runs every *.test.sh under tests/ and fails if any of them fails.
# Usage: tests/run.sh
set -uo pipefail

cd "$(dirname "$0")/.."

status=0
while IFS= read -r test; do
  if bash "$test"; then
    echo "PASS $test"
  else
    echo "FAIL $test"
    status=1
  fi
done < <(find tests -name '*.test.sh' | sort)
exit "$status"
