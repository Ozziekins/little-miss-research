import type { Annotation } from '@/data/annotations';

export const HIGHLIGHT_COLOURS = ['yellow', 'pink', 'mint', 'sky', 'lilac'] as const;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Replace the first occurrence of `needle` that sits in text (not inside a tag). */
function replaceInText(html: string, needle: string, wrap: (s: string) => string): { html: string; found: boolean } {
  const parts = html.split(/(<[^>]+>)/);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    if (part.startsWith('<')) continue;
    const at = part.indexOf(needle);
    if (at !== -1) {
      parts[i] = part.slice(0, at) + wrap(needle) + part.slice(at + needle.length);
      return { html: parts.join(''), found: true };
    }
  }
  return { html, found: false };
}

export interface AnnotatedParagraph {
  html: string;
  /** Vocab words introduced in this paragraph, for the margin. */
  vocab: { word: string; meaning: string }[];
}

/**
 * Turn plain summary paragraphs into journal-style HTML:
 * pastel highlighter marks and dotted-underlined "new words".
 * Each highlight/word is used once, in the first paragraph where it appears.
 */
export function annotateSummary(paragraphs: readonly string[], ann: Annotation | undefined): AnnotatedParagraph[] {
  const pendingHighlights = [...(ann?.highlights ?? [])];
  const pendingVocab = [...(ann?.vocab ?? [])];
  let colour = 0;

  return paragraphs.map((text) => {
    let html = escapeHtml(text);
    for (const phrase of [...pendingHighlights]) {
      const res = replaceInText(html, escapeHtml(phrase), (s) => {
        const c = HIGHLIGHT_COLOURS[colour++ % HIGHLIGHT_COLOURS.length];
        return `<mark class="hl hl--${c}">${s}</mark>`;
      });
      if (res.found) {
        html = res.html;
        pendingHighlights.splice(pendingHighlights.indexOf(phrase), 1);
      }
    }
    const vocab: AnnotatedParagraph['vocab'] = [];
    for (const v of [...pendingVocab]) {
      const res = replaceInText(html, escapeHtml(v.word), (s) => `<dfn class="vocab" title="${escapeHtml(v.meaning)}">${s}</dfn>`);
      if (res.found) {
        html = res.html;
        vocab.push(v);
        pendingVocab.splice(pendingVocab.indexOf(v), 1);
      }
    }
    return { html, vocab };
  });
}
