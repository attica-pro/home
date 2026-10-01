'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { serviceIcons, serviceSlugs, type ServiceSlug } from '@/data/services';
import { useUIStore } from '@/store/useUIStore';
import { Logo } from '@/components/layout/Logo';

export function MobileMenu() {
  const t = useTranslations('nav');
  const tServices = useTranslations('services.items');
  const locale = useLocale();
  const isOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);

  const links: { href: string; label: string; service?: ServiceSlug }[] = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/services`, label: t('services') },
    ...serviceSlugs.map((slug) => ({ href: `/${locale}/services/${slug}`, label: tServices(`${slug}.name`), service: slug })),
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/knowledge-hub`, label: t('knowledgeHub') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle asChild>
          <Logo />
        </SheetTitle>
        <nav className="mt-8 flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.service && serviceIcons[link.service];
            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 text-foreground hover:bg-muted',
                    link.service ? 'py-2 ps-6 text-sm text-muted-foreground' : 'py-3 text-base font-medium'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-foreground" />}
                  {link.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
          <LocaleSwitcher />
          <SheetClose asChild>
            <Button asChild size="sm" variant="accent">
              <Link href={`/${locale}/contact`}>{t('getQuote')}</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
