# Repo conventions

This repo is both a skills.sh source and a Claude Code plugin marketplace (single plugin, `source: "./"`).

- Skills live in `skills/<name>/SKILL.md`. The directory name must equal the `name` frontmatter field. Names are kebab-case.
- Subagents live in `agents/<name>.md`. The filename must equal the `name` frontmatter field.
- `templates/` holds starting points only; never put real skills or agents there.
- Keep each skill's `description` specific about when to trigger; it decides whether the skill loads.
- Bump `version` in `.claude-plugin/plugin.json` when releasing changes.
- Before committing, run `claude plugin validate .` and `npx skills add . --list`.
- Run `npm run format` after creating or editing any markdown file (skills, agents, templates, docs). `npm run format:check` verifies it; CI fails on unformatted markdown.
- Claude Code formats markdown automatically after each edit via `.claude/hooks/format-markdown.sh`. Other agents must run `npm run format` themselves.
- After cloning, run `npm install`. It installs Prettier and enables the `.githooks/pre-commit` hook, which formats staged markdown. Never bypass hooks with `--no-verify`.
- Delete files with `trash`, not `rm`.
