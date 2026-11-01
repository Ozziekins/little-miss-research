import type { Paper } from '@/data/types';

export const SITE = {
  name: 'Little Miss Research',
  tagline: 'Papers my IQ can handle',
  description:
    'The funniest real research papers ever published, from Harry Potter to liquid cats, explained in plain English. New paper of the day, every day.',
  locale: 'en_GB',
} as const;

export function pageTitle(title?: string): string {
  return title ? `${title} · ${SITE.name}` : `${SITE.name} · Funny real research papers, explained`;
}

/** Trim to ~155 chars on a word boundary for meta descriptions. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:\s]+$/, '') + '…';
}

export function websiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    alternateName: SITE.tagline,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl.replace(/\/$/, '')}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Our page is a review/explainer *about* a scholarly article. */
export function paperJsonLd(paper: Paper, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${paper.title}: explained`,
    description: paper.tldr,
    url: pageUrl,
    about: {
      '@type': 'ScholarlyArticle',
      name: paper.title,
      author: paper.authors,
      datePublished: String(paper.year),
      isPartOf: { '@type': 'Periodical', name: paper.journal },
      ...(paper.doi ? { sameAs: `https://doi.org/${paper.doi}` } : {}),
    },
    keywords: paper.tags.join(', '),
    publisher: { '@type': 'Organization', name: SITE.name },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
