# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AtticaPro: a marketing site for an Athens contractor doing insulation/waterproofing, painting, bathroom and kitchen renovations, wall demolition, paving, wooden shutter/door/pergola restoration, and small repairs. Next.js 14 App Router, TypeScript, Tailwind (shadcn/ui-style components in `components/ui/`), next-intl, MDX content. Trilingual: Greek (`el`, default), English (`en`), Arabic (`ar`, RTL).

### The business

AtticaPro is run by Mohamed Tawesh, the main worker, who works with a network of other professionals, including trusted electricians and plumbers for the electrical and plumbing side of a job. When writing site copy, present Mohamed as the lead and the others as trusted collaborators. Don't put Mohamed in the forefront of the branding, though: the brand is AtticaPro, so his face and name don't belong in the logo, hero, business cards or as the brand's main trust message. Mohamed has 18 years of experience (confirmed by the site owner; it's shown in the hero and on the insulation page). Don't invent other names, credentials, warranties or project counts. Made-up numbers like those were deliberately removed. The same goes for testimonials: the made-up ones were removed, and the plan is to bring in real reviews from Google Maps later, so don't add any in the meantime.

Mohamed can only read Arabic. Anything meant for him to read (questions, checklists, strategy, message templates) must be in Arabic, and any process that has him handle written Greek (replying to reviews, writing quotes) needs ready-made Greek text or someone else to write it.

Never mention ελενίτ or asbestos anywhere on the site, in any language. In Greece ελενίτ means the asbestos-cement sheeting used until the 1990s, which is now banned, and the owner asked for every reference to be removed. Corrugated metal sheets (κυματοειδείς λαμαρίνες) are a different, normal material and fine to mention.

Questions only Mohamed can answer (materials, groupings, claims) are collected in `content/open-questions.json`, written in Greek and Arabic. Add new ones there rather than guessing, and apply his answers when they come in.

Photos of Mohamed's real work are on his Facebook page, https://www.facebook.com/mohamed.tawesh. They are the source for the portfolio photos and for the service drawings (see Brand). 

## Brand

The look is "Lime & Indigo": ink drawings of real jobs on a lime-plaster ground, with indigo for the brand and colour otherwise kept for small things.
- **Colours** are CSS variables in `app/globals.css`: lime-plaster background (`#EEEBE3`), indigo-black ink text (`primary` and `foreground`, `#1C1E2B`), paper for cards and alternate sections (`card`, `secondary`, `#FAF8F2`), indigo for the brand and main buttons (`accent`, `#2E3A6E`), and copper as a small accent only (`#985623`; the token and classes are still called `clay`: `text-clay`, `fill-clay`): eyebrow labels, step numbers, one part of each icon. The copper is kept dark enough for small text on the background (4.5:1). Don't add other hues or gradients. The same colours are hard-coded in the logo, `app/icon.svg`, `scripts/generate-guide-covers.py` and `scripts/prepare-illustrations.py`, so change them together.
- **Fonts**: Roboto Slab for headings (`font-display`) and Roboto Flex for text, both variable fonts with Greek, loaded in `app/layout.tsx`. Arabic switches to Alexandria and Cairo via `html:lang(ar)`. Don't use a font without Greek glyphs; Greek is the default locale.
- **Logo**: `Mark` and `Logo` in `components/layout/Logo.tsx` (a drop falling onto a flat roof slab with its copper layer; the earlier walls-and-slab version read as the letter H and was dropped); `app/icon.svg` is the same mark. The lockup names the trades (`common.trades`), never a person.
- **Icons**: one line icon per service in `components/icons/ServiceIcons.tsx`, mapped in `data/services.ts`, each with exactly one `fill-clay` part. Lucide is fine for generic UI icons (arrows, phone).
- **Drawings**: one per service in `public/images/illustrations/<slug>.png` (`serviceIllustration()`), shown on the home hero, the service cards and each service page. They are made in Gemini from job photos (prompt in `fb-photos/illustration-refs/PROMPT.md`, outputs saved there as `<slug>-<photo>-ill.jpg`), then `scripts/prepare-illustrations.py` (needs numpy and opencv-python-headless) turns them into matching transparent ink PNGs. Workers in them are generic figures. Real photos stay on the portfolio pages.
- **Style**: thin ink rules (`border-foreground`) instead of shadows and rotated cards, `eyebrow` labels above headings, square-ish corners (`--radius` 6px). No handwriting, tape or tilted photos.

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # next lint (eslint-config-next)
NEXT_PUBLIC_GITHUB_PAGES=true npm run build   # static export to ./out, as CI does
```

There is no test suite. Verify changes with `npm run lint` and `npm run build` (the build type-checks and pre-renders every locale/guide/chapter, so it catches missing content files and bad params).

## Deployment and the static-export constraint

The site is served by GitHub Pages at **https://attica.pro** (custom domain), from the repository https://github.com/attica-pro/home. `.github/workflows/deploy-pages.yml` builds with `NEXT_PUBLIC_GITHUB_PAGES=true` and deploys `./out` on pushes to `main`. That flag (read in `next.config.mjs`) switches on `output: 'export'`. The site lives at the domain root, so `basePath` is empty and `siteUrl` in `lib/site-config.ts` is `https://attica.pro`. `public/CNAME` holds the domain; the domain itself is set under the repository's Settings → Pages, with DNS pointing at GitHub Pages.

Everything the build needs is committed: `content/`, `public/` (including the job photos in `public/images/projects/` and the guide covers) and `scripts/`. Only `fb-photos/` (the raw Facebook download) stays out of the repository.

Consequences to keep in mind:
- The site must stay fully static: no middleware, API routes, server actions, or request-time data. Every dynamic route needs `generateStaticParams` covering all `locales`.
- There is no next-intl middleware. `app/page.tsx` redirects `/` to `/el` client-side, and every server page/layout calls `setRequestLocale(locale)` before using translations.
- Keep wrapping local image `src` values in `assetPath()` from `lib/site-config.ts`. It's a no-op at the domain root, but it keeps images working if the site is ever served under a sub-path again (`next/image` with `unoptimized: true` doesn't add `basePath` itself).
- Internal links are hand-built as `` `/${locale}/...` `` (there is no locale-aware Link wrapper).

## i18n and RTL

- Locale list, default and `rtlLocales` live in `i18n.ts`. UI strings are in `messages/{el,en,ar}.json`, namespaced by page or section (`hero`, `services`, `contactPage`, `common`, …). Any new key must go into all three files.
- Services are driven by `data/services.ts` (`serviceSlugs`, in display order, plus an icon for each). Each slug is a page at `/[locale]/services/[slug]` and has its copy under `services.items.<slug>` in the message files: `name` (short label), `place` (the part of the house, shown as the eyebrow), `title`, `cardDesc`, `subtitle`, `sections`, `whyItems`. The navbar, mobile menu, footer, sitemap, service cards and portfolio filters all read from that list, so adding a service means adding the slug, an icon, a drawing and the messages in all three languages.
- Translatable data outside the message files uses `Record<Locale, string>` fields: each guide's `guide.json` and each project's `project.json`.
- The root `app/layout.tsx` owns `<html>` and can't know the locale at build time, so `lang`/`dir` are set client-side. An inline script in `<head>` sets them before first paint (it's basePath-aware), and `components/layout/LangSync.tsx` keeps them in sync on client navigation. Arabic uses the Cairo font via `--font-arabic`.
- `LocaleSwitcher` swaps the first path segment of the current pathname.

## Knowledge Hub content

The hub is organized by the same categories as the services: `/[locale]/knowledge-hub/<service>` lists that category's guides, glossary terms and a few jobs, and each service page links to it. Guides are nested under their category (`/knowledge-hub/<category>/<guide>/<chapter>`; build links with `guidePath()` from `lib/guides.ts`).

Guides live in `content/guides/<guide-slug>/`:
- `guide.json` holds the category (a service slug), coverImage (`/images/articles/<guide-slug>.svg`, an abstract cover in the brand palette drawn by `python3 scripts/generate-guide-covers.py` from the guide's category; re-run it after adding a guide), date, localized title and excerpt, and an ordered `chapters` array (slug plus localized title).
- `<chapter-slug>.<locale>.mdx` holds one file per chapter per locale. All three locales are expected, and a missing file 404s that page.

The glossary lives in `content/glossary/<slug>.json` (`term`, `aliases`, `short`, `body`, `categories`, `photo`, `related`, each text field `{el,en,ar}`), with an index at `/knowledge-hub/glossary` and one page per term. All markdown (job write-ups, guide chapters, term bodies) renders through `components/knowledge/RichText.tsx`, whose remark plugin (`remarkGlossary` in `lib/glossary.ts`) links the first mention of each term on a page to its glossary page, with a hover pop-up showing `short` (`GlossaryLink`). Aliases are whole words, or stems when they end in `*`; Arabic matches may start with و ف ب ك ل and/or ال. Headings, images and existing links are never linked. Each term page lists the jobs and guide chapters that mention it.

Quick answers live in `content/answers/<slug>.json` (`category`, `order`, `question`, `short`, `body`, `projects`; text fields `{el,en,ar}`). Each answers one homeowner question and is grounded in real jobs: `projects` lists the jobs shown under it, and body images are written as `![alt](<project-slug>/<file>)`. They appear at `/knowledge-hub/answers/<slug>`, on their category page, on the jobs they cite, and on the glossary pages of terms they mention.

`lib/guides.ts` reads these with `fs` at build time. Chapters render through `next-mdx-remote/rsc`, and `app/sitemap.ts` lists every guide and chapter automatically.

## Portfolio projects

Each past job has its own page at `/[locale]/portfolio/<slug>`. Projects live in `content/projects/<slug>/`:
- `project.json` holds the service (a service slug), `featured` (at most one per service: it leads the portfolio page's featured section, and the first three in service order appear on the home page), `order` (the job's first Facebook photo number, so newest jobs come first), localized title and excerpt, `cover`, `comparisons` (before/after image pairs for the slider; can be empty, and then the cover is shown instead), optional `relatedGuide`, and `photos`.
- `{el,en,ar}.md` holds the step-by-step write-up as `### N. Step title`, then an image, then a short paragraph. Images are bare file names (`![alt](step-01.jpg)`); the page resolves them to the project's image directory.
- Images live in `public/images/projects/<slug>/`. They aren't edited by hand. `photos` maps each file name to the Facebook photo number it came from, and `python3 scripts/import-project-photos.py` regenerates the directory from the local, gitignored `fb-photos/` download (full size when available, otherwise the 206px thumbnail).

`fb-photos/` contains `photos.json` (all 1,169 Facebook photos in profile order), `thumbs/` and `full/` (named `NNNN_<fbid>.jpg`), contact sheets in `sheets/`, and `notes.md`, a triage of which numbers belong to which job. Write-ups should only describe what the photos show. Locations and dates are unknown, so leave them out.

## Other notes

- The contact form (`components/contact/ContactForm.tsx`) posts directly from the browser to Web3Forms (`siteConfig.formEndpoint`/`formAccessKey`), with multiple photo attachments as `attachment[]`. Contact numbers (mobile, which is also WhatsApp/Viber, and landline), email, the Google Maps link and social links are all in `siteConfig`; the street address is `common.address` in the message files.
- Client UI state (the mobile menu) lives in a zustand store, `store/useUIStore.ts`.
- Some values are still placeholders: `formAccessKey` and the social links.
