import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { assetPath } from '@/lib/site-config';
import { getAllAnswers, getAnswer, getAnswersByCategory } from '@/lib/answers';
import { getProjectBySlug, projectImage, toProjectSummary, type ProjectMeta } from '@/lib/projects';
import { RichText } from '@/components/knowledge/RichText';
import { AnswerCard } from '@/components/knowledge/AnswerCard';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getAllAnswers().map((answer) => ({ locale, answer: answer.slug })));
}

export async function generateMetadata({ params: { locale, answer: slug } }: { params: { locale: string; answer: string } }): Promise<Metadata> {
  setRequestLocale(locale);
  const answer = getAnswer(slug);
  if (!answer) return {};
  return { title: answer.question[locale as Locale], description: answer.short[locale as Locale] };
}

export default async function AnswerPage({ params: { locale, answer: slug } }: { params: { locale: Locale; answer: string } }) {
  setRequestLocale(locale);
  const answer = getAnswer(slug);
  if (!answer) notFound();

  const t = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tServices = await getTranslations({ locale, namespace: 'services' });
  const projects = answer.projects.map(getProjectBySlug).filter((p): p is ProjectMeta => !!p);
  const more = getAnswersByCategory(answer.category).filter((other) => other.slug !== slug).slice(0, 4);

  // Answer images point into a job's photos: `![alt](<project-slug>/<file>)`.
  const components = {
    img: ({ src = '', alt = '' }: { src?: string; alt?: string }) => {
      const [project, file] = src.split('/');
      return (
        <Image
          src={assetPath(projectImage(project, file))}
          alt={alt}
          width={1200}
          height={900}
          className="mx-auto h-auto max-h-[28rem] w-auto rounded-lg"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      );
    },
  };

  return (
    <article className="container max-w-3xl py-12 md:py-16">
      <Link
        href={`/${locale}/knowledge-hub/${answer.category}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {tServices(`items.${answer.category}.title`)}
      </Link>

      <header className="mt-6">
        <p className="eyebrow">{t('answersTitle')}</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">{answer.question[locale]}</h1>
        <p className="mt-5 border-s-2 border-clay ps-4 text-lg text-foreground">{answer.short[locale]}</p>
      </header>

      <div className="prose prose-slate mt-8 max-w-none prose-p:leading-relaxed prose-img:my-4">
        <RichText source={answer.body[locale]} locale={locale} components={components} />
      </div>

      {projects.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-semibold text-primary">{t('answerJobs')}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={toProjectSummary(project, locale)} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-primary">{t('moreAnswers')}</h2>
          <div className="mt-4 grid gap-3">
            {more.map((other) => (
              <AnswerCard key={other.slug} answer={other} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 rounded-lg bg-secondary p-6 text-center sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-primary">{t('askUs')}</h2>
        <Button asChild size="lg" variant="accent" className="mt-6">
          <Link href={`/${locale}/contact`}>{tServices('heroCta')}</Link>
        </Button>
      </div>
    </article>
  );
}
