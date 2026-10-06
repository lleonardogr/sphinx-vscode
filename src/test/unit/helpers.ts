import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { javacMajorVersion } from '../../runner';
import { allSubjects, loadSubjects, setSubjects, subjectContentRoots } from '../../subjects';

/** The repository root (tests run from out/test/unit). */
export const ROOT = path.resolve(__dirname, '..', '..', '..');

// Like the extension: subjects first, since they define the units content is sorted into.
const subjectLoad = loadSubjects([path.join(ROOT, 'subjects')]);
setSubjects(subjectLoad.subjects);
export const SUBJECT_ERRORS = subjectLoad.errors;

/** The built-in content folders, as the extension loads them. */
export const CONTENT_ROOTS = [...['challenges', 'custom', 'tests', 'exams', 'quizzes'].map((d) => path.join(ROOT, d)), ...allSubjects().flatMap(subjectContentRoots)];

/** A fresh temporary folder, removed when the process exits. */
export function tempDir(prefix = 'sphinx-test-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  process.on('exit', () => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** The JDK major version on the PATH, or undefined when there is none (Java tests are skipped). */
export const javaVersion = javacMajorVersion();
