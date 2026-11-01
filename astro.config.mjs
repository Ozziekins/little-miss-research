// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL in your deploy environment. Used for canonical URLs, sitemap and OG tags.
const site = process.env.SITE_URL ?? 'https://littlemissresearch.com';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Utility pages that shouldn't be indexed.
      filter: (page) => !/\/(random|design-system|quiz\/result)\/?$/.test(page),
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
