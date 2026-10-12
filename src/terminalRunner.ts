// Runs a student's program in an interactive VS Code terminal, so they can type input themselves
// and see exactly what it prints. Implemented as a Pseudoterminal so it behaves the same with any
// shell and OS, and uses the same compiler flags and locale as the tests.
import { tr } from './i18n';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { RunOutcome, compileJava, javaCommand } from './runner';
import { compileC, explainCrash, findCCompiler, runEnvironment } from './cRunner';

const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const crlf = (s: string) => s.replace(/\r?\n/g, '\r\n');

export class ProgramTerminal implements vscode.Pseudoterminal {
  private readonly writeEmitter = new vscode.EventEmitter<string>();
  private readonly closeEmitter = new vscode.EventEmitter<number | void>();
  readonly onDidWrite = this.writeEmitter.event;
  readonly onDidClose = this.closeEmitter.event;

  private child: ChildProcess | undefined;
  private outDir: string | undefined;
  private line = '';
  private finished = false;
  private stopped = false;

  /** The program's error output, kept to explain a C crash when it ends. */
  private stderr = '';

  constructor(
    private readonly file: string,
    private readonly options: { javaHome?: string; cCompiler?: string; cPortableDirs?: string[] },
    private readonly onCompiled: (outcome: RunOutcome | undefined) => void,
  ) {}

  /** Compiles the student's file: the command that runs it, or the outcome when it doesn't compile. */
  private async build(): Promise<{ command: string; args: string[]; cwd: string; env?: NodeJS.ProcessEnv; warnings?: RunOutcome } | { failed: Extract<RunOutcome, { kind: 'toolMissing' | 'compileError' }> }> {
    if (this.file.endsWith('.c')) {
      const compiler = await findCCompiler(this.options.cCompiler, this.options.cPortableDirs);
      const compiled = await compileC(this.file, compiler);
      if (!compiled.ok) {
        return { failed: compiled.kind === 'toolMissing' ? { kind: 'toolMissing', tool: 'c', message: compiled.message } : { kind: 'compileError', errors: compiled.errors, raw: compiled.raw } };
      }
      this.outDir = compiled.outDir;
      const warnings: RunOutcome | undefined = compiled.warnings.length ? { kind: 'tests', results: [], warnings: compiled.warnings } : undefined;
      for (const w of compiled.warnings) {
        this.write(`${YELLOW}${tr(`Warning, line ${w.line}`, `Aviso, linha ${w.line}`)}: ${crlf(w.message)}${RESET}\r\n`);
      }
      return { command: compiled.exe, args: [], cwd: compiled.outDir, env: runEnvironment(compiler!), warnings };
    }
    const compiled = await compileJava(this.file, this.options.javaHome);
    if (!compiled.ok) {
      return { failed: compiled.outcome };
    }
    this.outDir = compiled.outDir;
    return { ...javaCommand(compiled.outDir, this.options.javaHome), cwd: compiled.outDir };
  }

  private write(text: string): void {
    this.writeEmitter.fire(text);
  }

  private finish(message: string): void {
    this.finished = true;
    this.cleanup();
    this.write(`\r\n${DIM}${message} ${tr('Press any key to close this terminal.', 'Aperte qualquer tecla para fechar este terminal.')}${RESET}\r\n`);
  }

  private cleanup(): void {
    if (this.outDir) {
      fs.rmSync(this.outDir, { recursive: true, force: true });
      this.outDir = undefined;
    }
  }

  async open(): Promise<void> {
    this.write(`${DIM}${tr(`Compiling ${path.basename(this.file)}…`, `Compilando ${path.basename(this.file)}…`)}${RESET}\r\n`);
    const built = await this.build();
    if ('failed' in built) {
      this.onCompiled(built.failed);
      const o = built.failed;
      this.write(RED + crlf(o.kind === 'compileError' ? o.raw : o.message) + RESET + '\r\n');
      if (o.kind === 'compileError' && o.hint) {
        this.write(`\r\n${crlf(o.hint)}\r\n`);
      }
      this.finish(tr('Fix the errors above and run again.', 'Corrija os erros acima e rode de novo.'));
      return;
    }
    this.onCompiled(built.warnings);

    this.write(`${DIM}${tr('Running. Type your input and press Enter. Ctrl+D ends the input, Ctrl+C stops the program.', 'Rodando. Digite a entrada e aperte Enter. Ctrl+D encerra a entrada, Ctrl+C para o programa.')}${RESET}\r\n\r\n`);
    const child = spawn(built.command, built.args, { cwd: built.cwd, windowsHide: true, env: built.env ?? process.env });
    this.child = child;
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (d: string) => this.write(crlf(d)));
    child.stderr.on('data', (d: string) => {
      this.stderr = (this.stderr + d).slice(-64 * 1024);
      this.write(RED + crlf(d) + RESET);
    });
    child.stdin.on('error', () => undefined);
    child.on('error', (e) => this.finish(tr(`Could not start the program: ${e.message}.`, `Não foi possível iniciar o programa: ${e.message}.`)));
    child.on('close', (code, signal) => {
      const crash = this.file.endsWith('.c') && !this.stopped ? explainCrash(this.stderr, code, signal, path.basename(this.file)) : undefined;
      if (crash && !this.finished) {
        this.write(`\r\n${RED}✗ ${crlf(crash)}${RESET}\r\n`);
      }
      if (!this.finished) {
        this.finish(signal || this.stopped ? tr('Program stopped.', 'Programa parado.') : tr(`Program exited with code ${code}.`, `O programa terminou com código ${code}.`));
      }
    });
  }

  handleInput(data: string): void {
    if (this.finished) {
      this.closeEmitter.fire();
      return;
    }
    const stdin = this.child?.stdin;
    if (!stdin || stdin.writableEnded) {
      return;
    }
    // Drop arrow keys and other escape sequences; treat pasted newlines like Enter.
    const input = data.replace(/\x1b\[[0-9;?]*[A-Za-z~]/g, '').replace(/\x1b./g, '').replace(/\r\n|\n/g, '\r');
    for (const ch of input) {
      if (ch === '\r') {
        this.write('\r\n');
        stdin.write(this.line + '\n');
        this.line = '';
      } else if (ch === '\x7f' || ch === '\b') {
        if (this.line.length > 0) {
          this.line = Array.from(this.line).slice(0, -1).join('');
          this.write('\b \b');
        }
      } else if (ch === '\x03') {
        this.write('^C');
        this.stopped = true;
        this.child?.kill();
        return;
      } else if (ch === '\x04') {
        if (this.line) {
          stdin.write(this.line);
          this.line = '';
        }
        stdin.end();
        return;
      } else if (ch >= ' ') {
        this.line += ch;
        this.write(ch);
      }
    }
  }

  close(): void {
    this.child?.kill();
    this.cleanup();
  }
}

let current: vscode.Terminal | undefined;

/** Opens a terminal that compiles and runs `file` interactively, replacing any previous one. */
export function runInTerminal(options: {
  title: string;
  file: string;
  javaHome?: string;
  cCompiler?: string;
  cPortableDirs?: string[];
  onCompiled: (outcome: RunOutcome | undefined) => void;
}): void {
  current?.dispose();
  current = vscode.window.createTerminal({
    name: `▶ ${options.title}`,
    pty: new ProgramTerminal(options.file, options, options.onCompiled),
    iconPath: new vscode.ThemeIcon('play'),
  });
  current.show();
}
