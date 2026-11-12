'use client';

import { useTranslations } from 'next-intl';
import { Phone } from 'lucide-react';

import { siteConfig } from '@/lib/site-config';

export function FloatingActionButton() {
  const t = useTranslations('fab');

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-px border-t border-border bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden">
      <a
        href={siteConfig.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 bg-primary px-3 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Phone className="h-4 w-4 shrink-0 text-clay" />
        <span className="truncate">{t('call')}</span>
      </a>
      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="flex flex-1 items-center justify-center gap-2 bg-accent px-3 py-3.5 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/90"
      >
        <WhatsAppIcon className="h-4 w-4 shrink-0" />
        <span className="truncate">{t('whatsapp')}</span>
      </a>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2c-5.514 0-9.983 4.469-9.983 9.983 0 1.76.46 3.483 1.335 5.003L2 22l5.146-1.334a9.94 9.94 0 004.855 1.237h.004c5.514 0 9.983-4.47 9.983-9.983S17.515 2 12.001 2zm0 18.28h-.003a8.28 8.28 0 01-4.223-1.156l-.303-.18-3.052.79.815-2.976-.198-.306a8.267 8.267 0 01-1.271-4.469c0-4.57 3.719-8.288 8.29-8.288 2.213 0 4.293.863 5.86 2.43a8.235 8.235 0 012.427 5.862c0 4.57-3.72 8.293-8.342 8.293z" />
    </svg>
  );
}
