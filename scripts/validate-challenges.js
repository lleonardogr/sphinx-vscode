#!/usr/bin/env node
// Checks every challenge: every Starter*.java must compile, and every Solution*.java must satisfy
// the rules and pass every test. Files without ".classic" use Java 25+ syntax (compact source
// files, IO.println) and are skipped on older JDKs; *.classic.java files work on JDK 17+.
//
//   npm run validate                                    validate built-in challenges
//   node scripts/validate-challenges.js path/to/folder  validate another challenge folder
//   node scripts/validate-challenges.js --generate      fill each test's "output" from the reference solution
//
// Requires `npm run compile` first (it reuses the extension's runner).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { runChallengeCode, normalizeOutput, javacMajorVersion } = require('../out/runner');
const { loadChallenges } = require('../out/challenges');

async function runAs(source, request) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenge-validate-'));
  const file = path.join(dir, 'Main.java');
  fs.writeFileSync(file, source);
  try {
    return await runChallengeCode({ ...request, file });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const generate = args.includes('--generate');
  const roots = args.filter((a) => !a.startsWith('--'));
  if (roots.length === 0) roots.push(path.join(__dirname, '..', 'challenges'));

  const { challenges, errors } = loadChallenges(roots);
  errors.forEach((e) => console.error(`✗ ${e}`));
  let failures = errors.length;
  let skipped = 0;
  let checkedSolutions = 0;
  const javacVersion = await javacMajorVersion();
  console.log(`Using javac ${javacVersion ?? '(unknown version)'}\n`);

  for (const c of challenges) {
    const problems = [];

    const files = fs.readdirSync(c.dir).sort();
    const runnable = (f) => f.includes('.classic.') || (javacVersion ?? 0) >= 25;

    for (const starterFile of files.filter((f) => /^Starter.*\.java$/.test(f))) {
      if (!runnable(starterFile)) continue;
      const starter = await runAs(fs.readFileSync(path.join(c.dir, starterFile), 'utf8'), { tests: [] });
      if (starter.kind !== 'tests') problems.push(`${starterFile}: ${starter.kind}\n${starter.raw ?? starter.message ?? ''}`);
    }

    // With --generate, the first runnable solution (Solution.java when possible) produces the
    // expected outputs, and the other solutions are then checked against them.
    const solutions = files
      .filter((f) => /^Solution.*\.java$/.test(f))
      .sort((a, b) => Number(b === 'Solution.java') - Number(a === 'Solution.java'));
    if (solutions.length === 0) problems.push('no Solution.java');
    const generator = solutions.find(runnable);
    for (const solutionFile of solutions) {
      if (!runnable(solutionFile)) {
        skipped++;
        continue;
      }
      const outcome = await runAs(fs.readFileSync(path.join(c.dir, solutionFile), 'utf8'), {
        tests: c.tests,
        mustContain: c.mustContain,
        mustNotContain: c.mustNotContain,
        timeLimitMs: c.timeLimitMs,
      });
      if (outcome.kind !== 'tests') {
        problems.push(`${solutionFile}: ${outcome.kind}\n${outcome.raw ?? outcome.message ?? (outcome.messages || []).join('\n')}`);
      } else if (generate && solutionFile === generator) {
        const metaPath = path.join(c.dir, 'challenge.json');
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        outcome.results.forEach((r, i) => {
          if (r.exitCode !== 0 || r.timedOut) problems.push(`test ${i + 1}: solution failed\n${r.stderr}`);
          meta.tests[i].output = normalizeOutput(r.actual) + '\n';
          c.tests[i].output = meta.tests[i].output;
        });
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
      } else {
        for (const r of outcome.results.filter((x) => !x.passed)) {
          problems.push(`${solutionFile}: test ${r.index + 1} failed\n  expected: ${JSON.stringify(r.expected)}\n  actual:   ${JSON.stringify(r.actual)}\n${r.stderr}`);
        }
      }
    }
    checkedSolutions += solutions.length;

    if (problems.length) {
      failures++;
      console.log(`✗ ${c.id}\n  ${problems.join('\n  ')}`);
    } else {
      console.log(`✓ ${c.id} (${c.tests.length} tests × ${solutions.length} solution${solutions.length > 1 ? 's' : ''})${generate ? ', outputs written' : ''}`);
    }
  }

  console.log(`\n${challenges.length - failures + errors.length}/${challenges.length} challenges OK (${checkedSolutions - skipped} solutions checked)`);
  if (skipped) console.log(`⚠ Skipped ${skipped} modern solution(s): they need JDK 25+ (found ${javacVersion ?? 'unknown'}). Only *.classic.java files were checked.`);
  process.exit(failures ? 1 : 0);
}

main();
