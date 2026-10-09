// Builds a pack (.zip) of subjects, challenges, quizzes, lessons and exams that students import with one click.
// No vscode dependency, so it can be tested with the importer.
import * as fs from 'fs';
import * as path from 'path';
import { zipSync } from 'fflate';
import { ExamDefinition } from './exams';

export interface PackItem {
  kind: 'challenge' | 'quiz' | 'lesson' | 'exam' | 'subject';
  /** The item's folder (with challenge.json, quiz.json, lesson.json, exam.json or subject.json), copied whole, images included. */
  dir: string;
}

const isSolution = (name: string) => /^Solution.*\.java$/.test(name);
const skip = (name: string) => name.startsWith('.') || name === '__MACOSX' || name === 'node_modules';
const inside = (child: string, parent: string) => path.resolve(child).startsWith(path.resolve(parent) + path.sep);

/**
 * Challenges and quizzes an exam uses by id that live outside the exam folder and outside the
 * extension (the teacher's own content): they must travel with the exam, or importing it fails.
 */
export function examDependencies(exam: ExamDefinition, builtInDir: string): PackItem[] {
  const deps: PackItem[] = [];
  for (const q of exam.questions) {
    const dir = q.kind === 'quiz' ? q.quiz.dir : q.challenge.dir;
    if (!inside(dir, exam.dir) && !inside(dir, builtInDir)) {
      deps.push({ kind: q.kind === 'quiz' ? 'quiz' : 'challenge', dir });
    }
  }
  return deps;
}

/**
 * Zips the items under one top folder, `packName/<item folder>/…`. Reference solutions (Solution*.java)
 * are left out unless `keepSolutions`. Items with the same folder name are kept once, and an item inside another
 * one (a challenge in a subject folder) travels with it.
 */
export function buildPack(items: PackItem[], packName: string, keepSolutions: boolean): { zip: Uint8Array; files: number; solutionsRemoved: number } {
  const entries: Record<string, Uint8Array> = {};
  let files = 0;
  let solutionsRemoved = 0;
  const seen = new Set<string>();
  const add = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip(entry.name)) {
        continue;
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        add(full, `${prefix}${entry.name}/`);
      } else if (!keepSolutions && isSolution(entry.name)) {
        solutionsRemoved++;
      } else {
        entries[`${prefix}${entry.name}`] = new Uint8Array(fs.readFileSync(full));
        files++;
      }
    }
  };
  for (const item of items) {
    const name = path.basename(item.dir);
    if (seen.has(name) || items.some((other) => other !== item && inside(item.dir, other.dir))) {
      continue;
    }
    seen.add(name);
    add(item.dir, `${packName}/${name}/`);
  }
  return { zip: zipSync(entries, { level: 6 }), files, solutionsRemoved };
}
