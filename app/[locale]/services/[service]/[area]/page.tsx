import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Check, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { serviceIllustration, type ServiceSlug } from '@/data/services';
import {
  areas,
  areaSlugs,
  getServiceAreaLead,
  isAreaSlug,
  isLocalServiceSlug,
  localServiceSlugs,
  primaryAreaSlugs,
  type AreaSlug,
  type LocalServiceSlug,
} from '@/data/areas';
import { getAnswersByCategory } from '@/lib/answers';
import { getOpportunityFor } from '@/lib/opportunity';
import { getAllProjects, toProjectSummary } from '@/lib/projects';
import { assetPath, siteConfig, siteUrl } from '@/lib/site-config';
import { AnswerCard } from '@/components/knowledge/AnswerCard';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact/ContactForm';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    localServiceSlugs.flatMap((service) =>
      areaSlugs.map((area) => ({
        locale,
        service,
        area,
      })),
    ),
  );
}

export async function generateMetadata({
  params: { locale, service, area: areaSlug },
}: {
  params: { locale: string; service: string; area: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  if (!isLocalServiceSlug(service) || !isAreaSlug(areaSlug)) return {};

  const tServices = await getTranslations({ locale, namespace: `services.items.${service}` });
  const area = areas[areaSlug];
  const title = `${tServices('title')} ${area.genitive[locale as Locale]}`;
  const description = getServiceAreaLead(service as ServiceSlug, area, locale as Locale);

  return {
    title,
    description,
    alternates: {
      languages: {
        el: `/el/services/${service}/${areaSlug}`,
        en: `/en/services/${service}/${areaSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/services/${service}/${areaSlug}`,
    },
  };
}

const DEMOLITION_PROJECT_SLUGS = [
  'kitchen-walls-stripped-replastered',
  'bathroom-renovation-green-tub',
  'terrace-tiles-removed-cement-coating',
];

export default async function LocalServicePage({
  params: { locale, service, area: areaSlug },
}: {
  params: { locale: Locale; service: string; area: string };
}) {
  setRequestLocale(locale);
  if (!isLocalServiceSlug(service) || !isAreaSlug(areaSlug)) notFound();

  const area = areas[areaSlug];
  const tServices = await getTranslations({ locale, namespace: 'services' });
  const tServiceItem = await getTranslations({ locale, namespace: `services.items.${service}` });
  const tLocal = await getTranslations({ locale, namespace: 'localLanding' });
  const tHub = await getTranslations({ locale, namespace: 'knowledgeHubPage' });
  const tContact = await getTranslations({ locale, namespace: 'contactPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const sections = tServiceItem.raw('sections') as { title: string; text: string }[];
  const whyItems = tServiceItem.raw('whyItems') as string[];

  const allProjects = getAllProjects();
  const works = (
    service === 'demolition'
      ? allProjects.filter((project) => DEMOLITION_PROJECT_SLUGS.includes(project.slug))
      : allProjects.filter((project) => project.service === service)
  )
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, 3)
    .map((project) => toProjectSummary(project, locale));

  const answers = getAnswersByCategory(service as ServiceSlug).slice(0, 6);
  const serviceAreaLead = getServiceAreaLead(service as ServiceSlug, area, locale);
  const opportunity = getOpportunityFor(areaSlug, service);
  const collageProject = works.find((project) => project.collage);

  const localSchema = {
    '@context': 'https://schema.org',
    '@type': service === 'insulation' ? 'RoofingContractor' : 'HomeAndConstructionBusiness',
    name: `AtticaPro - ${tServiceItem('title')} ${area.genitive[locale]}`,
    url: `${siteUrl}/${locale}/services/${service}/${areaSlug}`,
    telephone: siteConfig.phoneHref.replace('tel:', ''),
    priceRange: '€€',
    image: `${siteUrl}/images/hero-mohamed.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Λ. Συγγρού 196',
      addressLocality: 'Καλλιθέα',
      addressRegion: 'Αττική',
      postalCode: '17671',
      addressCountry: 'GR',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: area.name[locale],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary/60 py-3 text-xs text-muted-foreground">
        <div className="container flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-accent">AtticaPro</Link>
          <span>/</span>
          <Link href={`/${locale}/services`} className="hover:text-accent">{tLocal('breadcrumbServices')}</Link>
          <span>/</span>
          <Link href={`/${locale}/services/${service}`} className="hover:text-accent">{tServiceItem('title')}</Link>
          <span>/</span>
          <span className="font-semibold text-foreground">{area.name[locale]}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="border-b border-foreground bg-background">
        <div className="container grid items-center gap-8 py-12 md:grid-cols-[1.25fr_1fr] md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-clay">
              <MapPin className="h-3.5 w-3.5" />
              {area.isHq ? tLocal('badgeHq') : tLocal('badgeServiceArea')}
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {tServiceItem('title')} <span className="text-accent">{area.genitive[locale]}</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-foreground/85 md:text-lg">
              {serviceAreaLead}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-clay" />
              <span>{tLocal('localGuarantees')}</span>
            </div>

            {/* Direct Call & Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="accent" className="gap-2 font-bold shadow-md">
                <a href={siteConfig.phoneHref}>
                  <Phone className="h-4 w-4" />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="border-foreground hover:bg-secondary">
                <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm justify-center md:max-w-md">
            <Image
              src={assetPath(serviceIllustration(service as ServiceSlug))}
              alt={`${tServiceItem('title')} ${area.genitive[locale]}`}
              width={600}
              height={800}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </header>

      {/* Neighborhoods & Local Coverage */}
      {((area.neighborhoods && area.neighborhoods[locale]) || (opportunity && opportunity.guerrilla_target_hubs.length > 0)) && (
        <section className="border-b border-border bg-secondary py-8">
          <div className="container">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {tLocal('areasCovered')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {area.neighborhoods &&
                area.neighborhoods[locale] &&
                area.neighborhoods[locale].map((suburb) => (
                  <span
                    key={suburb}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    <MapPin className="h-3 w-3 text-clay" />
                    {suburb}
                  </span>
                ))}
              {opportunity &&
                opportunity.guerrilla_target_hubs.map((hub) => (
                  <span
                    key={hub}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <MapPin className="h-3 w-3 text-accent" />
                    {hub}
                  </span>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Technical Process & Breakdown */}
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow">{tLocal('processTitle')}</span>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            {tServiceItem('subtitle')}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {sections.map((section, i) => (
            <div key={section.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <span className="font-display text-2xl font-bold text-clay">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real Projects Gallery */}
      {works.length > 0 && (
        <section className="border-t border-border bg-secondary py-16 md:py-24">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">{tCommon('before')} & {tCommon('after')}</span>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  {tServiceItem('place')} &bull; {tHub('worksTitle')}
                </h2>
              </div>
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                {tHub('seeAllWorks')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            {/* Featured Before/After Collage Transformation */}
            {collageProject && collageProject.collage && (
              <div className="mt-8 overflow-hidden rounded-xl border border-foreground bg-card p-4 shadow-sm md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-clay px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {locale === 'el' ? 'Πριν & Μετά' : 'Before & After'}
                    </span>
                    <span className="font-display text-sm font-bold text-foreground">
                      {collageProject.title}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/portfolio/${collageProject.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    {locale === 'el' ? 'Δείτε το έργο βήμα-βήμα' : 'View full project'} &rarr;
                  </Link>
                </div>
                <div className="relative aspect-[1104/556] w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={assetPath(collageProject.collage)}
                    alt={`${collageProject.title} - ${area.name[locale]}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1104px"
                  />
                </div>
              </div>
            )}

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {works.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Real Market Search Demand & Frequent Queries */}
      {opportunity && opportunity.top_search_queries.length > 0 && (
        <section className="border-t border-border bg-card py-12 md:py-16">
          <div className="container">
            <div className="max-w-2xl">
              <span className="eyebrow">{area.name[locale]}</span>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {locale === 'el'
                  ? `Συχνές Αναζητήσεις & Ανάγκες ${area.genitive[locale]}`
                  : `Frequent Searches & Needs in ${area.name[locale]}`}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === 'el'
                  ? `Κύρια τεχνικά ερωτήματα και ζητήματα που αναζητούν οι ιδιοκτήτες κατοικιών ${area.genitive[locale]}, με άμεση τεχνική λύση από την AtticaPro.`
                  : `Core questions and technical requirements homeowners search for in ${area.name[locale]}, resolved directly by AtticaPro.`}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {opportunity.top_search_queries.map((query) => (
                <span
                  key={query}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-clay" />
                  {query}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Answers for this Service */}
      {answers.length > 0 && (
        <section className="border-t border-border py-16 md:py-24">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="eyebrow">{tServiceItem('name')}</span>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  {tHub('answersTitle')}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tHub('answersSubtitle')}
                </p>
              </div>
              <Link
                href={`/${locale}/knowledge-hub/${service}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                {tHub('answersCta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {answers.map((answer) => (
                <AnswerCard key={answer.slug} answer={answer} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Free Inspection Promise & Why Us */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-xl border-2 border-foreground bg-card p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 text-clay">
                <Sparkles className="h-5 w-5" />
                <span className="font-display text-sm font-bold uppercase tracking-wider">
                  {tLocal('freeInspectionTitle')}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-primary">
                {locale === 'el'
                  ? 'Χωρίς καμία χρέωση και χωρίς δέσμευση'
                  : 'Free of charge and with no obligation'}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {tLocal('freeInspectionDesc')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="accent" className="gap-2 font-bold">
                  <a href={siteConfig.phoneHref}>
                    <Phone className="h-4 w-4" />
                    {tLocal('ctaSubtitle')}
                  </a>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-primary">{tServices('whyTitle')}</h3>
              <ul className="mt-6 space-y-4">
                {whyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-b border-border pb-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Other Athens Areas Served for this Service */}
      <section className="border-t border-border bg-card py-12 md:py-16">
        <div className="container">
          <span className="eyebrow">{tLocal('allAreas')}</span>
          <h2 className="mt-2 font-display text-2xl font-bold">
            {tServiceItem('title')} &bull;{' '}
            {locale === 'el' ? 'Περιοχές Εξυπηρέτησης στην Αττική' : 'Areas Served Across Attica'}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {primaryAreaSlugs.map((slug) => {
              const targetArea = areas[slug];
              const isCurrent = slug === areaSlug;
              return (
                <Link
                  key={slug}
                  href={`/${locale}/services/${service}/${slug}`}
                  className={
                    isCurrent
                      ? 'inline-flex items-center gap-1 rounded-md border border-foreground bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground'
                      : 'inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground'
                  }
                >
                  <MapPin className="h-3 w-3 text-clay" />
                  {targetArea.name[locale]}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* On-Page Contact Form */}
      <section id="contact-form" className="border-t border-border bg-secondary py-16 md:py-24">
        <div className="container max-w-2xl">
          <div className="text-center">
            <span className="eyebrow">{tContact('subtitle')}</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary">
              {tContact('formTitle')}
            </h2>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
