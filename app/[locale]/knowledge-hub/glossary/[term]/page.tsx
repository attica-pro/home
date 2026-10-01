import { Fragment } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { assetPath } from '@/lib/site-config';
import { getAllTerms, getTerm, getTermUsage, termHref } from '@/lib/glossary';
import { guidePath } from '@/lib/guides';
import { getProjectBySlug, projectImage } from '@/lib/projects';
import { RichText } from '@/components/knowledge/RichText';
import { answerHref } from '@/lib/answers';
import { GlossaryLink } from '@/components/knowledge/GlossaryLink';
import { Badge } from '@/components/ui/badge';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getAllTerms().map((term) => ({ locale, term: term.slug })));
}

export async function generateMetadata({ params: { locale, term: slug } }: { params: { locale: string; term: string } }): Promise<Metadata> {
  setRequestLocale(locale);
  const term = getTerm(slug);
  if (!term) return {};
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  return { title: `${term.term[locale as Locale]} · ${t('glossaryTitle')}`, description: term.short[locale as Locale] };
}

export default async function GlossaryTermPage({ params: { locale, term: slug } }: { params: { locale: Locale; term: string } }) {
  setRequestLocale(locale);
  const term = getTerm(slug);
  if (!term) notFound();

  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services.items' });
  const usage = getTermUsage(slug, locale);
  const photoProject = term.photo ? getProjectBySlug(term.photo.project) : null;
  const related = term.related.map(getTerm).filter((r): r is NonNullable<typeof r> => !!r);
  const otherNames = locales.filter((l) => l !== locale).map((l) => term.term[l]);

  return (
    <article className="container max-w-3xl py-12 md:py-16">
      <Link href={`/${locale}/knowledge-hub/glossary`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('glossaryTitle')}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap gap-2">
          {term.categories.map((category) => (
            <Link key={category} href={`/${locale}/knowledge-hub/${category}`}>
              <Badge variant={category === 'insulation' ? 'secondary' : 'accent'}>{tServices(`${category}.name`)}</Badge>
            </Link>
          ))}
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-primary md:text-4xl">{term.term[locale]}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('alsoKnownAs')}:{' '}
          {otherNames.map((name, i) => (
            <Fragment key={name}>
              {i > 0 && ' · '}
              <bdi>{name}</bdi>
            </Fragment>
          ))}
        </p>
        <p className="mt-6 text-lg text-foreground">{term.short[locale]}</p>
      </header>

      {term.photo && photoProject && (
        <figure className="mt-8">
          <Image
            src={assetPath(projectImage(term.photo.project, term.photo.file))}
            alt={term.term[locale]}
            width={1200}
            height={900}
            className="mx-auto h-auto max-h-[28rem] w-auto rounded-lg"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {t('photoFrom')}:{' '}
            <Link href={`/${locale}/portfolio/${photoProject.slug}`} className="text-accent hover:underline">
              {photoProject.title[locale]}
            </Link>
          </figcaption>
        </figure>
      )}

      <div className="prose prose-slate mt-8 max-w-none prose-p:leading-relaxed">
        <RichText source={term.body[locale]} locale={locale} excludeTerm={slug} />
      </div>

      {(usage.projects.length > 0 || usage.chapters.length > 0 || usage.answers.length > 0) && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-semibold text-primary">{t('seenIn')}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {usage.answers.map((answer) => (
              <li key={answer.slug}>
                <Link href={answerHref(locale, answer.slug)} className="block rounded-lg border border-border p-3 text-sm hover:border-accent/50 hover:bg-secondary">
                  <span className="block text-xs text-muted-foreground">{t('answersTitle')}</span>
                  <span className="font-medium text-primary">{answer.question[locale]}</span>
                </Link>
              </li>
            ))}
            {usage.chapters.map(({ guide, chapter }) => (
              <li key={`${guide.slug}/${chapter.slug}`}>
                <Link href={`/${locale}${guidePath(guide, chapter.slug)}`} className="block rounded-lg border border-border p-3 text-sm hover:border-accent/50 hover:bg-secondary">
                  <span className="block text-xs text-muted-foreground">{guide.title[locale]}</span>
                  <span className="font-medium text-primary">{chapter.title[locale]}</span>
                </Link>
              </li>
            ))}
            {usage.projects.slice(0, 10).map((project) => (
              <li key={project.slug}>
                <Link href={`/${locale}/portfolio/${project.slug}`} className="flex items-center gap-3 rounded-lg border border-border p-2 text-sm hover:border-accent/50 hover:bg-secondary">
                  <Image
                    src={assetPath(projectImage(project.slug, project.cover))}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded object-cover"
                  />
                  <span className="font-medium text-primary">{project.title[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-primary">{t('relatedTerms')}</h2>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {related.map((r) => (
              <GlossaryLink key={r.slug} href={termHref(locale, r.slug)} title={r.term[locale]} short={r.short[locale]} id={`related-${r.slug}`}>
                {r.term[locale]}
              </GlossaryLink>
            ))}
          </p>
        </section>
      )}
    </article>
  );
}
