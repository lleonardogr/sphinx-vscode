import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';
import { ExamManager, formatDuration, formatWait } from './examSession';
import { ExamDefinition, ExamQuestion, maxScore, questionKey, questionTitle } from './exams';
import { QuizProgress } from './quizController';
import { QuizDefinition } from './quizzes';
import { PathGroup, PathItem, TESTS_TOPIC, buildPath, groupLabel, pathSequence, requirementStatus, unitIcon, unitName } from './path';
import { LessonDefinition } from './lessons';
import { LessonProgress } from './lessonPanel';
import { DEFAULT_SUBJECT } from './subjects';
import { difficultyName, plural, tr } from './i18n';
import { JavaProblem } from './javaCheck';
import { problemText } from './javaSetup';

/** How the sidebar groups challenges: by unit (the learning path), by difficulty, or by progress. */
export type GroupMode = 'path' | 'difficulty' | 'progress';
export const GROUP_MODES: GroupMode[] = ['path', 'difficulty', 'progress'];

export type ChallengeNode =
  | { kind: 'group'; group: PathGroup }
  /** A group in the difficulty and progress views. */
  | { kind: 'bucket'; id: string; label: string; icon: string; items: ChallengeNode[] }
  | { kind: 'challenge'; challenge: Challenge; view?: GroupMode }
  | { kind: 'examsRoot' }
  | { kind: 'exam'; exam: ExamDefinition }
  | { kind: 'examStart'; exam: ExamDefinition }
  | { kind: 'examQuestion'; exam: ExamDefinition; question: ExamQuestion }
  | { kind: 'quiz'; quiz: QuizDefinition; view?: GroupMode }
  | { kind: 'lesson'; lesson: LessonDefinition; view?: GroupMode }
  | { kind: 'javaNotice'; problem: JavaProblem };

export class ChallengeTreeProvider implements vscode.TreeDataProvider<ChallengeNode> {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changed.event;
  /** Set by the "Group by" command; the extension remembers it. */
  mode: GroupMode = 'path';
  /** The subject shown (see subjects.ts); the extension remembers it. */
  subject: string = DEFAULT_SUBJECT;

  constructor(
    private readonly getChallenges: () => Challenge[],
    private readonly progress: Progress,
    private readonly getExams: () => ExamDefinition[],
    private readonly exams: ExamManager,
    private readonly getQuizzes: () => QuizDefinition[],
    private readonly quizProgress: QuizProgress,
    /** Problems that stop Java from running; shown as a notice at the top of the list. */
    private readonly javaProblems: () => JavaProblem[] = () => [],
    private readonly getLessons: () => LessonDefinition[] = () => [],
    private readonly lessonProgress?: LessonProgress,
  ) {
    lessonProgress?.onDidChange(() => this.refresh());
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
        ...(this.visibleExams().length ? [{ kind: 'examsRoot' } as ChallengeNode] : []),
        ...(this.mode === 'path'
          ? this.path().map((group): ChallengeNode => ({ kind: 'group', group }))
          : this.buckets(this.mode)),
      ];
    }
    switch (node.kind) {
      case 'bucket':
        return node.items;
      case 'group':
        // A unit lists its lessons, its challenges, then its quiz, then the tests that close the stage.
        return [
          ...node.group.lessons.map((lesson): ChallengeNode => ({ kind: 'lesson', lesson })),
          ...node.group.challenges.map((challenge): ChallengeNode => ({ kind: 'challenge', challenge })),
          ...node.group.quizzes.map((quiz): ChallengeNode => ({ kind: 'quiz', quiz })),
          ...node.group.tests.map((challenge): ChallengeNode => ({ kind: 'challenge', challenge })),
        ];
      case 'examsRoot':
        return this.visibleExams().map((exam) => ({ kind: 'exam', exam }));
      case 'exam':
        return this.exams.state(node.exam.id)
          ? node.exam.questions.map((question) => ({ kind: 'examQuestion', exam: node.exam, question }))
          : [{ kind: 'examStart', exam: node.exam }];
      default:
        return [];
    }
  }

  /** The learning path of the subject shown. */
  path(): PathGroup[] {
    return buildPath(this.getChallenges(), this.getQuizzes(), this.getLessons(), this.subject);
  }

  /** Groups for the difficulty and progress views, keeping the learning-path order inside each group. */
  private buckets(mode: 'difficulty' | 'progress'): ChallengeNode[] {
    const items = pathSequence(this.path());
    const node = (it: PathItem): ChallengeNode =>
      it.kind === 'quiz' ? { kind: 'quiz', quiz: it.quiz, view: mode } : it.kind === 'lesson' ? { kind: 'lesson', lesson: it.lesson, view: mode } : { kind: 'challenge', challenge: it.challenge, view: mode };
    const groups: { id: string; label: string; icon: string; test: (it: PathItem) => boolean }[] =
      mode === 'difficulty'
        ? [
            { id: 'Easy', label: tr('Easy', 'Fácil'), icon: 'circle-small-filled', test: (it) => it.kind === 'challenge' && it.challenge.difficulty === 'Easy' },
            { id: 'Medium', label: tr('Medium', 'Médio'), icon: 'circle-filled', test: (it) => it.kind === 'challenge' && it.challenge.difficulty === 'Medium' },
            { id: 'Hard', label: tr('Hard', 'Difícil'), icon: 'flame', test: (it) => it.kind === 'challenge' && it.challenge.difficulty === 'Hard' },
            { id: 'Other', label: tr('Other', 'Outros'), icon: 'circle-outline', test: (it) => it.kind === 'challenge' && !['Easy', 'Medium', 'Hard'].includes(it.challenge.difficulty) },
            { id: 'Lessons', label: tr('Lessons', 'Lições'), icon: 'book', test: (it) => it.kind === 'lesson' },
            { id: 'Quizzes', label: 'Quizzes', icon: 'question', test: (it) => it.kind === 'quiz' },
          ]
        : [
            { id: 'todo', label: tr('Not started', 'Não iniciados'), icon: 'circle-large-outline', test: (it) => this.status(it) === 'todo' },
            { id: 'doing', label: tr('In progress', 'Em andamento'), icon: 'circle-large-filled', test: (it) => this.status(it) === 'doing' },
            { id: 'done', label: tr('Solved', 'Resolvidos'), icon: 'pass-filled', test: (it) => this.status(it) === 'done' },
          ];
    return groups
      .map((g): ChallengeNode => ({ kind: 'bucket', id: `${mode}:${g.id}`, label: g.label, icon: g.icon, items: items.filter(g.test).map(node) }))
      .filter((b) => b.kind === 'bucket' && b.items.length > 0);
  }

  private status(it: PathItem): 'todo' | 'doing' | 'done' {
    if (it.kind === 'lesson') {
      return this.lessonProgress?.isRead(it.lesson.id) ? 'done' : 'todo';
    }
    if (it.kind === 'quiz') {
      const score = this.quizProgress.get(it.quiz.id);
      return !score ? 'todo' : this.perfect(it.quiz) ? 'done' : 'doing';
    }
    const p = this.progress.get(it.challenge.id);
    return p?.status === 'solved' ? 'done' : p ? 'doing' : 'todo';
  }

  private bucketItem(node: Extract<ChallengeNode, { kind: 'bucket' }>): vscode.TreeItem {
    const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.Expanded);
    item.id = `bucket:${node.id}`;
    item.iconPath = new vscode.ThemeIcon(node.icon);
    const statusOf = (n: ChallengeNode) =>
      n.kind === 'challenge' ? this.status({ kind: 'challenge', challenge: n.challenge }) : n.kind === 'quiz' ? this.status({ kind: 'quiz', quiz: n.quiz }) : n.kind === 'lesson' ? this.status({ kind: 'lesson', lesson: n.lesson }) : 'todo';
    const done = node.items.filter((n) => statusOf(n) === 'done').length;
    item.description = node.id.startsWith('progress:') ? `${node.items.length}` : `${done}/${node.items.length}`;
    return item;
  }

  getTreeItem(node: ChallengeNode): vscode.TreeItem {
    switch (node.kind) {
      case 'group':
        return this.groupItem(node.group);
      case 'bucket':
        return this.bucketItem(node);
      case 'challenge':
        return this.challengeItem(node.challenge, node.view);
      case 'examsRoot': {
        const item = new vscode.TreeItem(tr('Exams', 'Provas'), vscode.TreeItemCollapsibleState.Expanded);
        item.id = 'exams';
        item.iconPath = new vscode.ThemeIcon('checklist');
        item.description = `${this.visibleExams().length}`;
        return item;
      }
      case 'exam':
        return this.examItem(node.exam);
      case 'examStart': {
        const item = new vscode.TreeItem(tr('Start exam…', 'Começar prova…'), vscode.TreeItemCollapsibleState.None);
        item.id = `exam-start:${node.exam.id}`;
        item.iconPath = new vscode.ThemeIcon('play');
        item.command = { command: 'sphinx.startExam', title: tr('Start Exam', 'Começar prova'), arguments: [node.exam.id] };
        return item;
      }
      case 'examQuestion':
        return this.questionItem(node.exam, node.question);
      case 'quiz':
        return this.quizItem(node.quiz, node.view);
      case 'lesson':
        return this.lessonItem(node.lesson, node.view);
      case 'javaNotice': {
        const text = problemText(node.problem);
        const item = new vscode.TreeItem(tr("Java isn't ready", 'O Java não está pronto'), vscode.TreeItemCollapsibleState.None);
        item.id = 'java-notice';
        item.description = tr('click to check and fix', 'clique para verificar e corrigir');
        item.iconPath = new vscode.ThemeIcon('warning', new vscode.ThemeColor('problemsWarningIcon.foreground'));
        item.tooltip = new vscode.MarkdownString(`**${text.title}**\n\n${text.fix}`);
        item.command = { command: 'sphinx.checkJava', title: tr('Check Java Setup', 'Verificar a instalação do Java') };
        return item;
      }
    }
  }

  private groupItem(group: PathGroup): vscode.TreeItem {
    const ids = [...group.challenges, ...group.tests].map((c) => c.id);
    const solved = this.progress.solvedCount(ids);
    const lessonsRead = group.lessons.every((l) => this.lessonProgress?.isRead(l.id));
    const done = ids.length + group.lessons.length > 0 && solved === ids.length && lessonsRead && group.quizzes.every((q) => this.perfect(q));
    const item = new vscode.TreeItem(groupLabel(group), vscode.TreeItemCollapsibleState.Expanded);
    item.id = `group:${group.kind}:${group.key}`;
    item.description = ids.length ? `${solved}/${ids.length}` : undefined;
    item.iconPath = new vscode.ThemeIcon(
      done ? 'pass-filled' : (unitIcon(group.key) ?? (group.kind === 'custom' ? 'star-empty' : 'folder')),
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

  private challengeItem(c: Challenge, view: GroupMode = 'path'): vscode.TreeItem {
    const p = this.progress.get(c.id);
    const item = new vscode.TreeItem(c.title, vscode.TreeItemCollapsibleState.None);
    item.id = `challenge:${c.id}`;
    const isTest = c.topic === TESTS_TOPIC;
    // Outside the learning path, show where the challenge belongs.
    const where = isTest ? `${tr('Test', 'Teste')}${c.unit ? ` · ${unitName(c.unit)}` : ''}` : unitName(c.topic);
    item.description =
      view === 'difficulty'
        ? where
        : view === 'progress'
          ? `${where} · ${difficultyName(c.difficulty)}`
          : isTest
            ? `${tr('Test', 'Teste')} · ${difficultyName(c.difficulty)}`
            : difficultyName(c.difficulty);
    if (c.requires.length) {
      item.description += ` · ${tr('needs', 'precisa de')} ${c.requires.map(unitName).join(', ')}`;
    }
    item.contextValue = 'challenge';
    item.command = { command: 'sphinx.open', title: tr('Open Challenge', 'Abrir desafio'), arguments: [c.id] };
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
        (p?.status === 'solved' ? tr('✅ Solved', '✅ Resolvido') : p ? `${tr('Attempts', 'Tentativas')}: ${p.attempts}` : tr('Not started', 'Não iniciado')) +
        this.requirementsText(c.requires),
    );
    return item;
  }

  /** "Needs: Java Programming · Loops (4/12 solved)" lines for a tooltip. */
  private requirementsText(requires: string[]): string {
    if (!requires.length) {
      return '';
    }
    const lines = requirementStatus(requires, this.getChallenges(), (id) => this.progress.isSolved(id)).map(
      (r) => `- ${r.label}${r.total ? ` (${tr(`${r.solved}/${r.total} solved`, `${r.solved}/${r.total} resolvidos`)})` : ''}`,
    );
    return `\n\n${tr('Needs', 'Precisa de')}:\n${lines.join('\n')}`;
  }

  private lessonItem(lesson: LessonDefinition, view: GroupMode = 'path'): vscode.TreeItem {
    const read = this.lessonProgress?.isRead(lesson.id);
    const item = new vscode.TreeItem(lesson.title, vscode.TreeItemCollapsibleState.None);
    item.id = `lesson:${lesson.id}`;
    item.contextValue = 'lesson';
    item.description = `${tr('Lesson', 'Lição')} · ${lesson.minutes} min${view !== 'path' && lesson.topic ? ` · ${unitName(lesson.topic)}` : ''}`;
    item.iconPath = read ? new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed')) : new vscode.ThemeIcon('book');
    item.command = { command: 'sphinx.openLesson', title: tr('Open Lesson', 'Abrir lição'), arguments: [lesson.id] };
    item.tooltip = new vscode.MarkdownString(
      `**${lesson.title}** · ${tr('Lesson', 'Lição')}${lesson.topic ? ` · ${unitName(lesson.topic)}` : ''}\n\n${tr(`About ${lesson.minutes} min to read.`, `Cerca de ${lesson.minutes} min de leitura.`)} ${read ? tr('✅ Read', '✅ Lida') : ''}` +
        this.requirementsText(lesson.requires),
    );
    return item;
  }

  /** The exams of the subject shown, and an exam in progress wherever it's from. */
  private visibleExams(): ExamDefinition[] {
    return this.getExams().filter((exam) => exam.subject === this.subject || this.exams.isActive(exam.id));
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
      const at = this.exams.retakeAt(exam);
      const retake =
        at === undefined ? '' : Date.now() >= at ? ` · ${tr('can retake', 'pode refazer')}` : ` · ${tr(`retake in ${formatWait(at - Date.now())}`, `refazer em ${formatWait(at - Date.now())}`)}`;
      item.description = `✓ ${this.exams.formatScore(exam)}${retake}`;
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
      item.contextValue = this.exams.canRetake(exam) ? 'exam-finished-retake' : 'exam-finished';
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

  private quizItem(quiz: QuizDefinition, view: GroupMode = 'path'): vscode.TreeItem {
    const score = this.quizProgress.get(quiz.id);
    const item = new vscode.TreeItem(quiz.title, vscode.TreeItemCollapsibleState.None);
    item.id = `quiz:${quiz.id}`;
    item.contextValue = 'quiz';
    item.description =
      (score ? `Quiz · ${tr('best', 'melhor')} ${score.best}/${score.total}` : `Quiz · ${plural(quiz.questions.length, ['question', 'questions'], ['questão', 'questões'])}`) +
      (view !== 'path' && quiz.topic ? ` · ${unitName(quiz.topic)}` : '');
    item.command = { command: 'sphinx.openQuiz', title: tr('Open Quiz', 'Abrir quiz'), arguments: [quiz.id] };
    item.iconPath = !score
      ? new vscode.ThemeIcon('question')
      : this.perfect(quiz)
        ? new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'))
        : new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    item.tooltip = new vscode.MarkdownString(
      `**${quiz.title}** · Quiz${quiz.topic ? ` · ${unitName(quiz.topic)}` : ''}\n\n${quiz.description ? `${quiz.description}\n\n` : ''}` +
        plural(quiz.questions.length, ['question', 'questions'], ['questão', 'questões']) +
        (score ? `\n\n${tr('Best score', 'Melhor nota')}: ${score.best} / ${score.total} (${plural(score.attempts, ['attempt', 'attempts'], ['tentativa', 'tentativas'])})` : '') +
        this.requirementsText(quiz.requires ?? []),
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
      ? { command: 'sphinx.openQuiz', title: tr('Open Quiz', 'Abrir quiz'), arguments: [questionKey(q)] }
      : { command: 'sphinx.open', title: tr('Open Question', 'Abrir questão'), arguments: [questionKey(q)] };
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
