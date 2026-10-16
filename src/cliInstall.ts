// Installing the `sphinx` command: small launcher scripts that run the bundled CLI (out/cli.js) with
// VS Code's own runtime (ELECTRON_RUN_AS_NODE), so no separate Node.js is needed. The extension writes
// them on every start, so they always point to the current version and settings. No vscode dependency.
import * as fs from 'fs';
import * as path from 'path';

/** Settings the CLI reads from the environment (see cli.ts). */
export interface LauncherEnv {
  SPHINX_JAVA_HOME?: string;
  SPHINX_C_COMPILER?: string;
  SPHINX_C_PORTABLE_DIRS?: string;
  SPHINX_LANG?: string;
}

export const LAUNCHER_MARK = 'Written by the Sphinx VS Code extension';

const shQuote = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;
/** A value for an unquoted cmd.exe `set`: `^` escapes the characters cmd would act on, `%%` is a literal `%`; line breaks would start a new command. */
const cmdEscape = (s: string) => s.replace(/[\r\n]/g, '').replace(/%/g, '%%').replace(/[\^&|<>()"]/g, '^$&');
/** A path inside cmd.exe double quotes: Windows paths can't hold `"`, but `%` would still expand. */
const cmdPath = (s: string) => `"${s.replace(/["\r\n]/g, '').replace(/%/g, '%%')}"`;

/** The launcher's file name on this platform. */
export function launcherName(platform: NodeJS.Platform): string {
  return platform === 'win32' ? 'sphinx.cmd' : 'sphinx';
}

/**
 * The launcher script: sets the settings (unless the caller's environment already has them) and runs
 * the CLI with `runtime` (VS Code's executable) as Node.js.
 */
export function launcherScript(platform: NodeJS.Platform, runtime: string, cli: string, env: LauncherEnv): string {
  const entries = Object.entries(env).filter(([, v]) => v);
  if (platform === 'win32') {
    return [
      '@echo off',
      `rem ${LAUNCHER_MARK}. It is rewritten when Sphinx updates.`,
      'setlocal DisableDelayedExpansion',
      ...entries.map(([k, v]) => `if not defined ${k} set ${k}=${cmdEscape(v ?? '')}`),
      'set ELECTRON_RUN_AS_NODE=1',
      `${cmdPath(runtime)} ${cmdPath(cli)} %*`,
      '',
    ].join('\r\n');
  }
  return [
    '#!/bin/sh',
    `# ${LAUNCHER_MARK}. It is rewritten when Sphinx updates.`,
    ...entries.map(([k, v]) => `[ -n "\${${k}:-}" ] || ${k}=${shQuote(v ?? '')}; export ${k}`),
    `ELECTRON_RUN_AS_NODE=1 exec ${shQuote(runtime)} ${shQuote(cli)} "$@"`,
    '',
  ].join('\n');
}

/** Writes the launcher into `dir` (creating it) and makes it executable; returns its path. */
export function writeLauncher(dir: string, platform: NodeJS.Platform, script: string): string {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, launcherName(platform));
  fs.writeFileSync(file, script);
  if (platform !== 'win32') {
    fs.chmodSync(file, 0o755);
  }
  return file;
}

/** True when `file` is a launcher Sphinx wrote (so it may be replaced or removed). */
export function isSphinxLauncher(file: string): boolean {
  try {
    return fs.readFileSync(file, 'utf8').includes(LAUNCHER_MARK);
  } catch {
    return false;
  }
}

/** Where "Install 'sphinx' Command" puts the launcher: a folder normally on the user's PATH, no admin rights needed. */
export function userBinDir(platform: NodeJS.Platform, home: string, localAppData?: string): string {
  if (platform === 'win32') {
    // On every user's PATH since Windows 10 (it holds the app execution aliases).
    return path.join(localAppData ?? path.join(home, 'AppData', 'Local'), 'Microsoft', 'WindowsApps');
  }
  return path.join(home, '.local', 'bin');
}

/** True when `dir` is one of the folders in a PATH value. */
export function onPath(dir: string, pathValue: string | undefined, platform: NodeJS.Platform): boolean {
  const norm = (p: string) => (platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p));
  return (pathValue ?? '').split(platform === 'win32' ? ';' : ':').filter(Boolean).some((p) => norm(p) === norm(dir));
}
