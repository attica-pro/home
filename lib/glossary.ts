import fs from 'node:fs';
import path from 'node:path';

import type { Locale } from '@/i18n';
import type { ServiceSlug } from '@/data/services';
import { getAllProjects, getProjectContent, type ProjectMeta } from '@/lib/projects';
import { getAllGuides, getChapterContent, type GuideChapterMeta, type GuideMeta } from '@/lib/guides';
import { getAllAnswers, type Answer } from '@/lib/answers';

const GLOSSARY_DIR = path.join(process.cwd(), 'content/glossary');

export interface GlossaryTerm {
  slug: string;
  term: Record<Locale, string>;
  /** Words that become links in running text. A trailing `*` makes the alias a stem. */
  aliases: Record<Locale, string[]>;
  /** One or two sentences, shown in the hover pop-up. */
  short: Record<Locale, string>;
  /** Markdown, shown on the term's own page. */
  body: Record<Locale, string>;
  categories: ServiceSlug[];
  photo: { project: string; file: string } | null;
  related: string[];
}

let cache: GlossaryTerm[] | null = null;

export function getAllTerms(): GlossaryTerm[] {
  if (!cache) {
    cache = fs
      .readdirSync(GLOSSARY_DIR)
      .filter((file) => file.endsWith('.json'))
      .map((file) => ({
        slug: file.replace(/\.json$/, ''),
        ...(JSON.parse(fs.readFileSync(path.join(GLOSSARY_DIR, file), 'utf8')) as Omit<GlossaryTerm, 'slug'>),
      }));
  }
  return cache;
}

export function getTerm(slug: string): GlossaryTerm | null {
  return getAllTerms().find((term) => term.slug === slug) ?? null;
}

export function getTermsByCategory(category: ServiceSlug, locale: Locale): GlossaryTerm[] {
  return sortTerms(
    getAllTerms().filter((term) => term.categories.includes(category)),
    locale,
  );
}

export function sortTerms(terms: GlossaryTerm[], locale: Locale): GlossaryTerm[] {
  return [...terms].sort((a, b) => a.term[locale].localeCompare(b.term[locale], locale));
}

export function termHref(locale: string, slug: string) {
  return `/${locale}/knowledge-hub/glossary/${slug}`;
}

// ---------------------------------------------------------------------------
// Matching terms in text

function aliasPattern(alias: string) {
  const stem = alias.endsWith('*');
  const words = (stem ? alias.slice(0, -1) : alias).trim().split(/\s+/);
  const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
  return stem ? `${escaped}\\p{L}*` : escaped;
}

const matcherCache = new Map<string, { slug: string; regex: RegExp }[]>();

/** One regex per term. Arabic matches may start with a proclitic (و ف ب ك ل) and/or the article ال. */
function termMatchers(locale: Locale) {
  let matchers = matcherCache.get(locale);
  if (!matchers) {
    const prefix = locale === 'ar' ? '(?:[وفبكل]?ال|[وفبكل])?' : '';
    matchers = getAllTerms()
      .filter((term) => term.aliases[locale]?.length)
      .map((term) => ({
        slug: term.slug,
        regex: new RegExp(
          `(?<!\\p{L})${prefix}(?:${[...term.aliases[locale]]
            .map(aliasPattern)
            .sort((a, b) => b.length - a.length)
            .join('|')})(?!\\p{L})`,
          'giu',
        ),
      }));
    matcherCache.set(locale, matchers);
  }
  return matchers;
}

interface Span {
  start: number;
  end: number;
  slug: string;
}

/** Non-overlapping term matches in `text`, longest first at each position; at most one per term, skipping `skip`. */
function findSpans(text: string, locale: Locale, skip: Set<string>): Span[] {
  const candidates: Span[] = [];
  for (const { slug, regex } of termMatchers(locale)) {
    if (skip.has(slug)) continue;
    regex.lastIndex = 0;
    const match = regex.exec(text);
    if (match) candidates.push({ start: match.index, end: match.index + match[0].length, slug });
  }
  candidates.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const picked: Span[] = [];
  let lastEnd = -1;
  for (const span of candidates) {
    if (span.start < lastEnd) continue;
    picked.push(span);
    lastEnd = span.end;
  }
  return picked;
}

// ---------------------------------------------------------------------------
// remark plugin: link the first mention of each term on a page

interface MdNode {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
}

/** Content that must never contain a glossary link. */
const SKIP = new Set([
  'heading',
  'link',
  'linkReference',
  'image',
  'imageReference',
  'inlineCode',
  'code',
  'html',
  'definition',
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
  'mdxFlowExpression',
  'mdxTextExpression',
]);

/**
 * Turns the first mention of every glossary term into a link with the
 * `glossary:<slug>` URL, which the page's `a` component renders as a
 * `GlossaryLink`. `exclude` keeps a term from linking to itself.
 */
export function remarkGlossary(options: { locale: Locale; exclude?: string }) {
  return (tree: MdNode) => {
    const linked = new Set<string>(options.exclude ? [options.exclude] : []);
    const walk = (node: MdNode) => {
      if (!node.children || SKIP.has(node.type)) return;
      const children: MdNode[] = [];
      for (const child of node.children) {
        if (child.type !== 'text' || !child.value) {
          walk(child);
          children.push(child);
          continue;
        }
        const text = child.value;
        let cursor = 0;
        for (const span of findSpans(text, options.locale, linked)) {
          linked.add(span.slug);
          if (span.start > cursor) children.push({ type: 'text', value: text.slice(cursor, span.start) });
          children.push({
            type: 'link',
            url: `glossary:${span.slug}`,
            children: [{ type: 'text', value: text.slice(span.start, span.end) }],
          });
          cursor = span.end;
        }
        if (cursor < text.length) children.push({ type: 'text', value: text.slice(cursor) });
      }
      node.children = children;
    };
    walk(tree);
  };
}

// ---------------------------------------------------------------------------
// Where each term is used

/** Markdown with headings, images and existing links removed, i.e. the text a term could link from. */
function linkableText(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^#+ .*$/gm, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, ' ');
}

export interface TermUsage {
  projects: ProjectMeta[];
  chapters: { guide: GuideMeta; chapter: GuideChapterMeta }[];
  answers: Answer[];
}

const usageCache = new Map<Locale, Map<string, TermUsage>>();

function termsIn(markdown: string, locale: Locale) {
  const found = new Set<string>();
  const text = linkableText(markdown);
  // findSpans returns one span per term, so repeat until no new term appears.
  let spans = findSpans(text, locale, found);
  while (spans.length) {
    spans.forEach((span) => found.add(span.slug));
    spans = findSpans(text, locale, found);
  }
  return found;
}

export function getTermUsage(slug: string, locale: Locale): TermUsage {
  let byTerm = usageCache.get(locale);
  if (!byTerm) {
    byTerm = new Map(getAllTerms().map((term) => [term.slug, { projects: [], chapters: [], answers: [] } as TermUsage]));
    for (const answer of getAllAnswers()) {
      termsIn(answer.body[locale] + '\n' + answer.short[locale], locale).forEach((term) => byTerm!.get(term)?.answers.push(answer));
    }
    for (const project of getAllProjects()) {
      const content = getProjectContent(project.slug, locale);
      if (content) termsIn(content, locale).forEach((term) => byTerm!.get(term)?.projects.push(project));
    }
    for (const guide of getAllGuides()) {
      for (const chapter of guide.chapters) {
        const content = getChapterContent(guide.slug, chapter.slug, locale);
        if (content) termsIn(content, locale).forEach((term) => byTerm!.get(term)?.chapters.push({ guide, chapter }));
      }
    }
    usageCache.set(locale, byTerm);
  }
  return byTerm.get(slug) ?? { projects: [], chapters: [], answers: [] };
}
