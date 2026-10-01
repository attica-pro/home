import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import type { Locale } from '@/i18n';
import { Hero } from '@/components/home/Hero';
import { ServicesSnippet } from '@/components/home/ServicesSnippet';
import { ProcessSteps } from '@/components/home/ProcessSteps';
import { RecentWork } from '@/components/home/RecentWork';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('defaultTitle'),
    description: t('defaultDescription'),
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  return (
    <>
      <Hero locale={locale} />
      <ServicesSnippet locale={locale} />
      <ProcessSteps />
      <RecentWork locale={locale} />
    </>
  );
}
