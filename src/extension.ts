import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ChallengePanel, PanelAction } from './challengePanel';
import { Challenge, loadChallenges } from './challenges';
import { Progress } from './progress';
import { RunOutcome, runChallengeCode } from './runner';
import { ChallengeNode, ChallengeTreeProvider } from './treeView';

const CODE_FILE = 'Main.java';

export function activate(context: vscode.ExtensionContext): void {
  const progress = new Progress(context.globalState);
  const output = vscode.window.createOutputChannel('Java Challenges');
  const diagnostics = vscode.languages.createDiagnosticCollection('javaChallenges');
  let challenges: Challenge[] = [];
  const running = new Set<string>();

  const tree = new ChallengeTreeProvider(() => challenges, progress);
  const treeView = vscode.window.createTreeView('javaChallenges.list', { treeDataProvider: tree });
  const panel = new ChallengePanel(context.extensionUri, progress, (action, c) => handlePanelAction(action, c));
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.command = 'javaChallenges.list.focus';
  status.tooltip = 'Java Challenges: open the challenge list';
  status.show();

  context.subscriptions.push(output, diagnostics, treeView, status, { dispose: () => panel.dispose() });

  const config = () => vscode.workspace.getConfiguration('javaChallenges');

  function reload(): void {
    const extra = config().get<string[]>('extraChallengePaths', []);
    const result = loadChallenges([path.join(context.extensionPath, 'challenges'), ...extra]);
    challenges = result.challenges;
    if (result.errors.length) {
      result.errors.forEach((e) => output.appendLine(`[challenges] ${e}`));
      vscode.window.showWarningMessage('Some challenges could not be loaded. See the "Java Challenges" output for details.');
    }
    tree.refresh();
    updateStatus();
  }

  function updateStatus(): void {
    const solved = progress.solvedCount(challenges.map((c) => c.id));
    status.text = `$(coffee) ${solved}/${challenges.length} solved`;
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
      return path.join(ws.uri.fsPath, 'java-challenges');
    }
    return path.join(context.globalStorageUri.fsPath, 'solutions');
  }

  function codePath(c: Challenge): string {
    return path.join(codeRoot(), c.id, CODE_FILE);
  }

  function challengeForFile(file: string): Challenge | undefined {
    if (path.basename(file) !== CODE_FILE) {
      return undefined;
    }
    const rel = path.relative(codeRoot(), path.dirname(file));
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel) || rel.includes(path.sep)) {
      return undefined;
    }
    return challenges.find((c) => c.id === rel);
  }

  function ensureCodeFile(c: Challenge): string {
    const file = codePath(c);
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, c.starterCode);
    }
    return file;
  }

  /** Accepts a challenge id (tree click), a tree node (context menu), or nothing (current/active/quick pick). */
  async function resolveChallenge(arg: unknown): Promise<Challenge | undefined> {
    if (typeof arg === 'string') {
      return challenges.find((c) => c.id === arg);
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
      { placeHolder: 'Choose a challenge' },
    );
    return pick?.challenge;
  }

  async function openChallenge(c: Challenge): Promise<void> {
    await panel.show(c);
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

  function nextUnsolved(after: Challenge): Challenge | undefined {
    const i = challenges.findIndex((c) => c.id === after.id);
    const ordered = [...challenges.slice(i + 1), ...challenges.slice(0, i)];
    return ordered.find((c) => !progress.isSolved(c.id));
  }

  async function runChallenge(c: Challenge, mode: 'run' | 'submit'): Promise<void> {
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
      await panel.show(c);
      panel.post({ type: 'running', mode });

      const tests = mode === 'run' ? c.tests.filter((t) => !t.hidden) : c.tests;
      const outcome = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Window, title: mode === 'run' ? 'Running sample tests…' : 'Submitting…' },
        () =>
          runChallengeCode({
            file,
            tests,
            mustContain: c.mustContain,
            mustNotContain: c.mustNotContain,
            timeLimitMs: c.timeLimitMs,
            javaHome: config().get<string>('javaHome', '').trim() || undefined,
          }),
      );

      updateDiagnostics(file, outcome);
      panel.post({ type: 'result', mode, outcome: redact(outcome) });

      if (outcome.kind === 'toolMissing') {
        const choice = await vscode.window.showErrorMessage(outcome.message, 'Download JDK', 'Open Settings');
        if (choice === 'Download JDK') {
          vscode.env.openExternal(vscode.Uri.parse('https://adoptium.net/temurin/releases/'));
        } else if (choice === 'Open Settings') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'javaChallenges.javaHome');
        }
        return;
      }

      const allPassed = outcome.kind === 'tests' && outcome.results.every((r) => r.passed);
      const solvedNow = mode === 'submit' && allPassed;
      const firstSolve = solvedNow && !progress.isSolved(c.id);
      await progress.recordAttempt(c.id, solvedNow);
      updateStatus();

      if (solvedNow) {
        panel.post({ type: 'solved' });
      }
      if (firstSolve) {
        const next = nextUnsolved(c);
        const solved = progress.solvedCount(challenges.map((x) => x.id));
        // Not awaited: the notification can stay open indefinitely and must not block further runs.
        vscode.window
          .showInformationMessage(`🎉 "${c.title}" solved! (${solved}/${challenges.length})`, ...(next ? [`Next: ${next.title}`] : []))
          .then((choice) => (choice && next ? openChallenge(next) : undefined));
      }
    } catch (e) {
      output.appendLine(`[run] ${(e as Error).stack ?? e}`);
      vscode.window.showErrorMessage(`Java Challenges: ${(e as Error).message}`);
    } finally {
      running.delete(c.id);
    }
  }

  async function resetCode(c: Challenge): Promise<void> {
    const answer = await vscode.window.showWarningMessage(
      `Reset "${c.title}" to the starter code? Your current code will be lost.`,
      { modal: true },
      'Reset',
    );
    if (answer !== 'Reset') {
      return;
    }
    const file = ensureCodeFile(c);
    const doc = vscode.workspace.textDocuments.find((d) => d.uri.fsPath === file);
    if (doc) {
      const edit = new vscode.WorkspaceEdit();
      edit.replace(doc.uri, new vscode.Range(0, 0, doc.lineCount, 0), c.starterCode);
      await vscode.workspace.applyEdit(edit);
      await doc.save();
    } else {
      fs.writeFileSync(file, c.starterCode);
    }
    diagnostics.delete(vscode.Uri.file(file));
    await revealCode(c);
  }

  function handlePanelAction(action: PanelAction, c: Challenge): void {
    switch (action.type) {
      case 'run':
      case 'submit':
        runChallenge(c, action.type);
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
    }
  }

  function updateContextKey(): void {
    const editor = vscode.window.activeTextEditor;
    const isChallenge = !!editor && !!challengeForFile(editor.document.uri.fsPath);
    vscode.commands.executeCommand('setContext', 'javaChallenges.isChallengeFile', isChallenge);
  }

  const withChallenge = (fn: (c: Challenge) => unknown) => async (arg?: unknown) => {
    const c = await resolveChallenge(arg);
    if (c) {
      await fn(c);
    }
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('javaChallenges.open', withChallenge(openChallenge)),
    vscode.commands.registerCommand('javaChallenges.run', withChallenge((c) => runChallenge(c, 'run'))),
    vscode.commands.registerCommand('javaChallenges.submit', withChallenge((c) => runChallenge(c, 'submit'))),
    vscode.commands.registerCommand('javaChallenges.resetCode', withChallenge(resetCode)),
    vscode.commands.registerCommand('javaChallenges.refresh', reload),
    vscode.commands.registerCommand('javaChallenges.resetProgress', async () => {
      const answer = await vscode.window.showWarningMessage(
        'Reset progress for all challenges? Your code files are kept.',
        { modal: true },
        'Reset Progress',
      );
      if (answer === 'Reset Progress') {
        await progress.reset();
        updateStatus();
      }
    }),
    vscode.window.onDidChangeActiveTextEditor(updateContextKey),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('javaChallenges')) {
        reload();
        updateContextKey();
      }
    }),
  );

  reload();
  updateContextKey();
}

export function deactivate(): void {}
