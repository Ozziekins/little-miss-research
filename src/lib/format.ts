/**
 * "Gwilym, S. E., Howard, D. P. J., & Willett, K." → "Gwilym et al."
 * "Smith, G. C. S., & Pell, J. P." → "Smith & Pell"
 * "Fardin, M. A." → "Fardin"
 */
export function shortAuthors(authors: string): string {
  const surname = (s: string) => s.trim().split(',')[0]!.trim();
  const first = surname(authors);
  if (/et al/i.test(authors)) return `${first} et al.`;
  if (!authors.includes('&')) return first;
  const [left, right] = authors.split(/,?\s*&\s*/);
  // Only one author before the "&" means "Surname, I. I." with exactly one comma-separated name.
  const leftNames = left!.split(/,\s*(?=[A-ZÀ-Ž][a-zà-ž])/);
  return leftNames.length === 1 ? `${first} & ${surname(right!)}` : `${first} et al.`;
}

export function byline(p: { authors: string; journal: string; year: number }): string {
  return `${shortAuthors(p.authors)} · ${p.journal} · ${p.year}`;
}

/** Issue numbers count days since the first issue. */
export const FIRST_ISSUE = Date.UTC(2026, 0, 1);

export function issueNumber(date: Date): number {
  const day = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.max(1, Math.floor((day - FIRST_ISSUE) / 86_400_000) + 1);
}

/** Headline size step for very long paper titles, so covers stay graceful. */
export function titleSize(title: string): 'normal' | 'long' | 'very-long' {
  if (title.length > 110) return 'very-long';
  if (title.length > 60) return 'long';
  return 'normal';
}
