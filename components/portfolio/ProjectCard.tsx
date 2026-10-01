import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import type { ProjectSummary } from '@/lib/projects';
import { assetPath } from '@/lib/site-config';
import { BeforeAfterSlider } from '@/components/portfolio/BeforeAfterSlider';
import { Badge } from '@/components/ui/badge';

export function ProjectCard({ project, locale }: { project: ProjectSummary; locale: string }) {
  const t = useTranslations('portfolioPage');
  const tCommon = useTranslations('common');
  const tServices = useTranslations('services.items');
  const href = `/${locale}/portfolio/${project.slug}`;

  return (
    <div>
      {project.comparison ? (
        <BeforeAfterSlider
          beforeImage={project.comparison.before}
          afterImage={project.comparison.after}
          alt={project.title}
          beforeLabel={tCommon('before')}
          afterLabel={tCommon('after')}
        />
      ) : (
        <Link href={href} className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={assetPath(project.cover)}
            alt={project.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
      )}
      <div className="mt-4">
        <Badge variant={project.service === 'insulation' ? 'secondary' : 'accent'}>
          {tServices(`${project.service}.name`)}
        </Badge>
        <h3 className="mt-2 font-semibold text-primary">
          <Link href={href} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.excerpt}</p>
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          {t('viewProject')} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
