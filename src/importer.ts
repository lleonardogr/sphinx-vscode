// "Import Challenges, Quizzes, Lessons or Exams…": copies what a teacher shared (a folder or a .zip) into the
// extension's library, which is loaded like the built-in challenges. Copying means the import keeps
// working after the original folder, download or USB stick is gone.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { slugify } from './authoring';
import { Challenge } from './challenges';
import { ExamDefinition } from './exams';
import { QuizDefinition } from './quizzes';
import { LessonDefinition } from './lessons';
import { plural, tr } from './i18n';
import { unitName } from './path';
import { Importable, checkImportables, extractZip, findImportables, findSolutions } from './importCore';

export interface ImportDeps {
  /** Root of the library; challenges and exams go in sub-folders. */
  libraryDir: string;
  output: vscode.OutputChannel;
  challenges: () => Challenge[];
  exams: () => ExamDefinition[];
  quizzes: () => QuizDefinition[];
  lessons: () => LessonDefinition[];
  reload: () => void;
}

export function libraryRoots(libraryDir: string): string[] {
  return ['challenges', 'quizzes', 'lessons', 'exams'].map((d) => path.join(libraryDir, d));
}

const isInside = (child: string, parent: string) => path.resolve(child).startsWith(path.resolve(parent) + path.sep);

function describe(items: Importable[]): string {
  const tests = items.filter((i) => i.kind === 'challenge' && i.topic === 'Tests').length;
  const challenges = items.filter((i) => i.kind === 'challenge').length - tests;
  const exams = items.filter((i) => i.kind === 'exam').length;
  const quizzes = items.filter((i) => i.kind === 'quiz').length;
  const lessons = items.filter((i) => i.kind === 'lesson').length;
  const parts = [
    challenges && plural(challenges, ['challenge', 'challenges'], ['desafio', 'desafios']),
    tests && plural(tests, ['test', 'tests'], ['teste', 'testes']),
    quizzes && plural(quizzes, ['quiz', 'quizzes'], ['quiz', 'quizzes']),
    lessons && plural(lessons, ['lesson', 'lessons'], ['lição', 'lições']),
    exams && plural(exams, ['exam', 'exams'], ['prova', 'provas']),
  ].filter(Boolean);
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} ${tr('and', 'e')} ${parts[parts.length - 1]}` : String(parts[0] ?? tr('nothing', 'nada'));
}

export async function importContent(deps: ImportDeps): Promise<void> {
  const picked = await vscode.window.showOpenDialog({
    title: tr('Import challenges, quizzes, lessons or exams', 'Importar desafios, quizzes, lições ou provas'),
    openLabel: tr('Import', 'Importar'),
    canSelectFiles: true,
    canSelectFolders: true,
    canSelectMany: false,
    filters: { 'Folder or zip': ['zip'] },
  });
  const source = picked?.[0]?.fsPath;
  if (!source) {
    return;
  }

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-import-'));
  try {
    let root = source;
    if (fs.statSync(source).isFile()) {
      if (!source.toLowerCase().endsWith('.zip')) {
        vscode.window.showErrorMessage(tr('Choose a folder, or a .zip file.', 'Escolha uma pasta ou um arquivo .zip.'));
        return;
      }
      try {
        extractZip(source, temp);
      } catch (e) {
        vscode.window.showErrorMessage(tr(`Could not open ${path.basename(source)}: ${(e as Error).message}`, `Não foi possível abrir ${path.basename(source)}: ${(e as Error).message}`));
        return;
      }
      root = temp;
    }

    const rootName = slugify(path.basename(source).replace(/\.zip$/i, '')) || 'imported';
    const found = findImportables(root, rootName);
    // Don't import the library into itself, or the extension's own folders.
    const candidates = found.filter((i) => !isInside(i.dir, deps.libraryDir));
    const { ok, errors } = checkImportables(candidates, deps.challenges(), deps.quizzes());
    errors.forEach((e) => deps.output.appendLine(`[import] ✗ ${e}`));
    if (ok.length === 0) {
      vscode.window.showWarningMessage(
        errors.length
          ? tr(`Nothing could be imported from ${path.basename(source)}. See the "Sphinx" output for the problems.`, `Nada pôde ser importado de ${path.basename(source)}. Veja os problemas na saída "Sphinx".`)
          : tr(
              `No challenges, quizzes, lessons or exams found in ${path.basename(source)}. Each one needs a folder with a challenge.json, quiz.json, lesson.json or exam.json.`,
              `Nenhum desafio, quiz, lição ou prova encontrado em ${path.basename(source)}. Cada um precisa de uma pasta com challenge.json, quiz.json, lesson.json ou exam.json.`,
            ),
      );
      return;
    }

    // Reference solutions: a teacher keeps them, a student shouldn't have them.
    const solutions = ok.flatMap((i) => findSolutions(i.dir));
    let removeSolutions = false;
    if (solutions.length) {
      const choice = await vscode.window.showQuickPick(
        [
          { label: tr('Remove the solutions', 'Remover as soluções'), detail: tr('For students: the challenges work without them.', 'Para alunos: os desafios funcionam sem elas.'), remove: true },
          {
            label: tr('Keep the solutions', 'Manter as soluções'),
            detail: tr('For teachers: needed to validate the challenges or fill in expected outputs.', 'Para professores: necessárias para validar os desafios ou gerar as saídas esperadas.'),
            remove: false,
          },
        ],
        {
          title: tr(
            `This import contains ${solutions.length} reference solution file${solutions.length > 1 ? 's' : ''} (Solution*.java)`,
            `Esta importação tem ${solutions.length} arquivo${solutions.length > 1 ? 's' : ''} de solução (Solution*.java)`,
          ),
          ignoreFocusOut: true,
        },
      );
      if (!choice) {
        return;
      }
      removeSolutions = choice.remove;
    }

    // Where each item goes. Same id as a built-in or another folder's item: keep both by
    // renaming the imported one.
    const otherIds = new Set(deps.challenges().filter((c) => !isInside(c.dir, deps.libraryDir)).map((c) => c.id));
    const otherExamIds = new Set(deps.exams().filter((e) => !isInside(e.dir, deps.libraryDir)).map((e) => e.id));
    const otherQuizIds = new Set(deps.quizzes().filter((q) => !isInside(q.dir, deps.libraryDir)).map((q) => q.id));
    const otherLessonIds = new Set(deps.lessons().filter((l) => !isInside(l.dir, deps.libraryDir)).map((l) => l.id));
    const clashes: string[] = [];
    const plan = ok.map((item) => {
      const ids = { challenge: otherIds, quiz: otherQuizIds, lesson: otherLessonIds, exam: otherExamIds }[item.kind];
      const clash = ids.has(item.name);
      const folder = { challenge: 'challenges', quiz: 'quizzes', lesson: 'lessons', exam: 'exams' }[item.kind];
      const dest = path.join(deps.libraryDir, folder, clash ? `${item.name}-imported` : item.name);
      if (clash) {
        clashes.push(`${item.title} → ${path.basename(dest)}`);
      }
      return { item, dest };
    });

    // Items already in the library are updated after one confirmation.
    const existing = plan.filter((p) => fs.existsSync(p.dest));
    let replace = true;
    if (existing.length) {
      const replaceLabel = tr('Replace', 'Substituir');
      const answer = await vscode.window.showWarningMessage(
        tr(
          `${existing.length} of these ${existing.length > 1 ? 'are' : 'is'} already imported: ${existing.map((p) => p.item.title).join(', ')}.`,
          `${existing.length} ${existing.length > 1 ? 'destes já foram importados' : 'destes já foi importado'}: ${existing.map((p) => p.item.title).join(', ')}.`,
        ),
        { modal: true, detail: tr('Replace them with this version? Progress and exam results are kept.', 'Substituir pela versão nova? O progresso e os resultados de provas são mantidos.') },
        replaceLabel,
        tr('Skip Them', 'Pular'),
      );
      if (!answer) {
        return;
      }
      replace = answer === replaceLabel;
    }

    const imported: Importable[] = [];
    for (const { item, dest } of plan) {
      if (fs.existsSync(dest) && !replace) {
        continue;
      }
      fs.rmSync(dest, { recursive: true, force: true });
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.cpSync(item.dir, dest, { recursive: true, filter: (src) => !path.basename(src).startsWith('.') && path.basename(src) !== '__MACOSX' });
      if (removeSolutions) {
        findSolutions(dest).forEach((f) => fs.rmSync(f));
      }
      deps.output.appendLine(`[import] ✓ ${item.kind} "${item.title}" → ${dest}`);
      imported.push(item);
    }
    deps.reload();

    if (imported.length === 0) {
      vscode.window.showInformationMessage(tr('Nothing new was imported.', 'Nada novo foi importado.'));
      return;
    }
    const notes = [
      clashes.length ? tr(`Renamed to avoid clashing with existing ids: ${clashes.join(', ')}.`, `Renomeados para não conflitar com ids existentes: ${clashes.join(', ')}.`) : '',
      errors.length ? tr(`${errors.length} item(s) could not be imported; see the "Sphinx" output.`, `${errors.length} item(ns) não puderam ser importados; veja a saída "Sphinx".`) : '',
    ].filter(Boolean);
    const choice = await vscode.window.showInformationMessage(
      `${tr('Imported', 'Importados')}: ${describe(imported)}${removeSolutions ? tr(' (solutions removed)', ' (soluções removidas)') : ''}. ${notes.join(' ')}`.trim(),
      tr('Show in Sidebar', 'Mostrar na barra lateral'),
    );
    if (choice) {
      await vscode.commands.executeCommand('sphinx.list.focus');
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

export async function removeImported(deps: ImportDeps): Promise<void> {
  const items = [
    ...deps.exams().filter((e) => isInside(e.dir, deps.libraryDir)).map((e) => ({ label: `$(checklist) ${e.title}`, description: `${tr('exam', 'prova')} · ${plural(e.questions.length, ['question', 'questions'], ['questão', 'questões'])}`, dir: e.dir })),
    ...deps.quizzes().filter((q) => isInside(q.dir, deps.libraryDir)).map((q) => ({ label: `$(question) ${q.title}`, description: `quiz · ${plural(q.questions.length, ['question', 'questions'], ['questão', 'questões'])}`, dir: q.dir })),
    ...deps.lessons().filter((l) => isInside(l.dir, deps.libraryDir)).map((l) => ({ label: `$(book) ${l.title}`, description: tr('lesson', 'lição'), dir: l.dir })),
    ...deps.challenges().filter((c) => isInside(c.dir, deps.libraryDir)).map((c) => ({ label: `$(symbol-event) ${c.title}`, description: `${unitName(c.topic)} · ${c.difficulty}`, dir: c.dir })),
  ];
  if (items.length === 0) {
    vscode.window.showInformationMessage(tr('Nothing has been imported yet. Use "Import Challenges, Quizzes, Lessons or Exams…" to add some.', 'Nada foi importado ainda. Use "Importar desafios, quizzes, lições ou provas…" para adicionar.'));
    return;
  }
  const picks = await vscode.window.showQuickPick(items, { title: tr('Remove imported challenges, quizzes, lessons or exams', 'Remover desafios, quizzes, lições ou provas importados'), canPickMany: true, ignoreFocusOut: true });
  if (!picks?.length) {
    return;
  }
  const removeLabel = tr('Remove', 'Remover');
  const answer = await vscode.window.showWarningMessage(
    tr(`Remove ${picks.length} imported item${picks.length > 1 ? 's' : ''}?`, `Remover ${picks.length} ${picks.length > 1 ? 'itens importados' : 'item importado'}?`),
    {
      modal: true,
      detail: tr(
        'They disappear from the sidebar. Your own code files are kept, and you can import them again later.',
        'Eles somem da barra lateral. Seus arquivos de código são mantidos, e você pode importá-los de novo depois.',
      ),
    },
    removeLabel,
  );
  if (answer !== removeLabel) {
    return;
  }
  for (const p of picks) {
    fs.rmSync(p.dir, { recursive: true, force: true });
    deps.output.appendLine(`[import] removed ${p.dir}`);
  }
  deps.reload();
}
