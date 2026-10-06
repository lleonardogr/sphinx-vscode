import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import type { SphynxApi } from '../../extension';
import type { ClassReport } from '../../classResults';
import { migrateOldStorage } from '../../extension';
import { javacMajorVersion } from '../../runner';
import { extractZip, findImportables, findSolutions } from '../../importCore';
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

test('Java 25+ is available to the extension', async () => {
  const javaHome = vscode.workspace.getConfiguration('sphynx').get<string>('java.home') || undefined;
  const version = await javacMajorVersion(javaHome);
  assert.ok(version !== undefined && version >= 25, `found javac ${version} (sphynx.java.home: ${javaHome ?? 'not set'}); the built-in starters need JDK 25+`);
});

test('loads the built-in challenges, quizzes, lessons and exams', () => {
  assert.equal(api.challenges().filter((c) => !c.dir.includes(`${path.sep}subjects${path.sep}`)).length, 100);
  assert.equal(api.challenges().length, 104);
  assert.equal(api.quizzes().length, 12);
  assert.equal(api.lessons().length, 2);
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
  try {
    api.tree.mode = 'path';
    assert.ok(labels().includes('1 · Basics'));
    assert.ok(labels().includes('11 · Lambdas & Streams'));
    api.tree.mode = 'difficulty';
    assert.ok(['Easy', 'Medium', 'Hard'].every((d) => labels().includes(d)), labels().join(', '));
    api.tree.mode = 'progress';
    assert.ok(labels().some((l) => /Solved/.test(l)), labels().join(', '));
  } finally {
    api.tree.mode = 'path';
  }
});

test('CS Fundamentals: switch subject, lessons first, prerequisites shown, then back to Java', async () => {
  const label = (n: unknown) => String(api.tree.getTreeItem(n as never).label);
  await vscode.commands.executeCommand('sphynx.switchSubject', 'cs');
  try {
    assert.equal(api.tree.subject, 'cs');
    assert.ok(!api.tree.getChildren().some((n) => (n as { kind: string }).kind === 'examsRoot'), 'the Java exams are not listed under CS');
    const groups = api.tree.getChildren().filter((n) => (n as { kind: string }).kind === 'group');
    assert.deepEqual(groups.map(label), ['2 · Number Systems']);
    const items = api.tree.getChildren(groups[0]);
    assert.deepEqual(items.map(label), [
      'Place Value and Binary',
      'Hexadecimal and Octal',
      'Binary to Decimal',
      'Decimal to Binary',
      'Hex to Decimal',
      'Base Converter',
      'Number Systems Quiz',
    ]);
    // A lesson gets its ✓ once read.
    const lesson = items[0];
    assert.equal(String(api.tree.getTreeItem(lesson as never).description), 'Lesson · 4 min');
    await vscode.commands.executeCommand('sphynx.openLesson', 'place-value-and-binary');
    await api.lessonProgress.markRead('place-value-and-binary');
    assert.equal((api.tree.getTreeItem(api.tree.getChildren(groups[0])[0] as never).iconPath as vscode.ThemeIcon).id, 'pass-filled');
    // Prerequisites: in the description, and with progress in the tooltip.
    const b2d = api.tree.getTreeItem(items[2] as never);
    assert.equal(b2d.description, 'Easy · needs Loops');
    assert.match((b2d.tooltip as vscode.MarkdownString).value, /Needs:\n- Java Programming · Loops \(\d+\/12 solved\)/);
  } finally {
    await vscode.commands.executeCommand('sphynx.switchSubject', 'java');
  }
  assert.ok(api.tree.getChildren().map(label).includes('1 · Basics'));
  assert.ok(api.tree.getChildren().map(label).includes('Exams'));
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

test('the teacher view lists the teacher\'s exams, own content and tools, and switches back', async () => {
  assert.equal(api.view(), 'student');
  await vscode.commands.executeCommand('sphynx.switchToTeacherView');
  assert.equal(api.view(), 'teacher');
  const t = api.teacherTree;
  const label = (n: unknown) => String(t.getTreeItem(n as never).label);
  const [exams, content, tools] = t.getChildren();
  assert.deepEqual([exams, content, tools].map(label), ['My Exams', 'My Challenges & Quizzes', 'Tools']);
  assert.deepEqual(t.getChildren(exams).map(label).sort(), ['Exam 1: Basics to Strings', 'Exam 2: Building Blocks', 'Final Exam', 'Sample Exam: Java Basics']);
  assert.match(String(t.getTreeItem(t.getChildren(exams)[0] as never).description), /^Built-in · 4 questions · 100 pts · \d+ min$/);
  // Only the teacher's own content: the challenge imported by the previous test, none of the built-in ones.
  assert.deepEqual(t.getChildren(content).map(label), ['Class Demo']);
  assert.match(String(t.getTreeItem(t.getChildren(content)[0] as never).description), /^Imported · /);
  assert.ok(t.getChildren(tools).map(label).includes("Verify Students' Exam Results…"));
  // Questions open their source file for editing.
  const question = t.getChildren(t.getChildren(exams)[0]!)[0]!;
  assert.equal(t.getTreeItem(question as never).command?.command, 'sphynx.editItem');
  await vscode.commands.executeCommand('sphynx.switchToStudentView');
  assert.equal(api.view(), 'student');
});

test('a teacher previews an exam without touching the real attempt, and can restart it', async () => {
  await vscode.commands.executeCommand('sphynx.switchToTeacherView');
  const exam = api.exams().find((e) => e.id === 'exam-2')!;
  dialogs.inputBox = 'Teacher';
  dialogs.answer = (m, buttons) => (m.startsWith('Start') ? buttons[0] : undefined);
  await vscode.commands.executeCommand('sphynx.previewExam', { kind: 'exam', exam });
  assert.ok(api.examManager.state('exam-2--preview'), 'the preview did not start');
  assert.equal(api.examManager.state('exam-2'), undefined, 'the real exam must not start');

  // Listed under the exam in the teacher view, never in the student view.
  const t = api.teacherTree;
  const examNode = t.getChildren(t.getChildren()[0]).find((n) => String(t.getTreeItem(n as never).label) === 'Exam 2: Building Blocks')!;
  const [previewNode] = t.getChildren(examNode);
  assert.equal(String(t.getTreeItem(previewNode as never).label), 'Your preview attempt');
  assert.equal(t.getTreeItem(previewNode as never).contextValue, 'teacherPreviewActive');
  assert.equal(t.getChildren(previewNode).length, exam.questions.length);
  const studentExams = api.tree.getChildren(api.tree.getChildren().find((n) => (n as { kind: string }).kind === 'examsRoot'));
  assert.ok(studentExams.every((n) => !(n as { exam: { preview?: boolean } }).exam.preview));

  // Restarting clears the preview (state and answers) only.
  const answers = path.join(path.dirname(api.examManager.answerFile(api.exams().find((e) => e.id === 'exam-2--preview')!, exam.questions[1])));
  dialogs.answer = (_m, buttons) => buttons.find((b) => b === 'Restart Preview');
  await vscode.commands.executeCommand('sphynx.restartPreview', { kind: 'preview', exam: api.exams().find((e) => e.id === 'exam-2--preview') });
  assert.equal(api.examManager.state('exam-2--preview'), undefined);
  assert.equal(fs.existsSync(path.dirname(answers)), false, 'the preview answers were not removed');
  await vscode.commands.executeCommand('sphynx.switchToStudentView');
});

test('a teacher exports an exam as a pack for students, without the solutions', async () => {
  const exam = api.exams().find((e) => e.id === 'exam-1')!;
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-export-'));
  dialogs.quickPick = 0; // the preselected exam, then "For students"
  dialogs.saveDialog = vscode.Uri.file(path.join(out, 'class-7b.zip'));
  dialogs.answer = () => undefined;
  await vscode.commands.executeCommand('sphynx.exportPack', { kind: 'exam', exam });
  const zip = path.join(out, 'class-7b.zip');
  assert.ok(fs.existsSync(zip), 'no pack was written');
  const dest = path.join(out, 'extracted');
  extractZip(zip, dest);
  assert.deepEqual(findImportables(dest, 'class-7b').map((f) => `${f.kind}:${f.name}`), ['exam:exam-1']);
  assert.deepEqual(findSolutions(dest), []);
  assert.ok(dialogs.messages.some((m) => /Exported 1 item to class-7b\.zip/.test(m)), dialogs.messages.slice(-2).join(' | '));
  fs.rmSync(out, { recursive: true, force: true });
});

test('the class results dashboard summarizes the files students handed in, and catches an edited score', async () => {
  // The real results file from the exam test, plus a copy whose quiz score was edited by hand.
  const real = api.examManager.state('exam-1')!.resultsFile!;
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'sphynx-class-'));
  fs.copyFileSync(real, path.join(folder, 'results-test-student.json'));
  const tampered = JSON.parse(read(real));
  tampered.student = 'Edited Score';
  tampered.questions.find((q: { id: string }) => q.id === 'exam-1-quiz').earned = 20;
  tampered.score.earned = 40;
  fs.writeFileSync(path.join(folder, 'results-edited.json'), JSON.stringify(tampered));
  fs.writeFileSync(path.join(folder, 'notes.json'), '{"not": "results"}');

  dialogs.openDialog = [vscode.Uri.file(folder)];
  const exam = api.exams().find((e) => e.id === 'exam-1')!;
  const report = (await vscode.commands.executeCommand('sphynx.classResults', { kind: 'exam', exam })) as ClassReport;
  assert.ok(report, 'the dashboard did not open');
  assert.deepEqual(report.rows.map((r) => `${r.student}:${r.earned}`), ['Edited Score:40', 'Test Student:20']);
  assert.deepEqual(report.stats, { count: 2, average: 30, median: 30, highest: 40, lowest: 20 });
  assert.equal(report.questions.length, 4);

  const verified = await api.verifyFiles(report.rows.map((r) => r.file));
  const byName = Object.fromEntries(verified.map((v) => [path.basename(v.file), v]));
  assert.equal(byName['results-test-student.json'].matches, true, JSON.stringify(byName['results-test-student.json']));
  assert.equal(byName['results-edited.json'].matches, false);
  assert.equal(byName['results-edited.json'].recomputed, 20);
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
