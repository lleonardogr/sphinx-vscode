// Commands for challenge authors: scaffold a new challenge and validate a challenge folder
// without needing Node.js or the extension's source code.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { CUSTOM_TOPIC, Challenge, topicOrder } from './challenges';
import { formatReport, reportPassed, validateChallenges } from './validator';
import { LessonDefinition } from './lessons';
import { SubjectDef, allSubjects, findSubject, findUnit, subjectTitle } from './subjects';
import { unitName } from './path';
import { tr } from './i18n';

interface AuthoringDeps {
  extensionPath: string;
  output: vscode.OutputChannel;
  challenges: () => Challenge[];
  lessons?: () => LessonDefinition[];
  /** The subject shown in the sidebar. */
  subject?: () => string;
  javaHome: () => string | undefined;
  reload: () => void;
}

const config = () => vscode.workspace.getConfiguration('sphinx');

export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** The folders of the teacher's subjects: their own subject folders, and the ones that add units to a built-in subject. */
function teacherSubjectDirs(): { subject: SubjectDef; dir: string }[] {
  return allSubjects().flatMap((s) => [...(s.own ? [s.dir] : []), ...s.extensionDirs].map((dir) => ({ subject: s, dir })));
}

/** Folders the author is likely to put content in; `content` offers that folder of each of the teacher's subjects first. */
function candidateFolders(deps: AuthoringDeps, content?: 'challenges' | 'lessons'): { label: string; description?: string; folder?: string }[] {
  const items: { label: string; description?: string; folder?: string }[] = [];
  const seen = new Set<string>();
  const add = (folder: string, description: string, label = path.basename(folder) || folder) => {
    if (!seen.has(folder)) {
      seen.add(folder);
      items.push({ label, description: `${description} · ${folder}`, folder });
    }
  };
  if (content) {
    for (const { subject, dir } of teacherSubjectDirs()) {
      add(path.join(dir, content), tr(`your subject ${subjectTitle(subject)}`, `sua matéria ${subjectTitle(subject)}`), `${path.basename(dir)}/${content}`);
    }
  }
  for (const p of config().get<string[]>('extraChallengePaths', [])) {
    add(p, tr('from extraChallengePaths', 'de extraChallengePaths'));
  }
  for (const ws of vscode.workspace.workspaceFolders ?? []) {
    const builtIn = path.join(ws.uri.fsPath, 'challenges');
    // Working on this repository itself: offer its challenges/ folder.
    if (fs.existsSync(path.join(builtIn, 'hello-world', 'challenge.json'))) {
      add(builtIn, tr('built-in challenges (this repository)', 'desafios incluídos (este repositório)'));
    }
    add(path.join(ws.uri.fsPath, 'my-challenges'), tr('new folder in this workspace', 'nova pasta neste workspace'));
  }
  items.push({ label: `$(folder-opened) ${tr('Choose a folder…', 'Escolher uma pasta…')}` });
  return items;
}

async function pickFolder(deps: AuthoringDeps, title: string, content?: 'challenges' | 'lessons', placeHolder?: string): Promise<string | undefined> {
  const pick = await vscode.window.showQuickPick(candidateFolders(deps, content), {
    title,
    placeHolder: placeHolder ?? tr('Where are your challenges stored?', 'Onde ficam os seus desafios?'),
    ignoreFocusOut: true,
  });
  if (!pick) {
    return undefined;
  }
  if (pick.folder) {
    return pick.folder;
  }
  const chosen = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, openLabel: tr('Use this folder', 'Usar esta pasta') });
  return chosen?.[0]?.fsPath;
}

/** Makes sure a challenge folder shows up in the sidebar. */
async function ensureRegistered(folder: string, deps: AuthoringDeps): Promise<void> {
  const builtIn = path.join(deps.extensionPath, 'challenges');
  const paths = config().get<string[]>('extraChallengePaths', []);
  if (path.resolve(folder) === path.resolve(builtIn) || paths.some((p) => path.resolve(p) === path.resolve(folder))) {
    return;
  }
  // A content folder of one of the teacher's subjects is loaded with its subject.
  if (teacherSubjectDirs().some(({ dir }) => path.resolve(path.dirname(folder)) === path.resolve(dir))) {
    return;
  }
  // Inside a repository checkout the built-in folder is loaded only when running the dev build,
  // so register it anyway; duplicates by id are harmless (last one wins).
  await config().update('extraChallengePaths', [...paths, folder], vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage(tr(`Added ${folder} to sphinx.extraChallengePaths so its challenges appear in the sidebar.`, `${folder} foi adicionada a sphinx.extraChallengePaths para os desafios aparecerem na barra lateral.`));
}

/** `topic` undefined writes no "topic", so the challenge appears under Others. */
function templates(title: string, topic: string | undefined, difficulty: string, order: number): Record<string, string> {
  const challengeJson = {
    title,
    ...(topic ? { topic } : {}),
    difficulty,
    order,
    hints: [
      'A gentle first hint: which concept should the student think about?',
      'A more specific hint: what should they look at or change?',
    ],
    mustContain: [],
    mustNotContain: [],
    tests: [
      { input: '3 4\n', output: '' },
      { input: '10 20\n', output: '' },
      { input: '0 0\n', output: '', hidden: true },
      { input: '-5 2\n', output: '', hidden: true },
    ],
  };
  return {
    'challenge.json': JSON.stringify(challengeJson, null, 2) + '\n',
    'description.md': `# ${title}

<!-- Explain the task in one or two sentences. Students only see this file and the examples. -->
Read two whole numbers and print their sum.

**Input**

One line with two integers \`a\` and \`b\`.

**Output**

The value of \`a + b\`.

**Things to know**

- \`IO.readln()\` reads a whole line, and \`Integer.parseInt(text)\` turns text into an \`int\`.
`,
    'Starter.java': `// Modern Java (JDK 25+): IO.readln() reads one line of input.
void main() {
    String[] parts = IO.readln().trim().split(" ");
    int a = Integer.parseInt(parts[0]);
    int b = Integer.parseInt(parts[1]);

    // TODO: print the sum
}
`,
    'Starter.classic.java': `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        // TODO: print the sum
    }
}
`,
    'Solution.java': `// Reference solution (modern Java). Never shipped to students.
void main() {
    String[] parts = IO.readln().trim().split(" ");
    int a = Integer.parseInt(parts[0]);
    int b = Integer.parseInt(parts[1]);
    IO.println(a + b);
}
`,
    'Solution.classic.java': `// Reference solution (classic Java). Never shipped to students.
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
    }
}
`,
  };
}

/** Writes a complete, valid example challenge into `dir`. */
export function writeChallengeTemplate(dir: string, title: string, topic: string | undefined, difficulty: string, order: number): void {
  fs.mkdirSync(dir, { recursive: true });
  for (const [file, content] of Object.entries(templates(title, topic, difficulty, order))) {
    fs.writeFileSync(path.join(dir, file), content);
  }
}

export async function createChallenge(deps: AuthoringDeps): Promise<void> {
  const folder = await pickFolder(deps, tr('New challenge (1/4): folder', 'Novo desafio (1/4): pasta'), 'challenges');
  if (!folder) {
    return;
  }

  const title = await vscode.window.showInputBox({
    title: tr('New challenge (2/4): title', 'Novo desafio (2/4): título'),
    prompt: tr('The name students see, e.g. "Sum of Even Numbers"', 'O nome que os alunos veem, por exemplo "Soma dos pares"'),
    ignoreFocusOut: true,
    validateInput: (v) => {
      const id = slugify(v);
      if (!id) {
        return tr('Type a title', 'Digite um título');
      }
      return fs.existsSync(path.join(folder, id)) ? tr(`A folder named "${id}" already exists`, `Já existe uma pasta chamada "${id}"`) : undefined;
    },
  });
  if (!title) {
    return;
  }
  const id = slugify(title);

  const NO_TOPIC = `$(star-empty) ${tr('No unit (the Others section)', 'Sem unidade (a seção Outros)')}`;
  const existingTopics = [...new Set([...topicOrder(), ...deps.challenges().map((c) => c.topic)])].filter((t) => t !== CUSTOM_TOPIC);
  const NEW_TOPIC = `$(add) ${tr('New topic…', 'Nova unidade…')}`;
  const topicPick = await vscode.window.showQuickPick([NO_TOPIC, ...existingTopics, NEW_TOPIC], {
    title: tr('New challenge (3/4): unit', 'Novo desafio (3/4): unidade'),
    placeHolder: tr('Challenges without a unit appear in the Others section', 'Desafios sem unidade aparecem na seção Outros'),
    ignoreFocusOut: true,
  });
  if (!topicPick) {
    return;
  }
  let topic: string | undefined;
  if (topicPick === NEW_TOPIC) {
    topic = (await vscode.window.showInputBox({ title: tr('Topic name', 'Nome da unidade'), prompt: tr('e.g. Graphs, Files, Dates', 'por exemplo Grafos, Arquivos, Datas'), ignoreFocusOut: true }))?.trim();
    if (!topic) {
      return;
    }
  } else if (topicPick !== NO_TOPIC) {
    topic = topicPick;
  }

  const difficulty = await vscode.window.showQuickPick(['Easy', 'Medium', 'Hard'], { title: tr('New challenge (4/4): difficulty', 'Novo desafio (4/4): dificuldade'), ignoreFocusOut: true });
  if (!difficulty) {
    return;
  }

  const order = Math.max(0, ...deps.challenges().filter((c) => c.topic === (topic ?? CUSTOM_TOPIC)).map((c) => c.order)) + 1;
  const dir = path.join(folder, id);
  writeChallengeTemplate(dir, title, topic, difficulty, order);

  await ensureRegistered(folder, deps);
  deps.reload();

  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'description.md')), { viewColumn: vscode.ViewColumn.One, preview: false });
  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'challenge.json')), { viewColumn: vscode.ViewColumn.Two, preview: false });
  const choice = await vscode.window.showInformationMessage(
    tr(
      `Created "${title}" with example content. Edit the files, then run "Validate Challenges" to fill in the expected outputs.`,
      `"${title}" foi criado com um conteúdo de exemplo. Edite os arquivos e rode "Validar desafios" para gerar as saídas esperadas.`,
    ),
    tr('Open Guide', 'Abrir o guia'),
  );
  if (choice) {
    vscode.env.openExternal(vscode.Uri.parse('https://github.com/lleonardogr/sphinx-vscode/blob/main/docs/creating-challenges.md'));
  }
}

/** A quick guide (programming subjects) or a reading guide (theory subjects); see docs/content-guide.md. */
export type LessonStyle = 'quick' | 'reading';

/** Where a lesson goes: a unit, or no unit in a subject (its Others section). */
export type LessonPlace = { topic: string } | { subject: string };

/** The example link of a new lesson: the validator warns until it is replaced. */
export const EXAMPLE_READING_URL = 'https://example.com/replace-with-your-reading';

/** The files of a new lesson, written in the current interface language. */
export function lessonTemplates(title: string, place: LessonPlace, order: number, style: LessonStyle): Record<string, string> {
  const quick = style === 'quick';
  const objectives = quick
    ? [tr('Write … (what students can do after this unit, with a verb you can check).', 'Escrever … (o que os alunos conseguem fazer depois desta unidade, com um verbo que dá para conferir).'), tr('Predict … (a second objective).', 'Prever … (um segundo objetivo).')]
    : [
        tr('Explain … (what students can do after this unit, with a verb you can check).', 'Explicar … (o que os alunos conseguem fazer depois desta unidade, com um verbo que dá para conferir).'),
        tr('Calculate … (a second objective).', 'Calcular … (um segundo objetivo).'),
        tr('Trace … (a third objective).', 'Acompanhar … (um terceiro objetivo).'),
      ];
  const lessonJson = {
    title,
    ...place,
    order,
    objectives,
    readings: [
      {
        title: tr('The title of the page', 'O título da página'),
        source: tr('Who publishes it, such as dev.java or freeCodeCamp', 'Quem a publica, como dev.java ou freeCodeCamp'),
        url: EXAMPLE_READING_URL,
        type: 'article',
        minutes: 5,
        lang: 'en',
        lookFor: tr('What to read on the page, and what to skip.', 'O que ler na página, e o que pular.'),
      },
    ],
  };
  const quickMd = tr(
    `## In short

<!-- A quick guide: 60 to 120 words around one short example. The unit's challenges do the teaching. -->
Write the key idea here, in two or three short sentences, with the words the challenges use.

\`\`\`java
void main() {
    // One short example (about 10 lines) in the style of the starters.
    // Show the syntax on a different problem from the challenges.
    IO.println("Hello");
}
\`\`\`

**Watch out:** the mistake students make first.

<!-- readings -->
`,
    `## Em resumo

<!-- Um guia rápido: 60 a 120 palavras em volta de um exemplo curto. Os desafios da unidade é que ensinam. -->
Escreva aqui a ideia principal, em duas ou três frases curtas, com as palavras que os desafios usam.

\`\`\`java
void main() {
    // Um exemplo curto (umas 10 linhas) no estilo dos códigos iniciais.
    // Mostre a sintaxe num problema diferente dos desafios.
    IO.println("Olá");
}
\`\`\`

**Cuidado:** o erro que os alunos cometem primeiro.

<!-- readings -->
`,
  );
  const readingMd = tr(
    `## In short

<!-- A reading guide: 150 to 250 words with the key idea, the words the exercises use, and the fact students most often get wrong.
     Add one diagram if the idea is visual: put an SVG next to this file and write ![What it shows](diagram.svg). -->
Write the key idea here.

<!-- readings -->

## Check yourself

1. A question the reading should let students answer.
2. Another one, pointing to the quiz.
`,
    `## Em resumo

<!-- Um guia de leitura: 150 a 250 palavras com a ideia principal, as palavras que os exercícios usam e o que os alunos mais erram.
     Acrescente um diagrama se a ideia for visual: coloque um SVG ao lado deste arquivo e escreva ![O que ele mostra](diagrama.svg). -->
Escreva aqui a ideia principal.

<!-- readings -->

## Confira

1. Uma pergunta que a leitura deve deixar os alunos responderem.
2. Outra, que leve ao quiz.
`,
  );
  return { 'lesson.json': JSON.stringify(lessonJson, null, 2) + '\n', 'lesson.md': quick ? quickMd : readingMd };
}

/** Writes a new lesson into `dir`. */
export function writeLessonTemplate(dir: string, title: string, place: LessonPlace, order: number, style: LessonStyle): void {
  fs.mkdirSync(dir, { recursive: true });
  for (const [file, content] of Object.entries(lessonTemplates(title, place, order, style))) {
    fs.writeFileSync(path.join(dir, file), content);
  }
}

export async function createLesson(deps: AuthoringDeps): Promise<void> {
  const folder = await pickFolder(deps, tr('New lesson (1/4): folder', 'Nova lição (1/4): pasta'), 'lessons', tr('Where are your lessons stored?', 'Onde ficam as suas lições?'));
  if (!folder) {
    return;
  }

  const title = await vscode.window.showInputBox({
    title: tr('New lesson (2/4): title', 'Nova lição (2/4): título'),
    prompt: tr('The name students see, e.g. "Working with Files"', 'O nome que os alunos veem, por exemplo "Trabalhando com arquivos"'),
    ignoreFocusOut: true,
    validateInput: (v) => {
      const id = slugify(v);
      if (!id) {
        return tr('Type a title', 'Digite um título');
      }
      return fs.existsSync(path.join(folder, id)) ? tr(`A folder named "${id}" already exists`, `Já existe uma pasta chamada "${id}"`) : undefined;
    },
  });
  if (!title) {
    return;
  }

  // Units grouped by subject, the sidebar's subject first, then "no unit" for each subject.
  type PlacePick = vscode.QuickPickItem & { place?: LessonPlace; subject?: string };
  const current = deps.subject?.();
  const subjects = [...allSubjects()].sort((a, b) => Number(b.id === current) - Number(a.id === current));
  const placePicks: PlacePick[] = subjects.flatMap((s) => [
    { label: subjectTitle(s), kind: vscode.QuickPickItemKind.Separator },
    ...s.units.map((u, i): PlacePick => ({ label: `${i + 1} · ${unitName(u.key)}`, place: { topic: u.key }, subject: s.id })),
    { label: `$(star-empty) ${tr('No unit (the Others section)', 'Sem unidade (a seção Outros)')}`, place: { subject: s.id }, subject: s.id },
  ]);
  const placePick = await vscode.window.showQuickPick(placePicks, {
    title: tr('New lesson (3/4): unit', 'Nova lição (3/4): unidade'),
    placeHolder: tr('The lesson opens its unit, before the challenges', 'A lição abre a unidade, antes dos desafios'),
    ignoreFocusOut: true,
  });
  if (!placePick?.place) {
    return;
  }

  const programming = findSubject(placePick.subject)?.kind === 'programming';
  const styles: (vscode.QuickPickItem & { style: LessonStyle })[] = [
    {
      label: tr('Quick guide', 'Guia rápido'),
      description: programming ? tr('recommended for programming subjects', 'recomendado para matérias de programação') : '',
      detail: tr('A one-minute summary around one code example, a "Watch out" line and one reading.', 'Um resumo de um minuto em volta de um exemplo de código, uma linha de "Cuidado" e uma leitura.'),
      style: 'quick',
    },
    {
      label: tr('Reading guide', 'Guia de leitura'),
      description: programming ? '' : tr('recommended for theory subjects', 'recomendado para matérias teóricas'),
      detail: tr('A longer summary with a diagram, up to three readings and "Check yourself" questions.', 'Um resumo mais longo com um diagrama, até três leituras e perguntas de "Confira".'),
      style: 'reading',
    },
  ];
  if (!programming) {
    styles.reverse();
  }
  const style = await vscode.window.showQuickPick(styles, { title: tr('New lesson (4/4): kind', 'Nova lição (4/4): tipo'), ignoreFocusOut: true });
  if (!style) {
    return;
  }

  const topic = 'topic' in placePick.place ? placePick.place.topic : '';
  const order = Math.max(0, ...(deps.lessons?.() ?? []).filter((l) => l.topic === topic).map((l) => l.order)) + 1;
  const id = slugify(title);
  const dir = path.join(folder, id);
  writeLessonTemplate(dir, title, placePick.place, order, style.style);

  await ensureRegistered(folder, deps);
  deps.reload();

  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'lesson.md')), { viewColumn: vscode.ViewColumn.One, preview: false });
  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'lesson.json')), { viewColumn: vscode.ViewColumn.Two, preview: false });
  const preview = tr('Preview', 'Visualizar');
  const guide = tr('Open Guide', 'Abrir o guia');
  const choice = await vscode.window.showInformationMessage(
    tr(
      `Created the lesson "${title}". Write the summary in lesson.md, then the objectives and readings in lesson.json. Save and press Preview to see it as students will.`,
      `A lição "${title}" foi criada. Escreva o resumo no lesson.md, depois os objetivos e as leituras no lesson.json. Salve e clique em Visualizar para vê-la como os alunos verão.`,
    ),
    preview,
    guide,
  );
  if (choice === preview) {
    deps.reload();
    await vscode.commands.executeCommand('sphinx.openLesson', id);
  } else if (choice === guide) {
    vscode.env.openExternal(vscode.Uri.parse('https://github.com/lleonardogr/sphinx-vscode/blob/main/docs/content-guide.md#reading-guides'));
  }
}

/** A unit key from its title ("Linked Lists" → "LinkedLists"), made unique across every subject. */
export function unitKeyFor(title: string): string {
  const base = slugify(title).split('-').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('') || 'Unit';
  const start = /^[A-Za-z]/.test(base) ? base : `Unit${base}`;
  let key = start;
  for (let n = 2; findUnit(key); n++) {
    key = `${start}${n}`;
  }
  return key;
}

function readJson(file: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file: string, data: unknown): void {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

/** Writes a subject folder: subject.json with one unit, and empty folders for its content. */
export function writeSubjectTemplate(dir: string, id: string, title: string, kind: 'programming' | 'theory', unit: { key: string; title: string }): void {
  fs.mkdirSync(dir, { recursive: true });
  writeJson(path.join(dir, 'subject.json'), { id, title, kind, order: 100, units: [{ key: unit.key, title: unit.title, icon: 'folder' }] });
  for (const content of ['lessons', 'challenges', 'quizzes']) {
    fs.mkdirSync(path.join(dir, content), { recursive: true });
  }
}

/** Adds a unit to the subject.json in `dir` (a teacher's subject, or the folder that adds units to a built-in one). */
export function addUnitToSubjectFile(dir: string, unit: { key: string; title: string }): void {
  const file = path.join(dir, 'subject.json');
  const meta = readJson(file);
  const units = Array.isArray(meta.units) ? meta.units : [];
  writeJson(file, { ...meta, units: [...units, { key: unit.key, title: unit.title, icon: 'folder' }] });
}

/** After a subject or unit is created: show it in the sidebar and offer the next step. */
async function afterSubjectChange(deps: AuthoringDeps, subjectId: string, message: string): Promise<void> {
  deps.reload();
  await vscode.commands.executeCommand('sphinx.switchSubject', subjectId);
  const lesson = tr('Create a Lesson', 'Criar uma lição');
  const challenge = tr('Create a Challenge', 'Criar um desafio');
  const choice = await vscode.window.showInformationMessage(message, lesson, challenge);
  if (choice === lesson) {
    await vscode.commands.executeCommand('sphinx.createLesson');
  } else if (choice === challenge) {
    await vscode.commands.executeCommand('sphinx.createChallenge');
  }
}

export async function createSubject(deps: AuthoringDeps): Promise<void> {
  const folder = await pickFolder(deps, tr('New subject (1/4): folder', 'Nova matéria (1/4): pasta'), undefined, tr('Where should the subject folder go?', 'Onde deve ficar a pasta da matéria?'));
  if (!folder) {
    return;
  }
  const title = await vscode.window.showInputBox({
    title: tr('New subject (2/4): name', 'Nova matéria (2/4): nome'),
    prompt: tr('The name students see in the subject switcher, e.g. "Data Structures"', 'O nome que os alunos veem na troca de matéria, por exemplo "Estruturas de dados"'),
    ignoreFocusOut: true,
    validateInput: (v) => {
      const id = slugify(v);
      if (!id) {
        return tr('Type a name', 'Digite um nome');
      }
      if (findSubject(id)) {
        return tr(`There is already a subject with the id "${id}"`, `Já existe uma matéria com o id "${id}"`);
      }
      return fs.existsSync(path.join(folder, id)) ? tr(`A folder named "${id}" already exists`, `Já existe uma pasta chamada "${id}"`) : undefined;
    },
  });
  if (!title) {
    return;
  }
  const kind = await vscode.window.showQuickPick(
    [
      { label: tr('Programming', 'Programação'), detail: tr('Students learn by writing code: units open with a quick guide.', 'Os alunos aprendem escrevendo código: as unidades abrem com um guia rápido.'), subjectKind: 'programming' as const },
      { label: tr('Theory', 'Teoria'), detail: tr('Ideas to understand first: units open with a reading guide.', 'Ideias para entender primeiro: as unidades abrem com um guia de leitura.'), subjectKind: 'theory' as const },
    ],
    { title: tr('New subject (3/4): kind', 'Nova matéria (3/4): tipo'), ignoreFocusOut: true },
  );
  if (!kind) {
    return;
  }
  const unitTitle = await vscode.window.showInputBox({
    title: tr('New subject (4/4): first unit', 'Nova matéria (4/4): primeira unidade'),
    prompt: tr('The name of the first unit, e.g. "Linked Lists". Add more later with Create New Unit.', 'O nome da primeira unidade, por exemplo "Listas ligadas". Acrescente outras depois com Criar nova unidade.'),
    ignoreFocusOut: true,
    validateInput: (v) => (slugify(v) ? undefined : tr('Type a name', 'Digite um nome')),
  });
  if (!unitTitle) {
    return;
  }
  const id = slugify(title);
  const unit = { key: unitKeyFor(unitTitle), title: unitTitle.trim() };
  writeSubjectTemplate(path.join(folder, id), id, title.trim(), kind.subjectKind, unit);
  await ensureRegistered(folder, deps);
  await afterSubjectChange(
    deps,
    id,
    tr(
      `Created the subject "${title.trim()}" with its first unit, "${unit.title}". Its lessons, challenges and quizzes go in its folder (${path.join(folder, id)}).`,
      `A matéria "${title.trim()}" foi criada com a primeira unidade, "${unit.title}". As lições, desafios e quizzes dela ficam na pasta dela (${path.join(folder, id)}).`,
    ),
  );
}

export async function createUnit(deps: AuthoringDeps): Promise<void> {
  const current = deps.subject?.();
  const subjects = [...allSubjects()].sort((a, b) => Number(b.id === current) - Number(a.id === current));
  const subjectPick = await vscode.window.showQuickPick(
    subjects.map((s) => ({
      label: subjectTitle(s),
      description: s.own
        ? tr(`your subject · ${s.units.length} units`, `sua matéria · ${s.units.length} unidades`)
        : tr(`built in · the new unit comes after unit ${s.units.length}`, `incluída · a nova unidade vem depois da unidade ${s.units.length}`),
      subject: s,
    })),
    { title: tr('New unit (1/2): subject', 'Nova unidade (1/2): matéria'), ignoreFocusOut: true },
  );
  if (!subjectPick) {
    return;
  }
  const subject = subjectPick.subject;
  const unitTitle = await vscode.window.showInputBox({
    title: tr('New unit (2/2): name', 'Nova unidade (2/2): nome'),
    prompt: tr('The unit name students see, e.g. "Files"', 'O nome da unidade que os alunos veem, por exemplo "Arquivos"'),
    ignoreFocusOut: true,
    validateInput: (v) => (slugify(v) ? undefined : tr('Type a name', 'Digite um nome')),
  });
  if (!unitTitle) {
    return;
  }
  const unit = { key: unitKeyFor(unitTitle), title: unitTitle.trim() };
  // A teacher's subject keeps its units in its own subject.json. Units added to a built-in subject go in a
  // teacher's folder named after it, with a subject.json that only lists the added units.
  let dir = subject.own ? subject.dir : subject.extensionDirs[0];
  if (dir) {
    addUnitToSubjectFile(dir, unit);
  } else {
    const folder = await pickFolder(deps, tr('Where should the added units go?', 'Onde devem ficar as unidades acrescentadas?'), undefined, tr(`A "${subject.id}" folder is created there for your units and their content`, `Uma pasta "${subject.id}" é criada ali para as suas unidades e o conteúdo delas`));
    if (!folder) {
      return;
    }
    dir = path.join(folder, subject.id);
    if (fs.existsSync(path.join(dir, 'subject.json'))) {
      addUnitToSubjectFile(dir, unit);
    } else {
      fs.mkdirSync(dir, { recursive: true });
      writeJson(path.join(dir, 'subject.json'), { id: subject.id, title: subject.titles.en, units: [{ key: unit.key, title: unit.title, icon: 'folder' }] });
      for (const content of ['lessons', 'challenges', 'quizzes']) {
        fs.mkdirSync(path.join(dir, content), { recursive: true });
      }
    }
    await ensureRegistered(folder, deps);
  }
  await afterSubjectChange(
    deps,
    subject.id,
    tr(
      `Added the unit "${unit.title}" to ${subjectTitle(subject)}, as unit ${subject.units.length + 1}. Its key, for "topic" in content files, is ${unit.key}.`,
      `A unidade "${unit.title}" foi acrescentada a ${subjectTitle(subject)}, como unidade ${subject.units.length + 1}. A chave dela, para o "topic" dos arquivos de conteúdo, é ${unit.key}.`,
    ),
  );
}

export async function validateFolder(deps: AuthoringDeps): Promise<void> {
  const folder = await pickFolder(deps, tr('Validate challenges: folder', 'Validar desafios: pasta'));
  if (!folder) {
    return;
  }
  const mode = await vscode.window.showQuickPick(
    [
      { label: tr('Validate', 'Validar'), detail: tr('Check that starters compile and reference solutions pass every test.', 'Confere se os códigos iniciais compilam e se as soluções passam em todos os testes.'), generate: false },
      {
        label: tr('Validate and fill in expected outputs', 'Validar e gerar as saídas esperadas'),
        detail: tr(
          'Run Solution.java on every test input and save its output into challenge.json, then check the other solutions.',
          'Roda o Solution.java em cada entrada de teste, salva a saída no challenge.json e confere as outras soluções.',
        ),
        generate: true,
      },
    ],
    { title: tr('Validate challenges', 'Validar desafios'), ignoreFocusOut: true },
  );
  if (!mode) {
    return;
  }

  deps.output.clear();
  deps.output.show(true);
  deps.output.appendLine(tr(`Validating ${folder}…`, `Validando ${folder}…`));
  const report = await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: tr('Validating challenges', 'Validando desafios'), cancellable: false },
    (progress) =>
      validateChallenges([folder], {
        generate: mode.generate,
        referenceRoots: ['challenges', 'custom', 'tests'].map((dir) => path.join(deps.extensionPath, dir)),
        javaHome: deps.javaHome(),
        onChallenge: (c) => progress.report({ message: c.id }),
      }),
  );
  formatReport(report, mode.generate).forEach((line) => deps.output.appendLine(line));
  deps.reload();

  const ok = report.challenges.filter((c) => c.ok).length;
  if (report.challenges.length === 0 && report.loadErrors.length === 0) {
    vscode.window.showWarningMessage(tr(`No challenges found in ${folder}. Each challenge needs its own sub-folder with a challenge.json.`, `Nenhum desafio encontrado em ${folder}. Cada desafio precisa da sua própria subpasta com um challenge.json.`));
  } else if (reportPassed(report)) {
    vscode.window.showInformationMessage(
      tr(`✓ All ${ok} challenges are valid${mode.generate ? ' and their expected outputs were saved' : ''}.`, `✓ Os ${ok} desafios são válidos${mode.generate ? ' e as saídas esperadas foram salvas' : ''}.`),
    );
  } else {
    vscode.window.showErrorMessage(
      tr(
        `${report.challenges.length - ok + report.loadErrors.length} challenge(s) have problems. See the "Sphinx" output for details.`,
        `${report.challenges.length - ok + report.loadErrors.length} desafio(s) com problemas. Veja os detalhes na saída "Sphinx".`,
      ),
    );
  }
}
