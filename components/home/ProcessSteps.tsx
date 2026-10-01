import { useTranslations } from 'next-intl';

export function ProcessSteps() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as { title: string; text: string }[];

  return (
    <section className="border-y border-border bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('subtitle')}</p>
        </div>

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-foreground pt-5">
              <span className="font-display text-3xl font-bold text-clay">{i + 1}</span>
              <h3 className="mt-2 font-display text-lg font-bold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
