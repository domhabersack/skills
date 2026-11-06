# skills

My agent skills and subagent definitions for Claude Code and opencode.

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

**opencode (v2):**

```sh
# skills: lands in .agents/skills, which opencode reads
npx skills add domhabersack/skills -a opencode

# subagents: opencode has no installer for these, so link the generated files from a clone
git clone https://github.com/domhabersack/skills ~/Developer/skills
mkdir -p ~/.config/opencode/agents
ln -sf ~/Developer/skills/opencode/agents/*.md ~/.config/opencode/agents/
```

For a single project, link into `<project>/.opencode/agents/` instead. Pull the clone to update, and re-run the `ln` line when new agents are added. Run `opencode reload` if opencode is already running.

opencode v2 loads skills from `.agents/skills`, `.claude/skills`, and `.opencode/skills` (project and home directory), so skills installed for Claude Code are found there as well. Subagents are different: opencode does not read `.claude/agents`, and it rejects Claude Code's frontmatter (`tools: Read, Grep` and `model: inherit` make it silently skip the file). That is why `opencode/agents/` exists as a separate set, generated from `agents/`. Both flavors were checked against opencode v2.1.1.

### Choosing models in opencode

The generated agents name no model, so they use the model of the session that runs them, which defaults to the top-level `model` in `~/.config/opencode/opencode.json`. To give one agent a different model on one machine, override it there (or in a project's `opencode.json`):

```json
{
  "model": "mac-studio/qwen3.8:27b",
  "agents": {
    "code-reviewer": { "model": "mac-studio/qwen3.8:27b" }
  }
}
```

Model names are local to each machine, so they never go in this repository.

## Layout

```
.claude-plugin/
  marketplace.json   Claude Code marketplace manifest
  plugin.json        plugin manifest (version lives here)
skills/<name>/SKILL.md      one directory per skill
agents/<name>.md           one file per subagent, for Claude Code (edit these)
opencode/agents/<name>.md  generated for opencode from agents/ (do not edit)
scripts/build-agents.mjs   generates opencode/agents from agents/
templates/                 copy-paste starting points (not published)
```

## Adding things

- **Skill:** copy `templates/skill-template.md` to `skills/<name>/SKILL.md`. Put supporting files next to it.
- **Subagent:** copy `templates/agent-template.md` to `agents/<name>.md`, then run `npm run build:agents`. The generated `opencode/agents/<name>.md` is committed.

Names are kebab-case and must match the directory (skills) or filename (agents).

### Subagent format

Subagents are regular [Claude Code subagents](https://code.claude.com/docs/en/sub-agents). The generator translates them for opencode and fails on anything it cannot translate faithfully, so an opencode agent never quietly gets different permissions than its Claude Code original.

| Key           | Meaning                                                                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Required. Must equal the file name.                                                                                                                                                                               |
| `description` | Required. When to delegate to this agent.                                                                                                                                                                         |
| `tools`       | Optional, comma-separated Claude Code tool names (`Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, `WebFetch`, …). Omit to allow all tools. Tools without an opencode mapping (such as MCP tools) fail the build. |
| `model`       | Optional, Claude Code only. Left out of the opencode agent.                                                                                                                                                       |
| `color`       | Optional, Claude Code only. Left out of the opencode agent.                                                                                                                                                       |

opencode agents never get a model, so each machine decides in its own opencode config (see below). Any other key (`permissionMode`, `disallowedTools`, `mcpServers`, `hooks`, …) fails the build until `scripts/build-agents.mjs` learns to translate it. The generator turns `tools` into opencode permission rules (deny everything, then allow the matching actions: `Bash` becomes `shell`, `Edit`/`Write` become `edit`, and so on). opencode agents are always `mode: subagent`.

## Formatting

Markdown is formatted with [Prettier](https://prettier.io), which also aligns tables.

```sh
npm install          # installs Prettier and enables the git pre-commit hook
npm run format       # format all markdown
npm run format:check # verify (also runs in CI)
```

The hook in `.githooks/pre-commit` regenerates `opencode/agents/` when `agents/` is staged, and formats staged `.md` files on commit. It is a plain git hook that `npm install` activates via `core.hooksPath` (which replaces any hooks in `.git/hooks` for this clone). It handles file names with spaces and non-ASCII characters and renamed files, refuses to touch a file that also has unstaged changes, and aborts the commit if Prettier fails. No other tooling is needed, and any editor or agent can run `npm run format`.

Claude Code also formats each markdown file right after it edits it, and regenerates the opencode agents when it edits a file in `agents/`. The hook is configured in `.claude/settings.json` and runs `.claude/hooks/format-markdown.sh`, so anyone who opens this repo in Claude Code gets it after trusting the project. It is deliberately a project hook and not part of the plugin: plugin hooks would run in the projects of everyone who installs the plugin.

## Validate

```sh
claude plugin validate .
npx skills add . --list
npm run check:agents   # generated opencode agents are up to date (also runs in CI)
```

## License

MIT
