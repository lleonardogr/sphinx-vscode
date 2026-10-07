// Lessons: the reading before a unit's quiz and challenges. A lesson is a folder with lesson.json
// (title, unit, order, reading time, prerequisites, objectives, readings) and lesson.md, plus
// lesson.<lang>.md for translations. A reading guide keeps lesson.md short ("In short") and lists
// curated readings from the web; see docs/content-guide.md. Images next to lesson.md can be used
// with relative paths. No vscode dependency.
import * as fs from 'fs';
import * as path from 'path';
import { Lang, language } from './i18n';

export const READING_TYPES = ['article', 'video', 'interactive'] as const;
export type ReadingType = (typeof READING_TYPES)[number];

/** A curated reading from the web: shown as a card that opens in the browser. */
export interface Reading {
  title: string;
  source: string;
  url: string;
  type: ReadingType;
  minutes: number;
  /** Language of the reading, such as "en". */
  lang: string;
  /** What to pay attention to while reading, in the current language. */
  lookFor: string;
}

/** Marks where the reading cards go in lesson.md; without it they go after the text. */
export const READINGS_MARKER = '<!-- readings -->';

export interface LessonDefinition {
  id: string;
  title: string;
  /** The unit it belongs to (a unit key from a subject.json). */
  topic: string;
  order: number;
  /** Estimated reading time. */
  minutes: number;
  /** The lesson text (Markdown), in the current language. */
  body: string;
  /** Units the student should know first, e.g. ["Loops"]. */
  requires: string[];
  /** What a student can do after the unit, in the current language. */
  objectives: string[];
  /** Curated readings (reading guides); empty for a plain lesson. */
  readings: Reading[];
  /** The subject, when the lesson has no unit. */
  subject?: string;
  dir: string;
}

/** Readings from lesson.json; entries that aren't complete https links are left out (the validator reports them). */
export function parseReadings(raw: unknown, translated?: unknown): Reading[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const t = Array.isArray(translated) ? translated : [];
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  return raw.flatMap((r, i): Reading[] => {
    const url = text(r?.url);
    const type = READING_TYPES.find((x) => x === r?.type);
    if (!text(r?.title) || !url.startsWith('https://') || !type) {
      return [];
    }
    return [
      {
        title: text(r.title),
        source: text(r.source),
        url,
        type,
        minutes: typeof r.minutes === 'number' && r.minutes > 0 ? Math.round(r.minutes) : 0,
        lang: text(r.lang) || 'en',
        lookFor: text(t[i]?.lookFor) || text(r.lookFor),
      },
    ];
  });
}

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim()) : []);

/** Reading time from the text: about 180 words a minute for beginners, at least 1 minute. */
export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function loadLesson(dir: string, lang: Lang = language()): LessonDefinition {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'lesson.json'), 'utf8'));
  if (typeof meta.title !== 'string' || !meta.title.trim()) {
    throw new Error('lesson.json needs a "title"');
  }
  const read = (file: string) => (fs.existsSync(path.join(dir, file)) ? fs.readFileSync(path.join(dir, file), 'utf8') : '');
  const body = (lang !== 'en' && read(`lesson.${lang}.md`)) || read('lesson.md');
  if (!body.trim()) {
    throw new Error('the lesson needs a lesson.md');
  }
  const t = (lang !== 'en' && meta.translations?.[lang]) || {};
  return {
    id: meta.id ?? path.basename(dir),
    title: (typeof t.title === 'string' && t.title.trim()) || meta.title,
    topic: typeof meta.topic === 'string' ? meta.topic.trim() : '',
    order: typeof meta.order === 'number' ? meta.order : 0,
    minutes: typeof meta.minutes === 'number' && meta.minutes > 0 ? meta.minutes : readingMinutes(body),
    body,
    requires: strings(meta.requires),
    objectives: strings(t.objectives).length ? strings(t.objectives) : strings(meta.objectives),
    readings: parseReadings(meta.readings, t.readings),
    subject: typeof meta.subject === 'string' && meta.subject.trim() ? meta.subject.trim() : undefined,
    dir,
  };
}

/**
 * Points the relative images of a rendered lesson (e.g. ![place values](place-values.svg)) at files
 * in the lesson's folder; `toUri` turns a file path into a URL the webview can load. Images outside
 * the folder are dropped. VS Code's renderer also writes data-src="…", which is left as it is.
 */
export function resolveLessonImages(html: string, dir: string, toUri: (file: string) => string): string {
  const root = path.resolve(dir);
  return html.replace(/<img\b[^>]*>/g, (tag) =>
    tag.replace(/(\ssrc=")(?!https?:|data:|vscode-)([^"]+)"/, (_m, start: string, src: string) => {
      let file: string;
      try {
        file = path.resolve(root, decodeURIComponent(src));
      } catch {
        return `${start}"`;
      }
      return file.startsWith(root + path.sep) ? `${start}${toUri(file)}"` : `${start}"`;
    }),
  );
}

/** Finds every sub-folder of `roots` that contains a lesson.json. */
export function findLessonDirs(roots: string[]): string[] {
  const dirs: string[] = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) {
      continue;
    }
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const dir = path.join(root, entry.name);
      if (entry.isDirectory() && fs.existsSync(path.join(dir, 'lesson.json'))) {
        dirs.push(dir);
      }
    }
  }
  return dirs;
}

export function loadLessons(roots: string[]): { lessons: LessonDefinition[]; errors: string[] } {
  const byId = new Map<string, LessonDefinition>();
  const errors: string[] = [];
  for (const dir of findLessonDirs(roots)) {
    try {
      const lesson = loadLesson(dir);
      byId.set(lesson.id, lesson);
    } catch (e) {
      errors.push(`${dir}: ${(e as Error).message}`);
    }
  }
  return { lessons: [...byId.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)), errors };
}
