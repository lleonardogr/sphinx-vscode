import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';
import { ExamManager, formatDuration } from './examSession';
import { ExamDefinition, ExamQuestion, maxScore, questionKey, questionTitle } from './exams';
import { QuizProgress } from './quizController';
import { QuizDefinition } from './quizzes';
import { PathGroup, TESTS_TOPIC, buildPath, groupLabel, unitName } from './path';
import { difficultyName, plural, tr } from './i18n';
import { JavaProblem } from './javaCheck';
import { problemText } from './javaSetup';

export type ChallengeNode =
  | { kind: 'group'; group: PathGroup }
  | { kind: 'challenge'; challenge: Challenge }
  | { kind: 'examsRoot' }
  | { kind: 'exam'; exam: ExamDefinition }
  | { kind: 'examStart'; exam: ExamDefinition }
  | { kind: 'examQuestion'; exam: ExamDefinition; question: ExamQuestion }
  | { kind: 'quiz'; quiz: QuizDefinition }
  | { kind: 'javaNotice'; problem: JavaProblem };

const GROUP_ICONS: Record<string, string> = {
  Basics: 'symbol-variable',
  Conditionals: 'git-compare',
  Loops: 'sync',
  Strings: 'symbol-string',
  Methods: 'symbol-method',
  Arrays: 'symbol-array',
  Collections: 'list-tree',
  OOP: 'symbol-class',
  Exceptions: 'warning',
  Recursion: 'debug-restart',
  Streams: 'filter',
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
    /** Problems that stop Java from running; shown as a notice at the top of the list. */
    private readonly javaProblems: () => JavaProblem[] = () => [],
  ) {
    progress.onDidChange(() => this.refresh());
    exams.onDidChange(() => this.refresh());
    quizProgress.onDidChange(() => this.refresh());
  }

  refresh(): void {
    this.changed.fire();
  }

  getChildren(node?: ChallengeNode): ChallengeNode[] {
    if (!node) {
      return [
        ...this.javaProblems().slice(0, 1).map((problem): ChallengeNode => ({ kind: 'javaNotice', problem })),
        ...(this.getExams().length ? [{ kind: 'examsRoot' } as ChallengeNode] : []),
        ...buildPath(this.getChallenges(), this.getQuizzes()).map((group): ChallengeNode => ({ kind: 'group', group })),
      ];
    }
    switch (node.kind) {
      case 'group':
        // A unit lists its challenges, then its quiz, then the tests that close the stage.
        return [
          ...node.group.challenges.map((challenge): ChallengeNode => ({ kind: 'challenge', challenge })),
          ...node.group.quizzes.map((quiz): ChallengeNode => ({ kind: 'quiz', quiz })),
          ...node.group.tests.map((challenge): ChallengeNode => ({ kind: 'challenge', challenge })),
        ];
      case 'examsRoot':
        return this.getExams().map((exam) => ({ kind: 'exam', exam }));
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
      case 'group':
        return this.groupItem(node.group);
      case 'challenge':
        return this.challengeItem(node.challenge);
      case 'examsRoot': {
        const item = new vscode.TreeItem(tr('Exams', 'Provas'), vscode.TreeItemCollapsibleState.Expanded);
        item.id = 'exams';
        item.iconPath = new vscode.ThemeIcon('checklist');
        item.description = `${this.getExams().length}`;
        return item;
      }
      case 'exam':
        return this.examItem(node.exam);
      case 'examStart': {
        const item = new vscode.TreeItem(tr('Start exam…', 'Começar prova…'), vscode.TreeItemCollapsibleState.None);
        item.id = `exam-start:${node.exam.id}`;
        item.iconPath = new vscode.ThemeIcon('play');
        item.command = { command: 'sphynx.startExam', title: tr('Start Exam', 'Começar prova'), arguments: [node.exam.id] };
        return item;
      }
      case 'examQuestion':
        return this.questionItem(node.exam, node.question);
      case 'quiz':
        return this.quizItem(node.quiz);
      case 'javaNotice': {
        const text = problemText(node.problem);
        const item = new vscode.TreeItem(tr("Java isn't ready", 'O Java não está pronto'), vscode.TreeItemCollapsibleState.None);
        item.id = 'java-notice';
        item.description = tr('click to check and fix', 'clique para verificar e corrigir');
        item.iconPath = new vscode.ThemeIcon('warning', new vscode.ThemeColor('problemsWarningIcon.foreground'));
        item.tooltip = new vscode.MarkdownString(`**${text.title}**\n\n${text.fix}`);
        item.command = { command: 'sphynx.checkJava', title: tr('Check Java Setup', 'Verificar a instalação do Java') };
        return item;
      }
    }
  }

  private groupItem(group: PathGroup): vscode.TreeItem {
    const ids = [...group.challenges, ...group.tests].map((c) => c.id);
    const solved = this.progress.solvedCount(ids);
    const done = ids.length > 0 && solved === ids.length && group.quizzes.every((q) => this.perfect(q));
    const item = new vscode.TreeItem(groupLabel(group), vscode.TreeItemCollapsibleState.Expanded);
    item.id = `group:${group.kind}:${group.key}`;
    item.description = ids.length ? `${solved}/${ids.length}` : undefined;
    item.iconPath = new vscode.ThemeIcon(
      done ? 'pass-filled' : GROUP_ICONS[group.key] ?? 'folder',
      done ? new vscode.ThemeColor('testing.iconPassed') : undefined,
    );
    if (group.kind === 'custom') {
      item.tooltip = tr(
        'Challenges, quizzes and tests that belong to no unit: written by your teacher, imported, or your own.',
        'Desafios, quizzes e testes que não pertencem a nenhuma unidade: criados pelo professor, importados ou seus.',
      );
    }
    return item;
  }

  private challengeItem(c: Challenge): vscode.TreeItem {
    const p = this.progress.get(c.id);
    const item = new vscode.TreeItem(c.title, vscode.TreeItemCollapsibleState.None);
    item.id = `challenge:${c.id}`;
    const isTest = c.topic === TESTS_TOPIC;
    item.description = isTest ? `${tr('Test', 'Teste')} · ${difficultyName(c.difficulty)}` : difficultyName(c.difficulty);
    item.contextValue = 'challenge';
    item.command = { command: 'sphynx.open', title: tr('Open Challenge', 'Abrir desafio'), arguments: [c.id] };
    if (p?.status === 'solved') {
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
    } else if (p?.status === 'attempted') {
      item.iconPath = new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    } else {
      item.iconPath = new vscode.ThemeIcon(isTest ? 'beaker' : 'circle-large-outline');
    }
    item.tooltip = new vscode.MarkdownString(
      `**${c.title}** · ${isTest ? tr('Test', 'Teste') : unitName(c.topic)} · ${difficultyName(c.difficulty)}\n\n` +
        (c.skills.length ? `${tr('Mixes', 'Combina')}: ${c.skills.map(unitName).join(', ')}\n\n` : '') +
        (p?.status === 'solved' ? tr('✅ Solved', '✅ Resolvido') : p ? `${tr('Attempts', 'Tentativas')}: ${p.attempts}` : tr('Not started', 'Não iniciado')),
    );
    return item;
  }

  private examItem(exam: ExamDefinition): vscode.TreeItem {
    const s = this.exams.state(exam.id);
    const item = new vscode.TreeItem(exam.title, s ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed);
    item.id = `exam:${exam.id}`;
    const mode = exam.mode === 'closed' ? 'closed' : 'open';
    if (!s) {
      item.description = `${exam.durationMinutes} min · ${mode === 'closed' ? tr('closed', 'fechada') : tr('open', 'aberta')}`;
      item.iconPath = new vscode.ThemeIcon(exam.mode === 'closed' ? 'lock' : 'unlock');
      item.contextValue = 'exam-notStarted';
    } else if (!s.finishedAt) {
      item.description = `${tr(`${formatDuration(s.endsAt - Date.now())} left`, `faltam ${formatDuration(s.endsAt - Date.now())}`)} · ${this.exams.formatScore(exam)}`;
      item.iconPath = new vscode.ThemeIcon('watch', new vscode.ThemeColor('testing.iconQueued'));
      item.contextValue = 'exam-active';
    } else {
      item.description = `✓ ${this.exams.formatScore(exam)}`;
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
      item.contextValue = 'exam-finished';
    }
    item.tooltip = new vscode.MarkdownString(
      `**${exam.title}**\n\n${exam.description ? `${exam.description}\n\n` : ''}` +
        tr(
          `- ${exam.durationMinutes} minutes, ${exam.questions.length} questions, ${maxScore(exam)} points\n`,
          `- ${exam.durationMinutes} minutos, ${exam.questions.length} questões, ${maxScore(exam)} pontos\n`,
        ) +
        tr(
          `- ${exam.maxSubmissions} submission(s) per coding question${exam.questions.some((q) => q.kind === 'quiz') ? '; quizzes are submitted once' : ''}\n`,
          `- ${exam.maxSubmissions} envio(s) por questão de código${exam.questions.some((q) => q.kind === 'quiz') ? '; quizzes são enviados uma vez' : ''}\n`,
        ) +
        `- ${exam.mode === 'closed'
          ? tr('Closed: no hints or AI hints; pastes and time outside VS Code are recorded', 'Fechada: sem dicas nem dicas de IA; colagens e tempo fora do VS Code são registrados')
          : tr('Open: hints, AI and the internet allowed', 'Aberta: dicas, IA e internet permitidas')}`,
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
    item.description = score ? `Quiz · ${tr('best', 'melhor')} ${score.best}/${score.total}` : `Quiz · ${plural(quiz.questions.length, ['question', 'questions'], ['questão', 'questões'])}`;
    item.command = { command: 'sphynx.openQuiz', title: tr('Open Quiz', 'Abrir quiz'), arguments: [quiz.id] };
    item.iconPath = !score
      ? new vscode.ThemeIcon('question')
      : this.perfect(quiz)
        ? new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'))
        : new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    item.tooltip = new vscode.MarkdownString(
      `**${quiz.title}** · Quiz${quiz.topic ? ` · ${unitName(quiz.topic)}` : ''}\n\n${quiz.description ? `${quiz.description}\n\n` : ''}` +
        plural(quiz.questions.length, ['question', 'questions'], ['questão', 'questões']) +
        (score ? `\n\n${tr('Best score', 'Melhor nota')}: ${score.best} / ${score.total} (${plural(score.attempts, ['attempt', 'attempts'], ['tentativa', 'tentativas'])})` : ''),
    );
    return item;
  }

  private questionItem(exam: ExamDefinition, q: ExamQuestion): vscode.TreeItem {
    const qs = this.exams.state(exam.id)?.questions[q.id];
    const item = new vscode.TreeItem(questionTitle(q), vscode.TreeItemCollapsibleState.None);
    item.id = `exam-question:${exam.id}:${q.id}`;
    const left = this.exams.submissionsLeft(exam, q.id);
    item.description = `${qs?.bestEarned ?? 0}/${q.points} pts · ${tr(`${left} submission${left === 1 ? '' : 's'} left`, `${left} envio${left === 1 ? '' : 's'} restante${left === 1 ? '' : 's'}`)}`;
    item.command = q.kind === 'quiz'
      ? { command: 'sphynx.openQuiz', title: tr('Open Quiz', 'Abrir quiz'), arguments: [questionKey(q)] }
      : { command: 'sphynx.open', title: tr('Open Question', 'Abrir questão'), arguments: [questionKey(q)] };
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
