// Subjects: what students study (Java Programming, CS Fundamentals, …). Each subject is a folder with a
// subject.json that lists its units in teaching order, with their names and sidebar icons. Content
// picks its unit with "topic" (or "unit" for tests); a unit belongs to exactly one subject, so the
// unit decides the subject. No vscode dependency.
import * as fs from 'fs';
import * as path from 'path';
import { Lang, language } from './i18n';

export interface UnitDef {
  key: string;
  /** Names by language; English is required. */
  titles: Partial<Record<Lang, string>> & { en: string };
  /** A codicon name for the sidebar. */
  icon: string;
  /** Older names still accepted as "topic" (e.g. "Variables" for "Basics"). */
  aliases: string[];
}

export interface SubjectDef {
  id: string;
  titles: Partial<Record<Lang, string>> & { en: string };
  kind: 'programming' | 'theory';
  /** Position in the subject switcher. */
  order: number;
  units: UnitDef[];
  dir: string;
  /** True for a subject from a teacher's folder (or an imported pack), false for a built-in one. */
  own: boolean;
  /** Teachers' folders whose subject.json adds units to this subject, and whose content belongs to it. */
  extensionDirs: string[];
  /** "lockPrerequisites" in subject.json: lock items until their required units are half or all solved. */
  lock: LockRule;
}

/** How strictly prerequisites lock: not at all, until half of each required unit is solved, or all of it. */
export type LockRule = 'off' | 'half' | 'all';

/** The stricter of two lock rules. */
export function stricterLock(a: LockRule, b: LockRule): LockRule {
  const rank = { off: 0, half: 1, all: 2 };
  return rank[a] >= rank[b] ? a : b;
}

function parseLock(value: unknown): LockRule {
  return value === 'all' ? 'all' : value === 'half' || value === true ? 'half' : 'off';
}

/** Content without a unit or subject (the Others section's examples, older teacher packs) belongs here. */
export const DEFAULT_SUBJECT = 'java';

/** Folders inside a subject folder that hold its content. */
export const SUBJECT_CONTENT_FOLDERS = ['challenges', 'quizzes', 'lessons', 'tests'];

let registry: SubjectDef[] = [];

/** Makes `subjects` the ones the learning path, unit names and validator use. */
export function setSubjects(subjects: SubjectDef[]): void {
  registry = [...subjects].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function allSubjects(): SubjectDef[] {
  return registry;
}

export function findSubject(id: string | undefined): SubjectDef | undefined {
  return registry.find((s) => s.id === id);
}

/** The subject's name in the current language. */
export function subjectTitle(s: SubjectDef): string {
  return s.titles[language()] ?? s.titles.en;
}

/** The unit with this key (or alias), its subject and its 0-based position in that subject. */
export function findUnit(key: string | undefined): { subject: SubjectDef; unit: UnitDef; index: number } | undefined {
  if (!key) {
    return undefined;
  }
  for (const subject of registry) {
    const index = subject.units.findIndex((u) => u.key === key || u.aliases.includes(key));
    if (index !== -1) {
      return { subject, unit: subject.units[index], index };
    }
  }
  return undefined;
}

/** Sorting rank of a unit across all subjects: subjects in switcher order, units in teaching order. */
export function unitRank(key: string | undefined): number {
  const found = findUnit(key);
  return found ? registry.indexOf(found.subject) * 1000 + found.index : Number.MAX_SAFE_INTEGER - 1;
}

/** Folders with this subject's challenges, quizzes, lessons and tests (those that exist), its extensions' included. */
export function subjectContentRoots(s: SubjectDef): string[] {
  return [s.dir, ...s.extensionDirs].flatMap((dir) => SUBJECT_CONTENT_FOLDERS.map((f) => path.join(dir, f))).filter((d) => fs.existsSync(d));
}

/** The subject folders in a teacher's folder: the folder itself when it has a subject.json, or its sub-folders that do. */
export function findSubjectDirs(folder: string): string[] {
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    return [];
  }
  if (fs.existsSync(path.join(folder, 'subject.json'))) {
    return [folder];
  }
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(folder, e.name, 'subject.json')))
    .map((e) => path.join(folder, e.name));
}

/**
 * Adds the subjects in teachers' folders to `subjects` (the built-in ones). A subject.json whose id is
 * an existing subject's adds its units after that subject's units, so a teacher can extend Java;
 * otherwise it is a new subject. Unit keys stay unique across every subject.
 */
export function addTeacherSubjects(subjects: SubjectDef[], folders: string[]): { subjects: SubjectDef[]; errors: string[] } {
  const result = subjects.map((s) => ({ ...s, units: [...s.units], extensionDirs: [...s.extensionDirs] }));
  const errors: string[] = [];
  const owner = (key: string) => result.find((s) => s.units.some((u) => u.key === key || u.aliases.includes(key)))?.id;
  const seen = new Set<string>();
  for (const dir of folders.flatMap(findSubjectDirs)) {
    if (seen.has(path.resolve(dir))) {
      continue;
    }
    seen.add(path.resolve(dir));
    try {
      const subject = parseSubject(dir, true);
      for (const u of subject.units) {
        const taken = [u.key, ...u.aliases].map((k) => [k, owner(k)]).find(([, o]) => o);
        if (taken) {
          throw new Error(`unit "${taken[0]}" is already a unit of "${taken[1]}" (unit keys must be unique across subjects)`);
        }
      }
      const existing = result.find((s) => s.id === subject.id);
      if (existing) {
        existing.units.push(...subject.units);
        existing.extensionDirs.push(dir);
        existing.lock = stricterLock(existing.lock, subject.lock);
      } else {
        result.push(subject);
      }
    } catch (e) {
      errors.push(`${dir}: ${(e as Error).message}`);
    }
  }
  return { subjects: result, errors };
}

function parseSubject(dir: string, own = false): SubjectDef {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'subject.json'), 'utf8'));
  const id = meta.id ?? path.basename(dir);
  if (typeof meta.title !== 'string' || !meta.title.trim()) {
    throw new Error('subject.json needs a "title"');
  }
  if (!Array.isArray(meta.units)) {
    throw new Error('subject.json needs "units": a list of { "key", "title", "icon" }');
  }
  const translations: Record<string, { title?: string; units?: Record<string, string> }> = meta.translations ?? {};
  const titlesFor = (en: string, pick: (t: { title?: string; units?: Record<string, string> }) => string | undefined) => {
    const titles: Partial<Record<Lang, string>> & { en: string } = { en };
    for (const [lang, t] of Object.entries(translations)) {
      const v = pick(t ?? {});
      if (typeof v === 'string' && v.trim()) {
        titles[lang as Lang] = v;
      }
    }
    return titles;
  };
  const units: UnitDef[] = meta.units.map((u: Record<string, unknown>, i: number) => {
    if (typeof u?.key !== 'string' || !u.key.trim() || typeof u.title !== 'string') {
      throw new Error(`unit ${i + 1} needs a "key" and a "title"`);
    }
    const key = u.key;
    return {
      key,
      titles: titlesFor(u.title, (t) => t.units?.[key]),
      icon: typeof u.icon === 'string' && u.icon ? u.icon : 'folder',
      aliases: Array.isArray(u.aliases) ? u.aliases.filter((a): a is string => typeof a === 'string') : [],
    };
  });
  return {
    id,
    titles: titlesFor(meta.title, (t) => t.title),
    kind: meta.kind === 'theory' ? 'theory' : 'programming',
    order: typeof meta.order === 'number' ? meta.order : 100,
    units,
    dir,
    own,
    extensionDirs: [],
    lock: parseLock(meta.lockPrerequisites),
  };
}

/** Loads every <root>/<subject>/subject.json. Unit keys must be unique across subjects. */
export function loadSubjects(roots: string[]): { subjects: SubjectDef[]; errors: string[] } {
  const subjects: SubjectDef[] = [];
  const errors: string[] = [];
  const unitOwner = new Map<string, string>();
  for (const root of roots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, entry.name);
      if (!entry.isDirectory() || !fs.existsSync(path.join(dir, 'subject.json'))) {
        continue;
      }
      try {
        const subject = parseSubject(dir);
        if (subjects.some((s) => s.id === subject.id)) {
          throw new Error(`a subject with id "${subject.id}" already exists`);
        }
        for (const u of subject.units) {
          for (const key of [u.key, ...u.aliases]) {
            const owner = unitOwner.get(key);
            if (owner) {
              throw new Error(`unit "${key}" is already a unit of "${owner}" (unit keys must be unique across subjects)`);
            }
            unitOwner.set(key, subject.id);
          }
        }
        subjects.push(subject);
      } catch (e) {
        errors.push(`${dir}: ${(e as Error).message}`);
      }
    }
  }
  return { subjects, errors };
}
