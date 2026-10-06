import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { buildClassReport, examsInResults, findResultsFiles, readResults, toCsv } from '../../classResults';
import { tempDir } from './helpers';

/** A results file like the extension writes. */
function results(student: string, scores: number[], extra: Record<string, unknown> = {}) {
  const questions = [
    { id: 'q1', type: 'quiz', title: 'Warm-up Quiz', points: 20 },
    { id: 'q2', type: 'challenge', title: 'Parking Fee', points: 30 },
    { id: 'q3', type: 'challenge', title: 'Word Stats', points: 50 },
  ].map((q, i) => ({ ...q, earned: scores[i], passed: 0, total: 5, submissions: scores[i] ? 1 : 0, code: '' }));
  return {
    format: 'sphinx-exam-results',
    version: 1,
    extensionVersion: '1.0.2',
    exam: { id: 'exam-1', title: 'Exam 1', mode: 'closed', durationMinutes: 60, maxSubmissions: 3 },
    student,
    startedAt: '2026-10-06T10:00:00.000Z',
    finishedAt: '2026-10-06T10:45:00.000Z',
    finishedBy: 'student',
    timeTakenSeconds: 45 * 60,
    awaySeconds: 0,
    score: { earned: scores.reduce((a, b) => a + b, 0), max: 100 },
    questions,
    warnings: [],
    ...extra,
  };
}

function classFolder(): string {
  const dir = tempDir();
  const write = (name: string, data: unknown) => fs.writeFileSync(path.join(dir, name), typeof data === 'string' ? data : JSON.stringify(data));
  write('results-bia.json', results('Bia Souza', [20, 30, 50]));
  write('results-ana.json', results('Ana Lima', [10, 15, 0], { awaySeconds: 125, finishedBy: 'time', warnings: [{ at: '', kind: 'paste', detail: '' }, { at: '', kind: 'paste', detail: '' }, { at: '', kind: 'away', detail: '' }] }));
  write('results-caio.json', results('Caio, "C" Dias', [20, 0, 25]));
  fs.mkdirSync(path.join(dir, 'late'));
  write(path.join('late', 'results-dan.json'), results('Dan', [0, 30, 50]));
  write('other-exam.json', { ...results('Eva', [1, 1, 1]), exam: { id: 'exam-2', title: 'Exam 2', mode: 'closed', durationMinutes: 75, maxSubmissions: 3 } });
  write('notes.json', { not: 'results' });
  write('broken.json', '{ "format": ');
  return dir;
}

describe('class results', () => {
  it('accepts results files saved under the old format names', () => {
    const { isResultsFormat } = require('../../exams') as typeof import('../../exams');
    for (const format of ['sphinx-exam-results', 'sphynx-exam-results', 'tech-challenges-exam-results']) {
      assert.equal(isResultsFormat(format), true, format);
    }
    assert.equal(isResultsFormat('something-else'), false);
  });

  it('finds results files in a folder and its subfolders, and skips other JSON', () => {
    const dir = classFolder();
    const files = findResultsFiles([dir]);
    assert.equal(files.length, 7);
    const { results: found, errors } = readResults(files);
    assert.equal(found.length, 5);
    assert.equal(errors.length, 1);
    assert.match(errors[0], /^broken\.json: /);
    assert.deepEqual(examsInResults(found), [{ id: 'exam-1', title: 'Exam 1', count: 4 }, { id: 'exam-2', title: 'Exam 2', count: 1 }]);
  });

  it('summarizes the class for one exam', () => {
    const { results: found } = readResults(findResultsFiles([classFolder()]));
    const report = buildClassReport(found, 'exam-1');
    assert.equal(report.examTitle, 'Exam 1');
    assert.equal(report.skipped, 1);
    assert.deepEqual(report.rows.map((r) => r.student), ['Ana Lima', 'Bia Souza', 'Caio, "C" Dias', 'Dan']);
    assert.deepEqual(report.stats, { count: 4, average: 62.5, median: 62.5, highest: 100, lowest: 25 });
    assert.deepEqual(report.questions.map((q) => q.average), [12.5, 18.75, 31.25]);
    const ana = report.rows[0];
    assert.equal(ana.percent, 25);
    assert.deepEqual(ana.warnings, { paste: 2, copy: 0, away: 1, copilot: 0 });
    assert.equal(ana.awaySeconds, 125);
    assert.equal(ana.finishedBy, 'time');
  });

  it('exports a CSV that spreadsheets read, quoting names with commas and quotes', () => {
    const { results: found } = readResults(findResultsFiles([classFolder()]));
    const csv = toCsv(buildClassReport(found, 'exam-1')).trim().split('\n');
    assert.equal(csv[0], 'Student,Score,Max,Percent,Warm-up Quiz (20),Parking Fee (30),Word Stats (50),Time (min),Away (min),Finished by,Paste warnings,Copy warnings,Away warnings,Copilot warnings,Started at,File');
    assert.equal(csv.length, 5);
    assert.ok(csv.includes('Ana Lima,25,100,25,10,15,0,45,2.1,time,2,0,1,0,2026-10-06T10:00:00.000Z,results-ana.json'), csv.join('\n'));
    assert.ok(csv.some((l) => l.startsWith('"Caio, ""C"" Dias",45,100,45,')));
  });

  it('handles an empty class', () => {
    const report = buildClassReport([], 'exam-1');
    assert.deepEqual(report.stats, { count: 0, average: 0, median: 0, highest: 0, lowest: 0 });
  });
});
