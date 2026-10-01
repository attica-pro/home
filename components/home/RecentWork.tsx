import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import type { Locale } from '@/i18n';
import { getFeaturedProjects, toProjectSummary } from '@/lib/projects';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';

export function RecentWork({ locale }: { locale: Locale }) {
  const t = useTranslations('recentWork');
  const projects = getFeaturedProjects(3);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t('title')}</h2>
            <p className="mt-3 text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/${locale}/portfolio`}>
              {t('viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={toProjectSummary(project, locale)} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
