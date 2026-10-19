import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { loadChallenge } from '../../challenges';
import { generateInput, generateProblems, inputPreview, MAX_GENERATED_VALUES, testInput } from '../../generate';
import { runChallengeCode } from '../../runner';
import { javaVersion, tempDir } from './helpers';

describe('generated test inputs', () => {
  it('build the same input from the same recipe, on every computer', () => {
    const spec = {
      seed: 42,
      lines: ['3', { ints: 5, min: 1, max: 100 }, { ints: 4, min: -5, max: 5, rows: 2, sorted: true }, { ints: 6, min: 1, max: 6, distinct: true }, { chars: 12, alphabet: '.....#' }],
    };
    // Pinned: a change here changes the expected outputs of every generated test already written.
    assert.equal(generateInput(spec), '3\n61 86 18 28 87\n-3 -3 2 3\n-5 -3 1 4\n6 5 3 1 2 4\n...###....#.\n');
    assert.notEqual(generateInput({ ...spec, seed: 43 }), generateInput(spec));
  });

  it('keep numbers in range, sorted and distinct when asked, even across a huge range', () => {
    const [n, row] = generateInput({ seed: 1, lines: ['50000', { ints: 50000, min: -1e15, max: 1e15, sorted: true, distinct: true }] }).trim().split('\n');
    const values = row.split(' ').map(Number);
    assert.equal(Number(n), values.length);
    assert.equal(new Set(values).size, values.length);
    assert.ok(values.every((v, i) => Number.isInteger(v) && v >= -1e15 && v <= 1e15 && (i === 0 || values[i - 1] < v)));
    const all = generateInput({ seed: 9, lines: [{ ints: 10, min: 1, max: 10, distinct: true }] }).trim().split(' ').map(Number);
    assert.deepEqual([...all].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('can give each column its own range, such as a start and a short length', () => {
    const rows = generateInput({ seed: 4, lines: [{ ints: 2, min: [0, 1], max: [1000000000, 60], rows: 1000 }] }).trim().split('\n');
    assert.equal(rows.length, 1000);
    for (const row of rows) {
      const [start, length] = row.split(' ').map(Number);
      assert.ok(start >= 0 && start <= 1e9 && length >= 1 && length <= 60, row);
    }
    assert.match(generateProblems({ seed: 1, lines: [{ ints: 2, min: [0], max: [1, 2] }] }).join(), /one value per number/);
    assert.match(generateProblems({ seed: 1, lines: [{ ints: 2, min: [0, 5], max: [1, 2] }] }).join(), /min <= max/);
    assert.match(generateProblems({ seed: 1, lines: [{ ints: 2, min: [0, 0], max: [9, 9], sorted: true }] }).join(), /one range for every number/);
  });

  it('build random trees as parent lists, from bushy to a chain', () => {
    const parents = generateInput({ seed: 6, lines: [{ parents: 1000 }] }).trim().split(' ').map(Number);
    assert.equal(parents.length, 999);
    assert.ok(parents.every((p, i) => p >= 1 && p < i + 2), 'every parent is smaller than its node');
    assert.equal(generateInput({ seed: 6, lines: [{ parents: 6, maxGap: 1 }] }), '1 2 3 4 5\n');
    const close = generateInput({ seed: 7, lines: [{ parents: 500, maxGap: 3 }] }).trim().split(' ').map(Number);
    assert.ok(close.every((p, i) => i + 2 - p <= 3));
    assert.match(generateProblems({ seed: 1, lines: [{ parents: 1 }] }).join(), /2 or more/);
    assert.match(generateProblems({ seed: 1, lines: [{ parents: 5, maxGap: 0 }] }).join(), /maxGap/);
  });

  it('reject recipes that are broken or too big', () => {
    assert.deepEqual(generateProblems({ seed: 1, lines: ['1', { ints: 3, min: 0, max: 9 }] }), []);
    assert.match(generateProblems({ lines: ['1'] }).join(), /seed/);
    assert.match(generateProblems({ seed: 1, lines: [] }).join(), /list of lines/);
    assert.match(generateProblems({ seed: 1, lines: [{ ints: 5, min: 1, max: 3, distinct: true }] }).join(), /don't fit/);
    assert.match(generateProblems({ seed: 1, lines: [{ ints: 2, min: 5, max: 1 }] }).join(), /min <= max/);
    assert.match(generateProblems({ seed: 1, lines: [{ chars: 3, alphabet: '' }] }).join(), /alphabet/);
    assert.match(generateProblems({ seed: 1, lines: [{ words: 3 }] }).join(), /"ints", "chars" or "parents"/);
    assert.match(generateProblems({ seed: 1, lines: [{ ints: 1000, rows: MAX_GENERATED_VALUES, min: 0, max: 1 }] }).join(), /the most is/);
    assert.throws(() => generateInput({ seed: 1, lines: [] }), /list of lines/);
  });

  it('show a short preview of a big input in results, and the whole of a small one', () => {
    const bigTest = { input: '', output: '', generate: { seed: 3, lines: [{ ints: 1000, min: 0, max: 9 }] } };
    assert.equal(testInput(bigTest).length, 2000);
    assert.match(inputPreview(bigTest), /… \(2000 characters, generated\)$/);
    assert.equal(inputPreview({ input: '1 2\n' }), '1 2\n');
  });

  it('are always hidden, and the runner feeds them to the program', async (t) => {
    const dir = path.join(tempDir(), 'sum-big');
    fs.mkdirSync(dir);
    const generate = { seed: 5, lines: ['100000', { ints: 100000, min: 1, max: 1000 }] };
    fs.writeFileSync(path.join(dir, 'challenge.json'), JSON.stringify({ title: 'Sum', tests: [{ input: '2\n1 2\n', output: '3\n' }, { generate, output: '' }] }));
    const c = loadChallenge(dir);
    assert.equal(c.tests[1].hidden, true, 'a generated test is hidden even without "hidden": true');
    assert.equal(c.tests[1].input, '');

    if ((await javaVersion) === undefined) return t.skip('no JDK on the PATH');
    const expected = testInput(c.tests[1]).trim().split('\n')[1].split(' ').reduce((s, v) => s + Number(v), 0);
    c.tests[1].output = `${expected}\n`;
    const file = path.join(dir, 'Main.java');
    fs.writeFileSync(file, 'import java.util.*;\npublic class Main {\n  public static void main(String[] a) {\n    Scanner in = new Scanner(System.in);\n    int n = in.nextInt(); long s = 0;\n    for (int i = 0; i < n; i++) s += in.nextInt();\n    System.out.println(s);\n  }\n}\n');
    const outcome = await runChallengeCode({ file, tests: c.tests, timeLimitMs: 20000 });
    assert.equal(outcome.kind, 'tests');
    if (outcome.kind === 'tests') {
      assert.deepEqual(outcome.results.map((r) => r.passed), [true, true]);
      assert.ok(outcome.results[1].input.length < 300, 'results carry a preview, not the whole input');
    }
  });
});
