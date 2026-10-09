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

  it('carries a whole subject, with the content inside it and without its solutions', () => {
    // A teacher's subject with a lesson and a challenge in its own folders.
    const subject = path.join(tempDir(), 'chemistry');
    fs.mkdirSync(path.join(subject, 'lessons'), { recursive: true });
    fs.writeFileSync(path.join(subject, 'subject.json'), JSON.stringify({ id: 'chemistry', title: 'Chemistry', kind: 'theory', units: [{ key: 'Atoms', title: 'Atoms' }] }));
    fs.cpSync(path.join(ROOT, 'subjects', 'cs', 'lessons', 'bits-and-bytes'), path.join(subject, 'lessons', 'inside-an-atom'), { recursive: true });
    fs.cpSync(path.join(ROOT, 'challenges', 'fizzbuzz'), path.join(subject, 'challenges', 'atom-fizz'), { recursive: true });
    // The teacher also ticked the lesson on its own: it travels with the subject, once.
    const pack = buildPack([{ kind: 'subject', dir: subject }, { kind: 'lesson', dir: path.join(subject, 'lessons', 'inside-an-atom') }], 'chem', false);
    assert.equal(pack.solutionsRemoved, 2);
    const { dest, found } = roundTrip(pack.zip);
    // The importer sees one subject, not the items inside it.
    assert.deepEqual(found.map((f) => `${f.kind}:${f.name}`), ['subject:chemistry']);
    const { ok, errors } = checkImportables(found, builtIn, builtInQuizzes);
    assert.deepEqual(errors, []);
    assert.equal(ok[0].title, 'Chemistry');
    assert.equal(ok[0].units, 1);
    assert.equal(ok[0].questions, 2, 'the lesson and the challenge inside were checked');
    assert.ok(fs.existsSync(path.join(dest, 'chem', 'chemistry', 'lessons', 'inside-an-atom', 'lesson.json')));
    assert.ok(!fs.existsSync(path.join(dest, 'chem', 'inside-an-atom')), 'the lesson is not packed twice');
    assert.deepEqual(findSolutions(dest), []);
  });

  it('reports a broken subject, or broken content inside it', () => {
    const dir = tempDir();
    fs.mkdirSync(path.join(dir, 'bad', 'challenges', 'broken'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'bad', 'subject.json'), JSON.stringify({ id: 'bad', title: 'Bad', units: [{ title: 'No key' }] }));
    fs.writeFileSync(path.join(dir, 'bad', 'challenges', 'broken', 'challenge.json'), '{ "title": ');
    const { ok, errors } = checkImportables(findImportables(dir, 'pack'), builtIn, builtInQuizzes);
    assert.equal(ok.length, 0);
    assert.ok(errors.some((e) => /^bad: unit 1 needs a "key"/.test(e)), errors.join(' | '));
    assert.ok(errors.some((e) => /^bad: broken: /.test(e)), errors.join(' | '));
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
