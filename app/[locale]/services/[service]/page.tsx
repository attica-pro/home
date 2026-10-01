import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { locales, type Locale } from '@/i18n';
import { isServiceSlug, serviceSlugs } from '@/data/services';
import { ServicePageContent } from '@/components/services/ServicePageContent';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((service) => ({ locale, service })));
}

export async function generateMetadata({
  params: { locale, service },
}: {
  params: { locale: string; service: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `services.items.${service}` });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ServicePage({ params: { locale, service } }: { params: { locale: Locale; service: string } }) {
  setRequestLocale(locale);
  if (!isServiceSlug(service)) notFound();
  return <ServicePageContent locale={locale} slug={service} />;
}
