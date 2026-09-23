const fs = require('fs');

const files = [
  'src/components/CoverageMap.astro',
  'src/pages/index.astro',
  'src/pages/ubicaciones/index.astro',
  'src/pages/ubicaciones/[slug].astro',
];

// Lógica correcta:
// 1. CSS sync (ya está aplicado)
// 2. Cuando IO detecta el contenedor:
//    a. io.disconnect() SIEMPRE
//    b. Cargar Leaflet JS si no está ya cargado
//    c. init() cuando Leaflet cargue (o inmediatamente si ya estaba)

const newLogic = (indent) => `${indent}io.disconnect();
${indent}// El CSS ya está cargado sync arriba; solo falta el JS de Leaflet.
${indent}if (window.__leafletLoaded) {
${indent}  init();
${indent}} else {
${indent}  var s = document.createElement('script');
${indent}  s.src = '/vendor/leaflet/leaflet.js';
${indent}  s.integrity = 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH';
${indent}  s.crossOrigin = '';
${indent}  s.onload = function () { window.__leafletLoaded = true; init(); };
${indent}  document.head.appendChild(s);
${indent}}`;

// En el contexto del callback de IO, el contenido correcto es:
//   if (!entries[0].isIntersecting) return;
//   io.disconnect();
//   ... nueva lógica ...
//   }, { rootMargin: '200px' });

// El bloque actual que tenemos es:
//   if (!entries[0].isIntersecting) return;
//   io.disconnect();
//   ... [snippet de cssReady / startJs / etc, o el nuevo bloque] ...
//   }, { rootMargin: '200px' });

// Necesito reemplazar todo desde "io.disconnect();" hasta justo antes de "}, { rootMargin: '200px' });"
// con la nueva lógica.

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;

  // Encontrar el rango entre "io.disconnect();" y "}, { rootMargin: '200px' });"
  // Detectar la indentación
  const m = c.match(/^([ \t]+)io\.disconnect\(\);/m);
  if (!m) { console.log(f + ': no io.disconnect found'); continue; }
  const indent = m[1];

  // Regex: match desde "io.disconnect();" hasta "}, { rootMargin: '200px' });"
  // Necesito un match no-greedy que pare en el }, { rootMargin
  const re = new RegExp(
    `^${indent.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}io\\.disconnect\\(\\);[\\s\\S]*?\\}, \\{ rootMargin: '200px' \\}\\);`,
    'm'
  );

  c = c.replace(re, newLogic(indent) + '\n' + indent + '}, { rootMargin: \'200px\' });');

  if (c === before) { console.log(f + ': no change'); continue; }
  fs.writeFileSync(f, c);
  console.log(f + ': OK');
}
