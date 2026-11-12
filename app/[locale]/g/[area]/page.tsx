import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Check, MapPin, Phone, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

import { locales, type Locale } from '@/i18n';
import { areas, areaSlugs, isAreaSlug } from '@/data/areas';
import { getAllProjects, toProjectSummary } from '@/lib/projects';
import { getOpportunityFor } from '@/lib/opportunity';
import { assetPath, siteConfig, siteUrl } from '@/lib/site-config';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact/ContactForm';
import { Logo } from '@/components/layout/Logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    areaSlugs.map((area) => ({
      locale,
      area,
    })),
  );
}

export async function generateMetadata({
  params: { locale, area: areaSlug },
}: {
  params: { locale: string; area: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  if (!isAreaSlug(areaSlug)) return {};

  const area = areas[areaSlug];
  const title =
    locale === 'el'
      ? `AtticaPro ${area.genitive.el} · Μονώσεις, Βαφές & Ανακαινίσεις`
      : `AtticaPro ${area.genitive.en} · Waterproofing, Painting & Renovation`;
  const description = area.localContext[locale as Locale];

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      languages: {
        el: `/el/g/${areaSlug}`,
        en: `/en/g/${areaSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/g/${areaSlug}`,
    },
  };
}

export default async function GuerrillaLandingPage({
  params: { locale, area: areaSlug },
}: {
  params: { locale: Locale; area: string };
}) {
  setRequestLocale(locale);
  if (!isAreaSlug(areaSlug)) notFound();

  const area = areas[areaSlug];
  const opp = getOpportunityFor(areaSlug, 'insulation') || getOpportunityFor(areaSlug, 'painting');

  // Filter projects with collages for maximum visual proof
  const projectsWithCollages = getAllProjects()
    .map((p) => toProjectSummary(p, locale))
    .filter((p) => p.collage)
    .slice(0, 6);

  const whatsappMessage =
    locale === 'el'
      ? encodeURIComponent(
          `Γεια σας, είδα την ενημέρωσή σας στην περιοχή ${area.name.el} και θα ήθελα μια δωρεάν εκτίμηση κόστους για τον χώρο μου.`,
        )
      : encodeURIComponent(
          `Hello, I saw your flyer in ${area.name.en} and would like a free inspection estimate for my property.`,
        );

  const whatsappUrl = `https://wa.me/306933347282?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-background">
      {/* Top Banner with Logo & Direct Call */}
      <header className="border-b border-foreground bg-secondary/80 py-4">
        <div className="container flex items-center justify-between">
          <Link href={`/${locale}`}>
            <Logo />
          </Link>
          <Button asChild size="sm" variant="accent" className="gap-1.5 font-bold shadow-sm">
            <a href={siteConfig.phoneHref}>
              <Phone className="h-3.5 w-3.5" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Hero: Tailored to scanned neighborhood sticker */}
      <section className="border-b border-foreground bg-card py-10 md:py-16">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1 text-xs font-semibold text-clay">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {locale === 'el' ? `Τοπική Ομάδα Εργασιών · ${area.name.el}` : `Local Service Team · ${area.name.en}`}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {locale === 'el' ? (
              <>
                Είδατε την ενημέρωσή μας{' '}
                <span className="text-accent">{area.genitive.el}</span>;
              </>
            ) : (
              <>
                Technical solutions for your home in{' '}
                <span className="text-accent">{area.name.en}</span>
              </>
            )}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-foreground/85 sm:text-lg">
            {area.localContext[locale]}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-clay" />
              18 Χρόνια Εμπειρίας
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-clay" />
              Δωρεάν Αυτοψία στον Χώρο σας
            </span>
            <span>&bull;</span>
            <span>Χωρίς Κρυφά Κόστη</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="accent" className="gap-2 font-bold shadow-md text-base py-6">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageSquare className="h-5 w-5" />
                {locale === 'el' ? 'Μήνυμα στο WhatsApp' : 'WhatsApp Message'}
              </a>
            </Button>

            <Button asChild size="lg" variant="outline" className="gap-2 border-foreground hover:bg-secondary text-base py-6 font-bold">
              <a href={siteConfig.phoneHref}>
                <Phone className="h-5 w-5 text-clay" />
                {locale === 'el' ? 'Άμεση Τηλεφωνική Κλήση' : 'Call Mohamed Directly'}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Real Before/After Transformations Gallery */}
      <section className="container max-w-4xl py-12 md:py-16">
        <div className="text-center">
          <span className="eyebrow">
            {locale === 'el' ? 'Πραγματικές Δουλειές' : 'Real Projects'}
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl text-primary">
            {locale === 'el'
              ? 'Μεταμορφώσεις Χώρων: Πριν & Μετά'
              : 'Recent Space Transformations: Before & After'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === 'el'
              ? 'Φωτογραφίες από πραγματικές εργασίες μόνωσης, βαφής και ανακαίνισης που πραγματοποιήσαμε στην Αττική.'
              : 'Photographs from real waterproofing, painting and renovation jobs completed across Attica.'}
          </p>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {projectsWithCollages.map((project) => (
            <div key={project.slug} className="overflow-hidden rounded-xl border border-foreground bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 text-xs font-semibold text-foreground">
                <span className="truncate pr-2">{project.title}</span>
                <Link
                  href={`/${locale}/portfolio/${project.slug}`}
                  className="shrink-0 text-accent hover:underline"
                >
                  {locale === 'el' ? 'Δείτε το έργο' : 'Details'} &rarr;
                </Link>
              </div>
              <div className="relative aspect-[1104/556] w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={assetPath(project.collage!)}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Local Hubs */}
      {opp && opp.guerrilla_target_hubs.length > 0 && (
        <section className="border-t border-border bg-secondary py-8">
          <div className="container max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {locale === 'el' ? 'Σημεία Εξυπηρέτησης στην Περιοχή' : 'Key Local Coverage Hubs'}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {opp.guerrilla_target_hubs.map((hub) => (
                <span
                  key={hub}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <MapPin className="h-3 w-3 text-clay" />
                  {hub}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Promises */}
      <section className="border-t border-border py-12 md:py-16">
        <div className="container max-w-2xl">
          <div className="rounded-xl border-2 border-foreground bg-card p-6 shadow-sm sm:p-8">
            <h3 className="font-display text-xl font-bold text-primary">
              {locale === 'el' ? 'Πώς δουλεύουμε με κάθε πελάτη' : 'How We Work'}
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-foreground">
                  {locale === 'el'
                    ? 'Δωρεάν αυτοψία στον χώρο σας: ερχόμαστε, εξετάζουμε το πρόβλημα και σας εξηγούμε τη λύση.'
                    : 'Free on-site assessment: we visit, inspect the issue and explain the proper fix.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-foreground">
                  {locale === 'el'
                    ? 'Γραπτή, ξεκάθαρη προσφορά: σταθερή τιμή πριν ξεκινήσουμε, χωρίς δυσάρεστες εκπλήξεις.'
                    : 'Written fixed quote: agreed price before work starts with no surprises.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-foreground">
                  {locale === 'el'
                    ? 'Σεβασμός και καθαριότητα: φεύγουμε αφήνοντας τον χώρο και τους κοινόχρηστους διαδρόμους καθαρούς.'
                    : 'Clean and tidy site: we respect your building and sweep up thoroughly when finished.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* On-Page Fast Estimate Request Form */}
      <section id="quote-form" className="border-t border-border bg-secondary py-12 md:py-16">
        <div className="container max-w-2xl">
          <div className="text-center">
            <span className="eyebrow">
              {locale === 'el' ? 'Άμεση Επικοινωνία' : 'Fast Contact'}
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl text-primary">
              {locale === 'el' ? 'Ζητήστε Δωρεάν Αυτοψία' : 'Request Your Free Assessment'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === 'el'
                ? 'Συμπληρώστε τη φόρμα ή στείλτε μας φωτογραφίες του χώρου σας για άμεση εκτίμηση.'
                : 'Fill out the form or send photos of your property for a prompt estimate.'}
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
