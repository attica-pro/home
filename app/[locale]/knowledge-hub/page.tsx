import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, BookA } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { serviceIcons, serviceSlugs } from '@/data/services';
import { getAllGuides } from '@/lib/guides';
import { getAllTerms, getTermsByCategory, sortTerms, termHref } from '@/lib/glossary';
import { GuideCard } from '@/components/knowledge/GuideCard';
import { AnswerCard } from '@/components/knowledge/AnswerCard';
import { getAllAnswers } from '@/lib/answers';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function KnowledgeHubPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services.items' });
  const guides = getAllGuides();
  const terms = sortTerms(getAllTerms(), locale);
  const answers = getAllAnswers();

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      <section>
        <h2 className="font-display text-2xl font-semibold text-primary">{t('categoriesTitle')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSlugs.map((slug) => {
            const Icon = serviceIcons[slug];
            const guideCount = guides.filter((guide) => guide.category === slug).length;
            const termCount = getTermsByCategory(slug, locale).length;
            return (
              <Link
                key={slug}
                href={`/${locale}/knowledge-hub/${slug}`}
                className="flex items-start gap-3 rounded-lg border-2 border-border p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
              >
                <Icon className="mt-0.5 h-8 w-8 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-semibold text-primary">{tServices(`${slug}.title`)}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {t('guideCount', { count: guideCount })} · {t('termCount', { count: termCount })}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {terms.length > 0 && (
        <section className="mt-14 rounded-xl bg-secondary p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-primary">
                <BookA className="h-6 w-6 text-accent" /> {t('glossaryTitle')}
              </h2>
              <p className="mt-2 text-muted-foreground">{t('glossarySubtitle')}</p>
            </div>
            <Button asChild variant="accent">
              <Link href={`/${locale}/knowledge-hub/glossary`}>
                {t('glossaryCta')} ({terms.length}) <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {terms.slice(0, 16).map((term) => (
              <Link
                key={term.slug}
                href={termHref(locale, term.slug)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
              >
                {term.term[locale]}
              </Link>
            ))}
          </div>
        </section>
      )}

      {answers.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-primary">{t('answersTitle')}</h2>
            <Link href={`/${locale}/knowledge-hub/answers`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              {t('answersCta')} ({answers.length}) <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {answers.filter((answer) => answer.order === 1).map((answer) => (
              <AnswerCard key={answer.slug} answer={answer} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-primary">{t('guidesTitle')}</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
