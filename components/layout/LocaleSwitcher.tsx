'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

import { locales } from '@/i18n';
import { cn } from '@/lib/utils';

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(nextLocale: string) {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/') || '/');
  }

  return (
    <div className={cn('flex items-center gap-1 text-sm font-medium', className)}>
      <Globe className="hidden h-4 w-4 text-muted-foreground sm:block" />
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          <button
            onClick={() => switchTo(loc)}
            className={cn(
              'px-1 py-1 uppercase transition-colors sm:px-1.5',
              loc === locale ? 'text-accent font-semibold' : 'text-muted-foreground hover:text-foreground',
            )}
            aria-current={loc === locale}
          >
            {loc}
          </button>
          {i < locales.length - 1 && <span className="text-border">/</span>}
        </span>
      ))}
    </div>
  );
}
