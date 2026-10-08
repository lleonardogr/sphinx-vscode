import { strict as assert } from 'assert';
import { execFile } from 'child_process';
import * as fs from 'fs';
import * as http from 'http';
import { AddressInfo } from 'net';
import * as path from 'path';
import { describe, it } from 'node:test';
import { promisify } from 'util';
import { ROOT, tempDir } from './helpers';

/** Runs scripts/check-links.js; resolves with its exit code and output. */
async function checkLinks(args: string[]): Promise<{ code: number; output: string }> {
  try {
    const { stdout } = await promisify(execFile)(process.execPath, [path.join(ROOT, 'scripts', 'check-links.js'), ...args]);
    return { code: 0, output: stdout };
  } catch (e) {
    const err = e as { code: number; stdout: string };
    return { code: err.code, output: err.stdout };
  }
}

describe('reading link check', () => {
  it('retries failing links, reports what needs attention, and breaks links that stay down', async () => {
    // A site where /flaky fails once and then works.
    let flakyCalls = 0;
    const server = http.createServer((req, res) => {
      const status = { '/ok': 200, '/gone': 404, '/down': 503, '/still-down': 503, '/blocked': 403 }[req.url ?? ''] ?? (req.url === '/flaky' && flakyCalls++ === 0 ? 503 : 200);
      res.writeHead(status).end();
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    try {
      const dir = tempDir();
      const lesson = path.join(dir, 'guide');
      fs.mkdirSync(lesson);
      const reading = (name: string) => ({ title: `Reading ${name}`, url: `${base}/${name}` });
      fs.writeFileSync(path.join(lesson, 'lesson.json'), JSON.stringify({ readings: ['ok', 'gone', 'down', 'still-down', 'blocked', 'flaky'].map(reading) }));
      // The previous report saw /still-down failing already.
      const previous = path.join(dir, 'previous.md');
      fs.writeFileSync(previous, `Old report\n<!-- temporary: ${base}/still-down ${base}/flaky -->\n`);
      const report = path.join(dir, 'report.md');

      const { code, output } = await checkLinks(['--retry-after', '1', '--previous', previous, '--report', report, dir]);
      assert.equal(code, 1, 'a broken link fails the check');
      assert.match(output, /6 reading link\(s\) checked, 2 broken, 2 with a temporary or unverified problem/);
      const md = fs.readFileSync(report, 'utf8');
      assert.match(md, /### Broken \(2\)/);
      assert.match(md, /\[Reading gone\]\(.*\/gone\) \| `.*lesson\.json` \| HTTP 404 \|/);
      assert.match(md, /\[Reading still-down\]\(.*\) \| .* \| HTTP 503, also on the previous check \|/);
      assert.match(md, /### Failing for now \(1\)[\s\S]*Reading down/);
      assert.match(md, /### Could not be verified \(1\)[\s\S]*Reading blocked/);
      assert.doesNotMatch(md, /Reading flaky|Reading ok/, 'the flaky link worked on the retry');
      // Only this run's temporary problems are kept for the next one.
      assert.equal(md.match(/<!-- temporary: (.*) -->/)?.[1], `${base}/down`);
    } finally {
      server.close();
    }
  });

  it('passes and removes the old report when every link opens', async () => {
    const server = http.createServer((_req, res) => res.writeHead(200).end());
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    try {
      const dir = tempDir();
      fs.mkdirSync(path.join(dir, 'guide'));
      fs.writeFileSync(path.join(dir, 'guide', 'lesson.json'), JSON.stringify({ readings: [{ title: 'Fine', url: `http://127.0.0.1:${(server.address() as AddressInfo).port}/` }] }));
      const report = path.join(dir, 'report.md');
      fs.writeFileSync(report, 'stale');
      const { code } = await checkLinks(['--report', report, dir]);
      assert.equal(code, 0);
      assert.equal(fs.existsSync(report), false);
    } finally {
      server.close();
    }
  });
});
