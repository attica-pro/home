import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { getAllGuides, getGuideBySlug } from '@/lib/guides';
import { assetPath } from '@/lib/site-config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  const guides = getAllGuides();
  return locales.flatMap((locale) => guides.map((guide) => ({ locale, guide: guide.slug })));
}

export async function generateMetadata({
  params: { locale, guide: guideSlug },
}: {
  params: { locale: string; guide: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const guide = getGuideBySlug(guideSlug);
  if (!guide) return {};

  return {
    title: guide.title[locale as Locale],
    description: guide.excerpt[locale as Locale],
  };
}

export default async function GuideOverviewPage({
  params: { locale, guide: guideSlug },
}: {
  params: { locale: Locale; guide: string };
}) {
  setRequestLocale(locale);
  const guide = getGuideBySlug(guideSlug);
  if (!guide) notFound();

  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <div>
      <section className="hero-gradient border-b border-border">
        <div className="container max-w-3xl py-16 md:py-20">
          <Link
            href={`/${locale}/knowledge-hub`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> {t('backToHub')}
          </Link>

          <div className="mt-6">
            <Badge variant={guide.category === 'insulation' ? 'secondary' : 'accent'}>
              {guide.category === 'insulation' ? tCommon('categoryInsulation') : tCommon('categoryPainting')}
            </Badge>
            <h1 className="mt-4 font-display text-3xl font-semibold text-primary md:text-4xl">
              {guide.title[locale]}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{guide.excerpt[locale]}</p>
          </div>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={assetPath(guide.coverImage)}
              alt={guide.title[locale]}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container max-w-3xl py-16 md:py-20">
        <h2 className="font-display text-2xl font-semibold text-primary">{t('inThisGuide')}</h2>

        <ol className="mt-6 divide-y divide-border rounded-lg border border-border">
          {guide.chapters.map((chapter, i) => (
            <li key={chapter.slug}>
              <Link
                href={`/${locale}/knowledge-hub/${guide.slug}/${chapter.slug}`}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-secondary"
              >
                <span className="font-hand flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg text-accent">
                  {i + 1}
                </span>
                <span className="flex-1 font-medium text-primary">{chapter.title[locale]}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="accent">
            <Link href={`/${locale}/knowledge-hub/${guide.slug}/${guide.chapters[0].slug}`}>
              {t('startGuide')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
