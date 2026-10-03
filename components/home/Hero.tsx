import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { assetPath, siteConfig } from '@/lib/site-config';

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  const trust = [t('trustYears'), t('trustTeam'), t('trustFree')];

  return (
    <section className="border-b border-foreground">
      <div className="relative overflow-hidden">
        <div className="container relative grid items-end gap-0 pt-12 md:grid-cols-2 md:gap-10 md:pt-20">
          <div className="min-w-0 pb-10 md:pb-24">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="mt-5 font-display text-5xl font-black uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t('subtitle')}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" variant="accent" className="text-base font-bold">
                <Link href={`/${locale}/contact`}>
                  {t('ctaPrimary')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 font-bold">
                <a href={siteConfig.phoneHref} dir="ltr">
                  <Phone className="h-4 w-4" /> {siteConfig.phoneDisplay}
                </a>
              </Button>
            </div>
          </div>

          <div>
            <Image
              src={assetPath('/images/hero-mohamed.png')}
              alt={t('illustrationAlt')}
              width={720}
              height={964}
              priority
              className="mx-auto h-auto w-full max-w-xs md:max-h-[640px] md:w-auto md:max-w-full"
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-foreground bg-accent text-accent-foreground">
        <ul className="container grid gap-x-8 gap-y-2 py-4 text-sm font-bold uppercase tracking-wide sm:grid-cols-3 sm:text-center">
          {trust.map((item) => (
            <li key={item} className="font-display">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
