// "Generate with AI": drafts a challenge, a mixed test or a whole exam with the AI provider from
// the settings (local or remote), then proves it works before saving it. Expected outputs come
// from running the model's Solution.java, the classic solution must agree, and any problem the
// validator finds is sent back to the model to fix (up to MAX_ATTEMPTS answers).
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { AiHints } from './ai/hints';
import {
  ExamPlan,
  GenerationSpec,
  buildExamPlanPrompt,
  buildGenerationPrompt,
  buildRepairPrompt,
  checkGeneratedOutputs,
  cleanChallengeJson,
  missingFiles,
  parseExamPlan,
  parseFiles,
} from './ai/authoringPrompt';
import { AiError, HintProvider } from './ai/providers';
import { AuthoringDeps, ensureRegistered, pickFolder, slugify } from './authoring';
import { CUSTOM_TOPIC, TOPIC_ORDER } from './challenges';
import { TestCase, javacMajorVersion, runChallengeCode } from './runner';
import { validateChallenges } from './validator';

const MAX_ATTEMPTS = 3;
type Difficulty = GenerationSpec['difficulty'];

interface GenerationResult {
  ok: boolean;
  /** Staged challenge folder (in a temp directory), when the model produced usable files. */
  dir?: string;
  title: string;
  attempts: number;
  problems: string[];
}

interface Run {
  provider: HintProvider;
  signal: AbortSignal;
  log: (line: string) => void;
  report: (message: string) => void;
  javaHome?: string;
}

async function complete(run: Run, prompt: { system: string; user: string }): Promise<string> {
  let text = '';
  await run.provider.stream(prompt.system, prompt.user, (t) => (text += t), run.signal);
  if (run.signal.aborted) {
    throw new vscode.CancellationError();
  }
  return text;
}

function referenceRoots(deps: AuthoringDeps): string[] {
  return ['challenges', 'custom', 'tests'].map((dir) => path.join(deps.extensionPath, dir));
}

/** Generates one challenge into a fresh temp folder, validating and repairing it. */
async function generateOne(deps: AuthoringDeps, run: Run, spec: GenerationSpec, label: string): Promise<GenerationResult> {
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'tech-challenges-ai-'));
  let prompt = buildGenerationPrompt(spec);
  let files: Record<string, string> = {};
  let problems: string[] = [];
  let dir: string | undefined;
  let title = '';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    run.report(attempt === 1 ? `${label}: writing…` : `${label}: fixing problems (attempt ${attempt} of ${MAX_ATTEMPTS})…`);
    const answer = await complete(run, prompt);
    run.log(`\n--- ${label}, answer ${attempt} (${answer.length} characters)`);

    const parsed = parseFiles(answer);
    // Keep good files from earlier answers when a repair answer leaves some out.
    files = { ...files, ...parsed.files };
    problems = missingFiles(files);
    if (parsed.files['challenge.json']) {
      const clean = cleanChallengeJson(parsed.files['challenge.json'], spec, 1);
      problems.push(...clean.problems);
      if (!clean.problems.some((p) => p.includes('not valid JSON'))) {
        files['challenge.json'] = JSON.stringify(clean.json, null, 2) + '\n';
        title = String(clean.json.title || title);
      }
    }
    if (Object.keys(parsed.files).length === 0) {
      run.log(answer.slice(0, 2000));
    }

    if (problems.length === 0) {
      // Write the draft and prove it: starters compile, Solution.java produces the outputs,
      // the other solutions must match them and follow the rules.
      fs.rmSync(staging, { recursive: true, force: true });
      dir = path.join(staging, slugify(title) || 'ai-challenge');
      fs.mkdirSync(dir, { recursive: true });
      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(dir, name), content);
      }
      run.report(`${label}: compiling and running the solutions…`);
      const report = await validateChallenges([staging], { generate: true, javaHome: run.javaHome, referenceRoots: referenceRoots(deps) });
      problems = [...report.loadErrors, ...report.challenges.flatMap((c) => c.problems)];
      if (problems.length === 0) {
        problems = await sanityCheck(dir, run, report.javacVersion);
      }
      if (problems.length === 0) {
        run.log(`✓ ${title}: valid after ${attempt} answer(s)`);
        return { ok: true, dir, title, attempts: attempt, problems };
      }
    }
    problems.forEach((p) => run.log(`  ✗ ${p}`));
    prompt = buildRepairPrompt(spec, files, problems);
  }
  return { ok: false, dir, title: title || 'AI challenge', attempts: MAX_ATTEMPTS, problems };
}

/**
 * Checks the validator can't: the reference solution must depend on the input, and the starters
 * must not already solve the challenge.
 */
async function sanityCheck(dir: string, run: Run, javacVersion: number | undefined): Promise<string[]> {
  const tests = JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8')).tests as TestCase[];
  const problems = checkGeneratedOutputs(tests);
  for (const starter of ['Starter.java', 'Starter.classic.java']) {
    const file = path.join(dir, starter);
    if (!fs.existsSync(file) || (!starter.includes('.classic.') && (javacVersion ?? 0) < 25)) {
      continue;
    }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tech-challenges-ai-starter-'));
    try {
      fs.copyFileSync(file, path.join(tmp, 'Main.java'));
      const outcome = await runChallengeCode({ file: path.join(tmp, 'Main.java'), tests, javaHome: run.javaHome });
      if (outcome.kind === 'tests' && outcome.results.every((r) => r.passed)) {
        problems.push(`${starter} already passes every test, so it gives the solution away. Leave the real work as TODO comments.`);
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }
  return problems;
}

/** Moves a staged folder into `parent`, picking a free name. Returns the new path. */
function moveInto(staged: string, parent: string): string {
  fs.mkdirSync(parent, { recursive: true });
  const base = path.basename(staged);
  let target = path.join(parent, base);
  for (let i = 2; fs.existsSync(target); i++) {
    target = path.join(parent, `${base}-${i}`);
  }
  fs.cpSync(staged, target, { recursive: true });
  fs.rmSync(staged, { recursive: true, force: true });
  const stagingRoot = path.dirname(staged);
  if (stagingRoot.startsWith(os.tmpdir()) && path.basename(stagingRoot).startsWith('tech-challenges-ai-') && fs.readdirSync(stagingRoot).length === 0) {
    fs.rmdirSync(stagingRoot);
  }
  return target;
}

// ---------------------------------------------------------------- questions for the author

async function askDifficulty(title: string): Promise<Difficulty | undefined> {
  return (await vscode.window.showQuickPick(['Easy', 'Medium', 'Hard'], { title, ignoreFocusOut: true })) as Difficulty | undefined;
}

async function askRequest(title: string, prompt: string, placeHolder: string): Promise<string | undefined> {
  return vscode.window.showInputBox({ title, prompt, placeHolder, ignoreFocusOut: true });
}

async function askChallengeSpec(deps: AuthoringDeps, kind: 'challenge' | 'test', language: string): Promise<GenerationSpec | undefined> {
  const existingTitles = deps.challenges().map((c) => c.title);
  if (kind === 'test') {
    const request = await askRequest(
      'Generate a test (1/2): what should the app do?',
      'Describe the menu app, or leave empty to let the AI choose',
      'e.g. a library app to add, borrow and return books, using a list and methods',
    );
    if (request === undefined) {
      return undefined;
    }
    const difficulty = await askDifficulty('Generate a test (2/2): difficulty');
    return difficulty && { kind, request, topic: 'Tests', difficulty, language, existingTitles };
  }

  const NO_TOPIC = `$(star-empty) ${CUSTOM_TOPIC} (no topic)`;
  const topics = [...new Set([...TOPIC_ORDER, ...deps.challenges().map((c) => c.topic)])].filter((t) => t !== CUSTOM_TOPIC && t !== 'Tests');
  const topicPick = await vscode.window.showQuickPick([...topics, NO_TOPIC], { title: 'Generate a challenge (1/3): topic', ignoreFocusOut: true });
  if (!topicPick) {
    return undefined;
  }
  const topic = topicPick === NO_TOPIC ? undefined : topicPick;
  const difficulty = await askDifficulty('Generate a challenge (2/3): difficulty');
  if (!difficulty) {
    return undefined;
  }
  const request = await askRequest(
    'Generate a challenge (3/3): what should it practise?',
    'Describe the exercise, or leave empty to let the AI choose',
    'e.g. a while loop that counts the digits of a number, with negative numbers',
  );
  return request === undefined ? undefined : { kind, request, topic, difficulty, language, existingTitles };
}

interface ExamSpec {
  request: string;
  questions: number;
  durationMinutes: number;
  mode: 'open' | 'closed';
}

async function askExamSpec(): Promise<ExamSpec | undefined> {
  const request = await askRequest(
    'Generate an exam (1/4): what should it cover?',
    'Topics and level. The AI writes new, private questions for it.',
    'e.g. conditionals and loops for week 4, ending with a small menu app',
  );
  if (request === undefined) {
    return undefined;
  }
  const count = await vscode.window.showQuickPick(['2', '3', '4', '5'], { title: 'Generate an exam (2/4): number of questions', ignoreFocusOut: true });
  if (!count) {
    return undefined;
  }
  const duration = await vscode.window.showInputBox({
    title: 'Generate an exam (3/4): time limit in minutes',
    value: String(Number(count) * 15),
    ignoreFocusOut: true,
    validateInput: (v) => (/^\d+$/.test(v.trim()) && Number(v) > 0 ? undefined : 'Type a number of minutes'),
  });
  if (!duration) {
    return undefined;
  }
  const mode = await vscode.window.showQuickPick(
    [
      { label: 'Closed', detail: 'Hints and AI hints off; pastes and time outside VS Code are recorded.', mode: 'closed' as const },
      { label: 'Open', detail: 'Hints, AI hints and the internet allowed.', mode: 'open' as const },
    ],
    { title: 'Generate an exam (4/4): mode', ignoreFocusOut: true },
  );
  return mode && { request, questions: Number(count), durationMinutes: Number(duration), mode: mode.mode };
}

// ---------------------------------------------------------------- exam generation

async function generateExam(deps: AuthoringDeps, run: Run, spec: ExamSpec, language: string): Promise<{ dir?: string; plan?: ExamPlan; failed: string[]; problems: string[] }> {
  const existingTitles = deps.challenges().map((c) => c.title);
  let plan: ExamPlan | undefined;
  let problems: string[] = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !plan; attempt++) {
    run.report(attempt === 1 ? 'Planning the exam…' : `Planning the exam (attempt ${attempt} of ${MAX_ATTEMPTS})…`);
    const answer = await complete(run, buildExamPlanPrompt({ request: spec.request, questions: spec.questions, language, existingTitles }));
    ({ plan, problems } = parseExamPlan(answer, spec.questions));
    if (!plan) {
      run.log(`✗ exam plan: ${problems.join('; ')}\n${answer.slice(0, 1500)}`);
    }
  }
  if (!plan) {
    return { failed: [], problems };
  }
  run.log(`Exam plan: ${plan.title}\n${plan.questions.map((q, i) => `  ${i + 1}. [${q.topic}, ${q.difficulty}, ${q.points} pts] ${q.title}: ${q.brief}`).join('\n')}`);

  const examRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tech-challenges-ai-exam-'));
  const examDir = path.join(examRoot, slugify(plan.title) || 'ai-exam');
  fs.mkdirSync(examDir, { recursive: true });
  const questions: { id: string; points: number }[] = [];
  const failed: string[] = [];
  for (const [i, q] of plan.questions.entries()) {
    const label = `Question ${i + 1} of ${plan.questions.length}`;
    const result = await generateOne(deps, run, {
      kind: q.kind,
      request: `${q.title}. ${q.brief}`,
      topic: q.kind === 'test' ? 'Tests' : q.topic === CUSTOM_TOPIC ? undefined : q.topic,
      difficulty: q.difficulty,
      language,
      existingTitles: [...existingTitles, ...plan.questions.map((x) => x.title).filter((t) => t !== q.title)],
    }, label);
    if (result.ok && result.dir) {
      const moved = moveInto(result.dir, examDir);
      questions.push({ id: path.basename(moved), points: q.points });
    } else {
      failed.push(q.title);
    }
  }
  if (questions.length === 0) {
    return { plan, failed, problems: ['None of the questions could be generated and validated.'] };
  }
  const examJson = {
    title: plan.title,
    description: plan.description,
    durationMinutes: spec.durationMinutes,
    mode: spec.mode,
    maxSubmissions: 3,
    questions,
  };
  fs.writeFileSync(path.join(examDir, 'exam.json'), JSON.stringify(examJson, null, 2) + '\n');
  // Final check that the exam itself loads, with every private question.
  const report = await validateChallenges([examRoot], { javaHome: run.javaHome, referenceRoots: referenceRoots(deps) });
  return { dir: examDir, plan, failed, problems: [...report.loadErrors, ...report.challenges.flatMap((c) => c.problems)] };
}

// ---------------------------------------------------------------- command

export async function generateWithAi(deps: AuthoringDeps, ai: AiHints): Promise<void> {
  if (ai.providerId === 'off') {
    const choice = await vscode.window.showInformationMessage(
      'Generating with AI uses the AI provider from the settings, and none is set up yet. Choose a local model (Ollama, LM Studio) or your own API key.',
      'Set Up AI',
    );
    if (!choice) {
      return;
    }
    await ai.setup();
    if (ai.providerId === 'off') {
      return;
    }
  }
  const javaHome = deps.javaHome();
  if ((await javacMajorVersion(javaHome)) === undefined) {
    vscode.window.showErrorMessage('Generating with AI needs a JDK, to compile and run what the AI writes before saving it. Install JDK 25+ (or set techChallenges.javaHome).');
    return;
  }

  const kind = await vscode.window.showQuickPick(
    [
      { label: '$(symbol-event) Challenge', detail: 'One exercise about a topic, like the built-in ones.', what: 'challenge' as const },
      { label: '$(beaker) Test', detail: 'A bigger exercise that mixes several topics, such as a menu-driven console app.', what: 'test' as const },
      { label: '$(checklist) Exam', detail: 'A timed exam with several new, private questions.', what: 'exam' as const },
    ],
    { title: 'Generate with AI', placeHolder: 'What do you want to create?', ignoreFocusOut: true },
  );
  if (!kind) {
    return;
  }
  const language = ai.responseLanguage();
  const challengeSpec = kind.what === 'exam' ? undefined : await askChallengeSpec(deps, kind.what, language);
  const examSpec = kind.what === 'exam' ? await askExamSpec() : undefined;
  if (!challengeSpec && !examSpec) {
    return;
  }
  const folder = await pickFolder(deps, kind.what === 'exam' ? 'Save the exam in which folder?' : 'Save it in which folder?');
  if (!folder) {
    return;
  }

  let provider: HintProvider;
  try {
    provider = await ai.createProvider();
  } catch (e) {
    vscode.window.showErrorMessage(e instanceof AiError ? e.message : String(e));
    return;
  }

  deps.output.show(true);
  deps.output.appendLine(`\n=== Generate with AI: ${kind.what}, using ${provider.label}${provider.remote ? ' (remote)' : ' (local)'} ===`);
  const controller = new AbortController();
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `Generating with ${provider.label}`, cancellable: true },
      async (progress, token) => {
        token.onCancellationRequested(() => controller.abort());
        const run: Run = {
          provider,
          signal: controller.signal,
          javaHome,
          log: (line) => deps.output.appendLine(line),
          report: (message) => progress.report({ message }),
        };
        if (challengeSpec) {
          await finishChallenge(deps, folder, await generateOne(deps, run, challengeSpec, challengeSpec.kind === 'test' ? 'Test' : 'Challenge'), provider.label);
        } else if (examSpec) {
          await finishExam(deps, folder, await generateExam(deps, run, examSpec, language), provider.label);
        }
      },
    );
  } catch (e) {
    if (e instanceof vscode.CancellationError || controller.signal.aborted) {
      deps.output.appendLine('Cancelled.');
      return;
    }
    const message = e instanceof AiError ? e.message : `Unexpected error: ${(e as Error).message}`;
    deps.output.appendLine(`✗ ${message}`);
    vscode.window.showErrorMessage(message);
  }
}

async function finishChallenge(deps: AuthoringDeps, folder: string, result: GenerationResult, label: string): Promise<void> {
  if (!result.ok) {
    result.problems.forEach((p) => deps.output.appendLine(`  ✗ ${p}`));
    if (!result.dir) {
      vscode.window.showErrorMessage(`${label} did not produce a usable challenge after ${result.attempts} attempts. See the "Tech Challenges" output.`);
      return;
    }
    const choice = await vscode.window.showWarningMessage(
      `"${result.title}" still has problems after ${result.attempts} attempts. Save the draft so you can fix it by hand?`,
      { modal: true, detail: 'The problems are listed in the "Tech Challenges" output. Run "Validate Challenges" after fixing them.' },
      'Save Draft',
    );
    if (choice !== 'Save Draft') {
      return;
    }
  }
  const dir = moveInto(result.dir!, folder);
  // List it after the challenges already in its topic.
  const metaPath = path.join(dir, 'challenge.json');
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const topic = meta.topic ?? CUSTOM_TOPIC;
    meta.order = Math.max(0, ...deps.challenges().filter((c) => c.topic === topic).map((c) => c.order)) + 1;
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
  } catch {
    // A draft with a broken challenge.json is saved as it is, for the author to fix.
  }
  await ensureRegistered(folder, deps);
  deps.reload();
  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'description.md')), { viewColumn: vscode.ViewColumn.One, preview: false });
  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'challenge.json')), { viewColumn: vscode.ViewColumn.Two, preview: false });
  if (result.ok) {
    const choice = await vscode.window.showInformationMessage(
      `✓ "${result.title}" was generated and validated (${result.attempts} attempt${result.attempts > 1 ? 's' : ''}): the solutions compile, agree and produced the expected outputs. Review the description and tests before giving it to students.`,
      'Try It',
    );
    if (choice) {
      await vscode.commands.executeCommand('techChallenges.open', path.basename(dir));
    }
  }
}

async function finishExam(deps: AuthoringDeps, folder: string, result: Awaited<ReturnType<typeof generateExam>>, label: string): Promise<void> {
  if (!result.dir || !result.plan) {
    result.problems.forEach((p) => deps.output.appendLine(`  ✗ ${p}`));
    vscode.window.showErrorMessage(`${label} could not generate the exam. See the "Tech Challenges" output.`);
    return;
  }
  const dir = moveInto(result.dir, folder);
  fs.rmSync(path.dirname(result.dir), { recursive: true, force: true });
  await ensureRegistered(folder, deps);
  deps.reload();
  await vscode.window.showTextDocument(vscode.Uri.file(path.join(dir, 'exam.json')), { preview: false });
  const kept = result.plan.questions.length - result.failed.length;
  const failed = result.failed.length ? ` ${result.failed.length} question(s) could not be validated and were left out: ${result.failed.join(', ')}.` : '';
  const problems = result.problems.length ? ' The final check found problems; see the "Tech Challenges" output.' : '';
  result.problems.forEach((p) => deps.output.appendLine(`  ✗ ${p}`));
  vscode.window.showInformationMessage(
    `✓ "${result.plan.title}" was generated with ${kept} validated question${kept === 1 ? '' : 's'}.${failed}${problems} It's under Exams in the sidebar. Review the questions, and remove the Solution*.java files from the copy you share.`,
  );
}
