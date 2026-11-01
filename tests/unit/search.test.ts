import { describe, it, expect } from 'vitest';
import { allPapers } from '@/lib/papers';
import { searchPapers, toIndexEntry, normalize } from '@/lib/search';

const index = allPapers.map(toIndexEntry);

describe('normalize', () => {
  it('lowercases, strips accents and punctuation', () => {
    expect(normalize('  Pokémon: GOTTA   catch ’em! ')).toBe('pokemon gotta catch em');
  });
});

describe('searchPapers', () => {
  it('finds Harry Potter papers', () => {
    const hits = searchPapers(index, 'harry potter');
    expect(hits.length).toBeGreaterThanOrEqual(2);
    expect(hits.every((h) => /harry potter/i.test(h.title + h.tags.join(' ')))).toBe(true);
  });

  it('ranks title matches first', () => {
    expect(searchPapers(index, 'wombat')[0]!.slug).toContain('wombat');
  });

  it('matches accents loosely', () => {
    expect(searchPapers(index, 'pokemon')[0]!.slug).toContain('pokemon');
  });

  it('requires every word to match (AND)', () => {
    expect(searchPapers(index, 'cats xylophonequasar')).toEqual([]);
  });

  it('matches topic names', () => {
    expect(searchPapers(index, 'physics').length).toBeGreaterThan(3);
  });

  it('returns nothing for blank queries', () => {
    expect(searchPapers(index, '   ')).toEqual([]);
    expect(searchPapers(index, '!!!')).toEqual([]);
  });
});
