/**
 * i18n para la landing pública — comparte btc_retirement_lang con /calc/script.js.
 */
(function () {
  'use strict';

  /** @readonly — debe coincidir con script.js (LANG_KEY). */
  var LANG_KEY = 'btc_retirement_lang';

  var STRINGS = {
    es: {
      landing_doc_title: 'Tu AFORE Soberana — Calculadora de Retiro Bitcoin',
      landing_meta_description:
        'Tu AFORE Soberana: compara tu retiro en Bitcoin vs ahorro voluntario AFORE. Proyección clara para México, custodia comunitaria Fedi.',
      landing_og_title: 'Tu AFORE Soberana — Calculadora de Retiro Bitcoin',
      landing_og_description:
        'Compara tu plan en Bitcoin contra el ~5% real del sistema AFORE. Misma aportación, distinto futuro. Mini App Fedi.',
      landing_twitter_title: 'Tu AFORE Soberana — Retiro Bitcoin',
      landing_twitter_description:
        'Compara AFORE vs Bitcoin con la misma aportación. Proyección educativa para México y Fedi.',
      landing_lang_sr_label: 'Idioma',
      landing_lang_aria: 'Idioma',
      landing_nav_calc: 'Calculadora',
      landing_toggle_theme: 'Cambiar tema',
      landing_brand_logo_alt: 'Bitcoin Retiro, retirobtc.mx',
      landing_brand_sr_only: 'Retiro Bitcoin',
      landing_footer_nav_aria: 'Enlaces del sitio',
      landing_campaign_kicker: 'Campaña · Tu AFORE Soberana',
      landing_h1_html: 'Tu retiro fuera del control estatal, en <em>Bitcoin</em>',
      landing_lead_html:
        'La reforma de 2026 permite destinar hasta un <strong>30&nbsp;%</strong> del ahorro AFORE a obra pública. Con la misma aportación, compara tu plan en Bitcoin — custodia comunitaria en <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a> — contra el <strong>~5&nbsp;%</strong> real histórico del sistema.',
      landing_cta_primary: 'Comparar AFORE vs Bitcoin',
      landing_cta_why: 'Por qué importa',
      landing_campaign_title: '2026: la confianza en las AFORE se resquebrajó',
      landing_campaign_body:
        'Millones de trabajadores ya entienden el retiro formal, pero el ahorro voluntario sigue estancado. Esta herramienta no vende miedo: te muestra números — lado a lado — para decidir con soberanía.',
      landing_stat_1_value: '~5,02&nbsp;%',
      landing_stat_1_label: 'Rendimiento real histórico AFORE (CONSAR)',
      landing_stat_2_value: '30&nbsp;%',
      landing_stat_2_label: 'Máximo en infraestructura estatal (Ley 2026)',
      landing_stat_3_value: '&lt;2&nbsp;%',
      landing_stat_3_label: 'Ahorro voluntario del total de activos',
      landing_campaign_note:
        'La calculadora incluye un comparador gratuito: misma aportación inicial, mismos años — AFORE voluntario contra tu proyección en Bitcoin.',
      landing_campaign_cta: 'Calcular mi plan soberano',
      landing_features_title: 'Qué puedes hacer',
      landing_feat_1_title: 'AFORE vs Bitcoin',
      landing_feat_1_body:
        'Misma aportación e horizonte: compara saldo final, ganancia y poder adquisitivo real contra el promedio histórico del sistema (~5,02&nbsp;%).',
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
        'Tras calcular, revisa el comparador AFORE vs Bitcoin; en Premium puedes explorar escenarios conservador y agresivo.',
      landing_step_3_title: 'Documenta tu plan',
      landing_step_3_body:
        'Comparte el resultado en texto o lleva tu reporte en PDF si tienes Premium activo.',
      landing_cta_brujula: 'Tu brújula financiera',
      landing_cta_go_calc: 'Ir a la calculadora',
      landing_cta_explore_fedi: 'Explorar Fedi',
      landing_founders_title: 'Quién está detrás',
      founder_ed_photo_alt:
        'Edgadafi RF — desarrollador con enfoque en DeFi, stablecoins y pagos on-chain para LATAM, Retiro Bitcoin',
      founder_ed_bio:
        'Builder especializado en DeFi, stablecoins y pagos on-chain con enfoque en LATAM.',
      landing_footer_credit_html:
        'Hecho con ₿ para la comunidad <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a>',
      landing_footer_disclaimer:
        'Los cálculos son proyecciones educativas, no asesoría financiera.',
      landing_footer_home: 'Inicio',
      landing_footer_brujula: 'Brújula',
      landing_footer_calc: 'Calculadora',
      landing_footer_privacy: 'Aviso de privacidad',
    },
    en: {
      landing_doc_title: 'Your Sovereign AFORE — Bitcoin Retirement Calculator',
      landing_meta_description:
        'Your Sovereign AFORE: compare Bitcoin retirement vs voluntary AFORE savings. Clear projections for Mexico, Fedi community custody.',
      landing_og_title: 'Your Sovereign AFORE — Bitcoin Retirement Calculator',
      landing_og_description:
        'Compare your Bitcoin plan against ~5% real AFORE system average. Same contribution, different future. Fedi Mini App.',
      landing_twitter_title: 'Your Sovereign AFORE — Bitcoin Retirement',
      landing_twitter_description:
        'Compare AFORE vs Bitcoin with the same contributions. Educational projection for Mexico and Fedi.',
      landing_lang_sr_label: 'Language',
      landing_lang_aria: 'Language',
      landing_nav_calc: 'Calculator',
      landing_toggle_theme: 'Toggle theme',
      landing_brand_logo_alt: 'Bitcoin Retirement, retirobtc.mx',
      landing_brand_sr_only: 'Bitcoin Retirement',
      landing_footer_nav_aria: 'Site links',
      landing_campaign_kicker: 'Campaign · Your Sovereign AFORE',
      landing_h1_html: 'Retirement outside state control, in <em>Bitcoin</em>',
      landing_lead_html:
        '2026 reforms allow up to <strong>30&nbsp;%</strong> of AFORE savings into state infrastructure. With the same contribution, compare your Bitcoin plan — community custody on <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a> — against the system’s historical <strong>~5&nbsp;%</strong> real return.',
      landing_cta_primary: 'Compare AFORE vs Bitcoin',
      landing_cta_why: 'Why it matters',
      landing_campaign_title: '2026: trust in AFORE cracked',
      landing_campaign_body:
        'Millions already understand formal retirement, but voluntary savings remain stagnant. This tool doesn’t sell fear: it shows numbers — side by side — so you can decide with sovereignty.',
      landing_stat_1_value: '~5.02&nbsp;%',
      landing_stat_1_label: 'AFORE historical real return (CONSAR)',
      landing_stat_2_value: '30&nbsp;%',
      landing_stat_2_label: 'Max in state infrastructure (2026 law)',
      landing_stat_3_value: '&lt;2&nbsp;%',
      landing_stat_3_label: 'Voluntary savings share of total assets',
      landing_campaign_note:
        'The calculator includes a free comparator: same initial contribution and years — voluntary AFORE vs your Bitcoin projection.',
      landing_campaign_cta: 'Calculate my sovereign plan',
      landing_features_title: 'What you can do',
      landing_feat_1_title: 'AFORE vs Bitcoin',
      landing_feat_1_body:
        'Same contribution and horizon: compare final balance, gain and real purchasing power against the system historical average (~5.02&nbsp;%).',
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
        'After calculating, review the AFORE vs Bitcoin comparator; with Premium explore conservative and aggressive scenarios.',
      landing_step_3_title: 'Document your plan',
      landing_step_3_body:
        'Share results as text or keep a PDF report when Premium is active.',
      landing_cta_brujula: 'Your financial compass',
      landing_cta_go_calc: 'Go to calculator',
      landing_cta_explore_fedi: 'Explore Fedi',
      landing_founders_title: 'Who is behind this',
      founder_ed_photo_alt:
        'Edgadafi RF — builder focused on DeFi, stablecoins and on-chain payments (LATAM), Bitcoin Retirement',
      founder_ed_bio:
        'Developer focused on DeFi, stablecoins and on-chain payments (LATAM).',
      landing_footer_credit_html:
        'Made with ₿ for the <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a> community',
      landing_footer_disclaimer:
        'Calculations are educational projections, not financial advice.',
      landing_footer_home: 'Home',
      landing_footer_brujula: 'Compass',
      landing_footer_calc: 'Calculator',
      landing_footer_privacy: 'Privacy notice',
    },
    pt: {
      landing_doc_title: 'Sua AFORE Soberana — Calculadora de Aposentadoria Bitcoin',
      landing_meta_description:
        'Sua AFORE Soberana: compare aposentadoria em Bitcoin vs poupança voluntária AFORE. Projeção clara para o México, custódia comunitária Fedi.',
      landing_og_title: 'Sua AFORE Soberana — Calculadora de Aposentadoria Bitcoin',
      landing_og_description:
        'Compare seu plano Bitcoin com ~5% real do sistema AFORE. Mesma contribuição, futuro diferente. Mini App Fedi.',
      landing_twitter_title: 'Sua AFORE Soberana — Aposentadoria Bitcoin',
      landing_twitter_description:
        'Compare AFORE vs Bitcoin com a mesma contribuição. Projeção educativa para o México e Fedi.',
      landing_lang_sr_label: 'Idioma',
      landing_lang_aria: 'Idioma',
      landing_nav_calc: 'Calculadora',
      landing_toggle_theme: 'Alternar tema',
      landing_brand_logo_alt: 'Retiro Bitcoin, retirobtc.mx',
      landing_brand_sr_only: 'Aposentadoria Bitcoin',
      landing_footer_nav_aria: 'Links do site',
      landing_campaign_kicker: 'Campanha · Sua AFORE Soberana',
      landing_h1_html: 'Sua aposentadoria fora do controle estatal, em <em>Bitcoin</em>',
      landing_lead_html:
        'A reforma de 2026 permite destinar até <strong>30&nbsp;%</strong> da poupança AFORE a infraestrutura pública. Com a mesma contribuição, compare seu plano em Bitcoin — custódia comunitária no <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a> — contra os <strong>~5&nbsp;%</strong> reais históricos do sistema.',
      landing_cta_primary: 'Comparar AFORE vs Bitcoin',
      landing_cta_why: 'Por que importa',
      landing_campaign_title: '2026: a confiança nas AFORE rachou',
      landing_campaign_body:
        'Milhões já entendem a aposentadoria formal, mas a poupança voluntária continua estagnada. Esta ferramenta não vende medo: mostra números — lado a lado — para decidir com soberania.',
      landing_stat_1_value: '~5,02&nbsp;%',
      landing_stat_1_label: 'Retorno real histórico AFORE (CONSAR)',
      landing_stat_2_value: '30&nbsp;%',
      landing_stat_2_label: 'Máximo em infraestrutura estatal (Lei 2026)',
      landing_stat_3_value: '&lt;2&nbsp;%',
      landing_stat_3_label: 'Poupança voluntária do total de ativos',
      landing_campaign_note:
        'A calculadora inclui um comparador gratuito: mesma contribuição inicial, mesmos anos — AFORE voluntário vs sua projeção em Bitcoin.',
      landing_campaign_cta: 'Calcular meu plano soberano',
      landing_features_title: 'O que você pode fazer',
      landing_feat_1_title: 'AFORE vs Bitcoin',
      landing_feat_1_body:
        'Mesma contribuição e horizonte: compare saldo final, ganho e poder de compra real contra a média histórica do sistema (~5,02&nbsp;%).',
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
        'Após calcular, revise o comparador AFORE vs Bitcoin; no Premium explore cenários conservador e agressivo.',
      landing_step_3_title: 'Documente seu plano',
      landing_step_3_body:
        'Compartilhe o resultado em texto ou mantenha o relatório em PDF com Premium ativo.',
      landing_cta_brujula: 'Sua bússola financeira',
      landing_cta_go_calc: 'Ir para a calculadora',
      landing_cta_explore_fedi: 'Explorar Fedi',
      landing_founders_title: 'Quem está por trás',
      founder_ed_photo_alt:
        'Edgadafi RF — desenvolvedor com foco em DeFi, stablecoins e pagamentos on-chain na América Latina, Retiro Bitcoin',
      founder_ed_bio:
        'Construtor especializado em DeFi, stablecoins e pagamentos on-chain (foco América Latina).',
      landing_footer_credit_html:
        'Feito com ₿ para a comunidade <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a>',
      landing_footer_disclaimer:
        'Os cálculos são projeções educativas, não aconselhamento financeiro.',
      landing_footer_home: 'Início',
      landing_footer_brujula: 'Bússola',
      landing_footer_calc: 'Calculadora',
      landing_footer_privacy: 'Aviso de privacidade',
    },
    fr: {
      landing_doc_title: 'Votre AFORE souveraine — Calculatrice retraite Bitcoin',
      landing_meta_description:
        'Votre AFORE souveraine : comparez retraite Bitcoin vs épargne volontaire AFORE. Projections claires pour le Mexique, garde communautaire Fedi.',
      landing_og_title: 'Votre AFORE souveraine — Calculatrice retraite Bitcoin',
      landing_og_description:
        'Comparez votre plan Bitcoin au ~5 % réel du système AFORE. Même apport, avenir différent. Mini App Fedi.',
      landing_twitter_title: 'Votre AFORE souveraine — Retraite Bitcoin',
      landing_twitter_description:
        'Comparez AFORE vs Bitcoin avec le même apport. Projection éducative pour le Mexique et Fedi.',
      landing_lang_sr_label: 'Langue',
      landing_lang_aria: 'Langue',
      landing_nav_calc: 'Calculatrice',
      landing_toggle_theme: 'Changer de thème',
      landing_brand_logo_alt: 'Retraite Bitcoin, retirobtc.mx',
      landing_brand_sr_only: 'Retraite Bitcoin',
      landing_footer_nav_aria: 'Liens du site',
      landing_campaign_kicker: 'Campagne · Votre AFORE souveraine',
      landing_h1_html: 'Votre retraite hors du contrôle étatique, en <em>Bitcoin</em>',
      landing_lead_html:
        'La réforme de 2026 autorise jusqu’à <strong>30&nbsp;%</strong> de l’épargne AFORE en infrastructure publique. Au même apport, comparez votre plan Bitcoin — garde communautaire sur <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a> — au <strong>~5&nbsp;%</strong> réel historique du système.',
      landing_cta_primary: 'Comparer AFORE vs Bitcoin',
      landing_cta_why: 'Pourquoi c’est important',
      landing_campaign_title: '2026 : la confiance dans les AFORE a vacillé',
      landing_campaign_body:
        'Des millions comprennent déjà la retraite formelle, mais l’épargne volontaire stagne. Cet outil ne vend pas la peur : il montre les chiffres — côte à côte — pour décider en souveraineté.',
      landing_stat_1_value: '~5,02&nbsp;%',
      landing_stat_1_label: 'Rendement réel historique AFORE (CONSAR)',
      landing_stat_2_value: '30&nbsp;%',
      landing_stat_2_label: 'Maximum en infrastructure d’État (loi 2026)',
      landing_stat_3_value: '&lt;2&nbsp;%',
      landing_stat_3_label: 'Part de l’épargne volontaire dans les actifs',
      landing_campaign_note:
        'La calculatrice inclut un comparateur gratuit : même apport initial, mêmes années — AFORE volontaire vs votre projection Bitcoin.',
      landing_campaign_cta: 'Calculer mon plan souverain',
      landing_features_title: 'Ce que vous pouvez faire',
      landing_feat_1_title: 'AFORE vs Bitcoin',
      landing_feat_1_body:
        'Même apport et horizon : comparez solde final, gain et pouvoir d’achat réel à la moyenne historique du système (~5,02&nbsp;%).',
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
        'Après le calcul, consultez le comparateur AFORE vs Bitcoin ; avec Premium explorez scénarios prudent et agressif.',
      landing_step_3_title: 'Documentez votre plan',
      landing_step_3_body:
        'Partagez le résultat en texte ou gardez un rapport PDF avec Premium.',
      landing_cta_brujula: 'Votre boussole financière',
      landing_cta_go_calc: 'Aller à la calculatrice',
      landing_cta_explore_fedi: 'Découvrir Fedi',
      landing_founders_title: 'Qui est derrière',
      founder_ed_photo_alt:
        'Edgadafi RF — développeur axé sur la DeFi, les stablecoins et les paiements on-chain (LATAM), Retiro Bitcoin',
      founder_ed_bio:
        'Développeur spécialisé en DeFi, stablecoins et paiements on-chain (focus LATAM).',
      landing_footer_credit_html:
        'Fait avec ₿ pour la communauté <a href="https://fedi.xyz" target="_blank" rel="noopener">Fedi</a>',
      landing_footer_disclaimer:
        'Les calculs sont des projections éducatives, pas des conseils financiers.',
      landing_footer_home: 'Accueil',
      landing_footer_brujula: 'Boussole',
      landing_footer_calc: 'Calculatrice',
      landing_footer_privacy: 'Avis de confidentialité',
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

    var metaDesc = document.querySelector('meta[name="description"]');
    var desc = translate(lang, 'landing_meta_description');
    if (metaDesc && desc) metaDesc.setAttribute('content', desc);

    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogTitleTxt = translate(lang, 'landing_og_title');
    if (ogTitle && ogTitleTxt) ogTitle.setAttribute('content', ogTitleTxt);

    var ogDesc = document.querySelector('meta[property="og:description"]');
    var ogDescTxt = translate(lang, 'landing_og_description');
    if (ogDesc && ogDescTxt) ogDesc.setAttribute('content', ogDescTxt);

    var twTitle = document.querySelector('meta[name="twitter:title"]');
    var twTitleTxt = translate(lang, 'landing_twitter_title');
    if (twTitle && twTitleTxt) twTitle.setAttribute('content', twTitleTxt);

    var twDesc = document.querySelector('meta[name="twitter:description"]');
    var twDescTxt = translate(lang, 'landing_twitter_description');
    if (twDesc && twDescTxt) twDesc.setAttribute('content', twDescTxt);

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
