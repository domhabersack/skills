#!/usr/bin/env bash
# Tests skills/adopt-ai-sdlc/scripts/labels.sh against a fake gh that keeps
# the repository's labels in a file.
set -euo pipefail

script="$(cd "$(dirname "$0")/../.." && pwd)/skills/adopt-ai-sdlc/scripts/labels.sh"
dir="$(mktemp -d)"
trap 'trash "$dir" 2>/dev/null || true' EXIT

mkdir "$dir/bin"
cat >"$dir/bin/gh" <<'GH'
#!/usr/bin/env bash
# Fake gh: `label list` prints the names in $LABELS, `label create` appends
# one and logs the call, `repo view` prints a fixed repository.
case "$1 $2" in
  "label list") cat "$LABELS" ;;
  "label create") echo "$3" >>"$LABELS"; echo "$*" >>"$CALLS" ;;
  "repo view") echo "octocat/hello" ;;
  *) echo "unexpected: gh $*" >&2; exit 1 ;;
esac
GH
chmod +x "$dir/bin/gh"
export PATH="$dir/bin:$PATH" LABELS="$dir/labels" CALLS="$dir/calls"

fail() { echo "  $1" >&2; exit 1; }

# A repository with one pipeline label (customized) and one unrelated label.
printf 'agent\nbug\n' >"$LABELS"
: >"$CALLS"
out="$("$script" octocat/hello)"
[[ "$(grep -c '^created' <<<"$out")" == 8 ]] || fail "first run should create 8 labels: $out"
grep -qx 'exists   agent' <<<"$out" || fail "first run should leave agent alone: $out"
grep -q -- '--repo octocat/hello --color b60205 --description The build needs the owner before it can go on' "$CALLS" ||
  fail "build:blocked should get its color and description: $(cat "$CALLS")"
grep -q 'label create agent' "$CALLS" && fail "agent already existed and must not be recreated"

# Running again changes nothing.
: >"$CALLS"
out="$("$script" octocat/hello)"
[[ "$(grep -c '^exists' <<<"$out")" == 9 ]] || fail "second run should find all 9 labels: $out"
[[ ! -s "$CALLS" ]] || fail "second run should create nothing: $(cat "$CALLS")"

# Without an argument, it uses the current repository.
printf '' >"$LABELS"
: >"$CALLS"
"$script" >/dev/null
grep -q -- '--repo octocat/hello' "$CALLS" || fail "default repo should come from gh repo view"
