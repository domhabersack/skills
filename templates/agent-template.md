---
name: agent-name
description: When Claude should delegate to this subagent. Be specific; this is what Claude matches against.
tools: Read, Grep, Glob
model: sonnet # haiku for cheap, high-volume lookups; sonnet for building and fixing; opus for planning, review, and judgment
effort: medium # low, medium, high, or max, matched to how hard the agent has to think
skills:
  - engineering-standards
---

You are a <role>. Describe the identity, responsibilities, and boundaries of this subagent.

## Process

1. Step one.
2. Step two.

## Output

Describe what to return to the caller.
