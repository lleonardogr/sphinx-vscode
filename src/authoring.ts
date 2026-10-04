// Commands for challenge authors: scaffold a new challenge and validate a challenge folder
// without needing Node.js or the extension's source code.
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { CUSTOM_TOPIC, Challenge, TOPIC_ORDER } from './challenges';
import { formatReport, reportPassed, validateChallenges } from './validator';

interface AuthoringDeps {
  extensionPath: string;
  output: vscode.OutputChannel;
  challenges: () => Challenge[];
  javaHome: () => string | undefined;
  reload: () => void;
}

const config = () => vscode.workspace.getConfiguration('techChallenges');

function slugify(title: string): string {
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
    add(p, 'from extraChallengePaths');
  }
  for (const ws of vscode.workspace.workspaceFolders ?? []) {
    const builtIn = path.join(ws.uri.fsPath, 'challenges');
    // Working on this repository itself: offer its challenges/ folder.
    if (fs.existsSync(path.join(builtIn, 'hello-world', 'challenge.json'))) {
      add(builtIn, 'built-in challenges (this repository)');
    }
    add(path.join(ws.uri.fsPath, 'my-challenges'), 'new folder in this workspace');
  }
  items.push({ label: '$(folder-opened) Choose a folder…' });
  return items;
}

async function pickFolder(deps: AuthoringDeps, title: string): Promise<string | undefined> {
  const pick = await vscode.window.showQuickPick(candidateFolders(deps), { title, placeHolder: 'Where are your challenges stored?', ignoreFocusOut: true });
  if (!pick) {
    return undefined;
  }
  if (pick.folder) {
    return pick.folder;
  }
  const chosen = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, openLabel: 'Use this folder' });
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
  vscode.window.showInformationMessage(`Added ${folder} to techChallenges.extraChallengePaths so its challenges appear in the sidebar.`);
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
  const folder = await pickFolder(deps, 'New challenge (1/4): folder');
  if (!folder) {
    return;
  }

  const title = await vscode.window.showInputBox({
    title: 'New challenge (2/4): title',
    prompt: 'The name students see, e.g. "Sum of Even Numbers"',
    ignoreFocusOut: true,
    validateInput: (v) => {
      const id = slugify(v);
      if (!id) {
        return 'Type a title';
      }
      return fs.existsSync(path.join(folder, id)) ? `A folder named "${id}" already exists` : undefined;
    },
  });
  if (!title) {
    return;
  }
  const id = slugify(title);

  const NO_TOPIC = `$(star-empty) ${CUSTOM_TOPIC} (no topic)`;
  const existingTopics = [...new Set([...TOPIC_ORDER, ...deps.challenges().map((c) => c.topic)])].filter((t) => t !== CUSTOM_TOPIC);
  const topicPick = await vscode.window.showQuickPick([NO_TOPIC, ...existingTopics, '$(add) New topic…'], {
    title: 'New challenge (3/4): topic',
    placeHolder: 'Challenges without a topic appear in the Custom folder',
    ignoreFocusOut: true,
  });
  if (!topicPick) {
    return;
  }
  let topic: string | undefined;
  if (topicPick.startsWith('$(add)')) {
    topic = (await vscode.window.showInputBox({ title: 'Topic name', prompt: 'e.g. Recursion, Collections, Exceptions', ignoreFocusOut: true }))?.trim();
    if (!topic) {
      return;
    }
  } else if (topicPick !== NO_TOPIC) {
    topic = topicPick;
  }

  const difficulty = await vscode.window.showQuickPick(['Easy', 'Medium', 'Hard'], { title: 'New challenge (4/4): difficulty', ignoreFocusOut: true });
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
    `Created "${title}" with example content. Edit the files, then run "Validate Challenges" to fill in the expected outputs.`,
    'Open Guide',
  );
  if (choice) {
    vscode.env.openExternal(vscode.Uri.parse('https://github.com/lleonardogr/tech-challenges-vscode/blob/main/docs/creating-challenges.md'));
  }
}

export async function validateFolder(deps: AuthoringDeps): Promise<void> {
  const folder = await pickFolder(deps, 'Validate challenges: folder');
  if (!folder) {
    return;
  }
  const mode = await vscode.window.showQuickPick(
    [
      { label: 'Validate', detail: 'Check that starters compile and reference solutions pass every test.', generate: false },
      { label: 'Validate and fill in expected outputs', detail: 'Run Solution.java on every test input and save its output into challenge.json, then check the other solutions.', generate: true },
    ],
    { title: 'Validate challenges', ignoreFocusOut: true },
  );
  if (!mode) {
    return;
  }

  deps.output.clear();
  deps.output.show(true);
  deps.output.appendLine(`Validating ${folder}…`);
  const report = await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: 'Validating challenges', cancellable: false },
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
    vscode.window.showWarningMessage(`No challenges found in ${folder}. Each challenge needs its own sub-folder with a challenge.json.`);
  } else if (reportPassed(report)) {
    vscode.window.showInformationMessage(`✓ All ${ok} challenges are valid${mode.generate ? ' and their expected outputs were saved' : ''}.`);
  } else {
    vscode.window.showErrorMessage(`${report.challenges.length - ok + report.loadErrors.length} challenge(s) have problems. See the "Tech Challenges" output for details.`);
  }
}
