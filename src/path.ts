// The learning path of a subject: its units in teaching order (from the subject's subject.json), each
// with its lessons, challenges, quiz and the tests that close a stage. Content that belongs to no
// unit (written by a teacher or imported) goes to an Others section at the end. No vscode dependency.
import type { Challenge } from './challenges';
import type { LessonDefinition } from './lessons';
import type { QuizDefinition } from './quizzes';
import { tr } from './i18n';
import { DEFAULT_SUBJECT, findSubject, findUnit } from './subjects';

/** Group for challenges, quizzes and tests that belong to no unit. Always listed last. */
export const CUSTOM_TOPIC = 'Custom';

/** Mixed challenges that check several units; they name the unit they close with "unit". */
export const TESTS_TOPIC = 'Tests';

/** The unit key for a "topic" (accepting older aliases), or undefined when it is not a unit of any subject. */
export function unitKey(topic: string | undefined): string | undefined {
  return findUnit(topic)?.unit.key;
}

/** "3 · Loops" for a unit; other topics are shown as they are written. */
export function groupLabel(group: PathGroup): string {
  if (group.kind === 'unit') {
    return `${group.number} · ${unitName(group.key)}`;
  }
  return group.kind === 'custom' ? othersName() : group.key;
}

/** The section for content without a unit. Its key stays "Custom", which content files may use. */
export function othersName(): string {
  return tr('Others', 'Outros');
}

/** The unit's name in the current language; other topics are returned as they are. */
export function unitName(key: string): string {
  if (key === CUSTOM_TOPIC) {
    return othersName();
  }
  const found = findUnit(key);
  return found ? (found.unit.titles[currentLang()] ?? found.unit.titles.en) : key;
}

const currentLang = () => (tr('en', 'pt-br') as 'en' | 'pt-br');

/** The sidebar icon of a unit, or undefined for other topics. */
export function unitIcon(key: string): string | undefined {
  return findUnit(key)?.unit.icon;
}

/** Which subject an item belongs to: its unit's subject, else its "subject", else the default (Java). */
export function subjectOf(item: { topic?: string; unit?: string; subject?: string }): string {
  const unit = item.topic === TESTS_TOPIC ? item.unit : item.topic;
  return findUnit(unit)?.subject.id ?? (item.subject && findSubject(item.subject) ? item.subject : DEFAULT_SUBJECT);
}

export interface PathGroup {
  kind: 'unit' | 'topic' | 'custom';
  key: string;
  /** 1-based position among the subject's units (stable even when a unit has no content yet). */
  number?: number;
  lessons: LessonDefinition[];
  challenges: Challenge[];
  quizzes: QuizDefinition[];
  tests: Challenge[];
}

const byOrder = (a: { order: number; title: string }, b: { order: number; title: string }) => a.order - b.order || a.title.localeCompare(b.title);

/** The learning path of one subject: its units, then other topics, then Others. Empty groups are left out. */
export function buildPath(challenges: Challenge[], quizzes: QuizDefinition[], lessons: LessonDefinition[] = [], subjectId: string = DEFAULT_SUBJECT): PathGroup[] {
  const subject = findSubject(subjectId);
  const empty = () => ({ lessons: [], challenges: [], quizzes: [], tests: [] });
  const units = new Map<string, PathGroup>((subject?.units ?? []).map((u, i) => [u.key, { kind: 'unit', key: u.key, number: i + 1, ...empty() }]));
  const topics = new Map<string, PathGroup>();
  const custom: PathGroup = { kind: 'custom', key: CUSTOM_TOPIC, ...empty() };
  const mine = <T extends { topic?: string; unit?: string; subject?: string }>(items: T[]) => items.filter((it) => subjectOf(it) === subjectId);
  const groupFor = (topic: string | undefined): PathGroup => {
    const unit = unitKey(topic);
    if (unit && units.has(unit)) {
      return units.get(unit)!;
    }
    if (!topic || topic === CUSTOM_TOPIC) {
      return custom;
    }
    if (!topics.has(topic)) {
      topics.set(topic, { kind: 'topic', key: topic, ...empty() });
    }
    return topics.get(topic)!;
  };

  for (const c of mine(challenges)) {
    if (c.topic === TESTS_TOPIC) {
      const unit = unitKey(c.unit);
      (unit && units.has(unit) ? units.get(unit)! : custom).tests.push(c);
    } else {
      groupFor(c.topic).challenges.push(c);
    }
  }
  for (const q of mine(quizzes)) {
    const unit = unitKey(q.topic);
    (unit && units.has(unit) ? units.get(unit)! : (q.topic && topics.get(q.topic)) || custom).quizzes.push(q);
  }
  for (const l of mine(lessons)) {
    groupFor(l.topic).lessons.push(l);
  }

  const groups = [...units.values(), ...[...topics.values()].sort((a, b) => a.key.localeCompare(b.key)), custom];
  for (const g of groups) {
    g.lessons.sort(byOrder);
    g.challenges.sort(byOrder);
    g.tests.sort(byOrder);
    g.quizzes.sort((a, b) => a.title.localeCompare(b.title));
  }
  return groups.filter((g) => g.lessons.length + g.challenges.length + g.quizzes.length + g.tests.length > 0);
}

export type PathItem =
  | { kind: 'lesson'; lesson: LessonDefinition }
  | { kind: 'challenge'; challenge: Challenge }
  | { kind: 'quiz'; quiz: QuizDefinition };

export function pathItemId(item: PathItem): string {
  return item.kind === 'quiz' ? item.quiz.id : item.kind === 'lesson' ? item.lesson.id : item.challenge.id;
}

export function pathItemTitle(item: PathItem): string {
  return item.kind === 'quiz' ? item.quiz.title : item.kind === 'lesson' ? item.lesson.title : item.challenge.title;
}

/** Everything in path order: each group's lessons, then its challenges, its quiz and its tests. */
export function pathSequence(groups: PathGroup[]): PathItem[] {
  return groups.flatMap((g) => [
    ...g.lessons.map((lesson) => ({ kind: 'lesson' as const, lesson })),
    ...g.challenges.map((challenge) => ({ kind: 'challenge' as const, challenge })),
    ...g.quizzes.map((quiz) => ({ kind: 'quiz' as const, quiz })),
    ...g.tests.map((challenge) => ({ kind: 'challenge' as const, challenge })),
  ]);
}

/** The item after `id` in the path (a lesson, challenge or quiz id), or undefined at the end. */
export function nextInPath(groups: PathGroup[], id: string): PathItem | undefined {
  const seq = pathSequence(groups);
  const i = seq.findIndex((it) => pathItemId(it) === id);
  return i === -1 ? undefined : seq[i + 1];
}

export interface Requirement {
  /** The unit key, e.g. "Loops". */
  unit: string;
  /** "Java Programming · Loops" in the current language (or the key, when it is not a known unit). */
  label: string;
  solved: number;
  total: number;
}

/**
 * The units an item needs, with how many of each unit's challenges are solved (prerequisites are
 * shown, never enforced: teachers decide the order).
 */
export function requirementStatus(requires: string[], challenges: Challenge[], isSolved: (id: string) => boolean): Requirement[] {
  return requires.map((key) => {
    const found = findUnit(key);
    const unit = found?.unit.key ?? key;
    // Like the sidebar's "solved/total" for the unit: its challenges plus the tests that close it.
    const inUnit = challenges.filter((c) => unitKey(c.topic === TESTS_TOPIC ? c.unit : c.topic) === unit);
    const subjectName = found ? (found.subject.titles[currentLang()] ?? found.subject.titles.en) : '';
    return {
      unit,
      label: found ? `${subjectName} · ${unitName(unit)}` : key,
      solved: inUnit.filter((c) => isSolved(c.id)).length,
      total: inUnit.length,
    };
  });
}
