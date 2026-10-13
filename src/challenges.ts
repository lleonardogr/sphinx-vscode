// Loads challenges from disk. Each challenge is a folder containing:
//   challenge.json   metadata, rules and test cases
//   description.md   the problem statement (Markdown)
//   Starter.java          the code the student starts from (modern Java 25+ compact source file)
//   Starter.classic.java  the same starter as a classic `public class Main` (optional)
//   Solution*.java        reference solutions (not shipped; used by `npm run validate`)
import * as fs from 'fs';
import * as path from 'path';
import { Lang, language } from './i18n';
import { CUSTOM_TOPIC } from './path';
import { Rule, TestCase } from './runner';
import { allSubjects, unitRank } from './subjects';

export interface Challenge {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  order: number;
  description: string;
  starterCode: string;
  starterCodeClassic: string;
  hints: string[];
  mustContain: Rule[];
  mustNotContain: Rule[];
  tests: TestCase[];
  /** Topics a mixed "Tests" challenge combines, shown as badges (optional). */
  skills: string[];
  /** For "Tests": the unit it closes; it is listed at the end of that unit. */
  unit?: string;
  timeLimitMs: number;
  /** Teachers can set "aiHints": false to disable AI hints for a challenge. */
  aiHints: boolean;
  /** Units the student should know first, e.g. ["Loops"] (shown, not enforced). */
  requires: string[];
  /** The subject, for challenges without a unit (otherwise the unit decides). */
  subject?: string;
  /** The programming language: Java (Main.java) or C (main.c). */
  language: CodeLanguage;
  /** Optional, harder goals checked on Submit once the tests pass (see bonus.ts). */
  bonus: BonusGoal[];
  dir: string;
}

/** An optional goal on a challenge: a different approach, more efficiency, a constraint or more robustness. */
export interface BonusGoal {
  id: string;
  title: string;
  description: string;
  hint?: string;
  /** Rules the code must follow to earn it, such as "no for or while" for a recursive solution. */
  mustContain: Rule[];
  mustNotContain: Rule[];
  /** Extra tests it must pass (never shown to the student), such as a huge input. */
  tests: TestCase[];
  /** A time limit for those tests, for efficiency goals. */
  timeLimitMs?: number;
}

/** The languages a challenge can be written in. */
export type CodeLanguage = 'java' | 'c';

/** The file a student writes for a challenge in this language. */
export function codeFileName(language: CodeLanguage): string {
  return language === 'c' ? 'main.c' : 'Main.java';
}

/** "language" in challenge.json, or C when the folder has a C starter or solution; Java otherwise. */
export function challengeLanguage(dir: string, meta: { language?: unknown }): CodeLanguage {
  if (meta.language === 'c' || meta.language === 'java') {
    return meta.language;
  }
  return ['Starter.c', 'Solution.c'].some((f) => fs.existsSync(path.join(dir, f))) ? 'c' : 'java';
}

export { CUSTOM_TOPIC };

/** Every unit key of every subject, in teaching order (see subjects.ts). */
export function topicOrder(): string[] {
  return allSubjects().flatMap((s) => s.units.map((u) => u.key));
}

export function topicRank(topic: string): number {
  return topic === CUSTOM_TOPIC ? Number.MAX_SAFE_INTEGER : unitRank(topic);
}

function readOptional(dir: string, file: string): string {
  const p = path.join(dir, file);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

/** Translated texts for one language: { "translations": { "pt-br": { title, hints, mustContain, mustNotContain, bonus } } }. */
interface ChallengeTranslation {
  title?: string;
  hints?: string[];
  /** Rule messages, in the same order as the rules. */
  mustContain?: string[];
  mustNotContain?: string[];
  /** Bonus goals' texts, in the same order as the goals. */
  bonus?: { title?: string; description?: string; hint?: string; mustContain?: string[]; mustNotContain?: string[] }[];
}

const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

function parseBonus(raw: unknown, translations: ChallengeTranslation['bonus']): BonusGoal[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .filter((b) => b && typeof b === 'object' && text(b.id) && text(b.title))
    .map((b, i) => {
      const t = translations?.[i] ?? {};
      return {
        id: text(b.id)!,
        title: text(t.title) ?? text(b.title)!,
        description: text(t.description) ?? text(b.description) ?? '',
        hint: text(t.hint) ?? text(b.hint),
        mustContain: translateRules(b.mustContain, t.mustContain),
        mustNotContain: translateRules(b.mustNotContain, t.mustNotContain),
        tests: Array.isArray(b.tests) ? b.tests : [],
        timeLimitMs: typeof b.timeLimitMs === 'number' ? b.timeLimitMs : undefined,
      };
    });
}

function translateRules(rules: Rule[] | undefined, messages: string[] | undefined): Rule[] {
  return (rules ?? []).map((r, i) => (typeof messages?.[i] === 'string' && messages[i].trim() ? { ...r, message: messages[i] } : r));
}

/**
 * Loads a challenge in `lang`. Translations live next to the original: description.<lang>.md,
 * Starter.<lang>.java, Starter.classic.<lang>.java (Starter.<lang>.c for C) and the "translations" block of challenge.json.
 * Anything not translated falls back to English. Tests and solutions are shared by every language.
 */
export function loadChallenge(dir: string, lang: Lang = language()): Challenge {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8'));
  if (!meta.title || !Array.isArray(meta.tests) || meta.tests.length === 0) {
    throw new Error('challenge.json needs a "title" and at least one entry in "tests"');
  }
  const t: ChallengeTranslation = (lang !== 'en' && meta.translations?.[lang]) || {};
  const local = (file: string) => (lang !== 'en' ? readOptional(dir, file.replace(/\.(md|java|c)$/, `.${lang}.$1`)) : '');
  const language = challengeLanguage(dir, meta);
  const starterFile = language === 'c' ? 'Starter.c' : 'Starter.java';
  const starter = local(starterFile) || readOptional(dir, starterFile);
  return {
    id: meta.id ?? path.basename(dir),
    title: (typeof t.title === 'string' && t.title.trim()) || meta.title,
    topic: typeof meta.topic === 'string' && meta.topic.trim() ? meta.topic.trim() : CUSTOM_TOPIC,
    difficulty: meta.difficulty ?? 'Easy',
    order: meta.order ?? 0,
    description: local('description.md') || readOptional(dir, 'description.md'),
    starterCode: starter,
    // C has one style; Java also has the classic one (a class with public static void main).
    starterCodeClassic: language === 'c' ? starter : local('Starter.classic.java') || readOptional(dir, 'Starter.classic.java') || starter,
    hints: Array.isArray(t.hints) && t.hints.length ? t.hints : meta.hints ?? [],
    mustContain: translateRules(meta.mustContain, t.mustContain),
    mustNotContain: translateRules(meta.mustNotContain, t.mustNotContain),
    tests: meta.tests,
    skills: Array.isArray(meta.skills) ? meta.skills.filter((s: unknown) => typeof s === 'string') : [],
    unit: typeof meta.unit === 'string' && meta.unit.trim() ? meta.unit.trim() : undefined,
    timeLimitMs: meta.timeLimitMs ?? 5000,
    aiHints: meta.aiHints !== false,
    requires: Array.isArray(meta.requires) ? meta.requires.filter((r: unknown): r is string => typeof r === 'string' && r.trim() !== '').map((r: string) => r.trim()) : [],
    subject: typeof meta.subject === 'string' && meta.subject.trim() ? meta.subject.trim() : undefined,
    language,
    bonus: parseBonus(meta.bonus, t.bonus),
    dir,
  };
}

export function loadChallenges(roots: string[]): { challenges: Challenge[]; errors: string[] } {
  const byId = new Map<string, Challenge>();
  const errors: string[] = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) {
      errors.push(`${root}: folder not found`);
      continue;
    }
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, entry.name);
      if (!entry.isDirectory() || !fs.existsSync(path.join(dir, 'challenge.json'))) {
        continue;
      }
      try {
        const challenge = loadChallenge(dir);
        byId.set(challenge.id, challenge);
      } catch (e) {
        errors.push(`${dir}: ${(e as Error).message}`);
      }
    }
  }
  const challenges = [...byId.values()].sort(
    (a, b) => topicRank(a.topic) - topicRank(b.topic) || a.topic.localeCompare(b.topic) || a.order - b.order || a.title.localeCompare(b.title),
  );
  return { challenges, errors };
}
