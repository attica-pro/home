import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/contact/ContactForm';
import { siteConfig } from '@/lib/site-config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <CardTitle className="mb-6 text-xl">{t('formTitle')}</CardTitle>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <CardTitle className="text-xl">{t('directTitle')}</CardTitle>
              <a href={siteConfig.phoneHref} className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-accent">
                <Phone className="h-5 w-5 text-accent" /> {t('callUs')}: <span dir="ltr">{siteConfig.phoneDisplay}</span>
              </a>
              <a href={siteConfig.landlineHref} className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-accent">
                <Phone className="h-5 w-5 text-accent" /> {t('landline')}: <span dir="ltr">{siteConfig.landlineDisplay}</span>
              </a>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-accent"
              >
                <MessageCircle className="h-5 w-5 text-accent" /> {t('whatsapp')}
              </a>
              <a
                href={siteConfig.viberHref}
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-accent"
              >
                <MessageCircle className="h-5 w-5 text-accent" /> {t('viber')}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 pt-6">
              <CardTitle className="text-xl">{t('areaTitle')}</CardTitle>
              <a
                href={siteConfig.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-sm font-medium text-foreground hover:text-accent"
              >
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {tCommon('address')}
              </a>
              <p className="ps-8 text-sm text-muted-foreground">{t('areaText')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
