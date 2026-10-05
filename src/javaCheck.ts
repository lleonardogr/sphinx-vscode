// Checks that Java works the way Sphynx uses it: javac and java are found, recent enough, from
// the same JDK, and a tiny program really compiles and runs (the same path as Run, Submit and
// Run in Terminal). No vscode dependency, so it can be tested on its own.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { clearJavaCache, exec, javaBinary, javacMajorVersion, runChallengeCode } from './runner';

/** Classic starters and solutions use Java 16+ features (records, switch expressions, String.formatted, toList). */
export const MIN_CLASSIC = 17;
/** Modern starters use compact source files with void main() and IO.println. */
export const MIN_MODERN = 25;

export type JavaProblem =
  | { kind: 'javacMissing' }
  | { kind: 'javaMissing' }
  | { kind: 'tooOld'; version: number }
  | { kind: 'mismatch'; javac: number; java: number }
  | { kind: 'runFailed'; detail: string }
  | { kind: 'noModern'; version: number };

export interface JavaReport {
  javacCommand: string;
  javacPath?: string;
  javacVersion?: number;
  javaCommand: string;
  javaPath?: string;
  javaVersion?: number;
  javaHomeSetting?: string;
  javaHomeEnv?: string;
  /** A classic program compiled and ran. */
  classicWorks: boolean;
  /** A modern (void main + IO.println) program compiled and ran. */
  modernWorks: boolean;
  problems: JavaProblem[];
}

/** Problems that stop every challenge from running (as opposed to "use classic style"). */
export function blocking(report: JavaReport): JavaProblem[] {
  return report.problems.filter((p) => p.kind !== 'noModern');
}

/** Finds a command on the PATH, like `which`, so the report can show the real file. */
export function resolveCommand(cmd: string): string | undefined {
  if (path.isAbsolute(cmd)) {
    return fs.existsSync(cmd) ? cmd : undefined;
  }
  const exts = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', ''] : [''];
  for (const dir of (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)) {
    for (const ext of exts) {
      const candidate = path.join(dir, cmd + ext);
      try {
        if (fs.statSync(candidate).isFile()) {
          return candidate;
        }
      } catch {
        // not here
      }
    }
  }
  return undefined;
}

/** Major version from `java -version` output: 'version "21.0.2"', 'version "25"', or 'version "1.8.0_402"'. */
export function parseJavaVersion(output: string): number | undefined {
  const m = /version "(\d+)(?:\.(\d+))?/.exec(output);
  if (!m) {
    return undefined;
  }
  return m[1] === '1' ? Number(m[2]) : Number(m[1]);
}

async function tryProgram(source: string, javaHome: string | undefined): Promise<{ ok: boolean; detail: string }> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-java-check-'));
  try {
    const file = path.join(dir, 'Main.java');
    fs.writeFileSync(file, source);
    const outcome = await runChallengeCode({ file, tests: [{ input: '', output: 'ok\n' }], timeLimitMs: 15_000, javaHome });
    if (outcome.kind === 'tests') {
      const r = outcome.results[0];
      return r.passed ? { ok: true, detail: '' } : { ok: false, detail: (r.stderr || r.actual || `exit code ${r.exitCode}`).trim().split('\n').slice(0, 3).join('\n') };
    }
    return { ok: false, detail: outcome.kind === 'compileError' ? outcome.raw.trim().split('\n').slice(0, 3).join('\n') : outcome.kind === 'toolMissing' ? outcome.message : outcome.kind };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const CLASSIC_PROGRAM = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("ok");\n    }\n}\n';
const MODERN_PROGRAM = 'void main() {\n    IO.println("ok");\n}\n';

export async function checkJava(javaHome: string | undefined, style: 'modern' | 'classic'): Promise<JavaReport> {
  clearJavaCache();
  const javacCommand = javaBinary(javaHome, 'javac');
  const javaCommand = javaBinary(javaHome, 'java');
  const report: JavaReport = {
    javacCommand,
    javacPath: resolveCommand(javacCommand),
    javaCommand,
    javaPath: resolveCommand(javaCommand),
    javaHomeSetting: javaHome,
    javaHomeEnv: process.env.JAVA_HOME,
    classicWorks: false,
    modernWorks: false,
    problems: [],
  };
  report.javacVersion = await javacMajorVersion(javaHome);
  const javaRun = await exec(javaCommand, ['-version'], { cwd: os.tmpdir(), timeoutMs: 30_000 });
  report.javaVersion = javaRun.spawnError ? undefined : parseJavaVersion(javaRun.stdout + javaRun.stderr);

  if (report.javacVersion === undefined) {
    report.problems.push({ kind: 'javacMissing' });
  }
  if (report.javaVersion === undefined) {
    report.problems.push({ kind: 'javaMissing' });
  }
  if (report.javacVersion === undefined || report.javaVersion === undefined) {
    return report;
  }
  if (report.javaVersion < report.javacVersion) {
    // Classes compiled by a newer javac can't run on an older java ("UnsupportedClassVersionError").
    report.problems.push({ kind: 'mismatch', javac: report.javacVersion, java: report.javaVersion });
  }
  if (report.javacVersion < MIN_CLASSIC) {
    report.problems.push({ kind: 'tooOld', version: report.javacVersion });
  }
  const classic = await tryProgram(CLASSIC_PROGRAM, javaHome);
  report.classicWorks = classic.ok;
  if (report.javacVersion >= MIN_MODERN) {
    const modern = await tryProgram(MODERN_PROGRAM, javaHome);
    report.modernWorks = modern.ok;
    if (!modern.ok && classic.ok && style === 'modern') {
      report.problems.push({ kind: 'runFailed', detail: modern.detail });
    }
  } else if (style === 'modern' && report.javacVersion >= MIN_CLASSIC) {
    report.problems.push({ kind: 'noModern', version: report.javacVersion });
  }
  if (!classic.ok && !report.problems.some((p) => p.kind === 'mismatch' || p.kind === 'tooOld')) {
    report.problems.push({ kind: 'runFailed', detail: classic.detail });
  }
  return report;
}
