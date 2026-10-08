// Commands for challenge authors: scaffold a new challenge and validate a challenge folder
// without needing Node.js or the extension's source code.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { CUSTOM_TOPIC, Challenge, topicOrder } from './challenges';
import { formatReport, reportPassed, validateChallenges } from './validator';
import { LessonDefinition } from './lessons';
import { allSubjects, findSubject, subjectTitle } from './subjects';
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

/** Folders the author is likely to put challenges in. */
function candidateFolders(deps: AuthoringDeps): { label: string; description?: string; folder?: string }[] {
  const items: { label: string; description?: string; folder?: string }[] = [];
  const seen = new Set<string>();
  const add = (folder: string, description: string) => {
    if (!seen.has(folder)) {
      seen.add(folder);
      items.push({ label: path.basename(folder) || folder, description: `${description} · ${folder}`, folder });
    }
  };
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

async function pickFolder(deps: AuthoringDeps, title: string): Promise<string | undefined> {
  const pick = await vscode.window.showQuickPick(candidateFolders(deps), { title, placeHolder: tr('Where are your challenges stored?', 'Onde ficam os seus desafios?'), ignoreFocusOut: true });
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
  // Inside a repository checkout the built-in folder is loaded only when running the dev build,
  // so register it anyway; duplicates by id are harmless (last one wins).
  await config().update('extraChallengePaths', [...paths, folder], vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage(tr(`Added ${folder} to sphinx.extraChallengePaths so its challenges appear in the sidebar.`, `${folder} foi adicionada a sphinx.extraChallengePaths para os desafios aparecerem na barra lateral.`));
}

/** `topic` undefined writes no "topic", so the challenge appears under Custom. */
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
  const folder = await pickFolder(deps, tr('New challenge (1/4): folder', 'Novo desafio (1/4): pasta'));
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

  const NO_TOPIC = `$(star-empty) ${tr('Custom (no topic)', 'Personalizado (sem unidade)')}`;
  const existingTopics = [...new Set([...topicOrder(), ...deps.challenges().map((c) => c.topic)])].filter((t) => t !== CUSTOM_TOPIC);
  const NEW_TOPIC = `$(add) ${tr('New topic…', 'Nova unidade…')}`;
  const topicPick = await vscode.window.showQuickPick([NO_TOPIC, ...existingTopics, NEW_TOPIC], {
    title: tr('New challenge (3/4): unit', 'Novo desafio (3/4): unidade'),
    placeHolder: tr('Challenges without a unit appear in the Custom section', 'Desafios sem unidade aparecem na seção Personalizados'),
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

/** Where a lesson goes: a unit, or no unit in a subject (its Custom section). */
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
  const folder = await pickFolder(deps, tr('New lesson (1/4): folder', 'Nova lição (1/4): pasta'));
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
    { label: `$(star-empty) ${tr('No unit (the Custom section)', 'Sem unidade (a seção Personalizados)')}`, place: { subject: s.id }, subject: s.id },
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
