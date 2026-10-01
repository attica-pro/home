import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Handshake } from 'lucide-react';

import { serviceIllustration, serviceSlugs } from '@/data/services';
import { assetPath } from '@/lib/site-config';

/** The seven services as drawings in a ruled grid, then a note about the electricians and plumbers we work with. */
export function ServiceCards({ locale }: { locale: string }) {
  const t = useTranslations('services');

  return (
    <div>
      <div className="grid grid-cols-2 border-s border-t border-border md:grid-cols-3 lg:grid-cols-4">
        {serviceSlugs.map((slug) => (
          <Link
            key={slug}
            href={`/${locale}/services/${slug}`}
            className="group flex flex-col border-b border-e border-border p-3 transition-colors hover:bg-card sm:p-5"
          >
            <Image
              src={assetPath(serviceIllustration(slug))}
              alt=""
              width={600}
              height={800}
              className="w-full transition-transform duration-300 group-hover:-translate-y-1"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <span className="eyebrow mt-3">{t(`items.${slug}.place`)}</span>
            <h3 className="mt-1.5 font-display text-base font-bold leading-snug [hyphens:manual] group-hover:text-accent sm:text-lg">
              {t(`items.${slug}.title`)}
            </h3>
            <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground sm:text-sm sm:leading-normal">{t(`items.${slug}.cardDesc`)}</p>
            <span className="mt-auto hidden items-center gap-1 pt-3 text-sm font-semibold text-accent sm:inline-flex">
              {t('learnMore')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-8 flex max-w-3xl items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        {t('partners')}
      </p>
    </div>
  );
}
