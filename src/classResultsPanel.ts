// The class results dashboard: one table for the results files a class handed in for an exam.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ClassReport, toCsv } from './classResults';
import { formatDuration } from './examSession';
import { language, plural, tr } from './i18n';

export type ClassResultsMessage = { type: 'exportCsv' } | { type: 'verify' } | { type: 'open'; file: string };

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function nonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ''));

export class ClassResultsPanel {
  private panel: vscode.WebviewPanel | undefined;
  private report: ClassReport | undefined;

  constructor(
    private readonly extensionUri: vscode.Uri,
    /** Re-grades the files; returns, per file, whether the claimed score matches. */
    private readonly verify: (files: string[]) => Promise<{ file: string; matches: boolean; recomputed?: number; error?: string }[]>,
  ) {}

  get current(): ClassReport | undefined {
    return this.report;
  }

  show(report: ClassReport): void {
    this.report = report;
    const title = tr(`Class results: ${report.examTitle}`, `Resultados da turma: ${report.examTitle}`);
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel('sphinxClassResults', title, vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')],
      });
      this.panel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'media', 'logo', 'icon.png');
      this.panel.onDidDispose(() => {
        this.panel = undefined;
        this.report = undefined;
      });
      this.panel.webview.onDidReceiveMessage((msg: ClassResultsMessage) => void this.onMessage(msg));
    } else {
      this.panel.reveal();
    }
    this.panel.title = title;
    this.panel.webview.html = this.render(report);
  }

  dispose(): void {
    this.panel?.dispose();
  }

  private async onMessage(msg: ClassResultsMessage): Promise<void> {
    const report = this.report;
    if (!report) {
      return;
    }
    if (msg.type === 'open' && report.rows.some((r) => r.file === msg.file)) {
      await vscode.window.showTextDocument(vscode.Uri.file(msg.file), { preview: true });
    } else if (msg.type === 'exportCsv') {
      const slug = report.examTitle.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'results';
      const folder = path.dirname(report.rows[0]?.file ?? '') || undefined;
      const target = await vscode.window.showSaveDialog({
        title: tr('Export the class results', 'Exportar os resultados da turma'),
        defaultUri: folder ? vscode.Uri.file(path.join(folder, `${slug}-results.csv`)) : undefined,
        filters: { CSV: ['csv'] },
      });
      if (target) {
        fs.writeFileSync(target.fsPath, toCsv(report));
        vscode.window.showInformationMessage(tr(`Saved ${path.basename(target.fsPath)}.`, `${path.basename(target.fsPath)} salvo.`));
      }
    } else if (msg.type === 'verify') {
      void this.panel?.webview.postMessage({ type: 'verifying' });
      const results = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: tr('Verifying the results files…', 'Verificando os arquivos de resultado…') },
        () => this.verify(report.rows.map((r) => r.file)),
      );
      void this.panel?.webview.postMessage({ type: 'verified', results });
    }
  }

  private render(r: ClassReport): string {
    const webview = this.panel!.webview;
    const media = (file: string) => webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', file));
    const n = nonce();
    const pct = (earned: number, points: number) => (points ? Math.round((100 * earned) / points) : 0);
    const level = (p: number) => (p >= 80 ? 'good' : p >= 50 ? 'mid' : 'low');
    const stat = (label: string, value: string) => `<div class="stat"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
    const ended = { student: tr('Submitted', 'Entregou'), time: tr('Time up', 'Tempo esgotado'), away: tr('Away too long', 'Saiu demais') };
    const warningText = (w: ClassReport['rows'][number]['warnings']) =>
      [
        w.paste && `${w.paste} ${tr('paste', 'colagem')}`,
        w.copy && `${w.copy} ${tr('copy', 'cópia')}`,
        w.away && `${w.away} ${tr('away', 'saída')}`,
        w.copilot && 'Copilot',
      ]
        .filter(Boolean)
        .join(' · ');

    const head = `<tr>
      <th data-type="text">${tr('Student', 'Aluno')}</th>
      <th data-type="num">${tr('Score', 'Nota')}</th>
      ${r.questions.map((q) => `<th data-type="num" title="${escapeHtml(q.title)}">${escapeHtml(q.title)}<span class="muted"> /${q.points}</span></th>`).join('')}
      <th data-type="num">${tr('Time', 'Tempo')}</th>
      <th data-type="num">${tr('Away', 'Fora')}</th>
      <th data-type="text">${tr('Ended', 'Fim')}</th>
      <th data-type="num">${tr('Warnings', 'Avisos')}</th>
      <th data-type="text">${tr('Verified', 'Verificado')}</th>
    </tr>`;
    const rows = r.rows
      .map((row) => {
        const warnings = row.warnings.paste + row.warnings.copy + row.warnings.away + row.warnings.copilot;
        return `<tr data-file="${escapeHtml(row.file)}">
          <td data-sort="${escapeHtml(row.student.toLowerCase())}"><a href="#" class="open" title="${escapeHtml(path.basename(row.file))}">${escapeHtml(row.student)}</a></td>
          <td data-sort="${row.earned}" class="score ${level(row.percent)}"><strong>${num(row.earned)}</strong><span class="muted"> /${row.max}${row.max === 100 ? '' : ` · ${num(row.percent)}%`}</span></td>
          ${r.questions
            .map((q) => {
              const cell = row.questions[q.id];
              const earned = cell?.earned ?? 0;
              return `<td data-sort="${earned}" class="cell ${cell?.submissions ? level(pct(earned, q.points)) : 'none'}" title="${cell?.submissions ? plural(cell.submissions, ['submission', 'submissions'], ['envio', 'envios']) : tr('Not submitted', 'Não enviada')}">${cell?.submissions ? num(earned) : '–'}</td>`;
            })
            .join('')}
          <td data-sort="${row.timeTakenSeconds}">${formatDuration(row.timeTakenSeconds * 1000)}</td>
          <td data-sort="${row.awaySeconds}" class="${row.awaySeconds >= 60 ? 'flag' : ''}">${row.awaySeconds ? formatDuration(row.awaySeconds * 1000) : '–'}</td>
          <td data-sort="${row.finishedBy}" class="${row.finishedBy === 'away' ? 'flag' : ''}">${ended[row.finishedBy] ?? row.finishedBy}</td>
          <td data-sort="${warnings}" class="${warnings ? 'flag' : ''}" title="${escapeHtml(warningText(row.warnings))}">${warnings ? `⚠ ${warnings}` : '–'}</td>
          <td data-sort="" class="verified">–</td>
        </tr>`;
      })
      .join('');
    const averages = `<tr class="averages">
      <td>${tr('Class average', 'Média da turma')}</td>
      <td><strong>${num(r.stats.average)}</strong><span class="muted"> /${r.max}</span></td>
      ${r.questions.map((q) => `<td class="cell ${level(pct(q.average, q.points))}">${num(q.average)}</td>`).join('')}
      <td colspan="5"></td>
    </tr>`;
    const notes = [
      r.skipped ? tr(`${r.skipped} results file(s) for other exams were skipped.`, `${r.skipped} arquivo(s) de outras provas foram ignorados.`) : '',
      ...r.errors.map((e) => tr(`Could not read ${e}`, `Não foi possível ler ${e}`)),
    ].filter(Boolean);
    const hardest = [...r.questions].sort((a, b) => pct(a.average, a.points) - pct(b.average, b.points))[0];

    return `<!DOCTYPE html>
<html lang="${language() === 'pt-br' ? 'pt-BR' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} data:; script-src 'nonce-${n}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${media('panel.css')}">
  <link rel="stylesheet" href="${media('classResults.css')}">
  <title>${escapeHtml(r.examTitle)}</title>
</head>
<body data-lang="${language()}">
  <header>
    <div class="title-row"><h1>${escapeHtml(r.examTitle)}</h1></div>
    <div class="meta"><span class="badge topic">${tr('Class results', 'Resultados da turma')}</span><span class="badge">${plural(r.stats.count, ['student', 'students'], ['aluno', 'alunos'])}</span></div>
    <div class="actions">
      <button class="primary" id="export">${tr('Export CSV', 'Exportar CSV')}</button>
      <button class="secondary" id="verify" title="${tr('Re-grade every file and check that the scores were not edited', 'Recorrigir cada arquivo e conferir se as notas não foram editadas')}">${tr('Verify all', 'Verificar todos')}</button>
    </div>
  </header>
  <main>
    ${notes.map((t) => `<div class="banner warning"><p>${escapeHtml(t)}</p></div>`).join('')}
    ${
      r.stats.count
        ? `<section class="stats">
      ${stat(tr('Average', 'Média'), `${num(r.stats.average)}<span class="muted">/${r.max}</span>`)}
      ${stat(tr('Median', 'Mediana'), num(r.stats.median))}
      ${stat(tr('Highest', 'Maior'), num(r.stats.highest))}
      ${stat(tr('Lowest', 'Menor'), num(r.stats.lowest))}
      ${hardest ? stat(tr('Hardest question', 'Questão mais difícil'), `<span class="small">${escapeHtml(hardest.title)} · ${pct(hardest.average, hardest.points)}%</span>`) : ''}
    </section>
    <p class="muted">${tr('Click a column to sort. Click a name to open the results file.', 'Clique numa coluna para ordenar. Clique num nome para abrir o arquivo de resultado.')}</p>
    <div class="table-wrap"><table id="results"><thead>${head}</thead><tbody>${rows}</tbody><tfoot>${averages}</tfoot></table></div>`
        : `<div class="banner info"><p>${tr('No results files for this exam were found.', 'Nenhum arquivo de resultado desta prova foi encontrado.')}</p></div>`
    }
  </main>
  <script nonce="${n}" src="${media('classResults.js')}"></script>
</body>
</html>`;
  }
}
