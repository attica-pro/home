'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface GlossaryIndexTerm {
  slug: string;
  term: string;
  short: string;
  categories: string[];
}

/** Letter a term is filed under: its first letter without accents (and, in Arabic, without the article ال). */
function letterOf(term: string, locale: string) {
  const word = locale === 'ar' ? term.replace(/^ال/, '') : term;
  return word.normalize('NFD').replace(/\p{M}/gu, '').charAt(0).toLocaleUpperCase(locale);
}

export function GlossaryIndex({
  terms,
  categories,
  locale,
  allLabel,
}: {
  terms: GlossaryIndexTerm[];
  categories: { slug: string; name: string }[];
  locale: string;
  allLabel: string;
}) {
  const [filter, setFilter] = useState<string>('all');
  const groups = useMemo(() => {
    const visible = filter === 'all' ? terms : terms.filter((term) => term.categories.includes(filter));
    const byLetter = new Map<string, GlossaryIndexTerm[]>();
    for (const term of visible) {
      const letter = letterOf(term.term, locale);
      byLetter.set(letter, [...(byLetter.get(letter) ?? []), term]);
    }
    return [...byLetter.entries()];
  }, [terms, filter, locale]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {[{ slug: 'all', name: allLabel }, ...categories].map((category) => (
          <Button
            key={category.slug}
            size="sm"
            variant={filter === category.slug ? 'accent' : 'outline'}
            onClick={() => setFilter(category.slug)}
            className={cn('rounded-full')}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <nav className="mt-8 flex flex-wrap justify-center gap-1 text-sm font-semibold" aria-label="A–Z">
        {groups.map(([letter]) => (
          <a key={letter} href={`#letter-${letter}`} className="rounded px-2 py-1 text-accent hover:bg-secondary">
            {letter}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-10">
        {groups.map(([letter, items]) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-24">
            <h2 className="border-b border-border pb-2 font-display text-2xl font-semibold text-primary">{letter}</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
              {items.map((item) => (
                <div key={item.slug}>
                  <dt>
                    <Link href={`/${locale}/knowledge-hub/glossary/${item.slug}`} className="font-semibold text-primary hover:text-accent">
                      {item.term}
                    </Link>
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{item.short}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
