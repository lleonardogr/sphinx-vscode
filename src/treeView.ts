import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';
import { ExamManager, formatDuration } from './examSession';
import { ExamDefinition, ExamQuestion, maxScore, questionKey, questionTitle } from './exams';
import { QuizProgress } from './quizController';
import { QuizDefinition } from './quizzes';

export type ChallengeNode =
  | { kind: 'topic'; topic: string }
  | { kind: 'challenge'; challenge: Challenge }
  | { kind: 'examsRoot' }
  | { kind: 'exam'; exam: ExamDefinition }
  | { kind: 'examStart'; exam: ExamDefinition }
  | { kind: 'examQuestion'; exam: ExamDefinition; question: ExamQuestion }
  | { kind: 'quizzesRoot' }
  | { kind: 'quiz'; quiz: QuizDefinition };

const TOPIC_ICONS: Record<string, string> = {
  Variables: 'symbol-variable',
  Conditionals: 'git-compare',
  Loops: 'sync',
  'Data Structures': 'symbol-array',
  Strings: 'symbol-string',
  Methods: 'symbol-method',
  OOP: 'symbol-class',
  Streams: 'filter',
  Tests: 'beaker',
  Custom: 'star-empty',
};

export class ChallengeTreeProvider implements vscode.TreeDataProvider<ChallengeNode> {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changed.event;

  constructor(
    private readonly getChallenges: () => Challenge[],
    private readonly progress: Progress,
    private readonly getExams: () => ExamDefinition[],
    private readonly exams: ExamManager,
    private readonly getQuizzes: () => QuizDefinition[],
    private readonly quizProgress: QuizProgress,
  ) {
    progress.onDidChange(() => this.refresh());
    exams.onDidChange(() => this.refresh());
    quizProgress.onDidChange(() => this.refresh());
  }

  refresh(): void {
    this.changed.fire();
  }

  getChildren(node?: ChallengeNode): ChallengeNode[] {
    const all = this.getChallenges();
    if (!node) {
      const topics: ChallengeNode[] = [...new Set(all.map((c) => c.topic))].map((topic) => ({ kind: 'topic', topic }));
      return [
        ...(this.getExams().length ? [{ kind: 'examsRoot' } as ChallengeNode] : []),
        ...(this.getQuizzes().length ? [{ kind: 'quizzesRoot' } as ChallengeNode] : []),
        ...topics,
      ];
    }
    switch (node.kind) {
      case 'topic':
        return all.filter((c) => c.topic === node.topic).map((challenge) => ({ kind: 'challenge', challenge }));
      case 'examsRoot':
        return this.getExams().map((exam) => ({ kind: 'exam', exam }));
      case 'quizzesRoot':
        return this.getQuizzes().map((quiz) => ({ kind: 'quiz', quiz }));
      case 'exam':
        return this.exams.state(node.exam.id)
          ? node.exam.questions.map((question) => ({ kind: 'examQuestion', exam: node.exam, question }))
          : [{ kind: 'examStart', exam: node.exam }];
      default:
        return [];
    }
  }

  getTreeItem(node: ChallengeNode): vscode.TreeItem {
    switch (node.kind) {
      case 'topic':
        return this.topicItem(node.topic);
      case 'challenge':
        return this.challengeItem(node.challenge);
      case 'examsRoot': {
        const item = new vscode.TreeItem('Exams', vscode.TreeItemCollapsibleState.Expanded);
        item.id = 'exams';
        item.iconPath = new vscode.ThemeIcon('checklist');
        item.description = `${this.getExams().length}`;
        return item;
      }
      case 'exam':
        return this.examItem(node.exam);
      case 'examStart': {
        const item = new vscode.TreeItem('Start exam…', vscode.TreeItemCollapsibleState.None);
        item.id = `exam-start:${node.exam.id}`;
        item.iconPath = new vscode.ThemeIcon('play');
        item.command = { command: 'sphynx.startExam', title: 'Start Exam', arguments: [node.exam.id] };
        return item;
      }
      case 'examQuestion':
        return this.questionItem(node.exam, node.question);
      case 'quizzesRoot': {
        const item = new vscode.TreeItem('Quizzes', vscode.TreeItemCollapsibleState.Expanded);
        item.id = 'quizzes';
        item.iconPath = new vscode.ThemeIcon('question');
        const quizzes = this.getQuizzes();
        item.description = `${quizzes.filter((q) => this.perfect(q)).length}/${quizzes.length}`;
        return item;
      }
      case 'quiz':
        return this.quizItem(node.quiz);
    }
  }

  private topicItem(topic: string): vscode.TreeItem {
    const ids = this.getChallenges()
      .filter((c) => c.topic === topic)
      .map((c) => c.id);
    const solved = this.progress.solvedCount(ids);
    const item = new vscode.TreeItem(topic, vscode.TreeItemCollapsibleState.Expanded);
    item.id = `topic:${topic}`;
    item.description = `${solved}/${ids.length}`;
    item.iconPath = new vscode.ThemeIcon(
      solved === ids.length ? 'pass-filled' : TOPIC_ICONS[topic] ?? 'folder',
      solved === ids.length ? new vscode.ThemeColor('testing.iconPassed') : undefined,
    );
    return item;
  }

  private challengeItem(c: Challenge): vscode.TreeItem {
    const p = this.progress.get(c.id);
    const item = new vscode.TreeItem(c.title, vscode.TreeItemCollapsibleState.None);
    item.id = `challenge:${c.id}`;
    item.description = c.difficulty;
    item.contextValue = 'challenge';
    item.command = { command: 'sphynx.open', title: 'Open Challenge', arguments: [c.id] };
    if (p?.status === 'solved') {
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
    } else if (p?.status === 'attempted') {
      item.iconPath = new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    } else {
      item.iconPath = new vscode.ThemeIcon('circle-large-outline');
    }
    item.tooltip = new vscode.MarkdownString(
      `**${c.title}** · ${c.topic} · ${c.difficulty}\n\n` +
        (c.skills.length ? `Mixes: ${c.skills.join(', ')}\n\n` : '') +
        (p?.status === 'solved' ? '✅ Solved' : p ? `Attempts: ${p.attempts}` : 'Not started'),
    );
    return item;
  }

  private examItem(exam: ExamDefinition): vscode.TreeItem {
    const s = this.exams.state(exam.id);
    const item = new vscode.TreeItem(exam.title, s ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed);
    item.id = `exam:${exam.id}`;
    const mode = exam.mode === 'closed' ? 'closed' : 'open';
    if (!s) {
      item.description = `${exam.durationMinutes} min · ${mode}`;
      item.iconPath = new vscode.ThemeIcon(exam.mode === 'closed' ? 'lock' : 'unlock');
      item.contextValue = 'exam-notStarted';
    } else if (!s.finishedAt) {
      item.description = `${formatDuration(s.endsAt - Date.now())} left · ${this.exams.formatScore(exam)}`;
      item.iconPath = new vscode.ThemeIcon('watch', new vscode.ThemeColor('testing.iconQueued'));
      item.contextValue = 'exam-active';
    } else {
      item.description = `✓ ${this.exams.formatScore(exam)}`;
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
      item.contextValue = 'exam-finished';
    }
    item.tooltip = new vscode.MarkdownString(
      `**${exam.title}**\n\n${exam.description ? `${exam.description}\n\n` : ''}` +
        `- ${exam.durationMinutes} minutes, ${exam.questions.length} questions, ${maxScore(exam)} points\n` +
        `- ${exam.maxSubmissions} submission(s) per coding question${exam.questions.some((q) => q.kind === 'quiz') ? '; quizzes are submitted once' : ''}\n` +
        `- ${exam.mode === 'closed' ? 'Closed: no hints or AI hints; pastes and time outside VS Code are recorded' : 'Open: hints, AI and the internet allowed'}`,
    );
    return item;
  }

  private perfect(quiz: QuizDefinition): boolean {
    const score = this.quizProgress.get(quiz.id);
    return !!score && score.best >= score.total;
  }

  private quizItem(quiz: QuizDefinition): vscode.TreeItem {
    const score = this.quizProgress.get(quiz.id);
    const item = new vscode.TreeItem(quiz.title, vscode.TreeItemCollapsibleState.None);
    item.id = `quiz:${quiz.id}`;
    item.contextValue = 'quiz';
    item.description = score ? `best ${score.best}/${score.total}` : `${quiz.questions.length} questions`;
    item.command = { command: 'sphynx.openQuiz', title: 'Open Quiz', arguments: [quiz.id] };
    item.iconPath = !score
      ? new vscode.ThemeIcon('circle-large-outline')
      : this.perfect(quiz)
        ? new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'))
        : new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    item.tooltip = new vscode.MarkdownString(
      `**${quiz.title}** · Quiz${quiz.topic ? ` · ${quiz.topic}` : ''}\n\n${quiz.description ? `${quiz.description}\n\n` : ''}` +
        `${quiz.questions.length} questions` + (score ? `\n\nBest score: ${score.best} / ${score.total} (${score.attempts} attempt${score.attempts === 1 ? '' : 's'})` : ''),
    );
    return item;
  }

  private questionItem(exam: ExamDefinition, q: ExamQuestion): vscode.TreeItem {
    const qs = this.exams.state(exam.id)?.questions[q.id];
    const item = new vscode.TreeItem(questionTitle(q), vscode.TreeItemCollapsibleState.None);
    item.id = `exam-question:${exam.id}:${q.id}`;
    const left = this.exams.submissionsLeft(exam, q.id);
    item.description = `${qs?.bestEarned ?? 0}/${q.points} pts · ${left} submission${left === 1 ? '' : 's'} left`;
    item.command = q.kind === 'quiz'
      ? { command: 'sphynx.openQuiz', title: 'Open Quiz', arguments: [questionKey(q)] }
      : { command: 'sphynx.open', title: 'Open Question', arguments: [questionKey(q)] };
    if (!qs?.submissions) {
      item.iconPath = new vscode.ThemeIcon('circle-large-outline');
    } else if (qs.bestEarned >= q.points) {
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
    } else if (qs.bestEarned > 0) {
      item.iconPath = new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    } else {
      item.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
    }
    return item;
  }
}
