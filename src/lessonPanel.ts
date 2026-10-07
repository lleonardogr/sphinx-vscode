// Lessons: the reading panel, and which lessons the student has finished.
import * as vscode from 'vscode';
import { LessonDefinition, READINGS_MARKER, Reading, resolveLessonImages } from './lessons';
import { Requirement, unitName } from './path';
import { requirementsHtml } from './challengePanel';
import { language, tr } from './i18n';

const KEY = 'sphinx.lessons';

/** Lessons the student marked as read. */
export class LessonProgress {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChange = this.changed.event;

  constructor(private readonly state: vscode.Memento) {}

  private all(): Record<string, { readAt: string }> {
    return this.state.get<Record<string, { readAt: string }>>(KEY, {});
  }

  isRead(id: string): boolean {
    return id in this.all();
  }

  async markRead(id: string): Promise<void> {
    if (!this.isRead(id)) {
      await this.state.update(KEY, { ...this.all(), [id]: { readAt: new Date().toISOString() } });
      this.changed.fire();
    }
  }

  async clear(id: string): Promise<void> {
    const all = { ...this.all() };
    if (id in all) {
      delete all[id];
      await this.state.update(KEY, all);
      this.changed.fire();
    }
  }

  async reset(): Promise<void> {
    await this.state.update(KEY, undefined);
    this.changed.fire();
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const TYPE_LABEL: Record<Reading['type'], [string, string]> = { article: ['Article', 'Artigo'], video: ['Video', 'Vídeo'], interactive: ['Interactive', 'Interativo'] };
const TYPE_ICON: Record<Reading['type'], string> = { article: '📄', video: '▶', interactive: '🧩' };
const LANG_NAME: Record<string, [string, string]> = { en: ['English', 'inglês'], 'pt-br': ['Portuguese', 'português'], pt: ['Portuguese', 'português'], es: ['Spanish', 'espanhol'] };

export function readingCount(n: number): string {
  return n === 1 ? tr('1 reading', '1 leitura') : tr(`${n} readings`, `${n} leituras`);
}

/** The reading cards; each button asks the extension to open the reading in the browser. */
function readingsHtml(readings: Reading[]): string {
  if (!readings.length) {
    return '';
  }
  const cards = readings
    .map((r, i) => {
      const lang = LANG_NAME[r.lang.toLowerCase()];
      const meta = [r.source, tr(...TYPE_LABEL[r.type]), r.minutes ? `${r.minutes} min` : '', lang ? tr(...lang) : r.lang].filter(Boolean).map(escapeHtml).join(' · ');
      return `<div class="reading">
        <div class="reading-title"><span class="reading-icon" aria-hidden="true">${TYPE_ICON[r.type]}</span> ${escapeHtml(r.title)}</div>
        <div class="reading-meta">${meta}</div>
        ${r.lookFor ? `<p class="reading-look"><strong>${tr('Look for:', 'Repare em:')}</strong> ${escapeHtml(r.lookFor)}</p>` : ''}
        <button class="secondary" data-open="${i}" title="${escapeHtml(r.url)}">${tr('Open in the browser ↗', 'Abrir no navegador ↗')}</button>
      </div>`;
    })
    .join('');
  return `<section class="readings">
    <h2>${tr('Read and watch', 'Leia e assista')}</h2>
    <p class="muted">${tr('These open in your browser and need the internet. The summary above works offline.', 'Elas abrem no navegador e precisam de internet. O resumo acima funciona sem internet.')}</p>
    ${cards}
  </section>`;
}

function nonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export type LessonMessage = { type: 'done' } | { type: 'next' } | { type: 'open'; index: number };

export interface LessonView {
  read: boolean;
  /** The next item in the learning path, for the button at the end. */
  next?: { title: string; kind: 'lesson' | 'challenge' | 'quiz' };
  requirements: Requirement[];
}

/** The single lesson panel, reused as the student moves between lessons. */
export class LessonPanel {
  private panel: vscode.WebviewPanel | undefined;
  private lesson: LessonDefinition | undefined;

  constructor(
    private readonly extensionUri: vscode.Uri,
    /** "Mark as read" and "Next"; the panel opens readings itself. */
    private readonly onMessage: (msg: { type: 'done' | 'next' }, lesson: LessonDefinition) => void,
  ) {}

  get current(): LessonDefinition | undefined {
    return this.lesson;
  }

  async show(lesson: LessonDefinition, view: LessonView): Promise<void> {
    const roots = [vscode.Uri.joinPath(this.extensionUri, 'media'), vscode.Uri.file(lesson.dir)];
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel('sphinxLesson', lesson.title, vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true, localResourceRoots: roots });
      this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'media', 'logo', 'icon.png');
      this.panel.onDidDispose(() => {
        this.panel = undefined;
        this.lesson = undefined;
      });
      this.panel.webview.onDidReceiveMessage((msg: LessonMessage) => {
        if (this.lesson && (msg?.type === 'done' || msg?.type === 'next')) {
          this.onMessage(msg, this.lesson);
        } else if (this.lesson && msg?.type === 'open') {
          // Only the lesson's own readings can be opened, by their position.
          const reading = this.lesson.readings[msg.index];
          if (reading) {
            void vscode.env.openExternal(vscode.Uri.parse(reading.url));
          }
        }
      });
    } else {
      // Images are loaded from the lesson's folder, so allow the new one.
      this.panel.webview.options = { enableScripts: true, localResourceRoots: roots };
      this.panel.reveal(undefined, false);
    }
    this.lesson = lesson;
    this.panel.title = lesson.title;
    this.panel.webview.html = await this.render(lesson, view);
  }

  /** Updates the footer after the lesson was marked as read, without reloading the page. */
  post(message: unknown): void {
    void this.panel?.webview.postMessage(message);
  }

  dispose(): void {
    this.panel?.dispose();
  }

  private async render(lesson: LessonDefinition, view: LessonView): Promise<string> {
    const webview = this.panel!.webview;
    const media = (file: string) => webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', file));
    const n = nonce();
    const markdown = async (text: string): Promise<string> => {
      let html: string;
      try {
        html = await vscode.commands.executeCommand<string>('markdown.api.render', text);
      } catch {
        html = `<pre>${escapeHtml(text)}</pre>`;
      }
      return resolveLessonImages(html, lesson.dir, (file) => webview.asWebviewUri(vscode.Uri.file(file)).toString());
    };
    // A reading guide: the "In short" text, the reading cards (where lesson.md has the marker), then the rest.
    const [before, after = ''] = lesson.body.split(READINGS_MARKER);
    const body = (await markdown(before)) + readingsHtml(lesson.readings) + (after.trim() ? await markdown(after) : '');
    const objectives = lesson.objectives.length
      ? `<section class="objectives"><h2>${tr('After this unit you can', 'Depois desta unidade você consegue')}</h2><ul>${lesson.objectives.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul></section>`
      : '';
    const needs = requirementsHtml(view.requirements);
    const nextLabel = view.next
      ? `${view.next.kind === 'quiz' ? tr('Next: quiz', 'Próximo: quiz') : view.next.kind === 'lesson' ? tr('Next lesson', 'Próxima lição') : tr('Next: challenge', 'Próximo: desafio')} · ${escapeHtml(view.next.title)} →`
      : '';
    return `<!DOCTYPE html>
<html lang="${language() === 'pt-br' ? 'pt-BR' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${n}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${media('panel.css')}">
  <link rel="stylesheet" href="${media('lesson.css')}">
  <title>${escapeHtml(lesson.title)}</title>
</head>
<body data-lang="${language()}">
  <header>
    <div class="title-row"><h1>${escapeHtml(lesson.title)}</h1><span id="read-badge" class="badge solved" ${view.read ? '' : 'hidden'}>${tr('✓ Read', '✓ Lida')}</span></div>
    <div class="meta">
      <span class="badge topic">${tr('Lesson', 'Lição')}</span>${lesson.topic ? `<span class="badge">${escapeHtml(unitName(lesson.topic))}</span>` : ''}
      <span class="badge">${tr(`${lesson.minutes} min read`, `${lesson.minutes} min de leitura`)}</span>${lesson.readings.length ? `<span class="badge">${readingCount(lesson.readings.length)}</span>` : ''}
    </div>
    ${needs}
  </header>
  <main class="lesson">
    ${objectives}
    <article class="description">${body}</article>
    <footer class="lesson-footer">
      <button class="primary" id="done" ${view.read ? 'hidden' : ''}>${tr('✓ Mark as read', '✓ Marcar como lida')}</button>
      ${view.next ? `<button class="${view.read ? 'primary' : 'secondary'}" id="next">${nextLabel}</button>` : ''}
    </footer>
  </main>
  <script nonce="${n}" src="${media('lesson.js')}"></script>
</body>
</html>`;
  }
}
