import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { serviceSlugs } from '@/data/services';
import { getAllTerms, sortTerms } from '@/lib/glossary';
import { GlossaryIndex } from '@/components/knowledge/GlossaryIndex';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  return { title: t('glossaryTitle'), description: t('glossarySubtitle') };
}

export default async function GlossaryPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services.items' });
  const terms = sortTerms(getAllTerms(), locale);
  const categories = serviceSlugs
    .filter((slug) => terms.some((term) => term.categories.includes(slug)))
    .map((slug) => ({ slug, name: tServices(`${slug}.name`) }));

  return (
    <div className="container max-w-5xl py-16 md:py-24">
      <Link href={`/${locale}/knowledge-hub`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('title')}
      </Link>
      <div className="mx-auto mb-10 mt-6 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">{t('glossaryTitle')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('glossarySubtitle')}</p>
      </div>
      <GlossaryIndex
        locale={locale}
        allLabel={t('filterAll')}
        categories={categories}
        terms={terms.map((term) => ({ slug: term.slug, term: term.term[locale], short: term.short[locale], categories: term.categories }))}
      />
    </div>
  );
}
