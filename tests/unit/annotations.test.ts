import { describe, it, expect } from 'vitest';
import { papers } from '@/data/papers';
import { annotations } from '@/data/annotations';
import { annotateSummary } from '@/lib/annotate';

describe('journal annotations', () => {
  it('every paper has an annotation, and no orphans exist', () => {
    const slugs = new Set(papers.map((p) => p.slug));
    for (const p of papers) expect(annotations[p.slug], p.slug).toBeDefined();
    for (const slug of Object.keys(annotations)) expect(slugs.has(slug), slug).toBe(true);
  });

  it.each(papers.map((p) => [p.slug, p] as const))('%s: highlights and words appear in the summary', (slug, p) => {
    const ann = annotations[slug]!;
    const text = p.summary.join(' ');
    expect(ann.question.trim().endsWith('?') || ann.question.includes('…')).toBe(true);
    expect(ann.highlights.length).toBeGreaterThan(0);
    for (const h of ann.highlights) expect(text, `highlight "${h}"`).toContain(h);
    for (const v of ann.vocab ?? []) expect(text, `word "${v.word}"`).toContain(v.word);

    const html = annotateSummary(p.summary, ann).map((a) => a.html).join(' ');
    expect((html.match(/<mark /g) ?? []).length).toBe(ann.highlights.length);
    expect((html.match(/<dfn /g) ?? []).length).toBe(ann.vocab?.length ?? 0);
  });
});

describe('annotateSummary', () => {
  it('escapes HTML and never nests a word inside a tag', () => {
    const out = annotateSummary(['<b>hi</b> cats flow'], {
      question: '?',
      highlights: ['cats flow'],
      vocab: [{ word: 'hl', meaning: 'x' }],
    });
    expect(out[0]!.html).toBe('&lt;b&gt;hi&lt;/b&gt; <mark class="hl hl--yellow">cats flow</mark>');
    expect(out[0]!.vocab).toEqual([]);
  });

  it('puts vocab notes on the paragraph where the word appears', () => {
    const out = annotateSummary(['one', 'two rheology'], { question: '?', highlights: [], vocab: [{ word: 'rheology', meaning: 'flow' }] });
    expect(out[0]!.vocab).toEqual([]);
    expect(out[1]!.vocab).toHaveLength(1);
  });
});
