/**
 * Tema landing / páginas estáticas — debe cargarse como archivo externo para cumplir CSP (sin inline).
 */
(function () {
  var THEME_KEY = 'btc_retirement_theme';

  function getToggleScriptEl() {
    return document.querySelector('script[src*="landing-theme.js"]');
  }

  function getToggleId() {
    var s = getToggleScriptEl();
    var id = s && s.getAttribute('data-theme-toggle');
    return id || 'landing-theme-toggle';
  }

  function applyTheme(theme, btn) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
    btn = btn || document.getElementById(getToggleId());
    if (!btn) return;
    var moon = btn.querySelector('.icon-theme-moon');
    var sun = btn.querySelector('.icon-theme-sun');
    if (moon && sun) {
      moon.classList.toggle('hidden', theme === 'dark');
      sun.classList.toggle('hidden', theme !== 'dark');
    }
  }

  function init() {
    var btn = document.getElementById(getToggleId());
    try {
      var saved = localStorage.getItem(THEME_KEY);
      var prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(saved || (prefersDark ? 'dark' : 'light'), btn);
    } catch (_) {
      applyTheme('dark', btn);
    }

    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, btn);
      });
    }
  }

  init();
})();
