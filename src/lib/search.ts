import type { Paper } from '@/data/types';
import { byline } from './format';
import { annotations } from '@/data/annotations';

/** The slim shape shipped to the browser for search/random/quiz. */
export interface PaperIndexEntry {
  slug: string;
  title: string;
  question: string;
  tldr: string;
  year: number;
  journal: string;
  byline: string;
  topics: string[];
  tags: string[];
  silliness: number;
  igNobel?: { year: number; category: string };
}

export function toIndexEntry(p: Paper): PaperIndexEntry {
  return {
    slug: p.slug,
    title: p.title,
    question: annotations[p.slug]?.question ?? p.title,
    tldr: p.tldr,
    year: p.year,
    journal: p.journal,
    byline: byline(p),
    topics: [...p.topics],
    tags: p.tags,
    silliness: p.silliness,
    ...(p.igNobel ? { igNobel: p.igNobel } : {}),
  };
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tiny ranked search. Every query word must match somewhere (AND),
 * with title and tag hits weighted above body hits.
 */
export function searchPapers(index: readonly PaperIndexEntry[], query: string): PaperIndexEntry[] {
  const words = normalize(query).split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const scored: { entry: PaperIndexEntry; score: number }[] = [];
  for (const entry of index) {
    const title = normalize(entry.title);
    const tags = normalize(entry.tags.join(' ') + ' ' + entry.topics.join(' '));
    const body = normalize(`${entry.question} ${entry.tldr} ${entry.journal} ${entry.year}`);
    let score = 0;
    let allMatched = true;
    for (const w of words) {
      const s =
        (title.includes(w) ? 5 : 0) +
        (new RegExp(`\\b${w}`).test(title) ? 3 : 0) +
        (tags.includes(w) ? 4 : 0) +
        (body.includes(w) ? 1 : 0);
      if (s === 0) {
        allMatched = false;
        break;
      }
      score += s;
    }
    if (allMatched) scored.push({ entry, score: score + entry.silliness * 0.1 });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.entry);
}
