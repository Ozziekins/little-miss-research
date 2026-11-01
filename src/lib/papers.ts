import { papers } from '@/data/papers';
import { topics } from '@/data/topics';
import { annotations, type Annotation } from '@/data/annotations';
import type { Paper, Topic, TopicSlug } from '@/data/types';

/** All papers, newest first. Stable order matters for paper-of-the-day. */
export const allPapers: readonly Paper[] = [...papers].sort(
  (a, b) => b.year - a.year || a.slug.localeCompare(b.slug),
);

export const allTopics: readonly Topic[] = topics;

export function getPaper(slug: string): Paper | undefined {
  return allPapers.find((p) => p.slug === slug);
}

export function getTopic(slug: string): Topic | undefined {
  return allTopics.find((t) => t.slug === slug);
}

export function papersByTopic(slug: TopicSlug): Paper[] {
  return allPapers.filter((p) => p.topics.includes(slug));
}

export function primaryTopic(paper: Paper): Topic {
  const topic = getTopic(paper.topics[0]);
  if (!topic) throw new Error(`Unknown topic "${paper.topics[0]}" on paper "${paper.slug}"`);
  return topic;
}

/** Papers sharing the most topics/tags with the given one. */
export function relatedPapers(paper: Paper, limit = 3): Paper[] {
  const score = (other: Paper) =>
    other.topics.filter((t) => paper.topics.includes(t)).length * 2 +
    other.tags.filter((t) => paper.tags.includes(t)).length * 3;
  return allPapers
    .filter((p) => p.slug !== paper.slug)
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || a.p.slug.localeCompare(b.p.slug))
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Link out to the paper. We use a Scholar search rather than guessing a DOI. */
export function paperSourceUrl(paper: Paper): string {
  if (paper.doi) return `https://doi.org/${paper.doi}`;
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(`"${paper.title}"`)}`;
}

export function paperPath(paper: Pick<Paper, 'slug'>): string {
  return `/papers/${paper.slug}/`;
}

export function topicPath(topic: Pick<Topic, 'slug'>): string {
  return `/topics/${topic.slug}/`;
}

export const igNobelCount = allPapers.filter((p) => p.igNobel).length;

export function getAnnotation(slug: string): Annotation | undefined {
  return annotations[slug];
}
