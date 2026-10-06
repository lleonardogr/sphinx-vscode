// A guard for the extension's global state. VS Code keeps an extension's state as one object,
// and replaces its in-memory copy whenever it reports a storage change for the extension (that
// is how several windows stay in sync). When two writes happen close together, the report about
// the first one can arrive after the second and silently undo it: starting an exam saves the
// student's name and then the session, and the session could vanish a moment later.
//
// SafeState remembers each write for a short time. If VS Code's copy goes back to an older value
// in that time, reads still return the newer value and it is written again. After that, reads come
// straight from VS Code's state, so changes made in other windows still show up.
import type * as vscode from 'vscode';
import { isDeepStrictEqual } from 'util';

export class SafeState implements vscode.Memento {
  private readonly recent = new Map<string, { value: unknown; at: number }>();

  constructor(
    private readonly memento: vscode.Memento,
    private readonly windowMs = 10_000,
    private readonly now: () => number = Date.now,
  ) {}

  keys(): readonly string[] {
    return this.memento.keys();
  }

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  get<T>(key: string, defaultValue?: T): T | undefined {
    this.heal();
    const r = this.recent.get(key);
    if (r) {
      return r.value === undefined ? defaultValue : (r.value as T);
    }
    return this.memento.get<T>(key, defaultValue as T);
  }

  update(key: string, value: unknown): Thenable<void> {
    this.recent.set(key, { value, at: this.now() });
    return this.memento.update(key, value);
  }

  /** Rewrites recent values that VS Code's copy lost, and forgets the ones old enough to trust. */
  private heal(): void {
    const now = this.now();
    for (const [key, r] of this.recent) {
      if (now - r.at > this.windowMs) {
        this.recent.delete(key);
      } else if (!isDeepStrictEqual(this.memento.get(key), r.value)) {
        void this.memento.update(key, r.value);
      }
    }
  }
}
