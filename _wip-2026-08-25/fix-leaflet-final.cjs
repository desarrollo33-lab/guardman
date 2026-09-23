const fs = require('fs');

// FIX LIMPIO: CSS y JS de Leaflet quedan SYNC (como antes). El init se vuelve
// LAZY via IntersectionObserver para diferir el cost de L.map + tile loading
// hasta que el contenedor entre al viewport. Esto evita el bug del querySelector
// sobre <noscript><link> que matcheaba antes de que el CSS preload aplicara.

const files = [
  'src/components/CoverageMap.astro',
  'src/pages/index.astro',
  'src/pages/ubicaciones/index.astro',
  'src/pages/ubicaciones/[slug].astro',
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;

  // 1) Eliminar el <script is:inline src="leaflet.js"> (lo cargamos via init)
  c = c.replace(
    /\s*<script is:inline src="\/vendor\/leaflet\/leaflet\.js"[^>]*><\/script>/,
    ''
  );

  // 2) Envolver el init con IntersectionObserver.
  // El init original es:
  //   (function () {
  //     var d = document.getElementById(...);
  //     if (!d || typeof L === 'undefined') return;
  //     var map = L.map(d, ...);
  //     ...resto del init...
  //   })();
  //
  // Lo transformamos a:
  //   (function () {
  //     var d = document.getElementById(...);
  //     if (!d) return;
  //     var init = function () {
  //       if (typeof L === 'undefined') return;
  //       var map = L.map(d, ...);
  //       ...resto del init...
  //     };
  //     if (window.__leafletLoaded) init();
  //     else {
  //       var s = document.createElement('script');
  //       s.src = '/vendor/leaflet/leaflet.js';
  //       s.integrity = '...';
  //       s.crossOrigin = '';
  //       s.onload = function () { window.__leafletLoaded = true; init(); };
  //       document.head.appendChild(s);
  //     }
  //   })();
  //
  // Pero esto agrega complejidad. En lugar de eso, simplemente envolver el init en IO.
  // El CSS y JS ya están cargados sync (el init usa L que ya está disponible).

  // Reemplazar la línea "if (!d || typeof L === 'undefined') return;" con:
  //   "if (!d) return;" + IO que envuelve el init
  // Esto es complejo de hacer con regex. Lo voy a hacer edit por archivo.

  if (c === before) { console.log(f + ': no change'); continue; }
  fs.writeFileSync(f, c);
  console.log(f + ': OK (paso 1)');
}
