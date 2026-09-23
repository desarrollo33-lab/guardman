const fs = require('fs');

const files = [
  'src/components/CoverageMap.astro',
  'src/pages/index.astro',
  'src/pages/ubicaciones/index.astro',
  'src/pages/ubicaciones/[slug].astro',
];

const scriptTag = '<script is:inline src="/vendor/leaflet/leaflet.js" integrity="sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH" crossorigin=""></script>';

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes(scriptTag)) { console.log(f + ': already has script'); continue; }
  // Insertar el script tag antes del script con define:vars
  const re = /(<script is:inline define:vars)/;
  if (!re.test(c)) { console.log(f + ': no define:vars found'); continue; }
  c = c.replace(re, scriptTag + '\n\n$1');
  fs.writeFileSync(f, c);
  console.log(f + ': OK');
}
