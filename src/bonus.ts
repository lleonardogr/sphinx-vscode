// Bonus goals: optional, harder goals on a challenge, checked on Submit once its tests pass. A goal is
// earned when the code follows its rules and passes its extra tests (within its time limit). They never
// change whether the challenge is solved. No vscode dependency, so the validator and tests can use it.
import * as fs from 'fs';
import { BonusGoal } from './challenges';
import { RunRequest, checkRules, runChallengeCode } from './runner';
import { tr } from './i18n';

export interface BonusResult {
  id: string;
  title: string;
  achieved: boolean;
  /** Why it was not earned, in plain words (a test's input is never shown). */
  reason?: string;
}

/** The runner settings to use, as for the challenge's own tests. */
export type RunnerTools = Pick<RunRequest, 'javaHome' | 'cCompiler' | 'cPortableDirs'>;

/** Checks the student's `file` against each bonus goal of `challenge`. */
export async function evaluateBonuses(challenge: { bonus: BonusGoal[]; timeLimitMs: number }, file: string, tools: RunnerTools = {}): Promise<BonusResult[]> {
  const source = fs.readFileSync(file, 'utf8');
  const results: BonusResult[] = [];
  for (const goal of challenge.bonus) {
    const base = { id: goal.id, title: goal.title };
    const broken = checkRules(source, goal.mustContain, goal.mustNotContain);
    if (broken.length) {
      results.push({ ...base, achieved: false, reason: broken.join(' ') });
      continue;
    }
    if (!goal.tests.length) {
      results.push({ ...base, achieved: true });
      continue;
    }
    const limit = goal.timeLimitMs ?? challenge.timeLimitMs;
    const outcome = await runChallengeCode({ file, tests: goal.tests, timeLimitMs: limit, ...tools });
    if (outcome.kind !== 'tests') {
      results.push({ ...base, achieved: false, reason: tr('The bonus tests could not run.', 'Os testes do bônus não puderam rodar.') });
      continue;
    }
    const failed = outcome.results.filter((r) => !r.passed);
    if (!failed.length) {
      results.push({ ...base, achieved: true });
      continue;
    }
    const seconds = Math.round(limit / 100) / 10;
    const slow = failed.find((r) => r.timedOut);
    const crashed = failed.find((r) => r.crash || (r.exitCode !== 0 && !r.timedOut));
    const reason = slow
      ? tr(`Too slow: a bonus test took longer than ${seconds} s. A faster approach is needed.`, `Lento demais: um teste do bônus passou de ${seconds} s. É preciso uma abordagem mais rápida.`)
      : crashed
        ? (crashed.crash ?? tr('Your program crashed on a bonus test.', 'Seu programa travou num teste do bônus.'))
        : tr(`${failed.length} of ${outcome.results.length} bonus tests gave a different answer.`, `${failed.length} de ${outcome.results.length} testes do bônus deram outra resposta.`);
    results.push({ ...base, achieved: false, reason });
  }
  return results;
}
