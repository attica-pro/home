import fs from 'node:fs';
import path from 'node:path';

import type { Locale } from '@/i18n';
import type { ServiceSlug } from '@/data/services';

const GUIDES_DIR = path.join(process.cwd(), 'content/guides');

export interface GuideChapterMeta {
  slug: string;
  title: Record<Locale, string>;
}

export interface GuideMeta {
  slug: string;
  category: ServiceSlug;
  coverImage: string;
  date: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  chapters: GuideChapterMeta[];
}

function getGuideSlugs(): string[] {
  return fs.readdirSync(GUIDES_DIR).filter((entry) => fs.statSync(path.join(GUIDES_DIR, entry)).isDirectory());
}

export function getAllGuides(): GuideMeta[] {
  return getGuideSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, slug, 'guide.json'), 'utf8');
      return { slug, ...(JSON.parse(raw) as Omit<GuideMeta, 'slug'>) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGuideBySlug(slug: string): GuideMeta | null {
  const guidePath = path.join(GUIDES_DIR, slug, 'guide.json');
  if (!fs.existsSync(guidePath)) return null;

  const raw = fs.readFileSync(guidePath, 'utf8');
  return { slug, ...(JSON.parse(raw) as Omit<GuideMeta, 'slug'>) };
}

export function getChapterContent(guideSlug: string, chapterSlug: string, locale: Locale): string | null {
  const chapterPath = path.join(GUIDES_DIR, guideSlug, `${chapterSlug}.${locale}.mdx`);
  if (!fs.existsSync(chapterPath)) return null;
  return fs.readFileSync(chapterPath, 'utf8');
}

export function getAdjacentChapters(guide: GuideMeta, chapterSlug: string) {
  const index = guide.chapters.findIndex((chapter) => chapter.slug === chapterSlug);
  return {
    index,
    prev: index > 0 ? guide.chapters[index - 1] : null,
    next: index >= 0 && index < guide.chapters.length - 1 ? guide.chapters[index + 1] : null,
  };
}

/** URL path (without locale) of a guide's overview page. Guides live under their category. */
export function guidePath(guide: Pick<GuideMeta, 'slug' | 'category'>, chapterSlug?: string) {
  return `/knowledge-hub/${guide.category}/${guide.slug}${chapterSlug ? `/${chapterSlug}` : ''}`;
}
