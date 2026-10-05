// Opens quizzes for practice or as exam questions, grades answers, and remembers the best
// practice score per quiz.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ExamManager } from './examSession';
import { ExamDefinition, ExamQuestion, parseExamChallengeId } from './exams';
import { QuizExamInfo, QuizMessage, QuizPanel, examQuizStatus, renderMarkdown } from './quizPanel';
import { QuizAnswer, QuizDefinition, describeAnswer, gradeQuiz, isCorrect, parseAnswers, scaleQuizGrade } from './quizzes';
import { plural, tr } from './i18n';

const KEY = 'sphynx.quizzes';

export interface QuizScore {
  best: number;
  total: number;
  attempts: number;
}

/** Best practice score per quiz id. */
export class QuizProgress {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChange = this.changed.event;

  constructor(private readonly state: vscode.Memento) {}

  get(id: string): QuizScore | undefined {
    return this.state.get<Record<string, QuizScore>>(KEY, {})[id];
  }

  async record(id: string, earned: number, total: number): Promise<void> {
    const all = { ...this.state.get<Record<string, QuizScore>>(KEY, {}) };
    const prev = all[id];
    all[id] = { best: Math.max(prev?.best ?? 0, earned), total, attempts: (prev?.attempts ?? 0) + 1 };
    await this.state.update(KEY, all);
    this.changed.fire();
  }

  async reset(): Promise<void> {
    await this.state.update(KEY, undefined);
    this.changed.fire();
  }
}

type ExamQuiz = { exam: ExamDefinition; question: Extract<ExamQuestion, { kind: 'quiz' }> };

export class QuizController implements vscode.Disposable {
  private readonly panel: QuizPanel;

  constructor(
    extensionUri: vscode.Uri,
    private readonly progress: QuizProgress,
    private readonly examManager: ExamManager,
    private readonly quizzes: () => QuizDefinition[],
    private readonly exams: () => ExamDefinition[],
  ) {
    this.panel = new QuizPanel(extensionUri, (msg, quiz) => void this.onMessage(msg, quiz));
  }

  dispose(): void {
    this.panel.dispose();
  }

  /** The exam and question when `id` is a quiz inside an exam (exam:<examId>:<questionId>). */
  private examQuiz(id: string): ExamQuiz | undefined {
    const ids = parseExamChallengeId(id);
    const exam = ids && this.exams().find((e) => e.id === ids.examId);
    const question = exam?.questions.find((q) => q.id === ids!.questionId);
    return exam && question?.kind === 'quiz' ? { exam, question } : undefined;
  }

  private examInfo(eq: ExamQuiz): QuizExamInfo {
    const s = this.examManager.state(eq.exam.id);
    const qs = s?.questions[eq.question.id];
    return {
      examTitle: eq.exam.title,
      mode: eq.exam.mode,
      points: eq.question.points,
      earned: qs?.bestEarned ?? 0,
      started: !!s,
      finished: !!s?.finishedAt,
      submitted: (qs?.submissions ?? 0) > 0,
      noCopy: eq.exam.restrictions.blockCopy,
    };
  }

  /** Accepts a quiz id, an exam quiz id, or a tree node. */
  async open(arg: unknown): Promise<void> {
    let id: string | undefined;
    if (typeof arg === 'string') {
      id = arg;
    } else if (arg && typeof arg === 'object') {
      const node = arg as { kind?: string; quiz?: QuizDefinition; question?: ExamQuestion };
      id = node.quiz?.id ?? (node.question?.kind === 'quiz' ? node.question.quiz.id : undefined);
    }
    if (!id) {
      const pick = await vscode.window.showQuickPick(
        this.quizzes().map((q) => ({ label: q.title, description: plural(q.questions.length, ['question', 'questions'], ['questão', 'questões']), id: q.id })),
        { placeHolder: tr('Choose a quiz', 'Escolha um quiz') },
      );
      id = pick?.id;
    }
    if (!id) {
      return;
    }

    const eq = this.examQuiz(id);
    if (eq) {
      if (!this.examManager.state(eq.exam.id) && !(await this.examManager.start(eq.exam))) {
        return;
      }
      const file = this.examManager.answerFile(eq.exam, eq.question);
      const answers = fs.existsSync(file) ? parseAnswers(fs.readFileSync(file, 'utf8')) : [];
      await this.panel.show(eq.question.quiz, { exam: this.examInfo(eq), answers });
      return;
    }
    const quiz = this.quizzes().find((q) => q.id === id);
    if (!quiz) {
      vscode.window.showWarningMessage(tr(`Quiz "${id}" was not found.`, `O quiz "${id}" não foi encontrado.`));
      return;
    }
    const score = this.progress.get(quiz.id);
    await this.panel.show(quiz, { best: score ? `${score.best} / ${score.total}` : undefined });
  }

  /** Re-opens the current quiz, e.g. after the language changed. */
  async refresh(): Promise<void> {
    const current = this.panel.current;
    if (current) {
      await this.open(current.id);
    }
  }

  /** Called when exam state changes (e.g. the time ran out), to lock an open exam quiz. */
  refreshExamStatus(): void {
    const current = this.panel.current;
    const eq = current && this.examQuiz(current.id);
    if (eq) {
      const info = this.examInfo(eq);
      this.panel.post({ type: 'examStatus', text: examQuizStatus(info), locked: !info.started || info.finished || info.submitted });
    }
  }

  private async feedback(quiz: QuizDefinition, index: number, answer: QuizAnswer) {
    const q = quiz.questions[index];
    return { correct: isCorrect(q, answer), answer: describeAnswer(q), explanation: await renderMarkdown(q.explanation) };
  }

  private async onMessage(msg: QuizMessage, quiz: QuizDefinition): Promise<void> {
    const eq = this.examQuiz(quiz.id);
    if (!eq) {
      // Practice: instant feedback with the right answer and the explanation.
      if (msg.type === 'check' && quiz.questions[msg.index]) {
        this.panel.post({ type: 'feedback', index: msg.index, ...(await this.feedback(quiz, msg.index, msg.answer)) });
      } else if (msg.type === 'checkAll') {
        const grade = gradeQuiz(quiz, msg.answers);
        const results = await Promise.all(quiz.questions.map((_, i) => this.feedback(quiz, i, msg.answers[i] ?? null)));
        await this.progress.record(quiz.id, grade.earned, grade.total);
        this.panel.post({ type: 'graded', results, earned: grade.earned, total: grade.total, correct: grade.correct });
      }
      return;
    }

    // Exam: never reveal answers. Save drafts; submit once.
    const info = this.examInfo(eq);
    if (!info.started || info.finished || info.submitted) {
      this.refreshExamStatus();
      return;
    }
    const file = this.examManager.answerFile(eq.exam, eq.question);
    const save = (answers: QuizAnswer[]) => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(answers) + '\n');
    };
    if (msg.type === 'save') {
      save(msg.answers);
    } else if (msg.type === 'submit') {
      const unanswered = msg.answers.filter((a) => a === null).length + Math.max(0, eq.question.quiz.questions.length - msg.answers.length);
      const submitLabel = tr('Submit Quiz', 'Enviar quiz');
      const ok = await vscode.window.showWarningMessage(
        tr(`Submit "${eq.question.quiz.title}"?`, `Enviar "${eq.question.quiz.title}"?`),
        {
          modal: true,
          detail: tr(
            `${unanswered ? `${unanswered} question(s) have no answer. ` : ''}A quiz can be submitted only once, and you won't see which answers are right.`,
            `${unanswered ? `${unanswered} questão(ões) sem resposta. ` : ''}Um quiz só pode ser enviado uma vez, e você não verá quais respostas estão certas.`,
          ),
        },
        submitLabel,
      );
      if (ok !== submitLabel) {
        return;
      }
      save(msg.answers);
      const text = fs.readFileSync(file, 'utf8');
      const score = scaleQuizGrade(gradeQuiz(eq.question.quiz, parseAnswers(text)), eq.question.points);
      await this.examManager.recordScore(eq.exam, eq.question, score, text);
      this.panel.post({ type: 'examStatus', text: examQuizStatus(this.examInfo(eq)), locked: true, score: tr(`${score.earned} / ${eq.question.points} points`, `${score.earned} / ${eq.question.points} pontos`) });
    }
  }
}
