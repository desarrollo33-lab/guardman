const fs = require('fs');

const files = [
  'src/components/CoverageMap.astro',
  'src/pages/index.astro',
  'src/pages/ubicaciones/index.astro',
  'src/pages/ubicaciones/[slug].astro',
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;

  // Reemplazar la línea:
  //   if (!d || typeof L === 'undefined') return;
  // Por:
  //   if (!d) return;
  //   var io = new IntersectionObserver(function (entries) {
  //     if (!entries[0].isIntersecting) return;
  //     io.disconnect();
  //     if (typeof L === 'undefined') return;
  // ... y agregar el cierre antes del `})();` final.

  c = c.replace(
    /if \(!d \|\| typeof L === 'undefined'\) return;/,
    `if (!d) return;
      // Init lazy: difiere el cost de L.map + tile loading hasta que el contenedor entre al viewport.
      // CSS y JS de Leaflet ya están cargados sync arriba, así que L está disponible globalmente.
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (typeof L === 'undefined') return;`
  );

  // Agregar el cierre del IO y de la IIFE.
  // El init termina con `})();` (cierre de IIFE). Necesito agregar antes:
  //   }, { rootMargin: '200px' });
  //   io.observe(d);
  c = c.replace(
    /(\n      \}\)\(\);\n  <\/script>)/,
    `\n      }, { rootMargin: '200px' });\n      io.observe(d);\n$1`
  );

  if (c === before) { console.log(f + ': no change'); continue; }
  fs.writeFileSync(f, c);
  console.log(f + ': OK');
}
