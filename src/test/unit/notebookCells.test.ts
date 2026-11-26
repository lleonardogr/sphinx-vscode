import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
import { findCCompiler } from '../../cRunner';
import { cellChallenge, cellProgram, isSharedCell, lessonNotebooks, notebookProblems, readNotebook } from '../../notebookCells';
import { javaVersion, tempDir } from './helpers';

const cell = (kind: 'code' | 'markdown', text: string) =>
  kind === 'code'
    ? { cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: text.split(/(?<=\n)/) }
    : { cell_type: 'markdown', metadata: {}, source: [text] };

function writeNotebook(dir: string, name: string, cells: object[]): string {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify({ cells, metadata: { language_info: { name: 'java' } }, nbformat: 4, nbformat_minor: 5 }));
  return file;
}

describe('notebook lesson cells', () => {
  it('know challenge cells and shared cells by their first line', () => {
    assert.equal(cellChallenge('// sphinx: challenge repeated-tickets\nvoid main() {}'), 'repeated-tickets');
    assert.equal(cellChallenge('IO.println(1);\n// sphinx: challenge x'), undefined, 'only the first line counts');
    assert.ok(isSharedCell('// shared: helpers\nint twice(int x) { return 2 * x; }'));
    assert.ok(isSharedCell('// compartilhado\nint f() { return 1; }'));
    assert.ok(!isSharedCell('IO.println("shared");'));
  });

  it('turn a cell into a program, after the shared cells, and know where its own lines start', () => {
    const statements = cellProgram(['int twice(int x) {\n    return 2 * x;\n}'], 'IO.println(twice(21));', false);
    assert.match(statements.source, /^int twice[\s\S]*void main\(\) \{\n {4}IO\.println\(twice\(21\)\);\n\}/);
    assert.equal(statements.source.split('\n')[statements.firstLine - 1].trim(), 'IO.println(twice(21));');
    const whole = cellProgram([], 'void main() {\n    IO.println(1);\n}', false);
    assert.equal(whole.firstLine, 1);
    const shared = cellProgram([], '// shared\nint one() { return 1; }', true);
    assert.match(shared.source, /void main\(\) \{\n\}\n$/, 'a shared cell compiles with an empty main');
  });

  it('turn a C cell into a C program, with the usual headers and int main(void)', () => {
    const statements = cellProgram(['// shared\nint twice(int x) { return 2 * x; }'], 'printf("%d\\n", twice(21));', false, 'c');
    assert.match(statements.source, /^#include <stdio\.h>[\s\S]*int twice[\s\S]*int main\(void\) \{\n {4}printf[\s\S]*return 0;\n\}\n$/);
    assert.equal(statements.source.split('\n')[statements.firstLine - 1].trim(), 'printf("%d\\n", twice(21));');
    const whole = cellProgram([], 'int main(void) {\n    return 0;\n}', false, 'c');
    assert.equal(whole.source.split('\n')[whole.firstLine - 1], 'int main(void) {');
  });

  it('read notebooks and find a lesson\'s translations', () => {
    const dir = tempDir();
    writeNotebook(dir, 'lesson.ipynb', [cell('markdown', '# Hi'), cell('code', 'IO.println(1);\n')]);
    writeNotebook(dir, 'lesson.pt-br.ipynb', [cell('markdown', '# Oi')]);
    fs.writeFileSync(path.join(dir, 'notes.ipynb'), '{}');
    assert.deepEqual(lessonNotebooks(dir).map((f) => path.basename(f)), ['lesson.ipynb', 'lesson.pt-br.ipynb']);
    assert.deepEqual(readNotebook(path.join(dir, 'lesson.ipynb')), [{ kind: 'markdown', source: '# Hi', language: 'java' }, { kind: 'code', source: 'IO.println(1);\n', language: 'java' }]);
    assert.throws(() => readNotebook(path.join(dir, 'notes.ipynb')), /not a notebook/);
    fs.writeFileSync(path.join(dir, 'bad.ipynb'), JSON.stringify({ cells: [{ cell_type: 'code', source: 42 }] }));
    assert.throws(() => readNotebook(path.join(dir, 'bad.ipynb')), /cell 1: "source" must be text/);
  });

  it('are checked by the validator: cells must run, and challenge cells must name a Java challenge', async (t) => {
    const version = await javaVersion;
    const dir = tempDir();
    writeNotebook(dir, 'lesson.ipynb', [
      cell('code', '// shared\nint twice(int x) {\n    return 2 * x;\n}\n'),
      cell('code', 'IO.println(twice(21));\n'),
      cell('code', 'IO.println(missing);\n'),
      cell('code', '// sphinx: challenge known\nvoid main() {}\n'),
      cell('code', '// sphinx: challenge unknown\nvoid main() {}\n'),
      cell('code', '// sphinx: challenge in-c\nint main(void) { return 0; }\n'),
    ]);
    const languages: Record<string, string> = { known: 'java', 'in-c': 'c' };
    const { problems, cellsRun } = await notebookProblems(dir, version, (id) => languages[id]);
    assert.ok(problems.some((p) => /no challenge called "unknown"/.test(p)), problems.join('\n'));
    assert.ok(problems.some((p) => /"in-c" is a c challenge, but the cell is java/.test(p)), problems.join('\n'));
    if (version === undefined || version < 25) return t.skip('running cells needs JDK 25');
    assert.equal(cellsRun, 3);
    assert.ok(problems.some((p) => /cell 3 does not compile/.test(p)), problems.join('\n'));
    assert.ok(!problems.some((p) => /cell [12] /.test(p)), 'the shared cell and the cell using it run');
  });

  it('run C cells in C notebooks, and report compiler warnings', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const dir = tempDir();
    const cCell = (text: string) => ({ cell_type: 'code', execution_count: null, metadata: { vscode: { languageId: 'c' } }, outputs: [], source: [text] });
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'lesson.ipynb'), JSON.stringify({
      cells: [cCell('printf("%d\\n", 6 * 7);\n'), cCell('int unused = 3;\nprintf("x\\n");\n'), cCell('// sphinx: challenge in-c\nint main(void) { return 0; }\n')],
      metadata: { language_info: { name: 'c' } }, nbformat: 4, nbformat_minor: 5,
    }));
    const { problems, cellsRun } = await notebookProblems(dir, undefined, (id) => (id === 'in-c' ? 'c' : undefined));
    assert.equal(cellsRun, 2, 'C cells run without a JDK');
    assert.ok(problems.some((p) => /cell 2 compiles with warnings/.test(p)), problems.join('\n'));
    assert.ok(!problems.some((p) => /cell [13]\b/.test(p)), problems.join('\n'));
  });

  it('run each exercise\'s hidden answer: it must print ✓ and no ✗, while the starter may have warnings', async (t) => {
    if (!(await findCCompiler())) return t.skip('no C compiler on this machine');
    const dir = tempDir();
    const exercise = (starter: string, solution: string) => ({
      cell_type: 'code', execution_count: null, metadata: { vscode: { languageId: 'c' }, sphinx: { solution } }, outputs: [], source: [starter],
    });
    const check = '// shared\nvoid check(int ok) {\n    printf(ok ? "✓\\n" : "✗\\n");\n}\n';
    const starter = 'int twice(int n) {\n    // TODO\n    return 0;\n}\n\nint main(void) {\n    check(twice(2) == 4);\n    return 0;\n}\n';
    const answer = (body: string) => `int twice(int n) {\n    ${body}\n}\n\nint main(void) {\n    check(twice(2) == 4);\n    return 0;\n}\n`;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'lesson.ipynb'), JSON.stringify({
      cells: [
        { cell_type: 'code', execution_count: null, metadata: { vscode: { languageId: 'c' } }, outputs: [], source: [check] },
        exercise(starter, answer('return n * 2;')),
        exercise(starter, answer('return n + 1;')),
        exercise(starter, answer('int unused = 1;\n    return n * 2;')),
      ],
      metadata: { language_info: { name: 'c' } }, nbformat: 4, nbformat_minor: 5,
    }));
    const { problems, cellsRun } = await notebookProblems(dir, undefined, () => undefined);
    assert.equal(cellsRun, 7, 'the shared cell, three starters and three answers');
    assert.ok(!problems.some((p) => /cell 2\b/.test(p)), `a right answer passes, and its starter's warning is allowed:\n${problems.join('\n')}`);
    assert.ok(problems.some((p) => /cell 3: the exercise's answer fails its checks/.test(p)), problems.join('\n'));
    assert.ok(problems.some((p) => /cell 4: the exercise's answer doesn't run cleanly/.test(p)), problems.join('\n'));
  });
});
