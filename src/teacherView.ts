// The teacher view: the teacher's own exams, challenges and quizzes, and the authoring tools.
// The student view (treeView.ts) is the learning path; teachers switch to it to practise.
import * as path from 'path';
import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { ExamDefinition, ExamQuestion, examChallengeId, maxScore, questionTitle } from './exams';
import { ExamManager } from './examSession';
import { QuizDefinition } from './quizzes';
import { LessonDefinition } from './lessons';
import { readingCount } from './lessonPanel';
import { difficultyName, plural, tr } from './i18n';
import { TESTS_TOPIC } from './path';

/** Where an item comes from: shipped with Sphinx, imported into its library, or a folder in sphinx.extraChallengePaths. */
export type Origin = 'builtIn' | 'imported' | 'folder';

export type TeacherNode =
  | { kind: 'section'; id: 'exams' | 'content' | 'tools' }
  | { kind: 'exam'; exam: ExamDefinition }
  | { kind: 'examQuestion'; exam: ExamDefinition; question: ExamQuestion }
  /** The teacher's preview attempt of an exam (`exam` is the preview copy). */
  | { kind: 'preview'; exam: ExamDefinition }
  | { kind: 'previewQuestion'; exam: ExamDefinition; question: ExamQuestion }
  | { kind: 'challenge'; challenge: Challenge }
  | { kind: 'quiz'; quiz: QuizDefinition }
  | { kind: 'lesson'; lesson: LessonDefinition }
  | { kind: 'tool'; id: string; label: string; icon: string; command: string }
  | { kind: 'hint'; label: string; command: string };

const ORIGIN: Record<Origin, [string, string]> = {
  builtIn: ['Built-in', 'Incluída'],
  imported: ['Imported', 'Importada'],
  folder: ['Your folder', 'Sua pasta'],
};

/** The file a teacher edits for an item (its description, or the quiz/exam definition). */
export function sourceFile(node: TeacherNode): string | undefined {
  switch (node.kind) {
    case 'exam':
      return path.join(node.exam.dir, 'exam.json');
    case 'challenge':
      return path.join(node.challenge.dir, 'challenge.json');
    case 'quiz':
      return path.join(node.quiz.dir, 'quiz.json');
    case 'lesson':
      return path.join(node.lesson.dir, 'lesson.md');
    case 'examQuestion':
      return node.question.kind === 'quiz' ? path.join(node.question.quiz.dir, 'quiz.json') : path.join(node.question.challenge.dir, 'description.md');
    default:
      return undefined;
  }
}

export class TeacherTreeProvider implements vscode.TreeDataProvider<TeacherNode> {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changed.event;

  constructor(
    private readonly getChallenges: () => Challenge[],
    private readonly getQuizzes: () => QuizDefinition[],
    private readonly getExams: () => ExamDefinition[],
    private readonly origin: (dir: string) => Origin,
    private readonly examManager: ExamManager,
    /** The preview copy of an exam, when the teacher has started one. */
    private readonly previewFor: (exam: ExamDefinition) => ExamDefinition | undefined,
    private readonly getLessons: () => LessonDefinition[] = () => [],
  ) {
    examManager.onDidChange(() => this.refresh());
  }

  refresh(): void {
    this.changed.fire();
  }

  /** The teacher's own challenges, quizzes and lessons: everything that isn't built in. */
  ownContent(): { challenges: Challenge[]; quizzes: QuizDefinition[]; lessons: LessonDefinition[] } {
    return {
      challenges: this.getChallenges().filter((c) => this.origin(c.dir) !== 'builtIn'),
      quizzes: this.getQuizzes().filter((q) => this.origin(q.dir) !== 'builtIn'),
      lessons: this.getLessons().filter((l) => this.origin(l.dir) !== 'builtIn'),
    };
  }

  getChildren(node?: TeacherNode): TeacherNode[] {
    if (!node) {
      return [
        { kind: 'section', id: 'exams' },
        { kind: 'section', id: 'content' },
        { kind: 'section', id: 'tools' },
      ];
    }
    switch (node.kind) {
      case 'section':
        return this.section(node.id);
      case 'exam': {
        const preview = this.previewFor(node.exam);
        return [
          ...(preview && this.examManager.state(preview.id) ? [{ kind: 'preview', exam: preview } as TeacherNode] : []),
          ...node.exam.questions.map((question): TeacherNode => ({ kind: 'examQuestion', exam: node.exam, question })),
        ];
      }
      case 'preview':
        return node.exam.questions.map((question) => ({ kind: 'previewQuestion', exam: node.exam, question }));
      default:
        return [];
    }
  }

  private section(id: 'exams' | 'content' | 'tools'): TeacherNode[] {
    if (id === 'exams') {
      const exams = this.getExams().filter((e) => !e.preview).sort((a, b) => Number(this.origin(a.dir) === 'builtIn') - Number(this.origin(b.dir) === 'builtIn') || a.title.localeCompare(b.title));
      return exams.length ? exams.map((exam) => ({ kind: 'exam', exam })) : [{ kind: 'hint', label: tr('Import an exam, or copy the sample exam to start one', 'Importe uma prova, ou copie a prova de exemplo para começar'), command: 'sphinx.importContent' }];
    }
    if (id === 'content') {
      const own = this.ownContent();
      const items: TeacherNode[] = [
        ...own.challenges.sort((a, b) => a.title.localeCompare(b.title)).map((challenge): TeacherNode => ({ kind: 'challenge', challenge })),
        ...own.quizzes.sort((a, b) => a.title.localeCompare(b.title)).map((quiz): TeacherNode => ({ kind: 'quiz', quiz })),
        ...own.lessons.sort((a, b) => a.title.localeCompare(b.title)).map((lesson): TeacherNode => ({ kind: 'lesson', lesson })),
      ];
      return items.length ? items : [{ kind: 'hint', label: tr('Create a challenge or import a pack', 'Crie um desafio ou importe um pacote'), command: 'sphinx.createChallenge' }];
    }
    const tool = (toolId: string, label: string, icon: string, command: string): TeacherNode => ({ kind: 'tool', id: toolId, label, icon, command });
    return [
      tool('create', tr('Create New Challenge…', 'Criar novo desafio…'), 'add', 'sphinx.createChallenge'),
      tool('lesson', tr('Create New Lesson…', 'Criar nova lição…'), 'book', 'sphinx.createLesson'),
      tool('import', tr('Import Challenges, Quizzes, Lessons or Exams…', 'Importar desafios, quizzes, lições ou provas…'), 'cloud-download', 'sphinx.importContent'),
      tool('export', tr('Export a Pack for Students…', 'Exportar um pacote para os alunos…'), 'package', 'sphinx.exportPack'),
      tool('validate', tr('Validate Challenges in a Folder…', 'Validar desafios de uma pasta…'), 'beaker', 'sphinx.validateChallenges'),
      tool('results', tr('Class Results…', 'Resultados da turma…'), 'table', 'sphinx.classResults'),
      tool('verify', tr("Verify Students' Exam Results…", 'Verificar resultados das provas…'), 'verified', 'sphinx.verifyExamResults'),
      tool('ai', tr('Set Up AI Hints…', 'Configurar dicas de IA…'), 'sparkle', 'sphinx.setupAi'),
    ];
  }

  getTreeItem(node: TeacherNode): vscode.TreeItem {
    switch (node.kind) {
      case 'section': {
        const labels = {
          exams: [tr('My Exams', 'Minhas provas'), 'checklist'],
          content: [tr('My Challenges, Quizzes & Lessons', 'Meus desafios, quizzes e lições'), 'library'],
          tools: [tr('Tools', 'Ferramentas'), 'tools'],
        } as const;
        const [label, icon] = labels[node.id];
        const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.Expanded);
        item.id = `teacher:section:${node.id}`;
        item.iconPath = new vscode.ThemeIcon(icon);
        if (node.id === 'exams') {
          item.description = String(this.getExams().filter((e) => !e.preview).length);
        } else if (node.id === 'content') {
          const own = this.ownContent();
          item.description = String(own.challenges.length + own.quizzes.length + own.lessons.length);
        }
        return item;
      }
      case 'exam': {
        const e = node.exam;
        const item = new vscode.TreeItem(e.title, vscode.TreeItemCollapsibleState.Collapsed);
        item.id = `teacher:exam:${e.id}`;
        item.iconPath = new vscode.ThemeIcon('checklist');
        item.description = `${tr(...ORIGIN[this.origin(e.dir)])} · ${plural(e.questions.length, ['question', 'questions'], ['questão', 'questões'])} · ${maxScore(e)} pts · ${e.durationMinutes} min`;
        item.tooltip = new vscode.MarkdownString(
          `**${e.title}**\n\n${e.description}\n\n${e.mode === 'closed' ? tr('Closed exam', 'Prova fechada') : tr('Open exam', 'Prova aberta')} · ${tr('restrictions', 'restrições')}: ${e.restrictions.level}\n\n\`${e.dir}\``,
        );
        // Built-in exams can't be deleted; the teacher's own can.
        item.contextValue = this.origin(e.dir) === 'builtIn' ? 'teacherExam' : 'teacherExamOwn';
        return item;
      }
      case 'preview': {
        const s = this.examManager.state(node.exam.id)!;
        const item = new vscode.TreeItem(tr('Your preview attempt', 'Sua tentativa de prévia'), vscode.TreeItemCollapsibleState.Expanded);
        item.id = `teacher:preview:${node.exam.id}`;
        item.iconPath = new vscode.ThemeIcon(s.finishedAt ? 'pass' : 'watch');
        const ends = new Date(s.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        item.description = s.finishedAt
          ? `${tr('finished', 'terminada')} · ${this.examManager.formatScore(node.exam)}`
          : `${tr('in progress', 'em andamento')} · ${tr('ends', 'termina')} ${ends}`;
        item.tooltip = tr(
          'A practice attempt with the real rules and timer. It never counts as a real attempt, and you can restart it.',
          'Uma tentativa de treino com as regras e o tempo reais. Ela nunca conta como tentativa de verdade, e você pode recomeçá-la.',
        );
        item.contextValue = s.finishedAt ? 'teacherPreviewFinished' : 'teacherPreviewActive';
        return item;
      }
      case 'previewQuestion': {
        const q = node.question;
        const qs = this.examManager.state(node.exam.id)?.questions[q.id];
        const item = new vscode.TreeItem(questionTitle(q), vscode.TreeItemCollapsibleState.None);
        item.id = `teacher:preview:${node.exam.id}:${q.id}`;
        item.iconPath = new vscode.ThemeIcon(qs?.submissions ? 'pass' : q.kind === 'quiz' ? 'question' : 'code');
        item.description = `${qs?.bestEarned ?? 0}/${q.points} pts`;
        const id = examChallengeId(node.exam.id, q.id);
        item.command = q.kind === 'quiz' ? { command: 'sphinx.openQuiz', title: tr('Open', 'Abrir'), arguments: [id] } : { command: 'sphinx.open', title: tr('Open', 'Abrir'), arguments: [id] };
        return item;
      }
      case 'examQuestion': {
        const q = node.question;
        const item = new vscode.TreeItem(questionTitle(q), vscode.TreeItemCollapsibleState.None);
        item.id = `teacher:exam:${node.exam.id}:${q.id}`;
        item.iconPath = new vscode.ThemeIcon(q.kind === 'quiz' ? 'question' : 'code');
        item.description = `${q.points} pts · ${q.kind === 'quiz' ? 'Quiz' : difficultyName(q.challenge.difficulty)}`;
        // Built-in exams can be tried (Try Exam) but not edited: changes would be lost on the next update.
        if (this.origin(node.exam.dir) === 'builtIn') {
          item.contextValue = 'teacherQuestionBuiltIn';
          item.tooltip = tr('A question of a built-in exam. Try it with Try Exam (Preview).', 'Uma questão de uma prova incluída. Experimente com Testar prova (prévia).');
        } else {
          item.contextValue = 'teacherQuestion';
          item.command = { command: 'sphinx.editItem', title: tr('Edit', 'Editar'), arguments: [node] };
        }
        return item;
      }
      case 'challenge': {
        const c = node.challenge;
        const item = new vscode.TreeItem(c.title, vscode.TreeItemCollapsibleState.None);
        item.id = `teacher:challenge:${c.id}`;
        item.iconPath = new vscode.ThemeIcon(c.topic === TESTS_TOPIC ? 'beaker' : 'code');
        item.description = `${tr(...ORIGIN[this.origin(c.dir)])} · ${difficultyName(c.difficulty)}`;
        item.tooltip = new vscode.MarkdownString(`**${c.title}**\n\n${plural(c.tests.length, ['test', 'tests'], ['teste', 'testes'])}\n\n\`${c.dir}\``);
        item.contextValue = 'teacherItem';
        item.command = { command: 'sphinx.open', title: tr('Try', 'Testar'), arguments: [c.id] };
        return item;
      }
      case 'quiz': {
        const q = node.quiz;
        const item = new vscode.TreeItem(q.title, vscode.TreeItemCollapsibleState.None);
        item.id = `teacher:quiz:${q.id}`;
        item.iconPath = new vscode.ThemeIcon('question');
        item.description = `${tr(...ORIGIN[this.origin(q.dir)])} · Quiz · ${plural(q.questions.length, ['question', 'questions'], ['questão', 'questões'])}`;
        item.contextValue = 'teacherItem';
        item.command = { command: 'sphinx.openQuiz', title: tr('Try', 'Testar'), arguments: [q.id] };
        return item;
      }
      case 'lesson': {
        const l = node.lesson;
        const item = new vscode.TreeItem(l.title, vscode.TreeItemCollapsibleState.None);
        item.id = `teacher:lesson:${l.id}`;
        item.iconPath = new vscode.ThemeIcon('book');
        item.description = `${tr(...ORIGIN[this.origin(l.dir)])} · ${tr('Lesson', 'Lição')}${l.readings.length ? ` · ${readingCount(l.readings.length)}` : ''}`;
        item.contextValue = 'teacherItem';
        item.command = { command: 'sphinx.openLesson', title: tr('Open', 'Abrir'), arguments: [l.id] };
        return item;
      }
      case 'tool': {
        const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.None);
        item.id = `teacher:tool:${node.id}`;
        item.iconPath = new vscode.ThemeIcon(node.icon);
        item.command = { command: node.command, title: node.label };
        return item;
      }
      case 'hint': {
        const item = new vscode.TreeItem(node.label, vscode.TreeItemCollapsibleState.None);
        item.iconPath = new vscode.ThemeIcon('lightbulb');
        item.command = { command: node.command, title: node.label };
        return item;
      }
    }
  }
}
