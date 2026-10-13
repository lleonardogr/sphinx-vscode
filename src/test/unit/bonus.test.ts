import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { evaluateBonuses } from '../../bonus';
import { loadChallenge } from '../../challenges';
import { findCCompiler } from '../../cRunner';
import { validateChallenges } from '../../validator';
import { tempDir } from './helpers';

const LOOP = '#include <stdio.h>\n\nint main(void) {\n    long long n, sum = 0;\n    scanf("%lld", &n);\n    for (long long i = 1; i <= n; i++) {\n        sum += i;\n    }\n    printf("%lld\\n", sum);\n    return 0;\n}\n';
const RECURSIVE = '#include <stdio.h>\n\nlong long sum(long long n) {\n    return n == 0 ? 0 : n + sum(n - 1);\n}\n\nint main(void) {\n    long long n;\n    scanf("%lld", &n);\n    printf("%lld\\n", sum(n));\n    return 0;\n}\n';
const FORMULA = '#include <stdio.h>\n\nint main(void) {\n    long long n;\n    scanf("%lld", &n);\n    printf("%lld\\n", n * (n + 1) / 2);\n    return 0;\n}\n';

/** "Sum 1 to N" in C, with two bonus goals: no loops (a rule) and a huge N (an efficiency test). */
function challengeFolder(files: Record<string, string> = {}): string {
  const dir = path.join(tempDir(), 'sum-to-n');
  fs.mkdirSync(dir);
  const meta = {
    title: 'Sum to N',
    difficulty: 'Easy',
    tests: [{ input: '3\n', output: '6\n' }, { input: '10\n', output: '55\n' }, { input: '1\n', output: '1\n', hidden: true }],
    bonus: [
      { id: 'no-loops', title: 'Without loops', description: 'No for or while.', hint: 'Recursion, or a formula.', mustNotContain: [{ pattern: '\\b(for|while)\\b', message: 'No loops.' }] },
      { id: 'huge-n', title: 'Huge N', description: 'N up to 3 billion, in a second.', timeLimitMs: 1000, tests: [{ input: '3000000000\n', output: '' }] },
    ],
    translations: { 'pt-br': { title: 'Soma até N', bonus: [{ title: 'Sem laços', description: 'Sem for nem while.', hint: 'Recursão, ou uma fórmula.', mustNotContain: ['Sem laços.'] }, { title: 'N enorme', description: 'N até 3 bilhões, em um segundo.' }] } },
  };
  fs.writeFileSync(path.join(dir, 'challenge.json'), JSON.stringify(meta));
  fs.writeFileSync(path.join(dir, 'description.md'), '# Sum to N\n\nRead N and print 1 + 2 + … + N.');
  fs.writeFileSync(path.join(dir, 'Starter.c'), '#include <stdio.h>\n\nint main(void) {\n    return 0;\n}\n');
  fs.writeFileSync(path.join(dir, 'Solution.c'), LOOP);
  for (const [name, source] of Object.entries({ 'Solution.bonus.no-loops.c': RECURSIVE, 'Solution.bonus.huge-n.c': FORMULA, ...files })) {
    fs.writeFileSync(path.join(dir, name), source);
  }
  return dir;
}

describe('bonus goals', () => {
  it('load with their rules, tests and translations', () => {
    const dir = challengeFolder();
    const en = loadChallenge(dir, 'en');
    assert.deepEqual(en.bonus.map((b) => b.id), ['no-loops', 'huge-n']);
    assert.equal(en.bonus[1].timeLimitMs, 1000);
    assert.equal(en.bonus[0].mustNotContain[0].message, 'No loops.');
    const pt = loadChallenge(dir, 'pt-br');
    assert.deepEqual(pt.bonus.map((b) => b.title), ['Sem laços', 'N enorme']);
    assert.equal(pt.bonus[0].mustNotContain[0].message, 'Sem laços.');
    assert.equal(pt.bonus[0].mustNotContain[0].pattern, '\\b(for|while)\\b', 'the pattern is shared');
  });

  it('are earned by following their rules and passing their tests in time, and explain a miss', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const c = loadChallenge(challengeFolder(), 'en');
    c.bonus[1].tests[0].output = '4500000001500000000\n';
    const write = (source: string) => {
      const file = path.join(tempDir(), 'main.c');
      fs.writeFileSync(file, source);
      return file;
    };
    // The formula earns both goals.
    assert.deepEqual((await evaluateBonuses(c, write(FORMULA))).map((r) => [r.id, r.achieved]), [['no-loops', true], ['huge-n', true]]);
    // The loop breaks the rule, and is too slow for 3 billion.
    const loop = await evaluateBonuses(c, write(LOOP));
    assert.deepEqual(loop.map((r) => r.achieved), [false, false]);
    assert.equal(loop[0].reason, 'No loops.');
    assert.match(loop[1].reason ?? '', /^Too slow: a bonus test took longer than 1 s/);
  });

  it('are checked by the validator, which fills in their expected outputs from the bonus solution', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const dir = challengeFolder();
    const report = await validateChallenges([path.dirname(dir)], { generate: true });
    assert.deepEqual(report.challenges[0].problems, []);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8'));
    assert.equal(meta.bonus[1].tests[0].output, '4500000001500000000\n');
  });

  it('need a reference solution that earns them', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    // The "no loops" solution uses a loop, and the "huge N" one is missing.
    const dir = challengeFolder({ 'Solution.bonus.no-loops.c': LOOP });
    fs.rmSync(path.join(dir, 'Solution.bonus.huge-n.c'));
    const problems = (await validateChallenges([path.dirname(dir)])).challenges[0].problems;
    assert.ok(problems.some((p) => /Solution\.bonus\.no-loops\.c breaks its own bonus rules/.test(p)), problems.join('\n'));
    assert.ok(problems.some((p) => /bonus "huge-n": no Solution\.bonus\.huge-n\.c/.test(p)), problems.join('\n'));
  });
});
