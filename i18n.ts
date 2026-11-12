import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const supportedLocales = ['el', 'en'] as const;
export type Locale = (typeof supportedLocales)[number];
// Locales served: Greek and English (Arabic support disabled per user request).
export const locales: readonly Locale[] = ['el', 'en'];
export const defaultLocale: Locale = 'el';
export const rtlLocales: readonly Locale[] = [];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
