/**
 * i18n para la landing pública — comparte btc_retirement_lang con /calc/script.js.
 */
(function () {
  'use strict';

  /** @readonly — debe coincidir con script.js (LANG_KEY). */
  var LANG_KEY = 'btc_retirement_lang';

  var STRINGS = {
    es: {
      landing_doc_title: 'Calculadora de Retiro Bitcoin — Planifica tu independencia',
      landing_lang_sr_label: 'Idioma',
      landing_lang_aria: 'Idioma',
      landing_nav_calc: 'Calculadora',
      landing_toggle_theme: 'Cambiar tema',
      landing_brand_logo_alt: 'Bitcoin Retiro, retirobtc.mx',
      landing_brand_sr_only: 'Retiro Bitcoin',
      landing_footer_nav_aria: 'Enlaces del sitio',
      landing_kicker: 'Calculadora de retiro',
      landing_h1_html: 'Tu plan de retiro en <em>Bitcoin</em>',
      landing_lead_html:
        'Proyecta ahorros iniciales, aportes y horizonte con una herramienta clara, orientada a la comunidad Bitcoin y uso en <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi.xyz</a>.',
      landing_cta_primary: 'Abrir calculadora',
      landing_features_title: 'Qué puedes hacer',
      landing_feat_1_title: 'Proyección clara',
      landing_feat_1_body:
        'Ahorro inicial, aporte periódico, años y rendimiento esperado en USD, MXN, BTC o sats.',
      landing_feat_2_title: 'Premium opcional',
      landing_feat_2_body:
        'Tres escenarios, regla del 4&nbsp;% para retiro, planes cifrados y exportación PDF — pago por Mercado Pago (MXN) cuando esté activo.',
      landing_feat_3_title: 'Tu dispositivo',
      landing_feat_3_body:
        'Los planes se pueden guardar en el navegador; no necesitas cuenta en la herramienta para empezar a calcular.',
      landing_steps_title: 'En tres pasos',
      landing_step_1_title: 'Abre la calculadora',
      landing_step_1_body: 'Introduce tus supuestos reales para ver curvas en el tiempo.',
      landing_step_2_title: 'Ajusta y compara',
      landing_step_2_body:
        'Cambia rendimiento y moneda; en Premium puedes comparar conservador contra agresivo.',
      landing_step_3_title: 'Documenta tu plan',
      landing_step_3_body:
        'Comparte el resultado en texto o lleva tu reporte en PDF si tienes Premium activo.',
      landing_cta_brujula: 'Tu brújula financiera',
      landing_cta_go_calc: 'Ir a la calculadora',
      landing_cta_explore_fedi: 'Explorar Fedi',
      landing_founders_title: 'Quiénes están detrás',
      founder_edu_bio:
        'Líder en experiencia del cliente y operaciones | Fintech, tecnología y transformación digital | Más de 16 años en operaciones críticas y atención al cliente.',
      founder_ed_photo_alt:
        'Edgadafi RF — desarrollador con enfoque en DeFi, stablecoins y pagos on-chain para LATAM, Retiro Bitcoin',
      founder_ed_bio:
        'Builder especializado en DeFi, stablecoins y pagos on-chain con enfoque en LATAM.',
      founder_edu_photo_alt:
        'Eduardo Garcia — líder en experiencia del cliente y operaciones, Retiro Bitcoin',
      landing_footer_credit_html:
        'Hecho con ₿ para la comunidad <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a>',
      landing_footer_disclaimer:
        'Los cálculos son proyecciones educativas, no asesoría financiera.',
      landing_footer_home: 'Inicio',
      landing_footer_brujula: 'Brújula',
      landing_footer_calc: 'Calculadora',
    },
    en: {
      landing_doc_title: 'Bitcoin Retirement Calculator — Plan your independence',
      landing_lang_sr_label: 'Language',
      landing_lang_aria: 'Language',
      landing_nav_calc: 'Calculator',
      landing_toggle_theme: 'Toggle theme',
      landing_brand_logo_alt: 'Bitcoin Retirement, retirobtc.mx',
      landing_brand_sr_only: 'Bitcoin Retirement',
      landing_footer_nav_aria: 'Site links',
      landing_kicker: 'Retirement calculator',
      landing_h1_html: 'Your retirement plan in <em>Bitcoin</em>',
      landing_lead_html:
        'Project initial savings, contributions and time horizon with a clear tool, built for the Bitcoin community and for use with <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi.xyz</a>.',
      landing_cta_primary: 'Open calculator',
      landing_features_title: 'What you can do',
      landing_feat_1_title: 'Clear projection',
      landing_feat_1_body:
        'Starting balance, recurring contribution, years and expected return in USD, MXN, BTC or sats.',
      landing_feat_2_title: 'Optional Premium',
      landing_feat_2_body:
        'Three scenarios, a 4% rule for withdrawals, encrypted plans and PDF export — pay with Mercado Pago (MXN) when enabled.',
      landing_feat_3_title: 'Your device',
      landing_feat_3_body:
        'Plans can be saved in the browser; no account is required on the tool to start calculating.',
      landing_steps_title: 'In three steps',
      landing_step_1_title: 'Open the calculator',
      landing_step_1_body: 'Enter your assumptions to see balance curves over time.',
      landing_step_2_title: 'Adjust and compare',
      landing_step_2_body:
        'Change return and currency; with Premium compare conservative versus aggressive scenarios.',
      landing_step_3_title: 'Document your plan',
      landing_step_3_body:
        'Share results as text or keep a PDF report when Premium is active.',
      landing_cta_brujula: 'Your financial compass',
      landing_cta_go_calc: 'Go to calculator',
      landing_cta_explore_fedi: 'Explore Fedi',
      landing_founders_title: 'Who is behind this',
      founder_edu_bio:
        'Customer experience & operations leader | Fintech • tech • digital transformation | 16+ years in mission-critical ops and customer service.',
      founder_ed_photo_alt:
        'Edgadafi RF — builder focused on DeFi, stablecoins and on-chain payments (LATAM), Bitcoin Retirement',
      founder_ed_bio:
        'Developer focused on DeFi, stablecoins and on-chain payments (LATAM).',
      founder_edu_photo_alt:
        'Eduardo Garcia — customer experience and operations leader, Bitcoin Retirement',
      landing_footer_credit_html:
        'Made with ₿ for the <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a> community',
      landing_footer_disclaimer:
        'Calculations are educational projections, not financial advice.',
      landing_footer_home: 'Home',
      landing_footer_brujula: 'Compass',
      landing_footer_calc: 'Calculator',
    },
    pt: {
      landing_doc_title: 'Calculadora de Aposentadoria Bitcoin — Planeje sua independência',
      landing_lang_sr_label: 'Idioma',
      landing_lang_aria: 'Idioma',
      landing_nav_calc: 'Calculadora',
      landing_toggle_theme: 'Alternar tema',
      landing_brand_logo_alt: 'Retiro Bitcoin, retirobtc.mx',
      landing_brand_sr_only: 'Aposentadoria Bitcoin',
      landing_footer_nav_aria: 'Links do site',
      landing_kicker: 'Calculadora de aposentadoria',
      landing_h1_html: 'Seu plano de aposentadoria em <em>Bitcoin</em>',
      landing_lead_html:
        'Projete poupança inicial, contribuições e horizonte com uma ferramenta clara voltada à comunidade Bitcoin e ao uso em <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi.xyz</a>.',
      landing_cta_primary: 'Abrir calculadora',
      landing_features_title: 'O que você pode fazer',
      landing_feat_1_title: 'Projeção clara',
      landing_feat_1_body:
        'Poupança inicial, contribuição periódica, anos e rendimento esperado em USD, MXN, BTC ou sats.',
      landing_feat_2_title: 'Premium opcional',
      landing_feat_2_body:
        'Três cenários, regra dos 4&nbsp;% para retiradas, planos cifrados e exportação em PDF — pagamento via Mercado Pago (MXN) quando disponível.',
      landing_feat_3_title: 'Seu dispositivo',
      landing_feat_3_body:
        'Os planos podem ser salvos no navegador; não é preciso conta na ferramenta para começar a calcular.',
      landing_steps_title: 'Em três passos',
      landing_step_1_title: 'Abra a calculadora',
      landing_step_1_body: 'Insira suas premissas reais para ver curvas ao longo do tempo.',
      landing_step_2_title: 'Ajuste e compare',
      landing_step_2_body:
        'Altere rendimento e moeda; no Premium você compara cenário conservador e agressivo.',
      landing_step_3_title: 'Documente seu plano',
      landing_step_3_body:
        'Compartilhe o resultado em texto ou mantenha o relatório em PDF com Premium ativo.',
      landing_cta_brujula: 'Sua bússola financeira',
      landing_cta_go_calc: 'Ir para a calculadora',
      landing_cta_explore_fedi: 'Explorar Fedi',
      landing_founders_title: 'Quem está por trás',
      founder_edu_bio:
        'Líder de experiência do cliente e operações | Fintech, tecnologia e transformação digital | Mais de 16 anos em operações críticas e atendimento ao cliente.',
      founder_ed_photo_alt:
        'Edgadafi RF — desenvolvedor com foco em DeFi, stablecoins e pagamentos on-chain na América Latina, Retiro Bitcoin',
      founder_ed_bio:
        'Construtor especializado em DeFi, stablecoins e pagamentos on-chain (foco América Latina).',
      founder_edu_photo_alt:
        'Eduardo Garcia — líder de experiência do cliente e operações, Retiro Bitcoin',
      landing_footer_credit_html:
        'Feito com ₿ para a comunidade <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a>',
      landing_footer_disclaimer:
        'Os cálculos são projeções educativas, não aconselhamento financeiro.',
      landing_footer_home: 'Início',
      landing_footer_brujula: 'Bússola',
      landing_footer_calc: 'Calculadora',
    },
    fr: {
      landing_doc_title: 'Calculatrice retraite Bitcoin — Planifiez votre indépendance',
      landing_lang_sr_label: 'Langue',
      landing_lang_aria: 'Langue',
      landing_nav_calc: 'Calculatrice',
      landing_toggle_theme: 'Changer de thème',
      landing_brand_logo_alt: 'Retraite Bitcoin, retirobtc.mx',
      landing_brand_sr_only: 'Retraite Bitcoin',
      landing_footer_nav_aria: 'Liens du site',
      landing_kicker: 'Calculatrice de retraite',
      landing_h1_html: 'Votre plan de retraite en <em>Bitcoin</em>',
      landing_lead_html:
        'Projettez épargne initiale, contributions et horizon avec un outil clair, pensé pour la communauté Bitcoin et pour <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi.xyz</a>.',
      landing_cta_primary: 'Ouvrir la calculatrice',
      landing_features_title: 'Ce que vous pouvez faire',
      landing_feat_1_title: 'Projection claire',
      landing_feat_1_body:
        'Épargne initiale, contribution périodique, années et rendement attendu en USD, MXN, BTC ou sats.',
      landing_feat_2_title: 'Premium optionnel',
      landing_feat_2_body:
        'Trois scénarios, règle des 4&nbsp;% pour les retraits, plans chiffrés et export PDF — paiement via Mercado Pago (MXN) lorsque disponible.',
      landing_feat_3_title: 'Votre appareil',
      landing_feat_3_body:
        'Les plans peuvent être enregistrés dans le navigateur ; aucun compte sur l’outil n’est requis pour commencer.',
      landing_steps_title: 'En trois étapes',
      landing_step_1_title: 'Ouvrez la calculatrice',
      landing_step_1_body: 'Saisissez vos hypothèses pour voir l’évolution dans le temps.',
      landing_step_2_title: 'Affinez et comparez',
      landing_step_2_body:
        'Changez rendement et devise ; avec Premium comparez prudent et agressif.',
      landing_step_3_title: 'Documentez votre plan',
      landing_step_3_body:
        'Partagez le résultat en texte ou gardez un rapport PDF avec Premium.',
      landing_cta_brujula: 'Votre boussole financière',
      landing_cta_go_calc: 'Aller à la calculatrice',
      landing_cta_explore_fedi: 'Découvrir Fedi',
      landing_founders_title: 'Qui sommes-nous',
      founder_edu_bio:
        'Chef expérience client et opérations | Fintech • tech • transformation numérique | Plus de 16 ans dans des opérations critiques et au service client.',
      founder_ed_photo_alt:
        'Edgadafi RF — développeur axé sur la DeFi, les stablecoins et les paiements on-chain (LATAM), Retiro Bitcoin',
      founder_ed_bio:
        'Développeur spécialisé en DeFi, stablecoins et paiements on-chain (focus LATAM).',
      founder_edu_photo_alt:
        'Eduardo Garcia — responsable expérience client et opérations, Retiro Bitcoin',
      landing_footer_credit_html:
        'Fait avec ₿ pour la communauté <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a>',
      landing_footer_disclaimer:
        'Les calculs sont des projections éducatives, pas des conseils financiers.',
      landing_footer_home: 'Accueil',
      landing_footer_brujula: 'Boussole',
      landing_footer_calc: 'Calculatrice',
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
    var sel = document.getElementById('landing-lang');
    var lang = getLangFromStorageAndBrowser();
    if (sel && STRINGS[sel.value]) lang = sel.value;

    document.documentElement.lang = lang;

    var title = translate(lang, 'landing_doc_title');
    if (title) document.title = title;

    document.querySelectorAll('[data-landing-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-landing-i18n');
      var txt = translate(lang, key);
      if (txt) el.textContent = txt;
    });

    document.querySelectorAll('[data-landing-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-landing-i18n-html');
      var html = translate(lang, key);
      if (html) el.innerHTML = html;
    });

    document.querySelectorAll('[data-landing-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-landing-i18n-alt');
      var txt = translate(lang, key);
      if (txt) el.setAttribute('alt', txt);
    });

    document.querySelectorAll('[data-landing-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-landing-i18n-aria');
      var txt = translate(lang, key);
      if (txt) el.setAttribute('aria-label', txt);
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
