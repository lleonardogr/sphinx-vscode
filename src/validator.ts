// Checks challenge folders: every Starter*.java must compile, and every Solution*.java must
// satisfy the rules and pass every test. Files without ".classic" in their name use Java 25+
// syntax and are skipped on older JDKs. Shared by `npm run validate` and the
// "Validate Challenges" command, so it has no vscode dependency.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Challenge, loadChallenges } from './challenges';
import { RunOutcome, RunRequest, javacMajorVersion, normalizeOutput, runChallengeCode } from './runner';
import { findExamDirs, loadExams } from './exams';
import { findQuizDirs, isWholeProgram, loadQuiz, loadQuizzes, quizProgram } from './quizzes';
import { READINGS_MARKER, READING_TYPES, findLessonDirs, loadLesson } from './lessons';
import { subjectOf, unitKey } from './path';
import { findSubject } from './subjects';

export interface ChallengeReport {
  /** "quiz" reports count questions in `tests` and code snippets run in `solutions`; "lesson" reports count words in `tests`. */
  kind?: 'quiz' | 'lesson';
  id: string;
  dir: string;
  ok: boolean;
  tests: number;
  solutions: number;
  problems: string[];
  /** Content-standard issues (see contentWarnings); they fail validation only with `strict`. */
  warnings?: string[];
}

export interface ValidationReport {
  javacVersion: number | undefined;
  loadErrors: string[];
  challenges: ChallengeReport[];
  checkedSolutions: number;
  skippedSolutions: number;
}

export interface ValidateOptions {
  /** Fill every test's "output" from the reference solution and save challenge.json. */
  generate?: boolean;
  javaHome?: string;
  /** Extra challenge folders used only to resolve test questions that reference a challenge by id (e.g. the built-in ones). */
  referenceRoots?: string[];
  /** Treat content-standard warnings as failures (used in CI for the built-in content). */
  strict?: boolean;
  /** Also warn about missing translations in these languages (e.g. ["pt-br"]). */
  languages?: string[];
  /** Called after each challenge, e.g. to print progress. */
  onChallenge?: (report: ChallengeReport) => void;
}

async function runAs(source: string, request: Omit<RunRequest, 'file'>): Promise<RunOutcome> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenge-validate-'));
  const file = path.join(dir, 'Main.java');
  fs.writeFileSync(file, source);
  try {
    return await runChallengeCode({ ...request, file });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function describe(outcome: RunOutcome): string {
  switch (outcome.kind) {
    case 'compileError':
      return `does not compile\n${outcome.raw}`;
    case 'toolMissing':
      return outcome.message;
    case 'ruleViolation':
      return `breaks the challenge's own rules:\n${outcome.messages.map((m) => `  - ${m}`).join('\n')}`;
    default:
      return outcome.kind;
  }
}

/** Prerequisites must name units that exist in some subject, and "subject" a subject (see subjects.ts). */
function referenceProblems(item: { requires: string[]; subject?: string }): string[] {
  return [
    ...item.requires.filter((r) => !unitKey(r)).map((r) => `"requires" lists "${r}", which is not a unit of any subject`),
    ...(item.subject && !findSubject(item.subject) ? [`"subject" is "${item.subject}", which is not a subject`] : []),
  ];
}

/** An exam's optional "subject" must name a subject (without one, its questions decide). */
function examSubjectProblems(dir: string): string[] {
  try {
    const { subject } = JSON.parse(fs.readFileSync(path.join(dir, 'exam.json'), 'utf8'));
    return typeof subject === 'string' && subject.trim() && !findSubject(subject.trim()) ? [`${dir}: "subject" is "${subject}", which is not a subject`] : [];
  } catch {
    return []; // reported by loadExams
  }
}

async function validateOne(c: Challenge, javacVersion: number | undefined, opts: ValidateOptions, counters: { checked: number; skipped: number }): Promise<ChallengeReport> {
  const problems: string[] = [...referenceProblems(c)];
  const files = fs.readdirSync(c.dir).sort();
  const runnable = (f: string) => f.includes('.classic.') || (javacVersion ?? 0) >= 25;

  for (const starterFile of files.filter((f) => /^Starter.*\.java$/.test(f))) {
    if (!runnable(starterFile)) {
      continue;
    }
    const starter = await runAs(fs.readFileSync(path.join(c.dir, starterFile), 'utf8'), { tests: [], javaHome: opts.javaHome });
    if (starter.kind !== 'tests') {
      problems.push(`${starterFile} ${describe(starter)}`);
    }
  }

  // Solution.java first: with `generate`, the first runnable solution produces the expected
  // outputs and the others are then checked against them.
  const solutions = files
    .filter((f) => /^Solution.*\.java$/.test(f))
    .sort((a, b) => Number(b === 'Solution.java') - Number(a === 'Solution.java'));
  if (solutions.length === 0) {
    problems.push('No Solution.java: add a reference solution so the tests can be checked.');
  }
  const generator = solutions.find(runnable);

  for (const solutionFile of solutions) {
    if (!runnable(solutionFile)) {
      counters.skipped++;
      continue;
    }
    counters.checked++;
    const outcome = await runAs(fs.readFileSync(path.join(c.dir, solutionFile), 'utf8'), {
      tests: c.tests,
      mustContain: c.mustContain,
      mustNotContain: c.mustNotContain,
      timeLimitMs: c.timeLimitMs,
      javaHome: opts.javaHome,
    });
    if (outcome.kind !== 'tests') {
      problems.push(`${solutionFile} ${describe(outcome)}`);
      continue;
    }
    if (opts.generate && solutionFile === generator) {
      const metaPath = path.join(c.dir, 'challenge.json');
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      outcome.results.forEach((r, i) => {
        if (r.exitCode !== 0 || r.timedOut) {
          problems.push(`${solutionFile}: test ${i + 1} crashed or timed out, so its output was not saved\n${r.stderr}`);
          return;
        }
        meta.tests[i].output = normalizeOutput(r.actual) + '\n';
        c.tests[i].output = meta.tests[i].output;
      });
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
      continue;
    }
    for (const r of outcome.results.filter((x) => !x.passed)) {
      const why = r.timedOut ? 'timed out' : r.exitCode !== 0 ? `crashed\n${r.stderr}` : `expected ${JSON.stringify(r.expected)} but printed ${JSON.stringify(r.actual)}`;
      problems.push(`${solutionFile}: test ${r.index + 1} ${why}`);
    }
  }

  return { id: c.id, dir: c.dir, ok: problems.length === 0, tests: c.tests.length, solutions: solutions.length, problems, warnings: contentWarnings(c) };
}

/**
 * Checks a quiz: it must load, and every "what does this code print?" snippet must compile and print
 * exactly its answer. With `generate`, empty answers are filled in from the real output.
 */
async function validateQuiz(dir: string, javacVersion: number | undefined, opts: ValidateOptions, counters: { checked: number; skipped: number }): Promise<ChallengeReport> {
  const problems: string[] = [];
  const metaPath = path.join(dir, 'quiz.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const quiz = loadQuiz(dir);
  problems.push(...referenceProblems(quiz));
  let ran = 0;
  let changed = false;
  for (const [i, q] of quiz.questions.entries()) {
    if (q.type !== 'output') {
      continue;
    }
    // Snippets are wrapped in a compact void main(), which needs JDK 25+; a full classic program doesn't.
    const classic = isWholeProgram(q.code) && !/\bvoid\s+main\s*\(\s*\)/.test(q.code);
    if (!classic && (javacVersion ?? 0) < 25) {
      counters.skipped++;
      continue;
    }
    counters.checked++;
    ran++;
    const outcome = await runAs(quizProgram(q.code), { tests: [{ input: '', output: q.answer }], javaHome: opts.javaHome });
    if (outcome.kind !== 'tests') {
      problems.push(`question ${i + 1}: the code ${describe(outcome)}`);
      continue;
    }
    const r = outcome.results[0];
    if (r.timedOut || r.exitCode !== 0) {
      problems.push(`question ${i + 1}: the code ${r.timedOut ? 'timed out' : `crashed\n${r.stderr}`}`);
    } else if (opts.generate && !q.options && q.answer === '') {
      meta.questions[i].answer = normalizeOutput(r.actual);
      changed = true;
    } else if (!r.passed) {
      problems.push(`question ${i + 1}: the answer is ${JSON.stringify(q.answer)} but the code prints ${JSON.stringify(normalizeOutput(r.actual))}`);
    }
  }
  if (changed) {
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
  }
  return { kind: 'quiz', id: quiz.id, dir, ok: problems.length === 0, tests: quiz.questions.length, solutions: ran, problems };
}

/** Lessons: they load, their unit and prerequisites exist, and (strict) they are long enough to teach. */
function validateLesson(dir: string): ChallengeReport {
  const problems: string[] = [];
  const warnings: string[] = [];
  let words = 0;
  let id = path.basename(dir);
  try {
    const lesson = loadLesson(dir, 'en');
    id = lesson.id;
    words = lesson.body.split(/\s+/).filter(Boolean).length;
    if (lesson.topic && !unitKey(lesson.topic)) {
      problems.push(`"topic" is "${lesson.topic}", which is not a unit of any subject`);
    }
    problems.push(...referenceProblems(lesson));
    const raw = JSON.parse(fs.readFileSync(path.join(dir, 'lesson.json'), 'utf8'));
    if (raw.readings !== undefined) {
      // A reading guide (docs/content-guide.md#reading-guides): a short summary and curated readings.
      // Programming subjects use quick guides: the challenges teach, so the guide is shorter.
      const quick = findSubject(subjectOf(lesson))?.kind === 'programming';
      problems.push(...readingProblems(raw.readings, quick ? 2 : 3));
      const summary = lesson.body.split(READINGS_MARKER)[0].split(/\s+/).filter(Boolean).length;
      const [fewest, most, aim] = quick ? [40, 180, '60 to 120'] : [100, 350, '150 to 250'];
      if (summary < fewest || summary > most) {
        warnings.push(`the "In short" summary has ${summary} words; aim for ${aim}`);
      }
      const [fewestObjectives, mostObjectives] = quick ? [2, 3] : [3, 5];
      if (lesson.objectives.length < fewestObjectives || lesson.objectives.length > mostObjectives) {
        warnings.push(`${lesson.objectives.length} objectives; a ${quick ? 'quick guide' : 'unit'} has ${fewestObjectives} to ${mostObjectives}`);
      }
    } else {
      if (words < 250) {
        warnings.push(`lesson.md is short (${words} words; aim for 250 or more)`);
      }
      if (!/^##\s/m.test(lesson.body)) {
        warnings.push('lesson.md has no "##" sections');
      }
    }
  } catch (e) {
    problems.push((e as Error).message);
  }
  return { kind: 'lesson', id, dir, ok: problems.length === 0, tests: words, solutions: 0, problems, warnings };
}

/** Each reading needs a title, a source, an https link, a type, its minutes and what to look for. */
export function readingProblems(readings: unknown, most = 3): string[] {
  if (!Array.isArray(readings) || readings.length === 0 || readings.length > most) {
    return [`"readings" must list 1 to ${most} readings`];
  }
  const problems: string[] = [];
  readings.forEach((r, i) => {
    const where = `reading ${i + 1}`;
    for (const field of ['title', 'source', 'lookFor', 'lang']) {
      if (typeof r?.[field] !== 'string' || !r[field].trim()) problems.push(`${where}: needs "${field}"`);
    }
    if (typeof r?.url !== 'string' || !/^https:\/\/[^\s]+$/.test(r.url)) problems.push(`${where}: "url" must be an https link`);
    if (!(READING_TYPES as readonly string[]).includes(r?.type)) problems.push(`${where}: "type" must be ${READING_TYPES.join(', ')}`);
    if (!Number.isInteger(r?.minutes) || r.minutes <= 0) problems.push(`${where}: "minutes" must be a whole number above 0`);
  });
  return problems;
}

/**
 * The content standard for a challenge (docs/creating-challenges.md#checklist): a description that
 * teaches, enough hidden tests to catch edge cases, and hints to get unstuck.
 */
export function contentWarnings(c: Challenge): string[] {
  const warnings: string[] = [];
  const words = c.description.split(/\s+/).filter(Boolean).length;
  if (!/^\*\*Things to know\*\*|^#+\s*Things to know/im.test(c.description)) {
    warnings.push('description.md has no "Things to know" section about the Java features involved');
  }
  if (words < 40) {
    warnings.push(`description.md is very short (${words} words)`);
  }
  // A program that reads no input (like Hello, World!) can't have meaningful hidden tests.
  const readsInput = c.tests.some((t) => t.input.trim() !== '');
  const hidden = c.tests.filter((t) => t.hidden).length;
  if (readsInput && hidden < 3) {
    warnings.push(`only ${hidden} hidden test${hidden === 1 ? '' : 's'} (add edge cases: 3 or more)`);
  }
  if (readsInput && c.tests.length - hidden < 2) {
    warnings.push('fewer than 2 visible tests (the panel shows them as examples)');
  }
  if (c.hints.length < 2) {
    warnings.push(`only ${c.hints.length} hint${c.hints.length === 1 ? '' : 's'} (2 to 4)`);
  }
  return warnings;
}

export async function validateChallenges(roots: string[], opts: ValidateOptions = {}): Promise<ValidationReport> {
  const practice = loadChallenges(roots);
  // Private questions live in folders next to an exam.json; validate them too, plus the exam files themselves.
  const examDirs = findExamDirs(roots);
  const questions = examDirs.length ? loadChallenges(examDirs) : { challenges: [], errors: [] };
  const challenges = [...practice.challenges, ...questions.challenges];
  const references = opts.referenceRoots?.length ? loadChallenges(opts.referenceRoots).challenges : [];
  // Quizzes: practice ones in the roots, and private ones inside exam folders.
  const quizDirs = [...findQuizDirs(roots), ...findQuizDirs(examDirs)];
  const quizLoad = loadQuizzes([...roots, ...examDirs]);
  const referenceQuizzes = opts.referenceRoots?.length ? loadQuizzes(opts.referenceRoots).quizzes : [];
  const errors = [
    ...practice.errors,
    ...questions.errors,
    ...quizLoad.errors,
    ...loadExams(roots, [...references, ...practice.challenges], [...referenceQuizzes, ...loadQuizzes(roots).quizzes]).errors,
    ...examDirs.flatMap(examSubjectProblems),
  ];
  const javacVersion = await javacMajorVersion(opts.javaHome);
  const counters = { checked: 0, skipped: 0 };
  const reports: ChallengeReport[] = [];
  for (const c of challenges) {
    const report = await validateOne(c, javacVersion, opts, counters);
    for (const lang of opts.languages ?? []) {
      report.warnings = [...(report.warnings ?? []), ...translationProblems(c.dir, lang).map((p) => `${lang}: ${p}`)];
    }
    if (opts.strict && report.warnings?.length) {
      report.ok = false;
    }
    reports.push(report);
    opts.onChallenge?.(report);
  }
  const broken = new Set(quizLoad.errors.map((e) => e.slice(0, e.indexOf(': '))));
  for (const dir of quizDirs.filter((d) => !broken.has(d))) {
    const report = await validateQuiz(dir, javacVersion, opts, counters);
    for (const lang of opts.languages ?? []) {
      report.warnings = [...(report.warnings ?? []), ...translationProblems(dir, lang).map((p) => `${lang}: ${p}`)];
    }
    if (opts.strict && report.warnings?.length) {
      report.ok = false;
    }
    reports.push(report);
    opts.onChallenge?.(report);
  }
  for (const dir of findLessonDirs(roots)) {
    const report = validateLesson(dir);
    for (const lang of opts.languages ?? []) {
      report.warnings = [...(report.warnings ?? []), ...translationProblems(dir, lang).map((p) => `${lang}: ${p}`)];
    }
    if (opts.strict && report.warnings?.length) {
      report.ok = false;
    }
    reports.push(report);
    opts.onChallenge?.(report);
  }
  return { javacVersion, loadErrors: errors, challenges: reports, checkedSolutions: counters.checked, skippedSolutions: counters.skipped };
}

export function formatReport(report: ValidationReport, generate = false): string[] {
  const lines = [`Using javac ${report.javacVersion ?? '(not found)'}`, ''];
  report.loadErrors.forEach((e) => lines.push(`✗ ${e}`));
  for (const c of report.challenges) {
    const summary = c.kind === 'quiz'
      ? `quiz, ${c.tests} questions, ${c.solutions} code snippet${c.solutions === 1 ? '' : 's'} run`
      : c.kind === 'lesson'
        ? `lesson, ${c.tests} words`
        : `${c.tests} tests × ${c.solutions} solution${c.solutions === 1 ? '' : 's'}`;
    const warn = (c.warnings ?? []).map((w) => `\n  ⚠ ${w}`).join('');
    lines.push(c.problems.length ? `✗ ${c.id}\n  ${c.problems.join('\n  ')}${warn}` : `${c.ok ? '✓' : '✗'} ${c.id} (${summary})${generate ? ', outputs written' : ''}${warn}`);
  }
  const ok = report.challenges.filter((c) => c.ok).length;
  const quizzes = report.challenges.filter((c) => c.kind === 'quiz').length;
  const lessons = report.challenges.filter((c) => c.kind === 'lesson').length;
  const what = ['challenges', quizzes ? 'quizzes' : '', lessons ? 'lessons' : ''].filter(Boolean);
  const kinds = what.length > 1 ? `${what.slice(0, -1).join(', ')} and ${what[what.length - 1]}` : what[0];
  lines.push('', `${ok}/${report.challenges.length} ${kinds} OK (${report.checkedSolutions} solutions${quizzes ? ' and snippets' : ''} checked)`);
  const warned = report.challenges.filter((c) => c.warnings?.length).length;
  if (warned) {
    lines.push(`⚠ ${warned} challenge(s) don't meet the content standard yet (see the ⚠ lines).`);
  }
  if (report.skippedSolutions) {
    lines.push(`⚠ Skipped ${report.skippedSolutions} modern solution(s): they need JDK 25+ (found ${report.javacVersion ?? 'none'}). Only *.classic.java files were checked.`);
  }
  return lines;
}

export function reportPassed(report: ValidationReport): boolean {
  return report.loadErrors.length === 0 && report.challenges.every((c) => c.ok);
}

/**
 * What a challenge, quiz or exam folder is missing in `lang`: the translated description, title,
 * hints, rule messages, and quiz texts. Counts must match the original so nothing is left untranslated.
 */
export function translationProblems(dir: string, lang: string): string[] {
  const problems: string[] = [];
  const read = (file: string) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const count = (a: unknown) => (Array.isArray(a) ? a.length : 0);
  if (fs.existsSync(path.join(dir, 'challenge.json'))) {
    const meta = read('challenge.json');
    const t = meta.translations?.[lang] ?? {};
    if (!fs.existsSync(path.join(dir, `description.${lang}.md`))) problems.push(`no description.${lang}.md`);
    if (!t.title) problems.push(`no ${lang} title`);
    if (count(meta.hints) && count(t.hints) !== count(meta.hints)) problems.push(`${count(t.hints)} of ${count(meta.hints)} hints translated`);
    for (const rules of ['mustContain', 'mustNotContain'] as const) {
      if (count(meta[rules]) && count(t[rules]) !== count(meta[rules])) problems.push(`${count(t[rules])} of ${count(meta[rules])} ${rules} messages translated`);
    }
  } else if (fs.existsSync(path.join(dir, 'quiz.json'))) {
    const meta = read('quiz.json');
    const t = meta.translations?.[lang] ?? {};
    if (!t.title) problems.push(`no ${lang} title`);
    if (meta.description && !t.description) problems.push(`no ${lang} description`);
    (meta.questions as Record<string, unknown>[]).forEach((q, i) => {
      const tq = t.questions?.[i] ?? {};
      if (q.prompt && !tq.prompt) problems.push(`question ${i + 1}: no ${lang} prompt`);
      if (q.explanation && !tq.explanation) problems.push(`question ${i + 1}: no ${lang} explanation`);
      if (q.type === 'choice' && count(tq.options) !== count(q.options)) problems.push(`question ${i + 1}: options not translated`);
    });
  } else if (fs.existsSync(path.join(dir, 'lesson.json'))) {
    const meta = read('lesson.json');
    if (!meta.translations?.[lang]?.title) problems.push(`no ${lang} title`);
    if (!fs.existsSync(path.join(dir, `lesson.${lang}.md`))) problems.push(`no lesson.${lang}.md`);
    const t = meta.translations?.[lang] ?? {};
    if (count(meta.objectives) && count(t.objectives) !== count(meta.objectives)) problems.push('objectives not translated');
    (Array.isArray(meta.readings) ? meta.readings : []).forEach((_r: unknown, i: number) => {
      if (!t.readings?.[i]?.lookFor) problems.push(`reading ${i + 1}: no ${lang} "lookFor"`);
    });
  } else if (fs.existsSync(path.join(dir, 'exam.json'))) {
    const meta = read('exam.json');
    if (!meta.translations?.[lang]?.title) problems.push(`no ${lang} title`);
  }
  return problems;
}
