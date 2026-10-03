# AI hints

Tech Challenges can ask an AI tutor for a hint about **your current code**. The tutor is told never to write the solution. It gives one hint at a time and gets more specific each time you ask.

AI hints are **off by default**. Nothing is sent anywhere until you choose a provider.

## Choosing a provider

Run **Tech Challenges: Set Up AI Hints** from the Command Palette, or click **AI settings** under the hints in the problem panel. You have three kinds of options:

| Provider | Cost | Privacy | What you need |
|----------|------|---------|---------------|
| **Ollama** (local) | Free | Your code stays on your computer | [Ollama](https://ollama.com) and one model |
| **LM Studio** (local) | Free | Your code stays on your computer | [LM Studio](https://lmstudio.ai) with its local server started |
| **Anthropic (Claude)** | Pay per use | Sent to Anthropic | An API key from [console.anthropic.com](https://console.anthropic.com) |
| **OpenAI-compatible API** | Depends on the provider | Sent to that provider | A base URL, a model name and usually an API key (OpenAI, OpenRouter, Groq, Together, a school server…) |
| **VS Code language models** | Included with your subscription | Sent to that model's provider | GitHub Copilot (or another extension that provides models), signed in |

### Local models (recommended for classrooms)

A local model runs on the student's own computer: it's free, works offline, and no code leaves the machine. Hints from small local models are less accurate than from large cloud models, but they are good enough for beginner exercises.

**Ollama:**

1. Install Ollama from [ollama.com](https://ollama.com).
2. Download a model in a terminal. Some good choices for coding hints on a normal laptop:

   ```bash
   ollama pull llama3.2          # small and fast (~2 GB)
   ollama pull qwen2.5-coder:7b  # better at code (~5 GB, needs 16 GB RAM)
   ```

3. In VS Code, run **Set Up AI Hints → Ollama** and pick the model.

**LM Studio:** download a model in LM Studio, load it, and start the server (Developer tab → *Start Server*). Then choose **LM Studio** in **Set Up AI Hints**.

Why not a model built into the extension? Even a small model is a 1–4 GB download and needs native code for each operating system. Ollama and LM Studio handle that well, and the extension stays small.

### Your own API key

Choose **Anthropic** or **OpenAI-compatible** in **Set Up AI Hints** and paste your key. Keys are stored in VS Code's encrypted **secret storage**, never in `settings.json`, so they aren't shared when you sync or commit settings. To delete them, run **Tech Challenges: Remove Saved AI API Keys**.

- **Anthropic:** the default model is `claude-opus-5-5`. You can choose another one, for example `claude-sonnet-5-5` or `claude-haiku-4-5`, to lower the cost. On models that support it, if Claude's safety checks decline a request, it is retried automatically on Anthropic's recommended fallback model.
- **OpenAI-compatible:** enter the base URL ending in `/v1` (for OpenAI: `https://api.openai.com/v1`) and the model name exactly as your provider spells it.

The first time you use a provider that runs outside your computer, VS Code asks you to confirm that your code may be sent there.

## What is sent

For each hint, the extension sends:

- the challenge description, requirements and **visible** examples;
- your current code;
- the result of your last Run or Submit: compile errors, and failed visible tests with expected and actual output.

**Hidden test inputs are never sent**, so the AI can't reveal them. Nothing else from your computer is sent.

## Settings

| Setting | Description |
|---------|-------------|
| `techChallenges.ai.provider` | `off` (default), `ollama`, `lmstudio`, `anthropic`, `openai-compatible` or `vscode`. |
| `techChallenges.ai.model` | Model name. If empty: `claude-opus-5-5` for Anthropic, the first installed model for Ollama and LM Studio, and any available model for VS Code. |
| `techChallenges.ai.baseUrl` | API URL. Required for `openai-compatible`. Optional otherwise, for example to point at Ollama on another computer. |
| `techChallenges.ai.responseLanguage` | Language for the hints, for example `Português`. If empty, VS Code's display language is used. |

## For teachers

- **Disable AI for one challenge** (for example in an exam): add `"aiHints": false` to its `challenge.json`.
- **A shared school server:** run Ollama (or any OpenAI-compatible server, such as vLLM) on one machine. Students then set the provider to `openai-compatible` (or `ollama`) and `techChallenges.ai.baseUrl` to `http://<server>:11434/v1`.
- The tutor's instructions are in [`src/ai/prompt.ts`](../src/ai/prompt.ts). It is told to never write the solution, to use at most two short illustrative lines of code, and to escalate from a guiding question to pointing at the exact line.

AI hints can be wrong. Encourage students to check them against their own reasoning, and to use the built-in hints and test feedback first.

## Troubleshooting

| Message | What to do |
|---------|------------|
| *Could not connect to http://localhost:11434* | Ollama isn't running. Start the Ollama app, or run `ollama serve`. |
| *No models are installed* | Run `ollama pull llama3.2`, or load a model in LM Studio. |
| *Anthropic rejected the API key* | Run **Set Up AI Hints** again and paste a valid key. |
| *Too many AI requests right now* | You hit the provider's rate limit. Wait a minute. |
| *No language model is available in VS Code* | Install and sign in to GitHub Copilot, or choose another provider. |
