import type { TopicSlug } from '@/data/types';

export const DOODLES = [
  'atom', 'flask', 'benzene', 'formula', 'integral', 'wave',
  'pill', 'pulse', 'plus',
  'paw', 'fish', 'feather',
  'bubble', 'bulb',
  'laptop', 'code', 'binary',
  'coffee', 'toast', 'donut',
  'star', 'wand', 'heart',
  'sparkle', 'arrow', 'swirl',
] as const;
export type DoodleName = (typeof DOODLES)[number];

/** Which doodles belong to which topic. Chemistry & maths doodles live with physics and food. */
export const topicDoodles: Record<TopicSlug, DoodleName[]> = {
  medicine: ['pill', 'pulse', 'plus', 'flask'],
  physics: ['atom', 'formula', 'integral', 'wave'],
  animals: ['paw', 'fish', 'feather'],
  psychology: ['bubble', 'bulb', 'heart'],
  tech: ['laptop', 'code', 'binary'],
  food: ['coffee', 'toast', 'donut', 'benzene'],
  'pop-culture': ['star', 'wand', 'sparkle'],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** A stable little set of doodles for a paper: mostly its main topic, plus one from a second topic. */
export function doodlesFor(slug: string, topics: readonly TopicSlug[], count = 3): DoodleName[] {
  const h = hash(slug);
  const primary = topicDoodles[topics[0]!];
  const rotate = <T,>(list: T[], by: number) => list.map((_, i) => list[(i + by) % list.length]!);
  const picks = rotate(primary, h % primary.length).slice(0, topics.length > 1 ? count - 1 : count);
  for (const t of topics.slice(1)) {
    const extra = rotate(topicDoodles[t], h % topicDoodles[t].length).find((d) => !picks.includes(d));
    if (extra && picks.length < count) picks.push(extra);
  }
  return picks;
}
