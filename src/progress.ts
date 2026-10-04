import * as vscode from 'vscode';

export interface ChallengeProgress {
  status: 'attempted' | 'solved';
  attempts: number;
  solvedAt?: string;
}

const KEY = 'sphynx.progress';

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
    };
    await this.state.update(KEY, all);
    this.changed.fire();
  }

  async reset(): Promise<void> {
    await this.state.update(KEY, undefined);
    this.changed.fire();
  }
}
