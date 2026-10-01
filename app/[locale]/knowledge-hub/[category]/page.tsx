import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { isServiceSlug, serviceIcons, serviceSlugs } from '@/data/services';
import { getAllGuides } from '@/lib/guides';
import { getTermsByCategory } from '@/lib/glossary';
import { getAllProjects, toProjectSummary } from '@/lib/projects';
import { GuideCard } from '@/components/knowledge/GuideCard';
import { TermCard } from '@/components/knowledge/TermCard';
import { AnswerCard } from '@/components/knowledge/AnswerCard';
import { getAnswersByCategory } from '@/lib/answers';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((category) => ({ locale, category })));
}

export async function generateMetadata({
  params: { locale, category },
}: {
  params: { locale: string; category: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services.items' });
  return { title: `${tServices(`${category}.title`)} · ${t('title')}`, description: tServices(`${category}.subtitle`) };
}

export default async function KnowledgeCategoryPage({
  params: { locale, category },
}: {
  params: { locale: Locale; category: string };
}) {
  setRequestLocale(locale);
  if (!isServiceSlug(category)) notFound();

  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services.items' });
  const guides = getAllGuides().filter((guide) => guide.category === category);
  const terms = getTermsByCategory(category, locale);
  const answers = getAnswersByCategory(category);
  // The featured job first, then the most recent ones.
  const works = getAllProjects()
    .filter((project) => project.service === category)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, 3);
  const Icon = serviceIcons[category];

  return (
    <div>
      <section className="bg-secondary border-b border-border">
        <div className="container py-14 md:py-16">
          <Link href={`/${locale}/knowledge-hub`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('title')}
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <Icon className="h-12 w-12 shrink-0" />
            <div className="min-w-0 max-w-2xl">
              <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">{tServices(`${category}.title`)}</h1>
              <p className="mt-3 text-lg text-muted-foreground">{tServices(`${category}.subtitle`)}</p>
              <Button asChild variant="outline" className="mt-6">
                <Link href={`/${locale}/services/${category}`}>
                  {t('seeService')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-16 py-14 md:py-16">
        {answers.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-primary">{t('answersTitle')}</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {answers.map((answer) => (
                <AnswerCard key={answer.slug} answer={answer} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {guides.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-primary">{t('guidesTitle')}</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {terms.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-primary">{t('termsTitle')}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {terms.map((term) => (
                <TermCard key={term.slug} term={term} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {works.length > 0 && (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-primary">{t('worksTitle')}</h2>
              <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                {t('seeAllWorks')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {works.map((project) => (
                <ProjectCard key={project.slug} project={toProjectSummary(project, locale)} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
