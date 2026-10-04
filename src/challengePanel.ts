import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';

export type PanelAction =
  | { type: 'run' }
  | { type: 'submit' }
  | { type: 'terminal' }
  | { type: 'custom'; input: string }
  | { type: 'aiHint' }
  | { type: 'aiSetup' }
  | { type: 'reset' }
  | { type: 'openCode' }
  | { type: 'goto'; line: number; column: number };

/** Extra information shown when the challenge is a question of a test. */
export interface PanelTestInfo {
  testTitle: string;
  mode: 'open' | 'closed';
  points: number;
  earned: number;
  submissionsLeft: number;
  maxSubmissions: number;
  started: boolean;
  finished: boolean;
}

const ACTIONS = new Set(['run', 'submit', 'terminal', 'custom', 'aiHint', 'aiSetup', 'reset', 'openCode', 'goto']);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function testStatusText(t: PanelTestInfo): string {
  if (!t.started) {
    return 'Start the test from the Tests group in the sidebar to submit answers.';
  }
  const best = `Best so far: ${t.earned} / ${t.points} points.`;
  if (t.finished) {
    return `The test is finished. ${best}`;
  }
  return `${best} ${t.submissionsLeft} of ${t.maxSubmissions} submission${t.maxSubmissions === 1 ? '' : 's'} left. Run (sample tests) is unlimited.`;
}

function nonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function renderMarkdown(md: string): Promise<string> {
  try {
    return await vscode.commands.executeCommand<string>('markdown.api.render', md);
  } catch {
    return `<pre>${escapeHtml(md)}</pre>`;
  }
}

/** The single problem-statement panel, reused as the student moves between challenges. */
export class ChallengePanel {
  private panel: vscode.WebviewPanel | undefined;
  private challenge: Challenge | undefined;
  private ready = false;
  private queue: unknown[] = [];
  /** Returns test details when the challenge belongs to a test. Set by the extension. */
  testInfo: (c: Challenge) => PanelTestInfo | undefined = () => undefined;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly progress: Progress,
    private readonly onAction: (action: PanelAction, challenge: Challenge) => void,
  ) {}

  get current(): Challenge | undefined {
    return this.challenge;
  }

  async show(challenge: Challenge): Promise<void> {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'javaChallenge',
        challenge.title,
        { viewColumn: vscode.ViewColumn.One, preserveFocus: true },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')],
        },
      );
      this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'media', 'logo', 'icon.png');
      this.panel.onDidDispose(() => {
        this.panel = undefined;
        this.challenge = undefined;
      });
      this.panel.webview.onDidReceiveMessage((msg) => {
        if (msg?.type === 'ready') {
          this.ready = true;
          this.queue.forEach((m) => this.panel?.webview.postMessage(m));
          this.queue = [];
        } else if (msg?.type === 'custom' && (typeof msg.input !== 'string' || msg.input.length > 100_000)) {
          vscode.window.showWarningMessage('The custom input is too large (limit: 100,000 characters).');
        } else if (this.challenge && ACTIONS.has(msg?.type)) {
          this.onAction(msg as PanelAction, this.challenge);
        }
      });
    } else {
      this.panel.reveal(undefined, true);
    }

    if (this.challenge?.id === challenge.id) {
      return;
    }
    this.challenge = challenge;
    this.ready = false;
    this.queue = [];
    this.panel.title = challenge.title;
    this.panel.webview.html = await this.render(challenge);
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

  private async render(c: Challenge): Promise<string> {
    const webview = this.panel!.webview;
    const media = (file: string) => webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', file));
    const n = nonce();
    // description.md starts with its own "# Title"; the header above already shows it.
    const description = await renderMarkdown(c.description.replace(/^#\s+.*\n+/, ''));

    const examples = c.tests
      .filter((t) => !t.hidden)
      .map(
        (t, i) => `
        <div class="example">
          <h4>Example ${i + 1}</h4>
          <div class="io">
            <div><div class="label">Input</div><pre>${t.input.trim() ? escapeHtml(t.input.replace(/\n$/, '')) : '<em>(no input)</em>'}</pre></div>
            <div><div class="label">Expected output</div><pre>${escapeHtml(t.output.replace(/\n$/, ''))}</pre></div>
          </div>
        </div>`,
      )
      .join('');

    const visible = c.tests.filter((t) => !t.hidden);
    const customInput = `
    <h3>Try your own input</h3>
    <p class="muted">Run your program with any input you like and see what it prints. Rules and hidden tests are not checked here and it doesn't count as an attempt. Use <strong>Run</strong> and <strong>Submit</strong> for the real tests, or <strong>⌨ Run in Terminal</strong> to type the input while the program runs.</p>
    <textarea id="custom-input" rows="4" spellcheck="false" aria-label="Custom input">${escapeHtml(visible[0]?.input ?? '')}</textarea>
    <div class="custom-buttons">
      <button class="secondary" id="run-custom">▶ Run with this input</button>
      ${visible.map((_, i) => `<button class="link" data-example="${i}">Example ${i + 1}</button>`).join('')}
    </div>
    <script type="application/json" id="example-inputs">${JSON.stringify(visible.map((t) => t.input)).replace(/</g, '\\u003c')}</script>
    <div id="custom-result" aria-live="polite"></div>`;
    const hiddenCount = c.tests.filter((t) => t.hidden).length;
    const requirements = c.mustContain.length + c.mustNotContain.length > 0
      ? `<h3>Requirements</h3><ul class="requirements">${[...c.mustContain, ...c.mustNotContain]
          .map((r) => `<li>${escapeHtml(r.message)}</li>`)
          .join('')}</ul>`
      : '';

    const aiButton = c.aiHints
      ? `<button class="secondary" data-action="aiHint" title="Get a hint about your current code from an AI tutor">✨ Ask AI for a hint</button>
         <button class="link" data-action="aiSetup" title="Choose a local model or your own API key">AI settings</button>`
      : `<span class="muted">AI hints are disabled for this challenge.</span>`;
    const t = this.testInfo(c);
    const hints = t?.mode === 'closed'
      ? `<h3>Hints</h3><p class="muted">Hints and AI hints are turned off during this closed test.</p>`
      : `<h3>Hints</h3>
         ${c.hints.map((h, i) => `<div class="hint" hidden><strong>Hint ${i + 1}:</strong> ${escapeHtml(h)}</div>`).join('')}
         <div id="ai-hint" class="ai-hint" hidden></div>
         <div class="hint-buttons">
           ${c.hints.length ? `<button class="secondary" id="show-hint">Show a hint (${c.hints.length})</button>` : ''}
           ${aiButton}
         </div>`;

    const solved = !t && this.progress.isSolved(c.id);
    const submitLabel = t ? `✔ Submit (${t.submissionsLeft} left)` : '✔ Submit';
    const submitDisabled = t && (t.submissionsLeft === 0 || t.finished || !t.started) ? 'disabled' : '';
    const testBanner = t
      ? `<div id="test-banner" class="banner ${t.finished ? 'success' : 'info'}"><strong>📝 ${escapeHtml(t.testTitle)}</strong> · ${t.mode === 'closed' ? 'Closed test' : 'Open test'}
           <p id="test-status">${testStatusText(t)}</p></div>`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${n}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${media('panel.css')}">
  <title>${escapeHtml(c.title)}</title>
</head>
<body data-challenge="${escapeHtml(c.id)}"${t ? ' data-test="1"' : ''}>
  <header>
    <div class="title-row">
      <h1>${escapeHtml(c.title)}</h1>
      <span id="solved-badge" class="badge solved" ${solved ? '' : 'hidden'}>✓ Solved</span>
    </div>
    <div class="meta">
      <span class="badge topic">${escapeHtml(c.topic)}</span>${t ? `
      <span class="badge">${t.points} points</span>` : ''}
      <span class="badge difficulty ${escapeHtml(c.difficulty.toLowerCase())}">${escapeHtml(c.difficulty)}</span>
    </div>
    <div class="toolbar">
      <button data-action="run" title="Compile and run the sample tests (Cmd/Ctrl+Alt+R)">▶ Run</button>
      <button data-action="submit" class="primary" title="Run all tests, including hidden ones (Cmd/Ctrl+Alt+Enter)" ${submitDisabled}>${submitLabel}</button>
      <button data-action="terminal" class="secondary" title="Run your program in a terminal and type the input yourself">⌨ Run in Terminal</button>
      <span class="spacer"></span>
      <button data-action="openCode" class="secondary">Open code</button>
      <button data-action="reset" class="secondary">Reset code</button>
    </div>
  </header>

  ${testBanner}
  <section id="results" aria-live="polite"></section>

  <main>
    <section class="description">${description}</section>
    ${requirements}
    <h3>Examples</h3>
    ${examples}
    ${hiddenCount ? `<p class="muted">+ ${hiddenCount} hidden test${hiddenCount > 1 ? 's' : ''} run when you submit.</p>` : ''}
    ${customInput}
    ${hints}
    <p class="muted style-note">
      Both Java styles are accepted, because only your program's output is checked. You can write modern Java 25+ with
      <code>void main()</code> and <code>IO.println</code>, or classic Java with <code>public class Main</code> and
      <code>System.out.println</code>. To get classic starter code, set <code>techChallenges.java.style</code> to <code>classic</code>.
    </p>
  </main>

  <script nonce="${n}" src="${media('panel.js')}"></script>
</body>
</html>`;
  }
}
