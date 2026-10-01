import type { MetadataRoute } from 'next';

import { locales } from '@/i18n';
import { serviceSlugs } from '@/data/services';
import { getAllGuides, guidePath } from '@/lib/guides';
import { getAllTerms } from '@/lib/glossary';
import { getAllAnswers } from '@/lib/answers';
import { getAllProjects } from '@/lib/projects';
import { siteUrl, basePath } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/services',
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    '/portfolio',
    '/knowledge-hub',
    ...serviceSlugs.map((slug) => `/knowledge-hub/${slug}`),
    '/knowledge-hub/glossary',
    '/knowledge-hub/answers',
    ...getAllAnswers().map((answer) => `/knowledge-hub/answers/${answer.slug}`),
    ...getAllTerms().map((term) => `/knowledge-hub/glossary/${term.slug}`),
    '/contact',
  ];
  const guides = getAllGuides();
  const projects = getAllProjects();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}${basePath}/${locale}${path}/`,
        lastModified: new Date(),
      });
    }
    for (const project of projects) {
      entries.push({ url: `${siteUrl}${basePath}/${locale}/portfolio/${project.slug}/` });
    }
    for (const guide of guides) {
      entries.push({
        url: `${siteUrl}${basePath}/${locale}${guidePath(guide)}/`,
        lastModified: guide.date,
      });
      for (const chapter of guide.chapters) {
        entries.push({
          url: `${siteUrl}${basePath}/${locale}${guidePath(guide, chapter.slug)}/`,
          lastModified: guide.date,
        });
      }
    }
  }

  return entries;
}
