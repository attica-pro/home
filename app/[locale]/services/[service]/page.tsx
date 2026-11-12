import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { locales, type Locale } from '@/i18n';
import { isServiceSlug, serviceSlugs } from '@/data/services';
import { getAllGuides } from '@/lib/guides';
import { getAllProjects, toProjectSummary } from '@/lib/projects';
import { siteUrl } from '@/lib/site-config';
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
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/services/${service}`,
      languages: {
        el: `/el/services/${service}`,
        en: `/en/services/${service}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/services/${service}`,
    },
  };
}

export default function ServicePage({ params: { locale, service } }: { params: { locale: Locale; service: string } }) {
  setRequestLocale(locale);
  if (!isServiceSlug(service)) notFound();
  const works = getAllProjects()
    .filter((project) => project.service === service)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, 3)
    .map((project) => toProjectSummary(project, locale));
  const guides = getAllGuides().filter((guide) => guide.category === service);
  return <ServicePageContent locale={locale} slug={service} works={works} guides={guides} />;
}
