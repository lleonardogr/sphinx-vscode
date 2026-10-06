import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { javacMajorVersion } from '../../runner';

/** The repository root (tests run from out/test/unit). */
export const ROOT = path.resolve(__dirname, '..', '..', '..');

/** The built-in content folders, as the extension loads them. */
export const CONTENT_ROOTS = ['challenges', 'custom', 'tests', 'exams', 'quizzes'].map((d) => path.join(ROOT, d));

/** A fresh temporary folder, removed when the process exits. */
export function tempDir(prefix = 'sphynx-test-'): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  process.on('exit', () => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** The JDK major version on the PATH, or undefined when there is none (Java tests are skipped). */
export const javaVersion = javacMajorVersion();
