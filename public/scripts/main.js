/* GuardMan v3.0 — Main JavaScript */
/* Mínimo JS: mobile menu toggle + analytics. Todo lo demás es SSR. */

(function() {
  'use strict';

  // Mobile menu toggle
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(expanded));
      // El swap entre menu/close se hace via CSS [aria-expanded] en site.css.
      // No usar toggle.textContent aqui: reintroduce glifos U+2715/U+2630
      // que no estan en el subset de Inter y producen CLS al cambiar entre
      // estados. Ver Header.astro: dos SVG con .icon-menu y .icon-close.
    });
  }

  // FAQ accordion enhancement (details ya funciona nativamente)
  document.querySelectorAll('.faq-item').forEach(function(item) {
    item.addEventListener('toggle', function() {
      if (item.open) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Track form submissions (sin cookies, sin PII)
  var forms = document.querySelectorAll('form[data-track]');
  forms.forEach(function(form) {
    form.addEventListener('submit', function() {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/pageview', JSON.stringify({
          event: 'form_submit',
          path: window.location.pathname,
          timestamp: Date.now()
        }));
      }
    });
  });
})();
