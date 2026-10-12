// C challenges: find a C compiler, compile main.c with memory checks (AddressSanitizer and
// UndefinedBehaviorSanitizer) where the compiler supports them, and explain crashes in plain words.
// No vscode dependency, so the validator script can reuse it.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { exec } from './exec';
import { tr } from './i18n';

export interface CompileMessage {
  line: number;
  column: number;
  message: string;
}

export interface CCompiler {
  /** The compiler to run: a command on the PATH or a full path. */
  command: string;
  /** Its first --version line, such as "Apple clang version 21.0.0". */
  version: string;
  /** Whether it can build with AddressSanitizer and UndefinedBehaviorSanitizer. */
  sanitizers: boolean;
  /**
   * Flags this compiler needs, found when it was probed: "-lm" for the math library where it is a separate
   * library, and on Microsoft's C runtime "-D_CRT_SECURE_NO_WARNINGS", so scanf and strcpy don't warn.
   */
  flags: string[];
}

export const C_STANDARD_FLAGS = ['-std=c17', '-Wall', '-Wextra', '-g', '-O0'];
export const C_SANITIZER_FLAGS = ['-fsanitize=address,undefined', '-fno-omit-frame-pointer', '-fno-sanitize-recover=undefined'];

/**
 * Leaks are not reported (a program that forgets free() still passes), and ASan exits with code 1 like
 * any crash. UBSan prints where undefined behaviour happened.
 */
const SANITIZER_ENV = { ASAN_OPTIONS: 'detect_leaks=0:abort_on_error=0:print_summary=1', UBSAN_OPTIONS: 'print_stacktrace=1' };

const exeName = (dir: string) => path.join(dir, process.platform === 'win32' ? 'main.exe' : 'main');

/**
 * Where to look for a compiler, in order: the sphinx.c.compiler setting (a compiler, or a folder
 * holding one in bin/), Sphinx's portable compilers, then the usual commands on the PATH.
 */
export function compilerCandidates(setting: string | undefined, portableDirs: string[] = []): string[] {
  const exe = (name: string) => (process.platform === 'win32' ? `${name}.exe` : name);
  const inFolder = (dir: string) => ['clang', 'gcc', 'cc'].map((n) => path.join(dir, 'bin', exe(n)));
  const candidates: string[] = [];
  const configured = setting?.trim();
  if (configured) {
    candidates.push(...(fs.existsSync(configured) && fs.statSync(configured).isDirectory() ? inFolder(configured) : [configured]));
  }
  candidates.push(...portableDirs.flatMap(inFolder));
  candidates.push(...(process.platform === 'win32' ? ['clang', 'gcc', 'cc'] : ['cc', 'clang', 'gcc']));
  return candidates;
}

/** The folders a compiled program needs on its PATH: the compiler's own, for its runtime DLLs on Windows. */
function runtimeDirs(compiler: string): string[] {
  if (!path.isAbsolute(compiler)) {
    return [];
  }
  const bin = path.dirname(compiler);
  return [bin, path.join(bin, '..', 'x86_64-w64-mingw32', 'bin'), path.join(bin, '..', 'aarch64-w64-mingw32', 'bin')].filter((d) => fs.existsSync(d));
}

/** The environment a compiled program runs with: the sanitizer options and the compiler's runtime folders. */
export function runEnvironment(compiler: CCompiler): NodeJS.ProcessEnv {
  const extra = runtimeDirs(compiler.command);
  const pathKey = Object.keys(process.env).find((k) => k.toUpperCase() === 'PATH') ?? 'PATH';
  return {
    ...process.env,
    ...SANITIZER_ENV,
    ...(extra.length ? { [pathKey]: [...extra, process.env[pathKey] ?? ''].join(path.delimiter) } : {}),
  };
}

const cache = new Map<string, Promise<CCompiler | undefined>>();

/** Forgets the compilers found, e.g. after the student installs one or changes sphinx.c.compiler. */
export function clearCCompilerCache(): void {
  cache.clear();
}

/**
 * Whether `command` is a working C compiler: it must build and run a small program with Sphinx's flags.
 * Also finds the flags it needs (see CCompiler.flags) and whether it can add the sanitizers.
 */
async function probe(command: string): Promise<CCompiler | undefined> {
  const version = await exec(command, ['--version'], { cwd: os.tmpdir(), timeoutMs: 30_000 });
  if (version.spawnError || version.code !== 0) {
    return undefined;
  }
  const about = version.stdout + version.stderr;
  // clang for Microsoft's C runtime: no separate math library, and scanf/strcpy are "deprecated".
  const msvc = /windows-msvc/i.test(about);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-cc-'));
  try {
    fs.writeFileSync(path.join(dir, 'probe.c'), '#include <math.h>\n#include <stdio.h>\nint main(void) { char s[8]; if (scanf("%7s", s) != 1) return 2; printf("%s %.0f\\n", s, sqrt(16.0)); return 0; }\n');
    const works = async (flags: string[], env?: NodeJS.ProcessEnv) => {
      fs.rmSync(exeName(dir), { force: true });
      const build = await exec(command, [...flags, 'probe.c', '-o', exeName(dir), ...(msvc ? [] : ['-lm'])], { cwd: dir, timeoutMs: 60_000 });
      if (build.code !== 0) {
        return false;
      }
      // Linking is not enough on every system: the program must also start and run.
      const run = await exec(exeName(dir), [], { cwd: dir, input: 'ok\n', timeoutMs: 15_000, env });
      return run.code === 0 && run.stdout.trim() === 'ok 4';
    };
    const flags = [...(msvc ? ['-D_CRT_SECURE_NO_WARNINGS'] : []), ...(msvc ? [] : ['-lm'])];
    const extra = msvc ? ['-D_CRT_SECURE_NO_WARNINGS'] : [];
    if (!(await works([...C_STANDARD_FLAGS, ...extra]))) {
      return undefined;
    }
    const compiler: CCompiler = { command, version: about.split(/\r?\n/)[0].trim(), sanitizers: false, flags };
    compiler.sanitizers = await works([...C_STANDARD_FLAGS, ...C_SANITIZER_FLAGS, ...extra], runEnvironment(compiler));
    return compiler;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** The first working compiler among the candidates (see compilerCandidates), or undefined. */
export async function findCCompiler(setting?: string, portableDirs: string[] = []): Promise<CCompiler | undefined> {
  const key = JSON.stringify([setting ?? '', portableDirs]);
  let found = cache.get(key);
  if (!found) {
    found = (async () => {
      for (const candidate of compilerCandidates(setting, portableDirs)) {
        if (path.isAbsolute(candidate) && !fs.existsSync(candidate)) {
          continue;
        }
        const compiler = await probe(candidate);
        if (compiler) {
          return compiler;
        }
      }
      return undefined;
    })();
    cache.set(key, found);
    // A failed search is not remembered: the student may install a compiler and try again.
    void found.then((c) => {
      if (!c) {
        cache.delete(key);
      }
    });
  }
  return found;
}

/** What to do when no C compiler is found, for the student's system. */
export function cCompilerMissing(): string {
  if (process.platform === 'darwin') {
    return tr(
      'No C compiler was found. Install Apple\'s command line tools: run "xcode-select --install" in a terminal, then try again.',
      'Nenhum compilador de C foi encontrado. Instale as ferramentas de linha de comando da Apple: rode "xcode-select --install" num terminal e tente de novo.',
    );
  }
  if (process.platform === 'win32') {
    return tr(
      'No C compiler was found. Install llvm-mingw (a portable compiler: unzip it, no installation needed) from https://github.com/mstorsjo/llvm-mingw/releases and set "sphinx.c.compiler" to its folder, or ask your teacher which compiler your class uses.',
      'Nenhum compilador de C foi encontrado. Instale o llvm-mingw (um compilador portátil: é só descompactar, sem instalação) em https://github.com/mstorsjo/llvm-mingw/releases e defina "sphinx.c.compiler" com a pasta dele, ou pergunte ao professor qual compilador a turma usa.',
    );
  }
  return tr(
    'No C compiler was found. Install one, for example with "sudo apt install build-essential" (Debian, Ubuntu) or "sudo dnf install gcc" (Fedora), then try again.',
    'Nenhum compilador de C foi encontrado. Instale um, por exemplo com "sudo apt install build-essential" (Debian, Ubuntu) ou "sudo dnf install gcc" (Fedora), e tente de novo.',
  );
}

/** Errors and warnings from gcc or clang output, for the student's file only. */
export function parseCompilerOutput(raw: string, fileName: string): { errors: CompileMessage[]; warnings: CompileMessage[] } {
  const errors: CompileMessage[] = [];
  const warnings: CompileMessage[] = [];
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const header = new RegExp(`(?:^|[\\\\/])${escaped}:(\\d+):(\\d+): (fatal error|error|warning): (.*)$`);
  for (const line of raw.split(/\r?\n/)) {
    const m = header.exec(line);
    if (m) {
      // 0-based, like javac's columns.
      const message = { line: Number(m[1]), column: Math.max(0, Number(m[2]) - 1), message: m[4].trim() };
      (m[3] === 'warning' ? warnings : errors).push(message);
    }
  }
  return { errors, warnings };
}

export type CCompileResult =
  | { ok: true; outDir: string; exe: string; warnings: CompileMessage[] }
  | { ok: false; kind: 'compileError'; errors: CompileMessage[]; raw: string }
  | { ok: false; kind: 'toolMissing'; message: string };

/** Compiles `file` (a main.c) into a fresh temp folder. On success the caller must delete `outDir`. */
export async function compileC(file: string, compiler: CCompiler | undefined): Promise<CCompileResult> {
  if (!compiler) {
    return { ok: false, kind: 'toolMissing', message: cCompilerMissing() };
  }
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-c-'));
  const exe = exeName(outDir);
  // compiler.flags go last: "-lm" must come after the source file.
  const args = [...C_STANDARD_FLAGS, ...(compiler.sanitizers ? C_SANITIZER_FLAGS : []), path.basename(file), '-o', exe, ...compiler.flags];
  const build = await exec(compiler.command, args, { cwd: path.dirname(file), timeoutMs: 60_000 });
  const raw = (build.stderr + build.stdout).trim();
  const { errors, warnings } = parseCompilerOutput(raw, path.basename(file));
  if (build.spawnError || build.code !== 0) {
    fs.rmSync(outDir, { recursive: true, force: true });
    if (build.spawnError) {
      return { ok: false, kind: 'toolMissing', message: cCompilerMissing() };
    }
    return { ok: false, kind: 'compileError', errors, raw };
  }
  return { ok: true, outDir, exe, warnings };
}

// Windows exception codes, as a program's exit code.
const ACCESS_VIOLATION = 0xc0000005;
const STACK_OVERFLOW = 0xc00000fd;
const INTEGER_DIVIDE_BY_ZERO = 0xc0000094;

/**
 * A plain-words explanation of how a C program crashed, from the sanitizer report in `stderr`
 * or, without one, from its exit code or signal. Undefined when it did not crash.
 */
export function explainCrash(stderr: string, code: number | null, signal: NodeJS.Signals | null | undefined, fileName = 'main.c'): string | undefined {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineIn = (text: string) => {
    const m = new RegExp(`(?:^|[\\\\/\\s])${escaped}:(\\d+)`).exec(text);
    return m ? Number(m[1]) : undefined;
  };
  const at = (line: number | undefined) => (line ? tr(`Line ${line}: `, `Linha ${line}: `) : '');

  // UndefinedBehaviorSanitizer: "main.c:8:9: runtime error: index 5 out of bounds for type 'int[5]'"
  const ub = new RegExp(`(?:^|[\\\\/\\s])${escaped}:(\\d+):\\d+: runtime error: (.+)$`, 'm').exec(stderr);
  if (ub) {
    const line = Number(ub[1]);
    const what = ub[2].trim();
    if (/out of bounds/.test(what)) {
      return at(line) + tr(`an index past the end of an array (${what}).`, `um índice além do fim de um array (${what}).`);
    }
    if (/signed integer overflow/.test(what)) {
      return at(line) + tr(`the result doesn't fit in its type (${what}).`, `o resultado não cabe no tipo dele (${what}).`);
    }
    if (/null pointer/.test(what)) {
      return at(line) + tr(`your program used a NULL pointer (${what}).`, `seu programa usou um ponteiro NULL (${what}).`);
    }
    if (/division by zero/.test(what)) {
      return at(line) + tr('a division by zero.', 'uma divisão por zero.');
    }
    return at(line) + tr(`undefined behaviour: ${what}.`, `comportamento indefinido: ${what}.`);
  }

  // AddressSanitizer: "ERROR: AddressSanitizer: heap-buffer-overflow …", with the student's line in the
  // first stack frames, and where the memory was allocated or freed.
  const asan = /ERROR: AddressSanitizer: ([\w-]+)(?: on (unknown )?address (0x[0-9a-f]+))?/.exec(stderr);
  if (asan) {
    const kind = asan[1];
    const summary = /SUMMARY: AddressSanitizer: [\w-]+ (.*)$/m.exec(stderr)?.[1] ?? '';
    const head = stderr.slice(asan.index).split(/\n(?:allocated|freed|previously allocated) by thread/)[0];
    const line = lineIn(summary) ?? lineIn(head);
    const section = (name: string) => {
      const i = stderr.search(new RegExp(`^${name} by thread`, 'm'));
      return i < 0 ? undefined : lineIn(stderr.slice(i).split(/\n\n/)[0]);
    };
    const allocated = section('allocated') ?? section('previously allocated');
    const freed = section('freed');
    switch (kind) {
      case 'heap-buffer-overflow':
        return (
          at(line) +
          tr(
            `your program went past the end of memory from malloc${allocated ? ` (allocated at line ${allocated})` : ''}.`,
            `seu programa passou do fim da memória do malloc${allocated ? ` (alocada na linha ${allocated})` : ''}.`,
          )
        );
      case 'stack-buffer-overflow':
      case 'global-buffer-overflow':
      case 'stack-buffer-underflow':
        return at(line) + tr("your program went past the end of an array (or of a string with no room for its '\\0').", "seu programa passou do fim de um array (ou de uma string sem espaço para o '\\0').");
      case 'heap-use-after-free':
        return at(line) + tr(`your program used memory after freeing it${freed ? ` (freed at line ${freed})` : ''}.`, `seu programa usou memória depois de liberá-la${freed ? ` (liberada na linha ${freed})` : ''}.`);
      case 'double-free':
        return at(line) + tr(`your program freed the same memory twice${freed ? ` (first at line ${freed})` : ''}.`, `seu programa liberou a mesma memória duas vezes${freed ? ` (a primeira na linha ${freed})` : ''}.`);
      case 'bad-free':
      case 'attempting':
        return at(line) + tr('free() was given an address that did not come from malloc.', 'o free() recebeu um endereço que não veio do malloc.');
      case 'stack-overflow':
        return at(line) + tr('the stack overflowed: a recursion that never reaches its base case, or a huge local array.', 'a pilha estourou: uma recursão que nunca chega ao caso base, ou um array local enorme.');
      case 'SEGV':
        return asan[3] && /^0x0+$/.test(asan[3])
          ? at(line) + tr('your program used a NULL pointer.', 'seu programa usou um ponteiro NULL.')
          : at(line) + tr('your program used an invalid pointer (never set, or already freed).', 'seu programa usou um ponteiro inválido (nunca definido, ou já liberado).');
      default:
        return at(line) + tr(`a memory error (${kind}).`, `um erro de memória (${kind}).`);
    }
  }

  // No sanitizer report: the exit code or signal is all there is.
  if (signal === 'SIGSEGV' || signal === 'SIGBUS' || code === 139 || code === ACCESS_VIOLATION || code === ACCESS_VIOLATION - 2 ** 32) {
    return tr(
      'Your program crashed with an invalid memory access: a NULL or uninitialized pointer, or an index past the end of an array.',
      'Seu programa travou com um acesso inválido à memória: um ponteiro NULL ou não inicializado, ou um índice além do fim de um array.',
    );
  }
  if (code === STACK_OVERFLOW || code === STACK_OVERFLOW - 2 ** 32) {
    return tr('Your program crashed: the stack overflowed (a recursion that never stops?).', 'Seu programa travou: a pilha estourou (uma recursão que nunca para?).');
  }
  if (signal === 'SIGFPE' || code === 136 || code === INTEGER_DIVIDE_BY_ZERO || code === INTEGER_DIVIDE_BY_ZERO - 2 ** 32) {
    return tr('Your program crashed: a division by zero.', 'Seu programa travou: uma divisão por zero.');
  }
  if (signal === 'SIGABRT' || code === 134) {
    return tr('Your program stopped itself (abort), often after a memory error.', 'Seu programa se interrompeu (abort), muitas vezes depois de um erro de memória.');
  }
  return undefined;
}
