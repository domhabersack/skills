#!/usr/bin/env node
// Prints trigger rates per model, skill and arm from `claude plugin eval
// --json` results, and exits 1 when a required model misses its targets.
// Usage: node evals/scripts/summary.mjs [--required m1,m2] [--skills s1,s2]
//          <model>=<result.json>...
//
// Each model is judged on its own. A case counts as loaded when the skill
// loaded in most of the runs that ran. Runs that errored count neither way;
// they're reported, and fail the summary for a required model. Targets: at
// least min_trigger_rate of the should-trigger cases, and no near-misses.
// Output cases (<skill>/output/<name>) pass when most of their runs pass.
// Models not listed in --required are reported but never fail the summary.
// Names given in --skills must have at least one case for every model.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const evalsDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const { values, positionals } = parseArgs({
  options: {
    required: { type: "string", default: "" },
    skills: { type: "string", default: "" },
  },
  allowPositionals: true,
});
const required = new Set(values.required.split(",").filter(Boolean));
const requested = values.skills.split(",").filter(Boolean);

if (positionals.length === 0) {
  console.error("No results given. Pass <model>=<result.json> for each model.");
  process.exit(1);
}

let failed = false;

for (const positional of positionals) {
  const separator = positional.indexOf("=");
  const model = positional.slice(0, separator);
  const isRequired = required.has(model);
  const label = isRequired ? model : `${model} (reported only)`;
  const fail = () => {
    if (isRequired) failed = true;
  };

  // run.sh empties each results file before its run, so an empty or broken
  // file means the eval never wrote results for this model.
  let result;
  try {
    result = JSON.parse(readFileSync(positional.slice(separator + 1), "utf8"));
  } catch {
    console.error(`${label}: no results. Check the eval output above.`);
    fail();
    continue;
  }

  const groups = new Map();
  const seen = new Set();
  for (const evalCase of result.cases) {
    const [skill, arm, name] = evalCase.name.split("/");
    seen.add(skill);
    const errors = evalCase.arms.with.filter((run) => run.error);
    const runs = evalCase.arms.with.filter((run) => !run.error);
    if (errors.length > 0) {
      console.error(
        `${label} ${evalCase.name}: ${errors.length} run(s) failed to run: ${errors[0].error}`,
      );
      fail();
    }
    // A case with no completed runs says nothing about the skill. It was
    // reported above.
    if (runs.length === 0) continue;

    // Output cases check what a skill or agent produces, not when it loads.
    if (arm === "output") {
      const passedRuns = runs.filter((run) => run.passed).length;
      const ok = passedRuns > runs.length / 2;
      if (!ok) fail();
      console.log(
        `${ok ? "PASS" : "FAIL"} ${label} ${evalCase.name}: passed ${passedRuns}/${runs.length} runs`,
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

  // A mistyped skill name selects no cases. Without this, nothing would print
  // and the run would exit 0, which reads as a pass.
  if (result.cases.length === 0) {
    console.error(`${label}: no eval cases ran. Check the skill names.`);
    fail();
  }
  for (const skill of requested) {
    if (!seen.has(skill)) {
      console.error(`${label}: no eval results for ${skill}. Check the name.`);
      fail();
    }
  }

  for (const [key, group] of groups) {
    const { min_trigger_rate: minRate } = JSON.parse(
      readFileSync(join(evalsDir, group.skill, "queries.json"), "utf8"),
    );
    // Without the epsilon, 0.8 * 15 = 12.000000000000002 would round up to 13.
    const target = Math.ceil(minRate * group.shouldTrigger - 1e-9);
    const ok = group.hits >= target && group.falseHits.length === 0;
    if (!ok) fail();

    console.log(
      `${ok ? "PASS" : "FAIL"} ${label} ${key}: loaded before the first change in ${group.hits}/${group.shouldTrigger} (target ${target}), loaded in ${group.falseHits.length}/${group.nearMiss} near-misses (target 0)`,
    );
    if (group.misses.length > 0)
      console.log(`  missed: ${group.misses.join(", ")}`);
    if (group.falseHits.length > 0)
      console.log(`  loaded on near-misses: ${group.falseHits.join(", ")}`);
  }
}

// A required model with no results at all would otherwise pass silently.
const given = new Set(positionals.map((p) => p.slice(0, p.indexOf("="))));
for (const model of required) {
  if (!given.has(model)) {
    console.error(`No results for required model ${model}.`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
