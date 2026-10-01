import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * A link to a glossary term with a hover/focus pop-up showing its short
 * definition. Pure CSS, so it works in server-rendered markdown; on touch
 * screens a tap just opens the term's page. The pop-up is display:none until
 * shown, so near the screen edge it can't widen the page.
 */
export function GlossaryLink({
  href,
  title,
  short,
  id,
  children,
}: {
  href: string;
  title: string;
  short: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <span className="not-prose group relative inline">
      <Link
        href={href}
        aria-describedby={id}
        className="font-medium text-inherit underline decoration-accent decoration-dotted decoration-2 underline-offset-4 hover:text-accent focus-visible:text-accent"
      >
        {children}
      </Link>
      <span
        role="tooltip"
        id={id}
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-64 max-w-[80vw] -translate-x-1/2 rounded-md border border-border bg-card p-3 text-start text-sm font-normal leading-snug shadow-lg group-focus-within:block group-hover:block"
      >
        <span className="block font-semibold text-primary">{title}</span>
        <span className="mt-1 block text-muted-foreground">{short}</span>
      </span>
    </span>
  );
}
