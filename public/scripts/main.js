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
      toggle.textContent = expanded ? '✕' : '☰';
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
