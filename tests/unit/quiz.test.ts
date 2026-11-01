import { describe, it, expect } from 'vitest';
import { quizQuestions } from '@/data/quiz';
import { TRAITS } from '@/data/types';
import { allPapers } from '@/lib/papers';
import { scoreAnswers, dominantTrait, matchPaper, sanitizeName, emptyTraits } from '@/lib/quiz';

describe('scoreAnswers', () => {
  it('sums trait points from chosen answers', () => {
    const allFirst = quizQuestions.map(() => 0);
    const score = scoreAnswers(quizQuestions, allFirst);
    const total = Object.values(score).reduce((a, b) => a + b, 0);
    const expected = quizQuestions.reduce(
      (sum, q) => sum + Object.values(q.answers[0]!.points).reduce((a, b) => a + (b ?? 0), 0),
      0,
    );
    expect(total).toBe(expected);
  });

  it('rejects out-of-range answers', () => {
    expect(() => scoreAnswers(quizQuestions, [9])).toThrow();
  });
});

describe('dominantTrait', () => {
  it('picks the highest trait', () => {
    expect(dominantTrait({ ...emptyTraits(), gremlin: 5, cozy: 2 })).toBe('gremlin');
  });

  it('every trait is reachable as an outcome', () => {
    for (const trait of TRAITS) {
      const choices = quizQuestions.map((q) => {
        const best = q.answers.reduce((bi, a, i) => ((a.points[trait] ?? 0) > (q.answers[bi]!.points[trait] ?? 0) ? i : bi), 0);
        return best;
      });
      expect(dominantTrait(scoreAnswers(quizQuestions, choices))).toBe(trait);
    }
  });
});

describe('matchPaper', () => {
  const candidates = allPapers.map((p) => ({ slug: p.slug, traits: p.traits }));

  it('returns a real paper', () => {
    const profile = { ...emptyTraits(), cozy: 10 };
    const match = matchPaper(profile, candidates, 'Ada');
    expect(candidates.map((c) => c.slug)).toContain(match.slug);
    expect(dominantTrait(match.traits)).toBe('cozy');
  });

  it('is deterministic for the same name', () => {
    const profile = { ...emptyTraits(), chaotic: 6, brainy: 4 };
    expect(matchPaper(profile, candidates, 'Ada').slug).toBe(matchPaper(profile, candidates, ' ada ').slug);
  });

  it('can assign many different papers across all answer combinations', () => {
    const results = new Set<string>();
    for (let i = 0; i < 4 ** 4; i++) {
      const choices = quizQuestions.map((_, q) => Math.floor(i / 4 ** (q % 4)) % 4);
      results.add(matchPaper(scoreAnswers(quizQuestions, choices), candidates).slug);
    }
    expect(results.size).toBeGreaterThan(10);
  });
});

describe('sanitizeName', () => {
  it('strips markup characters, collapses whitespace and caps length', () => {
    expect(sanitizeName('  <b>Ada</b>   "Lovelace" ')).toBe('bAda/b Lovelace');
    expect(sanitizeName('x'.repeat(100))).toHaveLength(40);
  });
});
