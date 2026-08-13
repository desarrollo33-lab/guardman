// ════════════════════════════════════════════════════════════════
// /api/analytics/pageview — endpoint stub de tracking
//   Acepta beacons de form_submit / pageview desde main.js legacy.
//   Por ahora solo registra; en futuro se persiste a D1 o Workers Analytics.
//   Sin auth, siempre 204.
// ════════════════════════════════════════════════════════════════

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Leemos el body solo para asegurar que se cierra; no lo persistimos aún.
  try {
    await request.text();
  } catch {
    // ignore
  }
  return new Response(null, { status: 204 });
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600',
    },
  });
};
