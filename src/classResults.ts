// The class results dashboard's data: reads the results files students handed in for one exam and
// summarizes them. No vscode dependency, so it can be unit tested.
import * as fs from 'fs';
import * as path from 'path';
import type { ExamResultsFile } from './examSession';
import { isResultsFormat } from './exams';

export interface StudentRow {
  file: string;
  student: string;
  earned: number;
  max: number;
  /** Score as a percentage of the maximum, rounded to one decimal. */
  percent: number;
  /** Earned points per question id. */
  questions: Record<string, { earned: number; points: number; submissions: number }>;
  timeTakenSeconds: number;
  awaySeconds: number;
  finishedBy: ExamResultsFile['finishedBy'];
  warnings: { paste: number; copy: number; away: number; copilot: number };
  startedAt: string;
}

export interface ClassReport {
  examId: string;
  examTitle: string;
  max: number;
  /** Questions in exam order, with the class average for each. */
  questions: { id: string; title: string; points: number; average: number }[];
  rows: StudentRow[];
  stats: { count: number; average: number; median: number; highest: number; lowest: number };
  /** Files that could not be read, as "name: reason". */
  errors: string[];
  /** Results files for other exams found in the same place, skipped. */
  skipped: number;
}

const round = (n: number, digits = 2) => Math.round(n * 10 ** digits) / 10 ** digits;

/** Results files (*.json with format "sphinx-exam-results") in the given files and folders, two levels deep. */
export function findResultsFiles(paths: string[]): string[] {
  const out: string[] = [];
  const visit = (p: string, depth: number) => {
    const stat = fs.statSync(p, { throwIfNoEntry: false });
    if (!stat) {
      return;
    }
    if (stat.isDirectory()) {
      if (depth > 2) {
        return;
      }
      for (const name of fs.readdirSync(p).sort()) {
        if (!name.startsWith('.')) {
          visit(path.join(p, name), depth + 1);
        }
      }
    } else if (p.toLowerCase().endsWith('.json')) {
      out.push(p);
    }
  };
  paths.forEach((p) => visit(p, 0));
  return [...new Set(out)];
}

/** Parses the files, keeping valid results files and reporting the others. */
export function readResults(files: string[]): { results: { file: string; data: ExamResultsFile }[]; errors: string[] } {
  const results: { file: string; data: ExamResultsFile }[] = [];
  const errors: string[] = [];
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8')) as ExamResultsFile;
      if (!isResultsFormat(data?.format) || !data.exam?.id || !Array.isArray(data.questions)) {
        continue; // not a results file (other JSON in the folder)
      }
      results.push({ file, data });
    } catch (e) {
      errors.push(`${path.basename(file)}: ${(e as Error).message}`);
    }
  }
  return { results, errors };
}

/** The exams found in the results, most files first. */
export function examsInResults(results: { data: ExamResultsFile }[]): { id: string; title: string; count: number }[] {
  const byId = new Map<string, { id: string; title: string; count: number }>();
  for (const { data } of results) {
    const e = byId.get(data.exam.id) ?? { id: data.exam.id, title: data.exam.title, count: 0 };
    e.count++;
    byId.set(data.exam.id, e);
  }
  return [...byId.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
}

export function buildClassReport(results: { file: string; data: ExamResultsFile }[], examId: string, errors: string[] = []): ClassReport {
  const mine = results.filter((r) => r.data.exam.id === examId);
  const first = mine[0]?.data;
  const questions = (first?.questions ?? []).map((q) => ({ id: q.id, title: q.title, points: q.points, average: 0 }));
  const rows: StudentRow[] = mine.map(({ file, data }) => {
    const count = (kind: string) => data.warnings?.filter((w) => w.kind === kind).length ?? 0;
    return {
      file,
      student: data.student,
      earned: data.score.earned,
      max: data.score.max,
      percent: data.score.max ? round((100 * data.score.earned) / data.score.max, 1) : 0,
      questions: Object.fromEntries(data.questions.map((q) => [q.id, { earned: q.earned, points: q.points, submissions: q.submissions }])),
      timeTakenSeconds: data.timeTakenSeconds,
      awaySeconds: data.awaySeconds ?? 0,
      finishedBy: data.finishedBy,
      warnings: { paste: count('paste'), copy: count('copy'), away: count('away'), copilot: count('copilot') },
      startedAt: data.startedAt,
    };
  });
  rows.sort((a, b) => a.student.localeCompare(b.student));
  for (const q of questions) {
    const scores = rows.map((r) => r.questions[q.id]?.earned ?? 0);
    q.average = scores.length ? round(scores.reduce((s, x) => s + x, 0) / scores.length) : 0;
  }
  const scores = rows.map((r) => r.earned).sort((a, b) => a - b);
  const mid = Math.floor(scores.length / 2);
  return {
    examId,
    examTitle: first?.exam.title ?? examId,
    max: first?.score.max ?? 0,
    questions,
    rows,
    stats: {
      count: rows.length,
      average: scores.length ? round(scores.reduce((s, x) => s + x, 0) / scores.length) : 0,
      median: scores.length ? (scores.length % 2 ? scores[mid] : round((scores[mid - 1] + scores[mid]) / 2)) : 0,
      highest: scores.length ? scores[scores.length - 1] : 0,
      lowest: scores.length ? scores[0] : 0,
    },
    errors,
    skipped: results.length - mine.length,
  };
}

const csvCell = (v: string | number) => {
  const s = String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** One row per student, ready for a spreadsheet. */
export function toCsv(report: ClassReport): string {
  const header = ['Student', 'Score', 'Max', 'Percent', ...report.questions.map((q) => `${q.title} (${q.points})`), 'Time (min)', 'Away (min)', 'Finished by', 'Paste warnings', 'Copy warnings', 'Away warnings', 'Copilot warnings', 'Started at', 'File'];
  const lines = report.rows.map((r) =>
    [
      r.student,
      r.earned,
      r.max,
      r.percent,
      ...report.questions.map((q) => r.questions[q.id]?.earned ?? 0),
      round(r.timeTakenSeconds / 60, 1),
      round(r.awaySeconds / 60, 1),
      r.finishedBy,
      r.warnings.paste,
      r.warnings.copy,
      r.warnings.away,
      r.warnings.copilot,
      r.startedAt,
      path.basename(r.file),
    ].map(csvCell).join(','),
  );
  return [header.map(csvCell).join(','), ...lines].join('\n') + '\n';
}
