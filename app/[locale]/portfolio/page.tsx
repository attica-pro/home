import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { locales, type Locale } from '@/i18n';
import { getAllProjects, getFeaturedProjects, toProjectSummary } from '@/lib/projects';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'portfolioPage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function PortfolioPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  return (
    <div className="container py-16 md:py-24">
      <PortfolioPageHeader locale={locale} />
      <PortfolioSections locale={locale} />
    </div>
  );
}

async function PortfolioPageHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'portfolioPage' });
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
    </div>
  );
}

async function PortfolioSections({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'portfolioPage' });
  const featured = getFeaturedProjects();
  const all = getAllProjects();
  return (
    <>
      <section>
        <h2 className="font-display text-2xl font-semibold text-primary md:text-3xl">{t('featuredTitle')}</h2>
        <p className="mt-2 text-muted-foreground">{t('featuredSubtitle')}</p>
        <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={toProjectSummary(project, locale)} locale={locale} />
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-border pt-16">
        <h2 className="mb-8 text-center font-display text-2xl font-semibold text-primary md:text-3xl">
          {t('allTitle', { count: all.length })}
        </h2>
        <PortfolioGrid projects={all.map((project) => toProjectSummary(project, locale))} locale={locale} />
      </section>
    </>
  );
}
