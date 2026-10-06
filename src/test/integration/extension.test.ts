import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import type { SphynxApi } from '../../extension';
import { migrateOldStorage } from '../../extension';
import { dialogs, test, waitFor } from './harness';

const ROOT = path.resolve(__dirname, '..', '..', '..');
let api: SphynxApi;

const challenge = (id: string) => {
  const c = api.challenges().find((x) => x.id === id);
  assert.ok(c, `challenge ${id} not found`);
  return c;
};
const read = (file: string) => fs.readFileSync(file, 'utf8');
const isStarter = (id: string) => {
  const c = challenge(id);
  return [c.starterCode, c.starterCodeClassic].includes(read(api.codePath(c)));
};
const solution = (id: string) => read(path.join(ROOT, 'challenges', id, 'Solution.java'));
/** Opens a challenge, replaces its code and submits it. */
async function submit(id: string, code: string): Promise<void> {
  await vscode.commands.executeCommand('sphynx.open', id);
  fs.writeFileSync(api.codePath(challenge(id)), code);
  await vscode.commands.executeCommand('sphynx.submit', id);
}

test('activates and registers every command it contributes', async () => {
  const ext = vscode.extensions.getExtension<SphynxApi>('lleonardogr.sphynx');
  assert.ok(ext, 'extension not found');
  api = await ext.activate();
  const contributed: { command: string }[] = ext.packageJSON.contributes.commands;
  const registered = new Set(await vscode.commands.getCommands(true));
  const missing = contributed.map((c) => c.command).filter((c) => !registered.has(c));
  assert.deepEqual(missing, []);
});

test('loads the built-in challenges, quizzes and exams', () => {
  assert.equal(api.challenges().length, 100);
  assert.equal(api.quizzes().length, 11);
  assert.deepEqual(api.exams().map((e) => e.id).sort(), ['exam-1', 'exam-2', 'final-exam', 'sample-exam']);
});

test('opening a challenge creates Main.java with the starter code', async () => {
  await vscode.commands.executeCommand('sphynx.open', 'fizzbuzz');
  assert.ok(fs.existsSync(api.codePath(challenge('fizzbuzz'))));
  assert.ok(isStarter('fizzbuzz'));
});

test('submitting a correct solution solves the challenge', async () => {
  await submit('fizzbuzz', solution('fizzbuzz'));
  assert.equal(api.progress.isSolved('fizzbuzz'), true);
  assert.equal(api.progress.get('fizzbuzz')?.attempts, 1);
});

test('submitting a wrong solution counts an attempt without solving it', async () => {
  await submit('factorial', challenge('factorial').starterCode);
  assert.equal(api.progress.get('factorial')?.status, 'attempted');
});

test('Reset Challenge brings back the starter code and clears its progress, unless cancelled', async () => {
  fs.writeFileSync(api.codePath(challenge('fizzbuzz')), '// my own work\n');
  dialogs.answer = () => undefined;
  await vscode.commands.executeCommand('sphynx.resetChallenge', 'fizzbuzz');
  assert.equal(read(api.codePath(challenge('fizzbuzz'))), '// my own work\n', 'cancel must change nothing');
  assert.equal(api.progress.isSolved('fizzbuzz'), true);

  dialogs.answer = (_m, buttons) => buttons.find((b) => b === 'Reset Challenge');
  await vscode.commands.executeCommand('sphynx.resetChallenge', 'fizzbuzz');
  assert.ok(isStarter('fizzbuzz'));
  assert.equal(api.progress.get('fizzbuzz'), undefined);
  assert.equal(api.progress.get('factorial')?.status, 'attempted', 'other challenges keep their progress');
});

test('Reset Quiz Score clears only that quiz', async () => {
  await api.quizProgress.record('loops-quiz', 6, 8);
  await api.quizProgress.record('strings-quiz', 8, 8);
  dialogs.answer = (_m, buttons) => buttons.find((b) => b === 'Reset Quiz');
  await vscode.commands.executeCommand('sphynx.resetQuiz', 'loops-quiz');
  assert.equal(api.quizProgress.get('loops-quiz'), undefined);
  assert.equal(api.quizProgress.get('strings-quiz')?.best, 8);
});

test('Reset All Challenges: progress only keeps the code, progress and code restores the starters', async () => {
  await submit('hello-world', solution('hello-world'));
  fs.writeFileSync(api.codePath(challenge('fizzbuzz')), '// kept\n');

  dialogs.answer = (_m, buttons) => buttons.find((b) => b === 'Progress Only');
  await vscode.commands.executeCommand('sphynx.resetAllChallenges');
  assert.equal(api.progress.solvedCount(api.challenges().map((c) => c.id)), 0);
  assert.equal(api.quizProgress.get('strings-quiz'), undefined);
  assert.equal(read(api.codePath(challenge('fizzbuzz'))), '// kept\n');

  dialogs.answer = (_m, buttons) => buttons.find((b) => b === 'Progress and Code');
  await vscode.commands.executeCommand('sphynx.resetAllChallenges');
  assert.ok(isStarter('fizzbuzz'));
  assert.ok(isStarter('hello-world'));
  assert.equal(fs.existsSync(api.codePath(challenge('array-sum'))), false, 'challenges never opened are not created');
});

test('the sidebar groups by learning path, difficulty and progress', async () => {
  await submit('hello-world', solution('hello-world'));
  const labels = () => api.tree.getChildren().map((n) => String(api.tree.getTreeItem(n as never).label));
  api.tree.mode = 'path';
  assert.ok(labels().includes('1 · Basics'));
  assert.ok(labels().includes('11 · Lambdas & Streams'));
  api.tree.mode = 'difficulty';
  assert.ok(['Easy', 'Medium', 'Hard'].every((d) => labels().includes(d)), labels().join(', '));
  api.tree.mode = 'progress';
  assert.ok(labels().some((l) => /Solved/.test(l)), labels().join(', '));
  api.tree.mode = 'path';
});

test('switching the language to Portuguese translates the content', async () => {
  const config = vscode.workspace.getConfiguration('sphynx');
  await config.update('language', 'pt-br', vscode.ConfigurationTarget.Global);
  try {
    await waitFor(() => challenge('password-checker').title === 'Verificador de senha', 'Portuguese titles');
    assert.equal(api.tree.getChildren().map((n) => String(api.tree.getTreeItem(n as never).label)).includes('1 · Fundamentos'), true);
  } finally {
    await config.update('language', 'en', vscode.ConfigurationTarget.Global);
    await waitFor(() => challenge('password-checker').title === 'Password Checker', 'English titles');
  }
});

test('an exam: start, submit a question, finish, and hand in a results file', async () => {
  const exam = api.exams().find((e) => e.id === 'exam-1')!;
  const question = exam.questions.find((q) => q.id === 'parking-fee')!;
  dialogs.inputBox = 'Test Student';
  dialogs.answer = (m, buttons) => (m.startsWith('Start') ? buttons[0] : undefined);
  await vscode.commands.executeCommand('sphynx.startExam', 'exam-1');
  assert.ok(api.examManager.state('exam-1'), 'the exam did not start');
  assert.equal(api.examManager.state('exam-1')?.student, 'Test Student');

  // Write the answer before the question opens: changing a file that is open in the editor
  // reloads it, which the closed exam would (rightly) block as a large paste.
  const answer = api.examManager.answerFile(exam, question);
  fs.mkdirSync(path.dirname(answer), { recursive: true });
  fs.writeFileSync(answer, read(path.join(ROOT, 'exams', 'exam-1', 'parking-fee', 'Solution.java')));
  await vscode.commands.executeCommand('sphynx.open', 'exam:exam-1:parking-fee');
  // Exams confirm before using up one of the limited submissions.
  dialogs.answer = (m, buttons) => (m.startsWith('Submit your answer') ? buttons.find((b) => b === 'Submit') : undefined);
  await vscode.commands.executeCommand('sphynx.submit', 'exam:exam-1:parking-fee');
  assert.equal(api.examManager.state('exam-1')?.questions['parking-fee']?.bestEarned, 20);
  assert.equal(api.examManager.state('exam-1')?.questions['parking-fee']?.submissions, 1);
  assert.equal(api.progress.get('exam:exam-1:parking-fee'), undefined, 'exam questions do not count as practice');
  assert.deepEqual(api.examManager.state('exam-1')?.warnings, [], 'nothing suspicious was recorded');

  dialogs.answer = (m, buttons) => buttons.find((b) => b === 'Finish Exam');
  await vscode.commands.executeCommand('sphynx.finishExam', 'exam-1');
  const state = api.examManager.state('exam-1');
  assert.ok(state?.finishedAt, 'the exam did not finish');
  const results = JSON.parse(read(state!.resultsFile!));
  assert.equal(results.student, 'Test Student');
  assert.equal(results.questions.find((q: { id: string }) => q.id === 'parking-fee').earned, 20);
  assert.equal(results.score.earned, 20);
});

test('importing a teacher\'s folder adds its challenge and can strip the solutions', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-share-'));
  const dir = path.join(folder, 'class-demo');
  fs.cpSync(path.join(ROOT, 'challenges', 'fizzbuzz'), dir, { recursive: true });
  const meta = JSON.parse(read(path.join(dir, 'challenge.json')));
  fs.writeFileSync(path.join(dir, 'challenge.json'), JSON.stringify({ ...meta, title: 'Class Demo', topic: undefined, translations: undefined }));
  dialogs.openDialog = [vscode.Uri.file(folder)];
  dialogs.quickPick = 0; // Remove the solutions
  dialogs.answer = () => undefined;
  await vscode.commands.executeCommand('sphynx.importContent');
  const imported = api.challenges().find((c) => c.title === 'Class Demo');
  assert.ok(imported, 'the challenge was not imported');
  assert.equal(fs.readdirSync(imported.dir).some((f) => f.startsWith('Solution')), false, 'solutions were not removed');
  fs.rmSync(folder, { recursive: true, force: true });
});

test('the imported library and saved solutions move over from the old extension id', () => {
  const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-storage-'));
  const old = path.join(storageRoot, 'class-plugin.sphynx');
  fs.mkdirSync(path.join(old, 'library', 'challenges', 'x'), { recursive: true });
  fs.writeFileSync(path.join(old, 'library', 'challenges', 'x', 'challenge.json'), '{}');
  fs.mkdirSync(path.join(old, 'solutions', 'y'), { recursive: true });
  fs.writeFileSync(path.join(old, 'solutions', 'y', 'Main.java'), '// mine');
  const current = path.join(storageRoot, 'lleonardogr.sphynx');
  migrateOldStorage(current);
  assert.ok(fs.existsSync(path.join(current, 'library', 'challenges', 'x', 'challenge.json')));
  assert.equal(read(path.join(current, 'solutions', 'y', 'Main.java')), '// mine');
  assert.ok(fs.existsSync(old), 'the old folder is kept');
  fs.writeFileSync(path.join(current, 'solutions', 'y', 'Main.java'), '// newer');
  migrateOldStorage(current);
  assert.equal(read(path.join(current, 'solutions', 'y', 'Main.java')), '// newer', 'it runs only once');
  fs.rmSync(storageRoot, { recursive: true, force: true });
});
