// The learning path: the built-in units in teaching order, each with its challenges, its quiz and
// the tests that close a stage. Challenges, quizzes and tests that belong to no unit (written by a
// teacher or imported) go to a Custom section at the end. No vscode dependency.
import type { Challenge } from './challenges';
import type { QuizDefinition } from './quizzes';
import { language, tr } from './i18n';

/** Unit keys, in teaching order. They are the "topic" values in challenge.json and quiz.json. */
export const UNITS = ['Basics', 'Conditionals', 'Loops', 'Strings', 'Methods', 'Arrays', 'Collections', 'OOP', 'Exceptions', 'Recursion', 'Streams'] as const;

/** Group for challenges, quizzes and tests that belong to no unit. Always listed last. */
export const CUSTOM_TOPIC = 'Custom';

/** Mixed challenges that check several units; they name the unit they close with "unit". */
export const TESTS_TOPIC = 'Tests';

/** Topic names used before the 0.7 restructure, still accepted in custom content. */
const ALIASES: Record<string, string> = { Variables: 'Basics' };

const UNIT_NAMES: Record<string, [string, string]> = {
  Basics: ['Basics', 'Fundamentos'],
  Conditionals: ['Conditionals', 'Condicionais'],
  Loops: ['Loops', 'Laços de repetição'],
  Strings: ['Strings & Characters', 'Strings e caracteres'],
  Methods: ['Methods', 'Métodos'],
  Arrays: ['Arrays', 'Arrays'],
  Collections: ['Collections', 'Coleções'],
  OOP: ['Object-Oriented Programming', 'Orientação a objetos'],
  Exceptions: ['Exceptions', 'Exceções'],
  Recursion: ['Recursion', 'Recursão'],
  Streams: ['Lambdas & Streams', 'Lambdas e streams'],
};

export function unitKey(topic: string | undefined): string | undefined {
  if (!topic) {
    return undefined;
  }
  const key = ALIASES[topic] ?? topic;
  return (UNITS as readonly string[]).includes(key) ? key : undefined;
}

/** "3 · Loops" for a unit; other topics are shown as they are written. */
export function groupLabel(group: PathGroup): string {
  if (group.kind === 'unit') {
    return `${group.number} · ${unitName(group.key)}`;
  }
  return group.kind === 'custom' ? tr('Custom', 'Personalizados') : group.key;
}

/** The unit's name in the current language; other topics are returned as they are. */
export function unitName(key: string): string {
  const names = UNIT_NAMES[unitKey(key) ?? key];
  return names ? names[language() === 'pt-br' ? 1 : 0] : key;
}

export interface PathGroup {
  kind: 'unit' | 'topic' | 'custom';
  key: string;
  /** 1-based position among the built-in units (stable even when a unit has no content yet). */
  number?: number;
  challenges: Challenge[];
  quizzes: QuizDefinition[];
  tests: Challenge[];
}

const byOrder = (a: Challenge, b: Challenge) => a.order - b.order || a.title.localeCompare(b.title);

export function buildPath(challenges: Challenge[], quizzes: QuizDefinition[]): PathGroup[] {
  const units = new Map<string, PathGroup>(UNITS.map((key, i) => [key, { kind: 'unit', key, number: i + 1, challenges: [], quizzes: [], tests: [] }]));
  const topics = new Map<string, PathGroup>();
  const custom: PathGroup = { kind: 'custom', key: CUSTOM_TOPIC, challenges: [], quizzes: [], tests: [] };

  for (const c of challenges) {
    if (c.topic === TESTS_TOPIC) {
      const unit = unitKey(c.unit);
      (unit ? units.get(unit)! : custom).tests.push(c);
      continue;
    }
    const unit = unitKey(c.topic);
    if (unit) {
      units.get(unit)!.challenges.push(c);
    } else if (c.topic === CUSTOM_TOPIC) {
      custom.challenges.push(c);
    } else {
      if (!topics.has(c.topic)) {
        topics.set(c.topic, { kind: 'topic', key: c.topic, challenges: [], quizzes: [], tests: [] });
      }
      topics.get(c.topic)!.challenges.push(c);
    }
  }
  for (const q of quizzes) {
    const unit = unitKey(q.topic);
    (unit ? units.get(unit)! : (q.topic && topics.get(q.topic)) || custom).quizzes.push(q);
  }

  const groups = [...units.values(), ...[...topics.values()].sort((a, b) => a.key.localeCompare(b.key)), custom];
  for (const g of groups) {
    g.challenges.sort(byOrder);
    g.tests.sort(byOrder);
    g.quizzes.sort((a, b) => a.title.localeCompare(b.title));
  }
  return groups.filter((g) => g.challenges.length + g.quizzes.length + g.tests.length > 0);
}

export type PathItem = { kind: 'challenge'; challenge: Challenge } | { kind: 'quiz'; quiz: QuizDefinition };

/** Everything in path order: each group's challenges, then its quizzes, then its tests. */
export function pathSequence(groups: PathGroup[]): PathItem[] {
  return groups.flatMap((g) => [
    ...g.challenges.map((challenge) => ({ kind: 'challenge' as const, challenge })),
    ...g.quizzes.map((quiz) => ({ kind: 'quiz' as const, quiz })),
    ...g.tests.map((challenge) => ({ kind: 'challenge' as const, challenge })),
  ]);
}

/** The item after `id` in the path (a challenge or quiz id), or undefined at the end. */
export function nextInPath(groups: PathGroup[], id: string): PathItem | undefined {
  const seq = pathSequence(groups);
  const i = seq.findIndex((it) => (it.kind === 'quiz' ? it.quiz.id : it.challenge.id) === id);
  return i === -1 ? undefined : seq[i + 1];
}
