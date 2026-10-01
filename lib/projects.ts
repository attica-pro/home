import fs from 'node:fs';
import path from 'node:path';

import type { Locale } from '@/i18n';
import { serviceSlugs, type ServiceSlug } from '@/data/services';

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects');

export interface ProjectComparison {
  before: string;
  after: string;
}

export interface ProjectMeta {
  slug: string;
  service: ServiceSlug;
  featured: boolean;
  /** Lower comes first in listings. */
  order: number;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  /** File name inside the project's image directory. */
  cover: string;
  comparisons: ProjectComparison[];
  /** Image file name -> Facebook photo number it was taken from (see scripts/import-project-photos.py). */
  photos: Record<string, number>;
  relatedGuide?: string;
}

/** Public URL (without basePath) of an image belonging to a project. */
export function projectImage(slug: string, file: string) {
  return `/images/projects/${slug}/${file}`;
}

export function getAllProjects(): ProjectMeta[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((entry) => fs.existsSync(path.join(PROJECTS_DIR, entry, 'project.json')))
    .map((slug) => getProjectBySlug(slug)!)
    .sort((a, b) => a.order - b.order);
}

/** The featured project of each service (at most one per service), in service order. */
export function getFeaturedProjects(limit?: number): ProjectMeta[] {
  const featured = getAllProjects().filter((project) => project.featured);
  return serviceSlugs
    .map((slug) => featured.find((project) => project.service === slug))
    .filter((project): project is ProjectMeta => !!project)
    .slice(0, limit);
}

export function getProjectBySlug(slug: string): ProjectMeta | null {
  const projectPath = path.join(PROJECTS_DIR, slug, 'project.json');
  if (!fs.existsSync(projectPath)) return null;

  const raw = fs.readFileSync(projectPath, 'utf8');
  return { slug, ...(JSON.parse(raw) as Omit<ProjectMeta, 'slug'>) };
}

export function getProjectContent(slug: string, locale: Locale): string | null {
  const contentPath = path.join(PROJECTS_DIR, slug, `${locale}.md`);
  if (!fs.existsSync(contentPath)) return null;
  return fs.readFileSync(contentPath, 'utf8');
}

/** What a project card needs, already localized, so it can be passed to client components. */
export interface ProjectSummary {
  slug: string;
  service: ServiceSlug;
  title: string;
  excerpt: string;
  cover: string;
  /** Only set when the project has a before/after pair. */
  comparison: ProjectComparison | null;
}

export function toProjectSummary(project: ProjectMeta, locale: Locale): ProjectSummary {
  const comparison = project.comparisons[0];
  return {
    slug: project.slug,
    service: project.service,
    title: project.title[locale],
    excerpt: project.excerpt[locale],
    cover: projectImage(project.slug, project.cover),
    comparison: comparison
      ? { before: projectImage(project.slug, comparison.before), after: projectImage(project.slug, comparison.after) }
      : null,
  };
}
