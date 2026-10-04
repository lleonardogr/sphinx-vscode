// Builds the tutor prompt for AI hints. No vscode dependency so it can be unit-tested.
import { RunOutcome } from '../runner';

export interface HintContext {
  title: string;
  description: string;
  requirements: string[];
  examples: { input: string; output: string }[];
  code: string;
  /** Last Run/Submit result, with hidden tests already redacted. */
  outcome?: RunOutcome;
  /** 1 for the first hint on this challenge, 2 for the second, ... */
  hintNumber: number;
  /** e.g. "pt-br", "en". */
  responseLanguage: string;
}

const MAX_FIELD = 800;

function clip(s: string, max = MAX_FIELD): string {
  return s.length > max ? `${s.slice(0, max)}… (truncated)` : s;
}

export function summarizeOutcome(outcome: RunOutcome | undefined): string {
  if (!outcome) {
    return 'The student has not run the code yet.';
  }
  switch (outcome.kind) {
    case 'toolMissing':
      return 'The code could not be run because Java is not installed correctly.';
    case 'ruleViolation':
      return `The code does not meet these requirements of the exercise:\n${outcome.messages.map((m) => `- ${m}`).join('\n')}`;
    case 'compileError':
      return `The code does not compile:\n${clip(outcome.raw, 1500)}`;
    case 'tests': {
      const failed = outcome.results.filter((r) => !r.passed);
      if (failed.length === 0) {
        return `All ${outcome.results.length} tests that were run passed.`;
      }
      const lines = [`${outcome.results.length - failed.length} of ${outcome.results.length} tests passed. Failures:`];
      for (const r of failed.slice(0, 3)) {
        const name = `${r.hidden ? 'Hidden test' : 'Test'} ${r.index + 1}`;
        if (r.timedOut) {
          lines.push(`- ${name}: time limit exceeded (possible infinite loop or waiting for input).`);
        } else if (r.hidden) {
          lines.push(`- ${name}: failed. Its input is secret, so do not guess or reveal it; think about edge cases.`);
        } else {
          lines.push(`- ${name}:\n  input: ${JSON.stringify(clip(r.input))}\n  expected output: ${JSON.stringify(clip(r.expected))}\n  actual output: ${JSON.stringify(clip(r.actual))}`);
        }
        if (r.stderr.trim()) {
          lines.push(`  error output: ${clip(r.stderr.trim().split('\n').slice(0, 4).join('\n'), 400)}`);
        }
      }
      return lines.join('\n');
    }
  }
}

export function buildHintPrompt(ctx: HintContext): { system: string; user: string } {
  const system = `You are a patient programming tutor helping a beginner solve a coding exercise in Java. Your goal is that the student learns to solve it themselves.

Rules:
- Never write the solution or complete methods for the student. You may show at most two short lines of code to illustrate one concept, using names that differ from the exercise.
- Give one hint at a time, about the most important problem in the student's current code. If the code does not compile, explain that error first in plain words.
- Escalate with each request. Hint 1 is a gentle nudge or a guiding question. Hint 2 says more specifically what to look at or change. Hint 3 and later may point to the exact line and the idea that is missing, still without writing the answer.
- If the code already looks correct, say so and suggest edge cases to test.
- Modern Java (void main(), IO.println) and classic Java (public class Main, System.out.println) are both valid. Never ask the student to switch styles.
- Be encouraging and concise: at most 120 words. Use Markdown, with \`inline code\` for identifiers.
- Respond in this language: ${ctx.responseLanguage}.

Latency-sensitive; begin your visible answer immediately.`;

  const examples = ctx.examples
    .map((e, i) => `Example ${i + 1}\ninput:\n${clip(e.input) || '(none)'}\nexpected output:\n${clip(e.output)}`)
    .join('\n\n');

  const user = `<exercise title="${ctx.title}">
${clip(ctx.description, 4000)}
</exercise>

<requirements>
${ctx.requirements.length ? ctx.requirements.map((r) => `- ${r}`).join('\n') : '(none)'}
</requirements>

<examples>
${examples}
</examples>

<student_code>
${clip(ctx.code, 8000)}
</student_code>

<last_result>
${summarizeOutcome(ctx.outcome)}
</last_result>

This is hint request number ${ctx.hintNumber} for this exercise.`;

  return { system, user };
}
