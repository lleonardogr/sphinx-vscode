#!/usr/bin/env node
// Validates challenge folders: every starter compiles, and every reference solution follows the
// rules and passes every test. See docs/creating-challenges.md.
//
//   npm run validate                                    validate the built-in challenges
//   node scripts/validate-challenges.js path/to/folder  validate another challenge folder
//   node scripts/validate-challenges.js --generate      fill each test's "output" from Solution.java
//
// Requires `npm run compile` first (it reuses the extension's validator).
const path = require('path');
const { validateChallenges, formatReport, reportPassed } = require('../out/validator');

async function main() {
  const args = process.argv.slice(2);
  const generate = args.includes('--generate');
  const roots = args.filter((a) => !a.startsWith('--'));
  if (roots.length === 0) roots.push(path.join(__dirname, '..', 'challenges'), path.join(__dirname, '..', 'custom'));

  const report = await validateChallenges(roots, {
    generate,
    onChallenge: (c) => process.stdout.write(c.ok ? '.' : 'x'),
  });
  process.stdout.write('\n');
  console.log(formatReport(report, generate).join('\n'));
  process.exit(reportPassed(report) ? 0 : 1);
}

main();
