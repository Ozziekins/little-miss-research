import { describe, it, expect } from 'vitest';
import { allPapers, getPaper, papersByTopic, relatedPapers, paperSourceUrl, primaryTopic } from '@/lib/papers';
import { metaDescription, paperJsonLd, pageTitle, breadcrumbJsonLd } from '@/lib/seo';
import { wrapText, resultUrl } from '@/lib/text';
import { escapeHtml, paperEntry, featurePanel } from '@/scripts/render';
import { toIndexEntry } from '@/lib/search';

describe('papers lib', () => {
  it('sorts newest first', () => {
    for (let i = 1; i < allPapers.length; i++) expect(allPapers[i - 1]!.year).toBeGreaterThanOrEqual(allPapers[i]!.year);
  });

  it('looks up papers and topics', () => {
    const cat = getPaper('on-the-rheology-of-cats')!;
    expect(cat.title).toMatch(/cats/i);
    expect(primaryTopic(cat).slug).toBe('physics');
    expect(papersByTopic('physics')).toContain(cat);
  });

  it('related papers never include the paper itself', () => {
    for (const p of allPapers) expect(relatedPapers(p).map((r) => r.slug)).not.toContain(p.slug);
  });

  it('links to Scholar when no DOI is known', () => {
    const url = paperSourceUrl({ ...allPapers[0]!, doi: undefined });
    expect(url).toMatch(/^https:\/\/scholar\.google\.com\/scholar\?q=/);
    expect(paperSourceUrl({ ...allPapers[0]!, doi: '10.1000/xyz' })).toBe('https://doi.org/10.1000/xyz');
  });
});

describe('seo', () => {
  it('keeps short descriptions intact and trims long ones on a word boundary', () => {
    expect(metaDescription('Short.')).toBe('Short.');
    const long = metaDescription('word '.repeat(80));
    expect(long.length).toBeLessThanOrEqual(155);
    expect(long.endsWith('…')).toBe(true);
  });

  it('builds titles', () => {
    expect(pageTitle()).toContain('Little Miss Research');
    expect(pageTitle('Cats')).toBe('Cats · Little Miss Research');
  });

  it('builds structured data', () => {
    const p = allPapers[0]!;
    const ld = paperJsonLd(p, 'https://x.test/papers/a/');
    expect(ld['@type']).toBe('Article');
    expect(ld.about.name).toBe(p.title);
    const bc = breadcrumbJsonLd([{ name: 'Home', url: 'https://x.test/' }]);
    expect(bc.itemListElement[0]!.position).toBe(1);
  });
});

describe('text helpers', () => {
  const measure = (s: string) => s.length;
  it('wraps words to width', () => {
    expect(wrapText('the cat is a liquid', 10, measure)).toEqual(['the cat is', 'a liquid']);
  });
  it('never drops a word longer than the width', () => {
    expect(wrapText('supercalifragilistic', 5, measure)).toEqual(['supercalifragilistic']);
  });
  it('builds result URLs', () => {
    const url = new URL(resultUrl('https://x.test', { slug: 'cats', name: 'Ada & Bob', trait: 'cozy' }));
    expect(url.pathname).toBe('/quiz/result/');
    expect(url.searchParams.get('n')).toBe('Ada & Bob');
  });
});

describe('client renderers', () => {
  it('escapes HTML', () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe('&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;');
  });

  it('renders an entry with escaped content', () => {
    const entry = { ...toIndexEntry(allPapers[0]!), title: '<script>x</script>' };
    const html = paperEntry(entry, {});
    expect(html).not.toContain('<script>');
    expect(html).toContain(`/papers/${entry.slug}/`);
  });

  it('renders the feature with escaped content and date', () => {
    const entry = { ...toIndexEntry(allPapers[0]!), tldr: '<b>bold</b>' };
    const html = featurePanel(entry, {}, { dateLabel: 'Today', isoDate: '2026-11-01' });
    expect(html).not.toContain('<b>');
    expect(html).toContain('datetime="2026-11-01"');
  });
});

import { shortAuthors, issueNumber, titleSize } from '@/lib/format';

describe('format', () => {
  it('shortens author lists', () => {
    expect(shortAuthors('Fardin, M. A.')).toBe('Fardin');
    expect(shortAuthors('Smith, G. C. S., & Pell, J. P.')).toBe('Smith & Pell');
    expect(shortAuthors('Gwilym, S. E., Howard, D. P. J., Davies, N., & Willett, K.')).toBe('Gwilym et al.');
    expect(shortAuthors('Yeh, R. W., Valsdottir, L. R., et al.')).toBe('Yeh et al.');
  });

  it('counts issues from 1 January 2026', () => {
    expect(issueNumber(new Date('2026-01-01T12:00:00Z'))).toBe(1);
    expect(issueNumber(new Date('2026-01-02T00:00:00Z'))).toBe(2);
    expect(issueNumber(new Date('2025-06-01T00:00:00Z'))).toBe(1);
  });

  it('sizes long titles down', () => {
    expect(titleSize('On the rheology of cats')).toBe('normal');
    expect(titleSize('x'.repeat(80))).toBe('long');
    expect(titleSize('x'.repeat(140))).toBe('very-long');
  });
});
