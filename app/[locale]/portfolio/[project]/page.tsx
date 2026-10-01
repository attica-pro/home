import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { assetPath } from '@/lib/site-config';
import { getAllProjects, getProjectBySlug, getProjectContent, projectImage } from '@/lib/projects';
import { getGuideBySlug, guidePath } from '@/lib/guides';
import { RichText } from '@/components/knowledge/RichText';
import { AnswerCard } from '@/components/knowledge/AnswerCard';
import { getAnswersForProject } from '@/lib/answers';
import { BeforeAfterSlider } from '@/components/portfolio/BeforeAfterSlider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamicParams = false;

export function generateStaticParams() {
  const projects = getAllProjects();
  return locales.flatMap((locale) => projects.map((project) => ({ locale, project: project.slug })));
}

export async function generateMetadata({
  params: { locale, project: slug },
}: {
  params: { locale: string; project: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title[locale as Locale],
    description: project.excerpt[locale as Locale],
    openGraph: { images: [assetPath(projectImage(slug, project.cover))] },
  };
}

export default async function ProjectPage({
  params: { locale, project: slug },
}: {
  params: { locale: Locale; project: string };
}) {
  setRequestLocale(locale);
  const project = getProjectBySlug(slug);
  const content = getProjectContent(slug, locale);
  if (!project || !content) notFound();

  const t = await getTranslations({ locale, namespace: 'portfolioPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tServices = await getTranslations({ locale, namespace: 'services' });
  const guide = project.relatedGuide ? getGuideBySlug(project.relatedGuide) : null;
  const title = project.title[locale];
  const answers = getAnswersForProject(slug);

  // Markdown images are written as bare file names (`![alt](step-01.jpg)`) and live in the project's image directory.
  const components = {
    img: ({ src = '', alt = '' }: { src?: string; alt?: string }) => (
      <Image
        src={assetPath(projectImage(slug, src))}
        alt={alt}
        width={1200}
        height={900}
        className="mx-auto h-auto max-h-[32rem] w-auto rounded-lg"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    ),
  };

  return (
    <article className="container max-w-3xl py-12 md:py-16">
      <Link
        href={`/${locale}/portfolio`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('backToPortfolio')}
      </Link>

      <div className="mt-6">
        <Link href={`/${locale}/services/${project.service}`}>
          <Badge variant={project.service === 'insulation' ? 'secondary' : 'accent'}>
            {tServices(`items.${project.service}.name`)}
          </Badge>
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{project.excerpt[locale]}</p>
      </div>

      <div className="mt-10 grid gap-6">
        {project.comparisons.length === 0 && (
          <Image
            src={assetPath(projectImage(slug, project.cover))}
            alt={title}
            width={1200}
            height={900}
            priority
            className="mx-auto h-auto max-h-[36rem] w-auto rounded-lg"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
        {project.comparisons.map((comparison) => (
          <div key={comparison.before}>
            <BeforeAfterSlider
              beforeImage={projectImage(slug, comparison.before)}
              afterImage={projectImage(slug, comparison.after)}
              alt={title}
              beforeLabel={tCommon('before')}
              afterLabel={tCommon('after')}
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">{t('dragHint')}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl font-semibold text-primary">{t('stepByStep')}</h2>
      <div className="prose prose-slate mt-6 max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-primary prose-img:my-4">
        <RichText source={content} locale={locale} components={components} />
      </div>

      {answers.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-semibold text-primary">{t('jobQuestions')}</h2>
          <div className="mt-4 grid gap-3">
            {answers.map((answer) => (
              <AnswerCard key={answer.slug} answer={answer} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {guide && (
        <Link
          href={`/${locale}${guidePath(guide)}`}
          className="mt-10 flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
        >
          <span>
            <span className="block text-xs text-muted-foreground">{tCommon('readGuide')}</span>
            <span className="font-semibold text-primary">{guide.title[locale]}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-accent rtl:rotate-180" />
        </Link>
      )}

      <div className="mt-14 rounded-lg bg-secondary p-6 text-center sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-primary">{t('similarJob')}</h2>
        <Button asChild size="lg" variant="accent" className="mt-6">
          <Link href={`/${locale}/contact`}>{tServices('heroCta')}</Link>
        </Button>
      </div>
    </article>
  );
}
