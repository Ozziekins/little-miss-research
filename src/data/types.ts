export const TOPIC_SLUGS = [
  'medicine',
  'physics',
  'animals',
  'psychology',
  'tech',
  'food',
  'pop-culture',
] as const;
export type TopicSlug = (typeof TOPIC_SLUGS)[number];

/** Personality dimensions used by the quiz to match humans to papers. */
export const TRAITS = ['chaotic', 'cozy', 'brainy', 'gremlin', 'dramatic'] as const;
export type Trait = (typeof TRAITS)[number];
export type TraitVector = Record<Trait, number>;

export interface Topic {
  slug: TopicSlug;
  name: string;
  /** Two-letter "periodic table" symbol used as the topic's icon. */
  symbol: string;
  /** Atomic number, purely decorative. */
  number: number;
  tagline: string;
  description: string;
}

export interface Paper {
  slug: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  /** First topic is the primary one (used for breadcrumbs). */
  topics: [TopicSlug, ...TopicSlug[]];
  /** One sentence, plain English. */
  tldr: string;
  /** "The gist": short plain-English paragraphs. */
  summary: string[];
  /** The one-line takeaway. */
  verdict: string;
  igNobel?: { year: number; category: string };
  /** 1 (mildly amusing) – 5 (pure delight). */
  silliness: 1 | 2 | 3 | 4 | 5;
  traits: TraitVector;
  tags: string[];
  /** Optional DOI. Only fill this in once verified against the publisher. */
  doi?: string;
}
