#!/usr/bin/env node
// Prints trigger rates per skill and arm from a `claude plugin eval --json`
// result, and exits 1 when a skill misses its targets.
// Usage: node evals/scripts/summary.mjs <result.json> [skill...]
//
// A case counts as loaded when the skill loaded in most of the runs that ran.
// Runs that errored count neither way; they're reported and fail the summary.
// Targets: at least min_trigger_rate of the should-trigger cases, and no
// near-misses. Skills named on the command line must have at least one case.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const evalsDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const [resultPath, ...requested] = process.argv.slice(2);
const result = JSON.parse(readFileSync(resultPath, "utf8"));

const groups = new Map();
let failed = false;

for (const evalCase of result.cases) {
  const [skill, arm, name] = evalCase.name.split("/");
  const errors = evalCase.arms.with.filter((run) => run.error);
  const runs = evalCase.arms.with.filter((run) => !run.error);
  if (errors.length > 0) {
    console.error(
      `${evalCase.name}: ${errors.length} run(s) failed to run: ${errors[0].error}`,
    );
    failed = true;
  }
  // A case with no completed runs says nothing about the skill. It already
  // failed the summary above.
  if (runs.length === 0) continue;

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

// A mistyped skill name selects no cases. Without this, nothing would print
// and the run would exit 0, which reads as a pass.
if (result.cases.length === 0) {
  console.error("No eval cases ran. Check the skill names.");
  failed = true;
}
for (const skill of requested) {
  if (![...groups.values()].some((group) => group.skill === skill)) {
    console.error(`No eval results for ${skill}. Check the name.`);
    failed = true;
  }
}

for (const [key, group] of groups) {
  const { min_trigger_rate: minRate } = JSON.parse(
    readFileSync(join(evalsDir, group.skill, "queries.json"), "utf8"),
  );
  // Without the epsilon, 0.8 * 15 = 12.000000000000002 would round up to 13.
  const target = Math.ceil(minRate * group.shouldTrigger - 1e-9);
  const ok = group.hits >= target && group.falseHits.length === 0;
  if (!ok) failed = true;

  console.log(
    `${ok ? "PASS" : "FAIL"} ${key}: loaded before the first change in ${group.hits}/${group.shouldTrigger} (target ${target}), loaded in ${group.falseHits.length}/${group.nearMiss} near-misses (target 0)`,
  );
  if (group.misses.length > 0)
    console.log(`  missed: ${group.misses.join(", ")}`);
  if (group.falseHits.length > 0)
    console.log(`  loaded on near-misses: ${group.falseHits.join(", ")}`);
}

process.exit(failed ? 1 : 0);
