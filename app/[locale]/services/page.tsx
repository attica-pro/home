import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { locales, type Locale } from '@/i18n';
import { ServiceCards } from '@/components/services/ServiceCards';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'services' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'services' });

  return (
    <>
      <section className="bg-secondary border-b border-border">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
      </section>
      <section className="container py-16 md:py-24">
        <ServiceCards locale={locale} />
      </section>
    </>
  );
}
