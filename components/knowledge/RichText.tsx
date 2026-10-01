import type { ComponentProps } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';

import type { Locale } from '@/i18n';
import { getTerm, remarkGlossary, termHref } from '@/lib/glossary';
import { GlossaryLink } from '@/components/knowledge/GlossaryLink';

type Components = NonNullable<ComponentProps<typeof MDXRemote>['components']>;

/**
 * Renders markdown/MDX content (job write-ups, guide chapters, glossary
 * entries) with the first mention of every glossary term linked to its page.
 */
export function RichText({
  source,
  locale,
  excludeTerm,
  components,
}: {
  source: string;
  locale: Locale;
  /** On a term's own page, don't link the term to itself. */
  excludeTerm?: string;
  components?: Components;
}) {
  const a = ({ href = '', children, ...rest }: ComponentProps<'a'>) => {
    if (href.startsWith('glossary:')) {
      const term = getTerm(href.slice('glossary:'.length));
      if (!term) return <>{children}</>;
      return (
        <GlossaryLink href={termHref(locale, term.slug)} title={term.term[locale]} short={term.short[locale]} id={`term-${term.slug}`}>
          {children}
        </GlossaryLink>
      );
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };

  return (
    <MDXRemote
      source={source}
      components={{ a, ...components }}
      options={{ mdxOptions: { remarkPlugins: [[remarkGlossary, { locale, exclude: excludeTerm }]] } }}
    />
  );
}
