// AI hint orchestration: settings, API keys (in VS Code's encrypted SecretStorage), the setup
// wizard, the privacy prompt, and streaming a hint for a challenge.
import * as vscode from 'vscode';
import { Challenge } from '../challenges';
import { RunOutcome } from '../runner';
import { buildHintPrompt } from './prompt';
import { AiError, DEFAULT_ANTHROPIC_MODEL, PROVIDERS, ProviderId, createProvider, defaultBaseUrl, listOpenAiModels } from './providers';

const secretKey = (id: ProviderId) => `techChallenges.ai.apiKey.${id}`;
const CONSENT_KEY = 'techChallenges.ai.consent';

export interface HintCallbacks {
  onStart(label: string): void;
  onText(text: string): void;
  onDone(): void;
  onError(message: string): void;
}

export class AiHints {
  private readonly hintCounts = new Map<string, number>();
  private current: AbortController | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  private config() {
    return vscode.workspace.getConfiguration('techChallenges.ai');
  }

  get providerId(): ProviderId {
    return this.config().get<ProviderId>('provider', 'off');
  }

  private responseLanguage(): string {
    return this.config().get<string>('responseLanguage', '').trim() || vscode.env.language;
  }

  cancel(): void {
    this.current?.abort();
    this.current = undefined;
  }

  /** Streams a hint. Resolves when finished; errors are reported through callbacks. */
  async requestHint(challenge: Challenge, code: string, outcome: RunOutcome | undefined, cb: HintCallbacks): Promise<void> {
    this.cancel();
    const id = this.providerId;
    if (id === 'off') {
      const choice = await vscode.window.showInformationMessage(
        'AI hints are turned off. Set up a local model (Ollama, LM Studio) or your own API key to use them.',
        'Set Up AI Hints',
      );
      if (choice) {
        await this.setup();
      }
      return;
    }

    const controller = new AbortController();
    this.current = controller;
    try {
      const provider = await createProvider({
        id,
        model: this.config().get<string>('model', '').trim(),
        baseUrl: this.config().get<string>('baseUrl', '').trim(),
        apiKey: await this.context.secrets.get(secretKey(id)),
      });
      if (provider.remote && !(await this.confirmRemote(provider.label))) {
        return;
      }

      const hintNumber = (this.hintCounts.get(challenge.id) ?? 0) + 1;
      this.hintCounts.set(challenge.id, hintNumber);
      const { system, user } = buildHintPrompt({
        title: challenge.title,
        description: challenge.description,
        requirements: [...challenge.mustContain, ...challenge.mustNotContain].map((r) => r.message),
        examples: challenge.tests.filter((t) => !t.hidden),
        code,
        outcome,
        hintNumber,
        responseLanguage: this.responseLanguage(),
      });

      cb.onStart(provider.label);
      await provider.stream(system, user, cb.onText, controller.signal);
      if (!controller.signal.aborted) {
        cb.onDone();
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        cb.onError(e instanceof AiError ? e.message : `Unexpected error: ${(e as Error).message}`);
      }
    } finally {
      if (this.current === controller) {
        this.current = undefined;
      }
    }
  }

  /** Asks once per provider before sending code to a remote service. */
  private async confirmRemote(label: string): Promise<boolean> {
    const consented = this.context.globalState.get<string[]>(CONSENT_KEY, []);
    if (consented.includes(this.providerId)) {
      return true;
    }
    const answer = await vscode.window.showWarningMessage(
      `AI hints will send the exercise and your code to ${label}. Continue?`,
      { modal: true, detail: 'This is asked once. Choose a local provider (Ollama or LM Studio) to keep your code on this computer.' },
      'Send',
    );
    if (answer !== 'Send') {
      return false;
    }
    await this.context.globalState.update(CONSENT_KEY, [...consented, this.providerId]);
    return true;
  }

  /** Guided setup: provider → API key / base URL → model. */
  async setup(): Promise<void> {
    const current = this.providerId;
    const pick = await vscode.window.showQuickPick(
      [
        ...PROVIDERS.map((p) => ({ label: p.label, detail: p.detail, id: p.id, description: p.id === current ? '(current)' : '' })),
        { label: 'Turn AI hints off', detail: 'Hide AI hints. Nothing is sent anywhere.', id: 'off' as ProviderId, description: current === 'off' ? '(current)' : '' },
      ],
      { title: 'Tech Challenges: AI hints provider', placeHolder: 'Where should AI hints come from?', ignoreFocusOut: true },
    );
    if (!pick) {
      return;
    }
    const id = pick.id;
    const target = vscode.ConfigurationTarget.Global;
    const info = PROVIDERS.find((p) => p.id === id);

    if (id === 'openai-compatible') {
      const baseUrl = await vscode.window.showInputBox({
        title: 'API base URL',
        prompt: 'The OpenAI-compatible endpoint, ending in /v1',
        value: this.config().get<string>('baseUrl', '') || 'https://api.openai.com/v1',
        ignoreFocusOut: true,
      });
      if (baseUrl === undefined) {
        return;
      }
      await this.config().update('baseUrl', baseUrl.trim(), target);
    } else if (id !== 'off') {
      // Other providers use their own default URL.
      await this.config().update('baseUrl', undefined, target);
    }

    if (info?.needsKey) {
      const existing = await this.context.secrets.get(secretKey(id));
      const key = await vscode.window.showInputBox({
        title: `${info.label} API key`,
        prompt: existing ? 'Leave empty to keep the saved key.' : 'Stored encrypted in VS Code\'s secret storage, never in settings files.',
        password: true,
        ignoreFocusOut: true,
      });
      if (key === undefined) {
        return;
      }
      if (key.trim()) {
        await this.context.secrets.store(secretKey(id), key.trim());
      } else if (!existing && id === 'anthropic') {
        vscode.window.showWarningMessage('No API key saved. AI hints will not work until you add one.');
      }
    }

    let model = '';
    if (id === 'anthropic') {
      model = (await vscode.window.showInputBox({
        title: 'Claude model',
        prompt: 'Model ID to use',
        value: this.config().get<string>('model', '') || DEFAULT_ANTHROPIC_MODEL,
        ignoreFocusOut: true,
      })) ?? '';
    } else if (id === 'ollama' || id === 'lmstudio') {
      try {
        const models = await listOpenAiModels(defaultBaseUrl(id));
        if (models.length) {
          model = (await vscode.window.showQuickPick(models, { title: 'Which local model?', ignoreFocusOut: true })) ?? models[0];
        } else {
          vscode.window.showWarningMessage(`${info?.label} is running but has no models yet. ${id === 'ollama' ? 'Run "ollama pull llama3.2" in a terminal.' : 'Download and load a model in LM Studio.'}`);
        }
      } catch {
        vscode.window.showWarningMessage(`Could not reach ${info?.label}. Start it, and the first model it offers will be used.`);
      }
    } else if (id === 'openai-compatible') {
      model = (await vscode.window.showInputBox({
        title: 'Model',
        prompt: 'Model name as your provider spells it',
        value: this.config().get<string>('model', ''),
        ignoreFocusOut: true,
      })) ?? '';
    }

    await this.config().update('model', model.trim() || undefined, target);
    await this.config().update('provider', id, target);
    vscode.window.showInformationMessage(id === 'off' ? 'AI hints are off.' : `AI hints will use ${info?.label}.`);
  }

  async clearApiKeys(): Promise<void> {
    for (const p of PROVIDERS) {
      await this.context.secrets.delete(secretKey(p.id));
    }
    await this.context.globalState.update(CONSENT_KEY, undefined);
    vscode.window.showInformationMessage('All saved AI API keys were removed.');
  }
}
