import fs from 'node:fs';
import path from 'node:path';

import type { Locale } from '@/i18n';
import type { ServiceSlug } from '@/data/services';

const ANSWERS_DIR = path.join(process.cwd(), 'content/answers');

/** A quick answer: one homeowner question, answered briefly and grounded in real jobs. */
export interface Answer {
  slug: string;
  category: ServiceSlug;
  /** Display order within the category. */
  order: number;
  question: Record<Locale, string>;
  /** The direct answer in a sentence or two, shown on cards. */
  short: Record<Locale, string>;
  /** Markdown. Images are written as `<project-slug>/<file>`. */
  body: Record<Locale, string>;
  /** Jobs that show the answer. */
  projects: string[];
}

let cache: Answer[] | null = null;

export function getAllAnswers(): Answer[] {
  if (!cache) {
    cache = fs.existsSync(ANSWERS_DIR)
      ? fs
          .readdirSync(ANSWERS_DIR)
          .filter((file) => file.endsWith('.json'))
          .map((file) => ({
            slug: file.replace(/\.json$/, ''),
            ...(JSON.parse(fs.readFileSync(path.join(ANSWERS_DIR, file), 'utf8')) as Omit<Answer, 'slug'>),
          }))
          .sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order)
      : [];
  }
  return cache;
}

export function getAnswer(slug: string): Answer | null {
  return getAllAnswers().find((answer) => answer.slug === slug) ?? null;
}

export function getAnswersByCategory(category: ServiceSlug): Answer[] {
  return getAllAnswers().filter((answer) => answer.category === category);
}

/** Answers that use this job as an example. */
export function getAnswersForProject(projectSlug: string): Answer[] {
  return getAllAnswers().filter((answer) => answer.projects.includes(projectSlug));
}

export function answerHref(locale: string, slug: string) {
  return `/${locale}/knowledge-hub/answers/${slug}`;
}
