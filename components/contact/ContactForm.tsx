'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { siteConfig } from '@/lib/site-config';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contactPage');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', siteConfig.formAccessKey);
    formData.append('subject', 'Νέο Αίτημα Εκτίμησης - AtticaPro');
    formData.append('from_name', 'AtticaPro Website');

    try {
      const response = await fetch(siteConfig.formEndpoint, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">{t('nameLabel')}</Label>
        <Input id="name" name="name" required placeholder={t('namePlaceholder')} className="mt-1.5" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input id="email" name="email" type="email" required placeholder={t('emailPlaceholder')} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">{t('phoneLabel')}</Label>
          <Input id="phone" name="phone" type="tel" placeholder={t('phonePlaceholder')} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t('messageLabel')}</Label>
        <Textarea id="message" name="message" required placeholder={t('messagePlaceholder')} className="mt-1.5 min-h-[120px]" />
      </div>

      <div className="rounded-lg border border-border bg-secondary/60 p-3 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <span>{t('attachmentVideoHint')}</span>
        <a
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-accent hover:underline shrink-0"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp &rarr;
        </a>
      </div>

      <Button type="submit" size="lg" variant="accent" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {status === 'submitting' ? t('submitting') : t('submit')}
      </Button>

      {status === 'success' && (
        <p className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {t('successMessage')}
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {t('errorMessage')}
        </p>
      )}
    </form>
  );
}
