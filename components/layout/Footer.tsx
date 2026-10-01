import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

import { serviceIcons, serviceSlugs } from '@/data/services';
import { siteConfig } from '@/lib/site-config';
import { Logo } from '@/components/layout/Logo';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tServices = useTranslations('services.items');
  const tCommon = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground bg-secondary">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link href={`/${locale}`}>
            <Logo withTrades />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">{t('tagline')}</p>
          <div className="mt-4 flex gap-3">
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">{t('quickLinks')}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href={`/${locale}/portfolio`} className="text-muted-foreground hover:text-accent">{tNav('portfolio')}</Link></li>
            <li><Link href={`/${locale}/knowledge-hub`} className="text-muted-foreground hover:text-accent">{tNav('knowledgeHub')}</Link></li>
            <li><Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-accent">{tNav('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">{t('servicesTitle')}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {serviceSlugs.map((slug) => {
              const Icon = serviceIcons[slug];
              return (
                <li key={slug}>
                  <Link href={`/${locale}/services/${slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-accent">
                    <Icon className="h-4 w-4 shrink-0 text-foreground" />
                    {tServices(`${slug}.title`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">{t('contactTitle')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <a href={siteConfig.phoneHref} dir="ltr" className="hover:text-accent">{siteConfig.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <a href={siteConfig.landlineHref} dir="ltr" className="hover:text-accent">{siteConfig.landlineDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> {siteConfig.email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <a href={siteConfig.mapsHref} target="_blank" rel="noreferrer" className="hover:text-accent">{tCommon('address')}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {year} AtticaPro. {t('rights')}
      </div>
    </footer>
  );
}
