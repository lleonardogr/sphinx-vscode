import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { zipSync } from 'fflate';
import { createBackup, listFiles, mergeExams, mergeLessons, mergeProgress, mergeQuizzes, planFiles, readBackup, summarize, writeFiles } from '../../backup';
import { tempDir } from './helpers';

describe('backup merging never loses progress', () => {
  it('keeps a challenge solved, the most attempts, the earliest solve and every bonus star', () => {
    const merged = mergeProgress(
      { 'fizzbuzz': { status: 'solved', attempts: 2, solvedAt: '2026-10-10', bonus: ['no-modulo'] }, 'palindrome': { status: 'attempted', attempts: 5 } },
      { 'fizzbuzz': { status: 'attempted', attempts: 4 }, 'palindrome': { status: 'solved', attempts: 1, solvedAt: '2026-10-01', bonus: ['sentences'] }, 'factorial': { status: 'solved', attempts: 1 } },
    );
    assert.deepEqual(merged['fizzbuzz'], { status: 'solved', attempts: 4, solvedAt: '2026-10-10', bonus: ['no-modulo'] });
    assert.deepEqual(merged['palindrome'], { status: 'solved', attempts: 5, solvedAt: '2026-10-01', bonus: ['sentences'] });
    assert.deepEqual(merged['factorial'], { status: 'solved', attempts: 1 });
  });

  it('keeps the best quiz score and every lesson read', () => {
    assert.deepEqual(mergeQuizzes({ q: { best: 6, total: 8, attempts: 3 } }, { q: { best: 8, total: 8, attempts: 1 }, r: { best: 2, total: 4, attempts: 1 } }), {
      q: { best: 8, total: 8, attempts: 3 },
      r: { best: 2, total: 4, attempts: 1 },
    });
    assert.deepEqual(mergeLessons({ a: { readAt: '2026-10-09' } }, { a: { readAt: '2026-10-02' }, b: { readAt: '2026-10-05' } }), {
      a: { readAt: '2026-10-02' },
      b: { readAt: '2026-10-05' },
    });
  });

  it('only adds exam sessions this computer lacks, never replacing one', () => {
    const local = { 'exam-1': { finishedAt: 'today', submissions: 3 } };
    const backup = { 'exam-1': { submissions: 0 }, 'exam-2': { finishedAt: 'yesterday' } };
    assert.deepEqual(mergeExams(local, backup), { 'exam-1': { finishedAt: 'today', submissions: 3 }, 'exam-2': { finishedAt: 'yesterday' } });
  });
});

describe('backup files', () => {
  /** A code folder and a library with a few files, and some clutter that is left out. */
  function folders(): { code: string; library: string } {
    const root = tempDir();
    const write = (file: string, text: string) => {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), text);
    };
    write('code/fizzbuzz/Main.java', 'class Main {}');
    write('code/fizzbuzz/Main.class', 'compiled');
    write('code/exams/exam-1/results.json', '{}');
    write('code/.DS_Store', 'junk');
    write('library/challenges/class-demo/challenge.json', '{"title":"Class Demo"}');
    return { code: path.join(root, 'code'), library: path.join(root, 'library') };
  }

  it('round-trips the progress, the code and the library, without compiled files or clutter', () => {
    const { code, library } = folders();
    assert.deepEqual(listFiles(code), ['exams/exam-1/results.json', 'fizzbuzz/Main.java']);
    const state = { 'sphinx.progress': { fizzbuzz: { status: 'solved', attempts: 1 } }, 'sphinx.lessons': { a: { readAt: 'x' } } };
    const backup = createBackup({ createdAt: '2026-10-14T12:00:00Z', extensionVersion: '1.9.1', student: 'Ada', state }, code, library);
    assert.equal(backup.codeFiles, 2);
    assert.equal(backup.libraryFiles, 1);
    const { manifest, files } = readBackup(backup.zip);
    assert.equal(manifest.student, 'Ada');
    assert.deepEqual(manifest.state, state);
    assert.deepEqual(files.map((f) => f.path).sort(), ['code/exams/exam-1/results.json', 'code/fizzbuzz/Main.java', 'library/challenges/class-demo/challenge.json']);
    assert.deepEqual(summarize(manifest, files), { solved: 1, quizzes: 0, lessons: 1, exams: 0, codeFiles: 2, libraryFiles: 1 });
  });

  it('refuses files that are not Sphinx backups, and ignores paths that climb out of their folder', () => {
    assert.throws(() => readBackup(new Uint8Array([1, 2, 3])), /not a \.zip file/);
    assert.throws(() => readBackup(zipSync({ 'notes.txt': new TextEncoder().encode('hi') })), /no sphinx-backup\.json/);
    const manifest = new TextEncoder().encode(JSON.stringify({ format: 'sphinx-backup', version: 1, createdAt: '', extensionVersion: '', state: {} }));
    const sneaky = readBackup(zipSync({ 'sphinx-backup.json': manifest, 'code/../../evil.sh': new Uint8Array([1]), 'other/x': new Uint8Array([1]), 'code/a/Main.java': new Uint8Array([1]) }));
    assert.deepEqual(sneaky.files.map((f) => f.path), ['code/a/Main.java']);
    const future = new TextEncoder().encode(JSON.stringify({ format: 'sphinx-backup', version: 2, state: {} }));
    assert.throws(() => readBackup(zipSync({ 'sphinx-backup.json': future })), /newer version of Sphinx/);
  });

  it('plans which files are new, identical or different, and writes them', () => {
    const { code, library } = folders();
    const files = [
      { path: 'code/fizzbuzz/Main.java', data: new TextEncoder().encode('class Main {}') },
      { path: 'code/exams/exam-1/results.json', data: new TextEncoder().encode('{"changed":true}') },
      { path: 'code/palindrome/Main.java', data: new TextEncoder().encode('new') },
    ];
    const plan = planFiles(files, code, library);
    assert.equal(plan.same, 1);
    assert.deepEqual(plan.add.map((a) => a.target), [path.join(code, 'palindrome', 'Main.java')]);
    assert.deepEqual(plan.conflicts.map((c) => c.target), [path.join(code, 'exams', 'exam-1', 'results.json')]);
    writeFiles(plan.add);
    assert.equal(fs.readFileSync(path.join(code, 'palindrome', 'Main.java'), 'utf8'), 'new');
  });
});
