// Checks challenge folders: every Starter*.java must compile, and every Solution*.java must
// satisfy the rules and pass every test. Files without ".classic" in their name use Java 25+
// syntax and are skipped on older JDKs. Shared by `npm run validate` and the
// "Validate Challenges" command, so it has no vscode dependency.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Challenge, loadChallenges } from './challenges';
import { RunOutcome, RunRequest, javacMajorVersion, normalizeOutput, runChallengeCode } from './runner';
import { findTestDirs, loadTests } from './tests';

export interface ChallengeReport {
  id: string;
  dir: string;
  ok: boolean;
  tests: number;
  solutions: number;
  problems: string[];
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

async function validateOne(c: Challenge, javacVersion: number | undefined, opts: ValidateOptions, counters: { checked: number; skipped: number }): Promise<ChallengeReport> {
  const problems: string[] = [];
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

  return { id: c.id, dir: c.dir, ok: problems.length === 0, tests: c.tests.length, solutions: solutions.length, problems };
}

export async function validateChallenges(roots: string[], opts: ValidateOptions = {}): Promise<ValidationReport> {
  const practice = loadChallenges(roots);
  // Private questions live in folders next to a test.json; validate them too, plus the test files themselves.
  const testDirs = findTestDirs(roots);
  const questions = testDirs.length ? loadChallenges(testDirs) : { challenges: [], errors: [] };
  const challenges = [...practice.challenges, ...questions.challenges];
  const references = opts.referenceRoots?.length ? loadChallenges(opts.referenceRoots).challenges : [];
  const errors = [...practice.errors, ...questions.errors, ...loadTests(roots, [...references, ...practice.challenges]).errors];
  const javacVersion = await javacMajorVersion(opts.javaHome);
  const counters = { checked: 0, skipped: 0 };
  const reports: ChallengeReport[] = [];
  for (const c of challenges) {
    const report = await validateOne(c, javacVersion, opts, counters);
    reports.push(report);
    opts.onChallenge?.(report);
  }
  return { javacVersion, loadErrors: errors, challenges: reports, checkedSolutions: counters.checked, skippedSolutions: counters.skipped };
}

export function formatReport(report: ValidationReport, generate = false): string[] {
  const lines = [`Using javac ${report.javacVersion ?? '(not found)'}`, ''];
  report.loadErrors.forEach((e) => lines.push(`✗ ${e}`));
  for (const c of report.challenges) {
    lines.push(c.ok ? `✓ ${c.id} (${c.tests} tests × ${c.solutions} solution${c.solutions === 1 ? '' : 's'})${generate ? ', outputs written' : ''}` : `✗ ${c.id}\n  ${c.problems.join('\n  ')}`);
  }
  const ok = report.challenges.filter((c) => c.ok).length;
  lines.push('', `${ok}/${report.challenges.length} challenges OK (${report.checkedSolutions} solutions checked)`);
  if (report.skippedSolutions) {
    lines.push(`⚠ Skipped ${report.skippedSolutions} modern solution(s): they need JDK 25+ (found ${report.javacVersion ?? 'none'}). Only *.classic.java files were checked.`);
  }
  return lines;
}

export function reportPassed(report: ValidationReport): boolean {
  return report.loadErrors.length === 0 && report.challenges.every((c) => c.ok);
}
