// Runs tests for a student: start/finish, countdown, limited submissions, scoring, integrity
// warnings (closed tests) and the results file the student hands in.
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { RunOutcome } from './runner';
import { TestDefinition, TestQuestion, maxScore, scoreOutcome } from './tests';

export interface QuestionState {
  submissions: number;
  bestEarned: number;
  bestPassed: number;
  total: number;
  /** Code of the best-scoring submission, so a teacher can re-grade it. */
  bestCode?: string;
  lastSubmittedHash?: string;
}

export interface IntegrityWarning {
  at: string;
  kind: 'paste' | 'away' | 'copilot';
  question?: string;
  detail: string;
}

export interface SessionState {
  student: string;
  startedAt: number;
  endsAt: number;
  finishedAt?: number;
  finishedBy?: 'student' | 'time';
  questions: Record<string, QuestionState>;
  warnings: IntegrityWarning[];
  resultsFile?: string;
}

export interface TestResultsFile {
  format: 'tech-challenges-test-results';
  version: 1;
  extensionVersion: string;
  test: { id: string; title: string; mode: string; durationMinutes: number; maxSubmissions: number };
  student: string;
  startedAt: string;
  finishedAt: string;
  finishedBy: 'student' | 'time';
  timeTakenSeconds: number;
  score: { earned: number; max: number };
  questions: {
    id: string;
    title: string;
    points: number;
    earned: number;
    passed: number;
    total: number;
    submissions: number;
    code: string;
  }[];
  warnings: IntegrityWarning[];
}

const STATE_KEY = 'techChallenges.tests';
const LARGE_INSERTION = 80; // characters inserted in a single edit
const AWAY_THRESHOLD_MS = 15_000;

const hash = (s: string) => createHash('sha256').update(s).digest('hex');

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
}

export class TestManager implements vscode.Disposable {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChange = this.changed.event;
  private readonly timerItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
  private timer: NodeJS.Timeout | undefined;
  private tests: TestDefinition[] = [];
  private awaySince: number | undefined;
  private suppressPasteCheck = false;
  private finishing = new Set<string>();
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly context: vscode.ExtensionContext,
    /** Folder holding a test's code: <root>/<questionId>/Main.java */
    private readonly codeDir: (testId: string) => string,
    /** Runs every test of a question against the student's current code (used for auto-submit). */
    private readonly gradeQuestion: (test: TestDefinition, q: TestQuestion) => Promise<RunOutcome | undefined>,
  ) {
    this.timerItem.command = 'techChallenges.list.focus';
    this.disposables.push(
      this.timerItem,
      this.changed,
      vscode.workspace.onDidChangeTextDocument((e) => this.onEdit(e)),
      vscode.window.onDidChangeWindowState((s) => this.onWindowState(s)),
    );
  }

  dispose(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.disposables.forEach((d) => d.dispose());
  }

  // ------------------------------------------------------------------ state

  private all(): Record<string, SessionState> {
    return this.context.globalState.get<Record<string, SessionState>>(STATE_KEY, {});
  }

  state(testId: string): SessionState | undefined {
    return this.all()[testId];
  }

  private async save(testId: string, state: SessionState | undefined): Promise<void> {
    const all = { ...this.all() };
    if (state) {
      all[testId] = state;
    } else {
      delete all[testId];
    }
    await this.context.globalState.update(STATE_KEY, all);
    this.changed.fire();
  }

  isActive(testId: string): boolean {
    const s = this.state(testId);
    return !!s && !s.finishedAt;
  }

  activeTest(): TestDefinition | undefined {
    return this.tests.find((t) => this.isActive(t.id));
  }

  submissionsLeft(test: TestDefinition, questionId: string): number {
    return Math.max(0, test.maxSubmissions - (this.state(test.id)?.questions[questionId]?.submissions ?? 0));
  }

  score(test: TestDefinition): { earned: number; max: number } {
    const s = this.state(test.id);
    const earned = test.questions.reduce((sum, q) => sum + (s?.questions[q.id]?.bestEarned ?? 0), 0);
    return { earned: Math.round(earned * 100) / 100, max: maxScore(test) };
  }

  /** Called after every reload: resumes the countdown, or finishes a test whose time ran out while VS Code was closed. */
  setTests(tests: TestDefinition[]): void {
    this.tests = tests;
    const active = this.activeTest();
    if (active && Date.now() >= this.state(active.id)!.endsAt) {
      void this.finish(active, 'time');
    } else {
      this.ensureTimer();
    }
    this.changed.fire();
  }

  // ------------------------------------------------------------------ start / finish

  async start(test: TestDefinition): Promise<boolean> {
    if (this.state(test.id)?.finishedAt) {
      vscode.window.showInformationMessage(`You already finished "${test.title}". Score: ${this.formatScore(test)}.`);
      return false;
    }
    if (this.isActive(test.id)) {
      return true;
    }
    const other = this.activeTest();
    if (other) {
      vscode.window.showWarningMessage(`Finish "${other.title}" before starting another test.`);
      return false;
    }

    const rules = [
      `Time limit: ${test.durationMinutes} minutes, starting now.`,
      `${test.questions.length} question(s), ${maxScore(test)} points in total.`,
      `Each question can be submitted ${test.maxSubmissions} time(s). Your best submission counts, with partial credit for the tests it passes. Run (sample tests) is unlimited.`,
      test.mode === 'closed'
        ? 'Closed test: hints and AI hints are turned off. Large pastes, AI completions and time spent outside VS Code are recorded in your results.'
        : 'Open test: hints, AI hints and the internet are allowed.',
      'When the time is up, your answers are submitted automatically and the test is locked.',
    ];
    const ok = await vscode.window.showWarningMessage(`Start "${test.title}"?`, { modal: true, detail: rules.join('\n\n') }, 'Start Test');
    if (ok !== 'Start Test') {
      return false;
    }
    const previousName = this.context.globalState.get<string>('techChallenges.studentName', '');
    const student = (
      await vscode.window.showInputBox({
        title: test.title,
        prompt: 'Your full name (it goes into the results file you hand in)',
        value: previousName,
        ignoreFocusOut: true,
        validateInput: (v) => (v.trim().length < 2 ? 'Please type your name' : undefined),
      })
    )?.trim();
    if (!student) {
      return false;
    }
    await this.context.globalState.update('techChallenges.studentName', student);

    const now = Date.now();
    const state: SessionState = { student, startedAt: now, endsAt: now + test.durationMinutes * 60_000, questions: {}, warnings: [] };
    if (test.mode === 'closed') {
      for (const id of ['GitHub.copilot', 'GitHub.copilot-chat']) {
        if (vscode.extensions.getExtension(id)) {
          state.warnings.push({ at: new Date(now).toISOString(), kind: 'copilot', detail: `The ${id} extension is installed and enabled during a closed test.` });
        }
      }
    }
    await this.save(test.id, state);
    this.ensureTimer();
    return true;
  }

  async confirmFinish(test: TestDefinition): Promise<void> {
    if (!this.isActive(test.id)) {
      return;
    }
    const s = this.state(test.id)!;
    const unanswered = test.questions.filter((q) => !s.questions[q.id]?.submissions).length;
    const answer = await vscode.window.showWarningMessage(
      `Finish "${test.title}" now?`,
      {
        modal: true,
        detail: `${unanswered ? `${unanswered} question(s) have no submission yet; they will be submitted automatically. ` : ''}You can't change your answers afterwards.`,
      },
      'Finish Test',
    );
    if (answer === 'Finish Test') {
      await this.finish(test, 'student');
    }
  }

  /** Auto-submits answers that changed since their last submission (if submissions remain), locks the test and writes the results file. */
  async finish(test: TestDefinition, by: 'student' | 'time'): Promise<void> {
    if (!this.isActive(test.id) || this.finishing.has(test.id)) {
      return;
    }
    this.finishing.add(test.id);
    try {
      if (by === 'time') {
        vscode.window.showWarningMessage(`⏰ Time is up for "${test.title}". Submitting your answers…`);
      }
      await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Finishing "${test.title}"…` }, async () => {
        await vscode.workspace.saveAll(false);
        for (const q of test.questions) {
          const file = path.join(this.codeDir(test.id), q.id, 'Main.java');
          if (!fs.existsSync(file) || this.submissionsLeft(test, q.id) === 0) {
            continue;
          }
          const code = fs.readFileSync(file, 'utf8');
          if (this.state(test.id)?.questions[q.id]?.lastSubmittedHash === hash(code)) {
            continue;
          }
          const outcome = await this.gradeQuestion(test, q);
          if (outcome) {
            await this.recordSubmission(test, q, outcome, code);
          }
        }
      });
      const s = { ...this.state(test.id)!, finishedAt: Date.now(), finishedBy: by };
      await this.save(test.id, s);
      const file = this.writeResults(test);
      await this.save(test.id, { ...this.state(test.id)!, resultsFile: file });
      this.ensureTimer();
      const choice = await vscode.window.showInformationMessage(
        `"${test.title}" finished: ${this.formatScore(test)}. Your results file is ready to hand in.`,
        'Open Results',
        'Save a Copy…',
      );
      if (choice === 'Open Results') {
        await this.openResults(test);
      } else if (choice === 'Save a Copy…') {
        await this.saveResultsCopy(test);
      }
    } finally {
      this.finishing.delete(test.id);
    }
  }

  formatScore(test: TestDefinition): string {
    const { earned, max } = this.score(test);
    return `${earned} / ${max} points`;
  }

  // ------------------------------------------------------------------ submissions

  /** Records a graded submission and returns its score. */
  async recordSubmission(test: TestDefinition, q: TestQuestion, outcome: RunOutcome, code: string): Promise<{ earned: number; passed: number; total: number }> {
    const s = this.state(test.id);
    if (!s || s.finishedAt) {
      return { earned: 0, passed: 0, total: 0 };
    }
    const result = scoreOutcome(outcome, q.points);
    const prev = s.questions[q.id] ?? { submissions: 0, bestEarned: 0, bestPassed: 0, total: result.total };
    const better = prev.submissions === 0 || result.earned > prev.bestEarned;
    const next: QuestionState = {
      submissions: prev.submissions + 1,
      bestEarned: better ? result.earned : prev.bestEarned,
      bestPassed: better ? result.passed : prev.bestPassed,
      total: result.total || prev.total,
      bestCode: better ? code : prev.bestCode,
      lastSubmittedHash: hash(code),
    };
    await this.save(test.id, { ...s, questions: { ...s.questions, [q.id]: next } });
    return result;
  }

  // ------------------------------------------------------------------ countdown

  private ensureTimer(): void {
    const active = this.activeTest();
    if (!active) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
      this.timerItem.hide();
      return;
    }
    const warned = new Set<number>();
    const tick = () => {
      const s = this.state(active.id);
      if (!s || s.finishedAt) {
        this.ensureTimer();
        return;
      }
      const left = s.endsAt - Date.now();
      this.timerItem.text = `$(watch) ${active.title}: ${formatDuration(left)} left`;
      this.timerItem.tooltip = `${active.title}: ${this.formatScore(active)} so far. Click to see the questions.`;
      this.timerItem.backgroundColor = left < 5 * 60_000 ? new vscode.ThemeColor('statusBarItem.warningBackground') : undefined;
      for (const minutes of [5, 1]) {
        if (left <= minutes * 60_000 && left > (minutes * 60_000 - 2000) && !warned.has(minutes)) {
          warned.add(minutes);
          vscode.window.showWarningMessage(`⏰ ${minutes} minute${minutes > 1 ? 's' : ''} left in "${active.title}".`);
        }
      }
      if (left <= 0) {
        void this.finish(active, 'time');
      } else if (Math.round(left / 1000) % 30 === 0) {
        this.changed.fire(); // refresh the sidebar every 30 seconds
      }
    };
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(tick, 1000);
    tick();
    this.timerItem.show();
  }

  // ------------------------------------------------------------------ integrity (closed tests)

  /** Lets the extension write files (starter code, reset) without triggering a paste warning. */
  async withoutPasteCheck<T>(fn: () => Thenable<T> | T): Promise<T> {
    this.suppressPasteCheck = true;
    try {
      return await fn();
    } finally {
      this.suppressPasteCheck = false;
    }
  }

  private warn(testId: string, warning: Omit<IntegrityWarning, 'at'>): void {
    const s = this.state(testId);
    if (!s || s.finishedAt) {
      return;
    }
    void this.save(testId, { ...s, warnings: [...s.warnings, { at: new Date().toISOString(), ...warning }] });
  }

  private onEdit(e: vscode.TextDocumentChangeEvent): void {
    const active = this.activeTest();
    if (!active || active.mode !== 'closed' || this.suppressPasteCheck || e.reason !== undefined) {
      return; // e.reason is set for undo/redo
    }
    const rel = path.relative(this.codeDir(active.id), e.document.uri.fsPath);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return;
    }
    for (const change of e.contentChanges) {
      if (change.text.length >= LARGE_INSERTION) {
        const lines = change.text.split('\n').length;
        this.warn(active.id, {
          kind: 'paste',
          question: rel.split(path.sep)[0],
          detail: `Large insertion of ${change.text.length} characters (${lines} line${lines > 1 ? 's' : ''}) in one edit: a paste or an AI completion.`,
        });
      }
    }
  }

  private onWindowState(s: vscode.WindowState): void {
    const active = this.activeTest();
    if (!active || active.mode !== 'closed') {
      this.awaySince = undefined;
      return;
    }
    if (!s.focused) {
      this.awaySince = Date.now();
    } else if (this.awaySince) {
      const away = Date.now() - this.awaySince;
      this.awaySince = undefined;
      if (away >= AWAY_THRESHOLD_MS) {
        this.warn(active.id, { kind: 'away', detail: `Left VS Code for ${formatDuration(away)}.` });
      }
    }
  }

  // ------------------------------------------------------------------ results

  buildResults(test: TestDefinition): TestResultsFile {
    const s = this.state(test.id)!;
    const finishedAt = s.finishedAt ?? Date.now();
    return {
      format: 'tech-challenges-test-results',
      version: 1,
      extensionVersion: String(this.context.extension.packageJSON.version ?? ''),
      test: { id: test.id, title: test.title, mode: test.mode, durationMinutes: test.durationMinutes, maxSubmissions: test.maxSubmissions },
      student: s.student,
      startedAt: new Date(s.startedAt).toISOString(),
      finishedAt: new Date(finishedAt).toISOString(),
      finishedBy: s.finishedBy ?? 'student',
      timeTakenSeconds: Math.round((finishedAt - s.startedAt) / 1000),
      score: this.score(test),
      questions: test.questions.map((q) => {
        const qs = s.questions[q.id];
        const file = path.join(this.codeDir(test.id), q.id, 'Main.java');
        return {
          id: q.id,
          title: q.challenge.title,
          points: q.points,
          earned: qs?.bestEarned ?? 0,
          passed: qs?.bestPassed ?? 0,
          total: qs?.total ?? q.challenge.tests.length,
          submissions: qs?.submissions ?? 0,
          code: qs?.bestCode ?? (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''),
        };
      }),
      warnings: s.warnings,
    };
  }

  private writeResults(test: TestDefinition): string {
    const results = this.buildResults(test);
    const slug = results.student.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'student';
    const file = path.join(this.codeDir(test.id), `results-${slug}.json`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(results, null, 2) + '\n');
    return file;
  }

  async openResults(test: TestDefinition): Promise<void> {
    const file = this.state(test.id)?.resultsFile;
    if (!file || !fs.existsSync(file)) {
      vscode.window.showWarningMessage('No results file found for this test.');
      return;
    }
    await vscode.window.showTextDocument(vscode.Uri.file(file), { preview: false });
  }

  async saveResultsCopy(test: TestDefinition): Promise<void> {
    const file = this.state(test.id)?.resultsFile;
    if (!file || !fs.existsSync(file)) {
      return;
    }
    const target = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(path.join(require('os').homedir(), path.basename(file))),
      filters: { 'Test results': ['json'] },
    });
    if (target) {
      fs.copyFileSync(file, target.fsPath);
      vscode.window.showInformationMessage(`Saved ${path.basename(target.fsPath)}. Hand this file in to your teacher.`);
    }
  }

  /** Teacher/debug helper: forget a test's state so it can be taken again. */
  async reset(test: TestDefinition): Promise<void> {
    await this.save(test.id, undefined);
    this.ensureTimer();
  }
}
