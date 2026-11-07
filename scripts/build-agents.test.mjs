import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const script = join(dirname(fileURLToPath(import.meta.url)), 'build-agents.mjs')

// Creates a throwaway repository root containing the given files ({ 'agents/x.md': '...' }).
function createRoot(files = {}) {
  const root = mkdtempSync(join(tmpdir(), 'build-agents-'))

  mkdirSync(join(root, 'agents'))

  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }

  return root
}

function build(root, ...flags) {
  return spawnSync(process.execPath, [script, '--root', root, ...flags], { encoding: 'utf8' })
}

function agent(frontmatter, body = 'Body.') {
  return `---\n${frontmatter}\n---\n\n${body}\n`
}

test('translates a Claude Code agent into an opencode subagent', () => {
  const root = createRoot({
    'agents/reviewer.md': agent('name: reviewer\ndescription: Reviews code.\ntools: Read, Bash\nmodel: sonnet'),
  })

  assert.equal(build(root).status, 0)
  assert.equal(
    readFileSync(join(root, 'opencode/agents/reviewer.md'), 'utf8'),
    `---
description: Reviews code.
mode: subagent
permissions:
  - action: "*"
    resource: "*"
    effect: deny
  - action: read
    resource: "*"
    effect: allow
  - action: shell
    resource: "*"
    effect: allow
  - action: read
    resource: "*.env"
    effect: ask
  - action: read
    resource: "*.env.*"
    effect: ask
  - action: read
    resource: "*.env.example"
    effect: allow
---

<!-- Generated from agents/reviewer.md by scripts/build-agents.mjs. Do not edit. -->

Body.
`,
  )
  assert.equal(build(root, '--check').status, 0)
})

test('rejects names of opencode built-in agents, which the generated agent would replace', () => {
  for (const name of ['build', 'plan', 'general', 'explore', 'compaction', 'summary', 'title']) {
    const root = createRoot({ [`agents/${name}.md`]: agent(`name: ${name}\ndescription: Clashes.`) })
    const result = build(root)

    assert.equal(result.status, 1, name)
    assert.match(result.stderr, /built-in opencode agent/, name)
  }
})

test('denies subagents and questions to agents without a tools list, like opencode’s built-in general agent', () => {
  const root = createRoot({ 'agents/helper.md': agent('name: helper\ndescription: Helps.') })

  assert.equal(build(root).status, 0)
  assert.match(
    readFileSync(join(root, 'opencode/agents/helper.md'), 'utf8'),
    /permissions:\n {2}- action: question\n {4}resource: "\*"\n {4}effect: deny\n {2}- action: subagent\n {4}resource: "\*"\n {4}effect: deny\n---/,
  )
})

test('rejects the Agent tool, because Claude Code subagents cannot start subagents', () => {
  const root = createRoot({ 'agents/lead.md': agent('name: lead\ndescription: Leads.\ntools: Read, Agent') })
  const result = build(root)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /no opencode equivalent for tools: Agent/)
})

test('rejects NotebookEdit, because opencode’s edit permission covers every file', () => {
  const root = createRoot({ 'agents/notes.md': agent('name: notes\ndescription: Notes.\ntools: Read, NotebookEdit') })
  const result = build(root)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /no opencode equivalent for tools: NotebookEdit/)
})

test('keeps opencode’s .env read protection after allowing Read, like opencode’s built-in explore agent', () => {
  const root = createRoot({ 'agents/reader.md': agent('name: reader\ndescription: Reads.\ntools: Read, Grep') })

  assert.equal(build(root).status, 0)
  assert.match(
    readFileSync(join(root, 'opencode/agents/reader.md'), 'utf8'),
    /- action: grep\n {4}resource: "\*"\n {4}effect: allow\n {2}- action: read\n {4}resource: "\*\.env"\n {4}effect: ask\n {2}- action: read\n {4}resource: "\*\.env\.\*"\n {4}effect: ask\n {2}- action: read\n {4}resource: "\*\.env\.example"\n {4}effect: allow\n---/,
  )
})

test('rejects tool names inherited from Object.prototype', () => {
  for (const tool of ['__proto__', 'constructor', 'toString']) {
    const root = createRoot({ 'agents/odd.md': agent(`name: odd\ndescription: Odd.\ntools: Read, ${tool}`) })
    const result = build(root)

    assert.equal(result.status, 1, tool)
    assert.match(result.stderr, new RegExp(`no opencode equivalent for tools: ${tool}`), tool)
  }
})

test('reports invalid YAML with the file path instead of a stack trace', () => {
  const root = createRoot({ 'agents/colon.md': agent('name: colon\ndescription: Use this agent when: reviewing.') })
  const result = build(root)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /^build-agents: .*agents\/colon\.md: invalid YAML frontmatter: /)
  assert.doesNotMatch(result.stderr, /\n\s+at /)
})

test('refuses to delete hand-written files in opencode/agents', () => {
  const root = createRoot({ 'opencode/agents/README.md': '# Notes\n' })
  const result = build(root)

  assert.equal(result.status, 1)
  assert.match(result.stderr, /opencode\/agents\/README\.md: not generated from agents\//)
  assert.equal(readFileSync(join(root, 'opencode/agents/README.md'), 'utf8'), '# Notes\n')
})
