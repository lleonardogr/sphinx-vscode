import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';
import { Requirement, TESTS_TOPIC, unitName } from './path';
import { difficultyName, language, tr } from './i18n';

export type PanelAction =
  | { type: 'run' }
  | { type: 'submit' }
  | { type: 'terminal' }
  | { type: 'custom'; input: string }
  | { type: 'aiHint' }
  | { type: 'aiSetup' }
  | { type: 'reset' }
  | { type: 'openCode' }
  | { type: 'next' }
  | { type: 'goto'; line: number; column: number };

/** Extra information shown when the challenge is a question of an exam. */
export interface PanelExamInfo {
  examTitle: string;
  mode: 'open' | 'closed';
  points: number;
  earned: number;
  submissionsLeft: number;
  maxSubmissions: number;
  started: boolean;
  finished: boolean;
  /** Copying is blocked during this exam (exam.json restrictions). */
  noCopy?: boolean;
}

const ACTIONS = new Set(['run', 'submit', 'terminal', 'custom', 'aiHint', 'aiSetup', 'reset', 'openCode', 'goto', 'next']);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function examStatusText(t: PanelExamInfo): string {
  if (!t.started) {
    return tr('Start the exam from the Exams group in the sidebar to submit answers.', 'Comece a prova no grupo Provas da barra lateral para enviar respostas.');
  }
  const best = tr(`Best so far: ${t.earned} / ${t.points} points.`, `Melhor até agora: ${t.earned} / ${t.points} pontos.`);
  if (t.finished) {
    return tr(`The exam is finished. ${best}`, `A prova terminou. ${best}`);
  }
  return tr(
    `${best} ${t.submissionsLeft} of ${t.maxSubmissions} submission${t.maxSubmissions === 1 ? '' : 's'} left. Run (sample tests) is unlimited.`,
    `${best} Restam ${t.submissionsLeft} de ${t.maxSubmissions} envio${t.maxSubmissions === 1 ? '' : 's'}. Executar (testes de exemplo) é ilimitado.`,
  );
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
  /** Returns exam details when the challenge belongs to an exam. Set by the extension. */
  examInfo: (c: Challenge) => PanelExamInfo | undefined = () => undefined;
  /** The units a challenge needs, with the student's progress in each (set by the extension). */
  requirements: (c: Challenge) => Requirement[] = () => [];

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

    if (this.challenge?.id === challenge.id && this.challenge === challenge) {
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
          <h4>${tr('Example', 'Exemplo')} ${i + 1}</h4>
          <div class="io">
            <div><div class="label">${tr('Input', 'Entrada')}</div><pre>${t.input.trim() ? escapeHtml(t.input.replace(/\n$/, '')) : `<em>${tr('(no input)', '(sem entrada)')}</em>`}</pre></div>
            <div><div class="label">${tr('Expected output', 'Saída esperada')}</div><pre>${escapeHtml(t.output.replace(/\n$/, ''))}</pre></div>
          </div>
        </div>`,
      )
      .join('');

    const visible = c.tests.filter((t) => !t.hidden);
    const customInput = `
    <h3>${tr('Try your own input', 'Teste com sua própria entrada')}</h3>
    <p class="muted">${tr(
      "Run your program with any input you like and see what it prints. Rules and hidden tests are not checked here and it doesn't count as an attempt. Use <strong>Run</strong> and <strong>Submit</strong> for the real tests, or <strong>⌨ Run in Terminal</strong> to type the input while the program runs.",
      'Execute seu programa com a entrada que quiser e veja o que ele imprime. Aqui as regras e os testes ocultos não são verificados, e não conta como tentativa. Use <strong>Executar</strong> e <strong>Enviar</strong> para os testes de verdade, ou <strong>⌨ Executar no terminal</strong> para digitar a entrada enquanto o programa roda.',
    )}</p>
    <textarea id="custom-input" rows="4" spellcheck="false" aria-label="${tr('Custom input', 'Entrada personalizada')}">${escapeHtml(visible[0]?.input ?? '')}</textarea>
    <div class="custom-buttons">
      <button class="secondary" id="run-custom">${tr('▶ Run with this input', '▶ Executar com esta entrada')}</button>
      ${visible.map((_, i) => `<button class="link" data-example="${i}">${tr('Example', 'Exemplo')} ${i + 1}</button>`).join('')}
    </div>
    <script type="application/json" id="example-inputs">${JSON.stringify(visible.map((t) => t.input)).replace(/</g, '\\u003c')}</script>
    <div id="custom-result" aria-live="polite"></div>`;
    const hiddenCount = c.tests.filter((t) => t.hidden).length;
    const requirements = c.mustContain.length + c.mustNotContain.length > 0
      ? `<h3>${tr('Requirements', 'Requisitos')}</h3><ul class="requirements">${[...c.mustContain, ...c.mustNotContain]
          .map((r) => `<li>${escapeHtml(r.message)}</li>`)
          .join('')}</ul>`
      : '';

    const aiButton = c.aiHints
      ? `<button class="secondary" data-action="aiHint" title="${tr('Get a hint about your current code from an AI tutor', 'Receba uma dica sobre o seu código de um tutor de IA')}">${tr('✨ Ask AI for a hint', '✨ Pedir uma dica à IA')}</button>
         <button class="link" data-action="aiSetup" title="${tr('Choose a local model or your own API key', 'Escolha um modelo local ou sua própria chave de API')}">${tr('AI settings', 'Configurar IA')}</button>`
      : `<span class="muted">${tr('AI hints are disabled for this challenge.', 'As dicas de IA estão desativadas neste desafio.')}</span>`;
    const t = this.examInfo(c);
    const hints = t?.mode === 'closed'
      ? `<h3>${tr('Hints', 'Dicas')}</h3><p class="muted">${tr('Hints and AI hints are turned off during this closed exam.', 'As dicas e as dicas de IA ficam desativadas nesta prova fechada.')}</p>`
      : `<h3>${tr('Hints', 'Dicas')}</h3>
         ${c.hints.map((h, i) => `<div class="hint" hidden><strong>${tr('Hint', 'Dica')} ${i + 1}:</strong> ${escapeHtml(h)}</div>`).join('')}
         <div id="ai-hint" class="ai-hint" hidden></div>
         <div class="hint-buttons">
           ${c.hints.length ? `<button class="secondary" id="show-hint">${tr('Show a hint', 'Mostrar uma dica')} (${c.hints.length})</button>` : ''}
           ${aiButton}
         </div>`;

    const solved = !t && this.progress.isSolved(c.id);
    const submitLabel = t ? tr(`✔ Submit (${t.submissionsLeft} left)`, `✔ Enviar (restam ${t.submissionsLeft})`) : tr('✔ Submit', '✔ Enviar');
    const submitDisabled = t && (t.submissionsLeft === 0 || t.finished || !t.started) ? 'disabled' : '';
    const examBanner = t
      ? `<div id="exam-banner" class="banner ${t.finished ? 'success' : 'info'}"><strong>📝 ${escapeHtml(t.examTitle)}</strong> · ${t.mode === 'closed' ? tr('Closed exam', 'Prova fechada') : tr('Open exam', 'Prova aberta')}
           <p id="exam-status">${examStatusText(t)}</p></div>`
      : '';

    return `<!DOCTYPE html>
<html lang="${language() === 'pt-br' ? 'pt-BR' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${n}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${media('panel.css')}">
  <title>${escapeHtml(c.title)}</title>
</head>
<body data-challenge="${escapeHtml(c.id)}" data-lang="${language()}"${t ? ' data-exam="1"' : ''}${t?.noCopy && t.started && !t.finished ? ' data-nocopy="1"' : ''}>
  <header>
    <div class="title-row">
      <h1>${escapeHtml(c.title)}</h1>
      <span id="solved-badge" class="badge solved" ${solved ? '' : 'hidden'}>${tr('✓ Solved', '✓ Resolvido')}</span>
    </div>
    <div class="meta">
      <span class="badge topic">${escapeHtml(c.topic === TESTS_TOPIC ? tr('Test', 'Teste') : unitName(c.topic))}</span>${t ? `
      <span class="badge">${t.points} ${tr('points', 'pontos')}</span>` : ''}
      <span class="badge difficulty ${escapeHtml(c.difficulty.toLowerCase())}">${escapeHtml(difficultyName(c.difficulty))}</span>${c.skills.length ? `
      <span class="skills" title="${tr('Topics this challenge combines', 'Assuntos que este desafio combina')}">${tr('Mixes', 'Combina')}: ${c.skills.map((s) => `<span class="badge skill">${escapeHtml(unitName(s))}</span>`).join('')}</span>` : ''}
    </div>${requirementsHtml(t ? [] : this.requirements(c))}
    <div class="toolbar">
      <button data-action="run" title="${tr('Compile and run the sample tests (Cmd/Ctrl+Alt+R)', 'Compilar e executar os testes de exemplo (Cmd/Ctrl+Alt+R)')}">${tr('▶ Run', '▶ Executar')}</button>
      <button data-action="submit" class="primary" title="${tr('Run all tests, including hidden ones (Cmd/Ctrl+Alt+Enter)', 'Executar todos os testes, inclusive os ocultos (Cmd/Ctrl+Alt+Enter)')}" ${submitDisabled}>${submitLabel}</button>
      <button data-action="terminal" class="secondary" title="${tr('Run your program in a terminal and type the input yourself', 'Executar o programa em um terminal e digitar a entrada você mesmo')}">${tr('⌨ Run in Terminal', '⌨ Executar no terminal')}</button>
      <span class="spacer"></span>
      <button data-action="openCode" class="secondary">${tr('Open code', 'Abrir código')}</button>
      <button data-action="reset" class="secondary">${tr('Reset code', 'Restaurar código')}</button>
    </div>
  </header>

  ${examBanner}
  <section id="results" aria-live="polite"></section>

  <main>
    <section class="description">${description}</section>
    ${requirements}
    <h3>${tr('Examples', 'Exemplos')}</h3>
    ${examples}
    ${hiddenCount ? `<p class="muted">${tr(`+ ${hiddenCount} hidden test${hiddenCount > 1 ? 's' : ''} run when you submit.`, `+ ${hiddenCount} teste${hiddenCount > 1 ? 's' : ''} oculto${hiddenCount > 1 ? 's' : ''} ao enviar.`)}</p>` : ''}
    ${customInput}
    ${hints}
    <p class="muted style-note">${tr(
      "Both Java styles are accepted, because only your program's output is checked. You can write modern Java 25+ with <code>void main()</code> and <code>IO.println</code>, or classic Java with <code>public class Main</code> and <code>System.out.println</code>. To get classic starter code, set <code>sphynx.java.style</code> to <code>classic</code>.",
      'Os dois estilos de Java são aceitos, porque só a saída do programa é verificada. Você pode escrever Java moderno (25+) com <code>void main()</code> e <code>IO.println</code>, ou Java clássico com <code>public class Main</code> e <code>System.out.println</code>. Para receber o código inicial clássico, defina <code>sphynx.java.style</code> como <code>classic</code>.',
    )}</p>
  </main>

  <script nonce="${n}" src="${media('panel.js')}"></script>
</body>
</html>`;
  }
}

/** "Needs: Java Programming · Loops · 4/12" badges under the title; green when the unit is done. */
export function requirementsHtml(reqs: Requirement[]): string {
  if (!reqs.length) {
    return '';
  }
  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `
    <p class="prerequisites">${tr('Needs', 'Precisa de')}: ${reqs
      .map(
        (r) =>
          `<span class="badge${r.total && r.solved === r.total ? ' done' : ''}" title="${tr(`${r.solved} of ${r.total} challenges solved`, `${r.solved} de ${r.total} desafios resolvidos`)}">${esc(r.label)}${r.total ? ` · ${r.solved}/${r.total}` : ''}</span>`,
      )
      .join(' ')}</p>`;
}
