// "Check Java Setup": runs the Java check, explains each problem with its fix, and lets the
// student point Sphinx at a JDK folder. A silent check also runs when Sphinx starts, so a missing
// or broken Java shows up before the first Run, not after it.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { tr } from './i18n';
import { JavaProblem, JavaReport, MIN_CLASSIC, MIN_MODERN, blocking, checkJava } from './javaCheck';

const DOWNLOAD_URL = 'https://adoptium.net/temurin/releases/';

export function problemText(p: JavaProblem): { title: string; fix: string } {
  switch (p.kind) {
    case 'javacMissing':
      return {
        title: tr('The Java compiler (javac) was not found.', 'O compilador do Java (javac) não foi encontrado.'),
        fix: tr(
          'Install a JDK (not just a JRE), version 25 or newer, then restart VS Code. If it is already installed, use "Choose JDK Folder…".',
          'Instale um JDK (não só um JRE), versão 25 ou mais nova, e reinicie o VS Code. Se ele já estiver instalado, use "Escolher a pasta do JDK…".',
        ),
      };
    case 'javaMissing':
      return {
        title: tr('The Java runtime (java) was not found.', 'O Java (java) não foi encontrado.'),
        fix: tr('Install a JDK 25 or newer, then restart VS Code, or use "Choose JDK Folder…".', 'Instale um JDK 25 ou mais novo e reinicie o VS Code, ou use "Escolher a pasta do JDK…".'),
      };
    case 'tooOld':
      return {
        title: tr(`Your JDK is version ${p.version}, which is too old for Sphinx.`, `Seu JDK é a versão ${p.version}, antiga demais para o Sphinx.`),
        fix: tr(
          `Install JDK ${MIN_MODERN} or newer (at least ${MIN_CLASSIC} for classic Java), then restart VS Code or use "Choose JDK Folder…".`,
          `Instale o JDK ${MIN_MODERN} ou mais novo (pelo menos o ${MIN_CLASSIC} para Java clássico) e reinicie o VS Code, ou use "Escolher a pasta do JDK…".`,
        ),
      };
    case 'mismatch':
      return {
        title: tr(
          `javac is version ${p.javac} but java is version ${p.java}: they come from different installations.`,
          `O javac é a versão ${p.javac}, mas o java é a versão ${p.java}: eles vêm de instalações diferentes.`,
        ),
        fix: tr(
          'Programs compiled by the newer javac can\'t run on the older java. Use "Choose JDK Folder…" to pick one JDK for both, or remove the old Java from your PATH.',
          'Programas compilados pelo javac mais novo não rodam no java mais antigo. Use "Escolher a pasta do JDK…" para usar um só JDK para os dois, ou tire o Java antigo do PATH.',
        ),
      };
    case 'runFailed':
      return {
        title: tr('Java is installed, but a test program did not run.', 'O Java está instalado, mas um programa de teste não rodou.'),
        fix: p.detail,
      };
    case 'noModern':
      return {
        title: tr(`Your JDK ${p.version} can't run the modern Java starters (they need JDK ${MIN_MODERN}).`, `Seu JDK ${p.version} não roda os códigos iniciais em Java moderno (eles precisam do JDK ${MIN_MODERN}).`),
        fix: tr('Install JDK 25 or newer, or set sphinx.java.style to "classic". Classic Java works with your JDK.', 'Instale o JDK 25 ou mais novo, ou defina sphinx.java.style como "classic". O Java clássico funciona com o seu JDK.'),
      };
  }
}

export class JavaSetup implements vscode.Disposable {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChange = this.changed.event;
  private report: JavaReport | undefined;
  private warned = false;
  private running: Promise<JavaReport> | undefined;

  constructor(
    private readonly output: vscode.OutputChannel,
    private readonly javaHome: () => string | undefined,
    private readonly style: () => 'modern' | 'classic',
  ) {}

  dispose(): void {
    this.changed.dispose();
  }

  /** Problems that stop code from running, from the last check (empty until a check finished). */
  problems(): JavaProblem[] {
    return this.report ? blocking(this.report) : [];
  }

  private async run(): Promise<JavaReport> {
    this.running ??= checkJava(this.javaHome(), this.style()).finally(() => (this.running = undefined));
    this.report = await this.running;
    this.changed.fire();
    return this.report;
  }

  /** Runs in the background when Sphinx starts: warns once per session if Java can't run code. */
  async checkQuietly(): Promise<void> {
    const report = await this.run();
    if (blocking(report).length && !this.warned) {
      this.warned = true;
      const first = problemText(blocking(report)[0]);
      void this.offerFixes(`${tr('Sphinx can\'t run Java yet.', 'O Sphinx ainda não consegue rodar Java.')} ${first.title}`);
    }
  }

  /** The "Check Java Setup" command: a full report in the output panel and a summary. */
  async checkInteractively(): Promise<void> {
    const report = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: tr('Checking your Java setup…', 'Verificando a instalação do Java…') },
      () => this.run(),
    );
    this.writeReport(report);
    if (report.problems.length === 0) {
      vscode.window.showInformationMessage(
        tr(
          `✓ Java is ready: JDK ${report.javacVersion}. Run, Submit and Run in Terminal will work, in modern and classic style.`,
          `✓ O Java está pronto: JDK ${report.javacVersion}. Executar, Enviar e Executar no terminal vão funcionar, no estilo moderno e no clássico.`,
        ),
      );
    } else if (blocking(report).length === 0) {
      const p = problemText(report.problems[0]);
      vscode.window.showWarningMessage(`${tr('Java works, with one limit:', 'O Java funciona, com uma limitação:')} ${p.title} ${p.fix}`);
    } else {
      await this.offerFixes(`${problemText(blocking(report)[0]).title} ${tr('See the "Sphinx" output for details.', 'Veja os detalhes na saída "Sphinx".')}`);
    }
  }

  private async offerFixes(message: string): Promise<void> {
    const download = tr('Download JDK', 'Baixar o JDK');
    const choose = tr('Choose JDK Folder…', 'Escolher a pasta do JDK…');
    const details = tr('Show Details', 'Ver detalhes');
    const choice = await vscode.window.showWarningMessage(message, download, choose, details);
    if (choice === download) {
      vscode.env.openExternal(vscode.Uri.parse(DOWNLOAD_URL));
    } else if (choice === choose) {
      await this.chooseJdkFolder();
    } else if (choice === details) {
      if (this.report) {
        this.writeReport(this.report);
      }
    }
  }

  /** Lets the student pick a JDK folder, checks it has bin/javac, saves it as sphinx.java.home and checks again. */
  async chooseJdkFolder(): Promise<void> {
    const picked = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      title: tr('Choose the JDK folder (the one that contains bin/javac)', 'Escolha a pasta do JDK (a que contém bin/javac)'),
      openLabel: tr('Use this JDK', 'Usar este JDK'),
    });
    let folder = picked?.[0]?.fsPath;
    if (!folder) {
      return;
    }
    const javac = (dir: string) => path.join(dir, 'bin', process.platform === 'win32' ? 'javac.exe' : 'javac');
    // On macOS people often pick the .jdk bundle; the JDK lives in Contents/Home.
    if (!fs.existsSync(javac(folder)) && fs.existsSync(javac(path.join(folder, 'Contents', 'Home')))) {
      folder = path.join(folder, 'Contents', 'Home');
    }
    if (!fs.existsSync(javac(folder))) {
      vscode.window.showErrorMessage(tr(`${folder} is not a JDK: it has no bin/javac.`, `${folder} não é um JDK: não tem bin/javac.`));
      return;
    }
    await vscode.workspace.getConfiguration('sphinx').update('java.home', folder, vscode.ConfigurationTarget.Global);
    await this.checkInteractively();
  }

  private writeReport(r: JavaReport): void {
    const yes = tr('yes', 'sim');
    const no = tr('no', 'não');
    const lines = [
      '',
      tr('=== Java setup ===', '=== Instalação do Java ==='),
      `javac: ${r.javacPath ?? r.javacCommand} ${r.javacVersion !== undefined ? `(JDK ${r.javacVersion})` : tr('(not found)', '(não encontrado)')}`,
      `java:  ${r.javaPath ?? r.javaCommand} ${r.javaVersion !== undefined ? `(${r.javaVersion})` : tr('(not found)', '(não encontrado)')}`,
      `sphinx.java.home: ${r.javaHomeSetting ?? tr('(not set: using the PATH)', '(não definido: usando o PATH)')}`,
      `JAVA_HOME: ${r.javaHomeEnv ?? tr('(not set)', '(não definido)')}`,
      `${tr('Classic Java runs', 'Java clássico roda')}: ${r.classicWorks ? yes : no}`,
      `${tr(`Modern Java (JDK ${MIN_MODERN}+) runs`, `Java moderno (JDK ${MIN_MODERN}+) roda`)}: ${r.modernWorks ? yes : no}`,
    ];
    if (r.problems.length === 0) {
      lines.push(tr('✓ Everything works.', '✓ Tudo funciona.'));
    }
    for (const p of r.problems) {
      const t = problemText(p);
      lines.push(`✗ ${t.title}`, `  → ${t.fix.split('\n').join('\n    ')}`);
    }
    if (r.problems.some((p) => p.kind === 'javacMissing' || p.kind === 'javaMissing')) {
      lines.push(
        tr(
          'Tip: VS Code reads the PATH when it starts. After installing Java, restart VS Code completely.',
          'Dica: o VS Code lê o PATH quando abre. Depois de instalar o Java, feche e abra o VS Code de novo.',
        ),
      );
    }
    lines.forEach((l) => this.output.appendLine(l));
    this.output.show(true);
  }
}
