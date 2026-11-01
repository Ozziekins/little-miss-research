import { TRAITS, type Trait, type TraitVector } from '@/data/types';
import type { QuizQuestion } from '@/data/quiz';

export interface Matchable {
  slug: string;
  traits: TraitVector;
}

export function emptyTraits(): TraitVector {
  return { chaotic: 0, cozy: 0, brainy: 0, gremlin: 0, dramatic: 0 };
}

/** Sum the trait points for the chosen answer index of each question. */
export function scoreAnswers(questions: readonly QuizQuestion[], choices: readonly number[]): TraitVector {
  const total = emptyTraits();
  questions.forEach((q, i) => {
    const choice = choices[i];
    if (choice === undefined) return;
    const answer = q.answers[choice];
    if (!answer) throw new Error(`Invalid answer ${choice} for question "${q.id}"`);
    for (const trait of TRAITS) total[trait] += answer.points[trait] ?? 0;
  });
  return total;
}

export function dominantTrait(v: TraitVector): Trait {
  return TRAITS.reduce((best, t) => (v[t] > v[best] ? t : best), TRAITS[0]);
}

function cosine(a: TraitVector, b: TraitVector): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const t of TRAITS) {
    dot += a[t] * b[t];
    na += a[t] ** 2;
    nb += b[t] ** 2;
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

/** Simple string hash so ties break the same way for the same name. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Find the best-fitting paper. Near-ties (within 0.02) are broken by the
 * person's name, so friends with identical answers can still get different papers.
 */
export function matchPaper<T extends Matchable>(profile: TraitVector, candidates: readonly T[], name = ''): T {
  if (candidates.length === 0) throw new Error('matchPaper: no candidates');
  const scored = candidates.map((c) => ({ c, s: cosine(profile, c.traits) }));
  const best = Math.max(...scored.map((x) => x.s));
  const top = scored.filter((x) => best - x.s <= 0.02).sort((a, b) => a.c.slug.localeCompare(b.c.slug));
  return top[hashString(name.trim().toLowerCase()) % top.length]!.c;
}

/** Clean user-entered names for display/share URLs. */
export function sanitizeName(raw: string): string {
  return raw.replace(/[<>"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
}
