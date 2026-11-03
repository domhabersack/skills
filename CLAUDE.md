# Repo conventions

This repo is both a skills.sh source and a Claude Code plugin marketplace (single plugin, `source: "./"`).

- Skills live in `skills/<name>/SKILL.md`. The directory name must equal the `name` frontmatter field. Names are kebab-case.
- Subagents are written once in `src/agents/<name>.md` (neutral format, see README). The filename must equal the `name` frontmatter field. Never edit `agents/` (Claude Code) or `opencode/agents/` (opencode) by hand: run `npm run build:agents`, and commit the generated files. CI runs `npm run check:agents`.
- `templates/` holds starting points only; never put real skills or agents there.
- Keep each skill's `description` specific about when to trigger; it decides whether the skill loads.
- Bump `version` in `.claude-plugin/plugin.json` when releasing changes.
- Before committing, run `claude plugin validate .` and `npx skills add . --list`.
- Run `npm run format` after creating or editing any markdown file (skills, agents, templates, docs). `npm run format:check` verifies it; CI fails on unformatted markdown.
- Claude Code formats markdown automatically after each edit via `.claude/hooks/format-markdown.sh`. The formatter rewrites the file right after you edit it, so re-read a markdown file before editing it again. Other agents must run `npm run format` themselves.
- After cloning, run `npm install`. It installs Prettier and enables the `.githooks/pre-commit` hook, which formats staged markdown. Never bypass hooks with `--no-verify`. If dependencies cannot be installed in your environment, say so instead of bypassing the hook.
- Delete files with `trash`, not `rm`.
