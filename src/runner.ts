// Compiles and tests a student's Main.java. Has no dependency on the vscode API so the
// challenge validator script (scripts/validate-challenges.js) can reuse it.
import { tr } from './i18n';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export interface TestCase {
  input: string;
  output: string;
  hidden?: boolean;
}

export interface Rule {
  pattern: string;
  message: string;
}

export interface CompileError {
  line: number;
  column: number;
  message: string;
}

export interface TestResult {
  index: number;
  hidden: boolean;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  timeMs: number;
}

export type RunOutcome =
  | { kind: 'toolMissing'; message: string }
  | { kind: 'ruleViolation'; messages: string[] }
  | { kind: 'compileError'; errors: CompileError[]; raw: string; hint?: string }
  | { kind: 'tests'; results: TestResult[] };

export interface RunRequest {
  file: string;
  tests: TestCase[];
  mustContain?: Rule[];
  mustNotContain?: Rule[];
  timeLimitMs?: number;
  javaHome?: string;
}

const MAX_OUTPUT_BYTES = 256 * 1024;

// Fast JVM startup, and a fixed locale so Scanner.nextDouble() and printf("%.2f") use "."
// as the decimal separator on every student's machine.
const JVM_FLAGS = [
  '-XX:+IgnoreUnrecognizedVMOptions',
  '-XX:TieredStopAtLevel=1',
  '-XX:+UseSerialGC',
  '-Duser.language=en',
  '-Duser.country=US',
  '-Dfile.encoding=UTF-8',
  '-Dstdout.encoding=UTF-8',
];

interface ProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  timeMs: number;
  spawnError?: Error;
}

export function exec(cmd: string, args: string[], opts: { cwd: string; input?: string; timeoutMs: number }): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    let outBytes = 0;
    let errBytes = 0;
    let timedOut = false;
    let settled = false;

    const child = spawn(cmd, args, { cwd: opts.cwd, windowsHide: true });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, opts.timeoutMs);

    const finish = (extra: Partial<ProcessResult>) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve({
        code: null,
        stdout: Buffer.concat(out).toString('utf8'),
        stderr: Buffer.concat(err).toString('utf8'),
        timedOut,
        timeMs: Date.now() - start,
        ...extra,
      });
    };

    child.stdout.on('data', (d: Buffer) => {
      if (outBytes < MAX_OUTPUT_BYTES) {
        out.push(d);
        outBytes += d.length;
      }
    });
    child.stderr.on('data', (d: Buffer) => {
      if (errBytes < MAX_OUTPUT_BYTES) {
        err.push(d);
        errBytes += d.length;
      }
    });
    child.on('error', (e) => finish({ spawnError: e }));
    child.on('close', (code) => finish({ code }));
    // The program may exit before consuming all of its input.
    child.stdin.on('error', () => undefined);
    child.stdin.end(opts.input ?? '');
  });
}

export function javaBinary(javaHome: string | undefined, name: 'java' | 'javac'): string {
  if (!javaHome) {
    return name;
  }
  return path.join(javaHome, 'bin', process.platform === 'win32' ? `${name}.exe` : name);
}

export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

export function checkRules(source: string, mustContain: Rule[], mustNotContain: Rule[]): string[] {
  const code = stripComments(source);
  const messages: string[] = [];
  for (const rule of mustContain) {
    if (!new RegExp(rule.pattern, 'm').test(code)) {
      messages.push(rule.message);
    }
  }
  for (const rule of mustNotContain) {
    if (new RegExp(rule.pattern, 'm').test(code)) {
      messages.push(rule.message);
    }
  }
  return messages;
}

export function parseJavacErrors(raw: string): CompileError[] {
  const header = /^(.*\.java):(\d+): error: (.*)$/;
  const anyHeader = /^(.*\.java):(\d+): (error|warning): /;
  const lines = raw.split(/\r?\n/);
  const errors: CompileError[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = header.exec(lines[i]);
    if (!m) {
      continue;
    }
    const message = [m[3]];
    let column = 0;
    for (let j = i + 1; j < lines.length && !anyHeader.test(lines[j]) && !/^\d+ (errors?|warnings?)$/.test(lines[j]); j++) {
      if (lines[j].trim() === '^') {
        column = lines[j].indexOf('^');
      } else if (/^\s+(symbol|location|required|found|reason)\s*:/.test(lines[j])) {
        message.push(lines[j].trim());
      }
    }
    errors.push({ line: Number(m[2]), column, message: message.join('\n') });
  }
  return errors;
}

const versionCache = new Map<string, Promise<number | undefined>>();

/** Forgets cached javac versions, e.g. after the student installs a JDK or changes sphynx.java.home. */
export function clearJavaCache(): void {
  versionCache.clear();
}

/** Major version of the JDK's javac (e.g. 17, 25), or undefined if it can't be determined. */
export function javacMajorVersion(javaHome?: string): Promise<number | undefined> {
  const javac = javaBinary(javaHome, 'javac');
  let version = versionCache.get(javac);
  if (!version) {
    version = exec(javac, ['-version'], { cwd: os.tmpdir(), timeoutMs: 30_000 }).then((r) => {
      const m = /javac\s+(\d+)(?:\.(\d+))?/.exec(r.stdout + r.stderr);
      if (!m) {
        versionCache.delete(javac);
        return undefined;
      }
      // Java 8 and older report "1.8.0".
      return m[1] === '1' ? Number(m[2]) : Number(m[1]);
    });
    versionCache.set(javac, version);
  }
  return version;
}

// Errors an older JDK gives for Java 25 syntax: compact source files (`void main()` without a
// class) and the java.lang.IO class.
const MODERN_SYNTAX_ERROR = /class, interface, enum, or record expected|implicitly declared class|unnamed class|preview feature|symbol:\s+(variable|class) IO\b/;

async function modernSyntaxHint(raw: string, javaHome?: string): Promise<string | undefined> {
  if (!MODERN_SYNTAX_ERROR.test(raw)) {
    return undefined;
  }
  const major = await javacMajorVersion(javaHome);
  if (major === undefined || major >= 25) {
    return undefined;
  }
  return tr(
    `If you are using modern Java syntax (void main() without a class, or IO.println / IO.readln), ` +
      `it needs JDK 25 or newer, but you have JDK ${major}. Install a newer JDK, ` +
      `or use the classic form: public class Main { public static void main(String[] args) { ... } } with System.out.println.`,
    `Se você está usando a sintaxe moderna do Java (void main() sem classe, ou IO.println / IO.readln), ` +
      `ela precisa do JDK 25 ou mais novo, mas você tem o JDK ${major}. Instale um JDK mais novo, ` +
      `ou use a forma clássica: public class Main { public static void main(String[] args) { ... } } com System.out.println.`,
  );
}

function toolMissing(cmd: string): RunOutcome {
  return {
    kind: 'toolMissing',
    message: tr(
      `Could not run "${cmd}". Install a Java JDK (version 17 or newer; 25+ for modern syntax like IO.println), e.g. from https://adoptium.net, ` +
        `then restart VS Code, or set "sphynx.java.home" in Settings to your JDK folder.`,
      `Não foi possível rodar "${cmd}". Instale um JDK do Java (versão 17 ou mais nova; 25+ para a sintaxe moderna como IO.println), por exemplo em https://adoptium.net, ` +
        `e reinicie o VS Code, ou defina "sphynx.java.home" nas configurações com a pasta do seu JDK.`,
    ),
  };
}

export type CompileResult =
  | { ok: true; outDir: string }
  | { ok: false; outcome: Extract<RunOutcome, { kind: 'toolMissing' | 'compileError' }> };

/** Compiles `file` into a fresh temp folder. On success the caller must delete `outDir`. */
export async function compileJava(file: string, javaHome?: string): Promise<CompileResult> {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-'));
  const javac = javaBinary(javaHome, 'javac');
  const compile = await exec(
    javac,
    ['-J-Duser.language=en', '-J-Duser.country=US', '-encoding', 'UTF-8', '-d', outDir, path.basename(file)],
    { cwd: path.dirname(file), timeoutMs: 60_000 },
  );
  if (compile.spawnError || compile.code !== 0) {
    fs.rmSync(outDir, { recursive: true, force: true });
    if (compile.spawnError) {
      return { ok: false, outcome: toolMissing(javac) as Extract<RunOutcome, { kind: 'toolMissing' }> };
    }
    const raw = (compile.stderr + compile.stdout).trim();
    return { ok: false, outcome: { kind: 'compileError', errors: parseJavacErrors(raw), raw, hint: await modernSyntaxHint(raw, javaHome) } };
  }
  return { ok: true, outDir };
}

/** Command and arguments that run the compiled program in `outDir`. */
export function javaCommand(outDir: string, javaHome?: string): { command: string; args: string[] } {
  return { command: javaBinary(javaHome, 'java'), args: [...JVM_FLAGS, '-cp', outDir, 'Main'] };
}

export async function runChallengeCode(req: RunRequest): Promise<RunOutcome> {
  const source = fs.readFileSync(req.file, 'utf8');
  const violations = checkRules(source, req.mustContain ?? [], req.mustNotContain ?? []);
  if (violations.length > 0) {
    return { kind: 'ruleViolation', messages: violations };
  }

  const compiled = await compileJava(req.file, req.javaHome);
  if (!compiled.ok) {
    return compiled.outcome;
  }
  try {
    const { command, args } = javaCommand(compiled.outDir, req.javaHome);
    const results: TestResult[] = [];
    for (const [index, test] of req.tests.entries()) {
      const r = await exec(command, args, {
        cwd: compiled.outDir,
        input: test.input,
        timeoutMs: req.timeLimitMs ?? 5000,
      });
      if (r.spawnError) {
        return toolMissing(command);
      }
      results.push({
        index,
        hidden: !!test.hidden,
        passed: !r.timedOut && r.code === 0 && normalizeOutput(r.stdout) === normalizeOutput(test.output),
        input: test.input,
        expected: test.output,
        actual: r.stdout,
        stderr: r.stderr,
        exitCode: r.code,
        timedOut: r.timedOut,
        timeMs: r.timeMs,
      });
    }
    return { kind: 'tests', results };
  } finally {
    fs.rmSync(compiled.outDir, { recursive: true, force: true });
  }
}
