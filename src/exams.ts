// Exams: timed, graded sets of challenges. An exam is a folder containing exam.json:
//
//   {
//     "title": "Week 3 Exam",
//     "durationMinutes": 45,
//     "mode": "closed",            // "open": hints, AI hints and the internet allowed; "closed": no hints, integrity warnings recorded
//     "maxSubmissions": 3,         // per question
//     "subject": "java",           // optional: by default, the subject most of the questions come from
//     "retakeAfterHours": 6,       // optional: hours before a finished exam can be taken again (default 6); false: never
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
import { language, tr } from './i18n';
import { subjectOf } from './path';
import { RunOutcome } from './runner';
import { DEFAULT_SUBJECT, findSubject } from './subjects';

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

/** Anti-cheating rules. Closed exams default to blocking copy and large pastes; open exams to none. */
/** Ready-made sets of rules, from no restrictions to the strictest. */
export type RestrictionLevel = 'none' | 'relaxed' | 'standard' | 'strict';
export const RESTRICTION_LEVELS: RestrictionLevel[] = ['none', 'relaxed', 'standard', 'strict'];

export interface ExamRestrictions {
  level: RestrictionLevel;
  /** Record integrity warnings (large pastes, time outside VS Code, Copilot) in the results. */
  record: boolean;
  /** No copying from the question panel, and no Copy/Cut in the answer files. */
  blockCopy: boolean;
  /** Pastes of pasteLimit characters or more are undone. */
  blockPaste: boolean;
  pasteLimit: number;
  /** Total time outside VS Code allowed, in seconds; past it the exam finishes. 0 = no limit (only recorded). */
  maxAwaySeconds: number;
}

export const DEFAULT_PASTE_LIMIT = 50;

const LEVELS: Record<RestrictionLevel, Omit<ExamRestrictions, 'level'>> = {
  none: { record: false, blockCopy: false, blockPaste: false, pasteLimit: DEFAULT_PASTE_LIMIT, maxAwaySeconds: 0 },
  relaxed: { record: true, blockCopy: false, blockPaste: false, pasteLimit: DEFAULT_PASTE_LIMIT, maxAwaySeconds: 0 },
  standard: { record: true, blockCopy: true, blockPaste: true, pasteLimit: DEFAULT_PASTE_LIMIT, maxAwaySeconds: 0 },
  strict: { record: true, blockCopy: true, blockPaste: true, pasteLimit: 30, maxAwaySeconds: 60 },
};

/**
 * The exam's rules: a level ("none", "relaxed", "standard" or "strict"; closed exams default to
 * "standard" and open exams to "none"), with any rule written next to it overriding the level.
 */
export function examRestrictions(mode: ExamMode, raw: unknown): ExamRestrictions {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const level: RestrictionLevel = RESTRICTION_LEVELS.includes(r.level as RestrictionLevel) ? (r.level as RestrictionLevel) : mode === 'closed' ? 'standard' : 'none';
  const base = LEVELS[level];
  const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
  const num = (v: unknown, fallback: number, min: number) => (typeof v === 'number' && v >= min ? Math.floor(v) : fallback);
  const blockCopy = bool(r.blockCopy, base.blockCopy);
  const blockPaste = bool(r.blockPaste, base.blockPaste);
  const maxAwaySeconds = num(r.maxAwaySeconds, base.maxAwaySeconds, 0);
  return {
    level,
    // Blocking or limiting something implies recording it.
    record: bool(r.record, base.record) || blockCopy || blockPaste || maxAwaySeconds > 0,
    blockCopy,
    blockPaste,
    pasteLimit: num(r.pasteLimit, base.pasteLimit, 10),
    maxAwaySeconds,
  };
}

export interface ExamDefinition {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  mode: ExamMode;
  maxSubmissions: number;
  restrictions: ExamRestrictions;
  questions: ExamQuestion[];
  /** Hours after finishing before the exam can be taken again; null: never (exam.json "retakeAfterHours": false). */
  retakeAfterHours: number | null;
  /** The subject whose sidebar lists it (see examSubject). */
  subject: string;
  dir: string;
  /** A teacher's practice attempt of another exam (see previewOf). */
  preview?: boolean;
}

/**
 * The "format" of an exam results file. Files written before Sphinx was spelled correctly say
 * "sphynx-exam-results", and before the rename from Tech Challenges "tech-challenges-exam-results".
 */
export const RESULTS_FORMAT = 'sphinx-exam-results';
const OLD_RESULTS_FORMATS = ['sphynx-exam-results', 'tech-challenges-exam-results'];

export function isResultsFormat(format: unknown): boolean {
  return format === RESULTS_FORMAT || OLD_RESULTS_FORMATS.includes(format as string);
}

/** Suffix of a preview exam's id: "exam-1" is previewed as "exam-1--preview". */
export const PREVIEW_SUFFIX = '--preview';

/**
 * A teacher's practice attempt of an exam: the same questions, rules and timer, under its own id, so
 * its answers and results never mix with a real attempt (and the verifier rejects its results file).
 */
export function previewOf(exam: ExamDefinition): ExamDefinition {
  const id = exam.id + PREVIEW_SUFFIX;
  return {
    ...exam,
    id,
    title: tr(`${exam.title} (preview)`, `${exam.title} (prévia)`),
    preview: true,
    questions: exam.questions.map((q) =>
      q.kind === 'quiz' ? { ...q, quiz: { ...q.quiz, id: examChallengeId(id, q.id) } } : { ...q, challenge: { ...q.challenge, id: examChallengeId(id, q.id) } },
    ),
  };
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

/** Default wait before a finished exam can be taken again. */
export const DEFAULT_RETAKE_HOURS = 6;

/** exam.json "retakeAfterHours": hours (0 = right away), false = never, anything else = the default. */
export function retakeHours(raw: unknown): number | null {
  if (raw === false) {
    return null;
  }
  return typeof raw === 'number' && raw >= 0 ? raw : DEFAULT_RETAKE_HOURS;
}

/** "subject" in exam.json when it names a subject, else the subject most of the questions come from. */
function examSubject(subject: unknown, sources: { topic?: string; unit?: string; subject?: string }[]): string {
  const own = typeof subject === 'string' ? subject.trim() : '';
  if (findSubject(own)) {
    return own;
  }
  const counts = new Map<string, number>();
  for (const source of sources) {
    const id = subjectOf(source);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? DEFAULT_SUBJECT;
}

function loadExam(dir: string, challenges: Challenge[], quizzes: QuizDefinition[]): ExamDefinition {
  const lang = language();
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'exam.json'), 'utf8'));
  const id = meta.id ?? path.basename(dir);
  if (!meta.title || !Array.isArray(meta.questions) || meta.questions.length === 0) {
    throw new Error('exam.json needs a "title" and at least one entry in "questions"');
  }
  const mode: ExamMode = meta.mode === 'open' ? 'open' : 'closed';
  const sources: (Challenge | QuizDefinition)[] = [];
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
      sources.push(quiz);
      return { kind: 'quiz', id: q.id, points, quiz: { ...quiz, id: examChallengeId(id, q.id) } };
    }
    if (!base) {
      throw new Error(`question "${q.id}" is neither a folder in this exam nor a known challenge or quiz id`);
    }
    sources.push(base);
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
    restrictions: examRestrictions(mode, meta.restrictions),
    questions,
    retakeAfterHours: retakeHours(meta.retakeAfterHours),
    subject: examSubject(meta.subject, sources),
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
