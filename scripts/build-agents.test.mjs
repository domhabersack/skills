import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const script = join(dirname(fileURLToPath(import.meta.url)), 'build-agents.mjs')
const repository = join(dirname(script), '..')

// Creates a throwaway repository root containing the given files ({ 'agents/x.md': '...' }).
function createRoot(files = {}) {
  const root = mkdtempSync(join(tmpdir(), 'build-agents-'))

  mkdirSync(join(root, 'agents'))
  // Stops Prettier from searching the temp directory's parents for a config (and running a JavaScript one it finds).
  copyFileSync(join(repository, '.prettierrc.json'), join(root, '.prettierrc.json'))

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
---

<!-- Generated from agents/reviewer.md by scripts/build-agents.mjs. Do not edit. -->

Body.
`,
  )
  assert.equal(build(root, '--check').status, 0)
})
