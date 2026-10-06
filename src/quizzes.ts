// Quizzes: short question sets about Java (multiple choice, true/false, short answer and "what does
// this code print?"). A quiz is a folder containing quiz.json. Students practise them from the
// Quizzes group, and exams can include them as graded questions. No vscode dependency, so the
// validator and the exam verifier can reuse it.
import * as fs from 'fs';
import * as path from 'path';
import { Lang, language, tr } from './i18n';
import { normalizeOutput } from './runner';

export type QuizQuestion =
  | { type: 'choice'; prompt: string; code?: string; options: string[]; answer: number[]; multiple: boolean; explanation: string; points: number }
  | { type: 'truefalse'; prompt: string; code?: string; answer: boolean; explanation: string; points: number }
  | { type: 'short'; prompt: string; code?: string; answer: string[]; caseSensitive: boolean; explanation: string; points: number }
  /** "What does this code print?": typed, or picked from `options` when given. */
  | { type: 'output'; prompt: string; code: string; answer: string; options?: string[]; explanation: string; points: number }
  /** A number typed in `base` (2, 8, 10 or 16), compared by value; decimal answers can have a `tolerance`. */
  | { type: 'number'; prompt: string; code?: string; answer: string; value: number; base: NumberBase; tolerance: number; explanation: string; points: number };

export type NumberBase = 2 | 8 | 10 | 16;
const BASES: NumberBase[] = [2, 8, 10, 16];

export interface QuizDefinition {
  id: string;
  title: string;
  description: string;
  /** Sidebar hint, e.g. "Variables". Optional. */
  topic: string;
  questions: QuizQuestion[];
  /** Units the student should know first (shown, not enforced). */
  requires: string[];
  /** The subject, for quizzes without a unit. */
  subject?: string;
  dir: string;
}

const PREFIX: Partial<Record<NumberBase, string>> = { 2: '0b', 8: '0o', 16: '0x' };

/**
 * Reads a number typed by a student in `base`. Spaces and underscores are ignored ("0000 1011"),
 * and so is the usual prefix ("0b1011", "0x1F", "#1F"); digits are case-insensitive. In base 10,
 * "1,024" and "1.024" are 1024 when `integer` is true; otherwise "3,5" and "3.5" are both 3.5.
 */
export function parseNumberAnswer(text: string, base: NumberBase, integer = true): number | undefined {
  let s = text.trim().replace(/[\s_]/g, '').toLowerCase();
  let sign = 1;
  if (s.startsWith('-') || s.startsWith('+')) {
    sign = s.startsWith('-') ? -1 : 1;
    s = s.slice(1);
  }
  const prefix = PREFIX[base];
  if (prefix && s.startsWith(prefix)) {
    s = s.slice(prefix.length);
  } else if (base === 16 && s.startsWith('#')) {
    s = s.slice(1);
  }
  if (!s) {
    return undefined;
  }
  if (base === 10) {
    if (integer && /^\d{1,3}([.,]\d{3})+$/.test(s)) {
      s = s.replace(/[.,]/g, '');
    } else if (s.includes('.') && s.includes(',')) {
      // The last separator is the decimal point: "1,234.5" or "1.234,5".
      const decimal = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
      s = s.split(decimal === '.' ? ',' : '.').join('').replace(',', '.');
    } else {
      s = s.replace(',', '.');
    }
    return /^\d+(\.\d+)?$|^\.\d+$/.test(s) ? sign * Number(s) : undefined;
  }
  const digits = '0123456789abcdef'.slice(0, base);
  return [...s].every((ch) => digits.includes(ch)) ? sign * parseInt(s, base) : undefined;
}

/** What the student answered, by question index: chosen option indexes, true/false, or typed text. */
export type QuizAnswer = number[] | boolean | string | null;

export interface QuizGrade {
  earned: number;
  total: number;
  correct: number;
  results: { correct: boolean; earned: number }[];
}


function fail(i: number, message: string): never {
  throw new Error(`question ${i + 1}: ${message}`);
}

function parseQuestion(raw: Record<string, unknown>, i: number): QuizQuestion {
  const prompt = typeof raw.prompt === 'string' ? raw.prompt : '';
  const code = typeof raw.code === 'string' && raw.code.trim() ? raw.code.replace(/\s+$/, '') : undefined;
  const explanation = typeof raw.explanation === 'string' ? raw.explanation : '';
  const points = typeof raw.points === 'number' && raw.points > 0 ? raw.points : 1;
  const options = Array.isArray(raw.options) && raw.options.every((o) => typeof o === 'string') ? (raw.options as string[]) : undefined;
  const index = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && options !== undefined && n >= 0 && n < options.length;

  switch (raw.type) {
    case 'choice': {
      if (!prompt) fail(i, 'needs a "prompt"');
      if (!options || options.length < 2) fail(i, 'a "choice" question needs at least 2 "options"');
      const answer = Array.isArray(raw.answer) ? raw.answer : [raw.answer];
      if (answer.length === 0 || !answer.every(index)) fail(i, '"answer" must be the index of an option (0 = first), or a list of indexes');
      return { type: 'choice', prompt, code, options, answer: [...new Set(answer as number[])].sort(), multiple: Array.isArray(raw.answer), explanation, points };
    }
    case 'truefalse':
      if (!prompt) fail(i, 'needs a "prompt"');
      if (typeof raw.answer !== 'boolean') fail(i, 'a "truefalse" question needs "answer": true or false');
      return { type: 'truefalse', prompt, code, answer: raw.answer, explanation, points };
    case 'short': {
      if (!prompt) fail(i, 'needs a "prompt"');
      const answer = (Array.isArray(raw.answer) ? raw.answer : [raw.answer]).filter((a): a is string => typeof a === 'string' && a.trim() !== '');
      if (answer.length === 0) fail(i, 'a "short" question needs "answer": an accepted answer, or a list of them');
      return { type: 'short', prompt, code, answer, caseSensitive: raw.caseSensitive === true, explanation, points };
    }
    case 'output': {
      if (!code) fail(i, 'an "output" question needs "code"');
      let answer: string;
      if (options) {
        if (!index(raw.answer)) fail(i, 'with "options", "answer" must be the index of the correct option');
        answer = options[raw.answer as number];
      } else {
        if (typeof raw.answer !== 'string') fail(i, 'an "output" question needs "answer": the exact output');
        answer = raw.answer;
      }
      return { type: 'output', prompt: prompt || tr('What does this code print?', 'O que este código imprime?'), code, answer, options, explanation, points };
    }
    case 'number': {
      if (!prompt) fail(i, 'needs a "prompt"');
      const base = (raw.base ?? 10) as NumberBase;
      if (!BASES.includes(base)) fail(i, '"base" must be 2, 8, 10 or 16');
      const tolerance = typeof raw.tolerance === 'number' && raw.tolerance >= 0 ? raw.tolerance : 0;
      const answer = typeof raw.answer === 'number' ? String(raw.answer) : typeof raw.answer === 'string' ? raw.answer.trim() : '';
      // The teacher's answer is a plain number: "2.125" is two and a bit, not 2125.
      const value = parseNumberAnswer(answer, base, false);
      if (!answer || value === undefined) fail(i, `a "number" question needs "answer": a number written in base ${base}`);
      return { type: 'number', prompt, code, answer, value, base, tolerance, explanation, points };
    }
    default:
      fail(i, '"type" must be "choice", "truefalse", "short", "output" or "number"');
  }
}

/** One question's translation: prompt, explanation, options (choice questions only) and extra accepted short answers. */
interface QuestionTranslation {
  prompt?: string;
  explanation?: string;
  options?: string[];
  answer?: string | string[];
}

interface QuizTranslation {
  title?: string;
  description?: string;
  /** By question index. */
  questions?: QuestionTranslation[];
}

/** Applies a translation to one raw question. Output options and answers are program output and stay as they are. */
function translateQuestion(raw: Record<string, unknown>, t: QuestionTranslation | undefined): Record<string, unknown> {
  if (!t) {
    return raw;
  }
  const out = { ...raw };
  if (typeof t.prompt === 'string' && t.prompt.trim()) out.prompt = t.prompt;
  if (typeof t.explanation === 'string' && t.explanation.trim()) out.explanation = t.explanation;
  if (raw.type === 'choice' && Array.isArray(t.options) && Array.isArray(raw.options) && t.options.length === raw.options.length) out.options = t.options;
  if (raw.type === 'short' && t.answer !== undefined) {
    // Accept the answers of both languages.
    const list = (v: unknown) => (Array.isArray(v) ? v : [v]).filter((a): a is string => typeof a === 'string');
    out.answer = [...new Set([...list(raw.answer), ...list(t.answer)])];
  }
  return out;
}

/** Loads a quiz in `lang`, using its "translations" block; anything not translated stays in English. */
export function loadQuiz(dir: string, lang: Lang = language()): QuizDefinition {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'quiz.json'), 'utf8'));
  if (!meta.title || !Array.isArray(meta.questions) || meta.questions.length === 0) {
    throw new Error('quiz.json needs a "title" and at least one entry in "questions"');
  }
  const t: QuizTranslation = (lang !== 'en' && meta.translations?.[lang]) || {};
  return {
    id: meta.id ?? path.basename(dir),
    title: (typeof t.title === 'string' && t.title.trim()) || meta.title,
    description: (typeof t.description === 'string' && t.description.trim()) || (meta.description ?? ''),
    topic: typeof meta.topic === 'string' ? meta.topic : '',
    questions: meta.questions.map((q: Record<string, unknown>, i: number) => parseQuestion(translateQuestion(q ?? {}, t.questions?.[i]), i)),
    requires: Array.isArray(meta.requires) ? meta.requires.filter((r: unknown): r is string => typeof r === 'string' && r.trim() !== '') : [],
    subject: typeof meta.subject === 'string' && meta.subject.trim() ? meta.subject.trim() : undefined,
    dir,
  };
}

/** Finds every sub-folder of `roots` that contains a quiz.json. */
export function findQuizDirs(roots: string[]): string[] {
  const dirs: string[] = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, entry.name);
      if (entry.isDirectory() && fs.existsSync(path.join(dir, 'quiz.json'))) {
        dirs.push(dir);
      }
    }
  }
  return dirs;
}

export function loadQuizzes(roots: string[]): { quizzes: QuizDefinition[]; errors: string[] } {
  const byId = new Map<string, QuizDefinition>();
  const errors: string[] = [];
  for (const dir of findQuizDirs(roots)) {
    try {
      const quiz = loadQuiz(dir);
      byId.set(quiz.id, quiz);
    } catch (e) {
      errors.push(`${dir}: ${(e as Error).message}`);
    }
  }
  return { quizzes: [...byId.values()].sort((a, b) => a.title.localeCompare(b.title)), errors };
}

// ---------------------------------------------------------------- grading

function normalizeShort(s: string, caseSensitive: boolean): string {
  const t = s.trim().replace(/\s+/g, ' ');
  return caseSensitive ? t : t.toLowerCase();
}

export function isCorrect(q: QuizQuestion, answer: QuizAnswer): boolean {
  if (answer === null || answer === undefined) {
    return false;
  }
  switch (q.type) {
    case 'choice': {
      const picked = Array.isArray(answer) ? [...new Set(answer)].sort() : [];
      return picked.length === q.answer.length && picked.every((v, i) => v === q.answer[i]);
    }
    case 'truefalse':
      return answer === q.answer;
    case 'short':
      return typeof answer === 'string' && q.answer.some((a) => normalizeShort(a, q.caseSensitive) === normalizeShort(answer, q.caseSensitive));
    case 'number': {
      if (typeof answer !== 'string') {
        return false;
      }
      // A whole answer allows thousands separators ("1,024" or "1.024").
      const v = parseNumberAnswer(answer, q.base, Number.isInteger(q.value));
      return v !== undefined && Math.abs(v - q.value) <= q.tolerance;
    }
    case 'output':
      if (q.options) {
        return Array.isArray(answer) && answer.length === 1 && q.options[answer[0]] === q.answer;
      }
      // Typed into a box: ignore surrounding blank space, but not spaces inside the lines.
      return typeof answer === 'string' && normalizeOutput(answer.trimStart()) === normalizeOutput(q.answer.trimStart());
  }
}

/** Grades a whole quiz. Each question is all-or-nothing and worth its "points" (default 1). */
export function gradeQuiz(quiz: QuizDefinition, answers: QuizAnswer[]): QuizGrade {
  const results = quiz.questions.map((q, i) => {
    const correct = isCorrect(q, answers[i] ?? null);
    return { correct, earned: correct ? q.points : 0 };
  });
  return {
    earned: results.reduce((s, r) => s + r.earned, 0),
    total: quiz.questions.reduce((s, q) => s + q.points, 0),
    correct: results.filter((r) => r.correct).length,
    results,
  };
}

/** The correct answer in words, shown after a practice check. */
export function describeAnswer(q: QuizQuestion): string {
  switch (q.type) {
    case 'choice':
      return q.answer.map((i) => q.options[i]).join(', ');
    case 'truefalse':
      return q.answer ? tr('True', 'Verdadeiro') : tr('False', 'Falso');
    case 'short':
      return q.answer.join(' / ');
    case 'output':
      return q.answer;
    case 'number': {
      const names: Record<NumberBase, [string, string]> = { 2: ['binary', 'binário'], 8: ['octal', 'octal'], 10: ['decimal', 'decimal'], 16: ['hexadecimal', 'hexadecimal'] };
      return q.base === 10 ? q.answer : `${q.answer} (${tr(...names[q.base])})`;
    }
  }
}

/** Parses the answers a student saved (in an exam answers file or a results file). */
export function parseAnswers(text: string | undefined): QuizAnswer[] {
  if (!text) {
    return [];
  }
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------- code snippets

/** True when the snippet is already a whole program (otherwise it is wrapped in void main()). */
export function isWholeProgram(code: string): boolean {
  return /\bvoid\s+main\s*\(/.test(code) || /\bclass\s+\w+/.test(code);
}

/** Turns a snippet into a program the runner can compile, so its real output can be checked. */
export function quizProgram(code: string): string {
  if (isWholeProgram(code)) {
    return code.endsWith('\n') ? code : `${code}\n`;
  }
  return `void main() {\n${code.split('\n').map((l) => `    ${l}`).join('\n')}\n}\n`;
}

/** Score for a quiz used as an exam question worth `points`. */
export function scaleQuizGrade(grade: QuizGrade, points: number): { earned: number; passed: number; total: number } {
  const earned = grade.total ? Math.round((points * grade.earned * 100) / grade.total) / 100 : 0;
  return { earned, passed: grade.correct, total: grade.results.length };
}
