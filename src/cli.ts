// The `sphinx` command: validate content, test a solution, build a pack and verify exam results from a
// terminal. It reuses the extension's core (no vscode dependency) and records no progress: practising and
// exams stay in VS Code. Run inside VS Code's terminal, the extension provides SPHINX_* variables with its
// settings (Java home, portable C compilers, language).
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { evaluateBonuses } from './bonus';
import { codeFileName, loadChallenge, loadChallenges } from './challenges';
import { formatVerification, verifyResults } from './examVerify';
import { loadExams } from './exams';
import { buildPack } from './exportCore';
import { findImportables } from './importCore';
import { language, setLanguage, tr } from './i18n';
import { loadQuizzes } from './quizzes';
import { RunOutcome, runChallengeCode } from './runner';
import { allSubjects, loadSubjects, setSubjects, subjectContentRoots } from './subjects';
import { formatReport, reportPassed, validateChallenges } from './validator';

/** The extension's folder: cli.js lives in out/. */
const ROOT = path.resolve(__dirname, '..');

interface Args {
  positional: string[];
  flags: Map<string, string | true>;
}

/** Options followed by a value (`--exams <folder>` or `--exams=<folder>`); the others are switches. */
const VALUE_FLAGS = new Set(['out', 'exams', 'java-home', 'cc', 'lang']);

export function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  const flags = new Map<string, string | true>();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o') {
      flags.set('out', argv[++i] ?? '');
    } else if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      const name = eq > 0 ? a.slice(2, eq) : a.slice(2);
      if (eq > 0) {
        flags.set(name, a.slice(eq + 1));
      } else if (VALUE_FLAGS.has(name)) {
        flags.set(name, argv[++i] ?? '');
      } else {
        flags.set(name, true);
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

const flag = (args: Args, name: string): string | undefined => {
  const v = args.flags.get(name);
  return typeof v === 'string' ? v : undefined;
};

/** Runner settings: flags first, then what the extension passes, then JAVA_HOME. */
function tools(args: Args) {
  const portable = process.env.SPHINX_C_PORTABLE_DIRS ?? '';
  return {
    javaHome: flag(args, 'java-home') ?? process.env.SPHINX_JAVA_HOME ?? process.env.JAVA_HOME,
    cCompiler: flag(args, 'cc') ?? process.env.SPHINX_C_COMPILER,
    cPortableDirs: portable ? portable.split(path.delimiter).filter(Boolean) : [],
  };
}

/** Loads the built-in subjects (and returns the built-in content folders), so units and prerequisites resolve. */
function builtInRoots(): string[] {
  const subjects = loadSubjects([path.join(ROOT, 'subjects')]);
  setSubjects(subjects.subjects);
  return [...['challenges', 'custom', 'tests', 'quizzes'].map((d) => path.join(ROOT, d)), ...allSubjects().flatMap(subjectContentRoots)];
}

const HELP = () =>
  tr(
    `Sphinx command line

Usage:
  sphinx validate <folder>... [--generate] [--strict] [--lang=pt-br]
      Check challenges, quizzes, lessons, exams and subjects: starters compile, reference
      solutions pass every test, bonus goals are earned. --generate fills in expected outputs.
  sphinx test <challenge> <file>
      Run your Main.java or main.c against a challenge's tests (hidden ones included) and its
      bonus goals. <challenge> is a challenge folder, or the id of a built-in challenge (fizzbuzz).
      Nothing is recorded: practise in VS Code to keep your progress.
  sphinx pack <folder> [-o pack.zip] [--keep-solutions]
      Build a pack for students from a folder of challenges, quizzes, lessons, exams or subjects.
      Reference solutions are left out unless --keep-solutions.
  sphinx verify <results.json>... [--exams <folder>]
      Re-grade students' exam results files and compare with the scores they claim.
  sphinx --version

Options for test and verify: --java-home <folder>, --cc <compiler>.
`,
    `Linha de comando do Sphinx

Uso:
  sphinx validate <pasta>... [--generate] [--strict] [--lang=pt-br]
      Confere desafios, quizzes, lições, provas e matérias: os códigos iniciais compilam, as
      soluções passam em todos os testes, os objetivos bônus são alcançados. --generate preenche
      as saídas esperadas.
  sphinx test <desafio> <arquivo>
      Roda o seu Main.java ou main.c nos testes de um desafio (inclusive os ocultos) e nos objetivos
      bônus. <desafio> é a pasta de um desafio, ou o id de um desafio incluído (fizzbuzz).
      Nada é registrado: pratique no VS Code para guardar o seu progresso.
  sphinx pack <pasta> [-o pacote.zip] [--keep-solutions]
      Monta um pacote para os alunos com uma pasta de desafios, quizzes, lições, provas ou matérias.
      As soluções ficam de fora, a não ser com --keep-solutions.
  sphinx verify <resultado.json>... [--exams <pasta>]
      Corrige de novo os arquivos de resultado das provas e compara com as notas que eles dizem.
  sphinx --version

Opções de test e verify: --java-home <pasta>, --cc <compilador>.
`,
  );

async function validate(args: Args): Promise<number> {
  if (args.positional.length === 0) {
    console.error(tr('Name at least one folder to validate: sphinx validate <folder>', 'Informe pelo menos uma pasta para validar: sphinx validate <pasta>'));
    return 2;
  }
  const referenceRoots = builtInRoots();
  const generate = args.flags.has('generate');
  // The validator looks for items inside a folder. A folder that is itself one item (a challenge, quiz,
  // lesson or exam) is validated from a temporary copy, and its filled-in .json files are copied back.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-validate-'));
  const copies: { from: string; to: string }[] = [];
  const roots = args.positional.map((p) => {
    const dir = path.resolve(p);
    if (!ITEM_FILES.some((f) => fs.existsSync(path.join(dir, f)))) {
      return dir;
    }
    const root = fs.mkdtempSync(path.join(temp, 'item-'));
    const to = path.join(root, path.basename(dir));
    fs.cpSync(dir, to, { recursive: true });
    copies.push({ from: dir, to });
    return root;
  });
  try {
    return await runValidation(args, roots, referenceRoots, generate, copies);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const ITEM_FILES = ['challenge.json', 'quiz.json', 'lesson.json', 'exam.json'];

/** Copies every .json file of a validated copy back to the original folder (expected outputs filled in). */
function copyJsonBack(from: string, to: string): void {
  for (const entry of fs.readdirSync(to, { withFileTypes: true })) {
    const src = path.join(to, entry.name);
    const dest = path.join(from, entry.name);
    if (entry.isDirectory()) {
      if (fs.existsSync(dest)) copyJsonBack(dest, src);
    } else if (entry.name.endsWith('.json') && !fs.readFileSync(src).equals(fs.readFileSync(dest))) {
      fs.copyFileSync(src, dest);
    }
  }
}

async function runValidation(args: Args, roots: string[], referenceRoots: string[], generate: boolean, copies: { from: string; to: string }[]): Promise<number> {
  const report = await validateChallenges(roots, {
    generate,
    strict: args.flags.has('strict'),
    languages: [...args.flags.entries()].filter(([k]) => k === 'lang').map(([, v]) => String(v)),
    referenceRoots,
    ...tools(args),
    onChallenge: (c) => process.stdout.write(c.ok ? '.' : 'x'),
  });
  process.stdout.write('\n');
  if (generate) {
    copies.forEach((c) => copyJsonBack(c.from, c.to));
  }
  console.log(formatReport(report, generate).join('\n'));
  return reportPassed(report) ? 0 : 1;
}

/** A challenge folder, or the id of a built-in challenge. */
function findChallengeDir(nameOrDir: string): string | undefined {
  if (fs.existsSync(path.join(nameOrDir, 'challenge.json'))) {
    return path.resolve(nameOrDir);
  }
  const roots = builtInRoots();
  return loadChallenges(roots).challenges.find((c) => c.id === nameOrDir)?.dir;
}

function describeOutcome(outcome: RunOutcome): string[] {
  switch (outcome.kind) {
    case 'toolMissing':
      return [`✗ ${outcome.message}`];
    case 'ruleViolation':
      return outcome.messages.map((m) => `✗ ${m}`);
    case 'compileError':
      return [tr('✗ Your code does not compile:', '✗ O seu código não compila:'), ...outcome.errors.map((e) => `  ${tr('line', 'linha')} ${e.line}: ${e.message}`), ...(outcome.hint ? [outcome.hint] : [])];
    case 'tests': {
      const lines = (outcome.warnings ?? []).map((w) => `⚠ ${tr('line', 'linha')} ${w.line}: ${w.message}`);
      for (const r of outcome.results) {
        const name = `${r.hidden ? tr('Hidden test', 'Teste oculto') : tr('Test', 'Teste')} ${r.index + 1}`;
        if (r.passed) {
          lines.push(`✓ ${name} (${r.timeMs} ms)`);
        } else if (r.timedOut) {
          lines.push(`✗ ${name}: ${r.generated ? tr('took too long on a big input (is there a faster approach?)', 'demorou demais numa entrada grande (há uma abordagem mais rápida?)') : tr('took too long', 'demorou demais')}`);
        } else if (r.crash || r.exitCode !== 0) {
          lines.push(`✗ ${name}: ${r.crash ?? tr(`your program crashed (exit code ${r.exitCode})`, `o seu programa travou (código de saída ${r.exitCode})`)}`);
        } else if (r.hidden) {
          lines.push(`✗ ${name}: ${tr('a different answer', 'outra resposta')}`);
        } else {
          lines.push(`✗ ${name}: ${tr('a different answer', 'outra resposta')}`, `  ${tr('input', 'entrada')}:    ${JSON.stringify(r.input)}`, `  ${tr('expected', 'esperado')}: ${JSON.stringify(r.expected)}`, `  ${tr('printed', 'impresso')}: ${JSON.stringify(r.actual)}`);
        }
      }
      return lines;
    }
  }
}

async function test(args: Args): Promise<number> {
  const [challengeArg, fileArg] = args.positional;
  if (!challengeArg || !fileArg) {
    console.error(tr('Usage: sphinx test <challenge> <file>', 'Uso: sphinx test <desafio> <arquivo>'));
    return 2;
  }
  const dir = findChallengeDir(challengeArg);
  if (!dir) {
    console.error(tr(`No challenge "${challengeArg}": give its folder, or the id of a built-in challenge.`, `Nenhum desafio "${challengeArg}": informe a pasta dele, ou o id de um desafio incluído.`));
    return 2;
  }
  if (!fs.existsSync(fileArg)) {
    console.error(tr(`No file ${fileArg}.`, `O arquivo ${fileArg} não existe.`));
    return 2;
  }
  const c = loadChallenge(dir, language());
  // The runner expects the code under its usual name (Main.java or main.c): run a copy.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sphinx-cli-'));
  const file = path.join(temp, codeFileName(c.language));
  fs.copyFileSync(fileArg, file);
  try {
    console.log(`${c.title} · ${c.tests.length} ${tr('tests', 'testes')}`);
    const outcome = await runChallengeCode({ file, tests: c.tests, mustContain: c.mustContain, mustNotContain: c.mustNotContain, timeLimitMs: c.timeLimitMs, ...tools(args) });
    describeOutcome(outcome).forEach((l) => console.log(l));
    const passed = outcome.kind === 'tests' && outcome.results.every((r) => r.passed);
    if (!passed) {
      return 1;
    }
    console.log(tr('All tests pass.', 'Todos os testes passam.'));
    if (c.bonus.length) {
      for (const r of await evaluateBonuses(c, file, tools(args))) {
        console.log(r.achieved ? `★ ${r.title}` : `☆ ${r.title}: ${r.reason ?? ''}`);
      }
    }
    return 0;
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function pack(args: Args): number {
  const folder = args.positional[0];
  if (!folder || !fs.existsSync(folder)) {
    console.error(tr('Usage: sphinx pack <folder> [-o pack.zip] [--keep-solutions]', 'Uso: sphinx pack <pasta> [-o pacote.zip] [--keep-solutions]'));
    return 2;
  }
  const root = path.resolve(folder);
  const name = path.basename(root);
  const items = findImportables(root, name).map((i) => ({ kind: i.kind, dir: i.dir }));
  if (items.length === 0) {
    console.error(tr(`No challenges, quizzes, lessons, exams or subjects in ${root}.`, `Nenhum desafio, quiz, lição, prova ou matéria em ${root}.`));
    return 1;
  }
  const keep = args.flags.has('keep-solutions');
  const result = buildPack(items, name, keep);
  const out = path.resolve(flag(args, 'out') ?? `${name}.zip`);
  fs.writeFileSync(out, result.zip);
  console.log(
    tr(
      `Pack written: ${out} (${items.length} item(s), ${result.files} files${keep ? ', solutions kept' : `, ${result.solutionsRemoved} solution file(s) left out`}).`,
      `Pacote salvo: ${out} (${items.length} item(ns), ${result.files} arquivos${keep ? ', soluções mantidas' : `, ${result.solutionsRemoved} arquivo(s) de solução deixado(s) de fora`}).`,
    ),
  );
  return 0;
}

async function verify(args: Args): Promise<number> {
  if (args.positional.length === 0) {
    console.error(tr('Usage: sphinx verify <results.json>... [--exams <folder>]', 'Uso: sphinx verify <resultado.json>... [--exams <pasta>]'));
    return 2;
  }
  const extra = [...args.flags.entries()].filter(([k]) => k === 'exams').map(([, v]) => path.resolve(String(v)));
  const roots = [...builtInRoots(), ...extra];
  const challenges = loadChallenges(roots).challenges;
  const quizzes = loadQuizzes(roots).quizzes;
  const exams = loadExams([path.join(ROOT, 'exams'), ...extra], challenges, quizzes).exams;
  const { javaHome, ...cOptions } = tools(args);
  let failed = 0;
  for (const file of args.positional) {
    try {
      const report = await verifyResults(path.resolve(file), exams, javaHome, cOptions);
      console.log(`\n${file}`);
      formatVerification(report).forEach((l) => console.log(l));
      if (!report.matches) failed++;
    } catch (e) {
      console.log(`\n${file}\n✗ ${(e as Error).message}`);
      failed++;
    }
  }
  return failed ? 1 : 0;
}

export async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);
  setLanguage(flag(args, 'lang') ?? process.env.SPHINX_LANG ?? 'en');
  const [command, ...rest] = args.positional;
  args.positional = rest;
  if (args.flags.has('version') || command === 'version') {
    console.log(JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version);
    return 0;
  }
  switch (command) {
    case 'validate':
      return validate(args);
    case 'test':
      return test(args);
    case 'pack':
      return pack(args);
    case 'verify':
      return verify(args);
    case undefined:
    case 'help':
      console.log(HELP());
      return 0;
    default:
      console.error(tr(`Unknown command "${command}".`, `Comando desconhecido "${command}".`));
      console.log(HELP());
      return 2;
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(e instanceof Error ? e.message : e);
      process.exit(1);
    },
  );
}
