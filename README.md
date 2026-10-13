# skills

My agent skills and Claude Code subagents.

## Install

**Skills, for any agent** via [skills.sh](https://www.skills.sh):

```sh
npx skills add domhabersack/skills
```

**Skills and subagents, in Claude Code** via the plugin marketplace:

```
/plugin marketplace add domhabersack/skills
/plugin install skills@domhabersack
```

skills.sh only installs skills. Subagents in `agents/` are Claude Code-specific and come with the plugin.

## Layout

```
.claude-plugin/
  marketplace.json   Claude Code marketplace manifest
  plugin.json        plugin manifest (version lives here)
skills/<name>/SKILL.md   one directory per skill
agents/<name>.md         one file per subagent
templates/               copy-paste starting points (not published)
```

## Adding things

- **Skill:** copy `templates/skill-template.md` to `skills/<name>/SKILL.md`. Put supporting files next to it.
- **Subagent:** copy `templates/agent-template.md` to `agents/<name>.md`.

Names are kebab-case and must match the directory (skills) or filename (agents).

## Formatting

Markdown is formatted with [Prettier](https://prettier.io), which also aligns tables.

```sh
npm install          # installs Prettier and enables the git pre-commit hook
npm run format       # format all markdown
npm run format:check # verify (also runs in CI)
```

The hook in `.githooks/pre-commit` formats staged `.md` files on commit. It is a plain git hook that `npm install` activates via `core.hooksPath`. No other tooling is needed, and any editor or agent can run `npm run format`.

Claude Code also formats each markdown file right after it edits it. The hook is configured in `.claude/settings.json` and runs `.claude/hooks/format-markdown.sh`, so anyone who opens this repo in Claude Code gets it after trusting the project. It is deliberately a project hook and not part of the plugin: plugin hooks would run in the projects of everyone who installs the plugin.

## Validate

```sh
claude plugin validate .
npx skills add . --list
```

## License

MIT
