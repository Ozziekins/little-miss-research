import { describe, it, expect } from 'vitest';
import { dayNumber, pickForDay, shuffled, seededRandom } from '@/lib/daily';

const items = Array.from({ length: 40 }, (_, i) => `paper-${i}`);

describe('dayNumber', () => {
  it('counts UTC days since epoch', () => {
    expect(dayNumber(new Date('1970-01-01T00:00:00Z'))).toBe(0);
    expect(dayNumber(new Date('1970-01-02T23:59:59Z'))).toBe(1);
  });
});

describe('seededRandom / shuffled', () => {
  it('is deterministic for a seed', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('returns a permutation without mutating the input', () => {
    const input = [...items];
    const out = shuffled(input, 7);
    expect(input).toEqual(items);
    expect([...out].sort()).toEqual([...items].sort());
  });
});

describe('pickForDay', () => {
  it('gives the same paper all day long', () => {
    expect(pickForDay(items, new Date('2026-11-01T00:00:01Z'))).toBe(pickForDay(items, new Date('2026-11-01T23:59:59Z')));
  });

  it('shows every paper exactly once per cycle before repeating', () => {
    const start = dayNumber(new Date('2026-01-01T00:00:00Z'));
    const cycleStart = Math.ceil(start / items.length) * items.length;
    const seen = new Set<string>();
    for (let d = 0; d < items.length; d++) {
      seen.add(pickForDay(items, new Date((cycleStart + d) * 86_400_000)));
    }
    expect(seen.size).toBe(items.length);
  });

  it('changes from day to day', () => {
    const today = new Date('2026-11-01T12:00:00Z');
    const tomorrow = new Date('2026-11-02T12:00:00Z');
    expect(pickForDay(items, today)).not.toBe(pickForDay(items, tomorrow));
  });

  it('throws on empty input', () => {
    expect(() => pickForDay([], new Date())).toThrow();
  });
});
