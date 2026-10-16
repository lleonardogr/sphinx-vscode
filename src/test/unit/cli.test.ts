import { strict as assert } from 'assert';
import { execFileSync, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { main, parseArgs } from '../../cli';
import { isSphinxLauncher, launcherScript, onPath, userBinDir, writeLauncher } from '../../cliInstall';
import { javaVersion, ROOT, tempDir } from './helpers';

/** Runs the CLI and captures what it prints. */
async function run(...argv: string[]): Promise<{ code: number; out: string }> {
  const lines: string[] = [];
  const log = console.log;
  const error = console.error;
  console.log = (...a: unknown[]) => lines.push(a.join(' '));
  console.error = (...a: unknown[]) => lines.push(a.join(' '));
  try {
    const code = await main(argv);
    return { code, out: lines.join('\n') };
  } finally {
    console.log = log;
    console.error = error;
  }
}

describe('the sphinx command', () => {
  it('parses commands, flags and -o', () => {
    const a = parseArgs(['pack', 'my-folder', '-o', 'out.zip', '--keep-solutions', '--lang=pt-br']);
    assert.deepEqual(a.positional, ['pack', 'my-folder']);
    assert.equal(a.flags.get('out'), 'out.zip');
    assert.equal(a.flags.get('keep-solutions'), true);
    assert.equal(a.flags.get('lang'), 'pt-br');
    const v = parseArgs(['verify', 'r.json', '--exams', './my exams', '--java-home', '/jdk', '--strict']);
    assert.deepEqual(v.positional, ['verify', 'r.json']);
    assert.equal(v.flags.get('exams'), './my exams');
    assert.equal(v.flags.get('java-home'), '/jdk');
    assert.equal(v.flags.get('strict'), true);
  });

  it('prints its version and its help, and refuses unknown commands', async () => {
    const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
    assert.deepEqual(await run('--version'), { code: 0, out: version });
    assert.match((await run()).out, /sphinx validate <folder>/);
    const unknown = await run('nonsense');
    assert.equal(unknown.code, 2);
    assert.match(unknown.out, /Unknown command "nonsense"/);
  });

  it('tests a file against a built-in challenge, with its hidden tests and bonus goals, in Portuguese too', async (t) => {
    const version = await javaVersion;
    if (version === undefined || version < 25) return t.skip('the built-in challenges need JDK 25');
    const solution = path.join(ROOT, 'challenges', 'fizzbuzz', 'Solution.java');
    const good = await run('test', 'fizzbuzz', solution);
    assert.equal(good.code, 0, good.out);
    assert.match(good.out, /✓ Hidden test 3/);
    assert.match(good.out, /☆ Without %: No %/);
    const bonus = await run('test', 'fizzbuzz', path.join(ROOT, 'challenges', 'fizzbuzz', 'Solution.bonus.no-modulo.java'), '--lang=pt-br');
    assert.match(bonus.out, /★ Sem %/);
    const bad = path.join(tempDir(), 'Bad.java');
    fs.writeFileSync(bad, 'void main() {\n    IO.println("1");\n}\n');
    const failed = await run('test', 'fizzbuzz', bad);
    assert.equal(failed.code, 1);
    assert.match(failed.out, /✗ Use a loop/);
    assert.equal((await run('test', 'no-such-challenge', bad)).code, 2);
  });

  it('builds a pack without the solutions', async () => {
    const out = path.join(tempDir(), 'pack.zip');
    const result = await run('pack', path.join(ROOT, 'custom'), '-o', out);
    assert.equal(result.code, 0, result.out);
    assert.match(result.out, /solution file\(s\) left out/);
    assert.ok(fs.statSync(out).size > 0);
  });
});

describe('the sphinx launcher', () => {
  it('runs the CLI with VS Code as Node.js, keeping settings the caller already set', () => {
    const sh = launcherScript('darwin', '/Apps/VS Code/Code Helper', "/ext/it's/out/cli.js", { SPHINX_JAVA_HOME: '/jdk', SPHINX_LANG: 'pt-br' });
    assert.match(sh, /^#!\/bin\/sh\n/);
    assert.match(sh, /\[ -n "\$\{SPHINX_JAVA_HOME:-\}" \] \|\| SPHINX_JAVA_HOME='\/jdk'; export SPHINX_JAVA_HOME/);
    assert.match(sh, /ELECTRON_RUN_AS_NODE=1 exec '\/Apps\/VS Code\/Code Helper' '\/ext\/it'\\''s\/out\/cli\.js' "\$@"/);
    assert.ok(!sh.includes('SPHINX_C_COMPILER'), 'empty settings are left out');
    const cmd = launcherScript('win32', 'C:\\VS Code\\Code.exe', 'C:\\ext\\out\\cli.js', { SPHINX_LANG: 'en' });
    assert.match(cmd, /^@echo off\r\n/);
    assert.match(cmd, /if not defined SPHINX_LANG set SPHINX_LANG=en\r\n/);
    assert.match(cmd, /"C:\\VS Code\\Code\.exe" "C:\\ext\\out\\cli\.js" %\*/);
  });

  it('passes settings through untouched, even ones with quotes, % or & (nothing in them runs)', () => {
    const dir = tempDir();
    const marker = path.join(dir, 'ran');
    const cli = path.join(dir, 'cli 100%.js');
    fs.writeFileSync(cli, 'console.log(JSON.stringify([process.env.SPHINX_JAVA_HOME, process.env.SPHINX_C_COMPILER, process.argv.slice(2)]));\n');
    const touch = process.platform === 'win32' ? `type nul > "${marker}"` : `touch '${marker}'`;
    const env = {
      SPHINX_JAVA_HOME: `C:\\JDK" & ${touch} & rem "%PATH%!x!^`,
      SPHINX_C_COMPILER: `/opt/cc}'$(${touch})\`$HOME"`,
    };
    const file = writeLauncher(dir, process.platform, launcherScript(process.platform, process.execPath, cli, env));
    const out = process.platform === 'win32' ? execSync(`"${file}" arg`, { encoding: 'utf8' }) : execFileSync(file, ['arg'], { encoding: 'utf8' });
    assert.deepEqual(JSON.parse(out), [env.SPHINX_JAVA_HOME, env.SPHINX_C_COMPILER, ['arg']]);
    assert.ok(!fs.existsSync(marker), 'a setting ran a command');
  });

  it('writes an executable launcher it can recognize later, in a folder on the user\'s PATH', () => {
    const dir = tempDir();
    const file = writeLauncher(dir, 'darwin', launcherScript('darwin', '/x', '/y', {}));
    assert.equal(path.basename(file), 'sphinx');
    if (process.platform !== 'win32') {
      assert.equal(fs.statSync(file).mode & 0o111, 0o111);
    }
    assert.ok(isSphinxLauncher(file));
    fs.writeFileSync(path.join(dir, 'other'), '#!/bin/sh\necho mine\n');
    assert.ok(!isSphinxLauncher(path.join(dir, 'other')));
    assert.equal(userBinDir('linux', '/home/ada'), path.join('/home/ada', '.local', 'bin'));
    assert.equal(userBinDir('win32', 'C:\\Users\\ada', 'C:\\Users\\ada\\AppData\\Local'), path.join('C:\\Users\\ada\\AppData\\Local', 'Microsoft', 'WindowsApps'));
    assert.ok(onPath('/home/ada/.local/bin', '/usr/bin:/home/ada/.local/bin', 'linux'));
    assert.ok(!onPath('/home/ada/.local/bin', '/usr/bin', 'linux'));
  });
});
