import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageSquare, Phone } from 'lucide-react';

import { siteConfig } from '@/lib/site-config';
import { isServiceSlug, type ServiceSlug } from '@/data/services';
import { Button } from '@/components/ui/button';

interface HubCtaProps {
  locale: string;
  category?: ServiceSlug | string;
  className?: string;
}

export function HubCta({ locale, category, className = '' }: HubCtaProps) {
  const t = useTranslations('hubCta');

  const getTitle = () => {
    if (category === 'insulation') return t('insulationTitle');
    if (category === 'painting') return t('paintingTitle');
    if (category === 'renovations') return t('renovationsTitle');
    return t('generalTitle');
  };

  const hasServiceLink = category && isServiceSlug(category);

  return (
    <aside
      aria-label={t('eyebrow')}
      className={`my-12 overflow-hidden rounded-xl border-2 border-foreground bg-secondary p-6 shadow-sm sm:p-8 ${className}`}
    >
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-clay/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-clay">
          {t('eyebrow')}
        </span>

        <h3 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          {getTitle()}
        </h3>

        <p className="max-w-2xl text-base leading-relaxed text-foreground/85">
          {t('subtitle')}
        </p>

        <div className="mt-4 flex w-full flex-wrap items-center gap-3">
          {/* Primary Mobile Call */}
          <Button asChild size="lg" variant="accent" className="gap-2 font-bold shadow">
            <a href={siteConfig.phoneHref}>
              <Phone className="h-4 w-4" />
              <span>{t('callMobile')} ({siteConfig.phoneDisplay})</span>
            </a>
          </Button>

          {/* WhatsApp */}
          <Button asChild size="lg" variant="outline" className="gap-2 border-foreground hover:bg-card">
            <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span>{t('whatsapp')}</span>
            </a>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border pt-4 text-sm">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            {t('contact')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>

          {hasServiceLink && (
            <Link
              href={`/${locale}/services/${category}`}
              className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-accent hover:underline"
            >
              {t('viewService')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
