import type { APIRoute } from 'astro';
import { allPapers } from '@/lib/papers';
import { toIndexEntry } from '@/lib/search';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(allPapers.map(toIndexEntry)), {
    headers: { 'Content-Type': 'application/json' },
  });
