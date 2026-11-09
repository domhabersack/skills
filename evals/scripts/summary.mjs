#!/usr/bin/env node
// Prints trigger rates per skill and arm from a `claude plugin eval --json`
// result, and exits 1 when a skill misses its targets.
// Usage: node evals/scripts/summary.mjs <result.json>
//
// A case counts as loaded when the skill loaded in most of its runs. Targets:
// at least min_trigger_rate of the should-trigger cases, and no near-misses.
// Output cases (<skill>/output/<name>) pass when most of their runs pass.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const evalsDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const result = JSON.parse(readFileSync(process.argv[2], "utf8"));

const groups = new Map();
let failed = false;

for (const evalCase of result.cases) {
  const [skill, arm, name] = evalCase.name.split("/");
  const runs = evalCase.arms.with;
  const errors = runs.filter((run) => run.error);
  if (errors.length > 0) {
    console.error(
      `${evalCase.name}: ${errors.length} run(s) failed to run: ${errors[0].error}`,
    );
    failed = true;
  }

  // Output cases check what a skill produces rather than when it loads.
  if (arm === "output") {
    const passedRuns = runs.filter((run) => run.passed).length;
    const ok = passedRuns > runs.length / 2;
    if (!ok) failed = true;
    console.log(
      `${ok ? "PASS" : "FAIL"} ${evalCase.name}: passed ${passedRuns}/${runs.length} runs`,
    );
    continue;
  }

  const shouldTrigger =
    evalCase.graders[0].name === "loaded-before-first-change";
  // Near-miss graders pass when the skill did not load, so invert them.
  const loadedRuns = runs.filter((run) => run.passed === shouldTrigger).length;
  const loaded = loadedRuns > runs.length / 2;

  const key = `${skill}/${arm}`;
  if (!groups.has(key))
    groups.set(key, {
      skill,
      hits: 0,
      shouldTrigger: 0,
      falseHits: [],
      nearMiss: 0,
      misses: [],
    });
  const group = groups.get(key);
  if (shouldTrigger) {
    group.shouldTrigger++;
    if (loaded) group.hits++;
    else group.misses.push(`${name} (${loadedRuns}/${runs.length})`);
  } else {
    group.nearMiss++;
    if (loaded) group.falseHits.push(`${name} (${loadedRuns}/${runs.length})`);
  }
}

for (const [key, group] of groups) {
  const { min_trigger_rate: minRate } = JSON.parse(
    readFileSync(join(evalsDir, group.skill, "queries.json"), "utf8"),
  );
  const ok =
    group.hits >= Math.ceil(minRate * group.shouldTrigger) &&
    group.falseHits.length === 0;
  if (!ok) failed = true;

  console.log(
    `${ok ? "PASS" : "FAIL"} ${key}: loaded before the first change in ${group.hits}/${group.shouldTrigger} (target ${Math.ceil(minRate * group.shouldTrigger)}), loaded in ${group.falseHits.length}/${group.nearMiss} near-misses (target 0)`,
  );
  if (group.misses.length > 0)
    console.log(`  missed: ${group.misses.join(", ")}`);
  if (group.falseHits.length > 0)
    console.log(`  loaded on near-misses: ${group.falseHits.join(", ")}`);
}

process.exit(failed ? 1 : 0);
