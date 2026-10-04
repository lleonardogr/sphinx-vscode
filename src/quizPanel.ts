import * as vscode from 'vscode';
import { QuizAnswer, QuizDefinition, QuizQuestion } from './quizzes';

/** Shown when the quiz is a question of an exam: answers are saved as you go and submitted once, without feedback. */
export interface QuizExamInfo {
  examTitle: string;
  mode: 'open' | 'closed';
  points: number;
  earned: number;
  started: boolean;
  finished: boolean;
  submitted: boolean;
}

export type QuizMessage =
  | { type: 'check'; index: number; answer: QuizAnswer }
  | { type: 'checkAll'; answers: QuizAnswer[] }
  | { type: 'save'; answers: QuizAnswer[] }
  | { type: 'submit'; answers: QuizAnswer[] };

const TYPES = new Set(['check', 'checkAll', 'save', 'submit']);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function nonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function renderMarkdown(md: string): Promise<string> {
  if (!md.trim()) {
    return '';
  }
  try {
    return await vscode.commands.executeCommand<string>('markdown.api.render', md);
  } catch {
    return `<p>${escapeHtml(md)}</p>`;
  }
}

export function examQuizStatus(e: QuizExamInfo): string {
  if (!e.started) {
    return 'Start the exam from the Exams group in the sidebar to answer this quiz.';
  }
  if (e.submitted) {
    return `Submitted: ${e.earned} / ${e.points} points. Your answers are locked.`;
  }
  if (e.finished) {
    return 'The exam is finished. Your answers are locked.';
  }
  return `Worth ${e.points} points. Your answers are saved as you go. You can submit the quiz once, and you won't see which answers are right.`;
}

const TYPE_LABEL: Record<QuizQuestion['type'], string> = {
  choice: 'Multiple choice',
  truefalse: 'True or false',
  short: 'Short answer',
  output: 'What does it print?',
};

/** The single quiz panel, reused as the student moves between quizzes. */
export class QuizPanel {
  private panel: vscode.WebviewPanel | undefined;
  private quiz: QuizDefinition | undefined;
  private ready = false;
  private queue: unknown[] = [];

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly onMessage: (msg: QuizMessage, quiz: QuizDefinition) => void,
  ) {}

  get current(): QuizDefinition | undefined {
    return this.quiz;
  }

  async show(quiz: QuizDefinition, opts: { exam?: QuizExamInfo; answers?: QuizAnswer[]; best?: string } = {}): Promise<void> {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel('sphynxQuiz', quiz.title, vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')],
      });
      this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'media', 'logo', 'icon.png');
      this.panel.onDidDispose(() => {
        this.panel = undefined;
        this.quiz = undefined;
      });
      this.panel.webview.onDidReceiveMessage((msg) => {
        if (msg?.type === 'ready') {
          this.ready = true;
          this.queue.forEach((m) => this.panel?.webview.postMessage(m));
          this.queue = [];
        } else if (this.quiz && TYPES.has(msg?.type)) {
          this.onMessage(msg as QuizMessage, this.quiz);
        }
      });
    } else {
      this.panel.reveal(undefined, false);
    }
    this.quiz = quiz;
    this.ready = false;
    this.queue = [];
    this.panel.title = quiz.title;
    this.panel.webview.html = await this.render(quiz, opts);
  }

  post(message: unknown): void {
    if (!this.panel) {
      return;
    }
    if (this.ready) {
      this.panel.webview.postMessage(message);
    } else {
      this.queue.push(message);
    }
  }

  dispose(): void {
    this.panel?.dispose();
  }

  private async renderQuestion(q: QuizQuestion, i: number, answer: QuizAnswer, practice: boolean): Promise<string> {
    const name = `q${i}`;
    const prompt = await renderMarkdown(q.prompt);
    const code = q.code ? `<pre class="quiz-code"><code>${escapeHtml(q.code)}</code></pre>` : '';
    const checked = (v: boolean) => (v ? ' checked' : '');
    let input: string;
    if (q.type === 'choice' || (q.type === 'output' && q.options)) {
      const options = q.type === 'choice' ? q.options : q.options!;
      const multiple = q.type === 'choice' && q.multiple;
      const picked = Array.isArray(answer) ? answer : [];
      input = `${multiple ? '<p class="muted">Choose all that apply.</p>' : ''}<div class="quiz-options">${options
        .map(
          (o, k) => `<label class="quiz-option"><input type="${multiple ? 'checkbox' : 'radio'}" name="${name}" value="${k}"${checked(picked.includes(k))}>
            ${q.type === 'output' ? `<code class="quiz-pre">${escapeHtml(o)}</code>` : `<span>${escapeHtml(o)}</span>`}</label>`,
        )
        .join('')}</div>`;
    } else if (q.type === 'truefalse') {
      input = `<div class="quiz-options quiz-inline">
        <label class="quiz-option"><input type="radio" name="${name}" value="true"${checked(answer === true)}><span>True</span></label>
        <label class="quiz-option"><input type="radio" name="${name}" value="false"${checked(answer === false)}><span>False</span></label></div>`;
    } else if (q.type === 'short') {
      input = `<input class="quiz-text" type="text" name="${name}" spellcheck="false" autocomplete="off" aria-label="Your answer" value="${escapeHtml(typeof answer === 'string' ? answer : '')}">`;
    } else {
      input = `<textarea class="quiz-text quiz-pre" name="${name}" rows="3" spellcheck="false" aria-label="The exact output" placeholder="Type exactly what it prints">${escapeHtml(typeof answer === 'string' ? answer : '')}</textarea>`;
    }
    const kind = q.type === 'choice' || (q.type === 'output' && q.options) ? (q.type === 'choice' && q.multiple ? 'many' : 'one') : q.type === 'truefalse' ? 'bool' : 'text';
    return `<section class="quiz-question" data-index="${i}" data-kind="${kind}">
      <div class="quiz-head"><strong>Question ${i + 1}</strong><span class="muted">${TYPE_LABEL[q.type]} · ${q.points} point${q.points === 1 ? '' : 's'}</span></div>
      <div class="quiz-prompt">${prompt}</div>
      ${code}
      ${input}
      ${practice ? `<div class="quiz-actions"><button class="secondary" data-check="${i}">Check</button></div>` : ''}
      <div class="quiz-feedback" id="feedback-${i}" aria-live="polite"></div>
    </section>`;
  }

  private async render(quiz: QuizDefinition, opts: { exam?: QuizExamInfo; answers?: QuizAnswer[]; best?: string }): Promise<string> {
    const webview = this.panel!.webview;
    const media = (file: string) => webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', file));
    const n = nonce();
    const exam = opts.exam;
    const practice = !exam;
    const locked = !!exam && (!exam.started || exam.finished || exam.submitted);
    const questions = (await Promise.all(quiz.questions.map((q, i) => this.renderQuestion(q, i, opts.answers?.[i] ?? null, practice)))).join('');
    const total = quiz.questions.reduce((s, q) => s + q.points, 0);
    const banner = exam
      ? `<div id="exam-banner" class="banner ${exam.submitted || exam.finished ? 'success' : 'info'}"><strong>📝 ${escapeHtml(exam.examTitle)}</strong> · ${exam.mode === 'closed' ? 'Closed exam' : 'Open exam'}
           <p id="exam-status">${escapeHtml(examQuizStatus(exam))}</p></div>`
      : '';
    const footer = practice
      ? `<div class="quiz-footer"><button class="primary" id="check-all">✔ Check all answers</button><button class="secondary" id="start-over">Start over</button>
           <span class="muted">${opts.best ? `Best score: ${escapeHtml(opts.best)}` : ''}</span></div><div id="quiz-score" aria-live="polite"></div>`
      : `<div class="quiz-footer"><button class="primary" id="submit-quiz"${locked ? ' disabled' : ''}>✔ Submit quiz</button></div><div id="quiz-score" aria-live="polite"></div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${n}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${media('panel.css')}">
  <title>${escapeHtml(quiz.title)}</title>
</head>
<body data-mode="${practice ? 'practice' : 'exam'}"${locked ? ' data-locked="1"' : ''}>
  <header>
    <div class="title-row"><h1>${escapeHtml(quiz.title)}</h1></div>
    <div class="meta">
      <span class="badge topic">Quiz</span>${quiz.topic ? `<span class="badge">${escapeHtml(quiz.topic)}</span>` : ''}
      <span class="badge">${quiz.questions.length} question${quiz.questions.length === 1 ? '' : 's'} · ${total} point${total === 1 ? '' : 's'}</span>
    </div>
  </header>
  ${banner}
  <main>
    ${quiz.description ? `<section class="description">${await renderMarkdown(quiz.description)}</section>` : ''}
    ${questions}
    ${footer}
  </main>
  <script nonce="${n}" src="${media('quiz.js')}"></script>
</body>
</html>`;
  }
}
