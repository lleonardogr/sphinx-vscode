import { strict as assert } from 'assert';
import { describe, it } from 'node:test';
import { examChallengeId, examRestrictions, parseExamChallengeId, scoreOutcome } from '../../exams';
import { RunOutcome, TestResult } from '../../runner';

describe('examRestrictions', () => {
  it('defaults closed exams to standard and open exams to none', () => {
    assert.deepEqual(examRestrictions('closed', undefined), { level: 'standard', record: true, blockCopy: true, blockPaste: true, pasteLimit: 50, maxAwaySeconds: 0 });
    assert.deepEqual(examRestrictions('open', undefined), { level: 'none', record: false, blockCopy: false, blockPaste: false, pasteLimit: 50, maxAwaySeconds: 0 });
  });

  it('applies each level', () => {
    assert.equal(examRestrictions('open', { level: 'relaxed' }).record, true);
    assert.equal(examRestrictions('open', { level: 'relaxed' }).blockPaste, false);
    assert.deepEqual(examRestrictions('open', { level: 'strict' }), { level: 'strict', record: true, blockCopy: true, blockPaste: true, pasteLimit: 30, maxAwaySeconds: 60 });
  });

  it('lets single rules override the level', () => {
    const r = examRestrictions('closed', { level: 'strict', blockPaste: false, maxAwaySeconds: 120 });
    assert.equal(r.blockPaste, false);
    assert.equal(r.blockCopy, true);
    assert.equal(r.maxAwaySeconds, 120);
  });

  it('turns recording on when anything is blocked or limited', () => {
    assert.equal(examRestrictions('open', { level: 'none', blockCopy: true }).record, true);
    assert.equal(examRestrictions('open', { level: 'none', maxAwaySeconds: 30 }).record, true);
    assert.equal(examRestrictions('open', { level: 'none', record: true }).record, true);
  });

  it('ignores invalid values', () => {
    const r = examRestrictions('closed', { level: 'extreme', pasteLimit: 3, maxAwaySeconds: -5, blockCopy: 'yes' });
    assert.equal(r.level, 'standard');
    assert.equal(r.pasteLimit, 50);
    assert.equal(r.maxAwaySeconds, 0);
    assert.equal(r.blockCopy, true);
  });
});

describe('exam ids and scores', () => {
  it('round-trips exam challenge ids', () => {
    assert.deepEqual(parseExamChallengeId(examChallengeId('exam-1', 'parking-fee')), { examId: 'exam-1', questionId: 'parking-fee' });
    assert.equal(parseExamChallengeId('fizzbuzz'), undefined);
  });

  const result = (passed: boolean): TestResult => ({ index: 0, hidden: false, passed, input: '', expected: '', actual: '', stderr: '', exitCode: 0, timedOut: false, timeMs: 1 });

  it('gives partial credit for the tests passed', () => {
    const outcome: RunOutcome = { kind: 'tests', results: [result(true), result(true), result(false)] };
    assert.deepEqual(scoreOutcome(outcome, 30), { earned: 20, passed: 2, total: 3 });
    assert.equal(scoreOutcome({ kind: 'tests', results: [result(true), result(false), result(false)] }, 10).earned, 3.33);
  });

  it('gives no credit for compile errors and broken rules', () => {
    assert.equal(scoreOutcome({ kind: 'compileError', errors: [], raw: '' }, 30).earned, 0);
    assert.equal(scoreOutcome({ kind: 'ruleViolation', messages: ['x'] }, 30).earned, 0);
  });
});

describe('previewOf', () => {
  it('copies an exam under its own id, so a preview never mixes with a real attempt', () => {
    const { previewOf } = require('../../exams') as typeof import('../../exams');
    const { loadChallenges } = require('../../challenges') as typeof import('../../challenges');
    const { loadQuizzes } = require('../../quizzes') as typeof import('../../quizzes');
    const { loadExams } = require('../../exams') as typeof import('../../exams');
    const path = require('path') as typeof import('path');
    const { CONTENT_ROOTS, ROOT } = require('./helpers') as typeof import('./helpers');
    const challenges = loadChallenges(CONTENT_ROOTS).challenges;
    const exam = loadExams([path.join(ROOT, 'exams')], challenges, loadQuizzes(CONTENT_ROOTS).quizzes).exams.find((e) => e.id === 'exam-1')!;
    const p = previewOf(exam);
    assert.equal(p.id, 'exam-1--preview');
    assert.equal(p.preview, true);
    assert.equal(p.title, 'Exam 1: Basics to Strings (preview)');
    assert.deepEqual(p.questions.map((q) => q.id), exam.questions.map((q) => q.id));
    for (const q of p.questions) {
      const id = q.kind === 'quiz' ? q.quiz.id : q.challenge.id;
      assert.deepEqual(parseExamChallengeId(id), { examId: 'exam-1--preview', questionId: q.id });
    }
    assert.equal(exam.questions[1].kind === 'challenge' && exam.questions[1].challenge.id, 'exam:exam-1:parking-fee', 'the original is not changed');
    assert.deepEqual(p.restrictions, exam.restrictions);
  });
});
