// Experimental: lessons as notebooks. A lesson folder can hold lesson.ipynb (and lesson.<lang>.ipynb); Sphinx
// opens it in VS Code's built-in notebook editor and runs its Java cells itself, with the student's JDK, so no
// Jupyter kernel is needed.
//   - A plain code cell is a few statements (wrapped in void main()) or a whole program.
//   - A cell starting with "// shared" defines methods or records the cells below it can use.
//   - A cell starting with "// sphinx: challenge <id>" is a solution to that challenge: running it runs the
//     challenge's tests, hidden ones included, and counts in the student's progress.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { tr } from './i18n';
import { CELL_TIME_LIMIT_MS, CellLanguage, cellChallenge, cellProgram, isSharedCell, runCellSource } from './notebookCells';
import { RunOutcome, TestResult } from './runner';

export const CONTROLLER_ID = 'sphinx-java';

/** What the controller needs from the extension. */
export interface NotebookHost {
  findChallenge(id: string): Challenge | undefined;
  runnerOptions(): { javaHome?: string; cCompiler?: string; cPortableDirs?: string[] };
  /** A challenge cell ran: record the attempt. */
  onChallengeResult(c: Challenge, solved: boolean): Promise<void>;
  /** A cell ran without errors in a lesson notebook. */
  onCellRan(notebook: vscode.NotebookDocument): void;
}

/** A cell's language: C cells are marked "c" in the notebook; everything else runs as Java. */
function cellLanguage(cell: vscode.NotebookCell): CellLanguage {
  return cell.document.languageId === 'c' ? 'c' : 'java';
}

function problemOutput(outcome: RunOutcome, firstLine: number): vscode.NotebookCellOutput | undefined {
  if (outcome.kind === 'toolMissing') {
    return new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(outcome.message)]);
  }
  if (outcome.kind === 'ruleViolation') {
    return new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(outcome.messages.map((m) => `✗ ${m}`).join('\n'))]);
  }
  if (outcome.kind === 'compileError') {
    const lines = outcome.errors.length
      ? outcome.errors.map((e) => `${tr('line', 'linha')} ${Math.max(1, e.line - firstLine + 1)}: ${e.message}`).join('\n')
      : outcome.raw;
    return new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(`${tr("The cell doesn't compile:", 'A célula não compila:')}\n${lines}${outcome.hint ? `\n\n${outcome.hint}` : ''}`)]);
  }
  return undefined;
}

function testLine(r: TestResult): string {
  const name = r.hidden ? tr(`Hidden test ${r.index + 1}`, `Teste oculto ${r.index + 1}`) : tr(`Test ${r.index + 1}`, `Teste ${r.index + 1}`);
  if (r.passed) {
    return `✓ ${name} (${r.timeMs} ms)`;
  }
  if (r.timedOut) {
    return `✗ ${name}: ${r.generated ? tr('took too long on a big input (is there a faster approach?)', 'demorou demais numa entrada grande (há uma abordagem mais rápida?)') : tr('took too long', 'demorou demais')}`;
  }
  if (r.exitCode !== 0) {
    const why = r.crash ?? r.stderr.trim().split('\n')[0];
    return `✗ ${name}: ${tr('crashed', 'travou')}${why ? `\n    ${why}` : ''}`;
  }
  if (r.hidden) {
    return `✗ ${name}: ${tr('wrong answer', 'resposta errada')}`;
  }
  const show = (s: string) => s.replace(/\n$/, '').split('\n').join('\n      ');
  return `✗ ${name}: ${tr('wrong answer', 'resposta errada')}\n    ${tr('input', 'entrada')}:\n      ${show(r.input)}\n    ${tr('expected', 'esperado')}:\n      ${show(r.expected)}\n    ${tr('printed', 'impresso')}:\n      ${show(r.actual) || tr('(nothing)', '(nada)')}`;
}

export function registerNotebookController(host: NotebookHost): vscode.NotebookController {
  const controller = vscode.notebooks.createNotebookController(CONTROLLER_ID, 'jupyter-notebook', 'Sphinx');
  controller.supportedLanguages = ['java', 'c'];
  controller.supportsExecutionOrder = true;
  controller.description = tr('Runs Java and C cells with your JDK and C compiler', 'Roda células Java e C com o seu JDK e compilador de C');
  let order = 0;

  async function runCell(cell: vscode.NotebookCell): Promise<void> {
    const execution = controller.createNotebookCellExecution(cell);
    execution.executionOrder = ++order;
    execution.start(Date.now());
    await execution.clearOutput();
    const code = cell.document.getText();
    let ok = false;
    try {
      const challengeId = cellChallenge(code);
      if (challengeId) {
        ok = await runChallengeCell(execution, cell, challengeId, code);
      } else {
        ok = await runPlainCell(execution, cell, code);
      }
    } catch (e) {
      await execution.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.error(e as Error)]));
    }
    execution.end(ok, Date.now());
    if (ok) {
      host.onCellRan(cell.notebook);
    }
  }

  async function runPlainCell(execution: vscode.NotebookCellExecution, cell: vscode.NotebookCell, code: string): Promise<boolean> {
    const lang = cellLanguage(cell);
    const shared = cell.notebook
      .getCells()
      .filter((c) => c.index < cell.index && c.kind === vscode.NotebookCellKind.Code && cellLanguage(c) === lang && isSharedCell(c.document.getText()))
      .map((c) => c.document.getText());
    const isShared = isSharedCell(code);
    const { source, firstLine } = cellProgram(shared, code, isShared, lang);
    const outcome = await runCellSource(source, { tests: [{ input: '', output: '' }], timeLimitMs: CELL_TIME_LIMIT_MS, ...host.runnerOptions() }, lang);
    const problem = problemOutput(outcome, firstLine);
    if (problem || outcome.kind !== 'tests') {
      await execution.replaceOutput(problem ?? []);
      return false;
    }
    const r = outcome.results[0];
    const items: vscode.NotebookCellOutputItem[] = [];
    if (outcome.warnings?.length) {
      items.push(vscode.NotebookCellOutputItem.stderr(`${tr('Compiler warnings:', 'Avisos do compilador:')}\n${outcome.warnings.map((w) => `${tr('line', 'linha')} ${Math.max(1, w.line - firstLine + 1)}: ${w.message}`).join('\n')}\n`));
    }
    if (r.crash) {
      items.push(vscode.NotebookCellOutputItem.stderr(`✗ ${r.crash}\n`));
    }
    if (isShared && !r.actual) {
      items.push(vscode.NotebookCellOutputItem.text(tr('✓ Defined: the cells below can use it.', '✓ Definido: as células abaixo podem usar.')));
    }
    if (r.actual) {
      items.push(vscode.NotebookCellOutputItem.stdout(r.actual));
    }
    if (r.stderr.trim()) {
      items.push(vscode.NotebookCellOutputItem.stderr(r.stderr));
    }
    if (r.timedOut) {
      items.push(vscode.NotebookCellOutputItem.stderr(tr('⏱ Stopped after 20 seconds.', '⏱ Parado depois de 20 segundos.')));
    }
    await execution.replaceOutput(items.length ? new vscode.NotebookCellOutput(items) : []);
    return !r.timedOut && r.exitCode === 0;
  }

  async function runChallengeCell(execution: vscode.NotebookCellExecution, cell: vscode.NotebookCell, id: string, code: string): Promise<boolean> {
    const c = host.findChallenge(id);
    const lang = cellLanguage(cell);
    if (!c || c.language !== lang) {
      await execution.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(tr(`No ${lang === 'c' ? 'C' : 'Java'} challenge called "${id}".`, `Nenhum desafio em ${lang === 'c' ? 'C' : 'Java'} chamado "${id}".`))]));
      return false;
    }
    const outcome = await runCellSource(code, { tests: c.tests, mustContain: c.mustContain, mustNotContain: c.mustNotContain, timeLimitMs: c.timeLimitMs, ...host.runnerOptions() }, lang);
    const problem = problemOutput(outcome, 1);
    if (problem || outcome.kind !== 'tests') {
      await execution.replaceOutput(problem ?? []);
      await host.onChallengeResult(c, false);
      return false;
    }
    const passed = outcome.results.filter((r) => r.passed).length;
    const solved = passed === outcome.results.length;
    const header = solved
      ? tr(`🎉 ${c.title}: all ${passed} tests pass. Solved!`, `🎉 ${c.title}: os ${passed} testes passam. Resolvido!`)
      : tr(`${c.title}: ${passed} of ${outcome.results.length} tests pass.`, `${c.title}: ${passed} de ${outcome.results.length} testes passam.`);
    await execution.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.text(`${header}\n\n${outcome.results.map(testLine).join('\n')}`)]));
    await host.onChallengeResult(c, solved);
    return true;
  }

  controller.executeHandler = async (cells) => {
    for (const cell of cells) {
      await runCell(cell);
    }
  };
  return controller;
}

/** The lesson's notebook in the current language, if it has one. */
export function lessonNotebookFile(lessonDir: string, lang: string): string | undefined {
  const local = path.join(lessonDir, `lesson.${lang}.ipynb`);
  if (lang !== 'en' && fs.existsSync(local)) {
    return local;
  }
  const plain = path.join(lessonDir, 'lesson.ipynb');
  return fs.existsSync(plain) ? plain : undefined;
}

/**
 * Copies a lesson's notebook (and the images next to it) to the student's notebooks folder, unless a copy is
 * already there, so their edits and outputs are kept. Returns the copy's path.
 */
export function copyLessonNotebook(source: string, notebooksDir: string, lessonId: string): string {
  fs.mkdirSync(notebooksDir, { recursive: true });
  const target = path.join(notebooksDir, `${lessonId}.ipynb`);
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
  }
  for (const f of fs.readdirSync(path.dirname(source))) {
    if (/\.(svg|png|jpe?g|gif)$/i.test(f) && !fs.existsSync(path.join(notebooksDir, f))) {
      fs.copyFileSync(path.join(path.dirname(source), f), path.join(notebooksDir, f));
    }
  }
  return target;
}
