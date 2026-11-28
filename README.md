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

| Skill                   | What it covers                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `engineering-standards` | Small changes, test-first, conventional commits, PR descriptions, dependencies, and hard rules               |
| `sdlc-artifacts`        | Intent, spec, and plan files for a change: where they live, their sections, status, and keeping them in sync |
| `ui-microcopy`          | Casing, typography, and wording of buttons, labels, headings, and other UI strings                           |

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

The runner needs `claude` and Node.js on your `PATH`.

Skills here should work for anyone, whichever model they prompt with, so every prompt runs once on Sonnet, Opus and Haiku, and each model gets its own verdict. The run prints how often each skill loaded per model, and fails when a skill loads for fewer than 80% of its prompts or for any near-miss on Sonnet or Opus. Haiku is reported but doesn't fail the run. One run per model can be unlucky: when a case fails on one model only, rerun that skill with `EVAL_RUNS=3` before changing its description.

`EVAL_MODELS` (default `sonnet opus haiku`) picks the models and `EVAL_REQUIRED` (default `sonnet opus`) the ones that must pass. With `EVAL_MODELS=opus`, only Opus runs and must pass. A full run is 150 sessions, about the cost of 150 Sonnet sessions, since Opus costs twice as much per token as Sonnet and Haiku a twentieth. It uses whatever `claude` is logged in with, so on a Claude subscription it counts against the plan’s usage limits instead of costing API credits. The full reports are in `evals/results/`.

To add evals for a skill, write `evals/<skill>/queries.json` and generate its cases:

```sh
node evals/scripts/trigger-cases.mjs <skill>
```

A query can set `"staged": true` to start with the fixture's `staged/` files staged on `main`. Every fixture directory under `branches/` becomes a branch off `main`. A fixture keeps its manifest as `package.fixture.json`, which becomes `package.json` in the sandbox, so GitHub doesn’t raise Dependabot alerts for a project that is never installed.

Evals run locally only. Run them for every skill a pull request adds or changes before opening it.

## Validate

```sh
claude plugin validate .
npx skills add . --list
```

## License

MIT
