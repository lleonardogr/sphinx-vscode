// A tiny test runner for the extension host: tests run one after another, sharing one VS Code
// window (and its state), and failures are reported at the end.
import * as vscode from 'vscode';

type Test = { name: string; fn: () => Promise<void> | void };
const tests: Test[] = [];

export function test(name: string, fn: Test['fn']): void {
  tests.push({ name, fn });
}

export async function runAll(): Promise<void> {
  const failures: string[] = [];
  for (const t of tests) {
    const start = Date.now();
    try {
      await t.fn();
      console.log(`  ✔ ${t.name} (${Date.now() - start} ms)`);
    } catch (e) {
      const message = e instanceof Error ? (e.stack ?? e.message) : String(e);
      console.log(`  ✖ ${t.name}\n${message.replace(/^/gm, '      ')}`);
      failures.push(t.name);
    }
  }
  console.log(`\n${tests.length - failures.length} passing, ${failures.length} failing`);
  if (failures.length) {
    throw new Error(`${failures.length} integration test(s) failed: ${failures.join('; ')}`);
  }
}

/** Answers VS Code's dialogs, which would otherwise wait for a click forever. */
export const dialogs = {
  /** Picks the button to press for a warning or info message (undefined = dismiss / cancel). */
  answer: (_message: string, _buttons: string[]): string | undefined => undefined,
  inputBox: 'Test Student' as string | undefined,
  openDialog: undefined as vscode.Uri[] | undefined,
  saveDialog: undefined as vscode.Uri | undefined,
  /** Index of the quick pick item to choose (undefined = cancel). */
  quickPick: 0 as number | undefined,
  /** When set, chooses the quick pick item instead of `quickPick`, for example by its label. */
  choose: undefined as ((items: vscode.QuickPickItem[], options?: vscode.QuickPickOptions) => vscode.QuickPickItem | undefined) | undefined,
  messages: [] as string[],
};

export function stubDialogs(): void {
  const message = (kind: string) => async (msg: string, ...rest: unknown[]) => {
    const buttons = rest.filter((r): r is string => typeof r === 'string');
    dialogs.messages.push(`${kind}: ${msg}`);
    return dialogs.answer(msg, buttons);
  };
  const w = vscode.window as unknown as Record<string, unknown>;
  w.showWarningMessage = message('warning');
  w.showInformationMessage = message('info');
  w.showErrorMessage = message('error');
  w.showInputBox = async () => dialogs.inputBox;
  w.showOpenDialog = async () => dialogs.openDialog;
  w.showSaveDialog = async () => dialogs.saveDialog;
  w.showQuickPick = async (items: unknown, options?: vscode.QuickPickOptions) => {
    const list = (await items) as vscode.QuickPickItem[];
    if (dialogs.choose) {
      return dialogs.choose(list, options);
    }
    if (options?.canPickMany) {
      // Multi-select: accept what the extension preselected.
      return dialogs.quickPick === undefined ? undefined : list.filter((i) => i.picked);
    }
    return dialogs.quickPick === undefined ? undefined : list[dialogs.quickPick];
  };
}

/** Waits until `check` returns true, or fails after `timeoutMs`. */
export async function waitFor(check: () => boolean, what: string, timeoutMs = 15_000): Promise<void> {
  const end = Date.now() + timeoutMs;
  while (!check()) {
    if (Date.now() > end) {
      throw new Error(`timed out waiting for ${what}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }
}
