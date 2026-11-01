import { describe, it, expect } from 'vitest';
import { papers } from '@/data/papers';
import { topics } from '@/data/topics';
import { TOPIC_SLUGS, TRAITS } from '@/data/types';
import { quizQuestions, archetypes } from '@/data/quiz';

describe('paper data integrity', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = papers.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('has unique titles', () => {
    const titles = papers.map((p) => p.title.toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(papers.map((p) => [p.slug, p] as const))('%s is well-formed', (_, p) => {
    expect(p.title.trim()).not.toBe('');
    expect(p.authors.trim()).not.toBe('');
    expect(p.journal.trim()).not.toBe('');
    expect(p.year).toBeGreaterThan(1900);
    expect(p.year).toBeLessThanOrEqual(new Date().getFullYear());
    expect(p.topics.length).toBeGreaterThan(0);
    for (const t of p.topics) expect(TOPIC_SLUGS).toContain(t);
    expect(new Set(p.topics).size).toBe(p.topics.length);
    expect(p.tldr.length).toBeLessThan(200);
    expect(p.summary.length).toBeGreaterThan(0);
    expect(p.verdict.trim()).not.toBe('');
    expect(p.silliness).toBeGreaterThanOrEqual(1);
    expect(p.silliness).toBeLessThanOrEqual(5);
    for (const trait of TRAITS) {
      expect(p.traits[trait]).toBeGreaterThanOrEqual(0);
      expect(p.traits[trait]).toBeLessThanOrEqual(3);
    }
    expect(Object.values(p.traits).some((v) => v > 0)).toBe(true);
    if (p.igNobel) expect(p.igNobel.year).toBeGreaterThanOrEqual(1991); // first Ig Nobels
    if (p.doi) expect(p.doi).toMatch(/^10\.\d{4,}\//);
  });
});

describe('topics', () => {
  it('defines every topic slug exactly once', () => {
    expect(topics.map((t) => t.slug).sort()).toEqual([...TOPIC_SLUGS].sort());
  });

  it('has unique symbols and numbers', () => {
    expect(new Set(topics.map((t) => t.symbol)).size).toBe(topics.length);
    expect(new Set(topics.map((t) => t.number)).size).toBe(topics.length);
  });

  it('gives every topic at least 3 papers', () => {
    for (const t of topics) {
      expect(papers.filter((p) => p.topics.includes(t.slug)).length, t.slug).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('quiz content', () => {
  it('has 4 answers per question, each awarding points', () => {
    for (const q of quizQuestions) {
      expect(q.answers).toHaveLength(4);
      for (const a of q.answers) expect(Object.values(a.points).some((v) => (v ?? 0) > 0)).toBe(true);
    }
  });

  it('has an archetype for every trait', () => {
    for (const t of TRAITS) expect(archetypes[t]).toBeDefined();
  });
});
