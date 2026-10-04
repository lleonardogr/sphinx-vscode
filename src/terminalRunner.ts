// Runs a student's program in an interactive VS Code terminal, so they can type input themselves
// and see exactly what it prints. Implemented as a Pseudoterminal so it behaves the same with any
// shell and OS, and uses the same compiler flags and locale as the tests.
import { tr } from './i18n';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { RunOutcome, compileJava, javaCommand } from './runner';

const DIM = '\x1b[2m';
const RED = '\x1b[31m';
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

  constructor(
    private readonly file: string,
    private readonly javaHome: string | undefined,
    private readonly onCompiled: (outcome: RunOutcome | undefined) => void,
  ) {}

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
    this.write(`${DIM}${tr('Compiling Main.java…', 'Compilando Main.java…')}${RESET}\r\n`);
    const compiled = await compileJava(this.file, this.javaHome);
    if (!compiled.ok) {
      this.onCompiled(compiled.outcome);
      const o = compiled.outcome;
      this.write(RED + crlf(o.kind === 'compileError' ? o.raw : o.message) + RESET + '\r\n');
      if (o.kind === 'compileError' && o.hint) {
        this.write(`\r\n${crlf(o.hint)}\r\n`);
      }
      this.finish(tr('Fix the errors above and run again.', 'Corrija os erros acima e rode de novo.'));
      return;
    }
    this.onCompiled(undefined);
    this.outDir = compiled.outDir;

    this.write(`${DIM}${tr('Running. Type your input and press Enter. Ctrl+D ends the input, Ctrl+C stops the program.', 'Rodando. Digite a entrada e aperte Enter. Ctrl+D encerra a entrada, Ctrl+C para o programa.')}${RESET}\r\n\r\n`);
    const { command, args } = javaCommand(compiled.outDir, this.javaHome);
    const child = spawn(command, args, { cwd: compiled.outDir, windowsHide: true });
    this.child = child;
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (d: string) => this.write(crlf(d)));
    child.stderr.on('data', (d: string) => this.write(RED + crlf(d) + RESET));
    child.stdin.on('error', () => undefined);
    child.on('error', (e) => this.finish(tr(`Could not start java: ${e.message}.`, `Não foi possível iniciar o java: ${e.message}.`)));
    child.on('close', (code, signal) => {
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
  onCompiled: (outcome: RunOutcome | undefined) => void;
}): void {
  current?.dispose();
  current = vscode.window.createTerminal({
    name: `▶ ${options.title}`,
    pty: new ProgramTerminal(options.file, options.javaHome, options.onCompiled),
    iconPath: new vscode.ThemeIcon('play'),
  });
  current.show();
}
