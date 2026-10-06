import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { Challenge } from '../../challenges';
import { loadLesson, readingMinutes, resolveLessonImages } from '../../lessons';
import { buildPath, nextInPath, pathItemId, requirementStatus, subjectOf, unitKey, unitName } from '../../path';
import { QuizQuestion, isCorrect, loadQuiz, parseNumberAnswer } from '../../quizzes';
import { allSubjects, findSubject, findUnit, loadSubjects } from '../../subjects';
import { ROOT, tempDir } from './helpers';

describe('subjects', () => {
  it('loads the built-in subjects in switcher order', () => {
    assert.deepEqual(allSubjects().map((s) => s.id), ['java', 'cs']);
    assert.equal(findSubject('java')!.units.length, 11);
    assert.equal(findSubject('cs')!.units.length, 8);
    assert.equal(findSubject('cs')!.kind, 'theory');
  });

  it('finds units by key or alias, across subjects', () => {
    assert.equal(findUnit('Loops')!.subject.id, 'java');
    assert.equal(findUnit('NumberSystems')!.subject.id, 'cs');
    assert.equal(findUnit('NumberSystems')!.index, 1);
    assert.equal(unitKey('Variables'), 'Basics', 'older topic names still work');
    assert.equal(unitKey('Nope'), undefined);
    assert.equal(unitName('Strings'), 'Strings & Characters');
  });

  it('rejects a unit key that another subject already uses', () => {
    const dir = tempDir();
    for (const [id, key] of [['a', 'Shared'], ['b', 'Shared']]) {
      fs.mkdirSync(path.join(dir, id));
      fs.writeFileSync(path.join(dir, id, 'subject.json'), JSON.stringify({ title: id, units: [{ key, title: key }] }));
    }
    const { subjects, errors } = loadSubjects([dir]);
    assert.equal(subjects.length, 1);
    assert.match(errors[0], /unit "Shared" is already a unit of "a"/);
  });

  it('decides the subject from the unit, then "subject", then Java', () => {
    assert.equal(subjectOf({ topic: 'NumberSystems' }), 'cs');
    assert.equal(subjectOf({ topic: 'Tests', unit: 'Strings' }), 'java');
    assert.equal(subjectOf({ topic: 'Custom', subject: 'cs' }), 'cs');
    assert.equal(subjectOf({ topic: 'Custom', subject: 'unknown' }), 'java');
    assert.equal(subjectOf({ topic: 'My Own Topic' }), 'java');
  });
});

describe('number answers', () => {
  it('reads binary with prefixes, spaces and leading zeros', () => {
    for (const s of ['1011', '0b1011', '0000 1011', '0B_1011', ' 1011 ']) {
      assert.equal(parseNumberAnswer(s, 2), 11, s);
    }
    assert.equal(parseNumberAnswer('1021', 2), undefined, '2 is not a binary digit');
    assert.equal(parseNumberAnswer('', 2), undefined);
  });

  it('reads hexadecimal in any case, with 0x or #', () => {
    for (const s of ['FF', 'ff', '0xFF', '#ff', '00ff']) {
      assert.equal(parseNumberAnswer(s, 16), 255, s);
    }
    assert.equal(parseNumberAnswer('FG', 16), undefined);
    assert.equal(parseNumberAnswer('0o17', 8), 15);
  });

  it('reads decimals written the English or the Portuguese way', () => {
    assert.equal(parseNumberAnswer('1,024', 10), 1024);
    assert.equal(parseNumberAnswer('1.024', 10), 1024);
    assert.equal(parseNumberAnswer('931,32', 10, false), 931.32);
    assert.equal(parseNumberAnswer('1.234,5', 10, false), 1234.5);
    assert.equal(parseNumberAnswer('1,234.5', 10, false), 1234.5);
    assert.equal(parseNumberAnswer('-42', 10), -42);
    assert.equal(parseNumberAnswer('4 2', 10), 42);
    assert.equal(parseNumberAnswer('12a', 10), undefined);
  });

  it('grades by value, with a tolerance for decimals', () => {
    const bin: QuizQuestion = { type: 'number', prompt: 'p', answer: '1011', value: 11, base: 2, tolerance: 0, explanation: '', points: 1 };
    assert.equal(isCorrect(bin, '0b00001011'), true);
    assert.equal(isCorrect(bin, '1010'), false);
    assert.equal(isCorrect(bin, null), false);
    const gib: QuizQuestion = { type: 'number', prompt: 'p', answer: '931.32', value: 931.32, base: 10, tolerance: 0.01, explanation: '', points: 1 };
    assert.equal(isCorrect(gib, '931,32'), true);
    assert.equal(isCorrect(gib, '931.325'), true);
    assert.equal(isCorrect(gib, '931.4'), false);
    // A whole answer accepts thousands separators; an exact decimal answer is still a decimal.
    const kib: QuizQuestion = { type: 'number', prompt: 'p', answer: '1024', value: 1024, base: 10, tolerance: 0, explanation: '', points: 1 };
    assert.equal(isCorrect(kib, '1.024'), true);
    assert.equal(isCorrect(kib, '1,024'), true);
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'quiz.json'), JSON.stringify({ title: 'q', questions: [{ type: 'number', prompt: 'p', answer: '2.125' }] }));
    const exact = loadQuiz(dir, 'en').questions[0];
    assert.equal(exact.type === 'number' && exact.value, 2.125);
    assert.equal(isCorrect(exact, '2,125'), true);
    assert.equal(isCorrect(exact, '2125'), false);
  });
});

describe('lessons and the path', () => {
  function lessonFolder(): string {
    const dir = path.join(tempDir(), 'binary');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'lesson.json'), JSON.stringify({ title: 'Binary', topic: 'NumberSystems', order: 1, requires: ['Loops'], translations: { 'pt-br': { title: 'Binário' } } }));
    fs.writeFileSync(path.join(dir, 'lesson.md'), `## Place value\n\n${'word '.repeat(400)}`);
    return dir;
  }

  it('loads a lesson with its translation, falling back to English text', () => {
    const dir = lessonFolder();
    const en = loadLesson(dir, 'en');
    assert.equal(en.title, 'Binary');
    assert.equal(en.minutes, readingMinutes(en.body));
    assert.equal(en.minutes, 2);
    const pt = loadLesson(dir, 'pt-br');
    assert.equal(pt.title, 'Binário');
    assert.equal(pt.body, en.body, 'no lesson.pt-br.md yet: the English text is shown');
    fs.writeFileSync(path.join(dir, 'lesson.pt-br.md'), '## Valor posicional\n\nTexto.');
    assert.match(loadLesson(dir, 'pt-br').body, /Valor posicional/);
  });

  it('loads relative images from the lesson folder only', () => {
    const dir = lessonFolder();
    const toUri = (file: string) => `webview://${path.relative(dir, file)}`;
    // What markdown.api.render returns for ![Bits](place-values.svg): data-src repeats the path.
    const html = '<p><img src="place-values.svg" alt="Bits" data-src="place-values.svg"></p>';
    assert.equal(resolveLessonImages(html, dir, toUri), '<p><img src="webview://place-values.svg" alt="Bits" data-src="place-values.svg"></p>');
    assert.equal(resolveLessonImages('<img alt="a b" src="img/two%20words.png">', dir, toUri), `<img alt="a b" src="webview://${path.join('img', 'two words.png')}">`);
    assert.equal(resolveLessonImages('<img src="../secret.png"><img src="/etc/x.png">', dir, toUri), '<img src=""><img src="">');
    const remote = '<img src="https://example.com/a.png"><img src="data:image/png;base64,AA==">';
    assert.equal(resolveLessonImages(remote, dir, toUri), remote);
  });

  it('puts lessons first in their unit, and only in their subject', () => {
    const lesson = loadLesson(lessonFolder(), 'en');
    const challenge = { id: 'b2d', title: 'Binary to Decimal', topic: 'NumberSystems', order: 1, unit: undefined, requires: [] } as unknown as Challenge;
    const cs = buildPath([challenge], [], [lesson], 'cs');
    assert.deepEqual(cs.map((g) => `${g.number} · ${g.key}`), ['2 · NumberSystems']);
    assert.equal(pathItemId(nextInPath(cs, 'binary')!), 'b2d');
    assert.deepEqual(buildPath([challenge], [], [lesson], 'java'), []);
  });

  it('reports progress in each prerequisite unit', () => {
    const c = (id: string, topic: string) => ({ id, topic, title: id, order: 0, requires: [] }) as unknown as Challenge;
    const all = [c('a', 'Loops'), c('b', 'Loops'), c('c', 'Strings')];
    const status = requirementStatus(['Loops', 'Nope'], all, (id) => id === 'a');
    assert.deepEqual(status, [
      { unit: 'Loops', label: 'Java Programming · Loops', solved: 1, total: 2 },
      { unit: 'Nope', label: 'Nope', solved: 0, total: 0 },
    ]);
  });

  it('ships every subject folder', () => {
    for (const s of allSubjects()) {
      assert.ok(fs.existsSync(path.join(ROOT, 'subjects', s.id, 'subject.json')));
    }
  });
});
