/** Greedy word-wrap using an injectable width measurer (canvas in the browser, stub in tests). */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate) <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function resultUrl(base: string, data: { slug: string; name: string; trait: string }): string {
  const url = new URL('/quiz/result/', base);
  url.searchParams.set('p', data.slug);
  if (data.name) url.searchParams.set('n', data.name);
  url.searchParams.set('t', data.trait);
  return url.href;
}
