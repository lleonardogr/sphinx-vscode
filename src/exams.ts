// Exams: timed, graded sets of challenges. An exam is a folder containing exam.json:
//
//   {
//     "title": "Week 3 Exam",
//     "durationMinutes": 45,
//     "mode": "closed",            // "open": hints, AI hints and the internet allowed; "closed": no hints, integrity warnings recorded
//     "maxSubmissions": 3,         // per question
//     "questions": [
//       { "id": "even-or-odd", "points": 20 },   // a built-in challenge id...
//       { "id": "sum-of-evens", "points": 50 }   // ...or a challenge or quiz folder inside the exam folder
//     ]
//   }
//
// No vscode dependency, so the validator can reuse it.
import * as fs from 'fs';
import * as path from 'path';
import { Challenge, loadChallenge } from './challenges';
import { QuizDefinition, loadQuiz } from './quizzes';
import { language } from './i18n';
import { RunOutcome } from './runner';

export type ExamMode = 'open' | 'closed';

interface ExamQuestionBase {
  /** The question id inside the exam (a challenge or quiz id, or a sub-folder name). */
  id: string;
  points: number;
}

export type ExamQuestion =
  /** A coding challenge. Its id is namespaced: exam:<examId>:<questionId>. */
  | (ExamQuestionBase & { kind: 'challenge'; challenge: Challenge })
  /** A quiz, submitted once and graded by its answers. Its id is namespaced the same way. */
  | (ExamQuestionBase & { kind: 'quiz'; quiz: QuizDefinition });

export function questionTitle(q: ExamQuestion): string {
  return q.kind === 'quiz' ? q.quiz.title : q.challenge.title;
}

/** The namespaced id the panels use for an exam question. */
export function questionKey(q: ExamQuestion): string {
  return q.kind === 'quiz' ? q.quiz.id : q.challenge.id;
}

export interface ExamDefinition {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  mode: ExamMode;
  maxSubmissions: number;
  questions: ExamQuestion[];
  dir: string;
}

export function examChallengeId(examId: string, questionId: string): string {
  return `exam:${examId}:${questionId}`;
}

export function parseExamChallengeId(id: string): { examId: string; questionId: string } | undefined {
  const m = /^exam:([^:]+):(.+)$/.exec(id);
  return m ? { examId: m[1], questionId: m[2] } : undefined;
}

export function maxScore(exam: ExamDefinition): number {
  return exam.questions.reduce((sum, q) => sum + q.points, 0);
}

/** Partial credit: points × (tests passed / total tests). Rule violations and compile errors earn 0. */
export function scoreOutcome(outcome: RunOutcome, points: number): { earned: number; passed: number; total: number } {
  if (outcome.kind !== 'tests' || outcome.results.length === 0) {
    return { earned: 0, passed: 0, total: outcome.kind === 'tests' ? outcome.results.length : 0 };
  }
  const passed = outcome.results.filter((r) => r.passed).length;
  const total = outcome.results.length;
  return { earned: Math.round((points * passed * 100) / total) / 100, passed, total };
}

function loadExam(dir: string, challenges: Challenge[], quizzes: QuizDefinition[]): ExamDefinition {
  const lang = language();
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'exam.json'), 'utf8'));
  const id = meta.id ?? path.basename(dir);
  if (!meta.title || !Array.isArray(meta.questions) || meta.questions.length === 0) {
    throw new Error('exam.json needs a "title" and at least one entry in "questions"');
  }
  const mode: ExamMode = meta.mode === 'open' ? 'open' : 'closed';
  const questions: ExamQuestion[] = meta.questions.map((q: { id?: string; points?: number }, i: number) => {
    if (!q?.id) {
      throw new Error(`question ${i + 1} needs an "id"`);
    }
    const points = typeof q.points === 'number' && q.points > 0 ? q.points : 10;
    const local = path.join(dir, q.id);
    let base: Challenge | undefined;
    let quiz: QuizDefinition | undefined;
    if (fs.existsSync(path.join(local, 'quiz.json'))) {
      quiz = loadQuiz(local);
    } else if (fs.existsSync(path.join(local, 'challenge.json'))) {
      base = loadChallenge(local);
    } else {
      base = challenges.find((c) => c.id === q.id);
      quiz = base ? undefined : quizzes.find((z) => z.id === q.id);
    }
    if (quiz) {
      return { kind: 'quiz', id: q.id, points, quiz: { ...quiz, id: examChallengeId(id, q.id) } };
    }
    if (!base) {
      throw new Error(`question "${q.id}" is neither a folder in this exam nor a known challenge or quiz id`);
    }
    const challenge: Challenge = {
      ...base,
      id: examChallengeId(id, q.id),
      topic: meta.title,
      // Closed exams: no built-in hints and no AI hints.
      hints: mode === 'open' ? base.hints : [],
      aiHints: mode === 'open' && base.aiHints,
    };
    return { kind: 'challenge', id: q.id, points, challenge };
  });
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) {
      throw new Error(`question "${q.id}" is listed twice`);
    }
    ids.add(q.id);
  }
  return {
    id,
    title: (lang !== 'en' && meta.translations?.[lang]?.title) || meta.title,
    description: (lang !== 'en' && meta.translations?.[lang]?.description) || (meta.description ?? ''),
    durationMinutes: typeof meta.durationMinutes === 'number' && meta.durationMinutes > 0 ? meta.durationMinutes : 60,
    mode,
    maxSubmissions: typeof meta.maxSubmissions === 'number' && meta.maxSubmissions > 0 ? Math.floor(meta.maxSubmissions) : 3,
    questions,
    dir,
  };
}

/** Finds every sub-folder of `roots` that contains an exam.json. */
export function findExamDirs(roots: string[]): string[] {
  const dirs: string[] = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, entry.name);
      if (entry.isDirectory() && fs.existsSync(path.join(dir, 'exam.json'))) {
        dirs.push(dir);
      }
    }
  }
  return dirs;
}

export function loadExams(roots: string[], challenges: Challenge[], quizzes: QuizDefinition[] = []): { exams: ExamDefinition[]; errors: string[] } {
  const byId = new Map<string, ExamDefinition>();
  const errors: string[] = [];
  for (const dir of findExamDirs(roots)) {
    try {
      const exam = loadExam(dir, challenges, quizzes);
      byId.set(exam.id, exam);
    } catch (e) {
      errors.push(`${dir}: ${(e as Error).message}`);
    }
  }
  return { exams: [...byId.values()].sort((a, b) => a.title.localeCompare(b.title)), errors };
}
