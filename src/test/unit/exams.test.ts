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
