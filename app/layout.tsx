import type { ReactNode } from 'react';
import { Alexandria, Cairo, Commissioner, Geologica } from 'next/font/google';

import { defaultLocale, rtlLocales } from '@/i18n';
import { basePath } from '@/lib/site-config';
import './globals.css';

const basePathSegments = basePath ? basePath.split('/').filter(Boolean).length : 0;

// Runs synchronously before first paint so a hard-loaded /ar/... page never
// flashes LTR/wrong-font before LangSync's useEffect can catch up.
const syncLangScript = `(function(){try{var s=location.pathname.split('/').filter(Boolean)[${basePathSegments}]||'';var rtl=${JSON.stringify(rtlLocales)};if(s){document.documentElement.lang=s;document.documentElement.dir=rtl.indexOf(s)>-1?'rtl':'ltr';}}catch(e){}})();`;

const geologica = Geologica({ subsets: ['latin', 'greek'], variable: '--font-display', weight: ['500', '600', '700', '800'] });
const commissioner = Commissioner({ subsets: ['latin', 'greek'], variable: '--font-body', weight: ['400', '500', '600'] });
const alexandria = Alexandria({ subsets: ['arabic'], variable: '--font-arabic-display', weight: ['500', '600', '700'] });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-arabic', weight: ['400', '500', '600', '700'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      // The inline script below sets lang/dir before hydration, on purpose.
      suppressHydrationWarning
      className={`${geologica.variable} ${commissioner.variable} ${alexandria.variable} ${cairo.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: syncLangScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased pb-16 md:pb-0">{children}</body>
    </html>
  );
}
