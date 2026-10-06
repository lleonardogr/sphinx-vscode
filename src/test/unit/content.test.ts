import { strict as assert } from 'assert';
import * as path from 'path';
import { describe, it } from 'node:test';
import { loadChallenge, loadChallenges } from '../../challenges';
import { loadExams } from '../../exams';
import { buildPath, nextInPath, pathItemId, pathSequence, subjectOf } from '../../path';
import { findSubject } from '../../subjects';
import { loadLessons } from '../../lessons';
import { loadQuizzes } from '../../quizzes';
import { CONTENT_ROOTS, ROOT, SUBJECT_ERRORS } from './helpers';

const { challenges, errors } = loadChallenges(CONTENT_ROOTS);
const quizLoad = loadQuizzes(CONTENT_ROOTS);
const examLoad = loadExams([path.join(ROOT, 'exams')], challenges, quizLoad.quizzes);
const lessonLoad = loadLessons(CONTENT_ROOTS);
const java = challenges.filter((c) => subjectOf(c) === 'java');

describe('built-in content', () => {
  it('loads every subject, challenge, quiz, lesson and exam without errors', () => {
    assert.deepEqual(SUBJECT_ERRORS, []);
    assert.deepEqual(lessonLoad.errors, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(quizLoad.errors, []);
    assert.deepEqual(examLoad.errors, []);
  });

  it('has the 100 challenges of the Java learning path', () => {
    assert.equal(java.length, 100);
  });

  it('uses unique ids', () => {
    const ids = challenges.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length);
    const quizIds = quizLoad.quizzes.map((q) => q.id);
    assert.equal(new Set(quizIds).size, quizIds.length);
  });

  it('gives every challenge visible and hidden tests with expected output', () => {
    for (const c of challenges) {
      assert.ok(c.tests.some((t) => !t.hidden), `${c.id} has no visible test`);
      // Like the validator: a program that reads no input (Hello, World!) can't have meaningful hidden tests.
      const readsInput = c.tests.some((t) => t.input.trim() !== '');
      assert.ok(!readsInput || c.tests.some((t) => t.hidden), `${c.id} has no hidden test`);
      assert.ok(c.tests.every((t) => t.output.trim() !== ''), `${c.id} has a test without output`);
    }
  });

  it('ships the exams with their questions', () => {
    const ids = examLoad.exams.map((e) => e.id).sort();
    assert.deepEqual(ids, ['exam-1', 'exam-2', 'final-exam', 'sample-exam']);
    for (const e of examLoad.exams) {
      assert.ok(e.questions.length > 0 && e.questions.every((q) => q.points > 0), `${e.id} has a question without points`);
    }
  });
});

describe('learning path', () => {
  const groups = buildPath(challenges, quizLoad.quizzes, lessonLoad.lessons, 'java');
  const units = groups.filter((g) => g.kind === 'unit');

  it('lists the 11 Java units in teaching order', () => {
    assert.deepEqual(units.map((g) => g.key), findSubject('java')!.units.map((u) => u.key));
    assert.equal(units.length, 11);
  });

  it('keeps other subjects out of the Java path', () => {
    const ids = new Set(pathSequence(groups).map(pathItemId));
    assert.ok(challenges.filter((c) => subjectOf(c) !== 'java').every((c) => !ids.has(c.id)));
  });

  it('gives every unit challenges and exactly one quiz', () => {
    for (const g of units) {
      assert.ok(g.challenges.length >= 5, `${g.key} has only ${g.challenges.length} challenges`);
      assert.equal(g.quizzes.length, 1, `${g.key} should have one quiz`);
    }
  });

  it('orders each unit from easier to harder', () => {
    const rank: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
    for (const g of units) {
      const ranks = g.challenges.map((c) => rank[c.difficulty]);
      assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), `${g.key} is not ordered by difficulty`);
    }
  });

  it('puts mixed tests at the end of the unit they close', () => {
    const tests = units.flatMap((g) => g.tests.map((t) => `${g.key}:${t.id}`));
    assert.ok(tests.includes('Strings:hangman-referee'));
    assert.ok(tests.includes('OOP:library-system'));
    assert.ok(tests.includes('Streams:student-report'));
  });

  it('suggests the next item after each one', () => {
    const id = (it: Parameters<typeof pathItemId>[0] | undefined) => (it ? pathItemId(it) : undefined);
    const sequence = pathSequence(groups);
    assert.equal(id(nextInPath(groups, 'hello-world')), id(sequence[1]));
    const lastChallenge = units[0].challenges.at(-1)!;
    assert.equal(id(nextInPath(groups, lastChallenge.id)), units[0].quizzes[0].id);
  });
});

describe('translations', () => {
  it('loads Portuguese titles, descriptions and starter comments', () => {
    const dir = path.join(ROOT, 'challenges', 'password-checker');
    const en = loadChallenge(dir, 'en');
    const pt = loadChallenge(dir, 'pt-br');
    assert.equal(en.title, 'Password Checker');
    assert.equal(pt.title, 'Verificador de senha');
    assert.match(pt.description, /O que você precisa saber/);
    assert.match(pt.starterCode, /TODO: imprima/);
    assert.deepEqual(pt.tests, en.tests, 'tests must not change with the language');
  });
});
