import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { getAllGuides, getGuideBySlug, getChapterContent, getAdjacentChapters } from '@/lib/guides';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  const guides = getAllGuides();
  return locales.flatMap((locale) =>
    guides.flatMap((guide) => guide.chapters.map((chapter) => ({ locale, guide: guide.slug, chapter: chapter.slug }))),
  );
}

export async function generateMetadata({
  params: { locale, guide: guideSlug, chapter: chapterSlug },
}: {
  params: { locale: string; guide: string; chapter: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const guide = getGuideBySlug(guideSlug);
  if (!guide) return {};
  const chapter = guide.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return {};

  return {
    title: `${chapter.title[locale as Locale]} — ${guide.title[locale as Locale]}`,
    description: guide.excerpt[locale as Locale],
  };
}

export default async function GuideChapterPage({
  params: { locale, guide: guideSlug, chapter: chapterSlug },
}: {
  params: { locale: Locale; guide: string; chapter: string };
}) {
  setRequestLocale(locale);
  const guide = getGuideBySlug(guideSlug);
  if (!guide) notFound();

  const { index, prev, next } = getAdjacentChapters(guide, chapterSlug);
  const chapter = index >= 0 ? guide.chapters[index] : null;
  if (!chapter) notFound();

  const content = getChapterContent(guideSlug, chapterSlug, locale);
  if (!content) notFound();

  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <article className="container max-w-3xl py-16 md:py-24">
      <Link
        href={`/${locale}/knowledge-hub/${guide.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> {t('backToGuide')}
      </Link>

      <div className="mt-6">
        <Badge variant={guide.category === 'insulation' ? 'secondary' : 'accent'}>
          {guide.category === 'insulation' ? tCommon('categoryInsulation') : tCommon('categoryPainting')}
        </Badge>
        <p className="mt-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {guide.title[locale]}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-primary md:text-4xl">
          {chapter.title[locale]}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t('partLabel', { current: index + 1, total: guide.chapters.length })}
        </p>
      </div>

      <div className="mt-6 flex gap-1.5">
        {guide.chapters.map((c, i) => (
          <span
            key={c.slug}
            className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-accent' : 'bg-muted'}`}
          />
        ))}
      </div>

      <div className="prose prose-slate mt-10 max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-primary prose-a:text-accent">
        <MDXRemote source={content} />
      </div>

      <nav className="mt-14 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/${locale}/knowledge-hub/${guide.slug}/${prev.slug}`}
            className="flex items-center gap-2 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              <span className="block text-xs text-muted-foreground">{t('previousPart')}</span>
              <span className="font-medium text-primary">{prev.title[locale]}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/${locale}/knowledge-hub/${guide.slug}/${next.slug}`}
            className="flex items-center justify-end gap-2 rounded-lg border border-border p-4 text-right text-sm transition-colors hover:bg-secondary sm:col-start-2"
          >
            <span>
              <span className="block text-xs text-muted-foreground">{t('nextPart')}</span>
              <span className="font-medium text-primary">{next.title[locale]}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ) : (
          <div className="flex flex-col items-end justify-center gap-2 rounded-lg border border-dashed border-accent p-4 text-right sm:col-start-2">
            <span className="text-sm font-medium text-accent">{t('guideComplete')}</span>
            <Button asChild size="sm" variant="accent">
              <Link href={`/${locale}/contact`}>
                {t('askUs')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </article>
  );
}
