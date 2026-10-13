#!/bin/sh
# Claude Code PostToolUse hook: formats a markdown file with the repo's Prettier right after Claude edits it.
# Skips anything that is not a regular .md file inside this project. Run `npm install` once to install Prettier.

PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

file=$(node -e '
let input = ""
process.stdin.on("data", (chunk) => { input += chunk })
process.stdin.on("end", () => {
  try {
    process.stdout.write(JSON.parse(input).tool_input?.file_path ?? "")
  } catch {}
})
')

case "$file" in
  "$CLAUDE_PROJECT_DIR"/*.md) ;;
  *) exit 0 ;;
esac

if [ -L "$file" ] || [ ! -f "$file" ]; then
  exit 0
fi

prettier="$CLAUDE_PROJECT_DIR/node_modules/.bin/prettier"

if [ ! -x "$prettier" ]; then
  echo "format-markdown: Prettier is not installed. Run 'npm install'." >&2
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" && "$prettier" --write --log-level warn "$file"
