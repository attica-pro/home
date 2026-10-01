import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';

import type { Locale } from '@/i18n';
import { guidePath, type GuideMeta } from '@/lib/guides';
import { assetPath } from '@/lib/site-config';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function GuideCard({ guide, locale }: { guide: GuideMeta; locale: Locale }) {
  const t = useTranslations('knowledgeHubPage');
  const tCommon = useTranslations('common');
  const tServices = useTranslations('services.items');

  return (
    <Link href={`/${locale}${guidePath(guide)}`}>
      <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-[16/9] w-full">
          <Image src={assetPath(guide.coverImage)} alt={guide.title[locale]} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          <span className="absolute bottom-2 end-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            <BookOpen className="h-3 w-3" />
            {t('chapterCount', { count: guide.chapters.length })}
          </span>
        </div>
        <CardContent className="pt-5">
          <Badge variant={guide.category === 'insulation' ? 'secondary' : 'accent'}>{tServices(`${guide.category}.name`)}</Badge>
          <h3 className="mt-3 font-display text-lg font-semibold text-primary">{guide.title[locale]}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{guide.excerpt[locale]}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-accent">{tCommon('readGuide')}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
