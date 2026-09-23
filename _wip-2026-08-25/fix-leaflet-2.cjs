const fs = require('fs');

const files = [
  'src/pages/index.astro',
  'src/pages/ubicaciones/index.astro',
  'src/pages/ubicaciones/[slug].astro',
];

// Regex flexible: matchea cualquier indentación de 6+ espacios antes del if
const pattern = /^[ \t]+if \(cssReady && cssReady\.rel === 'stylesheet'\) startJs\(\);\r?\n[ \t]+else if \(cssReady\) cssReady\.addEventListener\('load', startJs, \{ once: true \}\);\r?\n[ \t]+else startJs\(\);/gm;

const replacement = (indent) => `${indent}if (window.__leafletLoaded) init();
${indent}else {
${indent}  var s = document.createElement('script');
${indent}  s.src = '/vendor/leaflet/leaflet.js';
${indent}  s.integrity = 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH';
${indent}  s.crossOrigin = '';
${indent}  s.onload = function () { window.__leafletLoaded = true; init(); };
${indent}  document.head.appendChild(s);
${indent}}`;

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  // Detectar la indentación
  const m = c.match(/^([ \t]+)if \(cssReady/m);
  if (!m) { console.log(f + ': no match'); continue; }
  const indent = m[1];
  c = c.replace(pattern, replacement(indent));
  if (c === before) { console.log(f + ': no change'); continue; }
  fs.writeFileSync(f, c);
  console.log(f + ': OK (indent=' + indent.length + ')');
}
