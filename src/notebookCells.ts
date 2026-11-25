// Notebook lessons without the vscode API: how a cell becomes a program, which cells answer challenges, and the
// validator's checks. notebook.ts runs the cells inside VS Code.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { isWholeProgram, quizProgram } from './quizzes';
import { RunOutcome, RunRequest, runChallengeCode } from './runner';

const CHALLENGE_MARK = /^\s*\/\/\s*sphinx:\s*challenge\s+([\w-]+)/;
const SHARED_MARK = /^\s*\/\/\s*(shared|compartilhado)\b/i;

/** How long a plain cell may run: longer than a test, since cells time experiments. */
export const CELL_TIME_LIMIT_MS = 20000;

/** The challenge a cell answers, from its first line ("// sphinx: challenge <id>"). */
export function cellChallenge(code: string): string | undefined {
  return CHALLENGE_MARK.exec(code.split('\n')[0] ?? '')?.[1];
}

/** True for a cell whose first line is "// shared": its methods and records are available to the cells below. */
export function isSharedCell(code: string): boolean {
  return SHARED_MARK.test(code.split('\n')[0] ?? '');
}

/**
 * The program a plain cell runs: the shared cells above it, then the cell, wrapped in void main() when it is only
 * statements. Also the line where the cell's own code starts in it (1-based), to map compiler errors back.
 */
export function cellProgram(shared: string[], code: string, isShared = isSharedCell(code)): { source: string; firstLine: number } {
  const prefix = shared.length ? `${shared.join('\n\n')}\n\n` : '';
  const before = prefix.split('\n').length - 1;
  if (isShared) {
    return { source: `${prefix}${code}\n\nvoid main() {\n}\n`, firstLine: before + 1 };
  }
  const whole = isWholeProgram(code);
  return { source: prefix + quizProgram(code), firstLine: before + (whole ? 1 : 2) };
}

/** Runs `source` as Main.java in a temp folder. */
export async function runCellSource(source: string, request: Omit<RunRequest, 'file'>): Promise<RunOutcome> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-cell-'));
  try {
    const file = path.join(dir, 'Main.java');
    fs.writeFileSync(file, source);
    return await runChallengeCode({ ...request, file });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export interface NotebookCell {
  kind: 'code' | 'markdown';
  source: string;
}

/** The cells of an .ipynb file. Throws on a file that isn't a notebook. */
export function readNotebook(file: string): NotebookCell[] {
  const nb = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(nb?.cells)) {
    throw new Error(`${path.basename(file)} is not a notebook: it has no "cells"`);
  }
  return nb.cells.map((c: { cell_type?: string; source?: string | string[] }) => ({
    kind: c.cell_type === 'code' ? 'code' : 'markdown',
    source: Array.isArray(c.source) ? c.source.join('') : (c.source ?? ''),
  }));
}

/** The lesson's notebooks: lesson.ipynb and its translations, such as lesson.pt-br.ipynb. */
export function lessonNotebooks(dir: string): string[] {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^lesson(\.[\w-]+)?\.ipynb$/.test(f)).sort().map((f) => path.join(dir, f)) : [];
}

/**
 * Checks a lesson's notebooks: every plain cell compiles and runs without crashing (with JDK 25 or newer), and
 * every challenge cell names a Java challenge that exists. Returns the problems and how many cells ran.
 */
export async function notebookProblems(
  dir: string,
  javacVersion: number | undefined,
  challengeLanguage: (id: string) => string | undefined,
  tools: Pick<RunRequest, 'javaHome' | 'cCompiler' | 'cPortableDirs'> = {},
): Promise<{ problems: string[]; cellsRun: number }> {
  const problems: string[] = [];
  let cellsRun = 0;
  for (const file of lessonNotebooks(dir)) {
    const name = path.basename(file);
    let cells: NotebookCell[];
    try {
      cells = readNotebook(file);
    } catch (e) {
      problems.push((e as Error).message);
      continue;
    }
    const shared: string[] = [];
    for (const [i, cell] of cells.entries()) {
      if (cell.kind !== 'code') {
        continue;
      }
      const where = `${name}, cell ${i + 1}`;
      const challengeId = cellChallenge(cell.source);
      if (challengeId) {
        const language = challengeLanguage(challengeId);
        if (!language) {
          problems.push(`${where}: no challenge called "${challengeId}"`);
        } else if (language !== 'java') {
          problems.push(`${where}: "${challengeId}" is a ${language} challenge; notebook cells run Java`);
        }
        continue;
      }
      const isShared = isSharedCell(cell.source);
      if ((javacVersion ?? 0) >= 25) {
        const { source } = cellProgram(shared, cell.source, isShared);
        const outcome = await runCellSource(source, { tests: [{ input: '', output: '' }], timeLimitMs: CELL_TIME_LIMIT_MS, ...tools });
        cellsRun++;
        if (outcome.kind === 'compileError') {
          problems.push(`${where} does not compile:\n${outcome.raw}`);
        } else if (outcome.kind !== 'tests') {
          problems.push(`${where}: ${outcome.kind === 'toolMissing' ? outcome.message : outcome.messages.join('; ')}`);
        } else if (outcome.results[0].timedOut) {
          problems.push(`${where} runs for more than ${CELL_TIME_LIMIT_MS / 1000} seconds`);
        } else if (outcome.results[0].exitCode !== 0) {
          problems.push(`${where} crashes:\n${outcome.results[0].stderr}`);
        }
      }
      if (isShared) {
        shared.push(cell.source);
      }
    }
  }
  return { problems, cellsRun };
}
