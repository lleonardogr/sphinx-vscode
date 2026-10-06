// Starts VS Code with the extension and runs the integration tests in it (npm run test:integration).
// Downloads VS Code into .vscode-test/ the first time; set SPHINX_TEST_VSCODE to an installed
// VS Code executable to use that one instead.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main(): Promise<void> {
  const root = path.resolve(__dirname, '..', '..');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-it-'));
  const workspace = path.join(temp, 'workspace');
  const userData = path.join(temp, 'user-data');
  fs.mkdirSync(workspace, { recursive: true });
  fs.mkdirSync(path.join(userData, 'User'), { recursive: true });
  // On macOS, VS Code takes PATH from the login shell, which may find an older JDK than the one
  // the tests run with: point Sphinx at JAVA_HOME, like a student would with sphinx.java.home.
  const settings: Record<string, unknown> = { 'security.workspace.trust.enabled': false, 'sphinx.language': 'en', 'update.mode': 'none', 'telemetry.telemetryLevel': 'off' };
  if (process.env.JAVA_HOME) {
    settings['sphinx.java.home'] = process.env.JAVA_HOME;
  }
  fs.writeFileSync(path.join(userData, 'User', 'settings.json'), JSON.stringify(settings));
  // When run from VS Code's own terminal, these make the downloaded VS Code behave like Node.
  delete process.env.ELECTRON_RUN_AS_NODE;
  delete process.env.VSCODE_IPC_HOOK_CLI;
  try {
    await runTests({
      extensionDevelopmentPath: root,
      extensionTestsPath: path.join(__dirname, 'integration', 'index'),
      vscodeExecutablePath: process.env.SPHINX_TEST_VSCODE || undefined,
      version: process.env.SPHINX_TEST_VSCODE ? undefined : 'stable',
      launchArgs: [workspace, '--disable-extensions', `--user-data-dir=${userData}`, '--skip-welcome', '--skip-release-notes'],
    });
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
