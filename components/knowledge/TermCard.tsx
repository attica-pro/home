import Link from 'next/link';

import type { Locale } from '@/i18n';
import { termHref, type GlossaryTerm } from '@/lib/glossary';

export function TermCard({ term, locale }: { term: GlossaryTerm; locale: Locale }) {
  return (
    <Link
      href={termHref(locale, term.slug)}
      className="block rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent/50 hover:bg-secondary"
    >
      <span className="block font-semibold text-primary">{term.term[locale]}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{term.short[locale]}</span>
    </Link>
  );
}
