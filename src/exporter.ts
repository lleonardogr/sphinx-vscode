// Export Pack: zips the teacher's chosen challenges, quizzes and exams for students to import.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { ExamDefinition } from './exams';
import { PackItem, buildPack, examDependencies } from './exportCore';
import { QuizDefinition } from './quizzes';
import { Origin, TeacherNode } from './teacherView';
import { plural, tr } from './i18n';

export interface ExportDeps {
  challenges(): Challenge[];
  quizzes(): QuizDefinition[];
  exams(): ExamDefinition[];
  origin(dir: string): Origin;
  extensionPath: string;
}

type Pick = vscode.QuickPickItem & { item?: PackItem; title?: string };

const ORIGIN: Record<Origin, [string, string]> = { builtIn: ['built-in', 'incluída'], imported: ['imported', 'importada'], folder: ['your folder', 'sua pasta'] };

export async function exportPack(deps: ExportDeps, from?: TeacherNode): Promise<void> {
  const preselected = from && 'exam' in from ? from.exam.dir : from?.kind === 'challenge' ? from.challenge.dir : from?.kind === 'quiz' ? from.quiz.dir : undefined;
  const entry = (kind: PackItem['kind'], title: string, dir: string, detail: string): Pick => ({
    label: title,
    description: `${detail} · ${tr(...ORIGIN[deps.origin(dir)])}`,
    item: { kind, dir },
    title,
    picked: dir === preselected,
  });
  const exams = deps.exams().filter((e) => !e.preview);
  const challenges = deps.challenges().filter((c) => deps.origin(c.dir) !== 'builtIn');
  const quizzes = deps.quizzes().filter((q) => deps.origin(q.dir) !== 'builtIn');
  const separator = (label: string): Pick => ({ label, kind: vscode.QuickPickItemKind.Separator });
  const picks: Pick[] = [
    ...(exams.length ? [separator(tr('Exams', 'Provas')), ...exams.map((e) => entry('exam', e.title, e.dir, plural(e.questions.length, ['question', 'questions'], ['questão', 'questões'])))] : []),
    ...(challenges.length ? [separator(tr('Your challenges', 'Seus desafios')), ...challenges.map((c) => entry('challenge', c.title, c.dir, c.difficulty))] : []),
    ...(quizzes.length ? [separator(tr('Your quizzes', 'Seus quizzes')), ...quizzes.map((q) => entry('quiz', q.title, q.dir, 'Quiz'))] : []),
  ];
  const chosen = ((await vscode.window.showQuickPick(picks, {
    title: tr('Export a pack (1/3): what goes in it?', 'Exportar um pacote (1/3): o que vai nele?'),
    placeHolder: tr('Choose the exams, challenges and quizzes to share', 'Escolha as provas, desafios e quizzes para compartilhar'),
    canPickMany: true,
    ignoreFocusOut: true,
  })) ?? []) as Pick[];
  const items = chosen.filter((p) => p.item);
  if (items.length === 0) {
    return;
  }

  const audience = await vscode.window.showQuickPick(
    [
      { label: tr('For students', 'Para alunos'), detail: tr('Reference solutions (Solution*.java) are left out.', 'As soluções (Solution*.java) ficam de fora.'), keep: false },
      { label: tr('For teachers', 'Para professores'), detail: tr('Keeps the reference solutions, to validate or edit the content.', 'Mantém as soluções, para validar ou editar o conteúdo.'), keep: true },
    ],
    { title: tr('Export a pack (2/3): who is it for?', 'Exportar um pacote (2/3): para quem é?'), ignoreFocusOut: true },
  );
  if (!audience) {
    return;
  }

  // Exams that use the teacher's own challenges by id need them in the pack too.
  const packItems: PackItem[] = items.map((p) => p.item!);
  const added: string[] = [];
  for (const exam of exams.filter((e) => packItems.some((i) => i.dir === e.dir))) {
    for (const dep of examDependencies(exam, deps.extensionPath)) {
      if (!packItems.some((i) => path.resolve(i.dir) === path.resolve(dep.dir))) {
        packItems.push(dep);
        added.push(deps.challenges().find((c) => c.dir === dep.dir)?.title ?? deps.quizzes().find((q) => q.dir === dep.dir)?.title ?? path.basename(dep.dir));
      }
    }
  }

  const suggested = (items.find((p) => p.item!.kind === 'exam')?.title ?? 'sphynx-pack').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sphynx-pack';
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? os.homedir();
  const target = await vscode.window.showSaveDialog({
    title: tr('Export a pack (3/3): save as', 'Exportar um pacote (3/3): salvar como'),
    defaultUri: vscode.Uri.file(path.join(folder, `${suggested}.zip`)),
    filters: { [tr('Sphynx pack', 'Pacote do Sphynx')]: ['zip'] },
  });
  if (!target) {
    return;
  }
  const packName = path.basename(target.fsPath).replace(/\.zip$/i, '') || 'sphynx-pack';
  const pack = buildPack(packItems, packName, audience.keep);
  fs.writeFileSync(target.fsPath, pack.zip);

  const notes = [
    audience.keep ? tr('Solutions kept.', 'Soluções mantidas.') : tr(`${pack.solutionsRemoved} solution file(s) left out.`, `${pack.solutionsRemoved} arquivo(s) de solução deixado(s) de fora.`),
    added.length ? tr(`Also added, because an exam uses them: ${added.join(', ')}.`, `Também incluídos, porque uma prova os usa: ${added.join(', ')}.`) : '',
  ].filter(Boolean);
  const show = tr('Show in Folder', 'Mostrar na pasta');
  const choice = await vscode.window.showInformationMessage(
    tr(
      `Exported ${plural(packItems.length, ['item', 'items'], ['item', 'itens'])} to ${path.basename(target.fsPath)}. ${notes.join(' ')} Students import it with the Import button in the Sphynx sidebar.`,
      `${plural(packItems.length, ['item exportado', 'itens exportados'], ['item exportado', 'itens exportados'])} para ${path.basename(target.fsPath)}. ${notes.join(' ')} Os alunos importam com o botão Importar da barra lateral do Sphynx.`,
    ),
    show,
  );
  if (choice === show) {
    await vscode.commands.executeCommand('revealFileInOS', target);
  }
}
