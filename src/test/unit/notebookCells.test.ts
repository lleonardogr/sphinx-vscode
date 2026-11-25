import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'node:test';
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

  it('read notebooks and find a lesson\'s translations', () => {
    const dir = tempDir();
    writeNotebook(dir, 'lesson.ipynb', [cell('markdown', '# Hi'), cell('code', 'IO.println(1);\n')]);
    writeNotebook(dir, 'lesson.pt-br.ipynb', [cell('markdown', '# Oi')]);
    fs.writeFileSync(path.join(dir, 'notes.ipynb'), '{}');
    assert.deepEqual(lessonNotebooks(dir).map((f) => path.basename(f)), ['lesson.ipynb', 'lesson.pt-br.ipynb']);
    assert.deepEqual(readNotebook(path.join(dir, 'lesson.ipynb')), [{ kind: 'markdown', source: '# Hi' }, { kind: 'code', source: 'IO.println(1);\n' }]);
    assert.throws(() => readNotebook(path.join(dir, 'notes.ipynb')), /not a notebook/);
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
    assert.ok(problems.some((p) => /"in-c" is a c challenge/.test(p)), problems.join('\n'));
    if (version === undefined || version < 25) return t.skip('running cells needs JDK 25');
    assert.equal(cellsRun, 3);
    assert.ok(problems.some((p) => /cell 3 does not compile/.test(p)), problems.join('\n'));
    assert.ok(!problems.some((p) => /cell [12] /.test(p)), 'the shared cell and the cell using it run');
  });
});
