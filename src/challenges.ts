// Loads challenges from disk. Each challenge is a folder containing:
//   challenge.json   metadata, rules and test cases
//   description.md   the problem statement (Markdown)
//   Starter.java     the code the student starts from
//   Solution.java    reference solution (not shipped; used by `npm run validate`)
import * as fs from 'fs';
import * as path from 'path';
import { Rule, TestCase } from './runner';

export interface Challenge {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  order: number;
  description: string;
  starterCode: string;
  hints: string[];
  mustContain: Rule[];
  mustNotContain: Rule[];
  tests: TestCase[];
  timeLimitMs: number;
  dir: string;
}

export const TOPIC_ORDER = ['Variables', 'Conditionals', 'Loops', 'Arrays', 'Strings', 'Methods'];

export function topicRank(topic: string): number {
  const i = TOPIC_ORDER.indexOf(topic);
  return i === -1 ? TOPIC_ORDER.length : i;
}

function readOptional(dir: string, file: string): string {
  const p = path.join(dir, file);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

export function loadChallenge(dir: string): Challenge {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8'));
  if (!meta.title || !meta.topic || !Array.isArray(meta.tests) || meta.tests.length === 0) {
    throw new Error('challenge.json needs "title", "topic" and at least one entry in "tests"');
  }
  return {
    id: meta.id ?? path.basename(dir),
    title: meta.title,
    topic: meta.topic,
    difficulty: meta.difficulty ?? 'Easy',
    order: meta.order ?? 0,
    description: readOptional(dir, 'description.md'),
    starterCode: readOptional(dir, 'Starter.java'),
    hints: meta.hints ?? [],
    mustContain: meta.mustContain ?? [],
    mustNotContain: meta.mustNotContain ?? [],
    tests: meta.tests,
    timeLimitMs: meta.timeLimitMs ?? 5000,
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
