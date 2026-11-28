#!/usr/bin/env bash
# Creates the agent pipeline's labels in a GitHub repository. Labels that
# already exist are left alone, including their colors and descriptions, so
# running it again changes nothing.
# Usage: labels.sh [owner/repo]   (default: the repository in the current directory)
set -euo pipefail

repo="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"

# name|color|description
labels=(
  "agent|5319e7|The pipeline may work on this issue"
  "intent:needs-grilling|fbca04|Waiting for a grilling session with the owner"
  "spec:approved|0e8a16|Intent and spec approved; the plan comes next"
  "plan:needs-review|fbca04|The plan is waiting for the owner's review"
  "plan:changes-requested|d93f0b|The owner asked for changes to the plan"
  "plan:approved|0e8a16|Plan approved; the build comes next"
  "build:in-progress|1d76db|An agent is building the plan"
  "build:blocked|b60205|The build needs the owner before it can go on"
  "pr:needs-review|fbca04|The pull request is waiting for the owner"
)

existing="$(gh label list --repo "$repo" --limit 1000 --json name --jq '.[].name')"

for label in "${labels[@]}"; do
  IFS="|" read -r name color description <<<"$label"
  if grep -qxF -- "$name" <<<"$existing"; then
    echo "exists   $name"
  else
    gh label create "$name" --repo "$repo" --color "$color" --description "$description" >/dev/null
    echo "created  $name"
  fi
done
