import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPapers, paperPath } from '@/lib/papers';
import { SITE } from '@/lib/seo';

export function GET(context: APIContext) {
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: allPapers.map((p) => ({
      title: p.title,
      description: p.tldr,
      link: paperPath(p),
      categories: [...p.topics],
    })),
  });
}
