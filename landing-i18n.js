/**
 * i18n mínimo para la landing pública — comparte btc_retirement_lang con /calc/script.js.
 */
(function () {
  'use strict';

  /** @readonly — debe coincidir con script.js (LANG_KEY). */
  var LANG_KEY = 'btc_retirement_lang';

  var STRINGS = {
    es: {
      landing_founders_title: 'Quiénes están detrás',
      founder_edu_bio:
        'Líder en experiencia del cliente y operaciones | Fintech, tecnología y transformación digital | Más de 16 años en operaciones críticas y atención al cliente.',
      founder_ed_photo_alt:
        'Edgadafi RF — desarrollador con enfoque en DeFi, stablecoins y pagos on-chain para LATAM, Retiro Bitcoin',
      founder_ed_bio:
        'Builder especializado en DeFi, stablecoins y pagos on-chain con enfoque en LATAM.',
      founder_edu_photo_alt:
        'Eduardo Garcia — líder en experiencia del cliente y operaciones, Retiro Bitcoin',
    },
    en: {
      landing_founders_title: 'Who is behind this',
      founder_edu_bio:
        'Customer experience & operations leader | Fintech • tech • digital transformation | 16+ years in mission-critical ops and customer service.',
      founder_ed_photo_alt:
        'Edgadafi RF — builder focused on DeFi, stablecoins and on-chain payments (LATAM), Bitcoin Retirement',
      founder_ed_bio:
        'Developer focused on DeFi, stablecoins and on-chain payments (LATAM).',
      founder_edu_photo_alt:
        'Eduardo Garcia — customer experience and operations leader, Bitcoin Retirement',
    },
    pt: {
      landing_founders_title: 'Quem está por trás',
      founder_edu_bio:
        'Líder de experiência do cliente e operações | Fintech, tecnologia e transformação digital | Mais de 16 anos em operações críticas e atendimento ao cliente.',
      founder_ed_photo_alt:
        'Edgadafi RF — desenvolvedor com foco em DeFi, stablecoins e pagamentos on-chain na América Latina, Retiro Bitcoin',
      founder_ed_bio:
        'Construtor especializado em DeFi, stablecoins e pagamentos on-chain (foco América Latina).',
      founder_edu_photo_alt:
        'Eduardo Garcia — líder de experiência do cliente e operações, Retiro Bitcoin',
    },
    fr: {
      landing_founders_title: 'Qui sommes-nous',
      founder_edu_bio:
        'Chef expérience client et opérations | Fintech • tech • transformation numérique | Plus de 16 ans dans des opérations critiques et au service client.',
      founder_ed_photo_alt:
        'Edgadafi RF — développeur axé sur la DeFi, les stablecoins et les paiements on-chain (LATAM), Retiro Bitcoin',
      founder_ed_bio:
        'Développeur spécialisé en DeFi, stablecoins et paiements on-chain (focus LATAM).',
      founder_edu_photo_alt:
        'Eduardo Garcia — responsable expérience client et opérations, Retiro Bitcoin',
    },
  };

  function getLangFromStorageAndBrowser() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && STRINGS[saved]) return saved;
    } catch (_) {}
    var nav = ((navigator.language || navigator.userLanguage || '') + '').slice(0, 2);
    if (STRINGS[nav]) return nav;
    return 'es';
  }

  function translate(lang, key) {
    var pack = STRINGS[lang] || STRINGS.es;
    if (pack[key]) return pack[key];
    return STRINGS.es[key] || '';
  }

  function applyLandingI18n() {
    var lang = getLangFromStorageAndBrowser();
    var sel = document.getElementById('landing-lang');
    if (sel && STRINGS[sel.value]) lang = sel.value;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-landing-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-landing-i18n');
      var txt = translate(lang, key);
      if (txt) el.textContent = txt;
    });

    document.querySelectorAll('[data-landing-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-landing-i18n-alt');
      var txt = translate(lang, key);
      if (txt) el.setAttribute('alt', txt);
    });

    if (sel && STRINGS[lang]) sel.value = lang;
  }

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    var sel = document.getElementById('landing-lang');
    if (sel) {
      sel.value = getLangFromStorageAndBrowser();
      sel.addEventListener('change', function () {
        try {
          localStorage.setItem(LANG_KEY, sel.value);
        } catch (_) {}
        applyLandingI18n();
      });
    }
    applyLandingI18n();
  });
})();
