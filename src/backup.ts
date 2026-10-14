// Backing up and restoring a student's progress: one .zip with the progress (challenges, quizzes, lessons,
// exam sessions), the student's code and the packs they imported. Restoring merges with what is already
// on the computer and never loses progress. No vscode dependency, so the tests can use it.
import * as fs from 'fs';
import * as path from 'path';
import { unzipSync, zipSync } from 'fflate';
import type { ChallengeProgress } from './progress';

/** The global-state keys a backup carries. Settings and secrets (such as AI keys) are never included. */
export const BACKUP_KEYS = ['sphinx.progress', 'sphinx.quizzes', 'sphinx.lessons', 'sphinx.exams'] as const;
export type BackupKey = (typeof BACKUP_KEYS)[number];
export type BackupState = Partial<Record<BackupKey, Record<string, unknown>>>;

const MANIFEST = 'sphinx-backup.json';

export interface BackupManifest {
  format: 'sphinx-backup';
  version: 1;
  createdAt: string;
  extensionVersion: string;
  student?: string;
  state: BackupState;
}

/** A file inside the backup: `code/…` (the student's code folder) or `library/…` (imported packs). */
export interface BackupFile {
  path: string;
  data: Uint8Array;
}

/** Files skipped when copying a folder: compiled output and editor or system clutter. */
const skip = (name: string) => name.startsWith('.') || name === 'node_modules' || name === '__MACOSX' || /\.(class|o|obj|exe|out)$/i.test(name);

/** Every file under `dir`, with paths relative to it (forward slashes). */
export function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const out: string[] = [];
  const walk = (rel: string) => {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      if (skip(entry.name)) {
        continue;
      }
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(child);
      } else if (entry.isFile()) {
        out.push(child);
      }
    }
  };
  walk('');
  return out.sort();
}

/** Builds the backup: the manifest, the code folder under code/ and the library under library/. */
export function createBackup(manifest: Omit<BackupManifest, 'format' | 'version'>, codeRoot: string, libraryDir: string): { zip: Uint8Array; codeFiles: number; libraryFiles: number } {
  const entries: Record<string, Uint8Array> = {};
  const full: BackupManifest = { format: 'sphinx-backup', version: 1, ...manifest };
  entries[MANIFEST] = new TextEncoder().encode(JSON.stringify(full, null, 2));
  const code = listFiles(codeRoot);
  for (const rel of code) {
    entries[`code/${rel}`] = fs.readFileSync(path.join(codeRoot, rel));
  }
  const library = listFiles(libraryDir);
  for (const rel of library) {
    entries[`library/${rel}`] = fs.readFileSync(path.join(libraryDir, rel));
  }
  return { zip: zipSync(entries, { level: 6 }), codeFiles: code.length, libraryFiles: library.length };
}

/** Reads a backup made by createBackup; throws a plain-words error for anything else. */
export function readBackup(zip: Uint8Array): { manifest: BackupManifest; files: BackupFile[] } {
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(zip);
  } catch {
    throw new Error('This file is not a Sphinx backup (it is not a .zip file).');
  }
  const raw = entries[MANIFEST];
  if (!raw) {
    throw new Error('This .zip file is not a Sphinx backup (it has no sphinx-backup.json).');
  }
  const manifest = JSON.parse(new TextDecoder().decode(raw)) as BackupManifest;
  if (manifest.format !== 'sphinx-backup' || typeof manifest.state !== 'object' || manifest.state === null) {
    throw new Error('This .zip file is not a Sphinx backup.');
  }
  if (manifest.version > 1) {
    throw new Error('This backup was made by a newer version of Sphinx. Update Sphinx, then restore it.');
  }
  const files: BackupFile[] = [];
  for (const [name, data] of Object.entries(entries)) {
    const normalized = name.replace(/\\/g, '/');
    // Only files under code/ or library/, and never a path that climbs out of them.
    if (name.endsWith('/') || !/^(code|library)\//.test(normalized) || normalized.split('/').includes('..')) {
      continue;
    }
    files.push({ path: normalized, data });
  }
  return { manifest, files };
}

// ---------------------------------------------------------------- merging

type Lessons = Record<string, { readAt: string }>;
type Quizzes = Record<string, { best: number; total: number; attempts: number }>;

const earliest = (a?: string, b?: string) => (a && b ? (a < b ? a : b) : a ?? b);

/** Challenges: solved if solved on either side, the most attempts, the earliest solve, every bonus star. */
export function mergeProgress(local: Record<string, ChallengeProgress> = {}, backup: Record<string, ChallengeProgress> = {}): Record<string, ChallengeProgress> {
  const out: Record<string, ChallengeProgress> = { ...local };
  for (const [id, b] of Object.entries(backup)) {
    const l = out[id];
    if (!l) {
      out[id] = b;
      continue;
    }
    const solved = l.status === 'solved' || b.status === 'solved';
    const bonus = [...new Set([...(l.bonus ?? []), ...(b.bonus ?? [])])];
    const solvedAt = earliest(l.solvedAt, b.solvedAt);
    out[id] = {
      status: solved ? 'solved' : 'attempted',
      attempts: Math.max(l.attempts ?? 0, b.attempts ?? 0),
      ...(solvedAt ? { solvedAt } : {}),
      ...(bonus.length ? { bonus } : {}),
    };
  }
  return out;
}

/** Quizzes: the best score, and the most attempts. */
export function mergeQuizzes(local: Quizzes = {}, backup: Quizzes = {}): Quizzes {
  const out: Quizzes = { ...local };
  for (const [id, b] of Object.entries(backup)) {
    const l = out[id];
    out[id] = !l ? b : { ...(b.best > l.best ? b : l), attempts: Math.max(l.attempts, b.attempts) };
  }
  return out;
}

/** Lessons: read if read on either side, keeping the earliest date. */
export function mergeLessons(local: Lessons = {}, backup: Lessons = {}): Lessons {
  const out: Lessons = { ...local };
  for (const [id, b] of Object.entries(backup)) {
    out[id] = { readAt: earliest(out[id]?.readAt, b.readAt) ?? b.readAt };
  }
  return out;
}

/** Exam sessions: the backup only adds exams this computer has no session for. It never replaces one,
 *  so an old backup can't give back submissions or erase a finished attempt. */
export function mergeExams(local: Record<string, unknown> = {}, backup: Record<string, unknown> = {}): Record<string, unknown> {
  const out = { ...local };
  for (const [id, session] of Object.entries(backup)) {
    if (!(id in out)) {
      out[id] = session;
    }
  }
  return out;
}

/** The merged value of every backup key. */
export function mergeState(local: BackupState, backup: BackupState): BackupState {
  return {
    'sphinx.progress': mergeProgress(local['sphinx.progress'] as Record<string, ChallengeProgress>, backup['sphinx.progress'] as Record<string, ChallengeProgress>),
    'sphinx.quizzes': mergeQuizzes(local['sphinx.quizzes'] as Quizzes, backup['sphinx.quizzes'] as Quizzes),
    'sphinx.lessons': mergeLessons(local['sphinx.lessons'] as Lessons, backup['sphinx.lessons'] as Lessons),
    'sphinx.exams': mergeExams(local['sphinx.exams'], backup['sphinx.exams']),
  };
}

/** What the backup holds, in numbers, for the confirmation before restoring. */
export function summarize(manifest: BackupManifest, files: BackupFile[]): { solved: number; quizzes: number; lessons: number; exams: number; codeFiles: number; libraryFiles: number } {
  const progress = (manifest.state['sphinx.progress'] ?? {}) as Record<string, ChallengeProgress>;
  return {
    solved: Object.values(progress).filter((p) => p.status === 'solved').length,
    quizzes: Object.keys(manifest.state['sphinx.quizzes'] ?? {}).length,
    lessons: Object.keys(manifest.state['sphinx.lessons'] ?? {}).length,
    exams: Object.keys(manifest.state['sphinx.exams'] ?? {}).length,
    codeFiles: files.filter((f) => f.path.startsWith('code/')).length,
    libraryFiles: files.filter((f) => f.path.startsWith('library/')).length,
  };
}

// ---------------------------------------------------------------- files

export interface FilePlan {
  /** Files the computer doesn't have: always restored. */
  add: { file: BackupFile; target: string }[];
  /** Files that exist with different content: restored only if the student chooses the backup's version. */
  conflicts: { file: BackupFile; target: string }[];
  /** Files already identical. */
  same: number;
}

/** Where each backup file goes, and which of them are new, identical or different. */
export function planFiles(files: BackupFile[], codeRoot: string, libraryDir: string): FilePlan {
  const plan: FilePlan = { add: [], conflicts: [], same: 0 };
  for (const file of files) {
    const [top, ...rest] = file.path.split('/');
    const target = path.join(top === 'code' ? codeRoot : libraryDir, ...rest);
    if (!fs.existsSync(target)) {
      plan.add.push({ file, target });
    } else if (Buffer.compare(fs.readFileSync(target), Buffer.from(file.data)) === 0) {
      plan.same++;
    } else {
      plan.conflicts.push({ file, target });
    }
  }
  return plan;
}

/** Writes backup files to their targets, creating folders as needed. */
export function writeFiles(entries: { file: BackupFile; target: string }[]): void {
  for (const { file, target } of entries) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.data);
  }
}
