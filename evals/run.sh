#!/bin/bash
# Runs the eval suite against this plugin once per model and prints trigger
# rates per model.
# Usage: evals/run.sh [skill...]   (no skills: run every case)
#
# EVAL_MODELS (default "sonnet opus haiku") lists the models to run.
# EVAL_REQUIRED (default "sonnet opus") lists the models that must pass; the
# others are reported but don't fail the run. EVAL_RUNS (default 1) sets the
# runs per case for every model, and EVAL_CONCURRENCY (default 4) the runs at
# once. To confirm a close result, rerun with EVAL_RUNS=3.
set -euo pipefail

cd "$(dirname "$0")/.."

read -r -a models <<<"${EVAL_MODELS:-sonnet opus haiku}"
# Only models that run can be required, so EVAL_MODELS=opus checks just Opus.
# If none of them is required, as with EVAL_MODELS=haiku, all of them are.
required=()
for model in ${EVAL_REQUIRED:-sonnet opus}; do
  [[ " ${models[*]} " == *" $model "* ]] && required+=("$model")
done
if [[ ${#required[@]} -eq 0 ]]; then
  required=("${models[@]}")
fi

filters=(--runs "${EVAL_RUNS:-1}")
if [[ $# -gt 0 ]]; then
  filters+=(--tag "$@")
fi

mkdir -p evals/results
results=()
status=0

# Models run one after another, since they share one rate limit. Cases stage a
# fixture repo with their own scaffold script and need Bash, Edit and Write to
# make changes. --threshold 0 leaves pass or fail to the summary. A model whose
# eval fails (for example on a usage limit) doesn't stop the others, and the
# summary still runs; its results file is emptied first, so the summary can't
# read an earlier run's results instead.
for model in "${models[@]}"; do
  out="evals/results/latest-$model.json"
  : >"$out"
  echo "== $model"
  claude plugin eval . \
    --trust-plugin \
    --scaffold \
    --allow-tools Bash Edit Write \
    --ablation none \
    --model "$model" \
    --concurrency "${EVAL_CONCURRENCY:-4}" \
    --threshold 0 \
    --no-publish \
    --json "$out" \
    "${filters[@]}" </dev/null ||
    if [[ " ${required[*]} " == *" $model "* ]]; then status=1; fi
  results+=("$model=$out")
done

node evals/scripts/summary.mjs \
  --required "$(IFS=,; echo "${required[*]-}")" \
  --skills "$(IFS=,; echo "$*")" \
  "${results[@]}" || status=1
exit "$status"
