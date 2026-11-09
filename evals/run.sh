#!/bin/bash
# Runs the eval suite against this plugin and prints trigger rates.
# Usage: evals/run.sh [skill...]   (no skills: run every case)
#
# EVAL_MODEL (default sonnet), EVAL_RUNS (default: each case's runs) and
# EVAL_CONCURRENCY (default 4) tune the run.
set -euo pipefail

cd "$(dirname "$0")/.."

filters=()
if [[ $# -gt 0 ]]; then
  filters+=(--tag "$@")
fi
if [[ -n "${EVAL_RUNS:-}" ]]; then
  filters+=(--runs "$EVAL_RUNS")
fi

out="evals/results/latest.json"
mkdir -p evals/results

# Cases stage a fixture repo with their own scaffold script and need Bash, Edit
# and Write to make changes. --threshold 0 leaves pass or fail to the summary.
claude plugin eval . \
  --trust-plugin \
  --scaffold \
  --allow-tools Bash Edit Write \
  --ablation none \
  --model "${EVAL_MODEL:-sonnet}" \
  --concurrency "${EVAL_CONCURRENCY:-4}" \
  --threshold 0 \
  --no-publish \
  --json "$out" \
  ${filters[@]+"${filters[@]}"} </dev/null

node evals/scripts/summary.mjs "$out"
