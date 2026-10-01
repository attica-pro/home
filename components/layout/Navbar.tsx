import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Logo } from '@/components/layout/Logo';

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');

  const links = [
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/knowledge-hub`, label: t('knowledgeHub') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`}>
          <Logo withTrades />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <LocaleSwitcher />
          <Button asChild variant="accent" size="sm" className="hidden lg:inline-flex">
            <Link href={`/${locale}/contact`}>{t('getQuote')}</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
