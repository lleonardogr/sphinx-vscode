import * as vscode from 'vscode';

export interface ChallengeProgress {
  status: 'attempted' | 'solved';
  attempts: number;
  solvedAt?: string;
  /** The bonus goals earned (their ids); once earned, a goal stays earned. */
  bonus?: string[];
}

const KEY = 'sphinx.progress';

export class Progress {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChange = this.changed.event;

  constructor(private readonly state: vscode.Memento) {}

  private all(): Record<string, ChallengeProgress> {
    return this.state.get<Record<string, ChallengeProgress>>(KEY, {});
  }

  get(id: string): ChallengeProgress | undefined {
    return this.all()[id];
  }

  isSolved(id: string): boolean {
    return this.get(id)?.status === 'solved';
  }

  solvedCount(ids: string[]): number {
    return ids.filter((id) => this.isSolved(id)).length;
  }

  async recordAttempt(id: string, solved: boolean): Promise<void> {
    const all = { ...this.all() };
    const prev = all[id];
    const wasSolved = prev?.status === 'solved';
    all[id] = {
      status: wasSolved || solved ? 'solved' : 'attempted',
      attempts: (prev?.attempts ?? 0) + 1,
      solvedAt: prev?.solvedAt ?? (solved ? new Date().toISOString() : undefined),
      ...(prev?.bonus?.length ? { bonus: prev.bonus } : {}),
    };
    await this.state.update(KEY, all);
    this.changed.fire();
  }

  /** The bonus goals earned on a challenge. */
  bonusEarned(id: string): string[] {
    return this.get(id)?.bonus ?? [];
  }

  /** Bonus goals earned in `ids`, out of the bonus goals they have. */
  bonusCount(challenges: { id: string; bonus: { id: string }[] }[]): { earned: number; total: number } {
    let earned = 0;
    let total = 0;
    for (const c of challenges) {
      const have = new Set(this.bonusEarned(c.id));
      total += c.bonus.length;
      earned += c.bonus.filter((b) => have.has(b.id)).length;
    }
    return { earned, total };
  }

  /** Adds bonus goals earned on a challenge; returns the ones that are new. */
  async recordBonus(id: string, earned: string[]): Promise<string[]> {
    const all = { ...this.all() };
    const prev = all[id];
    const had = new Set(prev?.bonus ?? []);
    const fresh = earned.filter((b) => !had.has(b));
    if (!fresh.length || !prev) {
      return [];
    }
    all[id] = { ...prev, bonus: [...had, ...fresh] };
    await this.state.update(KEY, all);
    this.changed.fire();
    return fresh;
  }

  /** Forgets one challenge's status, attempts and bonus goals. */
  async clear(id: string): Promise<void> {
    const all = { ...this.all() };
    if (id in all) {
      delete all[id];
      await this.state.update(KEY, all);
      this.changed.fire();
    }
  }

  async reset(): Promise<void> {
    await this.state.update(KEY, undefined);
    this.changed.fire();
  }
}
