/**
 * URL del servicio de agentes IA (Rito, leads).
 * En local con `cd agents && npm run dev`, usa http://localhost:3000
 */
(function (global) {
  var host = global.location && global.location.hostname;
  var isLocal =
    host === 'localhost' || host === '127.0.0.1' || host === '';
  global.RETIROBTC_AGENTS_URL = isLocal
    ? 'http://localhost:3000'
    : 'https://retirobtc-agents.vercel.app';
})(typeof window !== 'undefined' ? window : globalThis);
