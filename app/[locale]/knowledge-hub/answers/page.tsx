import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { serviceSlugs } from '@/data/services';
import { getAnswersByCategory } from '@/lib/answers';
import { AnswerCard } from '@/components/knowledge/AnswerCard';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  return { title: t('answersTitle'), description: t('answersSubtitle') };
}

export default async function AnswersPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services.items' });
  const groups = serviceSlugs.map((slug) => ({ slug, answers: getAnswersByCategory(slug) })).filter((g) => g.answers.length);

  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <Link href={`/${locale}/knowledge-hub`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('title')}
      </Link>
      <div className="mx-auto mb-12 mt-6 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">{t('answersTitle')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('answersSubtitle')}</p>
      </div>
      <div className="space-y-12">
        {groups.map(({ slug, answers }) => (
          <section key={slug}>
            <h2 className="font-display text-2xl font-semibold text-primary">
              <Link href={`/${locale}/knowledge-hub/${slug}`} className="hover:text-accent">
                {tServices(`${slug}.title`)}
              </Link>
            </h2>
            <div className="mt-4 grid gap-3">
              {answers.map((answer) => (
                <AnswerCard key={answer.slug} answer={answer} locale={locale} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
