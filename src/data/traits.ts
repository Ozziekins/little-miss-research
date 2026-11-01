import type { TraitVector } from './types';

/** Trait shorthand: chaotic, cozy, brainy, gremlin, dramatic (0–3 each). */
export const t = (chaotic: number, cozy: number, brainy: number, gremlin: number, dramatic: number): TraitVector => ({
  chaotic,
  cozy,
  brainy,
  gremlin,
  dramatic,
});
