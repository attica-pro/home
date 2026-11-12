import type { ReactNode } from 'react';
import { Roboto_Flex, Roboto_Slab } from 'next/font/google';

import { defaultLocale, rtlLocales } from '@/i18n';
import { basePath } from '@/lib/site-config';
import './globals.css';

const basePathSegments = basePath ? basePath.split('/').filter(Boolean).length : 0;

const syncLangScript = `(function(){try{var s=location.pathname.split('/').filter(Boolean)[${basePathSegments}]||'';var rtl=${JSON.stringify(rtlLocales)};if(s){document.documentElement.lang=s;document.documentElement.dir=rtl.indexOf(s)>-1?'rtl':'ltr';}}catch(e){}})();`;

// Both are variable fonts, so every weight comes from one file.
const robotoSlab = Roboto_Slab({ subsets: ['latin', 'greek'], variable: '--font-display' });
const robotoFlex = Roboto_Flex({ subsets: ['latin', 'greek'], variable: '--font-body' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      // The inline script below sets lang/dir before hydration, on purpose.
      suppressHydrationWarning
      className={`${robotoSlab.variable} ${robotoFlex.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: syncLangScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased pb-16 md:pb-0">{children}</body>
    </html>
  );
}
