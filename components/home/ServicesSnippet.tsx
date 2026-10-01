import { useTranslations } from 'next-intl';

import { ServiceCards } from '@/components/services/ServiceCards';

export function ServicesSnippet({ locale }: { locale: string }) {
  const t = useTranslations('services');

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="mt-12">
          <ServiceCards locale={locale} />
        </div>
      </div>
    </section>
  );
}
