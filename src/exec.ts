// Runs a program with an input, a time limit and capped output. No vscode dependency.
import { spawn } from 'child_process';

const MAX_OUTPUT_BYTES = 256 * 1024;

export interface ProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  timeMs: number;
  /** The signal that ended the program, such as SIGSEGV when a C program crashes. */
  signal?: NodeJS.Signals | null;
  spawnError?: Error;
}

export function exec(cmd: string, args: string[], opts: { cwd: string; input?: string; timeoutMs: number; env?: NodeJS.ProcessEnv }): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    let outBytes = 0;
    let errBytes = 0;
    let timedOut = false;
    let settled = false;

    const child = spawn(cmd, args, { cwd: opts.cwd, windowsHide: true, env: opts.env ?? process.env });
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
    child.on('close', (code, signal) => finish({ code, signal }));
    // The program may exit before consuming all of its input.
    child.stdin.on('error', () => undefined);
    child.stdin.end(opts.input ?? '');
  });
}

