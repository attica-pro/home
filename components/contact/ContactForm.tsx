'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { siteConfig } from '@/lib/site-config';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface AttachedPhoto {
  file: File;
  previewUrl: string;
}

export function ContactForm() {
  const t = useTranslations('contactPage');
  const [status, setStatus] = useState<Status>('idle');
  const [photos, setPhotos] = useState<AttachedPhoto[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, [photos]);

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const oversized = incoming.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileError(t('attachmentTooLarge', { name: oversized.name }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPhotos((current) => {
      const combined = [...current, ...incoming.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))];
      if (combined.length > MAX_FILES) {
        setFileError(t('attachmentTooMany'));
        return combined.slice(0, MAX_FILES);
      }
      setFileError(null);
      return combined;
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].previewUrl);
      return current.filter((_, i) => i !== index);
    });
    setFileError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', siteConfig.formAccessKey);
    formData.append('subject', 'Νέο Αίτημα Εκτίμησης - AtticaPro');
    formData.append('from_name', 'AtticaPro Website');
    photos.forEach((photo) => formData.append('attachment[]', photo.file));

    try {
      const response = await fetch(siteConfig.formEndpoint, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
        setPhotos([]);
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
        <Textarea id="message" name="message" required placeholder={t('messagePlaceholder')} className="mt-1.5" />
      </div>

      <div>
        <Label>{t('attachmentLabel')}</Label>

        <div className="mt-1.5 flex flex-wrap gap-3">
          {photos.map((photo, i) => (
            <div key={photo.previewUrl} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {photos.length < MAX_FILES && (
            <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent">
              <ImagePlus className="h-5 w-5" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
            </label>
          )}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">{t('attachmentHint')}</p>
        <p className="text-xs text-muted-foreground">
          {t('attachmentVideoHint')}{' '}
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent hover:underline"
          >
            WhatsApp
          </a>
          .
        </p>
        {fileError && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fileError}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" variant="accent" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
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
