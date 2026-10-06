import { strict as assert } from 'assert';
import { describe, it } from 'node:test';
import type * as vscode from 'vscode';
import { SafeState } from '../../safeState';

/** Behaves like VS Code's memento, including replacing everything when a storage change arrives. */
class FakeMemento implements vscode.Memento {
  value: Record<string, unknown> = {};
  writes = 0;
  keys() {
    return Object.keys(this.value);
  }
  get<T>(key: string, defaultValue?: T): T {
    return (key in this.value ? this.value[key] : defaultValue) as T;
  }
  update(key: string, v: unknown) {
    this.value = { ...this.value, [key]: v };
    this.writes++;
    return Promise.resolve();
  }
  /** A late report of an older state arrives and replaces the in-memory copy. */
  revertTo(old: Record<string, unknown>) {
    this.value = { ...old };
  }
}

describe('SafeState', () => {
  it('reads and writes through to the memento', async () => {
    const m = new FakeMemento();
    const s = new SafeState(m);
    await s.update('a', 1);
    assert.equal(s.get('a'), 1);
    assert.equal(m.value.a, 1);
    assert.equal(s.get('missing', 'fallback'), 'fallback');
  });

  it('keeps a recent write when VS Code reverts to an older copy, and writes it again', async () => {
    let t = 0;
    const m = new FakeMemento();
    const s = new SafeState(m, 10_000, () => t);
    await s.update('studentName', 'Ana');
    const beforeExam = { ...m.value };
    await s.update('exams', { 'exam-1': { startedAt: 1 } });
    m.revertTo(beforeExam); // the report about the first write arrives late
    assert.deepEqual(s.get('exams', {}), { 'exam-1': { startedAt: 1 } });
    assert.deepEqual(m.value.exams, { 'exam-1': { startedAt: 1 } }, 'the lost value is written back');
  });

  it('trusts the memento again after the window, so other windows\' changes show up', async () => {
    let t = 0;
    const m = new FakeMemento();
    const s = new SafeState(m, 10_000, () => t);
    await s.update('progress', { a: 1 });
    t = 11_000;
    m.revertTo({ progress: { a: 1, b: 2 } }); // another window solved b
    assert.deepEqual(s.get('progress'), { a: 1, b: 2 });
  });

  it('remembers deletions too', async () => {
    let t = 0;
    const m = new FakeMemento();
    const s = new SafeState(m, 10_000, () => t);
    await s.update('progress', { a: 1 });
    const before = { ...m.value };
    await s.update('progress', undefined);
    m.revertTo(before);
    assert.equal(s.get('progress', 'none'), 'none');
  });
});
