// Generated test inputs: a test can describe a big input (100 000 numbers, a long text) with a seed and a
// few lines of recipe instead of storing it, so efficiency can be tested without bloating challenge.json.
// The same recipe gives the same input on every computer. Declarative only: imported packs can't run code.
// No vscode dependency (the validator and the CLI use it).

/** One line of a generated input: literal text, numbers or characters. */
export type GeneratedLine =
  | string
  | {
      /** How many numbers per line, separated by spaces. */
      ints: number;
      /** The range of every number, or one range per column, such as min [0, 1] and max [1000000000, 60]. */
      min: number | number[];
      max: number | number[];
      /** How many lines like this (1 by default). */
      rows?: number;
      /** Each line in ascending order (one range for every number only). */
      sorted?: boolean;
      /** No number repeated within a line (one range for every number only). */
      distinct?: boolean;
    }
  | {
      /** How many characters per line, drawn from `alphabet` (repeat a character to make it more common). */
      chars: number;
      alphabet: string;
      rows?: number;
    };

export interface GeneratedInput {
  seed: number;
  lines: GeneratedLine[];
}

/** The largest input a recipe may produce, in numbers or characters, so a typo can't freeze VS Code. */
export const MAX_GENERATED_VALUES = 2_000_000;

/** What is wrong with a recipe (empty when it is fine). */
export function generateProblems(spec: unknown): string[] {
  const s = spec as GeneratedInput;
  if (!s || typeof s !== 'object' || Array.isArray(s)) {
    return ['"generate" must be an object with "seed" and "lines"'];
  }
  const problems: string[] = [];
  if (!Number.isSafeInteger(s.seed)) {
    problems.push('"generate.seed" must be a whole number');
  }
  if (!Array.isArray(s.lines) || s.lines.length === 0) {
    return [...problems, '"generate.lines" must be a list of lines'];
  }
  let total = 0;
  s.lines.forEach((line, i) => {
    const where = `"generate.lines[${i}]"`;
    if (typeof line === 'string') {
      total += line.length;
      return;
    }
    if (!line || typeof line !== 'object') {
      problems.push(`${where} must be text or an object with "ints" or "chars"`);
      return;
    }
    const rows = line.rows ?? 1;
    if (!Number.isInteger(rows) || rows < 1) {
      problems.push(`${where}: "rows" must be a whole number above 0`);
      return;
    }
    if ('ints' in line && (Array.isArray(line.min) || Array.isArray(line.max))) {
      const mins = line.min as unknown[];
      const maxs = line.max as unknown[];
      if (!Number.isInteger(line.ints) || line.ints < 1) {
        problems.push(`${where}: "ints" must be a whole number above 0`);
      } else if (!Array.isArray(mins) || !Array.isArray(maxs) || mins.length !== line.ints || maxs.length !== line.ints) {
        problems.push(`${where}: per-column "min" and "max" must both be lists with one value per number (${line.ints})`);
      } else if (mins.some((lo, c) => !Number.isSafeInteger(lo) || !Number.isSafeInteger(maxs[c]) || (lo as number) > (maxs[c] as number) || !Number.isSafeInteger((maxs[c] as number) - (lo as number) + 1))) {
        problems.push(`${where}: every column needs whole numbers with min <= max`);
      } else if (line.sorted || line.distinct) {
        problems.push(`${where}: "sorted" and "distinct" need one range for every number, not one per column`);
      } else {
        total += line.ints * rows;
      }
    } else if ('ints' in line) {
      if (!Number.isInteger(line.ints) || line.ints < 1) {
        problems.push(`${where}: "ints" must be a whole number above 0`);
      } else if (!Number.isSafeInteger(line.min) || !Number.isSafeInteger(line.max) || line.min > line.max) {
        problems.push(`${where}: "min" and "max" must be whole numbers with min <= max (at most ${Number.MAX_SAFE_INTEGER} in size)`);
      } else if (!Number.isSafeInteger((line.max as number) - (line.min as number) + 1)) {
        problems.push(`${where}: the range from "min" to "max" is too wide`);
      } else if (line.distinct && line.ints > (line.max as number) - (line.min as number) + 1) {
        problems.push(`${where}: ${line.ints} distinct numbers don't fit between ${line.min} and ${line.max}`);
      } else {
        total += line.ints * rows;
      }
    } else if ('chars' in line) {
      if (!Number.isInteger(line.chars) || line.chars < 1) {
        problems.push(`${where}: "chars" must be a whole number above 0`);
      } else if (typeof line.alphabet !== 'string' || !line.alphabet.length || /[\r\n]/.test(line.alphabet)) {
        problems.push(`${where}: "alphabet" must list the characters to use (no line breaks)`);
      } else {
        total += line.chars * rows;
      }
    } else {
      problems.push(`${where} must be text or an object with "ints" or "chars"`);
    }
  });
  if (total > MAX_GENERATED_VALUES) {
    problems.push(`"generate" makes ${total} values; the most is ${MAX_GENERATED_VALUES}`);
  }
  return problems;
}

/** mulberry32: small, fast and the same in every JavaScript engine. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
}

/** A whole number from 0 to span - 1 (span up to 2^53), from two 32-bit draws. */
function below(next: () => number, span: number): number {
  const r53 = (next() >>> 5) * 67108864 + (next() >>> 6); // 27 + 26 bits
  return Math.floor((r53 / 9007199254740992) * span);
}

function intRow(next: () => number, line: Extract<GeneratedLine, { ints: number }>): number[] {
  if (Array.isArray(line.min)) {
    const mins = line.min;
    const maxs = line.max as number[];
    return mins.map((lo, c) => lo + below(next, maxs[c] - lo + 1));
  }
  const min = line.min;
  const span = (line.max as number) - min + 1;
  let values: number[];
  if (line.distinct) {
    // Floyd's sampling: `ints` different numbers from the span, without listing the whole span.
    const picked = new Set<number>();
    for (let j = span - line.ints; j < span; j++) {
      const t = below(next, j + 1);
      picked.add(picked.has(t) ? j : t);
    }
    values = [...picked];
    for (let i = values.length - 1; i > 0; i--) {
      const k = below(next, i + 1);
      [values[i], values[k]] = [values[k], values[i]];
    }
  } else {
    values = Array.from({ length: line.ints }, () => below(next, span));
  }
  values = values.map((v) => v + min);
  return line.sorted ? values.sort((a, b) => a - b) : values;
}

/** Builds the input a recipe describes. Throws on a recipe generateProblems rejects. */
export function generateInput(spec: GeneratedInput): string {
  const problems = generateProblems(spec);
  if (problems.length) {
    throw new Error(problems.join('; '));
  }
  const next = random(spec.seed);
  const out: string[] = [];
  for (const line of spec.lines) {
    if (typeof line === 'string') {
      out.push(line);
      continue;
    }
    for (let r = 0; r < (line.rows ?? 1); r++) {
      if ('ints' in line) {
        out.push(intRow(next, line).join(' '));
      } else {
        const chars = Array.from(line.alphabet);
        out.push(Array.from({ length: line.chars }, () => chars[below(next, chars.length)]).join(''));
      }
    }
  }
  return out.join('\n') + '\n';
}

// The last few inputs built, so Run, Submit and the validator don't rebuild them on every test.
const cache = new Map<string, string>();
const CACHE_SIZE = 8;

/** A test's input: its "input", or the input its "generate" recipe builds. */
export function testInput(test: { input?: string; generate?: GeneratedInput }): string {
  if (!test.generate) {
    return test.input ?? '';
  }
  const key = JSON.stringify(test.generate);
  let input = cache.get(key);
  if (input === undefined) {
    input = generateInput(test.generate);
    if (cache.size >= CACHE_SIZE) {
      cache.delete(cache.keys().next().value!);
    }
    cache.set(key, input);
  }
  return input;
}

/** A short stand-in for a generated input in results (a full one can be megabytes). */
export function inputPreview(test: { input?: string; generate?: GeneratedInput }): string {
  if (!test.generate) {
    return test.input ?? '';
  }
  const input = testInput(test);
  return input.length <= 200 ? input : `${input.slice(0, 200)}… (${input.length} characters, generated)`;
}
