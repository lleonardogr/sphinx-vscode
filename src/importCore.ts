// Finds challenges and exams in a folder or .zip a teacher shared, so they can be copied into the
// extension's library. No vscode dependency so it can be tested on its own.
import * as fs from 'fs';
import * as path from 'path';
import { unzipSync } from 'fflate';
import { Challenge, loadChallenge } from './challenges';
import { loadExams } from './exams';

export interface Importable {
  kind: 'challenge' | 'exam';
  /** Folder to copy. */
  dir: string;
  /** Folder name in the library, which is also the id. */
  name: string;
  title: string;
  /** "Tests" for mixed tests, so the summary can say what was imported. */
  topic?: string;
  questions?: number;
}

const MAX_DEPTH = 4;
const MAX_ZIP_ENTRY_BYTES = 5 * 1024 * 1024;

/** Extracts a .zip into `dest`, refusing entries that would land outside it (zip slip) or are too large. */
export function extractZip(zipFile: string, dest: string): void {
  const entries = unzipSync(new Uint8Array(fs.readFileSync(zipFile)), {
    filter: (f) => f.originalSize <= MAX_ZIP_ENTRY_BYTES,
  });
  const root = path.resolve(dest);
  for (const [name, data] of Object.entries(entries)) {
    const target = path.resolve(root, name);
    if (target !== root && !target.startsWith(root + path.sep)) {
      throw new Error(`The zip contains an unsafe path: ${name}`);
    }
    if (name.endsWith('/')) {
      fs.mkdirSync(target, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, data);
    }
  }
}

const skip = (name: string) => name.startsWith('.') || name === '__MACOSX' || name === 'node_modules';

/**
 * Finds every challenge folder (challenge.json) and exam folder (exam.json) under `root`.
 * An exam's private questions belong to the exam and are not listed on their own.
 * `rootName` names a challenge or exam whose files sit directly in `root` (e.g. a zip of the files).
 */
export function findImportables(root: string, rootName: string): Importable[] {
  const found: Importable[] = [];
  const visit = (dir: string, depth: number) => {
    const name = dir === root ? rootName : path.basename(dir);
    if (fs.existsSync(path.join(dir, 'exam.json'))) {
      found.push({ kind: 'exam', dir, name, title: name });
      return;
    }
    if (fs.existsSync(path.join(dir, 'challenge.json'))) {
      found.push({ kind: 'challenge', dir, name, title: name });
      return;
    }
    if (depth >= MAX_DEPTH) {
      return;
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !skip(entry.name)) {
        visit(path.join(dir, entry.name), depth + 1);
      }
    }
  };
  visit(root, 0);
  return found;
}

/**
 * Loads each importable to make sure it works, filling in its title. Exams may use built-in
 * challenges as questions, so `known` lists the challenges already available.
 */
export function checkImportables(items: Importable[], known: Challenge[]): { ok: Importable[]; errors: string[] } {
  const ok: Importable[] = [];
  const errors: string[] = [];
  const imported: Challenge[] = [];
  for (const item of items.filter((i) => i.kind === 'challenge')) {
    try {
      const c = loadChallenge(item.dir);
      imported.push(c);
      ok.push({ ...item, title: c.title, topic: c.topic });
    } catch (e) {
      errors.push(`${item.name}: ${(e as Error).message}`);
    }
  }
  for (const item of items.filter((i) => i.kind === 'exam')) {
    // loadExams scans a parent folder; keep only the result for this exam.
    const result = loadExams([path.dirname(item.dir)], [...known, ...imported]);
    const exam = result.exams.find((e) => path.resolve(e.dir) === path.resolve(item.dir));
    const error = result.errors.find((e) => e.startsWith(item.dir));
    if (exam && !error) {
      ok.push({ ...item, title: exam.title, questions: exam.questions.length });
    } else {
      errors.push(`${item.name}: ${error ? error.slice(item.dir.length + 2) : 'could not be loaded'}`);
    }
  }
  return { ok, errors };
}

/** Reference solutions inside the folder (any depth), e.g. Solution.java or Solution.classic.java. */
export function findSolutions(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findSolutions(p));
    } else if (/^Solution.*\.java$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}
