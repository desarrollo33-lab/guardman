// Test minimal: ejecutar el script del mapa en jsdom para ver qué falla
const { JSDOM } = require('jsdom');

const html = `<!DOCTYPE html>
<html><head></head>
<body>
  <div id="map-test" style="height:400px;width:100%"></div>
  <link rel="preload" href="https://example.com/leaflet.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <script>
    (function(){
      const mapId = "map-test";
      const lat = -33.45;
      const lng = -70.65;
      const name = "Test";
      const dotColor = "#3B82F6";

      (function () {
        var d = document.getElementById(mapId);
        if (!d) { console.log('FAIL: no map div'); return; }
        console.log('OK: map div found, registering IO');
        var io = new IntersectionObserver(function (entries) {
          console.log('IO callback fired, intersecting=' + entries[0].isIntersecting);
          if (!entries[0].isIntersecting) return;
          io.disconnect();
          console.log('IO disconnected');
          var cssReady = document.querySelector('link[href*="leaflet.css"]');
          console.log('cssReady:', cssReady ? 'found' : 'null');
          var startJs = function () {
            console.log('startJs called');
            if (window.__leafletLoaded) return init();
            var s = document.createElement('script');
            s.src = '/vendor/leaflet/leaflet.js';
            s.onload = function () { window.__leafletLoaded = true; init(); };
            document.head.appendChild(s);
            console.log('leaflet.js script injected');
          };
          var init = function () {
            console.log('init called');
            var map = L.map(d, { center: [lat, lng], zoom: 13 });
            console.log('map created');
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.circleMarker([lat, lng], { radius: 12, fillColor: dotColor }).addTo(map);
            console.log('map fully initialized');
          };
          if (cssReady && cssReady.rel === 'stylesheet') startJs();
          else if (cssReady) cssReady.addEventListener('load', startJs, { once: true });
          else startJs();
        }, { rootMargin: '200px' });
        io.observe(d);
        console.log('IO observe registered');
      })();
    })();
  </script>
</body></html>`;

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
setTimeout(() => {
  console.log('--- After 2s ---');
  console.log('div HTML:', dom.window.document.getElementById('map-test').innerHTML);
}, 2000);
