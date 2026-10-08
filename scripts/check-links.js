#!/usr/bin/env node
// Checks that the readings of every lesson (lesson.json "readings") still open.
//   node scripts/check-links.js [options] [folder ...]   (default: the subjects/ folder)
//
// A link that answers 404 or 410, or whose host doesn't exist, is broken and fails the check.
// Sites that are down (5xx, timeouts) are reported as temporary problems, and sites that block
// automated requests (401, 403, 429) as unverified; neither fails the check, unless a temporary
// problem was already there on the previous run (see --previous), which makes it broken.
//
// Options:
//   --retry-after <seconds>  check failing links once more after this pause (default: no retry)
//   --previous <file>        the previous report: its temporary problems that persist become broken
//   --report <file>          write a Markdown report there when any link needs attention
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const retryAfter = Number(option('--retry-after') ?? 0);
const previousFile = option('--previous');
const reportFile = option('--report');
const roots = args.length ? args : [path.join(__dirname, '..', 'subjects')];

/** The marker the report keeps its temporary problems in, for the next run. */
const MARKER = /<!-- temporary: (.*?) -->/;

function lessonFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? lessonFiles(p) : e.name === 'lesson.json' ? [p] : [];
  });
}

/** 'ok', 'broken', 'temporary' (down for now) or 'blocked' (the site refuses automated checks). */
async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Sphinx link check; +https://github.com/lleonardogr/sphinx-vscode)', Accept: 'text/html,*/*' },
    });
    if (res.status === 404 || res.status === 410) return { state: 'broken', detail: `HTTP ${res.status}` };
    if (res.status >= 500) return { state: 'temporary', detail: `HTTP ${res.status}` };
    if (res.status >= 400) return { state: 'blocked', detail: `HTTP ${res.status} (the site may block automated checks)` };
    return { state: 'ok', detail: `HTTP ${res.status}` };
  } catch (e) {
    const code = e.cause?.code ?? e.name;
    // A host that doesn't exist is broken; timeouts and resets may be temporary.
    return code === 'ENOTFOUND' ? { state: 'broken', detail: 'host not found' } : { state: 'temporary', detail: String(code) };
  } finally {
    clearTimeout(timer);
  }
}

function report(links) {
  const repo = `${process.env.GITHUB_SERVER_URL ?? 'https://github.com'}/${process.env.GITHUB_REPOSITORY ?? 'lleonardogr/sphinx-vscode'}`;
  const runUrl = process.env.GITHUB_RUN_ID ? `${repo}/actions/runs/${process.env.GITHUB_RUN_ID}` : '';
  const table = (state) => {
    const rows = links.filter((l) => l.state === state);
    return rows.length
      ? ['| Reading | Lesson | Problem |', '|---|---|---|', ...rows.map((l) => `| [${l.title.replace(/[|\]]/g, ' ')}](${l.url}) | \`${l.file}\` | ${l.detail} |`)].join('\n')
      : '';
  };
  const section = (state, heading, note) => {
    const rows = table(state);
    return rows ? `### ${heading} (${links.filter((l) => l.state === state).length})\n\n${note}\n\n${rows}\n` : '';
  };
  const temporary = links.filter((l) => l.state === 'temporary').map((l) => l.url);
  return [
    `The reading link check found links that need attention. Students open these from the lessons in the sidebar: fix the link, or choose another reading following the [content guide](${repo}/blob/main/docs/content-guide.md#reading-guides).\n`,
    section('broken', 'Broken', 'The page is gone (404 or 410), its site no longer exists, or it was already failing on the previous check.'),
    section('temporary', 'Failing for now', 'Server errors and timeouts. Each link was tried twice. If one still fails on the next check, it moves to Broken.'),
    section('blocked', 'Could not be verified', 'The site refused the checker (401, 403 or 429). Open the link in a browser: if it works, nothing is wrong, but a source that allows checks is better.'),
    `_Checked on ${new Date().toISOString().slice(0, 10)}${runUrl ? ` by [this run](${runUrl})` : ''}. This issue is updated by every check, and closes itself once every link opens._`,
    `<!-- temporary: ${temporary.join(' ')} -->`,
  ].filter(Boolean).join('\n');
}

(async () => {
  const links = roots.flatMap(lessonFiles).flatMap((file) => {
    const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
    return (meta.readings ?? []).map((r) => ({ file: path.relative(process.cwd(), file), title: r.title, url: r.url }));
  });
  for (const link of links) {
    Object.assign(link, await check(link.url));
  }
  // Try failing links once more after a pause, so a short outage isn't reported.
  const failing = links.filter((l) => l.state !== 'ok');
  if (retryAfter > 0 && failing.length) {
    console.log(`${failing.length} link(s) failed; trying them again in ${retryAfter}s…`);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    for (const link of failing) {
      Object.assign(link, await check(link.url));
    }
  }
  // A temporary problem that was already there on the previous check is no longer temporary.
  const previous = previousFile && fs.existsSync(previousFile) ? (fs.readFileSync(previousFile, 'utf8').match(MARKER)?.[1] ?? '').split(' ').filter(Boolean) : [];
  for (const link of links.filter((l) => l.state === 'temporary' && previous.includes(l.url))) {
    link.state = 'broken';
    link.detail += ', also on the previous check';
  }

  for (const link of links) {
    const mark = { ok: '✓', broken: '✗', temporary: '⚠', blocked: '⚠' }[link.state];
    console.log(`${mark} ${link.url} (${link.detail})${link.state === 'ok' ? '' : `\n    ${link.title}, in ${link.file}`}`);
  }
  const broken = links.filter((l) => l.state === 'broken').length;
  const attention = links.filter((l) => l.state !== 'ok').length;
  console.log(`\n${links.length} reading link(s) checked, ${broken} broken, ${attention - broken} with a temporary or unverified problem.`);
  if (reportFile) {
    if (attention) {
      fs.writeFileSync(reportFile, report(links) + '\n');
    } else if (fs.existsSync(reportFile)) {
      fs.rmSync(reportFile);
    }
  }
  process.exit(broken ? 1 : 0);
})();
