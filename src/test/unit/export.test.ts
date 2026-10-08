import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { loadChallenges } from '../../challenges';
import { loadExams } from '../../exams';
import { buildPack, examDependencies } from '../../exportCore';
import { checkImportables, extractZip, findImportables, findSolutions } from '../../importCore';
import { loadQuizzes } from '../../quizzes';
import { CONTENT_ROOTS, ROOT, tempDir } from './helpers';

const builtIn = loadChallenges(CONTENT_ROOTS).challenges;
const builtInQuizzes = loadQuizzes(CONTENT_ROOTS).quizzes;

/** Writes the pack to disk, extracts it and returns what the importer finds. */
function roundTrip(zip: Uint8Array) {
  const file = path.join(tempDir(), 'pack.zip');
  fs.writeFileSync(file, zip);
  const dest = tempDir();
  extractZip(file, dest);
  return { dest, found: findImportables(dest, 'pack') };
}

describe('export a pack', () => {
  it('produces a zip the importer accepts, with the solutions removed for students', () => {
    const items = [
      { kind: 'challenge' as const, dir: path.join(ROOT, 'challenges', 'fizzbuzz') },
      { kind: 'quiz' as const, dir: path.join(ROOT, 'quizzes', 'loops-quiz') },
      { kind: 'lesson' as const, dir: path.join(ROOT, 'subjects', 'cs', 'lessons', 'bits-and-bytes') },
      { kind: 'exam' as const, dir: path.join(ROOT, 'exams', 'exam-1') },
    ];
    const pack = buildPack(items, 'class-7b', false);
    assert.ok(pack.solutionsRemoved >= 2 + 6, `only ${pack.solutionsRemoved} solutions removed`);
    const { dest, found } = roundTrip(pack.zip);
    assert.deepEqual(found.map((f) => `${f.kind}:${f.name}`).sort(), ['challenge:fizzbuzz', 'exam:exam-1', 'lesson:bits-and-bytes', 'quiz:loops-quiz']);
    assert.deepEqual(findSolutions(dest), []);
    const { ok, errors } = checkImportables(found, builtIn, builtInQuizzes);
    assert.deepEqual(errors, []);
    assert.equal(ok.length, 4);
    // The lesson keeps its translation and its diagrams.
    for (const file of ['lesson.pt-br.md', 'bit-patterns.svg']) assert.ok(fs.existsSync(path.join(dest, 'class-7b', 'bits-and-bytes', file)), file);
    // The exam keeps its private questions.
    assert.ok(fs.existsSync(path.join(dest, 'class-7b', 'exam-1', 'parking-fee', 'challenge.json')));
  });

  it('keeps the solutions for teachers', () => {
    const pack = buildPack([{ kind: 'challenge', dir: path.join(ROOT, 'challenges', 'fizzbuzz') }], 'p', true);
    assert.equal(pack.solutionsRemoved, 0);
    const { dest } = roundTrip(pack.zip);
    assert.deepEqual(findSolutions(dest).map((f) => path.basename(f)).sort(), ['Solution.classic.java', 'Solution.java']);
  });

  it('finds the teacher\'s own challenges an exam uses, but not built-in or private ones', () => {
    // A teacher folder: an exam that uses a private question, a built-in challenge and the teacher's own challenge.
    const folder = tempDir();
    fs.cpSync(path.join(ROOT, 'challenges', 'fizzbuzz'), path.join(folder, 'my-fizz'), { recursive: true });
    const examDir = path.join(folder, 'my-exam');
    fs.mkdirSync(examDir);
    fs.cpSync(path.join(ROOT, 'exams', 'exam-1', 'parking-fee'), path.join(examDir, 'parking-fee'), { recursive: true });
    fs.writeFileSync(path.join(examDir, 'exam.json'), JSON.stringify({ title: 'My Exam', durationMinutes: 30, mode: 'open', questions: [{ id: 'parking-fee', points: 10 }, { id: 'even-or-odd', points: 10 }, { id: 'my-fizz', points: 10 }] }));
    const own = loadChallenges([folder]).challenges;
    const exam = loadExams([folder], [...builtIn, ...own], builtInQuizzes).exams[0];
    assert.ok(exam, 'the test exam did not load');
    assert.deepEqual(examDependencies(exam, ROOT).map((d) => path.basename(d.dir)), ['my-fizz']);
  });
});
