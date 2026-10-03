import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';

export type ChallengeNode = { kind: 'topic'; topic: string } | { kind: 'challenge'; challenge: Challenge };

const TOPIC_ICONS: Record<string, string> = {
  Variables: 'symbol-variable',
  Conditionals: 'git-compare',
  Loops: 'sync',
  Arrays: 'symbol-array',
  Strings: 'symbol-string',
  Methods: 'symbol-method',
};

export class ChallengeTreeProvider implements vscode.TreeDataProvider<ChallengeNode> {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changed.event;

  constructor(
    private readonly getChallenges: () => Challenge[],
    private readonly progress: Progress,
  ) {
    progress.onDidChange(() => this.refresh());
  }

  refresh(): void {
    this.changed.fire();
  }

  getChildren(node?: ChallengeNode): ChallengeNode[] {
    const all = this.getChallenges();
    if (!node) {
      return [...new Set(all.map((c) => c.topic))].map((topic) => ({ kind: 'topic', topic }));
    }
    if (node.kind === 'topic') {
      return all.filter((c) => c.topic === node.topic).map((challenge) => ({ kind: 'challenge', challenge }));
    }
    return [];
  }

  getTreeItem(node: ChallengeNode): vscode.TreeItem {
    if (node.kind === 'topic') {
      const ids = this.getChallenges()
        .filter((c) => c.topic === node.topic)
        .map((c) => c.id);
      const solved = this.progress.solvedCount(ids);
      const item = new vscode.TreeItem(node.topic, vscode.TreeItemCollapsibleState.Expanded);
      item.id = `topic:${node.topic}`;
      item.description = `${solved}/${ids.length}`;
      item.iconPath = new vscode.ThemeIcon(
        solved === ids.length ? 'pass-filled' : TOPIC_ICONS[node.topic] ?? 'folder',
        solved === ids.length ? new vscode.ThemeColor('testing.iconPassed') : undefined,
      );
      return item;
    }

    const c = node.challenge;
    const p = this.progress.get(c.id);
    const item = new vscode.TreeItem(c.title, vscode.TreeItemCollapsibleState.None);
    item.id = `challenge:${c.id}`;
    item.description = c.difficulty;
    item.contextValue = 'challenge';
    item.command = { command: 'javaChallenges.open', title: 'Open Challenge', arguments: [c.id] };
    if (p?.status === 'solved') {
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
    } else if (p?.status === 'attempted') {
      item.iconPath = new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    } else {
      item.iconPath = new vscode.ThemeIcon('circle-large-outline');
    }
    item.tooltip = new vscode.MarkdownString(
      `**${c.title}** · ${c.topic} · ${c.difficulty}\n\n` +
        (p?.status === 'solved' ? '✅ Solved' : p ? `Attempts: ${p.attempts}` : 'Not started'),
    );
    return item;
  }
}
