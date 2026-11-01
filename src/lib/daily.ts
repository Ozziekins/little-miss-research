/**
 * Paper of the day. Deterministic: everyone sees the same paper on the same
 * (UTC) date, and the whole archive is cycled before anything repeats.
 */

/** Days since 1970-01-01 in UTC. */
export function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

/** Small seeded PRNG (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  const rand = seededRandom(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Each "cycle" of N days is a fresh shuffle of all N items, so nothing
 * repeats until every item has had its day.
 */
export function pickForDay<T>(items: readonly T[], date: Date): T {
  if (items.length === 0) throw new Error('pickForDay: no items');
  const day = dayNumber(date);
  const cycle = Math.floor(day / items.length);
  const index = day % items.length;
  return shuffled(items, cycle + 0x5eed)[index]!;
}

export function formatIssueDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}
