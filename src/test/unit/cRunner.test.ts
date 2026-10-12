import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { compilerCandidates, explainCrash, findCCompiler, parseCompilerOutput } from '../../cRunner';
import { RunOutcome, runChallengeCode } from '../../runner';
import { codeFileName, loadChallenge } from '../../challenges';
import { validateChallenges } from '../../validator';
import { tempDir } from './helpers';

/** Runs `source` as a student's main.c against the tests. */
async function runC(source: string, tests: { input: string; output: string }[], rules: Partial<{ mustContain: { pattern: string; message: string }[]; mustNotContain: { pattern: string; message: string }[] }> = {}): Promise<RunOutcome> {
  const file = path.join(tempDir(), 'main.c');
  fs.writeFileSync(file, source);
  return runChallengeCode({ file, tests, ...rules });
}

const SUM = '#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}\n';

describe('C: compiler messages and crashes', () => {
  it('reads gcc and clang errors and warnings for the student file only', () => {
    const gcc = [
      "main.c: In function 'main':",
      "main.c:5:5: error: expected ',' or ';' before 'printf'",
      "    5 |     printf(\"%d\\n\", totl);",
      "main.c:5:13: warning: format '%d' expects argument of type 'int *', but argument 2 has type 'int' [-Wformat=]",
      'other.h:3:1: error: not the student file',
    ].join('\n');
    assert.deepEqual(parseCompilerOutput(gcc, 'main.c'), {
      errors: [{ line: 5, column: 4, message: "expected ',' or ';' before 'printf'" }],
      warnings: [{ line: 5, column: 12, message: "format '%d' expects argument of type 'int *', but argument 2 has type 'int' [-Wformat=]" }],
    });
    const clang = "D:\\class\\sphinx\\sum\\main.c:4:18: error: expected ';' at end of declaration";
    assert.deepEqual(parseCompilerOutput(clang, 'main.c').errors, [{ line: 4, column: 17, message: "expected ';' at end of declaration" }]);
  });

  it('explains AddressSanitizer reports with the line, and where the memory was allocated or freed', () => {
    // From llvm-mingw on Windows (the spike), with forward-slash Windows paths.
    const heap = `=================================================================
==7676==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x1280c53a0024 at pc 0x7ff732d515c9 bp 0x00e23c19f9d0 sp 0x00e23c19fa18
WRITE of size 4 at 0x1280c53a0024 thread T0
    #0 0x7ff732d515c8 in main D:/a/sphinx-vscode/spike/c/main.c:8:20
    #1 0x7ff732d5110c in __tmainCRTStartup /home/runner/work/llvm-mingw/crt/crtexe.c:271:11

0x1280c53a0024 is located 0 bytes after 20-byte region [0x1280c53a0010,0x1280c53a0024)
allocated by thread T0 here:
    #0 0x7ffb6177d971 in malloc /home/runner/work/llvm-mingw/llvm-project/compiler-rt/lib/asan/asan_malloc_win.cpp:87:3
    #1 0x7ff732d514b5 in main D:/a/sphinx-vscode/spike/c/main.c:6:20

SUMMARY: AddressSanitizer: heap-buffer-overflow D:/a/sphinx-vscode/spike/c/main.c:8:20 in main`;
    assert.equal(explainCrash(heap, 1, null), 'Line 8: your program went past the end of memory from malloc (allocated at line 6).');

    const uaf = `==8596==ERROR: AddressSanitizer: heap-use-after-free on address 0x11d1a2aa0030 at pc 0x7ff6bcaa1523
READ of size 1 at 0x11d1a2aa0030 thread T0
    #0 0x7ff6bcaa1522 in main main.c:9:20

freed by thread T0 here:
    #0 0x7ffb6177d861 in free asan_malloc_win.cpp:78:3
    #1 0x7ff6bcaa14c2 in main main.c:8:5

previously allocated by thread T0 here:
    #0 0x7ffb6177d971 in malloc asan_malloc_win.cpp:87:3
    #1 0x7ff6bcaa14a5 in main main.c:6:18

SUMMARY: AddressSanitizer: heap-use-after-free main.c:9:20 in main`;
    assert.equal(explainCrash(uaf, 1, null), 'Line 9: your program used memory after freeing it (freed at line 8).');

    const nullDeref = '==1==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000 (pc 0x0001)\n    #0 0x1 in main /Users/ana/sphinx/null/main.c:6:20\nSUMMARY: AddressSanitizer: SEGV /Users/ana/sphinx/null/main.c:6:20 in main';
    assert.equal(explainCrash(nullDeref, 1, null), 'Line 6: your program used a NULL pointer.');
    assert.match(explainCrash('==1==ERROR: AddressSanitizer: stack-overflow on address 0x7ff\n    #0 0x1 in depth main.c:3:12\nSUMMARY: AddressSanitizer: stack-overflow main.c:3:12 in depth', 1, null)!, /^Line 3: the stack overflowed/);
  });

  it('explains UndefinedBehaviorSanitizer reports', () => {
    assert.equal(
      explainCrash("main.c:8:9: runtime error: index 5 out of bounds for type 'int[5]'\nSUMMARY: UndefinedBehaviorSanitizer: undefined-behavior main.c:8:9", 1, null),
      "Line 8: an index past the end of an array (index 5 out of bounds for type 'int[5]').",
    );
    assert.match(explainCrash("main.c:6:22: runtime error: signed integer overflow: 2147483647 + 1 cannot be represented in type 'int'", 1, null)!, /^Line 6: the result doesn't fit in its type/);
  });

  it('explains plain crashes from the exit code or signal, on every system', () => {
    assert.match(explainCrash('', null, 'SIGSEGV')!, /invalid memory access/);
    assert.match(explainCrash('', 3221225477, null)!, /invalid memory access/, 'Windows access violation');
    assert.match(explainCrash('', 3221225725, null)!, /stack overflowed/, 'Windows stack overflow');
    assert.match(explainCrash('', 3221225620, null)!, /division by zero/, 'Windows division by zero');
    assert.equal(explainCrash('', 0, null), undefined);
    assert.equal(explainCrash('some output on stderr', 2, null), undefined, 'an ordinary non-zero exit is not a crash');
  });

  it('looks in the sphinx.c.compiler setting, then portable folders, then the PATH', () => {
    const dir = tempDir();
    const bin = (name: string) => path.join(dir, 'bin', process.platform === 'win32' ? `${name}.exe` : name);
    const list = compilerCandidates(dir, ['/portable']);
    assert.deepEqual(list.slice(0, 3), [bin('clang'), bin('gcc'), bin('cc')]);
    assert.equal(list[3], path.join('/portable', 'bin', process.platform === 'win32' ? 'clang.exe' : 'clang'));
    assert.deepEqual(compilerCandidates('/opt/tools/gcc-14').slice(0, 1), ['/opt/tools/gcc-14']);
  });
});

describe('C: compiling and running main.c', () => {
  it('passes a correct program, and checks the rules on C code', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const ok = await runC(SUM, [{ input: '2 3\n', output: '5\n' }, { input: '-4 4\n', output: '0\n' }]);
    assert.equal(ok.kind, 'tests');
    assert.deepEqual(ok.kind === 'tests' && ok.results.map((r) => r.passed), [true, true]);
    const rule = await runC(SUM, [], { mustNotContain: [{ pattern: '\\bscanf\\b', message: 'Read with fgets.' }] });
    assert.deepEqual(rule, { kind: 'ruleViolation', messages: ['Read with fgets.'] });
  });

  it('reports compile errors with their line, and keeps warnings with the results', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const broken = await runC('#include <stdio.h>\n\nint main(void) {\n    int total = 0\n    printf("%d\\n", total);\n    return 0;\n}\n', []);
    assert.equal(broken.kind, 'compileError');
    assert.ok(broken.kind === 'compileError' && broken.errors.length && [4, 5].includes(broken.errors[0].line), JSON.stringify(broken));
    const amp = await runC('#include <stdio.h>\n\nint main(void) {\n    int x = 0;\n    scanf("%d", &x);\n    long big = x;\n    printf("%d\\n", big);\n    return 0;\n}\n', [{ input: '7\n', output: '7\n' }]);
    assert.equal(amp.kind, 'tests');
    assert.ok(amp.kind === 'tests' && amp.warnings?.some((w) => w.line === 7 && /format/.test(w.message)), JSON.stringify(amp));
  });

  it('explains memory errors with the line when the compiler has memory checks', async (t) => {
    const cc = await findCCompiler();
    if (!cc) return t.skip('no C compiler on this machine');
    if (!cc.sanitizers) return t.skip(`${cc.version} has no memory checks`);
    const heap = await runC('#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 5;\n    int *squares = malloc(n * sizeof *squares);\n    for (int i = 0; i <= n; i++) {\n        squares[i] = i * i;\n    }\n    printf("%d\\n", squares[0]);\n    free(squares);\n    return 0;\n}\n', [{ input: '', output: '0\n' }]);
    assert.ok(heap.kind === 'tests' && !heap.results[0].passed, 'a memory error fails the test, even with the right output');
    assert.equal(heap.kind === 'tests' && heap.results[0].crash, 'Line 8: your program went past the end of memory from malloc (allocated at line 6).');
    const array = await runC('#include <stdio.h>\n\nint main(void) {\n    int marks[5];\n    int n;\n    scanf("%d", &n);\n    for (int i = 0; i <= n; i++) {\n        marks[i] = i * 10;\n    }\n    printf("%d\\n", marks[2]);\n    return 0;\n}\n', [{ input: '5\n', output: '20\n' }]);
    assert.match(array.kind === 'tests' ? array.results[0].crash ?? '' : '', /^Line 8: /);
  });
});

describe('C: challenge folders', () => {
  /** A C challenge folder: the sum of two numbers, with a starter and a reference solution. */
  function cChallenge(solution = SUM): string {
    const dir = path.join(tempDir(), 'sum-two');
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, 'challenge.json'),
      JSON.stringify({ title: 'Sum Two', difficulty: 'Easy', tests: [{ input: '2 3\n', output: '' }, { input: '10 -4\n', output: '' }, { input: '0 0\n', output: '', hidden: true }] }),
    );
    fs.writeFileSync(path.join(dir, 'description.md'), '# Sum Two\n\nRead two whole numbers and print their sum.');
    fs.writeFileSync(path.join(dir, 'Starter.c'), '#include <stdio.h>\n\nint main(void) {\n    // TODO: read two numbers and print their sum\n    return 0;\n}\n');
    fs.writeFileSync(path.join(dir, 'Solution.c'), solution);
    return dir;
  }

  it('is a C challenge when it has a C starter, and its code file is main.c', () => {
    const c = loadChallenge(cChallenge());
    assert.equal(c.language, 'c');
    assert.equal(codeFileName(c.language), 'main.c');
    assert.match(c.starterCode, /int main\(void\)/);
    assert.equal(c.starterCodeClassic, c.starterCode, 'C has one starter style');
  });

  it('validates the starter and the solution, and fills in the expected outputs', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const dir = cChallenge();
    const report = await validateChallenges([path.dirname(dir)], { generate: true });
    assert.deepEqual(report.challenges[0].problems, []);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8')).tests.map((x: { output: string }) => x.output), ['5\n', '6\n', '0\n']);
  });

  it('reports a solution with a memory error, with the explanation', async (t) => {
    const cc = await findCCompiler();
    if (!cc?.sanitizers) return t.skip('no C compiler with memory checks on this machine');
    const leaky = '#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    int seen[1];\n    scanf("%d %d", &a, &b);\n    seen[1] = a;\n    printf("%d\\n", a + b);\n    return 0;\n}\n';
    const dir = cChallenge(leaky);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'challenge.json'), 'utf8'));
    meta.tests.forEach((x: { output: string }, i: number) => (x.output = ['5\n', '6\n', '0\n'][i]));
    fs.writeFileSync(path.join(dir, 'challenge.json'), JSON.stringify(meta));
    const report = await validateChallenges([path.dirname(dir)]);
    assert.ok(report.challenges[0].problems.some((p) => /Solution\.c: test 1 crashed: Line 7: /.test(p)), report.challenges[0].problems.join('\n'));
  });
});
