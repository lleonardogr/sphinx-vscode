#!/usr/bin/env node
// Which content a pull request changed, so CI validates only that. Prints GitHub Actions outputs:
//
//   mode=full   the engine, scripts or build changed: validate everything
//   mode=some   only content changed: roots=<the changed subjects and challenge folders>
//   mode=none   only docs changed: nothing to validate
//
//   node scripts/changed-content.js [base]     base defaults to HEAD^1 (the PR's base, in CI's merge commit)
//
// Pushes to main always validate everything, so nothing reaches a release unchecked.
const { execFileSync } = require('child_process');

const base = process.argv[2] || 'HEAD^1';
const files = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

// Content folders whose second path segment is one item: subjects/<subject>, challenges/<id>, …
const CONTENT = ['subjects', 'challenges', 'custom', 'tests', 'exams', 'quizzes'];
// Files that never change what the validator checks.
const IGNORED = /^(docs\/|media\/|\.claude\/|[^/]+\.md$|LICENSE$)/;

const roots = new Set();
let full = false;
for (const file of files) {
  const [top, item] = file.split('/');
  if (CONTENT.includes(top) && item && file.split('/').length > 2) {
    roots.add(`${top}/${item}`);
  } else if (IGNORED.test(file) || (CONTENT.includes(top) && file.endsWith('.md'))) {
    continue;
  } else {
    full = true;
  }
}

const mode = full ? 'full' : roots.size ? 'some' : 'none';
// Folders that a PR deleted can't be validated; the rest of the content still is, on main.
const existing = [...roots].filter((r) => require('fs').existsSync(r)).sort();
console.log(`mode=${mode === 'some' && existing.length === 0 ? 'none' : mode}`);
console.log(`roots=${mode === 'some' ? existing.join(' ') : ''}`);
console.error(`${files.length} changed file(s): ${mode}${mode === 'some' ? ` (${existing.join(', ')})` : ''}`);
