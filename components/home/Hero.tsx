import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { serviceIllustration } from '@/data/services';
import { assetPath, siteConfig } from '@/lib/site-config';

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations('hero');

  return (
    <section className="border-b border-foreground">
      <div className="container grid items-end gap-6 pt-12 md:grid-cols-2 md:gap-10 md:pt-16">
        <div className="min-w-0 pb-4 md:pb-20">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="mt-5 font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t('subtitle')}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" variant="accent">
              <Link href={`/${locale}/contact`}>
                {t('ctaPrimary')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="max-md:hidden">
              <a href={siteConfig.phoneHref} dir="ltr">
                {siteConfig.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>

        <Image
          src={assetPath(serviceIllustration('insulation'))}
          alt={t('illustrationAlt')}
          width={600}
          height={800}
          priority
          className="mx-auto h-auto w-full max-w-sm md:max-h-[600px] md:w-auto md:max-w-full"
        />
      </div>
    </section>
  );
}
