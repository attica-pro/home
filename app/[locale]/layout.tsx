import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { locales, type Locale } from '@/i18n';
import { siteUrl } from '@/lib/site-config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { LangSync } from '@/components/layout/LangSync';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('siteName')}`,
    },
    description: t('defaultDescription'),
    metadataBase: new URL(siteUrl),
    alternates: {
      languages: {
        el: '/el',
        en: '/en',
      },
    },
    openGraph: {
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LangSync locale={locale as Locale} />
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
      <FloatingActionButton />
    </NextIntlClientProvider>
  );
}
