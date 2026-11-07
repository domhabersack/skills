#!/usr/bin/env node
// Generates opencode subagent definitions from the Claude Code ones.
//
//   agents/<name>.md  ->  opencode/agents/<name>.md  (opencode v2)
//
// agents/ is the source of truth and is also what the Claude Code plugin serves.
//
// Usage:
//   node scripts/build-agents.mjs            write generated files
//   node scripts/build-agents.mjs --check    fail if generated files are missing, outdated, or stale
//   node scripts/build-agents.mjs --root DIR operate on another repository root (used for testing)

import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'
import { parse, stringify } from 'yaml'

const SOURCE_DIRECTORY = 'agents'
const OPENCODE_DIRECTORY = 'opencode/agents'

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

// A file with the same name replaces opencode's own agent, which would break its default agents for anyone who links
// the generated files globally.
const OPENCODE_BUILT_IN_AGENTS = ['build', 'plan', 'general', 'explore', 'compaction', 'summary', 'title']

// Keys the generator translates for opencode.
const TRANSLATED_KEYS = ['name', 'description', 'tools']

// Claude Code keys left out of the opencode agent because they cannot change what it may do. opencode agents never
// get a model: each machine picks one in its own opencode config, so the repository stays free of local model names.
const DROPPED_KEYS = ['model', 'color']

// Claude Code tool names and the opencode v2 permission action each one maps to.
const OPENCODE_ACTION_BY_TOOL = {
  Read: 'read',
  Grep: 'grep',
  Glob: 'glob',
  Edit: 'edit',
  MultiEdit: 'edit',
  Write: 'edit',
  NotebookEdit: 'edit',
  Bash: 'shell',
  WebFetch: 'webfetch',
  WebSearch: 'websearch',
  Agent: 'subagent',
  Skill: 'skill',
}

const isCheck = process.argv.includes('--check')
const rootFlagIndex = process.argv.indexOf('--root')
const root =
  rootFlagIndex === -1
    ? resolve(dirname(fileURLToPath(import.meta.url)), '..')
    : resolve(process.argv[rootFlagIndex + 1])

function fail(message) {
  console.error(`build-agents: ${message}`)
  process.exit(1)
}

// Claude Code writes tools as a comma-separated string; a YAML list is accepted too.
function parseTools(path, tools) {
  const list = typeof tools === 'string' ? tools.split(',').map((tool) => tool.trim()) : tools

  if (!Array.isArray(list) || list.length === 0 || list.some((tool) => typeof tool !== 'string' || tool === '')) {
    fail(`${path}: "tools" must be a non-empty, comma-separated list (omit it to allow all tools)`)
  }

  // Anything unmapped (MCP tools, Agent(type) restrictions, …) would silently widen or narrow opencode's permissions.
  const unknownTools = list.filter((tool) => !(tool in OPENCODE_ACTION_BY_TOOL))

  if (unknownTools.length > 0) {
    fail(
      `${path}: no opencode equivalent for tools: ${unknownTools.join(', ')} (known: ${Object.keys(OPENCODE_ACTION_BY_TOOL).join(', ')}). Add a mapping to scripts/build-agents.mjs.`,
    )
  }

  return list
}

function parseSource(path) {
  const name = basename(path, '.md')
  const match = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    fail(`${path}: missing frontmatter`)
  }

  const frontmatter = parse(match[1]) ?? {}

  // Fail rather than drop: keys like permissionMode, disallowedTools, mcpServers, or hooks change what the agent
  // may do, and an opencode agent without them would quietly behave differently from the Claude Code one.
  const untranslatableKeys = Object.keys(frontmatter).filter(
    (key) => !TRANSLATED_KEYS.includes(key) && !DROPPED_KEYS.includes(key),
  )

  if (untranslatableKeys.length > 0) {
    fail(
      `${path}: no opencode equivalent for: ${untranslatableKeys.join(', ')}. Remove them, or teach scripts/build-agents.mjs to translate them (supported: ${[...TRANSLATED_KEYS, ...DROPPED_KEYS].join(', ')}).`,
    )
  }

  if (!NAME_PATTERN.test(name)) {
    fail(`${path}: file name must be kebab-case`)
  }

  if (OPENCODE_BUILT_IN_AGENTS.includes(name)) {
    fail(`${path}: "${name}" is a built-in opencode agent and would replace it; choose another name`)
  }

  if (frontmatter.name !== name) {
    fail(`${path}: "name" must equal the file name ("${name}")`)
  }

  if (typeof frontmatter.description !== 'string' || frontmatter.description.trim() === '') {
    fail(`${path}: "description" is required`)
  }

  const tools = frontmatter.tools === undefined ? undefined : parseTools(path, frontmatter.tools)

  return { ...frontmatter, tools, body: match[2].trim() }
}

function renderOpencode(source) {
  // The agent id comes from the file name, so there is no "name" field.
  const frontmatter = { description: source.description, mode: 'subagent' }

  if (source.tools) {
    const allowedActions = [...new Set(source.tools.map((tool) => OPENCODE_ACTION_BY_TOOL[tool]))]

    // Same shape as opencode's built-in read-only agents: deny everything, then allow what is listed.
    frontmatter.permissions = [
      { action: '*', resource: '*', effect: 'deny' },
      ...allowedActions.map((action) => ({ action, resource: '*', effect: 'allow' })),
    ]
  }

  const notice = `<!-- Generated from ${SOURCE_DIRECTORY}/${source.name}.md by scripts/build-agents.mjs. Do not edit. -->`

  return `---\n${stringify(frontmatter, { lineWidth: 0 })}---\n\n${notice}\n\n${source.body}\n`
}

async function prettify(path, content) {
  const options = (await resolveConfig(path)) ?? {}

  return format(content, { ...options, filepath: path })
}

function listMarkdownFiles(directory) {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory).filter((file) => file.endsWith('.md'))
}

const expected = new Map()

for (const file of listMarkdownFiles(join(root, SOURCE_DIRECTORY))) {
  const source = parseSource(join(root, SOURCE_DIRECTORY, file))
  const path = join(root, OPENCODE_DIRECTORY, file)

  expected.set(path, await prettify(path, renderOpencode(source)))
}

const problems = []

for (const [path, content] of expected) {
  const current = existsSync(path) ? readFileSync(path, 'utf8') : undefined

  if (current === content) {
    continue
  }

  problems.push(`${current === undefined ? 'missing' : 'outdated'}: ${path}`)

  if (!isCheck) {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, content)
  }
}

for (const file of listMarkdownFiles(join(root, OPENCODE_DIRECTORY))) {
  const path = join(root, OPENCODE_DIRECTORY, file)

  if (expected.has(path)) {
    continue
  }

  problems.push(`stale (no source): ${path}`)

  if (!isCheck) {
    unlinkSync(path)
  }
}

if (isCheck && problems.length > 0) {
  console.error(`build-agents: generated agents are out of date. Run 'npm run build:agents'.\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

if (!isCheck && problems.length > 0) {
  console.log(`build-agents: updated ${problems.length} file(s)`)
}
