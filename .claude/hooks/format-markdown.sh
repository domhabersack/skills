#!/bin/sh
# Claude Code PostToolUse hook: formats a markdown file with the repo's Prettier right after Claude edits it.
# Skips anything that is not a regular .md file inside this project. Run `npm install` once to install Prettier.
# Failures exit with status 2 so Claude sees the message instead of the problem passing silently.

PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  echo "format-markdown: node was not found on PATH, so markdown was not formatted." >&2
  exit 2
fi

file=$(node -e '
let input = ""
process.stdin.on("data", (chunk) => { input += chunk })
process.stdin.on("end", () => {
  try {
    process.stdout.write(JSON.parse(input).tool_input?.file_path ?? "")
  } catch {}
})
')

# Resolve symlinks on both sides (on macOS, /tmp is a link to /private/tmp) before comparing.
project_directory=$(cd -P "$CLAUDE_PROJECT_DIR" 2>/dev/null && pwd -P) || exit 0
file_directory=$(cd -P "$(dirname "$file")" 2>/dev/null && pwd -P) || exit 0
resolved_file="$file_directory/$(basename "$file")"

case "$resolved_file" in
  "$project_directory"/*.md) ;;
  *) exit 0 ;;
esac

if [ -L "$file" ] || [ ! -f "$file" ]; then
  exit 0
fi

prettier="$project_directory/node_modules/.bin/prettier"

if [ ! -x "$prettier" ]; then
  echo "format-markdown: Prettier is not installed, so $file was not formatted. Run 'npm install'." >&2
  exit 2
fi

cd "$project_directory" || exit 0

if ! "$prettier" --write --log-level warn "$resolved_file" >&2; then
  echo "format-markdown: Prettier failed on $file (see above)." >&2
  exit 2
fi
