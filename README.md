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

## Skills

| Skill                   | What it covers                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `engineering-standards` | Small changes, test-first, conventional commits, PR descriptions, dependencies, and hard rules |
| `ui-microcopy`          | Casing, typography, and wording of buttons, labels, headings, and other UI strings             |

## Layout

```
.claude-plugin/
  marketplace.json   Claude Code marketplace manifest
  plugin.json        plugin manifest (version lives here)
skills/<name>/SKILL.md   one directory per skill
agents/<name>.md         one file per subagent
templates/               copy-paste starting points (not published)
evals/                   eval cases, fixtures, and the runner
```

## Adding things

- **Skill:** copy `templates/skill-template.md` to `skills/<name>/SKILL.md`. Put supporting files next to it.
- **Subagent:** copy `templates/agent-template.md` to `agents/<name>.md`.

Names are kebab-case and must match the directory (skills) or filename (agents).

## Evals

Every skill has trigger evals: prompts that should load it before the first edit, commit, or pull request, and near-misses that should not load it at all. Each prompt runs against a small fixture repo in `evals/fixtures/`. `engineering-standards` runs twice, with and without the pointer in `CLAUDE.md`.

```sh
evals/run.sh                        # every skill
evals/run.sh engineering-standards  # one skill
```

The run prints how often each skill loaded and fails when a skill loads for fewer than 80% of its prompts or for any near-miss. It uses whatever `claude` is logged in with, so on a Claude subscription it counts against the plan’s usage limits instead of costing API credits. A full run is 150 sessions; `EVAL_RUNS=1` cuts that to a third. `EVAL_MODEL` (default `sonnet`) overrides the model. The full report is in `evals/results/`.

To add evals for a skill, write `evals/<skill>/queries.json` and generate its cases:

```sh
node evals/scripts/trigger-cases.mjs <skill>
```

Evals run locally only. Run them for every skill a pull request adds or changes before opening it.

## Validate

```sh
claude plugin validate .
npx skills add . --list
```

## License

MIT
