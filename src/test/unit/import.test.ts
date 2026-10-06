import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { strToU8, zipSync } from 'fflate';
import { loadChallenges } from '../../challenges';
import { checkImportables, extractZip, findImportables, findSolutions } from '../../importCore';
import { loadQuizzes } from '../../quizzes';
import { CONTENT_ROOTS, ROOT, tempDir } from './helpers';

/** A teacher's folder: one challenge (with its solution), one quiz and one exam. */
function teacherFolder(): string {
  const dir = tempDir();
  fs.cpSync(path.join(ROOT, 'challenges', 'fizzbuzz'), path.join(dir, 'my-fizzbuzz'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'quizzes', 'loops-quiz'), path.join(dir, 'my-quiz'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'exams', 'exam-1'), path.join(dir, 'my-exam'), { recursive: true });
  return dir;
}

describe('import', () => {
  const builtIn = loadChallenges(CONTENT_ROOTS).challenges;
  const builtInQuizzes = loadQuizzes(CONTENT_ROOTS).quizzes;

  it('finds challenges, quizzes and exams in a folder', () => {
    const found = findImportables(teacherFolder(), 'shared');
    assert.deepEqual(found.map((f) => `${f.kind}:${f.name}`).sort(), ['challenge:my-fizzbuzz', 'exam:my-exam', 'quiz:my-quiz']);
  });

  it('accepts valid items and finds the reference solutions', () => {
    const dir = teacherFolder();
    const { ok, errors } = checkImportables(findImportables(dir, 'shared'), builtIn, builtInQuizzes);
    assert.deepEqual(errors, []);
    assert.equal(ok.length, 3);
    assert.deepEqual(findSolutions(path.join(dir, 'my-fizzbuzz')).map((f) => path.basename(f)).sort(), ['Solution.classic.java', 'Solution.java']);
  });

  it('rejects a broken challenge with a clear error', () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, 'broken'));
    fs.writeFileSync(path.join(dir, 'broken', 'challenge.json'), '{ "title": "Broken" ');
    const { ok, errors } = checkImportables(findImportables(dir, 'shared'), builtIn, builtInQuizzes);
    assert.equal(ok.length, 0);
    assert.equal(errors.length, 1);
  });

  it('extracts a zip', () => {
    const zip = path.join(tempDir(), 'pack.zip');
    fs.writeFileSync(zip, zipSync({ 'pack/hello/challenge.json': strToU8('{}'), 'pack/hello/description.md': strToU8('# Hello') }));
    const dest = tempDir();
    extractZip(zip, dest);
    assert.equal(fs.readFileSync(path.join(dest, 'pack', 'hello', 'description.md'), 'utf8'), '# Hello');
  });

  it('refuses zip entries that would land outside the folder', () => {
    const zip = path.join(tempDir(), 'evil.zip');
    fs.writeFileSync(zip, zipSync({ '../escape.txt': strToU8('x') }));
    const dest = tempDir();
    assert.throws(() => extractZip(zip, dest));
    assert.equal(fs.existsSync(path.join(dest, '..', 'escape.txt')), false);
  });
});
