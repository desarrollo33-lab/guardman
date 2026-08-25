const fs = require('fs');
const path = require('path');

const cssPreload = '<link rel="preload" href="/vendor/leaflet/leaflet.css" integrity="sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jVvuavGOndn6pjVqS6ny56CAt3nsEVT4H" crossorigin="" as="style" onload="this.onload=null;this.rel=\'stylesheet\'" />\n<noscript><link rel="stylesheet" href="/vendor/leaflet/leaflet.css" /></noscript>';

const lazyLoaderSnippet = `      var cssReady = document.querySelector('link[href*="leaflet.css"]');
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

const ioWrapperBefore = `      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
`;
const ioWrapperAfter = `      }, { rootMargin: '200px' });
      io.observe(d);
    })();
`;

// === index.astro ===
let p = 'src/pages/index.astro';
let c = fs.readFileSync(p, 'utf8');

// Replace stylesheet link → preload
c = c.replace(
  /<link rel="stylesheet" href="\/vendor\/leaflet\/leaflet\.css"[^>]*\/>/,
  cssPreload
);
// Remove the old <script src="leaflet.js">
c = c.replace(
  /\s*<script is:inline src="\/vendor\/leaflet\/leaflet\.js"[^>]*><\/script>/,
  ''
);
// Wrap the init script: replace the `if (!d || typeof L === 'undefined') return;` guard with the IO + lazy loader pattern
c = c.replace(
  /var d = document\.getElementById\('map-home'\);\s*\n\s*if \(!d \|\| typeof L === 'undefined'\) return;/,
  `var d = document.getElementById('map-home');
      if (!d) return;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
${lazyLoaderSnippet}      var init = function () {`
);
c = c.replace(
  /(\}\)\(\);\s*\n\s*<\/script>)/,
  `        };
        if (cssReady && cssReady.rel === 'stylesheet') startJs();
        else if (cssReady) cssReady.addEventListener('load', startJs, { once: true });
        else startJs();
      }, { rootMargin: '200px' });
      io.observe(d);
    })();
  </script>`
);

fs.writeFileSync(p, c);
console.log('index.astro: OK');

// === ubicaciones/index.astro ===
p = 'src/pages/ubicaciones/index.astro';
c = fs.readFileSync(p, 'utf8');
c = c.replace(
  /<link rel="stylesheet" href="\/vendor\/leaflet\/leaflet\.css"[^>]*\/>/,
  cssPreload
);
c = c.replace(
  /\s*<script is:inline src="\/vendor\/leaflet\/leaflet\.js"[^>]*><\/script>/,
  ''
);
c = c.replace(
  /var d = document\.getElementById\('map-ubicaciones'\);\s*\n\s*if \(!d \|\| typeof L === 'undefined'\) return;/,
  `var d = document.getElementById('map-ubicaciones');
      if (!d) return;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
${lazyLoaderSnippet}      var init = function () {`
);
c = c.replace(
  /(\}\)\(\);\s*\n\s*<\/script>)/,
  `        };
        if (cssReady && cssReady.rel === 'stylesheet') startJs();
        else if (cssReady) cssReady.addEventListener('load', startJs, { once: true });
        else startJs();
      }, { rootMargin: '200px' });
      io.observe(d);
    })();
  </script>`
);

fs.writeFileSync(p, c);
console.log('ubicaciones/index.astro: OK');

// === ubicaciones/[slug].astro ===
p = 'src/pages/ubicaciones/[slug].astro';
c = fs.readFileSync(p, 'utf8');
c = c.replace(
  /<link rel="stylesheet" href="\/vendor\/leaflet\/leaflet\.css"[^>]*\/>/,
  cssPreload
);
c = c.replace(
  /\s*<script is:inline src="\/vendor\/leaflet\/leaflet\.js"[^>]*><\/script>/,
  ''
);
c = c.replace(
  /var d = document\.getElementById\(mapId\);\s*\n\s*if \(!d \|\| typeof L === 'undefined'\) return;/,
  `var d = document.getElementById(mapId);
      if (!d) return;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
${lazyLoaderSnippet}      var init = function () {`
);
c = c.replace(
  /(\}\)\(\);\s*\n\s*<\/script>)/,
  `        };
        if (cssReady && cssReady.rel === 'stylesheet') startJs();
        else if (cssReady) cssReady.addEventListener('load', startJs, { once: true });
        else startJs();
      }, { rootMargin: '200px' });
      io.observe(d);
    })();
  </script>`
);

fs.writeFileSync(p, c);
console.log('ubicaciones/[slug].astro: OK');
