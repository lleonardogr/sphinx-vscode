import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { AiHints } from './ai/hints';
import { createChallenge, createLesson, validateFolder } from './authoring';
import { ChallengePanel, PanelAction, PanelExamInfo, examStatusText } from './challengePanel';
import { Challenge, loadChallenges } from './challenges';
import { Progress } from './progress';
import { SafeState } from './safeState';
import { RunOutcome, javacMajorVersion, normalizeOutput, runChallengeCode } from './runner';
import { runInTerminal } from './terminalRunner';
import { ExamManager } from './examSession';
import { importContent, libraryRoots, removeImported } from './importer';
import { QuizController, QuizProgress } from './quizController';
import { QuizDefinition, loadQuizzes } from './quizzes';
import { PathItem, buildPath, nextInPath, pathItemTitle, requirementStatus, subjectOf } from './path';
import { DEFAULT_SUBJECT, allSubjects, findSubject, loadSubjects, setSubjects, subjectContentRoots, subjectTitle } from './subjects';
import { LessonDefinition, loadLessons } from './lessons';
import { LessonPanel, LessonProgress } from './lessonPanel';
import { plural, setLanguage, tr } from './i18n';
import { JavaSetup } from './javaSetup';
import { clearJavaCache } from './runner';
import { formatVerification, verifyResults } from './examVerify';
import { ExamDefinition, ExamQuestion, PREVIEW_SUFFIX, examChallengeId, loadExams, parseExamChallengeId, previewOf } from './exams';
import { ChallengeNode, ChallengeTreeProvider, GroupMode } from './treeView';
import { Origin, TeacherNode, TeacherTreeProvider, sourceFile } from './teacherView';
import { exportPack } from './exporter';
import { ClassReport, buildClassReport, examsInResults, findResultsFiles, readResults } from './classResults';
import { ClassResultsPanel } from './classResultsPanel';

const CODE_FILE = 'Main.java';

/**
 * Until 1.0.0 the extension id was class-plugin.sphynx. VS Code gives the new id an empty storage
 * folder, so bring the old one's imported library and saved solutions along (once, best effort).
 */
export function migrateOldStorage(storage: string): void {
  const old = path.join(path.dirname(storage), 'class-plugin.sphynx');
  for (const dir of ['library', 'solutions']) {
    const from = path.join(old, dir);
    const to = path.join(storage, dir);
    if (fs.existsSync(from) && !fs.existsSync(to)) {
      try {
        fs.mkdirSync(storage, { recursive: true });
        fs.cpSync(from, to, { recursive: true });
      } catch {
        // Nothing to lose: the old folder stays where it was.
      }
    }
  }
}

/** What activate() returns. Used by the integration tests to check the extension's state. */
export interface SphinxApi {
  progress: Progress;
  lessonProgress: LessonProgress;
  lessons(): LessonDefinition[];
  teacherTree: TeacherTreeProvider;
  /** Re-grades results files (the class dashboard's "Verify all"). */
  verifyFiles(files: string[]): Promise<{ file: string; matches: boolean; recomputed?: number; error?: string }[]>;
  view(): 'student' | 'teacher';
  quizProgress: QuizProgress;
  examManager: ExamManager;
  tree: ChallengeTreeProvider;
  challenges(): Challenge[];
  quizzes(): QuizDefinition[];
  exams(): ExamDefinition[];
  codePath(c: Challenge): string;
  /** Moves a challenge's code out of the description's column, as when it is opened (for tests). */
  moveCodeBesideDescription(file: string): Promise<vscode.TextEditor | undefined>;
}

/**
 * Until 1.1.0 Sphinx was spelled "Sphynx", and its saved state used "sphynx." keys. Move them to
 * "sphinx." keys once; the old key is removed so a later reset isn't undone by copying it again.
 */
export function migrateSphynxState(state: vscode.Memento): void {
  for (const key of state.keys().filter((k) => k.startsWith('sphynx.'))) {
    const renamed = `sphinx.${key.slice('sphynx.'.length)}`;
    if (state.get(renamed) === undefined) {
      void state.update(renamed, state.get(key));
    }
    void state.update(key, undefined);
  }
}

export function activate(context: vscode.ExtensionContext): SphinxApi {
  migrateOldStorage(context.globalStorageUri.fsPath);
  // Progress, quiz scores and exam sessions share one guarded view of the global state.
  const store = new SafeState(context.globalState);
  migrateSphynxState(store);
  const progress = new Progress(store);
  const output = vscode.window.createOutputChannel('Sphinx');
  const diagnostics = vscode.languages.createDiagnosticCollection('sphinx');
  let challenges: Challenge[] = [];
  let exams: ExamDefinition[] = [];
  let quizzes: QuizDefinition[] = [];
  let lessons: LessonDefinition[] = [];
  const quizProgress = new QuizProgress(store);
  const lessonProgress = new LessonProgress(store);
  const running = new Set<string>();
  /** Last (redacted) Run/Submit result per challenge, used as context for AI hints. */
  const lastOutcome = new Map<string, RunOutcome>();
  const ai = new AiHints(context);

  const examManager = new ExamManager(context, (examId) => examCodeDir(examId), (exam, q) => gradeExamQuestion(exam, q), store);
  const javaSetup = new JavaSetup(output, () => javaHome(), () => javaStyle());
  // Teachers' preview attempts (see previewOf) are listed in the teacher view only.
  const tree = new ChallengeTreeProvider(
    () => challenges,
    progress,
    () => exams.filter((e) => !e.preview),
    examManager,
    () => quizzes,
    quizProgress,
    () => javaSetup.problems(),
    () => lessons,
    lessonProgress,
  );
  javaSetup.onDidChange(() => tree.refresh());
  const GROUP_KEY = 'sphinx.groupBy';
  tree.mode = context.globalState.get<GroupMode>(GROUP_KEY, 'path');
  const SUBJECT_KEY = 'sphinx.subject';
  tree.subject = store.get<string>(SUBJECT_KEY, DEFAULT_SUBJECT);
  /** The units an item needs, with the student's progress in each. */
  const requirementsOf = (requires: string[]) => requirementStatus(requires, challenges, (id) => progress.isSolved(id));
  const quizController = new QuizController(context.extensionUri, quizProgress, examManager, () => quizzes, () => exams, requirementsOf);
  const lessonPanel = new LessonPanel(context.extensionUri, (msg, lesson) => void onLessonMessage(msg.type, lesson));
  const treeView = vscode.window.createTreeView('sphinx.list', { treeDataProvider: tree });

  // Student or teacher view. Both live in the Sphinx sidebar; a context key shows one of them.
  const VIEW_KEY = 'sphinx.view';
  /** Where an item comes from, shown in the teacher view. */
  const origin = (dir: string): Origin => {
    const inside = (parent: string) => path.resolve(dir).startsWith(path.resolve(parent) + path.sep);
    if (inside(context.extensionPath)) {
      return 'builtIn';
    }
    return inside(libraryDir()) ? 'imported' : 'folder';
  };
  const teacherTree = new TeacherTreeProvider(() => challenges, () => quizzes, () => exams, origin, examManager, (exam) => exams.find((e) => e.id === exam.id + PREVIEW_SUFFIX), () => lessons);
  /** Re-grades results files for the class dashboard's "Verify all". */
  async function verifyFiles(files: string[]): Promise<{ file: string; matches: boolean; recomputed?: number; error?: string }[]> {
    const out: { file: string; matches: boolean; recomputed?: number; error?: string }[] = [];
    for (const file of files) {
      try {
        const report = await verifyResults(file, exams, javaHome());
        out.push({ file, matches: report.matches, recomputed: report.recomputed });
      } catch (e) {
        out.push({ file, matches: false, error: (e as Error).message });
      }
    }
    return out;
  }
  const classPanel = new ClassResultsPanel(context.extensionUri, verifyFiles);
  context.subscriptions.push({ dispose: () => classPanel.dispose() });
  /** Exams whose preview was started in this session (later sessions find them through their saved state). */
  const previewing = new Set<string>();
  const teacherView = vscode.window.createTreeView('sphinx.teacher', { treeDataProvider: teacherTree });
  const currentView = (): 'student' | 'teacher' => (store.get<string>(VIEW_KEY) === 'teacher' ? 'teacher' : 'student');
  async function setView(view: 'student' | 'teacher'): Promise<void> {
    await store.update(VIEW_KEY, view);
    await vscode.commands.executeCommand('setContext', 'sphinx.view', view);
    await vscode.commands.executeCommand(view === 'teacher' ? 'sphinx.teacher.focus' : 'sphinx.list.focus');
  }
  void vscode.commands.executeCommand('setContext', 'sphinx.view', currentView());
  const panel = new ChallengePanel(context.extensionUri, progress, (action, c) => handlePanelAction(action, c));
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.command = 'sphinx.list.focus';
  status.tooltip = tr('Sphinx: open the challenge list', 'Sphinx: abrir a lista de desafios');
  status.show();

  panel.examInfo = (c) => panelExamInfo(c);
  panel.requirements = (c) => requirementsOf(c.requires);
  context.subscriptions.push(output, diagnostics, treeView, teacherView, status, examManager, quizController, { dispose: () => panel.dispose() }, { dispose: () => lessonPanel.dispose() });

  const config = () => vscode.workspace.getConfiguration('sphinx');
  void migrateLegacySettings();
  const javaHome = () => config().get<string>('java.home', '').trim() || undefined;
  const javaStyle = () => config().get<'modern' | 'classic'>('java.style', 'modern');
  const starterFor = (c: Challenge) => (javaStyle() === 'classic' ? c.starterCodeClassic : c.starterCode);
  let jdkChecked = false;

  /** Modern starter code needs JDK 25+. Offer to switch to classic once per session if the JDK is older. */
  async function checkJdkForStyle(): Promise<void> {
    if (jdkChecked || javaStyle() !== 'modern') {
      return;
    }
    jdkChecked = true;
    const major = await javacMajorVersion(javaHome());
    if (major === undefined || major >= 25) {
      return;
    }
    const classicLabel = tr('Use Classic Java', 'Usar Java clássico');
    const downloadLabel = tr('Download JDK 25+', 'Baixar o JDK 25+');
    const choice = await vscode.window.showWarningMessage(
      tr(
        `Your JDK is version ${major}, but the modern Java starter code (void main(), IO.println) needs JDK 25 or newer.`,
        `Seu JDK é a versão ${major}, mas o código inicial em Java moderno (void main(), IO.println) precisa do JDK 25 ou mais novo.`,
      ),
      classicLabel,
      downloadLabel,
    );
    if (choice === classicLabel) {
      await config().update('java.style', 'classic', vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        tr(
          'Classic Java starter code will be used for new challenges. Use "Reset Code to Starter" to switch a challenge you already opened.',
          'O código inicial em Java clássico será usado nos novos desafios. Use "Restaurar código" para trocar um desafio que você já abriu.',
        ),
      );
    } else if (choice === downloadLabel) {
      vscode.env.openExternal(vscode.Uri.parse('https://adoptium.net/temurin/releases/'));
    }
  }

  function reload(): void {
    // Subjects first: they define the units the rest of the content is sorted into.
    const subjectLoad = loadSubjects([path.join(context.extensionPath, 'subjects')]);
    setSubjects(subjectLoad.subjects);
    if (!findSubject(tree.subject)) {
      tree.subject = DEFAULT_SUBJECT;
    }
    const extra = config().get<string[]>('extraChallengePaths', []);
    const builtIn = [
      ...['challenges', 'custom', 'tests', 'exams', 'quizzes'].map((dir) => path.join(context.extensionPath, dir)),
      ...allSubjects().flatMap(subjectContentRoots),
      ...libraryRoots(libraryDir()),
    ];
    const result = loadChallenges([...builtIn, ...extra]);
    challenges = result.challenges;
    const quizResult = loadQuizzes([...builtIn, ...extra]);
    quizzes = quizResult.quizzes;
    const lessonResult = loadLessons([...builtIn, ...extra]);
    lessons = lessonResult.lessons;
    const examResult = loadExams([...builtIn, ...extra], challenges, quizzes);
    const previews = examResult.exams.filter((e) => previewing.has(e.id) || examManager.state(e.id + PREVIEW_SUFFIX)).map(previewOf);
    exams = [...examResult.exams, ...previews];
    const errors = [...subjectLoad.errors, ...result.errors.filter((e) => !e.endsWith('folder not found')), ...quizResult.errors, ...lessonResult.errors, ...examResult.errors];
    if (errors.length) {
      errors.forEach((e) => output.appendLine(`[challenges] ${e}`));
      vscode.window.showWarningMessage(
        tr('Some challenges, quizzes or exams could not be loaded. See the "Sphinx" output for details.', 'Alguns desafios, quizzes ou provas não puderam ser carregados. Veja os detalhes na saída "Sphinx".'),
      );
    }
    examManager.setExams(exams);
    tree.refresh();
    teacherTree.refresh();
    updateStatus();
  }

  function updateStatus(): void {
    // Progress of the subject shown in the sidebar.
    const mine = challenges.filter((c) => subjectOf(c) === tree.subject);
    const solved = progress.solvedCount(mine.map((c) => c.id));
    const subject = findSubject(tree.subject);
    status.text = `$(mortar-board) ${solved}/${mine.length} ${tr('solved', 'resolvidos')}`;
    status.tooltip = tr(`Sphinx: ${subject ? subjectTitle(subject) : ''}. Click to open the list.`, `Sphinx: ${subject ? subjectTitle(subject) : ''}. Clique para abrir a lista.`);
    // With several subjects, the header names the one shown ("Sphinx: CS Fundamentals").
    treeView.title = allSubjects().length > 1 && subject ? subjectTitle(subject) : tr('Challenges', 'Desafios');
    treeView.message = challenges.length ? undefined : 'No challenges found.';
  }

  /** Folder holding one sub-folder (with a Main.java) per challenge. */
  function codeRoot(): string {
    const configured = config().get<string>('codeFolder', '').trim();
    if (configured) {
      return configured.replace(/^~(?=$|[\\/])/, process.env.HOME ?? process.env.USERPROFILE ?? '~');
    }
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (ws) {
      // Code used to be saved in sphynx/ (the old spelling) and, before that, tech-challenges/.
      // Keep using an old folder if it exists and sphinx/ doesn't.
      const current = path.join(ws.uri.fsPath, 'sphinx');
      const legacy = ['sphynx', 'tech-challenges'].map((dir) => path.join(ws.uri.fsPath, dir)).find((dir) => fs.existsSync(dir));
      return !fs.existsSync(current) && legacy ? legacy : current;
    }
    return path.join(context.globalStorageUri.fsPath, 'solutions');
  }

  /** Where imported challenges, tests and exams are copied. */
  function libraryDir(): string {
    return path.join(context.globalStorageUri.fsPath, 'library');
  }

  function examCodeDir(examId: string): string {
    return path.join(codeRoot(), 'exams', examId);
  }

  function codePath(c: Challenge): string {
    const t = parseExamChallengeId(c.id);
    return t ? path.join(examCodeDir(t.examId), t.questionId, CODE_FILE) : path.join(codeRoot(), c.id, CODE_FILE);
  }

  /** Practice challenges plus every exam question. */
  function findChallenge(id: string): Challenge | undefined {
    for (const q of exams.flatMap((t) => t.questions)) {
      if (q.kind === 'challenge' && q.challenge.id === id) {
        return q.challenge;
      }
    }
    return challenges.find((c) => c.id === id);
  }

  function examFor(c: Challenge): { exam: ExamDefinition; question: ExamQuestion } | undefined {
    const ids = parseExamChallengeId(c.id);
    const exam = ids && exams.find((t) => t.id === ids.examId);
    const question = exam?.questions.find((q) => q.id === ids!.questionId);
    return exam && question ? { exam, question } : undefined;
  }

  function panelExamInfo(c: Challenge): PanelExamInfo | undefined {
    const tq = examFor(c);
    if (!tq) {
      return undefined;
    }
    const s = examManager.state(tq.exam.id);
    return {
      examTitle: tq.exam.title,
      mode: tq.exam.mode,
      points: tq.question.points,
      earned: s?.questions[tq.question.id]?.bestEarned ?? 0,
      submissionsLeft: examManager.submissionsLeft(tq.exam, tq.question.id),
      maxSubmissions: tq.exam.maxSubmissions,
      started: !!s,
      finished: !!s?.finishedAt,
      noCopy: tq.exam.restrictions.blockCopy,
    };
  }

  function postExamStatus(c: Challenge): void {
    const info = panelExamInfo(c);
    if (info && panel.current?.id === c.id) {
      panel.post({ type: 'examStatus', text: examStatusText(info), ...info });
    }
  }

  function challengeForFile(file: string): Challenge | undefined {
    if (path.basename(file) !== CODE_FILE) {
      return undefined;
    }
    const rel = path.relative(codeRoot(), path.dirname(file));
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
      return undefined;
    }
    const parts = rel.split(path.sep);
    if (parts.length === 3 && parts[0] === 'exams') {
      return findChallenge(`exam:${parts[1]}:${parts[2]}`);
    }
    return parts.length === 1 ? challenges.find((c) => c.id === rel) : undefined;
  }

  /** Grades an exam question's current code against all its tests (used when an exam is finished). */
  async function gradeExamQuestion(_exam: ExamDefinition, q: ExamQuestion): Promise<RunOutcome | undefined> {
    if (q.kind !== 'challenge') {
      return undefined;
    }
    const file = codePath(q.challenge);
    if (!fs.existsSync(file)) {
      return undefined;
    }
    const outcome = await runChallengeCode({
      file,
      tests: q.challenge.tests,
      mustContain: q.challenge.mustContain,
      mustNotContain: q.challenge.mustNotContain,
      timeLimitMs: q.challenge.timeLimitMs,
      javaHome: javaHome(),
    });
    return outcome.kind === 'toolMissing' ? undefined : outcome;
  }

  function ensureCodeFile(c: Challenge): string {
    const file = codePath(c);
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, starterFor(c));
    }
    return file;
  }

  /** Accepts a challenge id (tree click), a tree node (context menu), or nothing (current/active/quick pick). */
  async function resolveChallenge(arg: unknown): Promise<Challenge | undefined> {
    if (typeof arg === 'string') {
      return findChallenge(arg);
    }
    if (arg && typeof arg === 'object' && (arg as ChallengeNode).kind === 'examQuestion') {
      const q = (arg as { question: ExamQuestion }).question;
      return q.kind === 'challenge' ? q.challenge : undefined;
    }
    if (arg && typeof arg === 'object' && (arg as ChallengeNode).kind === 'challenge') {
      return (arg as { challenge: Challenge }).challenge;
    }
    const editor = vscode.window.activeTextEditor;
    const fromEditor = editor && challengeForFile(editor.document.uri.fsPath);
    if (fromEditor) {
      return fromEditor;
    }
    if (panel.current) {
      return panel.current;
    }
    const pick = await vscode.window.showQuickPick(
      challenges.map((c) => ({
        label: `${progress.isSolved(c.id) ? '$(pass-filled)' : '$(circle-large-outline)'} ${c.title}`,
        description: `${c.topic} · ${c.difficulty}`,
        challenge: c,
      })),
      { placeHolder: tr('Choose a challenge', 'Escolha um desafio') },
    );
    return pick?.challenge;
  }

  async function openChallenge(c: Challenge): Promise<void> {
    void checkJdkForStyle();
    const tq = examFor(c);
    if (tq && !examManager.state(tq.exam.id) && !(await examManager.start(tq.exam))) {
      return;
    }
    await panel.show(c);
    postExamStatus(c);
    await showCodeBeside(ensureCodeFile(c));
  }

  /** Opens the code in the second column, beside the description. */
  async function showCodeBeside(file: string): Promise<vscode.TextEditor> {
    const editor = await vscode.window.showTextDocument(vscode.Uri.file(file), { viewColumn: vscode.ViewColumn.Two, preview: false });
    return (await moveCodeBesideDescription(file)) ?? editor;
  }

  /**
   * Some editors built on VS Code (seen in Cursor) open the code as a tab in the description's
   * column instead of a second one. Move it to a column on the right, which is created if needed.
   */
  async function moveCodeBesideDescription(file: string): Promise<vscode.TextEditor | undefined> {
    const isCode = (t: vscode.Tab) => t.input instanceof vscode.TabInputText && t.input.uri.fsPath === vscode.Uri.file(file).fsPath;
    const isDescription = (t: vscode.Tab) => t.input instanceof vscode.TabInputWebview && t.input.viewType.endsWith('javaChallenge');
    const shared = vscode.window.tabGroups.all.find((g) => g.tabs.some(isCode) && g.tabs.some(isDescription));
    if (!shared || vscode.window.tabGroups.all.some((g) => g !== shared && g.tabs.some(isCode))) {
      return undefined;
    }
    await vscode.window.showTextDocument(vscode.Uri.file(file), { viewColumn: shared.viewColumn, preview: false });
    await vscode.commands.executeCommand('workbench.action.moveEditorToRightGroup');
    return vscode.window.activeTextEditor;
  }

  async function revealCode(c: Challenge, line?: number, column?: number): Promise<void> {
    const editor = await showCodeBeside(ensureCodeFile(c));
    if (line) {
      const pos = new vscode.Position(Math.max(0, line - 1), Math.max(0, column ?? 0));
      editor.selection = new vscode.Selection(pos, pos);
      editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    }
  }

  function updateDiagnostics(file: string, outcome: RunOutcome): void {
    const uri = vscode.Uri.file(file);
    if (outcome.kind !== 'compileError') {
      diagnostics.delete(uri);
      return;
    }
    diagnostics.set(
      uri,
      outcome.errors.map((e) => {
        const pos = new vscode.Position(Math.max(0, e.line - 1), e.column);
        const d = new vscode.Diagnostic(new vscode.Range(pos, pos.translate(0, 1)), e.message, vscode.DiagnosticSeverity.Error);
        d.source = 'javac';
        return d;
      }),
    );
  }

  /** Hidden tests must not leak their input/expected output to the webview. */
  function redact(outcome: RunOutcome): RunOutcome {
    if (outcome.kind !== 'tests') {
      return outcome;
    }
    return {
      ...outcome,
      results: outcome.results.map((r) => (r.hidden ? { ...r, input: '', expected: '', actual: '' } : r)),
    };
  }

  /** The challenge, quiz or test after `c` in the learning path. */
  function nextItem(item: { id: string; topic?: string; unit?: string; subject?: string }): PathItem | undefined {
    return nextInPath(buildPath(challenges, quizzes, lessons, subjectOf(item)), item.id);
  }

  async function openPathItem(item: PathItem): Promise<void> {
    if (item.kind === 'quiz') {
      await quizController.open(item.quiz.id);
    } else if (item.kind === 'lesson') {
      await openLesson(item.lesson);
    } else {
      await openChallenge(item.challenge);
    }
  }

  const itemTitle = pathItemTitle;

  async function openLesson(lesson: LessonDefinition): Promise<void> {
    const next = nextItem(lesson);
    await lessonPanel.show(lesson, {
      read: lessonProgress.isRead(lesson.id),
      next: next && { title: pathItemTitle(next), kind: next.kind },
      requirements: requirementsOf(lesson.requires),
    });
  }

  async function onLessonMessage(type: 'done' | 'next', lesson: LessonDefinition): Promise<void> {
    await lessonProgress.markRead(lesson.id);
    lessonPanel.post({ type: 'read' });
    if (type === 'next') {
      const next = nextItem(lesson);
      if (next) {
        await openPathItem(next);
      }
    }
  }

  async function runChallenge(c: Challenge, mode: 'run' | 'submit'): Promise<void> {
    if (running.has(c.id)) {
      return;
    }
    const tq = examFor(c);
    if (tq) {
      const s = examManager.state(tq.exam.id);
      if (!s) {
        vscode.window.showInformationMessage(tr(`Start "${tq.exam.title}" from the Exams group in the sidebar first.`, `Primeiro comece "${tq.exam.title}" no grupo Provas da barra lateral.`));
        return;
      }
      if (s.finishedAt) {
        vscode.window.showInformationMessage(tr(`"${tq.exam.title}" is finished. Your answers are locked.`, `"${tq.exam.title}" terminou. Suas respostas estão bloqueadas.`));
        return;
      }
      if (mode === 'submit') {
        const left = examManager.submissionsLeft(tq.exam, tq.question.id);
        if (left === 0) {
          vscode.window.showWarningMessage(tr('You have no submissions left for this question.', 'Você não tem mais envios para esta questão.'));
          return;
        }
        const submitLabel = tr('Submit', 'Enviar');
        const ok = await vscode.window.showWarningMessage(
          tr(`Submit your answer to "${c.title}"?`, `Enviar sua resposta para "${c.title}"?`),
          {
            modal: true,
            detail: tr(
              `This uses 1 of your ${left} remaining submission${left === 1 ? '' : 's'} for this question. Your best submission counts.`,
              `Isso usa 1 dos seus ${left} envio${left === 1 ? '' : 's'} restante${left === 1 ? '' : 's'} para esta questão. Vale o seu melhor envio.`,
            ),
          },
          submitLabel,
        );
        if (ok !== submitLabel) {
          return;
        }
      }
    }
    running.add(c.id);
    try {
      const file = ensureCodeFile(c);
      const doc = vscode.workspace.textDocuments.find((d) => d.uri.fsPath === file);
      if (doc?.isDirty) {
        await doc.save();
      }
      await panel.show(c);
      panel.post({ type: 'running', mode });

      const tests = mode === 'run' ? c.tests.filter((t) => !t.hidden) : c.tests;
      const outcome = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Window, title: mode === 'run' ? tr('Running sample tests…', 'Rodando os testes de exemplo…') : tr('Submitting…', 'Enviando…') },
        () =>
          runChallengeCode({
            file,
            tests,
            mustContain: c.mustContain,
            mustNotContain: c.mustNotContain,
            timeLimitMs: c.timeLimitMs,
            javaHome: javaHome(),
          }),
      );

      updateDiagnostics(file, outcome);
      lastOutcome.set(c.id, redact(outcome));
      panel.post({ type: 'result', mode, outcome: redact(outcome) });

      if (outcome.kind === 'toolMissing') {
        await showToolMissing(outcome.message);
        return;
      }

      if (tq) {
        if (mode === 'submit') {
          const score = await examManager.recordSubmission(tq.exam, tq.question, outcome, fs.readFileSync(file, 'utf8'));
          panel.post({ type: 'examScore', ...score, points: tq.question.points });
        }
        postExamStatus(c);
        return; // exam questions don't count towards practice progress
      }

      const allPassed = outcome.kind === 'tests' && outcome.results.every((r) => r.passed);
      const solvedNow = mode === 'submit' && allPassed;
      const firstSolve = solvedNow && !progress.isSolved(c.id);
      await progress.recordAttempt(c.id, solvedNow);
      updateStatus();

      const next = solvedNow ? nextItem(c) : undefined;
      if (solvedNow) {
        panel.post({ type: 'solved', next: next && { title: itemTitle(next), quiz: next.kind === 'quiz' } });
      }
      if (firstSolve) {
        const solved = progress.solvedCount(challenges.map((x) => x.id));
        // Not awaited: the notification can stay open indefinitely and must not block further runs.
        vscode.window
          .showInformationMessage(
            tr(`🎉 "${c.title}" solved! (${solved}/${challenges.length})`, `🎉 "${c.title}" resolvido! (${solved}/${challenges.length})`),
            ...(next ? [tr(`Next: ${itemTitle(next)}`, `Próximo: ${itemTitle(next)}`)] : []),
          )
          .then((choice) => (choice && next ? openPathItem(next) : undefined));
      }
    } catch (e) {
      output.appendLine(`[run] ${(e as Error).stack ?? e}`);
      vscode.window.showErrorMessage(`Sphinx: ${(e as Error).message}`);
    } finally {
      running.delete(c.id);
    }
  }

  async function showToolMissing(message: string): Promise<void> {
    const downloadLabel = tr('Download JDK', 'Baixar o JDK');
    const checkLabel = tr('Check Java Setup', 'Verificar o Java');
    const chooseLabel = tr('Choose JDK Folder…', 'Escolher a pasta do JDK…');
    const choice = await vscode.window.showErrorMessage(message, downloadLabel, checkLabel, chooseLabel);
    if (choice === downloadLabel) {
      vscode.env.openExternal(vscode.Uri.parse('https://adoptium.net/temurin/releases/'));
    } else if (choice === checkLabel) {
      await javaSetup.checkInteractively();
    } else if (choice === chooseLabel) {
      await javaSetup.chooseJdkFolder();
    }
  }

  /**
   * Runs the student's code once with input they typed in the panel. For experimenting: rules
   * are not checked and it does not count as an attempt.
   */
  async function runCustomInput(c: Challenge, input: string): Promise<void> {
    if (running.has(c.id)) {
      return;
    }
    running.add(c.id);
    try {
      const file = ensureCodeFile(c);
      const doc = vscode.workspace.textDocuments.find((d) => d.uri.fsPath === file);
      if (doc?.isDirty) {
        await doc.save();
      }
      panel.post({ type: 'running', mode: 'custom' });
      const outcome = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Window, title: tr('Running with your input…', 'Executando com a sua entrada…') },
        () => runChallengeCode({ file, tests: [{ input, output: '' }], timeLimitMs: c.timeLimitMs, javaHome: javaHome() }),
      );
      updateDiagnostics(file, outcome);
      // When the input is one of the visible examples, we know what the output should be.
      const example = c.tests.find((t) => !t.hidden && normalizeOutput(t.input) === normalizeOutput(input));
      panel.post({ type: 'customResult', outcome, expected: example?.output });
      if (outcome.kind === 'toolMissing') {
        await showToolMissing(outcome.message);
      }
    } catch (e) {
      output.appendLine(`[custom] ${(e as Error).stack ?? e}`);
      vscode.window.showErrorMessage(`Sphinx: ${(e as Error).message}`);
    } finally {
      running.delete(c.id);
    }
  }

  async function resetCode(c: Challenge): Promise<void> {
    const resetLabel = tr('Reset', 'Restaurar');
    const answer = await vscode.window.showWarningMessage(
      tr(`Reset "${c.title}" to the starter code? Your current code will be lost.`, `Restaurar "${c.title}" para o código inicial? Seu código atual será perdido.`),
      { modal: true },
      resetLabel,
    );
    if (answer !== resetLabel) {
      return;
    }
    ensureCodeFile(c);
    await restoreStarter(c);
    await revealCode(c);
  }

  /** Puts the starter code back in a challenge's Main.java, if the student ever opened it. */
  async function restoreStarter(c: Challenge): Promise<boolean> {
    const file = codePath(c);
    const doc = vscode.workspace.textDocuments.find((d) => d.uri.fsPath === file);
    if (doc) {
      const edit = new vscode.WorkspaceEdit();
      edit.replace(doc.uri, new vscode.Range(0, 0, doc.lineCount, 0), starterFor(c));
      await examManager.withoutPasteCheck(() => vscode.workspace.applyEdit(edit));
      await doc.save();
    } else if (!fs.existsSync(file)) {
      return false;
    }
    // Also covers an open editor that hasn't caught up with changes made on disk.
    if (fs.readFileSync(file, 'utf8') !== starterFor(c)) {
      fs.writeFileSync(file, starterFor(c));
    }
    diagnostics.delete(vscode.Uri.file(file));
    return true;
  }

  /** Starter code and no progress, as if the challenge had never been opened. */
  async function resetChallenge(c: Challenge): Promise<void> {
    if (parseExamChallengeId(c.id)) {
      vscode.window.showInformationMessage(tr('Exam questions can\'t be reset.', 'Questões de prova não podem ser restauradas.'));
      return;
    }
    const resetLabel = tr('Reset Challenge', 'Restaurar desafio');
    const answer = await vscode.window.showWarningMessage(
      tr(`Reset "${c.title}"?`, `Restaurar "${c.title}"?`),
      {
        modal: true,
        detail: tr(
          'Your code goes back to the starter code and the challenge\'s progress (solved mark and attempts) is cleared. Your current code will be lost.',
          'Seu código volta para o código inicial e o progresso do desafio (marca de resolvido e tentativas) é apagado. Seu código atual será perdido.',
        ),
      },
      resetLabel,
    );
    if (answer !== resetLabel) {
      return;
    }
    await restoreStarter(c);
    await progress.clear(c.id);
    updateStatus();
    if (panel.current?.id === c.id) {
      await panel.show(c);
    }
  }

  async function resetQuiz(arg: unknown): Promise<void> {
    const id = typeof arg === 'string' ? arg : (arg as { quiz?: QuizDefinition } | undefined)?.quiz?.id;
    const quiz = id ? quizzes.find((q) => q.id === id) : undefined;
    if (!quiz) {
      return;
    }
    const resetLabel = tr('Reset Quiz', 'Restaurar quiz');
    const answer = await vscode.window.showWarningMessage(
      tr(`Reset "${quiz.title}"?`, `Restaurar "${quiz.title}"?`),
      { modal: true, detail: tr('Its best score and attempts are cleared.', 'A melhor nota e as tentativas são apagadas.') },
      resetLabel,
    );
    if (answer !== resetLabel) {
      return;
    }
    await quizProgress.clear(quiz.id);
    if (quizController.isOpen(quiz.id)) {
      await quizController.refresh();
    }
  }

  /** Resets every practice challenge and quiz: progress only, or progress and code. Exams are not touched. */
  async function resetAllChallenges(): Promise<void> {
    const everything = tr('Progress and Code', 'Progresso e código');
    const progressOnly = tr('Progress Only', 'Só o progresso');
    const answer = await vscode.window.showWarningMessage(
      tr('Reset all challenges and quizzes?', 'Restaurar todos os desafios e quizzes?'),
      {
        modal: true,
        detail: tr(
          '"Progress and Code" clears every solved mark, attempt and quiz score, and puts every challenge\'s code back to the starter code: all your code will be lost.\n\n"Progress Only" clears the progress and keeps your code files.\n\nExams are not affected.',
          '"Progresso e código" apaga todas as marcas de resolvido, tentativas e notas de quiz, e volta o código de todos os desafios para o código inicial: todo o seu código será perdido.\n\n"Só o progresso" apaga o progresso e mantém seus arquivos de código.\n\nAs provas não são afetadas.',
        ),
      },
      everything,
      progressOnly,
    );
    if (answer !== everything && answer !== progressOnly) {
      return;
    }
    let restored = 0;
    if (answer === everything) {
      for (const c of challenges) {
        if (await restoreStarter(c)) {
          restored++;
        }
      }
    }
    await progress.reset();
    await quizProgress.reset();
    await lessonProgress.reset();
    updateStatus();
    const current = panel.current;
    if (current && !parseExamChallengeId(current.id)) {
      await panel.show(current);
    }
    vscode.window.showInformationMessage(
      answer === everything
        ? tr(`All progress was reset, and ${plural(restored, ['challenge', 'challenges'], ['desafio', 'desafios'])} went back to the starter code.`, `Todo o progresso foi zerado, e o código de ${plural(restored, ['challenge', 'challenges'], ['desafio', 'desafios'])} voltou para o código inicial.`)
        : tr('All progress was reset. Your code files were kept.', 'Todo o progresso foi zerado. Seus arquivos de código foram mantidos.'),
    );
  }

  async function runChallengeInTerminal(c: Challenge): Promise<void> {
    const file = ensureCodeFile(c);
    const doc = vscode.workspace.textDocuments.find((d) => d.uri.fsPath === file);
    if (doc?.isDirty) {
      await doc.save();
    }
    runInTerminal({
      title: c.title,
      file,
      javaHome: javaHome(),
      onCompiled: (outcome) => updateDiagnostics(file, outcome ?? { kind: 'tests', results: [] }),
    });
  }

  async function askAiHint(c: Challenge): Promise<void> {
    if (!c.aiHints) {
      vscode.window.showInformationMessage(
        examFor(c)
          ? tr('AI hints are turned off during this closed exam.', 'As dicas de IA ficam desativadas nesta prova fechada.')
          : tr('AI hints are disabled for this challenge.', 'As dicas de IA estão desativadas neste desafio.'),
      );
      return;
    }
    await panel.show(c);
    const file = ensureCodeFile(c);
    const doc = vscode.workspace.textDocuments.find((d) => d.uri.fsPath === file);
    const code = doc ? doc.getText() : fs.readFileSync(file, 'utf8');
    await ai.requestHint(c, code, lastOutcome.get(c.id), {
      onStart: (label) => panel.post({ type: 'aiStart', label }),
      onText: (text) => panel.post({ type: 'aiText', text }),
      onDone: () => panel.post({ type: 'aiDone' }),
      onError: (message) => panel.post({ type: 'aiError', message }),
    });
  }

  function handlePanelAction(action: PanelAction, c: Challenge): void {
    switch (action.type) {
      case 'run':
      case 'submit':
        runChallenge(c, action.type);
        break;
      case 'terminal':
        runChallengeInTerminal(c);
        break;
      case 'custom':
        runCustomInput(c, action.input);
        break;
      case 'aiHint':
        askAiHint(c);
        break;
      case 'aiSetup':
        ai.setup();
        break;
      case 'reset':
        resetCode(c);
        break;
      case 'openCode':
        revealCode(c);
        break;
      case 'goto':
        revealCode(c, action.line, action.column);
        break;
      case 'next': {
        const next = nextItem(c);
        if (next) {
          void openPathItem(next);
        }
        break;
      }
    }
  }

  function updateContextKey(): void {
    const editor = vscode.window.activeTextEditor;
    const isChallenge = !!editor && !!challengeForFile(editor.document.uri.fsPath);
    vscode.commands.executeCommand('setContext', 'sphinx.isChallengeFile', isChallenge);
  }

  const authoringDeps = {
    extensionPath: context.extensionPath,
    output,
    challenges: () => challenges,
    lessons: () => lessons,
    subject: () => tree.subject,
    javaHome,
    reload,
  };

  const importDeps = {
    libraryDir: libraryDir(),
    output,
    challenges: () => challenges,
    exams: () => exams,
    quizzes: () => quizzes,
    lessons: () => lessons,
    reload,
  };

  async function resolveExam(arg: unknown, placeHolder: string, filter: (t: ExamDefinition) => boolean): Promise<ExamDefinition | undefined> {
    if (typeof arg === 'string') {
      return exams.find((t) => t.id === arg);
    }
    if (arg && typeof arg === 'object' && 'exam' in (arg as object)) {
      return (arg as { exam: ExamDefinition }).exam;
    }
    const candidates = exams.filter((t) => !t.preview || examManager.state(t.id)).filter(filter);
    if (candidates.length === 0) {
      vscode.window.showInformationMessage(tr('No matching exam.', 'Nenhuma prova encontrada.'));
      return undefined;
    }
    if (candidates.length === 1) {
      return candidates[0];
    }
    const pick = await vscode.window.showQuickPick(
      candidates.map((t) => ({ label: t.title, description: `${t.durationMinutes} min · ${t.mode}`, exam: t })),
      { placeHolder },
    );
    return pick?.exam;
  }

  /** Clears a teacher's preview attempt (state and answers) after asking. Real attempts are never cleared. */
  async function restartPreview(preview: ExamDefinition): Promise<boolean> {
    if (!preview.preview || !preview.id.endsWith(PREVIEW_SUFFIX)) {
      return false;
    }
    const restartLabel = tr('Restart Preview', 'Recomeçar prévia');
    const answer = await vscode.window.showWarningMessage(
      tr(`Restart your preview of "${preview.title}"?`, `Recomeçar sua prévia de "${preview.title}"?`),
      { modal: true, detail: tr('Its answers and score are cleared. Real attempts are not affected.', 'As respostas e a nota dela são apagadas. Tentativas de verdade não são afetadas.') },
      restartLabel,
    );
    if (answer !== restartLabel) {
      return false;
    }
    await examManager.reset(preview);
    fs.rmSync(examCodeDir(preview.id), { recursive: true, force: true });
    teacherTree.refresh();
    return true;
  }

  /** The file to edit for a teacher's own item; built-in content is part of the extension and can't be edited. */
  function ownFile(node: TeacherNode): string | undefined {
    const file = sourceFile(node);
    if (file && origin(file) === 'builtIn') {
      vscode.window.showInformationMessage(
        tr(
          'Built-in content is part of the extension and can\'t be edited: changes would be lost on the next update. You can try it, use it in exams and see its class results.',
          'O conteúdo incluído faz parte da extensão e não pode ser editado: as mudanças se perderiam na próxima atualização. Você pode testá-lo, usá-lo em provas e ver os resultados da turma.',
        ),
      );
      return undefined;
    }
    return file;
  }

  /**
   * Teachers: deletes one of their own exams, challenges, tests, quizzes or lessons. Imported items are removed
   * from the library (a copy); items from the teacher's own folders go to the Trash. Built-in content can't be deleted.
   */
  async function deleteItem(node?: TeacherNode): Promise<void> {
    const item =
      node?.kind === 'exam'
        ? { dir: node.exam.dir, title: node.exam.title }
        : node?.kind === 'challenge'
          ? { dir: node.challenge.dir, title: node.challenge.title }
          : node?.kind === 'quiz'
            ? { dir: node.quiz.dir, title: node.quiz.title }
            : node?.kind === 'lesson'
              ? { dir: node.lesson.dir, title: node.lesson.title }
              : undefined;
    if (!item || origin(item.dir) === 'builtIn') {
      return;
    }
    const imported = origin(item.dir) === 'imported';
    // Exams that use this challenge or quiz by id stop loading without it.
    const usedBy = exams
      .filter((e) => !e.preview && e.dir !== item.dir && e.questions.some((q) => (q.kind === 'quiz' ? q.quiz.dir : q.challenge.dir) === item.dir))
      .map((e) => `"${e.title}"`);
    const detail = [
      imported
        ? tr("It's removed from Sphinx's library. The pack you imported it from isn't changed.", 'Ele é removido da biblioteca do Sphinx. O pacote de onde você o importou não muda.')
        : tr(`Its folder is moved to the Trash:\n${item.dir}`, `A pasta dele vai para a Lixeira:\n${item.dir}`),
      ...(usedBy.length
        ? [tr(`It's a question in ${usedBy.join(', ')}, which won't load until you remove that question.`, `Ele é uma questão de ${usedBy.join(', ')}, que não vai carregar até você remover essa questão.`)]
        : []),
      tr("Students' code and results files are kept.", 'O código e os arquivos de resultado dos alunos são mantidos.'),
    ].join('\n\n');
    const deleteLabel = tr('Delete', 'Excluir');
    const answer = await vscode.window.showWarningMessage(tr(`Delete "${item.title}"?`, `Excluir "${item.title}"?`), { modal: true, detail }, deleteLabel);
    if (answer !== deleteLabel) {
      return;
    }
    try {
      if (imported) {
        fs.rmSync(item.dir, { recursive: true, force: true });
      } else {
        await vscode.workspace.fs.delete(vscode.Uri.file(item.dir), { recursive: true, useTrash: true });
      }
      output.appendLine(`[teacher] deleted ${item.dir}`);
    } catch (e) {
      vscode.window.showErrorMessage(tr(`Could not delete "${item.title}": ${(e as Error).message}`, `Não foi possível excluir "${item.title}": ${(e as Error).message}`));
    }
    reload();
  }

  /** Teachers: re-grade one or more results files and compare with the scores they claim. */
  async function verifyExamResultsCommand(): Promise<void> {
    const files = await vscode.window.showOpenDialog({
      canSelectMany: true,
      filters: { [tr('Exam results', 'Resultado da prova')]: ['json'] },
      openLabel: tr('Verify', 'Verificar'),
      title: tr('Choose the results files your students handed in', 'Escolha os arquivos de resultado que seus alunos entregaram'),
    });
    if (!files?.length) {
      return;
    }
    output.clear();
    output.show(true);
    let mismatches = 0;
    let failed = 0;
    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: tr('Verifying exam results', 'Verificando resultados'), cancellable: false }, async (progress) => {
      for (const f of files) {
        progress.report({ message: path.basename(f.fsPath) });
        try {
          const report = await verifyResults(f.fsPath, exams, javaHome());
          if (!report.matches) {
            mismatches++;
          }
          output.appendLine(`${path.basename(f.fsPath)}`);
          formatVerification(report).forEach((line) => output.appendLine(line));
        } catch (e) {
          failed++;
          output.appendLine(`${path.basename(f.fsPath)}: ✗ ${(e as Error).message}`);
        }
        output.appendLine('');
      }
    });
    const ok = files.length - mismatches - failed;
    const summary = tr(
      `Verified ${files.length} results file(s): ${ok} OK${mismatches ? `, ${mismatches} with a score that doesn't match the code` : ''}${failed ? `, ${failed} unreadable` : ''}. See the "Sphinx" output.`,
      `${files.length} arquivo(s) verificado(s): ${ok} OK${mismatches ? `, ${mismatches} com nota que não confere com o código` : ''}${failed ? `, ${failed} ilegível(is)` : ''}. Veja a saída "Sphinx".`,
    );
    (mismatches || failed ? vscode.window.showWarningMessage : vscode.window.showInformationMessage)(summary);
  }

  const withChallenge = (fn: (c: Challenge) => unknown) => async (arg?: unknown) => {
    const c = await resolveChallenge(arg);
    if (c) {
      await fn(c);
    }
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('sphinx.open', withChallenge(openChallenge)),
    vscode.commands.registerCommand('sphinx.openQuiz', (arg?: unknown) => quizController.open(arg)),
    vscode.commands.registerCommand('sphinx.run', withChallenge((c) => runChallenge(c, 'run'))),
    vscode.commands.registerCommand('sphinx.submit', withChallenge((c) => runChallenge(c, 'submit'))),
    vscode.commands.registerCommand('sphinx.runInTerminal', withChallenge(runChallengeInTerminal)),
    vscode.commands.registerCommand('sphinx.resetCode', withChallenge(resetCode)),
    vscode.commands.registerCommand('sphinx.resetChallenge', withChallenge(resetChallenge)),
    vscode.commands.registerCommand('sphinx.resetQuiz', resetQuiz),
    vscode.commands.registerCommand('sphinx.resetAllChallenges', resetAllChallenges),
    vscode.commands.registerCommand('sphinx.askAiHint', withChallenge(askAiHint)),
    vscode.commands.registerCommand('sphinx.setupAi', () => ai.setup()),
    vscode.commands.registerCommand('sphinx.clearAiKeys', () => ai.clearApiKeys()),
    vscode.commands.registerCommand('sphinx.refresh', reload),
    vscode.commands.registerCommand('sphinx.checkJava', () => javaSetup.checkInteractively()),
    vscode.commands.registerCommand('sphinx.groupBy', async () => {
      const options: { mode: GroupMode; label: string; detail: string }[] = [
        { mode: 'path', label: tr('$(list-tree) Learning path', '$(list-tree) Trilha de aprendizado'), detail: tr('Units in teaching order, each with its quiz and tests (default).', 'Unidades na ordem de ensino, cada uma com seu quiz e testes (padrão).') },
        { mode: 'difficulty', label: tr('$(flame) Difficulty', '$(flame) Dificuldade'), detail: tr('Easy, Medium and Hard, then the quizzes.', 'Fácil, Médio e Difícil, e depois os quizzes.') },
        { mode: 'progress', label: tr('$(pass) Progress', '$(pass) Progresso'), detail: tr('Not started, in progress and solved.', 'Não iniciados, em andamento e resolvidos.') },
      ];
      const pick = await vscode.window.showQuickPick(
        options.map((o) => ({ ...o, description: o.mode === tree.mode ? tr('(current)', '(atual)') : '' })),
        { title: tr('Group challenges by', 'Agrupar desafios por') },
      );
      if (pick) {
        tree.mode = pick.mode;
        await context.globalState.update(GROUP_KEY, pick.mode);
        tree.refresh();
      }
    }),
    vscode.commands.registerCommand('sphinx.openLesson', async (arg?: unknown) => {
      const id = typeof arg === 'string' ? arg : (arg as { lesson?: LessonDefinition } | undefined)?.lesson?.id;
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) {
        await openLesson(lesson);
      }
    }),
    vscode.commands.registerCommand('sphinx.switchSubject', async (arg?: string) => {
      let id = typeof arg === 'string' ? arg : undefined;
      if (!id) {
        const pick = await vscode.window.showQuickPick(
          allSubjects().map((s) => {
            const mine = challenges.filter((c) => subjectOf(c) === s.id);
            return {
              label: `${s.kind === 'theory' ? '$(book)' : '$(code)'} ${subjectTitle(s)}`,
              description: s.id === tree.subject ? tr('(current)', '(atual)') : '',
              detail: `${plural(s.units.length, ['unit', 'units'], ['unidade', 'unidades'])} · ${progress.solvedCount(mine.map((c) => c.id))}/${mine.length} ${tr('challenges solved', 'desafios resolvidos')}`,
              id: s.id,
            };
          }),
          { title: tr('Choose a subject', 'Escolha uma matéria') },
        );
        id = pick?.id;
      }
      if (id && findSubject(id)) {
        tree.subject = id;
        await store.update(SUBJECT_KEY, id);
        tree.refresh();
        updateStatus();
      }
    }),
    vscode.commands.registerCommand('sphinx.copyBlocked', () => examManager.copyBlocked()),
    vscode.commands.registerCommand('sphinx.chooseJdk', () => javaSetup.chooseJdkFolder()),
    vscode.commands.registerCommand('sphinx.startExam', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Which exam do you want to start?', 'Qual prova você quer começar?'), (t) => !examManager.state(t.id));
      if (exam && (await examManager.start(exam))) {
        const first = exam.questions[0];
        await (first.kind === 'quiz' ? quizController.open(first.quiz.id) : openChallenge(first.challenge));
      }
    }),
    vscode.commands.registerCommand('sphinx.retakeExam', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Which exam do you want to take again?', 'Qual prova você quer fazer de novo?'), (t) => examManager.canRetake(t));
      if (exam && (await examManager.start(exam))) {
        const first = exam.questions[0];
        await (first.kind === 'quiz' ? quizController.open(first.quiz.id) : openChallenge(first.challenge));
      }
    }),
    vscode.commands.registerCommand('sphinx.finishExam', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Which exam do you want to finish?', 'Qual prova você quer terminar?'), (t) => examManager.isActive(t.id));
      if (exam) {
        await examManager.confirmFinish(exam);
      }
    }),
    vscode.commands.registerCommand('sphinx.openExamResults', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Results of which exam?', 'Resultado de qual prova?'), (t) => !!examManager.state(t.id)?.finishedAt);
      if (exam) {
        await examManager.openResults(exam);
      }
    }),
    vscode.commands.registerCommand('sphinx.saveExamResults', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Results of which exam?', 'Resultado de qual prova?'), (t) => !!examManager.state(t.id)?.finishedAt);
      if (exam) {
        await examManager.saveResultsCopy(exam);
      }
    }),
    vscode.commands.registerCommand('sphinx.verifyExamResults', verifyExamResultsCommand),
    vscode.commands.registerCommand('sphinx.switchToTeacherView', () => setView('teacher')),
    vscode.commands.registerCommand('sphinx.previewExam', async (node?: { exam?: ExamDefinition }) => {
      const exam = node?.exam;
      if (!exam || exam.preview) {
        return;
      }
      previewing.add(exam.id);
      reload();
      const preview = exams.find((e) => e.id === exam.id + PREVIEW_SUFFIX)!;
      if (examManager.state(preview.id)?.finishedAt && !(await restartPreview(preview))) {
        return;
      }
      if (!examManager.state(preview.id) && !(await examManager.start(preview))) {
        return;
      }
      const first = preview.questions[0];
      const id = examChallengeId(preview.id, first.id);
      await vscode.commands.executeCommand(first.kind === 'quiz' ? 'sphinx.openQuiz' : 'sphinx.open', id);
    }),
    vscode.commands.registerCommand('sphinx.classResults', async (node?: { exam?: ExamDefinition }): Promise<ClassReport | undefined> => {
      const picked = await vscode.window.showOpenDialog({
        title: tr("Class results: choose the folder (or files) with your students' results", 'Resultados da turma: escolha a pasta (ou os arquivos) com os resultados dos alunos'),
        openLabel: tr('Open', 'Abrir'),
        canSelectFiles: true,
        canSelectFolders: true,
        canSelectMany: true,
        filters: { [tr('Exam results', 'Resultados de prova')]: ['json'] },
      });
      if (!picked?.length) {
        return undefined;
      }
      const { results, errors } = readResults(findResultsFiles(picked.map((u) => u.fsPath)));
      if (results.length === 0) {
        vscode.window.showInformationMessage(tr('No exam results files were found there.', 'Nenhum arquivo de resultado de prova foi encontrado ali.'));
        return undefined;
      }
      const found = examsInResults(results);
      let examId = node?.exam && !node.exam.preview ? node.exam.id : undefined;
      if (!examId || !found.some((e) => e.id === examId)) {
        if (examId) {
          vscode.window.showWarningMessage(tr(`None of these files are results of "${node!.exam!.title}".`, `Nenhum destes arquivos é resultado de "${node!.exam!.title}".`));
          return undefined;
        }
        const pick =
          found.length === 1
            ? found[0]
            : await vscode.window.showQuickPick(
                found.map((e) => ({ label: e.title, description: plural(e.count, ['results file', 'results files'], ['arquivo', 'arquivos']), ...e })),
                { title: tr('Which exam?', 'Qual prova?') },
              );
        examId = pick?.id;
      }
      if (!examId) {
        return undefined;
      }
      const report = buildClassReport(results, examId, errors);
      classPanel.show(report);
      return report;
    }),
    vscode.commands.registerCommand('sphinx.exportPack', (node?: TeacherNode) =>
      exportPack({ challenges: () => challenges, quizzes: () => quizzes, exams: () => exams, lessons: () => lessons, origin, extensionPath: context.extensionPath }, node),
    ),
    vscode.commands.registerCommand('sphinx.restartPreview', async (node?: { exam?: ExamDefinition }) => {
      if (node?.exam?.preview) {
        await restartPreview(node.exam);
      }
    }),
    vscode.commands.registerCommand('sphinx.switchToStudentView', () => setView('student')),
    vscode.commands.registerCommand('sphinx.editItem', async (node?: TeacherNode) => {
      const file = node && ownFile(node);
      if (file) {
        await vscode.window.showTextDocument(vscode.Uri.file(file), { preview: false });
      }
    }),
    vscode.commands.registerCommand('sphinx.revealItem', async (node?: TeacherNode) => {
      const file = node && ownFile(node);
      if (file) {
        await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(file));
      }
    }),
    vscode.commands.registerCommand('sphinx.deleteItem', (node?: TeacherNode) => deleteItem(node)),
    vscode.commands.registerCommand('sphinx.createChallenge', () => createChallenge(authoringDeps)),
    vscode.commands.registerCommand('sphinx.createLesson', () => createLesson(authoringDeps)),
    vscode.commands.registerCommand('sphinx.importContent', () => importContent(importDeps)),
    vscode.commands.registerCommand('sphinx.removeImported', () => removeImported(importDeps)),
    vscode.commands.registerCommand('sphinx.validateChallenges', () => validateFolder(authoringDeps)),
    vscode.commands.registerCommand('sphinx.resetProgress', async () => {
      const resetLabel = tr('Reset Progress', 'Zerar progresso');
      const answer = await vscode.window.showWarningMessage(
        tr('Reset progress for all challenges and quizzes? Your code files are kept.', 'Zerar o progresso de todos os desafios e quizzes? Seus arquivos de código são mantidos.'),
        { modal: true },
        resetLabel,
      );
      if (answer === resetLabel) {
        await progress.reset();
        await quizProgress.reset();
        await lessonProgress.reset();
        updateStatus();
      }
    }),
    vscode.window.onDidChangeActiveTextEditor(updateContextKey),
    examManager.onDidChange(() => {
      if (panel.current) {
        postExamStatus(panel.current);
      }
      quizController.refreshExamStatus();
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('sphinx.java')) {
        // A new JDK folder or style: re-check quietly, so the sidebar notice stays accurate.
        clearJavaCache();
        void javaSetup.checkQuietly();
      }
      if (e.affectsConfiguration('sphinx')) {
        const languageChanged = e.affectsConfiguration('sphinx.language');
        setLanguage(config().get<string>('language'));
        reload();
        updateContextKey();
        if (languageChanged) {
          // Show the open challenge and quiz in the new language.
          const current = panel.current && findChallenge(panel.current.id);
          if (current) {
            void panel.show(current).then(() => postExamStatus(current));
          }
          void quizController.refresh();
          const lesson = lessonPanel.current && lessons.find((l) => l.id === lessonPanel.current!.id);
          if (lesson) {
            void openLesson(lesson);
          }
        }
      }
    }),
  );

  setLanguage(config().get<string>('language'));
  reload();
  context.subscriptions.push(javaSetup);
  void javaSetup.checkQuietly();
  updateContextKey();
  return { progress, lessonProgress, lessons: () => lessons, teacherTree, verifyFiles, view: currentView, quizProgress, examManager, tree, challenges: () => challenges, quizzes: () => quizzes, exams: () => exams, codePath, moveCodeBesideDescription };
}

export function deactivate(): void {}

/** Settings that were called techChallenges.* before the rename to Sphynx. */
const TECH_CHALLENGES_SETTINGS = ['java.home', 'java.style', 'codeFolder', 'extraChallengePaths', 'ai.provider', 'ai.model', 'ai.baseUrl', 'ai.responseLanguage'];
/** Settings that were called sphynx.* before the spelling was fixed to Sphinx. */
const SPHYNX_SETTINGS = ['language', ...TECH_CHALLENGES_SETTINGS];

/** Copies old sphynx.* and techChallenges.* settings to sphinx.* once, where the new setting isn't set yet. */
async function migrateLegacySettings(): Promise<void> {
  const current = vscode.workspace.getConfiguration('sphinx');
  const targets: [keyof NonNullable<ReturnType<typeof current.inspect>>, vscode.ConfigurationTarget][] = [
    ['globalValue', vscode.ConfigurationTarget.Global],
    ['workspaceValue', vscode.ConfigurationTarget.Workspace],
  ];
  // The newer name first, so it wins over the older one.
  for (const [section, keys] of [['sphynx', SPHYNX_SETTINGS], ['techChallenges', TECH_CHALLENGES_SETTINGS]] as const) {
    const legacy = vscode.workspace.getConfiguration(section);
    for (const key of keys) {
      const old = legacy.inspect(key);
      for (const [scope, target] of targets) {
        if (old?.[scope] !== undefined && current.inspect(key)?.[scope] === undefined) {
          try {
            await current.update(key, old[scope], target);
          } catch {
            // No workspace open, or the setting can't be written there.
          }
        }
      }
    }
  }
}
