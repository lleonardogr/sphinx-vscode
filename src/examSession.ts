// Runs exams for a student: start/finish, countdown, limited submissions, scoring, integrity
// warnings (closed exams) and the results file the student hands in.
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { RunOutcome } from './runner';
import { ExamDefinition, ExamQuestion, maxScore, questionTitle, scoreOutcome } from './exams';
import { gradeQuiz, parseAnswers, scaleQuizGrade } from './quizzes';

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

export interface ExamResultsFile {
  format: 'sphynx-exam-results';
  version: 1;
  extensionVersion: string;
  exam: { id: string; title: string; mode: string; durationMinutes: number; maxSubmissions: number };
  student: string;
  startedAt: string;
  finishedAt: string;
  finishedBy: 'student' | 'time';
  timeTakenSeconds: number;
  score: { earned: number; max: number };
  questions: {
    id: string;
    /** "quiz" questions store the student's answers (JSON) in `code`. Missing in older files: "challenge". */
    type?: 'challenge' | 'quiz';
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

const STATE_KEY = 'sphynx.exams';
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

export class ExamManager implements vscode.Disposable {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChange = this.changed.event;
  private readonly timerItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
  private timer: NodeJS.Timeout | undefined;
  private exams: ExamDefinition[] = [];
  private awaySince: number | undefined;
  private suppressPasteCheck = false;
  private finishing = new Set<string>();
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly context: vscode.ExtensionContext,
    /** Folder holding an exam's code: <root>/<questionId>/Main.java */
    private readonly codeDir: (examId: string) => string,
    /** Runs every test of a question against the student's current code (used for auto-submit). */
    private readonly gradeQuestion: (exam: ExamDefinition, q: ExamQuestion) => Promise<RunOutcome | undefined>,
  ) {
    this.timerItem.command = 'sphynx.list.focus';
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

  state(examId: string): SessionState | undefined {
    return this.all()[examId];
  }

  private async save(examId: string, state: SessionState | undefined): Promise<void> {
    const all = { ...this.all() };
    if (state) {
      all[examId] = state;
    } else {
      delete all[examId];
    }
    await this.context.globalState.update(STATE_KEY, all);
    this.changed.fire();
  }

  isActive(examId: string): boolean {
    const s = this.state(examId);
    return !!s && !s.finishedAt;
  }

  activeExam(): ExamDefinition | undefined {
    return this.exams.find((t) => this.isActive(t.id));
  }

  /** Quizzes are submitted once; coding questions up to the exam's maxSubmissions. */
  maxSubmissions(exam: ExamDefinition, questionId: string): number {
    return exam.questions.find((q) => q.id === questionId)?.kind === 'quiz' ? 1 : exam.maxSubmissions;
  }

  submissionsLeft(exam: ExamDefinition, questionId: string): number {
    return Math.max(0, this.maxSubmissions(exam, questionId) - (this.state(exam.id)?.questions[questionId]?.submissions ?? 0));
  }

  /** The file holding a question's current answer: Main.java, or answers.json for a quiz. */
  answerFile(exam: ExamDefinition, q: ExamQuestion): string {
    return path.join(this.codeDir(exam.id), q.id, q.kind === 'quiz' ? 'answers.json' : 'Main.java');
  }

  score(exam: ExamDefinition): { earned: number; max: number } {
    const s = this.state(exam.id);
    const earned = exam.questions.reduce((sum, q) => sum + (s?.questions[q.id]?.bestEarned ?? 0), 0);
    return { earned: Math.round(earned * 100) / 100, max: maxScore(exam) };
  }

  /** Called after every reload: resumes the countdown, or finishes an exam whose time ran out while VS Code was closed. */
  setExams(exams: ExamDefinition[]): void {
    this.exams = exams;
    const active = this.activeExam();
    if (active && Date.now() >= this.state(active.id)!.endsAt) {
      void this.finish(active, 'time');
    } else {
      this.ensureTimer();
    }
    this.changed.fire();
  }

  // ------------------------------------------------------------------ start / finish

  async start(exam: ExamDefinition): Promise<boolean> {
    if (this.state(exam.id)?.finishedAt) {
      vscode.window.showInformationMessage(`You already finished "${exam.title}". Score: ${this.formatScore(exam)}.`);
      return false;
    }
    if (this.isActive(exam.id)) {
      return true;
    }
    const other = this.activeExam();
    if (other) {
      vscode.window.showWarningMessage(`Finish "${other.title}" before starting another exam.`);
      return false;
    }

    const rules = [
      `Time limit: ${exam.durationMinutes} minutes, starting now.`,
      `${exam.questions.length} question(s), ${maxScore(exam)} points in total.`,
      `Each question can be submitted ${exam.maxSubmissions} time(s). Your best submission counts, with partial credit for the tests it passes. Run (sample tests) is unlimited.`,
      ...(exam.questions.some((q) => q.kind === 'quiz') ? ['Quizzes are submitted once, and you won\'t see which answers are right. Your answers are saved as you go.'] : []),
      exam.mode === 'closed'
        ? 'Closed exam: hints and AI hints are turned off. Large pastes, AI completions and time spent outside VS Code are recorded in your results.'
        : 'Open exam: hints, AI hints and the internet are allowed.',
      'When the time is up, your answers are submitted automatically and the exam is locked.',
    ];
    const ok = await vscode.window.showWarningMessage(`Start "${exam.title}"?`, { modal: true, detail: rules.join('\n\n') }, 'Start Exam');
    if (ok !== 'Start Exam') {
      return false;
    }
    const previousName = this.context.globalState.get<string>('sphynx.studentName', '');
    const student = (
      await vscode.window.showInputBox({
        title: exam.title,
        prompt: 'Your full name (it goes into the results file you hand in)',
        value: previousName,
        ignoreFocusOut: true,
        validateInput: (v) => (v.trim().length < 2 ? 'Please type your name' : undefined),
      })
    )?.trim();
    if (!student) {
      return false;
    }
    await this.context.globalState.update('sphynx.studentName', student);

    const now = Date.now();
    const state: SessionState = { student, startedAt: now, endsAt: now + exam.durationMinutes * 60_000, questions: {}, warnings: [] };
    if (exam.mode === 'closed') {
      for (const id of ['GitHub.copilot', 'GitHub.copilot-chat']) {
        if (vscode.extensions.getExtension(id)) {
          state.warnings.push({ at: new Date(now).toISOString(), kind: 'copilot', detail: `The ${id} extension is installed and enabled during a closed exam.` });
        }
      }
    }
    await this.save(exam.id, state);
    this.ensureTimer();
    return true;
  }

  async confirmFinish(exam: ExamDefinition): Promise<void> {
    if (!this.isActive(exam.id)) {
      return;
    }
    const s = this.state(exam.id)!;
    const unanswered = exam.questions.filter((q) => !s.questions[q.id]?.submissions).length;
    const answer = await vscode.window.showWarningMessage(
      `Finish "${exam.title}" now?`,
      {
        modal: true,
        detail: `${unanswered ? `${unanswered} question(s) have no submission yet; they will be submitted automatically. ` : ''}You can't change your answers afterwards.`,
      },
      'Finish Exam',
    );
    if (answer === 'Finish Exam') {
      await this.finish(exam, 'student');
    }
  }

  /** Auto-submits answers that changed since their last submission (if submissions remain), locks the exam and writes the results file. */
  async finish(exam: ExamDefinition, by: 'student' | 'time'): Promise<void> {
    if (!this.isActive(exam.id) || this.finishing.has(exam.id)) {
      return;
    }
    this.finishing.add(exam.id);
    try {
      if (by === 'time') {
        vscode.window.showWarningMessage(`⏰ Time is up for "${exam.title}". Submitting your answers…`);
      }
      await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Finishing "${exam.title}"…` }, async () => {
        await vscode.workspace.saveAll(false);
        for (const q of exam.questions) {
          const file = this.answerFile(exam, q);
          if (!fs.existsSync(file) || this.submissionsLeft(exam, q.id) === 0) {
            continue;
          }
          const code = fs.readFileSync(file, 'utf8');
          if (this.state(exam.id)?.questions[q.id]?.lastSubmittedHash === hash(code)) {
            continue;
          }
          if (q.kind === 'quiz') {
            await this.recordScore(exam, q, scaleQuizGrade(gradeQuiz(q.quiz, parseAnswers(code)), q.points), code);
            continue;
          }
          const outcome = await this.gradeQuestion(exam, q);
          if (outcome) {
            await this.recordSubmission(exam, q, outcome, code);
          }
        }
      });
      const s = { ...this.state(exam.id)!, finishedAt: Date.now(), finishedBy: by };
      await this.save(exam.id, s);
      const file = this.writeResults(exam);
      await this.save(exam.id, { ...this.state(exam.id)!, resultsFile: file });
      this.ensureTimer();
      const choice = await vscode.window.showInformationMessage(
        `"${exam.title}" finished: ${this.formatScore(exam)}. Your results file is ready to hand in.`,
        'Open Results',
        'Save a Copy…',
      );
      if (choice === 'Open Results') {
        await this.openResults(exam);
      } else if (choice === 'Save a Copy…') {
        await this.saveResultsCopy(exam);
      }
    } finally {
      this.finishing.delete(exam.id);
    }
  }

  formatScore(exam: ExamDefinition): string {
    const { earned, max } = this.score(exam);
    return `${earned} / ${max} points`;
  }

  // ------------------------------------------------------------------ submissions

  /** Records a graded submission and returns its score. */
  async recordSubmission(exam: ExamDefinition, q: ExamQuestion, outcome: RunOutcome, code: string): Promise<{ earned: number; passed: number; total: number }> {
    return this.recordScore(exam, q, scoreOutcome(outcome, q.points), code);
  }

  /** Records an already-scored submission (a graded quiz, or a run outcome) and keeps the best one. */
  async recordScore(exam: ExamDefinition, q: ExamQuestion, result: { earned: number; passed: number; total: number }, code: string): Promise<{ earned: number; passed: number; total: number }> {
    const s = this.state(exam.id);
    if (!s || s.finishedAt || this.submissionsLeft(exam, q.id) === 0) {
      return { earned: 0, passed: 0, total: 0 };
    }
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
    await this.save(exam.id, { ...s, questions: { ...s.questions, [q.id]: next } });
    return result;
  }

  // ------------------------------------------------------------------ countdown

  private ensureTimer(): void {
    const active = this.activeExam();
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

  // ------------------------------------------------------------------ integrity (closed exams)

  /** Lets the extension write files (starter code, reset) without triggering a paste warning. */
  async withoutPasteCheck<T>(fn: () => Thenable<T> | T): Promise<T> {
    this.suppressPasteCheck = true;
    try {
      return await fn();
    } finally {
      this.suppressPasteCheck = false;
    }
  }

  private warn(examId: string, warning: Omit<IntegrityWarning, 'at'>): void {
    const s = this.state(examId);
    if (!s || s.finishedAt) {
      return;
    }
    void this.save(examId, { ...s, warnings: [...s.warnings, { at: new Date().toISOString(), ...warning }] });
  }

  private onEdit(e: vscode.TextDocumentChangeEvent): void {
    const active = this.activeExam();
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
    const active = this.activeExam();
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

  buildResults(exam: ExamDefinition): ExamResultsFile {
    const s = this.state(exam.id)!;
    const finishedAt = s.finishedAt ?? Date.now();
    return {
      format: 'sphynx-exam-results',
      version: 1,
      extensionVersion: String(this.context.extension.packageJSON.version ?? ''),
      exam: { id: exam.id, title: exam.title, mode: exam.mode, durationMinutes: exam.durationMinutes, maxSubmissions: exam.maxSubmissions },
      student: s.student,
      startedAt: new Date(s.startedAt).toISOString(),
      finishedAt: new Date(finishedAt).toISOString(),
      finishedBy: s.finishedBy ?? 'student',
      timeTakenSeconds: Math.round((finishedAt - s.startedAt) / 1000),
      score: this.score(exam),
      questions: exam.questions.map((q) => {
        const qs = s.questions[q.id];
        const file = this.answerFile(exam, q);
        return {
          id: q.id,
          type: q.kind,
          title: questionTitle(q),
          points: q.points,
          earned: qs?.bestEarned ?? 0,
          passed: qs?.bestPassed ?? 0,
          total: qs?.total ?? (q.kind === 'quiz' ? q.quiz.questions.length : q.challenge.tests.length),
          submissions: qs?.submissions ?? 0,
          code: qs?.bestCode ?? (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''),
        };
      }),
      warnings: s.warnings,
    };
  }

  private writeResults(exam: ExamDefinition): string {
    const results = this.buildResults(exam);
    const slug = results.student.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'student';
    const file = path.join(this.codeDir(exam.id), `results-${slug}.json`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(results, null, 2) + '\n');
    return file;
  }

  async openResults(exam: ExamDefinition): Promise<void> {
    const file = this.state(exam.id)?.resultsFile;
    if (!file || !fs.existsSync(file)) {
      vscode.window.showWarningMessage('No results file found for this exam.');
      return;
    }
    await vscode.window.showTextDocument(vscode.Uri.file(file), { preview: false });
  }

  async saveResultsCopy(exam: ExamDefinition): Promise<void> {
    const file = this.state(exam.id)?.resultsFile;
    if (!file || !fs.existsSync(file)) {
      return;
    }
    const target = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(path.join(require('os').homedir(), path.basename(file))),
      filters: { 'Exam results': ['json'] },
    });
    if (target) {
      fs.copyFileSync(file, target.fsPath);
      vscode.window.showInformationMessage(`Saved ${path.basename(target.fsPath)}. Hand this file in to your teacher.`);
    }
  }

  /** Teacher/debug helper: forget an exam's state so it can be taken again. */
  async reset(exam: ExamDefinition): Promise<void> {
    await this.save(exam.id, undefined);
    this.ensureTimer();
  }
}
