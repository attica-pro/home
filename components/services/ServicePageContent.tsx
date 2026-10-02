import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check } from 'lucide-react';

import { serviceIllustration, type ServiceSlug } from '@/data/services';
import { assetPath } from '@/lib/site-config';
import type { GuideMeta } from '@/lib/guides';
import type { ProjectSummary } from '@/lib/projects';
import type { Locale } from '@/i18n';
import { GuideCard } from '@/components/knowledge/GuideCard';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';

interface ServicePageContentProps {
  locale: string;
  slug: ServiceSlug;
  works: ProjectSummary[];
  guides: GuideMeta[];
}

export function ServicePageContent({ locale, slug, works, guides }: ServicePageContentProps) {
  const tServices = useTranslations('services');
  const tHub = useTranslations('knowledgeHubPage');
  const t = useTranslations(`services.items.${slug}`);
  const sections = t.raw('sections') as { title: string; text: string }[];
  const whyItems = t.raw('whyItems') as string[];

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

      {(works.length > 0 || guides.length > 0) && (
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
                <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {works.map((project) => (
                    <ProjectCard key={project.slug} project={project} locale={locale} />
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
    </>
  );
}
