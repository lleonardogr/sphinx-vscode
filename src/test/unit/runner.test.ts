import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { before, describe, it } from 'node:test';
import { parseJavaVersion } from '../../javaCheck';
import { RunRequest, checkRules, normalizeOutput, parseJavacErrors, runChallengeCode } from '../../runner';
import { javaVersion, tempDir } from './helpers';

describe('normalizeOutput', () => {
  it('ignores line endings, trailing spaces and trailing blank lines', () => {
    assert.equal(normalizeOutput('a  \r\nb\t\r\n\n\n'), 'a\nb');
    assert.equal(normalizeOutput('a\rb'), 'a\nb');
  });

  it('keeps leading spaces and blank lines in the middle', () => {
    assert.equal(normalizeOutput('  a\n\nb'), '  a\n\nb');
  });
});

describe('checkRules', () => {
  const loop = { pattern: '\\b(for|while)\\b', message: 'Use a loop.' };
  const noSort = { pattern: 'Arrays\\.sort', message: 'No sorting.' };

  it('reports missing and forbidden patterns', () => {
    assert.deepEqual(checkRules('int x = 1;', [loop], []), ['Use a loop.']);
    assert.deepEqual(checkRules('for (;;) {} Arrays.sort(a);', [loop], [noSort]), ['No sorting.']);
    assert.deepEqual(checkRules('while (true) {}', [loop], [noSort]), []);
  });

  it('ignores comments, so a rule cannot be satisfied with a comment', () => {
    assert.deepEqual(checkRules('// for\n/* while */ int x;', [loop], []), ['Use a loop.']);
    assert.deepEqual(checkRules('// Arrays.sort(a)\nint x;', [], [noSort]), []);
  });
});

describe('parsing javac and java output', () => {
  it('reads errors with their line, column and details', () => {
    const raw = [
      'Main.java:3: error: cannot find symbol',
      '        int y = z + 1;',
      '                ^',
      '  symbol:   variable z',
      '  location: class Main',
      'Main.java:7: error: \';\' expected',
      '        return x',
      '                ^',
      '2 errors',
    ].join('\n');
    const errors = parseJavacErrors(raw);
    assert.equal(errors.length, 2);
    assert.deepEqual(errors[0], { line: 3, column: 16, message: 'cannot find symbol\nsymbol:   variable z\nlocation: class Main' });
    assert.equal(errors[1].line, 7);
  });

  it('reads Java versions in every format', () => {
    assert.equal(parseJavaVersion('openjdk version "25" 2025-09-16'), 25);
    assert.equal(parseJavaVersion('java version "21.0.2" 2024-01-16 LTS'), 21);
    assert.equal(parseJavaVersion('java version "1.8.0_402"'), 8);
    assert.equal(parseJavaVersion('nothing here'), undefined);
  });
});

describe('runChallengeCode (needs a JDK)', async () => {
  const version = await javaVersion;
  const dir = tempDir();
  let n = 0;
  const run = (source: string, req: Omit<RunRequest, 'file'>) => {
    const file = path.join(dir, String(++n), 'Main.java');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, source);
    return runChallengeCode({ ...req, file });
  };
  const classic = (body: string) => `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n${body}\n    }\n}\n`;
  const opts = { skip: version === undefined ? 'no JDK on the PATH' : false };

  before(() => {
    if (version !== undefined) {
      console.log(`using javac ${version}`);
    }
  });

  it('passes tests whose output matches and fails the others', opts, async () => {
    const outcome = await run(classic('        int a = in.nextInt(), b = in.nextInt();\n        System.out.println(a + b);'), {
      tests: [{ input: '2 3\n', output: '5\n' }, { input: '10 -4\n', output: '6' }, { input: '1 1\n', output: '3\n', hidden: true }],
    });
    assert.equal(outcome.kind, 'tests');
    if (outcome.kind === 'tests') {
      assert.deepEqual(outcome.results.map((r) => r.passed), [true, true, false]);
      assert.equal(outcome.results[2].actual.trim(), '2');
      assert.equal(outcome.results[2].hidden, true);
    }
  });

  it('reports compile errors with the line number', opts, async () => {
    const outcome = await run(classic('        int x = undefinedVariable;'), { tests: [{ input: '', output: '' }] });
    assert.equal(outcome.kind, 'compileError');
    if (outcome.kind === 'compileError') {
      assert.equal(outcome.errors[0].line, 6);
      assert.match(outcome.errors[0].message, /cannot find symbol/);
    }
  });

  it('checks the rules before compiling', opts, async () => {
    const outcome = await run(classic('        System.out.println(1);'), { tests: [], mustContain: [{ pattern: '\\bfor\\b', message: 'Use a for loop.' }] });
    assert.deepEqual(outcome, { kind: 'ruleViolation', messages: ['Use a for loop.'] });
  });

  it('stops programs that run longer than the time limit', opts, async () => {
    const outcome = await run(classic('        while (true) { }'), { tests: [{ input: '', output: '' }], timeLimitMs: 1500 });
    assert.equal(outcome.kind, 'tests');
    if (outcome.kind === 'tests') {
      assert.equal(outcome.results[0].timedOut, true);
      assert.equal(outcome.results[0].passed, false);
    }
  });

  it('prints decimals with a dot whatever the computer\'s language', opts, async () => {
    const outcome = await run(classic('        System.out.printf("%.2f%n", in.nextDouble() / 3);'), { tests: [{ input: '10\n', output: '3.33\n' }] });
    assert.equal(outcome.kind === 'tests' && outcome.results[0].passed, true);
  });

  it('runs modern compact source files on JDK 25+', { skip: version === undefined || version < 25 ? 'needs JDK 25+' : false }, async () => {
    const outcome = await run('void main() {\n    IO.println("Hi, " + IO.readln().trim() + "!");\n}\n', { tests: [{ input: 'Ana\n', output: 'Hi, Ana!\n' }] });
    assert.equal(outcome.kind === 'tests' && outcome.results[0].passed, true);
  });
});
