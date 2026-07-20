// /public/scripts/admin-auth-guard.js
// Redirige a /admin/login si no hay token válido (con expiración).
(function () {
  try {
    var token = localStorage.getItem('gm_token');
    var exp = Number(localStorage.getItem('gm_token_expires_at') ?? 0);
    var demo = localStorage.getItem('gm_demo_mode') === 'crm';
    var isExpired = !token || token === 'undefined' || token === 'null' || (exp && Date.now() > exp);
    if (isExpired && !demo) {
      var redirect = encodeURIComponent(window.location.pathname);
      window.location.href = '/admin/login?redirect=' + redirect;
    }
  } catch (e) {}
})();
