import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { Challenge } from '../../challenges';
import { loadLesson, parseReadings, readingMinutes, resolveLessonImages } from '../../lessons';
import { readingProblems, validateChallenges } from '../../validator';
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

  it('reads a reading guide: objectives and readings, translated', () => {
    const dir = lessonFolder();
    const reading = { title: 'What is DNS?', source: 'Cloudflare', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/', type: 'article', minutes: 8, lang: 'en', lookFor: 'Where answers are cached.' };
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'lesson.json'), 'utf8'));
    fs.writeFileSync(
      path.join(dir, 'lesson.json'),
      JSON.stringify({ ...meta, objectives: ['Convert', 'Explain', 'Detect'], readings: [reading], translations: { 'pt-br': { title: 'Binário', objectives: ['Converter', 'Explicar', 'Detectar'], readings: [{ lookFor: 'Onde as respostas ficam em cache.' }] } } }),
    );
    const en = loadLesson(dir, 'en');
    assert.deepEqual(en.objectives, ['Convert', 'Explain', 'Detect']);
    assert.deepEqual(en.readings, [reading]);
    const pt = loadLesson(dir, 'pt-br');
    assert.equal(pt.objectives[0], 'Converter');
    assert.equal(pt.readings[0].lookFor, 'Onde as respostas ficam em cache.');
    assert.equal(pt.readings[0].url, reading.url, 'links are shared by every language');
  });

  it('leaves out incomplete readings, and the validator says why', () => {
    const good = { title: 'T', source: 'S', url: 'https://example.com/a', type: 'video', minutes: 5, lang: 'en', lookFor: 'L' };
    const raw = [good, { ...good, url: 'http://example.com' }, { ...good, type: 'podcast' }, { title: 'T' }];
    assert.equal(parseReadings(raw).length, 1);
    assert.deepEqual(readingProblems([good]), []);
    const problems = readingProblems(raw.slice(1));
    assert.ok(problems.some((p) => p.includes('reading 1: "url" must be an https link')), problems.join('\n'));
    assert.ok(problems.some((p) => p.includes('reading 2: "type"')), problems.join('\n'));
    assert.ok(problems.some((p) => p.includes('reading 3: needs "source"')), problems.join('\n'));
    assert.deepEqual(readingProblems([]), ['"readings" must list 1 to 3 readings']);
    assert.deepEqual(readingProblems([good, good, good], 2), ['"readings" must list 1 to 2 readings']);
  });

  it('holds programming subjects to the quick guide limits, and theory subjects to the full ones', async () => {
    const reading = { title: 'T', source: 'S', url: 'https://example.com/a', type: 'article', minutes: 5, lang: 'en', lookFor: 'L' };
    const guide = (topic: string, readings: number) => {
      const dir = path.join(tempDir(), 'guide');
      fs.mkdirSync(dir);
      fs.writeFileSync(path.join(dir, 'lesson.json'), JSON.stringify({ title: 'Guide', topic, order: 1, objectives: ['One', 'Two'], readings: Array(readings).fill(reading) }));
      fs.writeFileSync(path.join(dir, 'lesson.md'), `## In short\n\n${'word '.repeat(70)}\n\n<!-- readings -->\n`);
      return dir;
    };
    const report = async (dir: string) => (await validateChallenges([path.dirname(dir)])).challenges[0];
    // Java: 2 objectives and a 70-word summary are a good quick guide; 3 readings are too many.
    assert.deepEqual((await report(guide('Basics', 1))).warnings ?? [], []);
    assert.deepEqual((await report(guide('Basics', 3))).problems, ['"readings" must list 1 to 2 readings']);
    // CS: the same guide is too short for a reading guide.
    const cs = (await report(guide('Logic', 1))).warnings ?? [];
    assert.ok(cs.some((w) => w.includes('aim for 150 to 250')) && cs.some((w) => w.includes('2 objectives; a unit has 3 to 5')), cs.join('\n'));
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
