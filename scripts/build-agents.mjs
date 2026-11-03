#!/usr/bin/env node
// Generates subagent definitions for each supported tool from one neutral source file.
//
//   src/agents/<name>.md  ->  agents/<name>.md           (Claude Code, also served by the plugin)
//                         ->  opencode/agents/<name>.md  (opencode v2)
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

const SOURCE_DIRECTORY = 'src/agents'
const CLAUDE_DIRECTORY = 'agents'
const OPENCODE_DIRECTORY = 'opencode/agents'

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const ALLOWED_KEYS = ['name', 'description', 'tools', 'model', 'opencode-model']
const CLAUDE_MODELS = ['inherit', 'sonnet', 'opus', 'haiku']

// Claude Code tool names (the source vocabulary) and the opencode v2 permission action each one maps to.
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

function parseSource(path) {
  const name = basename(path, '.md')
  const match = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    fail(`${path}: missing frontmatter`)
  }

  const frontmatter = parse(match[1]) ?? {}
  const unknownKeys = Object.keys(frontmatter).filter((key) => !ALLOWED_KEYS.includes(key))

  if (unknownKeys.length > 0) {
    fail(`${path}: unknown frontmatter keys: ${unknownKeys.join(', ')} (allowed: ${ALLOWED_KEYS.join(', ')})`)
  }

  if (!NAME_PATTERN.test(name)) {
    fail(`${path}: file name must be kebab-case`)
  }

  if (frontmatter.name !== name) {
    fail(`${path}: "name" must equal the file name ("${name}")`)
  }

  if (typeof frontmatter.description !== 'string' || frontmatter.description.trim() === '') {
    fail(`${path}: "description" is required`)
  }

  if (frontmatter.tools !== undefined) {
    if (!Array.isArray(frontmatter.tools) || frontmatter.tools.length === 0) {
      fail(`${path}: "tools" must be a non-empty list (omit it to allow all tools)`)
    }

    const unknownTools = frontmatter.tools.filter((tool) => !(tool in OPENCODE_ACTION_BY_TOOL))

    if (unknownTools.length > 0) {
      fail(`${path}: unknown tools: ${unknownTools.join(', ')} (known: ${Object.keys(OPENCODE_ACTION_BY_TOOL).join(', ')})`)
    }
  }

  if (frontmatter.model !== undefined && !CLAUDE_MODELS.includes(frontmatter.model)) {
    fail(`${path}: "model" must be one of ${CLAUDE_MODELS.join(', ')}`)
  }

  return { ...frontmatter, body: match[2].trim() }
}

function renderDocument(frontmatter, source) {
  const notice = `<!-- Generated from ${SOURCE_DIRECTORY}/${source.name}.md by scripts/build-agents.mjs. Do not edit. -->`

  return `---\n${stringify(frontmatter, { lineWidth: 0 })}---\n\n${notice}\n\n${source.body}\n`
}

function renderClaude(source) {
  const frontmatter = { name: source.name, description: source.description }

  if (source.tools) {
    frontmatter.tools = source.tools.join(', ')
  }

  if (source.model) {
    frontmatter.model = source.model
  }

  return renderDocument(frontmatter, source)
}

function renderOpencode(source) {
  // The agent id comes from the file name, so there is no "name" field.
  const frontmatter = { description: source.description, mode: 'subagent' }

  if (source['opencode-model']) {
    frontmatter.model = source['opencode-model']
  }

  if (source.tools) {
    const allowedActions = [...new Set(source.tools.map((tool) => OPENCODE_ACTION_BY_TOOL[tool]))]

    // Same shape as opencode's built-in read-only agents: deny everything, then allow what is listed.
    frontmatter.permissions = [
      { action: '*', resource: '*', effect: 'deny' },
      ...allowedActions.map((action) => ({ action, resource: '*', effect: 'allow' })),
    ]
  }

  return renderDocument(frontmatter, source)
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

const sourceDirectory = join(root, SOURCE_DIRECTORY)
const expected = new Map()

for (const file of listMarkdownFiles(sourceDirectory)) {
  const source = parseSource(join(sourceDirectory, file))

  for (const [directory, render] of [
    [CLAUDE_DIRECTORY, renderClaude],
    [OPENCODE_DIRECTORY, renderOpencode],
  ]) {
    const path = join(root, directory, file)

    expected.set(path, await prettify(path, render(source)))
  }
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

for (const directory of [CLAUDE_DIRECTORY, OPENCODE_DIRECTORY]) {
  for (const file of listMarkdownFiles(join(root, directory))) {
    const path = join(root, directory, file)

    if (expected.has(path)) {
      continue
    }

    problems.push(`stale (no source): ${path}`)

    if (!isCheck) {
      unlinkSync(path)
    }
  }
}

if (isCheck && problems.length > 0) {
  console.error(`build-agents: generated agents are out of date. Run 'npm run build:agents'.\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

if (!isCheck && problems.length > 0) {
  console.log(`build-agents: updated ${problems.length} file(s)`)
}
