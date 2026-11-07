# Repo conventions

This repo is both a skills.sh source and a Claude Code plugin marketplace (single plugin, `source: "./"`).

- Skills live in `skills/<name>/SKILL.md`. The directory name must equal the `name` frontmatter field. Names are kebab-case.
- Subagents live in `agents/<name>.md`. The filename must equal the `name` frontmatter field.
- `templates/` holds starting points only; never put real skills or agents there.
- Keep each skill's `description` specific about when to trigger; it decides whether the skill loads.
- Check every new or changed skill with `/skill-creator` (structure, description triggering, eval cases) and apply its fixes before opening the PR.
- Every agent sets `model` and `effort` to fit its job: cheap, high-volume lookups get `haiku`/`low`; judgment-heavy planning and review get `opus`/`high`. Avoid `inherit`. List the skills it needs under `skills`.
- Bump `version` in `.claude-plugin/plugin.json` when releasing changes.
- Before committing, run `claude plugin validate .` and `npx skills add . --list`.
- Delete files with `trash`, not `rm`.
