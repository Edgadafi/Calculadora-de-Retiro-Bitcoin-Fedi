(function () {
  'use strict';
  // Feature flag: desactivar con ?rito=0 o localStorage RETIROBTC_RITO=off
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('rito') === '0' || localStorage.getItem('RETIROBTC_RITO') === 'off') {
      return;
    }
  } catch (_) {}

  var url =
    (typeof window !== 'undefined' && window.RETIROBTC_AGENTS_URL) ||
    'https://retirobtc-agents.vercel.app';
  var base = url.replace(/\/$/, '');
  var s = document.createElement('script');
  s.src = base + '/widget/rito.js';
  s.setAttribute('data-agents-url', base);
  s.defer = true;
  s.onerror = function () {
    console.warn('[rito-loader] No se pudo cargar el widget de agentes.');
  };
  document.body.appendChild(s);
})();
