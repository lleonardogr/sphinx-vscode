// Re-grades a student's exam results file: runs the code saved for each question against the
// question's tests and recomputes the score. A results file is plain JSON that a student could
// edit, so teachers should trust the recomputed score, not the stored one. No vscode dependency.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { runChallengeCode } from './runner';
import { ExamDefinition, scoreOutcome } from './exams';
import type { ExamResultsFile } from './examSession';

export interface VerifiedQuestion {
  id: string;
  points: number;
  claimed: number;
  recomputed: number;
  passed: number;
  total: number;
  note?: string;
}

export interface VerificationReport {
  student: string;
  examTitle: string;
  claimed: number;
  recomputed: number;
  max: number;
  matches: boolean;
  questions: VerifiedQuestion[];
  warnings: ExamResultsFile['warnings'];
  timeTakenSeconds: number;
  finishedBy: string;
}

export async function verifyResults(resultsPath: string, exams: ExamDefinition[], javaHome?: string): Promise<VerificationReport> {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8')) as ExamResultsFile;
  if (results.format !== 'tech-challenges-exam-results') {
    throw new Error('This is not a Tech Challenges exam results file.');
  }
  const exam = exams.find((t) => t.id === results.exam?.id);
  if (!exam) {
    throw new Error(`The exam "${results.exam?.id}" is not available. Add the folder that contains it to techChallenges.extraChallengePaths.`);
  }

  const questions: VerifiedQuestion[] = [];
  for (const q of exam.questions) {
    const saved = results.questions.find((x) => x.id === q.id);
    const claimed = saved?.earned ?? 0;
    if (!saved || !saved.code.trim() || !saved.submissions) {
      questions.push({ id: q.id, points: q.points, claimed, recomputed: 0, passed: 0, total: q.challenge.tests.length, note: 'no submission' });
      continue;
    }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tech-challenge-verify-'));
    try {
      const file = path.join(dir, 'Main.java');
      fs.writeFileSync(file, saved.code);
      const outcome = await runChallengeCode({
        file,
        tests: q.challenge.tests,
        mustContain: q.challenge.mustContain,
        mustNotContain: q.challenge.mustNotContain,
        timeLimitMs: q.challenge.timeLimitMs,
        javaHome,
      });
      const score = scoreOutcome(outcome, q.points);
      questions.push({
        id: q.id,
        points: q.points,
        claimed,
        recomputed: score.earned,
        passed: score.passed,
        total: score.total || q.challenge.tests.length,
        note: outcome.kind === 'tests' ? undefined : outcome.kind,
      });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  const sum = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) * 100) / 100;
  const recomputed = sum(questions.map((q) => q.recomputed));
  const claimed = typeof results.score?.earned === 'number' ? results.score.earned : sum(questions.map((q) => q.claimed));
  return {
    student: results.student,
    examTitle: exam.title,
    claimed,
    recomputed,
    max: sum(exam.questions.map((q) => q.points)),
    matches: Math.abs(claimed - recomputed) < 0.01 && questions.every((q) => Math.abs(q.claimed - q.recomputed) < 0.01),
    questions,
    warnings: results.warnings ?? [],
    timeTakenSeconds: results.timeTakenSeconds,
    finishedBy: results.finishedBy,
  };
}

export function formatVerification(r: VerificationReport): string[] {
  const minutes = Math.round((r.timeTakenSeconds ?? 0) / 60);
  const lines = [
    `${r.student}: ${r.examTitle}`,
    `  Score (re-graded): ${r.recomputed} / ${r.max}${r.matches ? '  ✓ matches the results file' : `  ⚠ the results file claims ${r.claimed}`}`,
    `  Time taken: ${minutes} min (finished by ${r.finishedBy === 'time' ? 'the time limit' : 'the student'})`,
  ];
  for (const q of r.questions) {
    const mismatch = Math.abs(q.claimed - q.recomputed) >= 0.01 ? `  ⚠ claimed ${q.claimed}` : '';
    lines.push(`  - ${q.id}: ${q.recomputed} / ${q.points} (${q.passed}/${q.total} tests)${q.note ? ` [${q.note}]` : ''}${mismatch}`);
  }
  if (r.warnings.length) {
    lines.push(`  Integrity warnings (${r.warnings.length}):`);
    for (const w of r.warnings) {
      lines.push(`    • ${w.at.replace('T', ' ').slice(0, 19)} ${w.kind}${w.question ? ` (${w.question})` : ''}: ${w.detail}`);
    }
  } else {
    lines.push('  Integrity warnings: none');
  }
  return lines;
}
