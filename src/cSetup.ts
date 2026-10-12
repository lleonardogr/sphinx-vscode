// Commands for the C compiler: Check C Setup, Install Portable C Compiler and Remove Portable C Compiler.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { cCompilerMissing, clearCCompilerCache, findCCompiler } from './cRunner';
import { installPortableCompiler, installedPortableCompilers, portableCompilerFor } from './portableCompiler';
import { RunOutcome } from './runner';
import { tr } from './i18n';

export class CSetup {
  private offered = false;

  constructor(
    /** Sphinx's folder for portable compilers. */
    private readonly root: string,
    private readonly setting: () => string | undefined,
    private readonly output: vscode.OutputChannel,
  ) {}

  /** The portable compilers installed in Sphinx's folder. */
  portableDirs(): string[] {
    return installedPortableCompilers(this.root);
  }

  /** "Check C Setup": which compiler C challenges use, and whether it has memory checks. */
  async check(): Promise<void> {
    clearCCompilerCache();
    const compiler = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: tr('Checking the C compiler…', 'Verificando o compilador de C…') }, () =>
      findCCompiler(this.setting(), this.portableDirs()),
    );
    this.output.appendLine(`[c] ${tr('C setup', 'Instalação do C')}`);
    this.output.appendLine(`    sphinx.c.compiler: ${this.setting() ?? tr('(not set: searching the PATH)', '(não definido: procurando no PATH)')}`);
    this.output.appendLine(`    ${tr('portable compilers', 'compiladores portáteis')}: ${this.portableDirs().join(', ') || tr('(none)', '(nenhum)')}`);
    if (!compiler) {
      this.output.appendLine(`    ${tr('compiler', 'compilador')}: ${tr('(not found)', '(não encontrado)')}`);
      const install = portableCompilerFor() && tr('Install Portable C Compiler', 'Instalar compilador de C portátil');
      const choice = await vscode.window.showWarningMessage(cCompilerMissing(), ...(install ? [install] : []));
      if (install && choice === install) {
        await this.install();
      }
      return;
    }
    this.output.appendLine(`    ${tr('compiler', 'compilador')}: ${compiler.command} (${compiler.version})`);
    this.output.appendLine(`    ${tr('memory checks', 'verificações de memória')}: ${compiler.sanitizers ? tr('on', 'ligadas') : tr('off (this compiler cannot add them)', 'desligadas (este compilador não consegue adicioná-las)')}`);
    this.output.appendLine(`    ${tr('extra flags', 'flags extras')}: ${compiler.flags.join(' ') || tr('(none)', '(nenhuma)')}`);
    const checks = compiler.sanitizers
      ? tr('Memory errors are explained with their line.', 'Os erros de memória são explicados com a linha.')
      : tr('It has no memory checks, so memory errors may go unnoticed.', 'Ele não tem verificações de memória, então erros de memória podem passar despercebidos.');
    const better = !compiler.sanitizers && portableCompilerFor() && tr('Install Portable C Compiler', 'Instalar compilador de C portátil');
    const details = tr('Show Details', 'Mostrar detalhes');
    const choice = await vscode.window.showInformationMessage(
      tr(`C is ready: ${compiler.version}. ${checks}`, `O C está pronto: ${compiler.version}. ${checks}`),
      ...(better ? [better] : []),
      details,
    );
    if (choice === details) {
      this.output.show(true);
    } else if (better && choice === better) {
      await this.install();
    }
  }

  /** "Install Portable C Compiler": downloads llvm-mingw into Sphinx's folder, after the student agrees. */
  async install(): Promise<boolean> {
    const compiler = portableCompilerFor();
    if (!compiler) {
      vscode.window.showInformationMessage(
        tr(`Sphinx's portable C compiler is for Windows. ${cCompilerMissing()}`, `O compilador de C portátil do Sphinx é para Windows. ${cCompilerMissing()}`),
      );
      return false;
    }
    const mb = Math.round(compiler.size / 1048576);
    const download = tr('Download', 'Baixar');
    const answer = await vscode.window.showInformationMessage(
      tr(`Download a portable C compiler (llvm-mingw, ${mb} MB)?`, `Baixar um compilador de C portátil (llvm-mingw, ${mb} MB)?`),
      {
        modal: true,
        detail: tr(
          `It comes from its official release on GitHub (github.com/mstorsjo/llvm-mingw) and is checked against a pinned checksum. It is unpacked into Sphinx's own folder (about 500 MB), nothing is installed on the system, and "Remove Portable C Compiler" deletes it. It includes memory checks, so memory errors are explained with their line.`,
          `Ele vem da versão oficial no GitHub (github.com/mstorsjo/llvm-mingw) e é conferido com uma soma de verificação fixa. Ele é descompactado na pasta do próprio Sphinx (cerca de 500 MB), nada é instalado no sistema, e "Remover compilador de C portátil" o apaga. Ele inclui verificações de memória, então os erros de memória são explicados com a linha.`,
        ),
      },
      download,
    );
    if (answer !== download) {
      return false;
    }
    try {
      const folder = await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: tr('Portable C compiler', 'Compilador de C portátil'), cancellable: true },
        (progress, token) => {
          const abort = new AbortController();
          token.onCancellationRequested(() => abort.abort());
          let reported = 0;
          return installPortableCompiler(
            this.root,
            compiler,
            (step, received = 0, total = compiler.size) => {
              if (step === 'unpack') {
                progress.report({ message: tr('Unpacking…', 'Descompactando…') });
                return;
              }
              const percent = Math.floor((received / total) * 100);
              if (percent > reported) {
                progress.report({ increment: percent - reported, message: tr(`Downloading… ${Math.round(received / 1048576)} of ${mb} MB`, `Baixando… ${Math.round(received / 1048576)} de ${mb} MB`) });
                reported = percent;
              }
            },
            abort.signal,
          );
        },
      );
      this.output.appendLine(`[c] ${tr('installed', 'instalado')} ${folder}`);
      clearCCompilerCache();
      const found = await findCCompiler(this.setting(), this.portableDirs());
      if (found && path.resolve(found.command).startsWith(path.resolve(folder))) {
        vscode.window.showInformationMessage(
          found.sanitizers
            ? tr(`The portable C compiler is ready, with memory checks: ${found.version}.`, `O compilador de C portátil está pronto, com verificações de memória: ${found.version}.`)
            : tr(`The portable C compiler is ready: ${found.version}.`, `O compilador de C portátil está pronto: ${found.version}.`),
        );
      } else if (found) {
        vscode.window.showInformationMessage(
          tr(
            `The portable C compiler is installed, but C challenges use ${found.command} (from sphinx.c.compiler or found first). Clear sphinx.c.compiler to use the portable one.`,
            `O compilador de C portátil foi instalado, mas os desafios em C usam ${found.command} (de sphinx.c.compiler ou encontrado antes). Limpe sphinx.c.compiler para usar o portátil.`,
          ),
        );
      } else {
        vscode.window.showWarningMessage(tr('The portable C compiler was installed but does not work on this computer. See the "Sphinx" output.', 'O compilador de C portátil foi instalado mas não funciona neste computador. Veja a saída "Sphinx".'));
      }
      return true;
    } catch (e) {
      const message = (e as Error).name === 'AbortError' ? tr('The download was cancelled.', 'O download foi cancelado.') : (e as Error).message;
      this.output.appendLine(`[c] ${tr('install failed', 'a instalação falhou')}: ${message}`);
      vscode.window.showWarningMessage(tr(`The portable C compiler was not installed: ${message}`, `O compilador de C portátil não foi instalado: ${message}`));
      return false;
    }
  }

  /** "Remove Portable C Compiler": deletes the portable compilers in Sphinx's folder, after asking. */
  async remove(): Promise<void> {
    const dirs = this.portableDirs();
    if (!dirs.length) {
      vscode.window.showInformationMessage(tr('No portable C compiler is installed.', 'Nenhum compilador de C portátil está instalado.'));
      return;
    }
    const removeLabel = tr('Remove', 'Remover');
    const answer = await vscode.window.showWarningMessage(
      tr(`Remove the portable C compiler (${dirs.map((d) => path.basename(d)).join(', ')})?`, `Remover o compilador de C portátil (${dirs.map((d) => path.basename(d)).join(', ')})?`),
      { modal: true, detail: tr('C challenges will need another compiler until you install it again.', 'Os desafios em C vão precisar de outro compilador até você instalá-lo de novo.') },
      removeLabel,
    );
    if (answer !== removeLabel) {
      return;
    }
    for (const dir of dirs) {
      fs.rmSync(dir, { recursive: true, force: true });
      this.output.appendLine(`[c] ${tr('removed', 'removido')} ${dir}`);
    }
    clearCCompilerCache();
    vscode.window.showInformationMessage(tr('The portable C compiler was removed.', 'O compilador de C portátil foi removido.'));
  }

  /** After a C run found no compiler: offer the portable one, once per session, where there is one. */
  offerAfter(outcome: RunOutcome | undefined): void {
    if (this.offered || outcome?.kind !== 'toolMissing' || outcome.tool !== 'c' || !portableCompilerFor()) {
      return;
    }
    this.offered = true;
    const install = tr('Install Portable C Compiler', 'Instalar compilador de C portátil');
    void vscode.window
      .showInformationMessage(
        tr('C challenges need a C compiler. Sphinx can download a portable one, with no installation and no admin rights.', 'Os desafios em C precisam de um compilador de C. O Sphinx pode baixar um portátil, sem instalação e sem permissão de administrador.'),
        install,
      )
      .then((choice) => (choice === install ? this.install() : undefined));
  }
}
