const fs = require('fs');
const path = require('path');

// Fix: reemplazar el patrón async CSS + JS lazy por CSS sync + JS lazy.
// Razón: el `querySelector('link[href*="leaflet.css"]')` matchea el <link>
// dentro de <noscript>, que siempre tiene rel="stylesheet". Eso hacía que
// startJs() se ejecutara antes de que el CSS del preload aplicara.

const files = [
  'src/components/CoverageMap.astro',
  'src/pages/index.astro',
  'src/pages/ubicaciones/index.astro',
  'src/pages/ubicaciones/[slug].astro',
];

const oldCss = `<link rel="preload" href="/vendor/leaflet/leaflet.css" integrity="sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jVvuavGOndn6pjVqS6ny56CAt3nsEVT4H" crossorigin="" as="style" onload="this.onload=null;this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/vendor/leaflet/leaflet.css" /></noscript>`;

const newCss = `<link rel="stylesheet" href="/vendor/leaflet/leaflet.css" integrity="sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jVvuavGOndn6pjVqS6ny56CAt3nsEVT4H" crossorigin="" />`;

// Simplificar también el script: ya no necesitamos esperar al CSS, solo cargar JS cuando el contenedor entra al viewport.
const oldScriptSnippet = `      var cssReady = document.querySelector('link[href*="leaflet.css"]');
      var startJs = function () {
        if (window.__leafletLoaded) return init();
        var s = document.createElement('script');
        s.src = '/vendor/leaflet/leaflet.js';
        s.integrity = 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH';
        s.crossOrigin = '';
        s.onload = function () { window.__leafletLoaded = true; init(); };
        document.head.appendChild(s);
      };
`;

const newScriptSnippet = `      // Carga JS de Leaflet solo cuando el contenedor entra al viewport.
      // El CSS ya está cargado sync arriba; no necesita sincronización adicional.
      if (window.__leafletLoaded) { init(); io.disconnect(); }
      else {
        var s = document.createElement('script');
        s.src = '/vendor/leaflet/leaflet.js';
        s.integrity = 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH';
        s.crossOrigin = '';
        s.onload = function () { window.__leafletLoaded = true; init(); };
        document.head.appendChild(s);
      }
`;

// Y reemplazar el bloque de llamada:
const oldCallBlock = `        if (cssReady && cssReady.rel === 'stylesheet') startJs();
        else if (cssReady) cssReady.addEventListener('load', startJs, { once: true });
        else startJs();`;

const newCallBlock = `        ${newScriptSnippet}`;

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('leaflet.css')) { console.log(f + ': skipped (no leaflet.css)'); continue; }
  const before = c;
  // 1) Reemplazar el bloque CSS async por CSS sync
  c = c.replace(oldCss, newCss);
  // 2) Reemplazar el snippet del lazy loader
  c = c.replace(oldScriptSnippet, '');
  // 3) Reemplazar el bloque de llamada por la versión simplificada
  c = c.replace(oldCallBlock, newCallBlock);
  if (c === before) { console.log(f + ': NO CHANGES'); continue; }
  fs.writeFileSync(f, c);
  console.log(f + ': OK');
}
