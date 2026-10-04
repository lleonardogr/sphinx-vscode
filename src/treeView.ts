import * as vscode from 'vscode';
import { Challenge } from './challenges';
import { Progress } from './progress';
import { TestManager, formatDuration } from './testSession';
import { TestDefinition, TestQuestion, maxScore } from './tests';

export type ChallengeNode =
  | { kind: 'topic'; topic: string }
  | { kind: 'challenge'; challenge: Challenge }
  | { kind: 'testsRoot' }
  | { kind: 'test'; test: TestDefinition }
  | { kind: 'testStart'; test: TestDefinition }
  | { kind: 'testQuestion'; test: TestDefinition; question: TestQuestion };

const TOPIC_ICONS: Record<string, string> = {
  Variables: 'symbol-variable',
  Conditionals: 'git-compare',
  Loops: 'sync',
  'Data Structures': 'symbol-array',
  Strings: 'symbol-string',
  Methods: 'symbol-method',
  OOP: 'symbol-class',
  Streams: 'filter',
  Custom: 'star-empty',
};

export class ChallengeTreeProvider implements vscode.TreeDataProvider<ChallengeNode> {
  private readonly changed = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.changed.event;

  constructor(
    private readonly getChallenges: () => Challenge[],
    private readonly progress: Progress,
    private readonly getTests: () => TestDefinition[],
    private readonly tests: TestManager,
  ) {
    progress.onDidChange(() => this.refresh());
    tests.onDidChange(() => this.refresh());
  }

  refresh(): void {
    this.changed.fire();
  }

  getChildren(node?: ChallengeNode): ChallengeNode[] {
    const all = this.getChallenges();
    if (!node) {
      const topics: ChallengeNode[] = [...new Set(all.map((c) => c.topic))].map((topic) => ({ kind: 'topic', topic }));
      return this.getTests().length ? [{ kind: 'testsRoot' }, ...topics] : topics;
    }
    switch (node.kind) {
      case 'topic':
        return all.filter((c) => c.topic === node.topic).map((challenge) => ({ kind: 'challenge', challenge }));
      case 'testsRoot':
        return this.getTests().map((test) => ({ kind: 'test', test }));
      case 'test':
        return this.tests.state(node.test.id)
          ? node.test.questions.map((question) => ({ kind: 'testQuestion', test: node.test, question }))
          : [{ kind: 'testStart', test: node.test }];
      default:
        return [];
    }
  }

  getTreeItem(node: ChallengeNode): vscode.TreeItem {
    switch (node.kind) {
      case 'topic':
        return this.topicItem(node.topic);
      case 'challenge':
        return this.challengeItem(node.challenge);
      case 'testsRoot': {
        const item = new vscode.TreeItem('Tests', vscode.TreeItemCollapsibleState.Expanded);
        item.id = 'tests';
        item.iconPath = new vscode.ThemeIcon('checklist');
        item.description = `${this.getTests().length}`;
        return item;
      }
      case 'test':
        return this.testItem(node.test);
      case 'testStart': {
        const item = new vscode.TreeItem('Start test…', vscode.TreeItemCollapsibleState.None);
        item.id = `test-start:${node.test.id}`;
        item.iconPath = new vscode.ThemeIcon('play');
        item.command = { command: 'techChallenges.startTest', title: 'Start Test', arguments: [node.test.id] };
        return item;
      }
      case 'testQuestion':
        return this.questionItem(node.test, node.question);
    }
  }

  private topicItem(topic: string): vscode.TreeItem {
    const ids = this.getChallenges()
      .filter((c) => c.topic === topic)
      .map((c) => c.id);
    const solved = this.progress.solvedCount(ids);
    const item = new vscode.TreeItem(topic, vscode.TreeItemCollapsibleState.Expanded);
    item.id = `topic:${topic}`;
    item.description = `${solved}/${ids.length}`;
    item.iconPath = new vscode.ThemeIcon(
      solved === ids.length ? 'pass-filled' : TOPIC_ICONS[topic] ?? 'folder',
      solved === ids.length ? new vscode.ThemeColor('testing.iconPassed') : undefined,
    );
    return item;
  }

  private challengeItem(c: Challenge): vscode.TreeItem {
    const p = this.progress.get(c.id);
    const item = new vscode.TreeItem(c.title, vscode.TreeItemCollapsibleState.None);
    item.id = `challenge:${c.id}`;
    item.description = c.difficulty;
    item.contextValue = 'challenge';
    item.command = { command: 'techChallenges.open', title: 'Open Challenge', arguments: [c.id] };
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

  private testItem(test: TestDefinition): vscode.TreeItem {
    const s = this.tests.state(test.id);
    const item = new vscode.TreeItem(test.title, s ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed);
    item.id = `test:${test.id}`;
    const mode = test.mode === 'closed' ? 'closed' : 'open';
    if (!s) {
      item.description = `${test.durationMinutes} min · ${mode}`;
      item.iconPath = new vscode.ThemeIcon(test.mode === 'closed' ? 'lock' : 'unlock');
      item.contextValue = 'test-notStarted';
    } else if (!s.finishedAt) {
      item.description = `${formatDuration(s.endsAt - Date.now())} left · ${this.tests.formatScore(test)}`;
      item.iconPath = new vscode.ThemeIcon('watch', new vscode.ThemeColor('testing.iconQueued'));
      item.contextValue = 'test-active';
    } else {
      item.description = `✓ ${this.tests.formatScore(test)}`;
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
      item.contextValue = 'test-finished';
    }
    item.tooltip = new vscode.MarkdownString(
      `**${test.title}**\n\n${test.description ? `${test.description}\n\n` : ''}` +
        `- ${test.durationMinutes} minutes, ${test.questions.length} questions, ${maxScore(test)} points\n` +
        `- ${test.maxSubmissions} submission(s) per question\n` +
        `- ${test.mode === 'closed' ? 'Closed: no hints or AI hints; pastes and time outside VS Code are recorded' : 'Open: hints, AI and the internet allowed'}`,
    );
    return item;
  }

  private questionItem(test: TestDefinition, q: TestQuestion): vscode.TreeItem {
    const qs = this.tests.state(test.id)?.questions[q.id];
    const item = new vscode.TreeItem(q.challenge.title, vscode.TreeItemCollapsibleState.None);
    item.id = `test-question:${test.id}:${q.id}`;
    const left = this.tests.submissionsLeft(test, q.id);
    item.description = `${qs?.bestEarned ?? 0}/${q.points} pts · ${left} submission${left === 1 ? '' : 's'} left`;
    item.command = { command: 'techChallenges.open', title: 'Open Question', arguments: [q.challenge.id] };
    if (!qs?.submissions) {
      item.iconPath = new vscode.ThemeIcon('circle-large-outline');
    } else if (qs.bestEarned >= q.points) {
      item.iconPath = new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'));
    } else if (qs.bestEarned > 0) {
      item.iconPath = new vscode.ThemeIcon('circle-large-filled', new vscode.ThemeColor('testing.iconQueued'));
    } else {
      item.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
    }
    return item;
  }
}
