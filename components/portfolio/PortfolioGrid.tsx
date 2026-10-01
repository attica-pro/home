'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { ProjectSummary } from '@/lib/projects';
import { serviceSlugs, type ServiceSlug } from '@/data/services';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Filter = 'all' | ServiceSlug;

export function PortfolioGrid({ projects, locale }: { projects: ProjectSummary[]; locale: string }) {
  const t = useTranslations('portfolioPage');
  const tServices = useTranslations('services.items');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? projects : projects.filter((project) => project.service === filter);

  // Only offer a filter for services that have at least one project.
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    ...serviceSlugs
      .filter((slug) => projects.some((project) => project.service === slug))
      .map((slug) => ({ key: slug, label: tServices(`${slug}.name`) })),
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? 'accent' : 'outline'}
            onClick={() => setFilter(f.key)}
            className={cn('rounded-full')}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">{t('dragHint')}</p>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
    </div>
  );
}
