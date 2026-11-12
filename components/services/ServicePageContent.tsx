import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, MapPin } from 'lucide-react';

import { areas, primaryAreaSlugs } from '@/data/areas';
import { serviceIllustration, type ServiceSlug } from '@/data/services';
import { assetPath } from '@/lib/site-config';
import type { Answer } from '@/lib/answers';
import type { GuideMeta } from '@/lib/guides';
import type { ProjectSummary } from '@/lib/projects';
import type { Locale } from '@/i18n';
import { AnswerCard } from '@/components/knowledge/AnswerCard';
import { GuideCard } from '@/components/knowledge/GuideCard';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';

interface ServicePageContentProps {
  locale: string;
  slug: ServiceSlug;
  works: ProjectSummary[];
  guides: GuideMeta[];
  answers?: Answer[];
}

export function ServicePageContent({ locale, slug, works, guides, answers = [] }: ServicePageContentProps) {
  const tServices = useTranslations('services');
  const tHub = useTranslations('knowledgeHubPage');
  const tLocal = useTranslations('localLanding');
  const t = useTranslations(`services.items.${slug}`);
  const sections = t.raw('sections') as { title: string; text: string }[];
  const whyItems = t.raw('whyItems') as string[];
  const collageProject = works.find((project) => project.collage);

  return (
    <>
      <section className="border-b border-foreground">
        <div className="container grid items-end gap-6 pt-12 md:grid-cols-[1.2fr_1fr] md:gap-10 md:pt-14">
          <div className="min-w-0 pb-4 md:pb-16">
            <span className="eyebrow">{t('place')}</span>
            <h1 className="mt-4 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">{t('title')}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t('subtitle')}</p>
            <Button asChild size="lg" variant="accent" className="mt-8">
              <Link href={`/${locale}/contact`}>{tServices('heroCta')}</Link>
            </Button>
          </div>
          <Image
            src={assetPath(serviceIllustration(slug))}
            alt=""
            width={600}
            height={800}
            priority
            className="mx-auto w-full max-w-sm md:max-w-md"
          />
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {sections.map((section, i) => (
            <div key={section.title} className="border-t border-foreground pt-5">
              <span className="font-display text-2xl font-bold text-clay">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="mt-2 font-display text-xl font-bold">{section.title}</h2>
              <p className="mt-3 text-muted-foreground">{section.text}</p>
            </div>
          ))}
        </div>
      </section>

      {(works.length > 0 || answers.length > 0 || guides.length > 0) && (
        <section className="border-t border-border py-16 md:py-24">
          <div className="container space-y-16">
            {works.length > 0 && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2 className="font-display text-3xl font-bold">{tHub('worksTitle')}</h2>
                  <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                    {tHub('seeAllWorks')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
                {collageProject && collageProject.collage && (
                  <div className="mt-8 overflow-hidden rounded-xl border border-foreground bg-card p-4 shadow-sm md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-clay px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                          {locale === 'el' ? 'Πριν & Μετά' : 'Before & After'}
                        </span>
                        <span className="font-display text-sm font-bold text-foreground">
                          {collageProject.title}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/portfolio/${collageProject.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        {locale === 'el' ? 'Δείτε το έργο βήμα-βήμα' : 'View full project'} &rarr;
                      </Link>
                    </div>
                    <div className="relative aspect-[1104/556] w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={assetPath(collageProject.collage)}
                        alt={collageProject.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1104px"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {works.map((project) => (
                    <ProjectCard key={project.slug} project={project} locale={locale} />
                  ))}
                </div>
              </div>
            )}
            {answers.length > 0 && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl font-bold">{tHub('answersTitle')}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{tHub('answersSubtitle')}</p>
                  </div>
                  <Link href={`/${locale}/knowledge-hub/${slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                    {tHub('answersCta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {answers.map((answer) => (
                    <AnswerCard key={answer.slug} answer={answer} locale={locale as Locale} />
                  ))}
                </div>
              </div>
            )}
            {guides.length > 0 && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h2 className="font-display text-3xl font-bold">{tHub('guidesTitle')}</h2>
                  <Link href={`/${locale}/knowledge-hub/${slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                    {tHub('learnInHub')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
                <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {guides.map((guide) => (
                    <GuideCard key={guide.slug} guide={guide} locale={locale as Locale} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="border-t border-border bg-secondary py-16 md:py-24">
        <div className="container">
          <h2 className="font-display text-3xl font-bold">{tServices('whyTitle')}</h2>
          <ul className="mt-8 grid max-w-4xl gap-x-10 gap-y-4 md:grid-cols-2">
            {whyItems.map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-border pb-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="accent">
              <Link href={`/${locale}/contact`}>{tServices('heroCta')}</Link>
            </Button>
            <Link href={`/${locale}/knowledge-hub/${slug}`} className="text-sm font-semibold text-accent hover:underline">
              {tHub('learnInHub')}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-12 md:py-16">
        <div className="container">
          <span className="eyebrow">{tLocal('allAreas')}</span>
          <h2 className="mt-2 font-display text-2xl font-bold">
            {t('title')} &bull;{' '}
            {locale === 'el' ? 'Περιοχές Εξυπηρέτησης στην Αττική' : 'Areas Served Across Attica'}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {primaryAreaSlugs.map((areaSlug) => {
              const area = areas[areaSlug];
              return (
                <Link
                  key={areaSlug}
                  href={`/${locale}/services/${slug}/${areaSlug}`}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground"
                >
                  <MapPin className="h-3 w-3 text-clay" />
                  {area.name[locale as Locale]}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
