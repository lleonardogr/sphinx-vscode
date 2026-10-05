import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { AiHints } from './ai/hints';
import { createChallenge, validateFolder } from './authoring';
import { ChallengePanel, PanelAction, PanelExamInfo, examStatusText } from './challengePanel';
import { Challenge, loadChallenges } from './challenges';
import { Progress } from './progress';
import { RunOutcome, javacMajorVersion, normalizeOutput, runChallengeCode } from './runner';
import { runInTerminal } from './terminalRunner';
import { ExamManager } from './examSession';
import { importContent, libraryRoots, removeImported } from './importer';
import { QuizController, QuizProgress } from './quizController';
import { QuizDefinition, loadQuizzes } from './quizzes';
import { PathItem, buildPath, nextInPath } from './path';
import { plural, setLanguage, tr } from './i18n';
import { JavaSetup } from './javaSetup';
import { clearJavaCache } from './runner';
import { formatVerification, verifyResults } from './examVerify';
import { ExamDefinition, ExamQuestion, loadExams, parseExamChallengeId } from './exams';
import { ChallengeNode, ChallengeTreeProvider, GroupMode } from './treeView';

const CODE_FILE = 'Main.java';

/**
 * Until 1.0.0 the extension id was class-plugin.sphynx. VS Code gives the new id an empty storage
 * folder, so bring the old one's imported library and saved solutions along (once, best effort).
 */
function migrateOldStorage(storage: string): void {
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

export function activate(context: vscode.ExtensionContext): void {
  migrateOldStorage(context.globalStorageUri.fsPath);
  const progress = new Progress(context.globalState);
  const output = vscode.window.createOutputChannel('Sphynx');
  const diagnostics = vscode.languages.createDiagnosticCollection('sphynx');
  let challenges: Challenge[] = [];
  let exams: ExamDefinition[] = [];
  let quizzes: QuizDefinition[] = [];
  const quizProgress = new QuizProgress(context.globalState);
  const running = new Set<string>();
  /** Last (redacted) Run/Submit result per challenge, used as context for AI hints. */
  const lastOutcome = new Map<string, RunOutcome>();
  const ai = new AiHints(context);

  const examManager = new ExamManager(context, (examId) => examCodeDir(examId), (exam, q) => gradeExamQuestion(exam, q));
  const javaSetup = new JavaSetup(output, () => javaHome(), () => javaStyle());
  const tree = new ChallengeTreeProvider(() => challenges, progress, () => exams, examManager, () => quizzes, quizProgress, () => javaSetup.problems());
  javaSetup.onDidChange(() => tree.refresh());
  const GROUP_KEY = 'sphynx.groupBy';
  tree.mode = context.globalState.get<GroupMode>(GROUP_KEY, 'path');
  const quizController = new QuizController(context.extensionUri, quizProgress, examManager, () => quizzes, () => exams);
  const treeView = vscode.window.createTreeView('sphynx.list', { treeDataProvider: tree });
  const panel = new ChallengePanel(context.extensionUri, progress, (action, c) => handlePanelAction(action, c));
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.command = 'sphynx.list.focus';
  status.tooltip = tr('Sphynx: open the challenge list', 'Sphynx: abrir a lista de desafios');
  status.show();

  panel.examInfo = (c) => panelExamInfo(c);
  context.subscriptions.push(output, diagnostics, treeView, status, examManager, quizController, { dispose: () => panel.dispose() });

  const config = () => vscode.workspace.getConfiguration('sphynx');
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
    const extra = config().get<string[]>('extraChallengePaths', []);
    const builtIn = [
      ...['challenges', 'custom', 'tests', 'exams', 'quizzes'].map((dir) => path.join(context.extensionPath, dir)),
      ...libraryRoots(libraryDir()),
    ];
    const result = loadChallenges([...builtIn, ...extra]);
    challenges = result.challenges;
    const quizResult = loadQuizzes([...builtIn, ...extra]);
    quizzes = quizResult.quizzes;
    const examResult = loadExams([...builtIn, ...extra], challenges, quizzes);
    exams = examResult.exams;
    const errors = [...result.errors.filter((e) => !e.endsWith('folder not found')), ...quizResult.errors, ...examResult.errors];
    if (errors.length) {
      errors.forEach((e) => output.appendLine(`[challenges] ${e}`));
      vscode.window.showWarningMessage(
        tr('Some challenges, quizzes or exams could not be loaded. See the "Sphynx" output for details.', 'Alguns desafios, quizzes ou provas não puderam ser carregados. Veja os detalhes na saída "Sphynx".'),
      );
    }
    examManager.setExams(exams);
    tree.refresh();
    updateStatus();
  }

  function updateStatus(): void {
    const solved = progress.solvedCount(challenges.map((c) => c.id));
    status.text = `$(mortar-board) ${solved}/${challenges.length} ${tr('solved', 'resolvidos')}`;
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
      // Before the rename to Sphynx, code was saved in tech-challenges/. Keep using it if it exists.
      const legacy = path.join(ws.uri.fsPath, 'tech-challenges');
      const current = path.join(ws.uri.fsPath, 'sphynx');
      return !fs.existsSync(current) && fs.existsSync(legacy) ? legacy : current;
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
    const file = ensureCodeFile(c);
    await vscode.window.showTextDocument(vscode.Uri.file(file), { viewColumn: vscode.ViewColumn.Two, preview: false });
  }

  async function revealCode(c: Challenge, line?: number, column?: number): Promise<void> {
    const file = ensureCodeFile(c);
    const editor = await vscode.window.showTextDocument(vscode.Uri.file(file), { viewColumn: vscode.ViewColumn.Two, preview: false });
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
  function nextItem(c: Challenge): PathItem | undefined {
    return nextInPath(buildPath(challenges, quizzes), c.id);
  }

  async function openPathItem(item: PathItem): Promise<void> {
    await (item.kind === 'quiz' ? quizController.open(item.quiz.id) : openChallenge(item.challenge));
  }

  const itemTitle = (item: PathItem) => (item.kind === 'quiz' ? item.quiz.title : item.challenge.title);

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
      vscode.window.showErrorMessage(`Sphynx: ${(e as Error).message}`);
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
      vscode.window.showErrorMessage(`Sphynx: ${(e as Error).message}`);
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
    vscode.commands.executeCommand('setContext', 'sphynx.isChallengeFile', isChallenge);
  }

  const authoringDeps = {
    extensionPath: context.extensionPath,
    output,
    challenges: () => challenges,
    javaHome,
    reload,
  };

  const importDeps = {
    libraryDir: libraryDir(),
    output,
    challenges: () => challenges,
    exams: () => exams,
    quizzes: () => quizzes,
    reload,
  };

  async function resolveExam(arg: unknown, placeHolder: string, filter: (t: ExamDefinition) => boolean): Promise<ExamDefinition | undefined> {
    if (typeof arg === 'string') {
      return exams.find((t) => t.id === arg);
    }
    if (arg && typeof arg === 'object' && 'exam' in (arg as object)) {
      return (arg as { exam: ExamDefinition }).exam;
    }
    const candidates = exams.filter(filter);
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
      `Verified ${files.length} results file(s): ${ok} OK${mismatches ? `, ${mismatches} with a score that doesn't match the code` : ''}${failed ? `, ${failed} unreadable` : ''}. See the "Sphynx" output.`,
      `${files.length} arquivo(s) verificado(s): ${ok} OK${mismatches ? `, ${mismatches} com nota que não confere com o código` : ''}${failed ? `, ${failed} ilegível(is)` : ''}. Veja a saída "Sphynx".`,
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
    vscode.commands.registerCommand('sphynx.open', withChallenge(openChallenge)),
    vscode.commands.registerCommand('sphynx.openQuiz', (arg?: unknown) => quizController.open(arg)),
    vscode.commands.registerCommand('sphynx.run', withChallenge((c) => runChallenge(c, 'run'))),
    vscode.commands.registerCommand('sphynx.submit', withChallenge((c) => runChallenge(c, 'submit'))),
    vscode.commands.registerCommand('sphynx.runInTerminal', withChallenge(runChallengeInTerminal)),
    vscode.commands.registerCommand('sphynx.resetCode', withChallenge(resetCode)),
    vscode.commands.registerCommand('sphynx.resetChallenge', withChallenge(resetChallenge)),
    vscode.commands.registerCommand('sphynx.resetQuiz', resetQuiz),
    vscode.commands.registerCommand('sphynx.resetAllChallenges', resetAllChallenges),
    vscode.commands.registerCommand('sphynx.askAiHint', withChallenge(askAiHint)),
    vscode.commands.registerCommand('sphynx.setupAi', () => ai.setup()),
    vscode.commands.registerCommand('sphynx.clearAiKeys', () => ai.clearApiKeys()),
    vscode.commands.registerCommand('sphynx.refresh', reload),
    vscode.commands.registerCommand('sphynx.checkJava', () => javaSetup.checkInteractively()),
    vscode.commands.registerCommand('sphynx.groupBy', async () => {
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
    vscode.commands.registerCommand('sphynx.copyBlocked', () => examManager.copyBlocked()),
    vscode.commands.registerCommand('sphynx.chooseJdk', () => javaSetup.chooseJdkFolder()),
    vscode.commands.registerCommand('sphynx.startExam', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Which exam do you want to start?', 'Qual prova você quer começar?'), (t) => !examManager.state(t.id));
      if (exam && (await examManager.start(exam))) {
        const first = exam.questions[0];
        await (first.kind === 'quiz' ? quizController.open(first.quiz.id) : openChallenge(first.challenge));
      }
    }),
    vscode.commands.registerCommand('sphynx.finishExam', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Which exam do you want to finish?', 'Qual prova você quer terminar?'), (t) => examManager.isActive(t.id));
      if (exam) {
        await examManager.confirmFinish(exam);
      }
    }),
    vscode.commands.registerCommand('sphynx.openExamResults', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Results of which exam?', 'Resultado de qual prova?'), (t) => !!examManager.state(t.id)?.finishedAt);
      if (exam) {
        await examManager.openResults(exam);
      }
    }),
    vscode.commands.registerCommand('sphynx.saveExamResults', async (arg?: unknown) => {
      const exam = await resolveExam(arg, tr('Results of which exam?', 'Resultado de qual prova?'), (t) => !!examManager.state(t.id)?.finishedAt);
      if (exam) {
        await examManager.saveResultsCopy(exam);
      }
    }),
    vscode.commands.registerCommand('sphynx.verifyExamResults', verifyExamResultsCommand),
    vscode.commands.registerCommand('sphynx.createChallenge', () => createChallenge(authoringDeps)),
    vscode.commands.registerCommand('sphynx.importContent', () => importContent(importDeps)),
    vscode.commands.registerCommand('sphynx.removeImported', () => removeImported(importDeps)),
    vscode.commands.registerCommand('sphynx.validateChallenges', () => validateFolder(authoringDeps)),
    vscode.commands.registerCommand('sphynx.resetProgress', async () => {
      const resetLabel = tr('Reset Progress', 'Zerar progresso');
      const answer = await vscode.window.showWarningMessage(
        tr('Reset progress for all challenges and quizzes? Your code files are kept.', 'Zerar o progresso de todos os desafios e quizzes? Seus arquivos de código são mantidos.'),
        { modal: true },
        resetLabel,
      );
      if (answer === resetLabel) {
        await progress.reset();
        await quizProgress.reset();
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
      if (e.affectsConfiguration('sphynx.java')) {
        // A new JDK folder or style: re-check quietly, so the sidebar notice stays accurate.
        clearJavaCache();
        void javaSetup.checkQuietly();
      }
      if (e.affectsConfiguration('sphynx')) {
        const languageChanged = e.affectsConfiguration('sphynx.language');
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
        }
      }
    }),
  );

  setLanguage(config().get<string>('language'));
  reload();
  context.subscriptions.push(javaSetup);
  void javaSetup.checkQuietly();
  updateContextKey();
}

export function deactivate(): void {}

/** Settings that were called techChallenges.* before the rename to Sphynx. */
const LEGACY_SETTINGS = ['java.home', 'java.style', 'codeFolder', 'extraChallengePaths', 'ai.provider', 'ai.model', 'ai.baseUrl', 'ai.responseLanguage'];

/** Copies old techChallenges.* settings to sphynx.* once, where the new setting isn't set yet. */
async function migrateLegacySettings(): Promise<void> {
  const legacy = vscode.workspace.getConfiguration('techChallenges');
  const current = vscode.workspace.getConfiguration('sphynx');
  const targets: [keyof NonNullable<ReturnType<typeof legacy.inspect>>, vscode.ConfigurationTarget][] = [
    ['globalValue', vscode.ConfigurationTarget.Global],
    ['workspaceValue', vscode.ConfigurationTarget.Workspace],
  ];
  for (const key of LEGACY_SETTINGS) {
    const old = legacy.inspect(key);
    const now = current.inspect(key);
    for (const [scope, target] of targets) {
      if (old?.[scope] !== undefined && now?.[scope] === undefined) {
        try {
          await current.update(key, old[scope], target);
        } catch {
          // No workspace open, or the setting can't be written there.
        }
      }
    }
  }
}
