# Little Miss Research 🔍

*Papers my IQ can handle.* The funniest real research papers, explained for normal humans.

Static, SEO-first site built with [Astro](https://astro.build) + TypeScript. Zero client framework; small
progressive-enhancement scripts only.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
npm test             # unit tests (Vitest)
npm run build        # type-check + static build to dist/
npm run test:e2e     # Playwright (desktop + mobile), runs against `npm run preview`
npm run images       # regenerate og-default.png + apple-touch-icon.png (needs preview running)
```

Set `SITE_URL` (e.g. `SITE_URL=https://littlemissresearch.com`) at build time; it drives canonical URLs,
the sitemap, RSS and Open Graph tags.

## Features

| Feature | Where |
| --- | --- |
| Paper pages (JSON-LD, breadcrumbs, related, prev/next) | `src/pages/papers/[slug].astro` |
| Topic pages ("periodic table of nonsense") | `src/pages/topics/` |
| Paper of the day: deterministic, same worldwide, no repeats per cycle | `src/lib/daily.ts`, `src/components/PaperOfTheDay.astro` |
| Random paper | `src/pages/random.astro` (noindex) |
| Search (client-side, ranked, `?q=` deep links, SearchAction schema) | `src/lib/search.ts`, `src/pages/search.astro` |
| Personality test + shareable certificate + PNG download | `src/pages/quiz/`, `src/lib/quiz.ts`, `src/scripts/certificate.ts` |
| Sitemap, robots.txt, RSS, manifest, OG/Twitter cards | `astro.config.mjs`, `src/pages/*.ts`, `src/layouts/BaseLayout.astro` |
| Living design system (noindex) | `/design-system/` |

## Project layout

```
src/
  data/        papers.ts (the archive), topics.ts, quiz.ts, types.ts
  lib/         pure, unit-tested logic (queries, daily, search, quiz, seo, text)
  scripts/     browser-only helpers (render, share, certificate)
  components/  Astro UI components
  layouts/     BaseLayout (all <head>/SEO lives here)
  pages/       routes
  styles/      tokens.css → global.css → components.css
tests/unit     Vitest
tests/e2e      Playwright
```

## Design system

- **Newsprint & notebook.** Greige paper with faint ruling inside a thin ink frame. Ink text, mustard newspaper buttons, red section numbers, one pastel per topic for pills (`--topic-*`), and pastels for highlighter, notes and doodles.
- **One catchy thing per screen:** the homepage is a single real question ("Is a cat a liquid?") with *find out* / *ask me another*.
- **Articles are Little Miss's journal:** a proper article plus pastel highlights, “new word!” margin notes, handwritten scribbles and topic doodles. Notes live in `src/data/annotations.ts` (tests check every highlight/word appears verbatim in the summary). Doodles live in `src/components/Doodle.astro`, mapped to topics in `src/lib/doodles.ts`.
- **Three voices:** Fraunces with soft/wonky axes (headlines & UI), Newsreader (reading), Gaegu (logo & handwritten asides). IBM Plex Mono only for citations.
- **Cute, never crude:** warm, kind copy. We laugh with researchers, never at anyone.
- **Always paper:** no dark mode. The site is a printed page.
- **Background music:** a lofi "evil genius in a cardigan" loop, synthesised live with Web Audio (score in `src/lib/music.ts`, engine in `src/scripts/music.ts`). On by default, but browsers only allow sound after the first click/tap, so it starts then. The speaker button mutes it and the choice is remembered. Astro's `ClientRouter` keeps it playing between pages, so page scripts run on `astro:page-load`.
- **Calm & small:** modest type sizes, lots of air, hairlines instead of boxes.
- **Personality in small doses:** handwritten logo, at most one handwritten note per page, handwritten verdicts, Ig Nobel stamps only on paper pages.
- Accessibility: 44px targets, dashed focus rings, skip link, `prefers-reduced-motion`, AA contrast.
- Classes in `components.css` are shared by Astro components *and* client-rendered markup (`src/scripts/render.ts`).
  Change both together.

## Adding a paper

Papers live in `src/data/papers.ts` (the originals) and the themed files in `src/data/collections/`, each of which holds papers **and** their journal notes (question, highlights, words, scribble). Add a new paper to the file that fits its topic, with a `// source:` comment linking to where you verified it. The tests check slugs, topics, trait ranges, duplicate titles/DOIs, banned words, and that every highlight appears verbatim in the summary.

House rules: **it must be real**, it must be charming, keep the copy kind and cute (not crude), and only fill in `doi` once
verified against the publisher (otherwise we link to a Google Scholar search for the exact title).
`traits` (0–3 each: chaotic, cozy, brainy, gremlin, dramatic) power the personality-test matching.

## Deploying (GitHub Pages + littlemissresearch.com)

`.github/workflows/deploy.yml` runs the unit tests, build and end-to-end tests on every push and pull request, and deploys `main` to GitHub Pages. `public/CNAME` holds the custom domain.

One-time setup:

1. Create an empty repo on GitHub and push: `git remote add origin git@github.com:<you>/little-miss-research.git && git push -u origin main`.
2. Repo **Settings → Pages → Source: GitHub Actions**. Under **Custom domain** enter `littlemissresearch.com` and tick **Enforce HTTPS** once the certificate is ready.
3. Namecheap → Domain List → Manage → **Advanced DNS**: delete the default parking records, then add
   - `A` records for host `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for host `www` → `<you>.github.io.`

## Getting found (SEO checklist)

Built in: static HTML, canonical URLs, sitemap, robots.txt, RSS, Open Graph/Twitter cards, JSON-LD (WebSite + search, Article about ScholarlyArticle, breadcrumbs), descriptive titles, fast pages.

After launch:

1. [Google Search Console](https://search.google.com/search-console): add a **Domain** property, verify with the TXT record it gives you (Namecheap → Advanced DNS → TXT, host `@`), then submit `https://littlemissresearch.com/sitemap-index.xml`.
2. [Bing Webmaster Tools](https://www.bing.com/webmasters): import from Search Console (also feeds DuckDuckGo and others).
3. Links from elsewhere matter most: share individual papers where people already talk about weird science (Reddit, Bluesky, Threads, TikTok, newsletters).
4. Keep adding papers. Every paper is a new page that can rank for its own question.
