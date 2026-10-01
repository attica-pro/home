import Link from 'next/link';
import { MessageCircleQuestion } from 'lucide-react';

import type { Locale } from '@/i18n';
import { answerHref, type Answer } from '@/lib/answers';

export function AnswerCard({ answer, locale }: { answer: Answer; locale: Locale }) {
  return (
    <Link
      href={answerHref(locale, answer.slug)}
      className="flex gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground"
    >
      <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
      <span className="min-w-0">
        <span className="block font-semibold text-primary">{answer.question[locale]}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{answer.short[locale]}</span>
      </span>
    </Link>
  );
}
