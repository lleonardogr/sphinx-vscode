#!/usr/bin/env node
// Checks that the readings of every lesson (lesson.json "readings") still open.
//   node scripts/check-links.js [folder ...]   (default: the subjects/ folder)
// A link that answers 404 or 410, or whose host doesn't exist, is broken and fails the check.
// Sites that block automated requests (401, 403, 429) or are down (5xx) are only reported.
const fs = require('fs');
const path = require('path');

const roots = process.argv.slice(2).length ? process.argv.slice(2) : [path.join(__dirname, '..', 'subjects')];

function lessonFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? lessonFiles(p) : e.name === 'lesson.json' ? [p] : [];
  });
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Sphinx link check; +https://github.com/lleonardogr/sphinx-vscode)', Accept: 'text/html,*/*' },
    });
    if (res.status === 404 || res.status === 410) return { broken: true, detail: `HTTP ${res.status}` };
    if (res.status >= 400) return { warn: true, detail: `HTTP ${res.status} (the site may block automated checks)` };
    return { detail: `HTTP ${res.status}` };
  } catch (e) {
    const code = e.cause?.code ?? e.name;
    // A host that doesn't exist is broken; timeouts and resets may be temporary.
    return code === 'ENOTFOUND' ? { broken: true, detail: 'host not found' } : { warn: true, detail: String(code) };
  } finally {
    clearTimeout(timer);
  }
}

(async () => {
  const links = roots.flatMap(lessonFiles).flatMap((file) => {
    const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
    return (meta.readings ?? []).map((r) => ({ file: path.relative(process.cwd(), file), title: r.title, url: r.url }));
  });
  let broken = 0;
  for (const link of links) {
    const result = await check(link.url);
    const mark = result.broken ? '✗' : result.warn ? '⚠' : '✓';
    console.log(`${mark} ${link.url} (${result.detail})${result.broken || result.warn ? `\n    ${link.title}, in ${link.file}` : ''}`);
    if (result.broken) broken++;
  }
  console.log(`\n${links.length} reading link(s) checked, ${broken} broken.`);
  process.exit(broken ? 1 : 0);
})();
