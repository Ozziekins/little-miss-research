/**
 * Client-side renderers. These must produce the same markup/classes as the
 * matching Astro components (PaperEntry, PaperOfTheDay).
 */
import type { PaperIndexEntry } from '@/lib/search';
import { titleSize } from '@/lib/format';

export interface TopicLite {
  slug: string;
  name: string;
  symbol: string;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function kicker(p: PaperIndexEntry, topics: Record<string, TopicLite>): string {
  return (
    p.topics
      .map((slug) => topics[slug])
      .filter((t) => t !== undefined)
      .map((t) => `<span class="pill pill--sm" data-topic="${t.slug}">${escapeHtml(t.name)}</span>`)
      .join('') +
    (p.igNobel ? `<span class="entry__ig">✦ Ig Nobel ${p.igNobel.year}</span>` : '')
  );
}

/** Must match src/components/PaperEntry.astro. */
export function paperEntry(p: PaperIndexEntry, topics: Record<string, TopicLite>): string {
  return `<article class="entry">
    <p class="entry__kicker">${kicker(p, topics)}</p>
    <h3 class="entry__title"><a href="/papers/${p.slug}/" class="entry__link">${escapeHtml(p.question)}</a></h3>
    <p class="entry__paper">${escapeHtml(p.title)} <span class="entry__year">(${p.year})</span></p>
  </article>`;
}

/** The cover story (today's paper). Used at build time (set:html) and in the browser. */
export function featurePanel(
  p: PaperIndexEntry,
  topics: Record<string, TopicLite>,
  opts: { dateLabel: string; isoDate: string; kicker?: string },
): string {
  return `<p class="kicker">${escapeHtml(opts.kicker ?? 'Today’s paper')} · <time datetime="${opts.isoDate}">${escapeHtml(opts.dateLabel)}</time></p>
    <h2 class="cover__title cover__title--${titleSize(p.title)}"><a href="/papers/${p.slug}/">${escapeHtml(p.title)}</a></h2>
    <p class="cover__standfirst">${escapeHtml(p.tldr)}</p>
    <p class="cover__byline">${escapeHtml(p.byline)}${p.igNobel ? ` · ✦ Ig Nobel ${p.igNobel.year}` : ''}</p>
    <div class="cluster cover__actions">
      <a class="btn btn--lg" href="/papers/${p.slug}/">Read the story</a>
      <a class="arrow-link" href="/random/" rel="nofollow">or surprise me</a>
    </div>`;
}
