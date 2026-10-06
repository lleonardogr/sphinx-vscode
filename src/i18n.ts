// Interface and content language. English is the default; "pt-br" switches to Portuguese (Brazil).
// Strings are written in place as tr('English', 'Português'), so a translation always sits next to
// its original. Content files carry their own translations (see challenges.ts and quizzes.ts).
// No vscode dependency: the extension sets the language from the sphinx.language setting.

export type Lang = 'en' | 'pt-br';
export const LANGUAGES: Lang[] = ['en', 'pt-br'];

let current: Lang = 'en';

export function setLanguage(lang: string | undefined): void {
  current = lang === 'pt-br' ? 'pt-br' : 'en';
}

export function language(): Lang {
  return current;
}

/** The text for the current language. */
export function tr(en: string, ptBr: string): string {
  return current === 'pt-br' ? ptBr : en;
}

/** "1 challenge" / "2 challenges", in the current language. */
export function plural(n: number, en: [string, string], ptBr: [string, string]): string {
  const [one, many] = current === 'pt-br' ? ptBr : en;
  return `${n} ${n === 1 ? one : many}`;
}

/** Easy / Medium / Hard in the current language (challenge.json keeps the English value). */
export function difficultyName(d: string): string {
  return tr(d, ({ Easy: 'Fácil', Medium: 'Médio', Hard: 'Difícil' } as Record<string, string>)[d] ?? d);
}
