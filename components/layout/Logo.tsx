import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

/**
 * The brand mark: a drop falling onto a flat roof slab that carries the clay protective layer.
 * Colours are fixed so it reads the same everywhere.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="9" fill="#5E6B3A" />
      <path d="M24 6c0 0-7.4 8.8-7.4 13.6a7.4 7.4 0 0 0 14.8 0C31.4 14.8 24 6 24 6z" fill="#F7F3EC" />
      <rect x="8" y="30" width="32" height="4" rx="1.2" fill="#D8906D" />
      <rect x="8" y="35" width="32" height="6" rx="1.4" fill="#F7F3EC" />
    </svg>
  );
}

export function Logo({ className, withTrades = false }: { className?: string; withTrades?: boolean }) {
  const t = useTranslations('common');

  return (
    <span className={cn('flex items-center gap-2.5 text-foreground', className)}>
      <Mark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col">
        <span className="font-display text-lg font-extrabold leading-none tracking-tight" dir="ltr">
          AtticaPro
        </span>
        {withTrades && <span className="mt-1 hidden whitespace-nowrap text-[11px] leading-none text-muted-foreground min-[400px]:block">{t('trades')}</span>}
      </span>
    </span>
  );
}
