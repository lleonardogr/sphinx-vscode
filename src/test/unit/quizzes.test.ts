import { strict as assert } from 'assert';
import { describe, it } from 'node:test';
import { QuizDefinition, QuizQuestion, describeAnswer, gradeQuiz, isCorrect, isWholeProgram, parseAnswers, quizProgram, scaleQuizGrade } from '../../quizzes';

const choice: QuizQuestion = { type: 'choice', prompt: 'p', options: ['a', 'b', 'c'], answer: [1], multiple: false, explanation: '', points: 1 };
const many: QuizQuestion = { type: 'choice', prompt: 'p', options: ['a', 'b', 'c'], answer: [0, 2], multiple: true, explanation: '', points: 2 };
const tf: QuizQuestion = { type: 'truefalse', prompt: 'p', answer: false, explanation: '', points: 1 };
const short: QuizQuestion = { type: 'short', prompt: 'p', answer: ['continue', 'the continue keyword'], caseSensitive: false, explanation: '', points: 1 };
const typed: QuizQuestion = { type: 'output', prompt: '', code: 'x', answer: '0 1 2\nDone', explanation: '', points: 1 };
const picked: QuizQuestion = { type: 'output', prompt: '', code: 'x', answer: 'big', options: ['small', 'big'], explanation: '', points: 1 };

describe('isCorrect', () => {
  it('grades single and multiple choice, ignoring the order of picks', () => {
    assert.equal(isCorrect(choice, [1]), true);
    assert.equal(isCorrect(choice, [0]), false);
    assert.equal(isCorrect(many, [2, 0]), true);
    assert.equal(isCorrect(many, [0]), false);
    assert.equal(isCorrect(many, [0, 1, 2]), false);
  });

  it('grades true or false', () => {
    assert.equal(isCorrect(tf, false), true);
    assert.equal(isCorrect(tf, true), false);
  });

  it('accepts any listed short answer, ignoring case and extra spaces', () => {
    assert.equal(isCorrect(short, '  CONTINUE '), true);
    assert.equal(isCorrect(short, 'the   continue keyword'), true);
    assert.equal(isCorrect(short, 'break'), false);
  });

  it('compares typed output line by line, ignoring trailing spaces and line endings', () => {
    assert.equal(isCorrect(typed, '0 1 2  \r\nDone\n\n'), true);
    assert.equal(isCorrect(typed, '0 1 2\nDone!'), false);
    assert.equal(isCorrect(typed, '0  1 2\nDone'), false);
  });

  it('grades output questions with options by the picked text', () => {
    assert.equal(isCorrect(picked, [1]), true);
    assert.equal(isCorrect(picked, [0]), false);
  });

  it('treats a missing answer as wrong', () => {
    for (const q of [choice, tf, short, typed]) {
      assert.equal(isCorrect(q, null), false);
    }
  });
});

describe('gradeQuiz', () => {
  const quiz: QuizDefinition = { id: 'q', title: 'Q', description: '', topic: '', dir: '', questions: [choice, many, tf] };

  it('adds the points of the right answers', () => {
    const g = gradeQuiz(quiz, [[1], [0, 2], true]);
    assert.deepEqual({ earned: g.earned, total: g.total, correct: g.correct }, { earned: 3, total: 4, correct: 2 });
  });

  it('counts unanswered questions as wrong', () => {
    assert.equal(gradeQuiz(quiz, []).earned, 0);
  });

  it('scales a grade to exam points with two decimals', () => {
    assert.deepEqual(scaleQuizGrade(gradeQuiz(quiz, [[1], null, false]), 20), { earned: 10, passed: 2, total: 3 });
    assert.equal(scaleQuizGrade(gradeQuiz({ ...quiz, questions: [tf, tf, tf] }, [false]), 10).earned, 3.33);
  });
});

describe('answers and snippets', () => {
  it('describes the right answer', () => {
    assert.equal(describeAnswer(many), 'a, c');
    assert.equal(describeAnswer(short), 'continue / the continue keyword');
  });

  it('reads saved answers and ignores broken files', () => {
    assert.deepEqual(parseAnswers('[[1],true,"x",null]'), [[1], true, 'x', null]);
    assert.deepEqual(parseAnswers('not json'), []);
    assert.deepEqual(parseAnswers('{"a":1}'), []);
    assert.deepEqual(parseAnswers(undefined), []);
  });

  it('wraps snippets in void main() but leaves whole programs alone', () => {
    assert.equal(quizProgram('IO.println(1);'), 'void main() {\n    IO.println(1);\n}\n');
    assert.equal(isWholeProgram('int f() { return 1; }\n\nvoid main() {}'), true);
    assert.equal(isWholeProgram('record P(int x) {}'), false);
    assert.equal(isWholeProgram('class A {}'), true);
  });
});
