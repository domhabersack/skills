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

opencode v2 loads skills from `.agents/skills`, `.claude/skills`, and `.opencode/skills` (project and home directory), so skills installed for Claude Code are found there as well. Subagents are different: opencode does not read `.claude/agents`, and it rejects Claude Code's frontmatter (`tools: Read, Grep` and `model: inherit` make it silently skip the file). That is why `opencode/agents/` exists as a separate, generated set. Both flavors were checked against opencode v2.1.1.

## Layout

```
.claude-plugin/
  marketplace.json   Claude Code marketplace manifest
  plugin.json        plugin manifest (version lives here)
skills/<name>/SKILL.md      one directory per skill
src/agents/<name>.md       subagent source files (edit these)
agents/<name>.md           generated for Claude Code (do not edit)
opencode/agents/<name>.md  generated for opencode (do not edit)
scripts/build-agents.mjs   generates the two agent sets from src/agents
templates/                 copy-paste starting points (not published)
```

## Adding things

- **Skill:** copy `templates/skill-template.md` to `skills/<name>/SKILL.md`. Put supporting files next to it.
- **Subagent:** copy `templates/agent-template.md` to `src/agents/<name>.md`, then run `npm run build:agents`. The generated `agents/<name>.md` and `opencode/agents/<name>.md` are committed.

Names are kebab-case and must match the directory (skills) or filename (agents).

### Subagent source format

One neutral file per agent. Only `name` and `description` are required; unknown keys are rejected.

| Key              | Meaning                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | Must equal the file name.                                                                                                                                                       |
| `description`    | When to delegate to this agent.                                                                                                                                                 |
| `tools`          | Optional allow-list of Claude Code tool names (`Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, `WebFetch`, …). Omit to allow all tools.                                        |
| `model`          | Optional, Claude Code only: `inherit`, `sonnet`, `opus`, or `haiku`.                                                                                                            |
| `opencode-model` | Optional, opencode only, as `provider/model`. Left out by default so opencode uses whatever model the user has configured. Any model name would break users on other providers. |

The generator turns the `tools` list into `tools: Read, Grep` for Claude Code, and into opencode permission rules (deny everything, then allow the matching actions: `Bash` becomes `shell`, `Edit`/`Write` become `edit`, and so on). opencode agents are always `mode: subagent`.

## Formatting

Markdown is formatted with [Prettier](https://prettier.io), which also aligns tables.

```sh
npm install          # installs Prettier and enables the git pre-commit hook
npm run format       # format all markdown
npm run format:check # verify (also runs in CI)
```

The hook in `.githooks/pre-commit` regenerates the agent files when `src/agents/` is staged, and formats staged `.md` files on commit. It is a plain git hook that `npm install` activates via `core.hooksPath` (which replaces any hooks in `.git/hooks` for this clone). It handles file names with spaces and non-ASCII characters and renamed files, refuses to touch a file that also has unstaged changes, and aborts the commit if Prettier fails. No other tooling is needed, and any editor or agent can run `npm run format`.

Claude Code also formats each markdown file right after it edits it, and regenerates the agent files when it edits an agent source. The hook is configured in `.claude/settings.json` and runs `.claude/hooks/format-markdown.sh`, so anyone who opens this repo in Claude Code gets it after trusting the project. It is deliberately a project hook and not part of the plugin: plugin hooks would run in the projects of everyone who installs the plugin.

## Validate

```sh
claude plugin validate .
npx skills add . --list
npm run check:agents   # generated agents are up to date (also runs in CI)
```

## License

MIT
