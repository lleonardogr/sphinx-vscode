// AI hint providers. Each one streams plain text for a (system, user) prompt pair.
import Anthropic from '@anthropic-ai/sdk';
import * as vscode from 'vscode';
import { tr } from '../i18n';

export type ProviderId = 'off' | 'ollama' | 'lmstudio' | 'anthropic' | 'openai-compatible' | 'vscode';

export interface ProviderSettings {
  id: ProviderId;
  model: string;
  baseUrl: string;
  apiKey: string | undefined;
}

export interface HintProvider {
  /** Human-readable name, e.g. "Ollama (llama3.2)". */
  label: string;
  /** True when the student's code leaves their computer. */
  remote: boolean;
  stream(system: string, user: string, onText: (text: string) => void, signal: AbortSignal): Promise<void>;
}

export class AiError extends Error {}

export const PROVIDERS: { id: ProviderId; label: string; detail: string; detailPtBr: string; needsKey: boolean; remote: boolean }[] = [
  { id: 'ollama', label: 'Ollama (local)', detail: 'Free and private: runs an open model on this computer. Requires Ollama (ollama.com).', detailPtBr: 'Gratuito e privado: roda um modelo aberto neste computador. Precisa do Ollama (ollama.com).', needsKey: false, remote: false },
  { id: 'lmstudio', label: 'LM Studio (local)', detail: 'Free and private: runs an open model on this computer. Requires LM Studio with its server started.', detailPtBr: 'Gratuito e privado: roda um modelo aberto neste computador. Precisa do LM Studio com o servidor iniciado.', needsKey: false, remote: false },
  { id: 'anthropic', label: 'Anthropic (Claude)', detail: 'Uses your Anthropic API key (console.anthropic.com).', detailPtBr: 'Usa a sua chave de API da Anthropic (console.anthropic.com).', needsKey: true, remote: true },
  { id: 'openai-compatible', label: 'OpenAI-compatible API', detail: 'OpenAI, OpenRouter, Groq, Together, a school server… Needs a base URL, a model and usually an API key.', detailPtBr: 'OpenAI, OpenRouter, Groq, Together, um servidor da escola… Precisa de uma URL base, um modelo e geralmente uma chave de API.', needsKey: true, remote: true },
  { id: 'vscode', label: 'VS Code language models', detail: 'Uses a model already available in VS Code, such as GitHub Copilot. No API key needed.', detailPtBr: 'Usa um modelo que já está disponível no VS Code, como o GitHub Copilot. Não precisa de chave de API.', needsKey: false, remote: true },
];

export const DEFAULT_ANTHROPIC_MODEL = 'claude-opus-5-5';

const DEFAULT_BASE_URLS: Partial<Record<ProviderId, string>> = {
  ollama: 'http://localhost:11434/v1',
  lmstudio: 'http://localhost:1234/v1',
};

// Models that accept server-side refusal fallbacks in their "default" (category-routed) form.
const DEFAULT_FALLBACK_MODELS = new Set(['claude-fable-5-1', 'claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5-5']);

export function defaultBaseUrl(id: ProviderId): string {
  return DEFAULT_BASE_URLS[id] ?? '';
}

// ---------------------------------------------------------------- Anthropic

function anthropicProvider(settings: ProviderSettings): HintProvider {
  if (!settings.apiKey) {
    throw new AiError(tr('No Anthropic API key is set. Run "Sphynx: Set Up AI Hints".', 'Nenhuma chave da Anthropic configurada. Rode "Sphynx: Configurar dicas de IA".'));
  }
  const model = settings.model || DEFAULT_ANTHROPIC_MODEL;
  const client = new Anthropic({ apiKey: settings.apiKey, ...(settings.baseUrl ? { baseURL: settings.baseUrl } : {}) });

  return {
    label: `Anthropic (${model})`,
    remote: true,
    async stream(system, user, onText, signal) {
      const request = { model, max_tokens: 16000, system, messages: [{ role: 'user' as const, content: user }] };
      try {
        // On models that support it, a safety decline is retried server-side on Anthropic's
        // recommended fallback model instead of failing the hint.
        const stream = DEFAULT_FALLBACK_MODELS.has(model)
          ? client.beta.messages.stream({ ...request, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }, { signal })
          : client.messages.stream(request, { signal });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            onText(event.delta.text);
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          throw new AiError(tr('The model declined to answer this request. Try rephrasing your code comments, or ask your teacher.', 'O modelo se recusou a responder. Tente reescrever os comentários do código, ou pergunte ao professor.'));
        }
      } catch (e) {
        if (e instanceof AiError || signal.aborted) {
          throw e;
        }
        if (e instanceof Anthropic.AuthenticationError) {
          throw new AiError(tr('Anthropic rejected the API key. Check it with "Sphynx: Set Up AI Hints".', 'A Anthropic recusou a chave de API. Confira em "Sphynx: Configurar dicas de IA".'));
        } else if (e instanceof Anthropic.PermissionDeniedError) {
          throw new AiError(tr(`Your Anthropic API key cannot use the model "${model}".`, `Sua chave da Anthropic não pode usar o modelo "${model}".`));
        } else if (e instanceof Anthropic.NotFoundError) {
          throw new AiError(tr(`Anthropic does not know the model "${model}". Check the sphynx.ai.model setting.`, `A Anthropic não conhece o modelo "${model}". Confira a configuração sphynx.ai.model.`));
        } else if (e instanceof Anthropic.RateLimitError) {
          throw new AiError(tr('Too many AI requests right now (rate limit). Wait a moment and try again.', 'Muitos pedidos à IA agora (limite de uso). Espere um pouco e tente de novo.'));
        } else if (e instanceof Anthropic.APIConnectionError) {
          throw new AiError(tr('Could not reach the Anthropic API. Check your internet connection.', 'Não foi possível acessar a API da Anthropic. Confira sua conexão com a internet.'));
        } else if (e instanceof Anthropic.APIError) {
          throw new AiError(`Anthropic API error ${e.status ?? ''}: ${e.message}`);
        }
        throw e;
      }
    },
  };
}

// ---------------------------------------------------------------- OpenAI-compatible (Ollama, LM Studio, others)

async function fetchJson(url: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal });
  } catch (e) {
    if (signal?.aborted) {
      throw e;
    }
    throw new AiError(tr(`Could not connect to ${new URL(url).origin}.`, `Não foi possível conectar a ${new URL(url).origin}.`));
  }
}

/** Lists the models an OpenAI-compatible server offers (used to auto-pick a local model). */
export async function listOpenAiModels(baseUrl: string, apiKey?: string): Promise<string[]> {
  const res = await fetchJson(`${baseUrl.replace(/\/$/, '')}/models`, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  });
  if (!res.ok) {
    throw new AiError(`${baseUrl} answered ${res.status} when listing models.`);
  }
  const body = (await res.json()) as { data?: { id: string }[] };
  return (body.data ?? []).map((m) => m.id);
}

function localHelp(id: ProviderId): string {
  if (id === 'ollama') {
    return tr(
      'Is Ollama running? Install it from https://ollama.com, then run "ollama pull llama3.2" (or another model) in a terminal.',
      'O Ollama está rodando? Instale em https://ollama.com e rode "ollama pull llama3.2" (ou outro modelo) em um terminal.',
    );
  }
  if (id === 'lmstudio') {
    return tr(
      'Is LM Studio running with a model loaded and its local server started (Developer tab → Start Server)?',
      'O LM Studio está rodando com um modelo carregado e o servidor local iniciado (aba Developer → Start Server)?',
    );
  }
  return tr('Check the sphynx.ai.baseUrl setting.', 'Confira a configuração sphynx.ai.baseUrl.');
}

async function openAiCompatibleProvider(settings: ProviderSettings): Promise<HintProvider> {
  const baseUrl = (settings.baseUrl || defaultBaseUrl(settings.id)).replace(/\/$/, '');
  if (!baseUrl) {
    throw new AiError(tr("Set sphynx.ai.baseUrl to your provider's API URL (for example https://api.openai.com/v1).", 'Defina sphynx.ai.baseUrl com a URL da API do seu provedor (por exemplo https://api.openai.com/v1).'));
  }
  const local = settings.id === 'ollama' || settings.id === 'lmstudio';
  let model = settings.model;
  if (!model) {
    if (!local) {
      throw new AiError(tr('Set sphynx.ai.model to the model you want to use.', 'Defina sphynx.ai.model com o modelo que você quer usar.'));
    }
    let models: string[];
    try {
      models = await listOpenAiModels(baseUrl, settings.apiKey);
    } catch (e) {
      throw new AiError(`${(e as Error).message} ${localHelp(settings.id)}`);
    }
    if (models.length === 0) {
      throw new AiError(`${tr('No models are installed.', 'Nenhum modelo instalado.')} ${localHelp(settings.id)}`);
    }
    model = models[0];
  }

  return {
    label: `${PROVIDERS.find((p) => p.id === settings.id)?.label ?? settings.id} (${model})`,
    remote: !local,
    async stream(system, user, onText, signal) {
      const res = await fetchJson(
        `${baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
          },
          body: JSON.stringify({
            model,
            stream: true,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user },
            ],
          }),
        },
        signal,
      ).catch((e) => {
        throw e instanceof AiError && local ? new AiError(`${e.message} ${localHelp(settings.id)}`) : e;
      });
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        if (res.status === 401 || res.status === 403) {
          throw new AiError(tr('The API key was rejected. Check it with "Sphynx: Set Up AI Hints".', 'A chave de API foi recusada. Confira em "Sphynx: Configurar dicas de IA".'));
        }
        if (res.status === 404 && local) {
          throw new AiError(`${tr(`The model "${model}" is not available.`, `O modelo "${model}" não está disponível.`)} ${localHelp(settings.id)}`);
        }
        throw new AiError(`${tr('The AI server answered', 'O servidor de IA respondeu')} ${res.status}: ${text.slice(0, 300)}`);
      }

      // Server-sent events: lines of "data: {json}", ending with "data: [DONE]".
      const decoder = new TextDecoder();
      let buffer = '';
      for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const data = line.trim().replace(/^data:\s*/, '');
          if (!line.trim().startsWith('data:') || data === '[DONE]') {
            continue;
          }
          try {
            const text = JSON.parse(data).choices?.[0]?.delta?.content;
            if (text) {
              onText(text);
            }
          } catch {
            // Ignore keep-alive or partial lines.
          }
        }
      }
    },
  };
}

// ---------------------------------------------------------------- VS Code language models (e.g. Copilot)

async function vscodeProvider(settings: ProviderSettings): Promise<HintProvider> {
  const models = await vscode.lm.selectChatModels(settings.model ? { family: settings.model } : {});
  const model = models[0];
  if (!model) {
    throw new AiError(
      settings.model
        ? tr(`No VS Code language model with family "${settings.model}" is available.`, `Nenhum modelo de linguagem do VS Code da família "${settings.model}" está disponível.`)
        : tr(
            'No language model is available in VS Code. Install and sign in to GitHub Copilot, or choose another provider.',
            'Nenhum modelo de linguagem disponível no VS Code. Instale e entre no GitHub Copilot, ou escolha outro provedor.',
          ),
    );
  }
  return {
    label: `${model.vendor} ${model.name}`,
    remote: true,
    async stream(system, user, onText, signal) {
      const cts = new vscode.CancellationTokenSource();
      signal.addEventListener('abort', () => cts.cancel());
      try {
        // The LM API has no system role, so the instructions lead the user message.
        const response = await model.sendRequest([vscode.LanguageModelChatMessage.User(`${system}\n\n${user}`)], {}, cts.token);
        for await (const text of response.text) {
          onText(text);
        }
      } catch (e) {
        if (e instanceof vscode.LanguageModelError) {
          throw new AiError(`VS Code language model error: ${e.message}`);
        }
        throw e;
      } finally {
        cts.dispose();
      }
    },
  };
}

export async function createProvider(settings: ProviderSettings): Promise<HintProvider> {
  switch (settings.id) {
    case 'anthropic':
      return anthropicProvider(settings);
    case 'ollama':
    case 'lmstudio':
    case 'openai-compatible':
      return openAiCompatibleProvider(settings);
    case 'vscode':
      return vscodeProvider(settings);
    default:
      throw new AiError(tr('AI hints are turned off.', 'As dicas de IA estão desligadas.'));
  }
}
