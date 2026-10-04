// "Import Challenges, Quizzes, Tests or Exams…": copies what a teacher shared (a folder or a .zip) into the
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
import { Importable, checkImportables, extractZip, findImportables, findSolutions } from './importCore';

export interface ImportDeps {
  /** Root of the library; challenges and exams go in sub-folders. */
  libraryDir: string;
  output: vscode.OutputChannel;
  challenges: () => Challenge[];
  exams: () => ExamDefinition[];
  quizzes: () => QuizDefinition[];
  reload: () => void;
}

export function libraryRoots(libraryDir: string): string[] {
  return ['challenges', 'quizzes', 'exams'].map((d) => path.join(libraryDir, d));
}

const isInside = (child: string, parent: string) => path.resolve(child).startsWith(path.resolve(parent) + path.sep);

function describe(items: Importable[]): string {
  const tests = items.filter((i) => i.kind === 'challenge' && i.topic === 'Tests').length;
  const challenges = items.filter((i) => i.kind === 'challenge').length - tests;
  const exams = items.filter((i) => i.kind === 'exam').length;
  const quizzes = items.filter((i) => i.kind === 'quiz').length;
  const parts = [
    challenges && `${challenges} challenge${challenges > 1 ? 's' : ''}`,
    tests && `${tests} test${tests > 1 ? 's' : ''}`,
    quizzes && `${quizzes} quiz${quizzes > 1 ? 'zes' : ''}`,
    exams && `${exams} exam${exams > 1 ? 's' : ''}`,
  ].filter(Boolean);
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : String(parts[0] ?? 'nothing');
}

export async function importContent(deps: ImportDeps): Promise<void> {
  const picked = await vscode.window.showOpenDialog({
    title: 'Import challenges, quizzes, tests or exams',
    openLabel: 'Import',
    canSelectFiles: true,
    canSelectFolders: true,
    canSelectMany: false,
    filters: { 'Folder or zip': ['zip'] },
  });
  const source = picked?.[0]?.fsPath;
  if (!source) {
    return;
  }

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-import-'));
  try {
    let root = source;
    if (fs.statSync(source).isFile()) {
      if (!source.toLowerCase().endsWith('.zip')) {
        vscode.window.showErrorMessage('Choose a folder, or a .zip file.');
        return;
      }
      try {
        extractZip(source, temp);
      } catch (e) {
        vscode.window.showErrorMessage(`Could not open ${path.basename(source)}: ${(e as Error).message}`);
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
          ? `Nothing could be imported from ${path.basename(source)}. See the "Sphynx" output for the problems.`
          : `No challenges or exams found in ${path.basename(source)}. Each one needs a folder with a challenge.json, quiz.json or exam.json.`,
      );
      return;
    }

    // Reference solutions: a teacher keeps them, a student shouldn't have them.
    const solutions = ok.flatMap((i) => findSolutions(i.dir));
    let removeSolutions = false;
    if (solutions.length) {
      const choice = await vscode.window.showQuickPick(
        [
          { label: 'Remove the solutions', detail: 'For students: the challenges work without them.', remove: true },
          { label: 'Keep the solutions', detail: 'For teachers: needed to validate the challenges or fill in expected outputs.', remove: false },
        ],
        { title: `This import contains ${solutions.length} reference solution file${solutions.length > 1 ? 's' : ''} (Solution*.java)`, ignoreFocusOut: true },
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
    const clashes: string[] = [];
    const plan = ok.map((item) => {
      const clash = (item.kind === 'challenge' ? otherIds : item.kind === 'quiz' ? otherQuizIds : otherExamIds).has(item.name);
      const folder = item.kind === 'exam' ? 'exams' : item.kind === 'quiz' ? 'quizzes' : 'challenges';
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
      const answer = await vscode.window.showWarningMessage(
        `${existing.length} of these ${existing.length > 1 ? 'are' : 'is'} already imported: ${existing.map((p) => p.item.title).join(', ')}.`,
        { modal: true, detail: 'Replace them with this version? Progress and exam results are kept.' },
        'Replace',
        'Skip Them',
      );
      if (!answer) {
        return;
      }
      replace = answer === 'Replace';
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
      vscode.window.showInformationMessage('Nothing new was imported.');
      return;
    }
    const notes = [
      clashes.length ? `Renamed to avoid clashing with existing ids: ${clashes.join(', ')}.` : '',
      errors.length ? `${errors.length} item(s) could not be imported; see the "Sphynx" output.` : '',
    ].filter(Boolean);
    const choice = await vscode.window.showInformationMessage(
      `Imported ${describe(imported)}${removeSolutions ? ' (solutions removed)' : ''}. ${notes.join(' ')}`.trim(),
      'Show in Sidebar',
    );
    if (choice) {
      await vscode.commands.executeCommand('sphynx.list.focus');
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

export async function removeImported(deps: ImportDeps): Promise<void> {
  const items = [
    ...deps.exams().filter((e) => isInside(e.dir, deps.libraryDir)).map((e) => ({ label: `$(checklist) ${e.title}`, description: `exam · ${e.questions.length} questions`, dir: e.dir })),
    ...deps.quizzes().filter((q) => isInside(q.dir, deps.libraryDir)).map((q) => ({ label: `$(question) ${q.title}`, description: `quiz · ${q.questions.length} questions`, dir: q.dir })),
    ...deps.challenges().filter((c) => isInside(c.dir, deps.libraryDir)).map((c) => ({ label: `$(symbol-event) ${c.title}`, description: `${c.topic} · ${c.difficulty}`, dir: c.dir })),
  ];
  if (items.length === 0) {
    vscode.window.showInformationMessage('Nothing has been imported yet. Use "Import Challenges, Quizzes, Tests or Exams…" to add some.');
    return;
  }
  const picks = await vscode.window.showQuickPick(items, { title: 'Remove imported challenges, quizzes, tests or exams', canPickMany: true, ignoreFocusOut: true });
  if (!picks?.length) {
    return;
  }
  const answer = await vscode.window.showWarningMessage(
    `Remove ${picks.length} imported item${picks.length > 1 ? 's' : ''}?`,
    { modal: true, detail: 'They disappear from the sidebar. Your own code files are kept, and you can import them again later.' },
    'Remove',
  );
  if (answer !== 'Remove') {
    return;
  }
  for (const p of picks) {
    fs.rmSync(p.dir, { recursive: true, force: true });
    deps.output.appendLine(`[import] removed ${p.dir}`);
  }
  deps.reload();
}
