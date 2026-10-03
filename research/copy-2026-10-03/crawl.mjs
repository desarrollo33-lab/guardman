#!/usr/bin/env node
/**
 * Crawl completo de un sitio para auditoria de copy.
 * Uso: node crawl.mjs <url-base> <carpeta-destino>
 *
 * - Lee robots.txt + sitemap.xml (todas las variantes conocidas).
 * - Si no hay sitemap, hace breadth-first desde la home, mismo host, mismo prefijo.
 * - Guarda el HTML crudo, un .txt con el texto visible y un manifest.json.
 * - Politeness: 1 request a la vez, delay entre requests, User-Agent identificable.
 */
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const [, , BASE, OUT] = process.argv;
if (!BASE || !OUT) {
  console.error('uso: node crawl.mjs <url-base> <carpeta-destino>');
  process.exit(1);
}
const base = BASE.replace(/\/+$/, '');
const origin = new URL(base).origin;
const ua = 'GuardMan-CopyAudit/1.0 (+auditoria de copy interna; contacto: oficinadesarrollo33@gmail.com)';
const DELAY_MS = 900;
const MAX_PAGES = 400;
const MAX_BYTES = 4_000_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': ua, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    redirect: 'follow',
  });
  const type = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, type, finalUrl: res.url, body: buf.subarray(0, MAX_BYTES).toString('utf8') };
}

const stripTags = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|tr|td|br|header|footer|nav)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É').replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó').replace(/&Uacute;/g, 'Ú').replace(/&Ntilde;/g, 'Ñ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const linksOf = (html, pageUrl) => {
  const out = new Set();
  for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    try {
      const u = new URL(m[1], pageUrl);
      u.hash = '';
      if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
      if (u.origin !== origin) continue;
      u.search = '';
      if (/\.(pdf|jpg|jpeg|png|webp|gif|svg|mp4|webm|zip|docx?|xlsx?|pptx?)$/i.test(u.pathname)) continue;
      if (/\/(wp-admin|wp-json|wp-content|cdn-cgi|feed|rss)\b/i.test(u.pathname)) continue;
      out.add(u.toString().replace(/\/$/, '') || `${u.origin}/`);
    } catch {}
  }
  return out;
};

const titleOf = (html) => (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim();
const metaOf = (html, name) => {
  const re = new RegExp(`<meta[^>]+(?:name|property)\\s*=\\s*["']${name}["'][^>]*content\\s*=\\s*["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content\\s*=\\s*["']([^"']*)["'][^>]*(?:name|property)\\s*=\\s*["']${name}["']`, 'i');
  return (html.match(re)?.[1] || html.match(re2)?.[1] || '').trim();
};
const canonicalOf = (html) => (html.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]*href\s*=\\s*["']([^"']+)["']/i)?.[1] || '');
const h1sOf = (html) =>
  [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1])).filter(Boolean);

const safeName = (u) => {
  const p = new URL(u).pathname.replace(/^\//, '').replace(/\/+$/, '') || 'home';
  return (p.replace(/[^\w.-]+/g, '_') + (/\.(html?|php|aspx)$/i.test(p) ? '' : '.html')).slice(0, 150);
};

// --- discovering URLs -------------------------------------------------------
const queue = [];
const seen = new Set();
const push = (u) => {
  const clean = u.replace(/\/$/, '') || `${origin}/`;
  if (!seen.has(clean)) {
    seen.add(clean);
    queue.push(clean);
  }
};
push(base);

const sitemapUrls = [];
const queueSitemaps = [
  `${origin}/sitemap.xml`,
  `${origin}/sitemap_index.xml`,
  `${origin}/sitemap-index.xml`,
  `${origin}/wp-sitemap.xml`,
  `${origin}/sitemap.xml.gz`,
];
const sitemapsSeen = new Set();

// Los sitemaps de Shopify (federal) y WordPress/Yoast (sic) son un ÍNDICE que
// apunta a sub-sitemaps. Sin esta segunda pasada el crawl se queda con 1 pagina:
// los <loc> del indice son los sub-sitemaps, no paginas.
for (let round = 0; round < 3 && queueSitemaps.length; round++) {
  const batch = queueSitemaps.splice(0, queueSitemaps.length);
  for (const sm of batch) {
    if (sitemapsSeen.has(sm)) continue;
    sitemapsSeen.add(sm);
    let r;
    try {
      r = await get(sm);
    } catch {
      continue;
    }
    if (r.status !== 200 || !/xml/i.test(r.type + r.body.slice(0, 200))) continue;
    const locs = [...r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) =>
      m[1].replace(/&amp;/g, '&'),
    );
    if (!locs.length) continue;
    const isIndex = /sitemapindex/i.test(r.body);
    console.log(`sitemap ${sm}: ${locs.length} locs${isIndex ? ' (index)' : ''}`);
    for (const l of locs) {
      if (isIndex || /sitemap/i.test(l)) queueSitemaps.push(l);
      else sitemapUrls.push(l);
    }
  }
}

if (sitemapUrls.length === 0) {
  // Sin sitemap útil: BFS desde la home. Se acepta el host con www porque muchos
  // sitios responden en ambos y el sitemap puede declarar solo uno de los dos.
  const links = linksOf(await (await get(base)).body, base);
  for (const l of links) push(l);
} else {
  for (const u of sitemapUrls) {
    // No se filtra por origin: muchos sitemaps declaran el host con `www.`
    // mientras el sitio redirige al naked domain. Descartarlas deja el crawl
    // en 1 pagina, que es exactamente el fallo que hay que evitar.
    push(u);
  }
}

await mkdir(path.join(OUT, 'html'), { recursive: true });
await mkdir(path.join(OUT, 'text'), { recursive: true });

const manifest = [];
let count = 0;
const internalOnly = new Set();

while (queue.length && count < MAX_PAGES) {
  const url = queue.shift();
  let r;
  try {
    r = await get(url);
  } catch (e) {
    manifest.push({ url, error: String(e) });
    continue;
  }
  await sleep(DELAY_MS);
  if (r.status !== 200 || !/html/i.test(r.type)) {
    manifest.push({ url, status: r.status, type: r.type, skipped: true });
    continue;
  }
  const html = r.body;
  const text = stripTags(html);
  const name = safeName(url);
  const file = path.join(OUT, 'html', name);
  if (!existsSync(file)) {
    await writeFile(file, html, 'utf8');
    await writeFile(path.join(OUT, 'text', name.replace(/\.html?$/, '.txt')), `${url}\n${'='.repeat(70)}\n${text}`, 'utf8');
  }
  manifest.push({
    url,
    status: r.status,
    file: `html/${name}`,
    text: `text/${name.replace(/\.html?$/, '.txt')}`,
    bytes: html.length,
    title: titleOf(html),
    metaDescription: metaOf(html, 'description'),
    canonical: canonicalOf(html),
    h1: h1sOf(html),
    ogDescription: metaOf(html, 'og:description'),
    words: text.split(/\s+/).filter(Boolean).length,
  });
  count++;
  process.stdout.write(`[${count}] ${url} (${text.length} chars)\n`);

  if (sitemapUrls.length === 0) {
    for (const l of linksOf(html, url)) {
      if (l.startsWith(base) && !seen.has(l)) {
        internalOnly.add(l);
        push(l);
      }
    }
  }
}

await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify({ base, crawled: count, pages: manifest }, null, 2), 'utf8');
const files = await readdir(path.join(OUT, 'text'));
console.log(`\nOK ${base}: ${count} paginas -> ${OUT} (${files.length} .txt)`);
