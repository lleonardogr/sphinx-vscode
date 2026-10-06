// Entry point VS Code calls with --extensionTestsPath.
import { runAll, stubDialogs } from './harness';

export async function run(): Promise<void> {
  stubDialogs();
  require('./extension.test');
  await runAll();
}
