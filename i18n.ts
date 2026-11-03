import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Every locale the content and messages support (Arabic files are kept so it can be switched back on).
export const supportedLocales = ['el', 'en', 'ar'] as const;
export type Locale = (typeof supportedLocales)[number];
// Locales actually served. Arabic is disabled: add 'ar' here to re-enable it.
export const locales: readonly Locale[] = ['el', 'en'];
export const defaultLocale: Locale = 'el';
export const rtlLocales: readonly Locale[] = ['ar'];

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
