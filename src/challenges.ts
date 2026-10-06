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
  dir: string;
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

/** Translated texts for one language: { "translations": { "pt-br": { title, hints, mustContain, mustNotContain } } }. */
interface ChallengeTranslation {
  title?: string;
  hints?: string[];
  /** Rule messages, in the same order as the rules. */
  mustContain?: string[];
  mustNotContain?: string[];
}

function translateRules(rules: Rule[] | undefined, messages: string[] | undefined): Rule[] {
  return (rules ?? []).map((r, i) => (typeof messages?.[i] === 'string' && messages[i].trim() ? { ...r, message: messages[i] } : r));
}

/**
 * Loads a challenge in `lang`. Translations live next to the original: description.<lang>.md,
 * Starter.<lang>.java, Starter.classic.<lang>.java and the "translations" block of challenge.json.
 * Anything not translated falls back to English. Tests and solutions are shared by every language.
 */
export function loadChallenge(dir: string, lang: Lang = language()): Challenge {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8'));
  if (!meta.title || !Array.isArray(meta.tests) || meta.tests.length === 0) {
    throw new Error('challenge.json needs a "title" and at least one entry in "tests"');
  }
  const t: ChallengeTranslation = (lang !== 'en' && meta.translations?.[lang]) || {};
  const local = (file: string) => (lang !== 'en' ? readOptional(dir, file.replace(/\.(md|java)$/, `.${lang}.$1`)) : '');
  const starter = local('Starter.java') || readOptional(dir, 'Starter.java');
  return {
    id: meta.id ?? path.basename(dir),
    title: (typeof t.title === 'string' && t.title.trim()) || meta.title,
    topic: typeof meta.topic === 'string' && meta.topic.trim() ? meta.topic.trim() : CUSTOM_TOPIC,
    difficulty: meta.difficulty ?? 'Easy',
    order: meta.order ?? 0,
    description: local('description.md') || readOptional(dir, 'description.md'),
    starterCode: starter,
    starterCodeClassic: local('Starter.classic.java') || readOptional(dir, 'Starter.classic.java') || starter,
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
