/* =============================================
   Calculadora de Retiro Bitcoin – Fedi Mini App
   Core logic, Fedi integration, charts, premium
   ============================================= */

(function () {
  'use strict';

  // ─── Constants ─────────────────────────────────────────────
  const BTC_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,mxn';
  const SATS_PER_BTC = 100_000_000;
  const SWR_RATE = 0.04;
  const PREMIUM_KEY = 'btc_retirement_premium';
  const PLAN_KEY = 'btc_retirement_plan';
  const THEME_KEY = 'btc_retirement_theme';
  const MONTHLY_PRICE_USD = 1;
  const LIFETIME_PRICE_USD = 10;
  const AUREO_REFERRAL_URL = 'https://app.aureobitcoin.com/es/auth/signup?ref=HACKATHONBITCOIN';
  const LANG_KEY = 'btc_retirement_lang';
  const PAYMENT_API = '/api';
  /** true = Checkout Pro (Mercado Pago). false = Lightning (LNbits /api/create-invoice). */
  const PAYMENT_USE_MERCADOPAGO = true;

  // ─── i18n Dictionary ───────────────────────────────────────
  const LANG = {
    es: {
      lang_label: 'Idioma',
      logo_text: 'Retiro Bitcoin',
      tagline: 'Planifica tu independencia financiera con Bitcoin',
      env_fedi: '⚡ Conectado a Fedi',
      env_webln: '⚡ Lightning Wallet detectada',
      calc_title: 'Tu plan de retiro',
      label_initial: 'Ahorro inicial',
      label_contribution: 'Aporte periódico',
      freq_monthly: 'Mensual',
      freq_weekly: 'Semanal',
      freq_daily: 'Diario',
      label_years: 'Horizonte de tiempo:',
      years_unit: 'años',
      label_return: 'Rendimiento anual esperado:',
      range_conservative: '3% conservador',
      range_aggressive: '30% agresivo',
      label_inflation: 'Inflación anual local (opcional):',
      btn_calculate: 'Calcular mi retiro',
      results_title: 'Tu proyección',
      res_btc_label: 'Saldo final en BTC',
      res_fiat_label: 'Equivalente en',
      res_invested_label: 'Total invertido',
      res_gain_label: 'Ganancia neta',
      res_real_label: 'Poder adquisitivo real',
      btn_share: 'Compartir resultado',
      btn_premium_cta: '⚡ Desbloquear Premium',
      aureo_title: '🇲🇽 Compra Bitcoin con pesos',
      aureo_desc: 'Empieza tu plan de ahorro comprando BTC en Aureo, la plataforma para México.',
      aureo_btn: 'Comprar Bitcoin en Aureo →',
      tools_title: 'Herramientas para tu plan',
      tool_calendar_title: 'Recordatorio de ahorro',
      tool_calendar_desc: 'Agrega un evento recurrente a Google Calendar',
      tool_coingecko_title: 'Alerta de precio BTC',
      tool_coingecko_desc: 'Configura alertas gratis en CoinGecko',
      scenarios_title: 'Comparación de escenarios',
      scenario_conservative: '🐢 Conservador',
      scenario_moderate: '⚖️ Moderado',
      scenario_aggressive: '🚀 Agresivo',
      withdrawal_title: 'Simulación de retiro (SWR 4%)',
      res_swr_annual: 'Retiro anual seguro',
      res_swr_monthly: 'Retiro mensual',
      res_swr_years: 'Años de retiro sostenible',
      premium_tools_title: 'Herramientas Premium',
      btn_save: '💾 Guardar plan',
      btn_export_pdf: '📄 Exportar PDF',
      btn_load: '📂 Cargar plan guardado',
      modal_premium_title: '⚡ Desbloquea Premium',
      price_mp_monthly: 'Pago mensual (MXN en checkout)',
      price_mp_lifetime: 'Pago único / de por vida (MXN en checkout)',
      modal_premium_desc: 'Accede a todas las herramientas para planificar tu retiro como un profesional.',
      pf_scenarios: 'Comparar 3 escenarios lado a lado',
      pf_swr: 'Simulación de retiro (SWR 4%)',
      pf_save: 'Guardar planes con cifrado local',
      pf_pdf: 'Exportar reporte PDF profesional',
      pf_no_ads: 'Sin anuncios, soporte prioritario',
      plan_monthly: 'Plan mensual — Mercado Pago',
      plan_lifetime: 'De por vida — Mercado Pago',
      btn_restore: 'Restaurar compra anterior',
      modal_payment_note: 'Pago seguro con Mercado Pago (tarjeta y otros medios)',
      help_title: '📖 Guía de usuario',
      help_calc_title: 'Cómo usar la calculadora',
      help_calc_initial: '<strong>Ahorro inicial:</strong> cuánto tienes hoy para empezar. Puedes ponerlo en USD, MXN, BTC o sats.',
      help_calc_contribution: '<strong>Aporte periódico:</strong> cuánto vas a agregar cada día, semana o mes a tu plan.',
      help_calc_horizon: '<strong>Horizonte:</strong> cuántos años planeas ahorrar. Mueve el slider de 1 a 50 años.',
      help_calc_return: '<strong>Rendimiento:</strong> cuánto esperas que crezca tu inversión por año. 3% es conservador, 10% moderado, 30% agresivo.',
      help_calc_inflation: '<strong>Inflación:</strong> cuánto pierde valor tu moneda local por año. Te muestra el poder adquisitivo real de tu ahorro.',
      help_calc_action: 'Presiona <strong>"Calcular mi retiro"</strong> para ver tu proyección con gráfica interactiva.',
      help_results_title: 'Cómo leer los resultados',
      help_res_btc: '<strong>Saldo final en BTC:</strong> cuánto Bitcoin tendrías al final del periodo.',
      help_res_fiat: '<strong>Equivalente en tu moneda:</strong> el valor en USD o MXN al precio actual de BTC.',
      help_res_invested: '<strong>Total invertido:</strong> cuánto dinero pusiste en total (ahorro inicial + todos tus aportes).',
      help_res_gain: '<strong>Ganancia neta:</strong> la diferencia entre lo que tendrías y lo que invertiste. En verde.',
      help_res_real: '<strong>Poder adquisitivo real:</strong> tu saldo ajustado por inflación — lo que realmente podrías comprar con ese dinero.',
      help_scenarios_title: 'Comparación de escenarios (Premium)',
      help_scenarios_desc: 'La app genera 3 proyecciones automáticas con diferentes rendimientos:',
      help_scenarios_cons: '<strong>🐢 Conservador:</strong> la mitad del rendimiento que elegiste.',
      help_scenarios_mod: '<strong>⚖️ Moderado:</strong> el rendimiento que elegiste.',
      help_scenarios_agg: '<strong>🚀 Agresivo:</strong> 1.5x el rendimiento que elegiste.',
      help_scenarios_chart: 'La gráfica compara los 3 lado a lado para que veas el rango de posibilidades.',
      help_swr_title: 'Simulación de retiro — regla del 4% (Premium)',
      help_swr_desc: 'El <strong>SWR</strong> (Safe Withdrawal Rate) es una regla clásica: puedes retirar el 4% de tu saldo cada año sin quedarte sin dinero.',
      help_swr_calc: 'La app calcula cuánto podrías retirar por año y por mes.',
      help_swr_chart: 'La gráfica de barras muestra cuántos años dura tu dinero si retiras ese monto fijo. Verde = saludable, rojo = zona de riesgo.',
      help_save_title: 'Guardar plan y exportar PDF (Premium)',
      help_save_save: '<strong>💾 Guardar plan:</strong> almacena tus parámetros en tu dispositivo. Puedes guardar hasta 10 planes.',
      help_save_load: '<strong>📂 Cargar plan:</strong> restaura el último plan guardado con todos los campos.',
      help_save_pdf: '<strong>📄 Exportar PDF:</strong> genera un reporte profesional descargable con datos, tabla anual y parámetros.',
      help_premium_title: 'Cómo activar Premium',
      help_premium_btn: 'Presiona <strong>"⚡ Desbloquear Premium"</strong> para ver los planes.',
      help_premium_prices: 'Paga con <strong>Mercado Pago</strong> (tarjeta y otros medios): plan mensual o de por vida. Montos en MXN en el checkout.',
      help_premium_fedi: 'Si usas Fedi, el pago se hace directamente desde tu wallet integrada.',
      help_premium_restore: 'Si cambias de dispositivo, usa <strong>"Restaurar compra"</strong> (funciona en el mismo navegador).',
      help_aureo_title: 'Comprar Bitcoin con Aureo (solo México)',
      help_aureo_desc: 'El botón <strong>"Comprar Bitcoin en Aureo"</strong> te lleva a la plataforma Aureo donde puedes comprar BTC con pesos mexicanos.',
      help_aureo_condition: 'Solo aparece si tu moneda está configurada en MXN.',
      help_aureo_platform: 'Aureo es una plataforma regulada en México para compra y venta de Bitcoin.',
      help_calendar_title: 'Recordatorio de ahorro',
      help_calendar_desc: 'El botón <strong>"📅 Recordatorio de ahorro"</strong> crea un evento recurrente en Google Calendar.',
      help_calendar_freq: 'Te recuerda hacer tu aporte según la frecuencia que elegiste (diario, semanal, mensual).',
      help_calendar_privacy: 'No necesitas dar tu email ni crear cuenta. Se abre directo en tu calendario.',
      help_coingecko_title: 'Alerta de precio Bitcoin',
      help_cg_step1: '<strong>1.</strong> Crea una cuenta gratuita en CoinGecko (o inicia sesión).',
      help_cg_step2: '<strong>2.</strong> Busca "Bitcoin" en la barra de búsqueda.',
      help_cg_step3: '<strong>3.</strong> En la página de Bitcoin, haz click en el icono de campana / "Price Alert".',
      help_cg_step4: '<strong>4.</strong> Configura el precio objetivo (por arriba o por debajo del precio actual).',
      help_cg_step5: '<strong>5.</strong> Activa la notificación por email.',
      help_cg_step6: '<strong>6.</strong> Listo — recibirás un email cuando BTC alcance tu precio.',
      help_cg_note: 'Es un servicio externo y gratuito. No almacenamos tu información.',
      help_glossary_title: 'Glosario',
      help_g_btc: '<strong>BTC:</strong> Bitcoin, la moneda digital descentralizada.',
      help_g_sats: '<strong>sats (satoshis):</strong> la unidad más pequeña de Bitcoin. 1 BTC = 100,000,000 sats.',
      help_g_ln: '<strong>Lightning Network:</strong> red de pagos instantáneos y baratos sobre Bitcoin.',
      help_g_webln: '<strong>WebLN:</strong> protocolo que conecta tu wallet Lightning con aplicaciones web.',
      help_g_nostr: '<strong>Nostr:</strong> protocolo descentralizado de identidad y mensajería.',
      help_g_swr: '<strong>SWR:</strong> Safe Withdrawal Rate — tasa segura de retiro (4% anual).',
      help_g_inflation: '<strong>Inflación:</strong> la pérdida de poder adquisitivo de una moneda con el tiempo.',
      help_g_fedi: '<strong>Fedi:</strong> plataforma comunitaria de Bitcoin con wallets y mini apps.',
      help_v2_note: 'En la versión 2 tendrás un asistente de chat para resolver tus dudas al instante.',
      footer_made: 'Hecho con ₿ para la comunidad',
      footer_disclaimer: 'Los cálculos son proyecciones educativas, no asesoría financiera.',
      return_info_toggle: '¿Qué rendimiento elegir?',
      return_info_4y: 'Últimos 4 años (2021–2025): ~30% anual',
      return_info_8y: 'Últimos 8 años (2017–2025): ~25% anual',
      return_info_12y: 'Últimos 12 años (2013–2025): ~60% anual',
      return_info_disclaimer: 'El rendimiento pasado no garantiza resultados futuros.',
      return_info_suggestion: 'Un rango de 5%–15% es razonable para proyecciones conservadoras a largo plazo.',
      toast_premium: '⚡ Premium activado. ¡Disfruta todas las herramientas!',
      toast_no_wallet: 'No se detectó wallet Lightning. Usa Fedi o una wallet compatible.',
      toast_payment_cancel: 'Pago cancelado',
      toast_payment_error: 'Error en el pago. Intenta de nuevo.',
      toast_restored: 'Compra restaurada correctamente.',
      toast_no_purchase: 'No se encontró compra previa en este dispositivo.',
      toast_saved: '💾 Plan guardado correctamente',
      toast_no_plans: 'No hay planes guardados',
      toast_loaded: '📂 Plan del {date} cargado',
      toast_pdf: '📄 PDF exportado',
      toast_copied: 'Resultado copiado al portapapeles',
      payment_generating: 'Generando invoice Lightning...',
      payment_scan_or_copy: 'Escanea el QR o copia la invoice para pagar',
      payment_copy_invoice: 'Copiar invoice',
      payment_copied: '¡Copiado!',
      payment_waiting: 'Esperando confirmación de pago...',
      payment_success: '¡Pago confirmado! Premium activado.',
      payment_timeout: 'La invoice expiró. Intenta de nuevo.',
      payment_retry: 'Reintentar',
      share_text: '📊 Mi plan de retiro con Bitcoin:\nEn {years} años podría tener {btc} ({fiat}).\n\n¡Calcula el tuyo! 👉 [Retiro Bitcoin - Fedi Mini App]',
      chart_balance: 'Saldo',
      chart_invested: 'Invertido',
      chart_year: 'Año',
      chart_remaining: 'Saldo restante',
      coingecko_confirm: 'Vas a salir de la calculadora hacia CoinGecko para configurar alertas de precio.\n\nTu progreso está guardado.\n\n¿Continuar?',
      calendar_title_tpl: 'Aporte Bitcoin: {amount} {currency} ({freq})',
      calendar_details_tpl: 'Recuerda hacer tu aporte {freq} de {amount} {currency} a tu plan de retiro Bitcoin.',
      freq_label_daily: 'diario',
      freq_label_weekly: 'semanal',
      freq_label_monthly: 'mensual',
      pdf_title: 'Calculadora de Retiro Bitcoin',
      pdf_generated: 'Generado:',
      pdf_btc_price: 'Precio BTC:',
      pdf_params: 'Parámetros',
      pdf_initial: 'Ahorro inicial:',
      pdf_monthly: 'Aporte mensual:',
      pdf_horizon: 'Horizonte:',
      pdf_return: 'Rendimiento anual:',
      pdf_inflation: 'Inflación:',
      pdf_results: 'Resultados',
      pdf_final: 'Saldo final:',
      pdf_equivalent: 'Equivalente:',
      pdf_invested: 'Total invertido:',
      pdf_gain: 'Ganancia neta:',
      pdf_real_power: 'Poder adquisitivo real:',
      pdf_projection: 'Proyección anual',
      pdf_year: 'Año',
      pdf_balance: 'Saldo',
      pdf_gain_col: 'Ganancia',
      pdf_disclaimer: 'Los cálculos son proyecciones educativas, no asesoría financiera.',
      pdf_footer: 'Generado con Calculadora de Retiro Bitcoin – Fedi Mini App',
    },
    en: {
      lang_label: 'Language',
      logo_text: 'Bitcoin Retirement',
      tagline: 'Plan your financial independence with Bitcoin',
      env_fedi: '⚡ Connected to Fedi',
      env_webln: '⚡ Lightning Wallet detected',
      calc_title: 'Your retirement plan',
      label_initial: 'Initial savings',
      label_contribution: 'Periodic contribution',
      freq_monthly: 'Monthly',
      freq_weekly: 'Weekly',
      freq_daily: 'Daily',
      label_years: 'Time horizon:',
      years_unit: 'years',
      label_return: 'Expected annual return:',
      range_conservative: '3% conservative',
      range_aggressive: '30% aggressive',
      label_inflation: 'Local annual inflation (optional):',
      btn_calculate: 'Calculate my retirement',
      results_title: 'Your projection',
      res_btc_label: 'Final BTC balance',
      res_fiat_label: 'Equivalent in',
      res_invested_label: 'Total invested',
      res_gain_label: 'Net gain',
      res_real_label: 'Real purchasing power',
      btn_share: 'Share result',
      btn_premium_cta: '⚡ Unlock Premium',
      aureo_title: '🇲🇽 Buy Bitcoin with pesos',
      aureo_desc: 'Start your savings plan by buying BTC on Aureo, the platform for Mexico.',
      aureo_btn: 'Buy Bitcoin on Aureo →',
      tools_title: 'Tools for your plan',
      tool_calendar_title: 'Savings reminder',
      tool_calendar_desc: 'Add a recurring event to Google Calendar',
      tool_coingecko_title: 'BTC price alert',
      tool_coingecko_desc: 'Set up free alerts on CoinGecko',
      scenarios_title: 'Scenario comparison',
      scenario_conservative: '🐢 Conservative',
      scenario_moderate: '⚖️ Moderate',
      scenario_aggressive: '🚀 Aggressive',
      withdrawal_title: 'Withdrawal simulation (SWR 4%)',
      res_swr_annual: 'Safe annual withdrawal',
      res_swr_monthly: 'Monthly withdrawal',
      res_swr_years: 'Sustainable retirement years',
      premium_tools_title: 'Premium Tools',
      btn_save: '💾 Save plan',
      btn_export_pdf: '📄 Export PDF',
      btn_load: '📂 Load saved plan',
      modal_premium_title: '⚡ Unlock Premium',
      price_mp_monthly: 'Monthly (MXN at checkout)',
      price_mp_lifetime: 'One-time / lifetime (MXN at checkout)',
      modal_premium_desc: 'Access all the tools to plan your retirement like a pro.',
      pf_scenarios: 'Compare 3 scenarios side by side',
      pf_swr: 'Withdrawal simulation (SWR 4%)',
      pf_save: 'Save plans with local encryption',
      pf_pdf: 'Export professional PDF report',
      pf_no_ads: 'No ads, priority support',
      plan_monthly: 'Monthly plan — Mercado Pago',
      plan_lifetime: 'Lifetime — Mercado Pago',
      btn_restore: 'Restore previous purchase',
      modal_payment_note: 'Secure payment with Mercado Pago',
      help_title: '📖 User Guide',
      help_calc_title: 'How to use the calculator',
      help_calc_initial: '<strong>Initial savings:</strong> how much you have today to start. You can enter it in USD, MXN, BTC or sats.',
      help_calc_contribution: '<strong>Periodic contribution:</strong> how much you will add each day, week or month to your plan.',
      help_calc_horizon: '<strong>Horizon:</strong> how many years you plan to save. Move the slider from 1 to 50 years.',
      help_calc_return: '<strong>Return:</strong> how much you expect your investment to grow per year. 3% is conservative, 10% moderate, 30% aggressive.',
      help_calc_inflation: '<strong>Inflation:</strong> how much your local currency loses value per year. Shows the real purchasing power of your savings.',
      help_calc_action: 'Press <strong>"Calculate my retirement"</strong> to see your projection with an interactive chart.',
      help_results_title: 'How to read the results',
      help_res_btc: '<strong>Final BTC balance:</strong> how much Bitcoin you would have at the end of the period.',
      help_res_fiat: '<strong>Equivalent in your currency:</strong> the value in USD or MXN at the current BTC price.',
      help_res_invested: '<strong>Total invested:</strong> how much money you put in total (initial savings + all contributions).',
      help_res_gain: '<strong>Net gain:</strong> the difference between what you would have and what you invested. In green.',
      help_res_real: '<strong>Real purchasing power:</strong> your balance adjusted for inflation — what you could actually buy with that money.',
      help_scenarios_title: 'Scenario comparison (Premium)',
      help_scenarios_desc: 'The app generates 3 automatic projections with different returns:',
      help_scenarios_cons: '<strong>🐢 Conservative:</strong> half the return you chose.',
      help_scenarios_mod: '<strong>⚖️ Moderate:</strong> the return you chose.',
      help_scenarios_agg: '<strong>🚀 Aggressive:</strong> 1.5x the return you chose.',
      help_scenarios_chart: 'The chart compares all 3 side by side so you can see the range of possibilities.',
      help_swr_title: 'Withdrawal simulation — 4% rule (Premium)',
      help_swr_desc: '<strong>SWR</strong> (Safe Withdrawal Rate) is a classic rule: you can withdraw 4% of your balance each year without running out of money.',
      help_swr_calc: 'The app calculates how much you could withdraw per year and per month.',
      help_swr_chart: 'The bar chart shows how many years your money lasts if you withdraw that fixed amount. Green = healthy, red = risk zone.',
      help_save_title: 'Save plan and export PDF (Premium)',
      help_save_save: '<strong>💾 Save plan:</strong> stores your parameters on your device. You can save up to 10 plans.',
      help_save_load: '<strong>📂 Load plan:</strong> restores the last saved plan with all fields.',
      help_save_pdf: '<strong>📄 Export PDF:</strong> generates a downloadable professional report with data, annual table and parameters.',
      help_premium_title: 'How to activate Premium',
      help_premium_btn: 'Press <strong>"⚡ Unlock Premium"</strong> to see the plans.',
      help_premium_prices: 'Pay with <strong>Mercado Pago</strong> (card and other methods): monthly or lifetime plan. Amounts in MXN at checkout.',
      help_premium_fedi: 'If you use Fedi, payment is made directly from your integrated wallet.',
      help_premium_restore: 'If you switch devices, use <strong>"Restore purchase"</strong> (works in the same browser).',
      help_aureo_title: 'Buy Bitcoin with Aureo (Mexico only)',
      help_aureo_desc: 'The <strong>"Buy Bitcoin on Aureo"</strong> button takes you to the Aureo platform where you can buy BTC with Mexican pesos.',
      help_aureo_condition: 'Only appears if your currency is set to MXN.',
      help_aureo_platform: 'Aureo is a regulated platform in Mexico for buying and selling Bitcoin.',
      help_calendar_title: 'Savings reminder',
      help_calendar_desc: 'The <strong>"📅 Savings reminder"</strong> button creates a recurring event in Google Calendar.',
      help_calendar_freq: 'It reminds you to make your contribution based on the frequency you chose (daily, weekly, monthly).',
      help_calendar_privacy: 'You don\'t need to give your email or create an account. It opens directly in your calendar.',
      help_coingecko_title: 'Bitcoin price alert',
      help_cg_step1: '<strong>1.</strong> Create a free account on CoinGecko (or sign in).',
      help_cg_step2: '<strong>2.</strong> Search for "Bitcoin" in the search bar.',
      help_cg_step3: '<strong>3.</strong> On the Bitcoin page, click the bell icon / "Price Alert".',
      help_cg_step4: '<strong>4.</strong> Set your target price (above or below the current price).',
      help_cg_step5: '<strong>5.</strong> Enable the email notification.',
      help_cg_step6: '<strong>6.</strong> Done — you\'ll receive an email when BTC reaches your price.',
      help_cg_note: 'It\'s an external and free service. We don\'t store your information.',
      help_glossary_title: 'Glossary',
      help_g_btc: '<strong>BTC:</strong> Bitcoin, the decentralized digital currency.',
      help_g_sats: '<strong>sats (satoshis):</strong> the smallest unit of Bitcoin. 1 BTC = 100,000,000 sats.',
      help_g_ln: '<strong>Lightning Network:</strong> instant and cheap payment network on top of Bitcoin.',
      help_g_webln: '<strong>WebLN:</strong> protocol that connects your Lightning wallet with web apps.',
      help_g_nostr: '<strong>Nostr:</strong> decentralized identity and messaging protocol.',
      help_g_swr: '<strong>SWR:</strong> Safe Withdrawal Rate — safe withdrawal rate (4% annual).',
      help_g_inflation: '<strong>Inflation:</strong> the loss of purchasing power of a currency over time.',
      help_g_fedi: '<strong>Fedi:</strong> community Bitcoin platform with wallets and mini apps.',
      help_v2_note: 'In version 2 you\'ll have a chat assistant to answer your questions instantly.',
      footer_made: 'Made with ₿ for the',
      footer_disclaimer: 'Calculations are educational projections, not financial advice.',
      return_info_toggle: 'Which return to choose?',
      return_info_4y: 'Last 4 years (2021–2025): ~30% annual',
      return_info_8y: 'Last 8 years (2017–2025): ~25% annual',
      return_info_12y: 'Last 12 years (2013–2025): ~60% annual',
      return_info_disclaimer: 'Past performance does not guarantee future results.',
      return_info_suggestion: 'A range of 5%–15% is reasonable for long-term conservative projections.',
      toast_premium: '⚡ Premium activated. Enjoy all the tools!',
      toast_no_wallet: 'No Lightning wallet detected. Use Fedi or a compatible wallet.',
      toast_payment_cancel: 'Payment cancelled',
      toast_payment_error: 'Payment error. Try again.',
      toast_restored: 'Purchase restored successfully.',
      toast_no_purchase: 'No previous purchase found on this device.',
      toast_saved: '💾 Plan saved successfully',
      toast_no_plans: 'No saved plans',
      toast_loaded: '📂 Plan from {date} loaded',
      toast_pdf: '📄 PDF exported',
      toast_copied: 'Result copied to clipboard',
      payment_generating: 'Generating Lightning invoice...',
      payment_scan_or_copy: 'Scan the QR or copy the invoice to pay',
      payment_copy_invoice: 'Copy invoice',
      payment_copied: 'Copied!',
      payment_waiting: 'Waiting for payment confirmation...',
      payment_success: 'Payment confirmed! Premium activated.',
      payment_timeout: 'Invoice expired. Try again.',
      payment_retry: 'Retry',
      share_text: '📊 My Bitcoin retirement plan:\nIn {years} years I could have {btc} ({fiat}).\n\nCalculate yours! 👉 [Bitcoin Retirement - Fedi Mini App]',
      chart_balance: 'Balance',
      chart_invested: 'Invested',
      chart_year: 'Year',
      chart_remaining: 'Remaining balance',
      coingecko_confirm: 'You are about to leave the calculator to go to CoinGecko to set up price alerts.\n\nYour progress is saved.\n\nContinue?',
      calendar_title_tpl: 'Bitcoin contribution: {amount} {currency} ({freq})',
      calendar_details_tpl: 'Remember to make your {freq} contribution of {amount} {currency} to your Bitcoin retirement plan.',
      freq_label_daily: 'daily',
      freq_label_weekly: 'weekly',
      freq_label_monthly: 'monthly',
      pdf_title: 'Bitcoin Retirement Calculator',
      pdf_generated: 'Generated:',
      pdf_btc_price: 'BTC Price:',
      pdf_params: 'Parameters',
      pdf_initial: 'Initial savings:',
      pdf_monthly: 'Monthly contribution:',
      pdf_horizon: 'Horizon:',
      pdf_return: 'Annual return:',
      pdf_inflation: 'Inflation:',
      pdf_results: 'Results',
      pdf_final: 'Final balance:',
      pdf_equivalent: 'Equivalent:',
      pdf_invested: 'Total invested:',
      pdf_gain: 'Net gain:',
      pdf_real_power: 'Real purchasing power:',
      pdf_projection: 'Annual projection',
      pdf_year: 'Year',
      pdf_balance: 'Balance',
      pdf_gain_col: 'Gain',
      pdf_disclaimer: 'Calculations are educational projections, not financial advice.',
      pdf_footer: 'Generated with Bitcoin Retirement Calculator – Fedi Mini App',
    },
    pt: {
      lang_label: 'Idioma',
      logo_text: 'Aposentadoria Bitcoin',
      tagline: 'Planeje sua independência financeira com Bitcoin',
      env_fedi: '⚡ Conectado ao Fedi',
      env_webln: '⚡ Lightning Wallet detectada',
      calc_title: 'Seu plano de aposentadoria',
      label_initial: 'Poupança inicial',
      label_contribution: 'Contribuição periódica',
      freq_monthly: 'Mensal',
      freq_weekly: 'Semanal',
      freq_daily: 'Diário',
      label_years: 'Horizonte de tempo:',
      years_unit: 'anos',
      label_return: 'Retorno anual esperado:',
      range_conservative: '3% conservador',
      range_aggressive: '30% agressivo',
      label_inflation: 'Inflação anual local (opcional):',
      btn_calculate: 'Calcular minha aposentadoria',
      results_title: 'Sua projeção',
      res_btc_label: 'Saldo final em BTC',
      res_fiat_label: 'Equivalente em',
      res_invested_label: 'Total investido',
      res_gain_label: 'Ganho líquido',
      res_real_label: 'Poder de compra real',
      btn_share: 'Compartilhar resultado',
      btn_premium_cta: '⚡ Desbloquear Premium',
      aureo_title: '🇲🇽 Compre Bitcoin com pesos',
      aureo_desc: 'Comece seu plano de poupança comprando BTC na Aureo, a plataforma para o México.',
      aureo_btn: 'Comprar Bitcoin na Aureo →',
      tools_title: 'Ferramentas para seu plano',
      tool_calendar_title: 'Lembrete de poupança',
      tool_calendar_desc: 'Adicione um evento recorrente ao Google Calendar',
      tool_coingecko_title: 'Alerta de preço BTC',
      tool_coingecko_desc: 'Configure alertas grátis no CoinGecko',
      scenarios_title: 'Comparação de cenários',
      scenario_conservative: '🐢 Conservador',
      scenario_moderate: '⚖️ Moderado',
      scenario_aggressive: '🚀 Agressivo',
      withdrawal_title: 'Simulação de retirada (SWR 4%)',
      res_swr_annual: 'Retirada anual segura',
      res_swr_monthly: 'Retirada mensal',
      res_swr_years: 'Anos de aposentadoria sustentável',
      premium_tools_title: 'Ferramentas Premium',
      btn_save: '💾 Salvar plano',
      btn_export_pdf: '📄 Exportar PDF',
      btn_load: '📂 Carregar plano salvo',
      modal_premium_title: '⚡ Desbloqueie Premium',
      price_mp_monthly: 'Mensal (MXN no checkout)',
      price_mp_lifetime: 'Pagamento único / vitalício (MXN no checkout)',
      modal_premium_desc: 'Acesse todas as ferramentas para planejar sua aposentadoria como um profissional.',
      pf_scenarios: 'Comparar 3 cenários lado a lado',
      pf_swr: 'Simulação de retirada (SWR 4%)',
      pf_save: 'Salvar planos com criptografia local',
      pf_pdf: 'Exportar relatório PDF profissional',
      pf_no_ads: 'Sem anúncios, suporte prioritário',
      plan_monthly: 'Plano mensal — Mercado Pago',
      plan_lifetime: 'Vitalício — Mercado Pago',
      btn_restore: 'Restaurar compra anterior',
      modal_payment_note: 'Pagamento com Mercado Pago',
      help_title: '📖 Guia do usuário',
      help_calc_title: 'Como usar a calculadora',
      help_calc_initial: '<strong>Poupança inicial:</strong> quanto você tem hoje para começar. Pode colocar em USD, MXN, BTC ou sats.',
      help_calc_contribution: '<strong>Contribuição periódica:</strong> quanto vai adicionar cada dia, semana ou mês ao seu plano.',
      help_calc_horizon: '<strong>Horizonte:</strong> quantos anos planeja poupar. Mova o slider de 1 a 50 anos.',
      help_calc_return: '<strong>Retorno:</strong> quanto espera que seu investimento cresça por ano. 3% é conservador, 10% moderado, 30% agressivo.',
      help_calc_inflation: '<strong>Inflação:</strong> quanto sua moeda local perde valor por ano. Mostra o poder de compra real da sua poupança.',
      help_calc_action: 'Pressione <strong>"Calcular minha aposentadoria"</strong> para ver sua projeção com gráfico interativo.',
      help_results_title: 'Como ler os resultados',
      help_res_btc: '<strong>Saldo final em BTC:</strong> quanto Bitcoin você teria ao final do período.',
      help_res_fiat: '<strong>Equivalente na sua moeda:</strong> o valor em USD ou MXN ao preço atual do BTC.',
      help_res_invested: '<strong>Total investido:</strong> quanto dinheiro você colocou no total (poupança inicial + todas as contribuições).',
      help_res_gain: '<strong>Ganho líquido:</strong> a diferença entre o que teria e o que investiu. Em verde.',
      help_res_real: '<strong>Poder de compra real:</strong> seu saldo ajustado pela inflação — o que realmente poderia comprar com esse dinheiro.',
      help_scenarios_title: 'Comparação de cenários (Premium)',
      help_scenarios_desc: 'O app gera 3 projeções automáticas com diferentes retornos:',
      help_scenarios_cons: '<strong>🐢 Conservador:</strong> metade do retorno que você escolheu.',
      help_scenarios_mod: '<strong>⚖️ Moderado:</strong> o retorno que você escolheu.',
      help_scenarios_agg: '<strong>🚀 Agressivo:</strong> 1.5x o retorno que você escolheu.',
      help_scenarios_chart: 'O gráfico compara os 3 lado a lado para que veja o leque de possibilidades.',
      help_swr_title: 'Simulação de retirada — regra dos 4% (Premium)',
      help_swr_desc: 'O <strong>SWR</strong> (Safe Withdrawal Rate) é uma regra clássica: você pode retirar 4% do seu saldo a cada ano sem ficar sem dinheiro.',
      help_swr_calc: 'O app calcula quanto poderia retirar por ano e por mês.',
      help_swr_chart: 'O gráfico de barras mostra quantos anos seu dinheiro dura se retirar esse valor fixo. Verde = saudável, vermelho = zona de risco.',
      help_save_title: 'Salvar plano e exportar PDF (Premium)',
      help_save_save: '<strong>💾 Salvar plano:</strong> armazena seus parâmetros no seu dispositivo. Pode salvar até 10 planos.',
      help_save_load: '<strong>📂 Carregar plano:</strong> restaura o último plano salvo com todos os campos.',
      help_save_pdf: '<strong>📄 Exportar PDF:</strong> gera um relatório profissional baixável com dados, tabela anual e parâmetros.',
      help_premium_title: 'Como ativar Premium',
      help_premium_btn: 'Pressione <strong>"⚡ Desbloquear Premium"</strong> para ver os planos.',
      help_premium_prices: 'Pague com <strong>Mercado Pago</strong>: plano mensal ou vitalício. Valores em MXN no checkout.',
      help_premium_fedi: 'Se usa Fedi, o pagamento é feito diretamente da sua wallet integrada.',
      help_premium_restore: 'Se trocar de dispositivo, use <strong>"Restaurar compra"</strong> (funciona no mesmo navegador).',
      help_aureo_title: 'Comprar Bitcoin com Aureo (só México)',
      help_aureo_desc: 'O botão <strong>"Comprar Bitcoin na Aureo"</strong> leva à plataforma Aureo onde pode comprar BTC com pesos mexicanos.',
      help_aureo_condition: 'Só aparece se sua moeda estiver configurada em MXN.',
      help_aureo_platform: 'Aureo é uma plataforma regulada no México para compra e venda de Bitcoin.',
      help_calendar_title: 'Lembrete de poupança',
      help_calendar_desc: 'O botão <strong>"📅 Lembrete de poupança"</strong> cria um evento recorrente no Google Calendar.',
      help_calendar_freq: 'Lembra você de fazer sua contribuição na frequência escolhida (diário, semanal, mensal).',
      help_calendar_privacy: 'Não precisa dar seu email nem criar conta. Abre direto no seu calendário.',
      help_coingecko_title: 'Alerta de preço Bitcoin',
      help_cg_step1: '<strong>1.</strong> Crie uma conta gratuita no CoinGecko (ou faça login).',
      help_cg_step2: '<strong>2.</strong> Busque "Bitcoin" na barra de pesquisa.',
      help_cg_step3: '<strong>3.</strong> Na página do Bitcoin, clique no ícone de sino / "Price Alert".',
      help_cg_step4: '<strong>4.</strong> Configure o preço alvo (acima ou abaixo do preço atual).',
      help_cg_step5: '<strong>5.</strong> Ative a notificação por email.',
      help_cg_step6: '<strong>6.</strong> Pronto — receberá um email quando o BTC atingir seu preço.',
      help_cg_note: 'É um serviço externo e gratuito. Não armazenamos suas informações.',
      help_glossary_title: 'Glossário',
      help_g_btc: '<strong>BTC:</strong> Bitcoin, a moeda digital descentralizada.',
      help_g_sats: '<strong>sats (satoshis):</strong> a menor unidade do Bitcoin. 1 BTC = 100.000.000 sats.',
      help_g_ln: '<strong>Lightning Network:</strong> rede de pagamentos instantâneos e baratos sobre Bitcoin.',
      help_g_webln: '<strong>WebLN:</strong> protocolo que conecta sua wallet Lightning com aplicações web.',
      help_g_nostr: '<strong>Nostr:</strong> protocolo descentralizado de identidade e mensagens.',
      help_g_swr: '<strong>SWR:</strong> Safe Withdrawal Rate — taxa segura de retirada (4% anual).',
      help_g_inflation: '<strong>Inflação:</strong> a perda de poder de compra de uma moeda ao longo do tempo.',
      help_g_fedi: '<strong>Fedi:</strong> plataforma comunitária de Bitcoin com wallets e mini apps.',
      help_v2_note: 'Na versão 2 terá um assistente de chat para resolver suas dúvidas instantaneamente.',
      footer_made: 'Feito com ₿ para a comunidade',
      footer_disclaimer: 'Os cálculos são projeções educacionais, não assessoria financeira.',
      return_info_toggle: 'Qual retorno escolher?',
      return_info_4y: 'Últimos 4 anos (2021–2025): ~30% anual',
      return_info_8y: 'Últimos 8 anos (2017–2025): ~25% anual',
      return_info_12y: 'Últimos 12 anos (2013–2025): ~60% anual',
      return_info_disclaimer: 'O desempenho passado não garante resultados futuros.',
      return_info_suggestion: 'Uma faixa de 5%–15% é razoável para projeções conservadoras de longo prazo.',
      toast_premium: '⚡ Premium ativado. Aproveite todas as ferramentas!',
      toast_no_wallet: 'Nenhuma wallet Lightning detectada. Use Fedi ou uma wallet compatível.',
      toast_payment_cancel: 'Pagamento cancelado',
      toast_payment_error: 'Erro no pagamento. Tente novamente.',
      toast_restored: 'Compra restaurada com sucesso.',
      toast_no_purchase: 'Nenhuma compra anterior encontrada neste dispositivo.',
      toast_saved: '💾 Plano salvo com sucesso',
      toast_no_plans: 'Nenhum plano salvo',
      toast_loaded: '📂 Plano de {date} carregado',
      toast_pdf: '📄 PDF exportado',
      toast_copied: 'Resultado copiado para a área de transferência',
      payment_generating: 'Gerando invoice Lightning...',
      payment_scan_or_copy: 'Escaneie o QR ou copie a invoice para pagar',
      payment_copy_invoice: 'Copiar invoice',
      payment_copied: 'Copiado!',
      payment_waiting: 'Aguardando confirmação de pagamento...',
      payment_success: 'Pagamento confirmado! Premium ativado.',
      payment_timeout: 'A invoice expirou. Tente novamente.',
      payment_retry: 'Tentar novamente',
      share_text: '📊 Meu plano de aposentadoria com Bitcoin:\nEm {years} anos poderia ter {btc} ({fiat}).\n\nCalcule o seu! 👉 [Aposentadoria Bitcoin - Fedi Mini App]',
      chart_balance: 'Saldo',
      chart_invested: 'Investido',
      chart_year: 'Ano',
      chart_remaining: 'Saldo restante',
      coingecko_confirm: 'Você vai sair da calculadora para o CoinGecko para configurar alertas de preço.\n\nSeu progresso está salvo.\n\nContinuar?',
      calendar_title_tpl: 'Contribuição Bitcoin: {amount} {currency} ({freq})',
      calendar_details_tpl: 'Lembre de fazer sua contribuição {freq} de {amount} {currency} ao seu plano de aposentadoria Bitcoin.',
      freq_label_daily: 'diário',
      freq_label_weekly: 'semanal',
      freq_label_monthly: 'mensal',
      pdf_title: 'Calculadora de Aposentadoria Bitcoin',
      pdf_generated: 'Gerado:',
      pdf_btc_price: 'Preço BTC:',
      pdf_params: 'Parâmetros',
      pdf_initial: 'Poupança inicial:',
      pdf_monthly: 'Contribuição mensal:',
      pdf_horizon: 'Horizonte:',
      pdf_return: 'Retorno anual:',
      pdf_inflation: 'Inflação:',
      pdf_results: 'Resultados',
      pdf_final: 'Saldo final:',
      pdf_equivalent: 'Equivalente:',
      pdf_invested: 'Total investido:',
      pdf_gain: 'Ganho líquido:',
      pdf_real_power: 'Poder de compra real:',
      pdf_projection: 'Projeção anual',
      pdf_year: 'Ano',
      pdf_balance: 'Saldo',
      pdf_gain_col: 'Ganho',
      pdf_disclaimer: 'Os cálculos são projeções educacionais, não assessoria financeira.',
      pdf_footer: 'Gerado com Calculadora de Aposentadoria Bitcoin – Fedi Mini App',
    },
    fr: {
      lang_label: 'Langue',
      logo_text: 'Retraite Bitcoin',
      tagline: 'Planifiez votre indépendance financière avec Bitcoin',
      env_fedi: '⚡ Connecté à Fedi',
      env_webln: '⚡ Lightning Wallet détecté',
      calc_title: 'Votre plan de retraite',
      label_initial: 'Épargne initiale',
      label_contribution: 'Contribution périodique',
      freq_monthly: 'Mensuel',
      freq_weekly: 'Hebdomadaire',
      freq_daily: 'Quotidien',
      label_years: 'Horizon temporel :',
      years_unit: 'ans',
      label_return: 'Rendement annuel attendu :',
      range_conservative: '3% conservateur',
      range_aggressive: '30% agressif',
      label_inflation: 'Inflation annuelle locale (optionnel) :',
      btn_calculate: 'Calculer ma retraite',
      results_title: 'Votre projection',
      res_btc_label: 'Solde final en BTC',
      res_fiat_label: 'Équivalent en',
      res_invested_label: 'Total investi',
      res_gain_label: 'Gain net',
      res_real_label: 'Pouvoir d\'achat réel',
      btn_share: 'Partager le résultat',
      btn_premium_cta: '⚡ Débloquer Premium',
      aureo_title: '🇲🇽 Achetez du Bitcoin avec des pesos',
      aureo_desc: 'Commencez votre plan d\'épargne en achetant du BTC sur Aureo, la plateforme pour le Mexique.',
      aureo_btn: 'Acheter du Bitcoin sur Aureo →',
      tools_title: 'Outils pour votre plan',
      tool_calendar_title: 'Rappel d\'épargne',
      tool_calendar_desc: 'Ajoutez un événement récurrent à Google Calendar',
      tool_coingecko_title: 'Alerte de prix BTC',
      tool_coingecko_desc: 'Configurez des alertes gratuites sur CoinGecko',
      scenarios_title: 'Comparaison de scénarios',
      scenario_conservative: '🐢 Conservateur',
      scenario_moderate: '⚖️ Modéré',
      scenario_aggressive: '🚀 Agressif',
      withdrawal_title: 'Simulation de retrait (SWR 4%)',
      res_swr_annual: 'Retrait annuel sûr',
      res_swr_monthly: 'Retrait mensuel',
      res_swr_years: 'Années de retraite durables',
      premium_tools_title: 'Outils Premium',
      btn_save: '💾 Sauvegarder le plan',
      btn_export_pdf: '📄 Exporter PDF',
      btn_load: '📂 Charger un plan sauvegardé',
      modal_premium_title: '⚡ Débloquez Premium',
      price_mp_monthly: 'Mensuel (MXN au paiement)',
      price_mp_lifetime: 'Paiement unique / à vie (MXN au paiement)',
      modal_premium_desc: 'Accédez à tous les outils pour planifier votre retraite comme un pro.',
      pf_scenarios: 'Comparer 3 scénarios côte à côte',
      pf_swr: 'Simulation de retrait (SWR 4%)',
      pf_save: 'Sauvegarder les plans avec chiffrement local',
      pf_pdf: 'Exporter un rapport PDF professionnel',
      pf_no_ads: 'Sans publicité, support prioritaire',
      plan_monthly: 'Forfait mensuel — Mercado Pago',
      plan_lifetime: 'À vie — Mercado Pago',
      btn_restore: 'Restaurer un achat précédent',
      modal_payment_note: 'Paiement avec Mercado Pago',
      help_title: '📖 Guide utilisateur',
      help_calc_title: 'Comment utiliser la calculatrice',
      help_calc_initial: '<strong>Épargne initiale :</strong> combien vous avez aujourd\'hui pour commencer. Vous pouvez l\'indiquer en USD, MXN, BTC ou sats.',
      help_calc_contribution: '<strong>Contribution périodique :</strong> combien vous allez ajouter chaque jour, semaine ou mois à votre plan.',
      help_calc_horizon: '<strong>Horizon :</strong> combien d\'années vous prévoyez d\'épargner. Déplacez le curseur de 1 à 50 ans.',
      help_calc_return: '<strong>Rendement :</strong> combien vous espérez que votre investissement croisse par an. 3% est conservateur, 10% modéré, 30% agressif.',
      help_calc_inflation: '<strong>Inflation :</strong> combien votre monnaie locale perd de valeur par an. Montre le pouvoir d\'achat réel de votre épargne.',
      help_calc_action: 'Appuyez sur <strong>"Calculer ma retraite"</strong> pour voir votre projection avec un graphique interactif.',
      help_results_title: 'Comment lire les résultats',
      help_res_btc: '<strong>Solde final en BTC :</strong> combien de Bitcoin vous auriez à la fin de la période.',
      help_res_fiat: '<strong>Équivalent dans votre monnaie :</strong> la valeur en USD ou MXN au prix actuel du BTC.',
      help_res_invested: '<strong>Total investi :</strong> combien d\'argent vous avez mis au total (épargne initiale + toutes vos contributions).',
      help_res_gain: '<strong>Gain net :</strong> la différence entre ce que vous auriez et ce que vous avez investi. En vert.',
      help_res_real: '<strong>Pouvoir d\'achat réel :</strong> votre solde ajusté par l\'inflation — ce que vous pourriez réellement acheter avec cet argent.',
      help_scenarios_title: 'Comparaison de scénarios (Premium)',
      help_scenarios_desc: 'L\'app génère 3 projections automatiques avec différents rendements :',
      help_scenarios_cons: '<strong>🐢 Conservateur :</strong> la moitié du rendement que vous avez choisi.',
      help_scenarios_mod: '<strong>⚖️ Modéré :</strong> le rendement que vous avez choisi.',
      help_scenarios_agg: '<strong>🚀 Agressif :</strong> 1.5x le rendement que vous avez choisi.',
      help_scenarios_chart: 'Le graphique compare les 3 côte à côte pour voir l\'éventail des possibilités.',
      help_swr_title: 'Simulation de retrait — règle des 4% (Premium)',
      help_swr_desc: 'Le <strong>SWR</strong> (Safe Withdrawal Rate) est une règle classique : vous pouvez retirer 4% de votre solde chaque année sans manquer d\'argent.',
      help_swr_calc: 'L\'app calcule combien vous pourriez retirer par an et par mois.',
      help_swr_chart: 'Le graphique à barres montre combien d\'années votre argent dure si vous retirez ce montant fixe. Vert = sain, rouge = zone de risque.',
      help_save_title: 'Sauvegarder le plan et exporter PDF (Premium)',
      help_save_save: '<strong>💾 Sauvegarder :</strong> stocke vos paramètres sur votre appareil. Vous pouvez sauvegarder jusqu\'à 10 plans.',
      help_save_load: '<strong>📂 Charger :</strong> restaure le dernier plan sauvegardé avec tous les champs.',
      help_save_pdf: '<strong>📄 Exporter PDF :</strong> génère un rapport professionnel téléchargeable avec données, tableau annuel et paramètres.',
      help_premium_title: 'Comment activer Premium',
      help_premium_btn: 'Appuyez sur <strong>"⚡ Débloquer Premium"</strong> pour voir les plans.',
      help_premium_prices: 'Payez avec <strong>Mercado Pago</strong> : forfait mensuel ou à vie. Montants en MXN au paiement.',
      help_premium_fedi: 'Si vous utilisez Fedi, le paiement se fait directement depuis votre wallet intégré.',
      help_premium_restore: 'Si vous changez d\'appareil, utilisez <strong>"Restaurer un achat"</strong> (fonctionne dans le même navigateur).',
      help_aureo_title: 'Acheter du Bitcoin avec Aureo (Mexique uniquement)',
      help_aureo_desc: 'Le bouton <strong>"Acheter du Bitcoin sur Aureo"</strong> vous emmène sur la plateforme Aureo où vous pouvez acheter du BTC avec des pesos mexicains.',
      help_aureo_condition: 'Apparaît uniquement si votre monnaie est réglée sur MXN.',
      help_aureo_platform: 'Aureo est une plateforme réglementée au Mexique pour l\'achat et la vente de Bitcoin.',
      help_calendar_title: 'Rappel d\'épargne',
      help_calendar_desc: 'Le bouton <strong>"📅 Rappel d\'épargne"</strong> crée un événement récurrent dans Google Calendar.',
      help_calendar_freq: 'Il vous rappelle de faire votre contribution selon la fréquence choisie (quotidien, hebdomadaire, mensuel).',
      help_calendar_privacy: 'Pas besoin de donner votre email ni de créer un compte. S\'ouvre directement dans votre calendrier.',
      help_coingecko_title: 'Alerte de prix Bitcoin',
      help_cg_step1: '<strong>1.</strong> Créez un compte gratuit sur CoinGecko (ou connectez-vous).',
      help_cg_step2: '<strong>2.</strong> Cherchez "Bitcoin" dans la barre de recherche.',
      help_cg_step3: '<strong>3.</strong> Sur la page Bitcoin, cliquez sur l\'icône cloche / "Price Alert".',
      help_cg_step4: '<strong>4.</strong> Configurez le prix cible (au-dessus ou en dessous du prix actuel).',
      help_cg_step5: '<strong>5.</strong> Activez la notification par email.',
      help_cg_step6: '<strong>6.</strong> C\'est fait — vous recevrez un email quand BTC atteindra votre prix.',
      help_cg_note: 'C\'est un service externe et gratuit. Nous ne stockons pas vos informations.',
      help_glossary_title: 'Glossaire',
      help_g_btc: '<strong>BTC :</strong> Bitcoin, la monnaie numérique décentralisée.',
      help_g_sats: '<strong>sats (satoshis) :</strong> la plus petite unité de Bitcoin. 1 BTC = 100 000 000 sats.',
      help_g_ln: '<strong>Lightning Network :</strong> réseau de paiements instantanés et bon marché sur Bitcoin.',
      help_g_webln: '<strong>WebLN :</strong> protocole qui connecte votre wallet Lightning avec des applications web.',
      help_g_nostr: '<strong>Nostr :</strong> protocole décentralisé d\'identité et de messagerie.',
      help_g_swr: '<strong>SWR :</strong> Safe Withdrawal Rate — taux de retrait sûr (4% annuel).',
      help_g_inflation: '<strong>Inflation :</strong> la perte de pouvoir d\'achat d\'une monnaie au fil du temps.',
      help_g_fedi: '<strong>Fedi :</strong> plateforme communautaire Bitcoin avec wallets et mini apps.',
      help_v2_note: 'Dans la version 2, vous aurez un assistant chat pour résoudre vos questions instantanément.',
      footer_made: 'Fait avec ₿ pour la communauté',
      footer_disclaimer: 'Les calculs sont des projections éducatives, pas des conseils financiers.',
      return_info_toggle: 'Quel rendement choisir ?',
      return_info_4y: '4 dernières années (2021–2025) : ~30% annuel',
      return_info_8y: '8 dernières années (2017–2025) : ~25% annuel',
      return_info_12y: '12 dernières années (2013–2025) : ~60% annuel',
      return_info_disclaimer: 'Les performances passées ne garantissent pas les résultats futurs.',
      return_info_suggestion: 'Une fourchette de 5%–15% est raisonnable pour des projections conservatrices à long terme.',
      toast_premium: '⚡ Premium activé. Profitez de tous les outils !',
      toast_no_wallet: 'Aucun wallet Lightning détecté. Utilisez Fedi ou un wallet compatible.',
      toast_payment_cancel: 'Paiement annulé',
      toast_payment_error: 'Erreur de paiement. Réessayez.',
      toast_restored: 'Achat restauré avec succès.',
      toast_no_purchase: 'Aucun achat précédent trouvé sur cet appareil.',
      toast_saved: '💾 Plan sauvegardé avec succès',
      toast_no_plans: 'Aucun plan sauvegardé',
      toast_loaded: '📂 Plan du {date} chargé',
      toast_pdf: '📄 PDF exporté',
      toast_copied: 'Résultat copié dans le presse-papiers',
      payment_generating: 'Génération de la facture Lightning...',
      payment_scan_or_copy: 'Scannez le QR ou copiez la facture pour payer',
      payment_copy_invoice: 'Copier la facture',
      payment_copied: 'Copié !',
      payment_waiting: 'En attente de la confirmation du paiement...',
      payment_success: 'Paiement confirmé ! Premium activé.',
      payment_timeout: 'La facture a expiré. Réessayez.',
      payment_retry: 'Réessayer',
      share_text: '📊 Mon plan de retraite Bitcoin :\nDans {years} ans je pourrais avoir {btc} ({fiat}).\n\nCalculez le vôtre ! 👉 [Retraite Bitcoin - Fedi Mini App]',
      chart_balance: 'Solde',
      chart_invested: 'Investi',
      chart_year: 'Année',
      chart_remaining: 'Solde restant',
      coingecko_confirm: 'Vous allez quitter la calculatrice pour aller sur CoinGecko afin de configurer des alertes de prix.\n\nVotre progression est sauvegardée.\n\nContinuer ?',
      calendar_title_tpl: 'Contribution Bitcoin : {amount} {currency} ({freq})',
      calendar_details_tpl: 'N\'oubliez pas votre contribution {freq} de {amount} {currency} à votre plan de retraite Bitcoin.',
      freq_label_daily: 'quotidien',
      freq_label_weekly: 'hebdomadaire',
      freq_label_monthly: 'mensuel',
      pdf_title: 'Calculatrice de Retraite Bitcoin',
      pdf_generated: 'Généré :',
      pdf_btc_price: 'Prix BTC :',
      pdf_params: 'Paramètres',
      pdf_initial: 'Épargne initiale :',
      pdf_monthly: 'Contribution mensuelle :',
      pdf_horizon: 'Horizon :',
      pdf_return: 'Rendement annuel :',
      pdf_inflation: 'Inflation :',
      pdf_results: 'Résultats',
      pdf_final: 'Solde final :',
      pdf_equivalent: 'Équivalent :',
      pdf_invested: 'Total investi :',
      pdf_gain: 'Gain net :',
      pdf_real_power: 'Pouvoir d\'achat réel :',
      pdf_projection: 'Projection annuelle',
      pdf_year: 'Année',
      pdf_balance: 'Solde',
      pdf_gain_col: 'Gain',
      pdf_disclaimer: 'Les calculs sont des projections éducatives, pas des conseils financiers.',
      pdf_footer: 'Généré avec Calculatrice de Retraite Bitcoin – Fedi Mini App',
    },
  };

  let currentLang = 'es';

  function t(key) {
    return (LANG[currentLang] && LANG[currentLang][key]) || LANG.es[key] || key;
  }

  // ─── State ────────────────────────────────────────────────
  const state = {
    btcPrice: { usd: 65000, mxn: 1100000 },
    isFedi: false,
    hasWebLN: false,
    hasNostr: false,
    isPremium: false,
    charts: {},
  };

  // ─── DOM References ───────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    app: $('#app'),
    inputLang: $('#input-lang'),
    btnHelp: $('#btn-help'),
    btnTheme: $('#btn-theme'),
    badgePremium: $('#badge-premium'),
    envBanner: $('#env-banner'),
    inputInitial: $('#input-initial'),
    inputCurrency: $('#input-currency'),
    inputContribution: $('#input-contribution'),
    inputFrequency: $('#input-frequency'),
    inputYears: $('#input-years'),
    inputReturn: $('#input-return'),
    inputInflation: $('#input-inflation'),
    yearsDisplay: $('#years-display'),
    returnDisplay: $('#return-display'),
    inflationDisplay: $('#inflation-display'),
    btnCalculate: $('#btn-calculate'),
    results: $('#results'),
    resBtc: $('#res-btc'),
    resFiat: $('#res-fiat'),
    resCurrencyLabel: $('#res-currency-label'),
    resInvested: $('#res-invested'),
    resGain: $('#res-gain'),
    resReal: $('#res-real'),
    resInflationBox: $('#res-inflation-box'),
    chartProjection: $('#chart-projection'),
    btnShare: $('#btn-share'),
    btnPremiumCta: $('#btn-premium-cta'),
    aureoCta: $('#aureo-cta'),
    aureoLink: $('#aureo-link'),
    toolsSection: $('#tools-section'),
    btnCalendar: $('#btn-calendar'),
    btnCoingecko: $('#btn-coingecko'),
    returnContext: $('#return-context'),
    premiumScenarios: $('#premium-scenarios'),
    premiumWithdrawal: $('#premium-withdrawal'),
    premiumActions: $('#premium-actions'),
    chartScenarios: $('#chart-scenarios'),
    chartWithdrawal: $('#chart-withdrawal'),
    resSWRAnnual: $('#res-swr-annual'),
    resSWRMonthly: $('#res-swr-monthly'),
    resSWRYears: $('#res-swr-years'),
    modalPremium: $('#modal-premium'),
    modalClose: $('#modal-close'),
    modalHelp: $('#modal-help'),
    helpClose: $('#help-close'),
    btnPayMonthly: $('#btn-pay-monthly'),
    btnPayLifetime: $('#btn-pay-lifetime'),
    btnRestore: $('#btn-restore'),
    premiumPlans: $('#premium-plans'),
    premiumFeatures: $('.premium-features'),
    paymentFlow: $('#payment-flow'),
    priceMonthly: $('#price-monthly-sats'),
    priceLifetime: $('#price-lifetime-sats'),
    btnSave: $('#btn-save'),
    btnExportPdf: $('#btn-export-pdf'),
    btnLoad: $('#btn-load'),
  };

  // ─── i18n Apply ─────────────────────────────────────────
  function loadLanguage() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && LANG[saved]) {
      currentLang = saved;
    } else {
      const nav = (navigator.language || '').slice(0, 2);
      if (LANG[nav]) currentLang = nav;
    }
    dom.inputLang.value = currentLang;
    applyLanguage();
  }

  function setLanguage(lang) {
    if (!LANG[lang]) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    applyLanguage();
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t(key) !== key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (t(key) !== key) el.innerHTML = t(key);
    });
  }

  // ─── Init ─────────────────────────────────────────────────
  async function init() {
    loadLanguage();
    detectEnvironment();
    loadTheme();
    await checkMercadoPagoReturn();
    checkPremiumStatus();
    bindEvents();
    await fetchBTCPrice();
    updatePriceTags();
    updateAureoVisibility();
  }

  // ─── Environment Detection ────────────────────────────────
  function detectEnvironment() {
    state.hasWebLN = typeof window.webln !== 'undefined';
    state.hasNostr = typeof window.nostr !== 'undefined';
    state.isFedi = typeof window.fedi !== 'undefined';

    if (state.isFedi) {
      dom.envBanner.textContent = t('env_fedi');
      dom.envBanner.classList.remove('hidden', 'standalone');
      dom.envBanner.classList.add('fedi');
      loadFediPreferences();
    } else if (state.hasWebLN) {
      dom.envBanner.textContent = t('env_webln');
      dom.envBanner.classList.remove('hidden', 'fedi');
      dom.envBanner.classList.add('standalone');
    }
  }

  async function loadFediPreferences() {
    try {
      if (window.fedi && window.fedi.getPreferences) {
        const prefs = await window.fedi.getPreferences();
        if (prefs.currency) {
          dom.inputCurrency.value = prefs.currency;
          updateAureoVisibility();
        }
      }
    } catch (_) {}
  }

  // ─── Theme ────────────────────────────────────────────────
  function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    dom.btnTheme.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ─── Aureo (Mexico Only) ──────────────────────────────────
  function isMexicoUser() {
    const currencyIsMXN = dom.inputCurrency.value === 'MXN';
    const localeIsMX = (navigator.language || '').startsWith('es-MX');
    return currencyIsMXN || localeIsMX;
  }

  function updateAureoVisibility() {
    dom.aureoLink.href = AUREO_REFERRAL_URL;
    if (state.isFedi) {
      dom.aureoLink.removeAttribute('target');
      dom.aureoLink.removeAttribute('rel');
    } else {
      dom.aureoLink.setAttribute('target', '_blank');
      dom.aureoLink.setAttribute('rel', 'noopener');
    }
    if (isMexicoUser()) {
      dom.aureoCta.classList.remove('hidden');
    } else {
      dom.aureoCta.classList.add('hidden');
    }
  }

  // ─── Google Calendar ──────────────────────────────────────
  function buildCalendarURL() {
    const contribution = dom.inputContribution.value || '100';
    const currency = dom.inputCurrency.value;
    const frequency = dom.inputFrequency.value;

    const freqKey = { daily: 'freq_label_daily', weekly: 'freq_label_weekly', monthly: 'freq_label_monthly' }[frequency];
    const freqLabel = t(freqKey);
    const rruleFreq = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY' }[frequency];

    const titleTpl = t('calendar_title_tpl').replace('{amount}', contribution).replace('{currency}', currency).replace('{freq}', freqLabel);
    const detailsTpl = t('calendar_details_tpl').replace('{freq}', freqLabel).replace('{amount}', contribution).replace('{currency}', currency);
    const title = encodeURIComponent(titleTpl);
    const details = encodeURIComponent(`${detailsTpl}\n\n${window.location.href}`);
    const recur = encodeURIComponent(`RRULE:FREQ=${rruleFreq}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=${recur}`;
  }

  function updateCalendarLink() {
    dom.btnCalendar.href = buildCalendarURL();
  }

  // ─── Premium ──────────────────────────────────────────────
  function checkPremiumStatus() {
    try {
      const data = JSON.parse(localStorage.getItem(PREMIUM_KEY));
      if (!data) return;

      if (data.type === 'lifetime') {
        activatePremium();
      } else if (data.type === 'monthly') {
        const expiry = new Date(data.expires);
        if (expiry > new Date()) {
          activatePremium();
        } else {
          localStorage.removeItem(PREMIUM_KEY);
        }
      }
    } catch (_) {
      localStorage.removeItem(PREMIUM_KEY);
    }
  }

  function activatePremium() {
    state.isPremium = true;
    dom.badgePremium.classList.remove('hidden');
    dom.btnPremiumCta?.classList.add('hidden');
  }

  function savePremiumStatus(type) {
    const data = { type, activated: new Date().toISOString() };
    if (type === 'monthly') {
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      data.expires = expires.toISOString();
    }
    localStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
    activatePremium();
    showToast(t('toast_premium'));
  }

  function stripMercadoPagoQueryParams() {
    const url = new URL(window.location.href);
    const keys = [
      'payment_id', 'status', 'collection_status', 'collection_id',
      'external_reference', 'payment_type', 'merchant_order_id',
      'preference_id', 'site_id', 'processing_mode', 'merchant_account_id',
    ];
    keys.forEach((k) => url.searchParams.delete(k));
    const q = url.searchParams.toString();
    window.history.replaceState({}, '', url.pathname + (q ? `?${q}` : '') + url.hash);
  }

  async function checkMercadoPagoReturn() {
    if (!PAYMENT_USE_MERCADOPAGO) return;
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    if (!paymentId) return;

    const status = params.get('status') || params.get('collection_status') || '';
    if (status && status !== 'approved' && status !== 'success') {
      stripMercadoPagoQueryParams();
      return;
    }

    try {
      const resp = await fetch(`${PAYMENT_API}/verify-mp-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId }),
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.plan && (data.plan === 'monthly' || data.plan === 'lifetime')) {
        savePremiumStatus(data.plan);
      }
    } catch (e) {
      console.error('checkMercadoPagoReturn:', e);
    } finally {
      stripMercadoPagoQueryParams();
    }
  }

  async function handlePayment(amountUSD) {
    const type = amountUSD === MONTHLY_PRICE_USD ? 'monthly' : 'lifetime';

    if (PAYMENT_USE_MERCADOPAGO) {
      try {
        showPaymentUI('loading');
        const resp = await fetch(`${PAYMENT_API}/create-preference`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: type }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          console.error('create-preference:', data);
          showPaymentUI('error');
          return;
        }
        const checkoutUrl =
          data.checkout_url || data.init_point || data.sandbox_init_point;
        if (!checkoutUrl) {
          showPaymentUI('error');
          return;
        }
        window.location.href = checkoutUrl;
      } catch (err) {
        console.error('Payment error:', err);
        showPaymentUI('error');
      }
      return;
    }

    const sats = usdToSats(amountUSD);
    try {
      showPaymentUI('loading');
      const { payment_hash, payment_request } = await createInvoice(sats, type);
      showPaymentUI('invoice', payment_request, sats);

      if (state.hasWebLN) {
        try {
          await window.webln.enable();
          await window.webln.sendPayment(payment_request);
        } catch (_) { /* user pays manually via QR */ }
      }

      const paid = await waitForPayment(payment_hash);
      if (paid) {
        savePremiumStatus(type);
        showPaymentUI('success');
        setTimeout(() => {
          closePremiumModal();
          if (dom.results && !dom.results.classList.contains('hidden')) {
            calculate();
          }
        }, 2000);
      } else {
        showPaymentUI('timeout');
      }
    } catch (err) {
      console.error('Payment error:', err);
      showPaymentUI('error');
    }
  }

  function showPaymentUI(status, invoice, sats) {
    const container = dom.paymentFlow;
    if (!container) return;

    dom.premiumPlans.classList.add('hidden');
    dom.premiumFeatures.classList.add('hidden');
    dom.btnRestore.classList.add('hidden');
    container.classList.remove('hidden');

    if (status === 'loading') {
      container.innerHTML = `
        <div class="payment-status">
          <div class="payment-spinner"></div>
          <p>${t('payment_generating')}</p>
        </div>`;
    } else if (status === 'invoice') {
      container.innerHTML = `
        <div class="payment-invoice">
          <p class="payment-amount">${formatNumber(sats)} sats</p>
          <canvas id="payment-qr"></canvas>
          <p class="payment-hint">${t('payment_scan_or_copy')}</p>
          <div class="payment-invoice-str">
            <input type="text" id="invoice-text" value="${invoice}" readonly />
            <button id="btn-copy-invoice" class="btn-secondary">${t('payment_copy_invoice')}</button>
          </div>
          <p class="payment-waiting">${t('payment_waiting')}</p>
        </div>`;

      const canvas = container.querySelector('#payment-qr');
      if (canvas && typeof QRCode !== 'undefined') {
        QRCode.toCanvas(canvas, invoice.toUpperCase(), {
          width: 220,
          margin: 2,
          color: { dark: '#000', light: '#fff' },
        });
      }

      const btnCopy = container.querySelector('#btn-copy-invoice');
      if (btnCopy) {
        btnCopy.addEventListener('click', () => {
          const input = container.querySelector('#invoice-text');
          if (input) {
            navigator.clipboard.writeText(input.value).then(() => {
              btnCopy.textContent = t('payment_copied');
              setTimeout(() => { btnCopy.textContent = t('payment_copy_invoice'); }, 2000);
            });
          }
        });
      }
    } else if (status === 'success') {
      container.innerHTML = `
        <div class="payment-status payment-success">
          <span class="payment-icon">✓</span>
          <p>${t('payment_success')}</p>
        </div>`;
    } else if (status === 'timeout') {
      container.innerHTML = `
        <div class="payment-status">
          <span class="payment-icon timeout">⏱</span>
          <p>${t('payment_timeout')}</p>
          <button class="btn-accent" id="btn-payment-retry">${t('payment_retry')}</button>
        </div>`;
      container.querySelector('#btn-payment-retry')?.addEventListener('click', resetPaymentUI);
    } else if (status === 'error') {
      container.innerHTML = `
        <div class="payment-status">
          <span class="payment-icon error">✗</span>
          <p>${t('toast_payment_error')}</p>
          <button class="btn-accent" id="btn-payment-retry">${t('payment_retry')}</button>
        </div>`;
      container.querySelector('#btn-payment-retry')?.addEventListener('click', resetPaymentUI);
    }
  }

  function resetPaymentUI() {
    if (dom.paymentFlow) {
      dom.paymentFlow.classList.add('hidden');
      dom.paymentFlow.innerHTML = '';
    }
    dom.premiumPlans.classList.remove('hidden');
    dom.premiumFeatures.classList.remove('hidden');
    dom.btnRestore.classList.remove('hidden');
  }

  async function createInvoice(sats, type) {
    const memo = `${t('pdf_title')} – ${type}`;
    const resp = await fetch(`${PAYMENT_API}/create-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: sats, memo }),
    });
    if (!resp.ok) throw new Error('Invoice creation failed');
    return resp.json();
  }

  async function waitForPayment(paymentHash, timeoutMs = 300000) {
    const interval = 3000;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const resp = await fetch(`${PAYMENT_API}/check-payment?hash=${paymentHash}`);
        const data = await resp.json();
        if (data.paid) return true;
      } catch (_) { /* network hiccup, retry */ }
      await new Promise((r) => setTimeout(r, interval));
    }
    return false;
  }

  function restorePurchase() {
    const data = localStorage.getItem(PREMIUM_KEY);
    if (data) {
      checkPremiumStatus();
      if (state.isPremium) {
        showToast(t('toast_restored'));
        closePremiumModal();
        return;
      }
    }
    showToast(t('toast_no_purchase'));
  }

  // ─── BTC Price (cached with 60s TTL + fallback) ──────────
  const BTC_CACHE_KEY = 'btc_price_cache';
  const BTC_CACHE_TTL = 60_000;

  async function fetchBTCPrice() {
    const cached = loadPriceCache();
    if (cached) {
      state.btcPrice.usd = cached.usd;
      state.btcPrice.mxn = cached.mxn;
      return;
    }
    try {
      const resp = await fetch(BTC_PRICE_API);
      const data = await resp.json();
      state.btcPrice.usd = data.bitcoin.usd;
      state.btcPrice.mxn = data.bitcoin.mxn;
      savePriceCache(data.bitcoin.usd, data.bitcoin.mxn);
    } catch (_) {
      const fallback = loadPriceCache(true);
      if (fallback) {
        state.btcPrice.usd = fallback.usd;
        state.btcPrice.mxn = fallback.mxn;
      }
    }
  }

  function savePriceCache(usd, mxn) {
    try {
      localStorage.setItem(BTC_CACHE_KEY, JSON.stringify({ usd, mxn, ts: Date.now() }));
    } catch (_) {}
  }

  function loadPriceCache(ignoreTTL) {
    try {
      const raw = localStorage.getItem(BTC_CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!ignoreTTL && Date.now() - data.ts > BTC_CACHE_TTL) return null;
      return data;
    } catch (_) { return null; }
  }

  function usdToSats(usd) {
    return Math.round((usd / state.btcPrice.usd) * SATS_PER_BTC);
  }

  function updatePriceTags() {
    if (PAYMENT_USE_MERCADOPAGO) {
      dom.priceMonthly.textContent = t('price_mp_monthly');
      dom.priceLifetime.textContent = t('price_mp_lifetime');
      return;
    }
    const monthlySats = usdToSats(MONTHLY_PRICE_USD);
    const lifetimeSats = usdToSats(LIFETIME_PRICE_USD);
    dom.priceMonthly.textContent = `≈ ${formatNumber(monthlySats)} sats`;
    dom.priceLifetime.textContent = `≈ ${formatNumber(lifetimeSats)} sats`;
  }

  // ─── Calculation Engine ───────────────────────────────────
  function getInputs() {
    const currency = dom.inputCurrency.value;
    let initial = parseFloat(dom.inputInitial.value) || 0;
    let contribution = parseFloat(dom.inputContribution.value) || 0;
    const frequency = dom.inputFrequency.value;
    const years = parseInt(dom.inputYears.value);
    const annualReturn = parseFloat(dom.inputReturn.value) / 100;
    const inflation = parseFloat(dom.inputInflation.value) / 100;

    if (currency === 'MXN') {
      initial = initial / (state.btcPrice.mxn / state.btcPrice.usd);
      contribution = contribution / (state.btcPrice.mxn / state.btcPrice.usd);
    } else if (currency === 'BTC') {
      initial = initial * state.btcPrice.usd;
      contribution = contribution * state.btcPrice.usd;
    } else if (currency === 'sats') {
      initial = (initial / SATS_PER_BTC) * state.btcPrice.usd;
      contribution = (contribution / SATS_PER_BTC) * state.btcPrice.usd;
    }

    let monthlyContrib = contribution;
    if (frequency === 'weekly') monthlyContrib = contribution * 4.33;
    if (frequency === 'daily') monthlyContrib = contribution * 30.44;

    return { initial, monthlyContrib, years, annualReturn, inflation, currency };
  }

  function computeProjection(initial, monthlyContrib, years, annualReturn) {
    const monthlyRate = annualReturn / 12;
    const snapshots = [];
    let balance = initial;
    let totalInvested = initial;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + monthlyContrib;
        totalInvested += monthlyContrib;
      }
      snapshots.push({
        year: y,
        balance: Math.round(balance * 100) / 100,
        invested: Math.round(totalInvested * 100) / 100,
        gains: Math.round((balance - totalInvested) * 100) / 100,
      });
    }

    return snapshots;
  }

  function computeWithdrawal(startBalance, annualReturn, swrRate, maxYears) {
    const snapshots = [];
    let balance = startBalance;
    const annualWithdrawal = startBalance * swrRate;

    for (let y = 1; y <= maxYears; y++) {
      balance = balance * (1 + annualReturn) - annualWithdrawal;
      if (balance <= 0) {
        snapshots.push({ year: y, balance: 0 });
        break;
      }
      snapshots.push({ year: y, balance: Math.round(balance * 100) / 100 });
    }

    return { annualWithdrawal, snapshots };
  }

  // ─── Render Results ───────────────────────────────────────
  function calculate() {
    const inputs = getInputs();
    const snapshots = computeProjection(inputs.initial, inputs.monthlyContrib, inputs.years, inputs.annualReturn);
    const last = snapshots[snapshots.length - 1];

    const btcAmount = last.balance / state.btcPrice.usd;
    const displayCurrency = inputs.currency === 'MXN' ? 'MXN' : 'USD';
    const fiatMultiplier = displayCurrency === 'MXN' ? (state.btcPrice.mxn / state.btcPrice.usd) : 1;

    dom.resBtc.textContent = `₿ ${btcAmount.toFixed(4)}`;
    dom.resCurrencyLabel.textContent = displayCurrency;
    dom.resFiat.textContent = formatCurrency(last.balance * fiatMultiplier, displayCurrency);
    dom.resInvested.textContent = formatCurrency(last.invested * fiatMultiplier, displayCurrency);
    dom.resGain.textContent = `+${formatCurrency(last.gains * fiatMultiplier, displayCurrency)}`;

    if (inputs.inflation > 0) {
      const realValue = last.balance / Math.pow(1 + inputs.inflation, inputs.years);
      dom.resReal.textContent = formatCurrency(realValue * fiatMultiplier, displayCurrency);
      dom.resInflationBox.classList.remove('hidden');
    } else {
      dom.resInflationBox.classList.add('hidden');
    }

    renderProjectionChart(snapshots, fiatMultiplier, displayCurrency);

    dom.results.classList.remove('hidden');
    dom.results.classList.add('show');

    updateAureoVisibility();
    updateCalendarLink();
    dom.toolsSection.classList.remove('hidden');

    dom.results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (state.isPremium) {
      renderScenarios(inputs, fiatMultiplier, displayCurrency);
      renderWithdrawal(last.balance, inputs.annualReturn, fiatMultiplier, displayCurrency);
      dom.premiumScenarios.classList.remove('hidden');
      dom.premiumWithdrawal.classList.remove('hidden');
      dom.premiumActions.classList.remove('hidden');
    }
  }

  function renderProjectionChart(snapshots, fiatMul, curr) {
    if (state.charts.projection) state.charts.projection.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#888' : '#666';

    state.charts.projection = new Chart(dom.chartProjection, {
      type: 'line',
      data: {
        labels: snapshots.map((s) => `${t('chart_year')} ${s.year}`),
        datasets: [
          {
            label: `${t('chart_balance')} (${curr})`,
            data: snapshots.map((s) => Math.round(s.balance * fiatMul)),
            borderColor: '#f7931a',
            backgroundColor: 'rgba(247, 147, 26, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            pointHoverRadius: 6,
          },
          {
            label: t('chart_invested'),
            data: snapshots.map((s) => Math.round(s.invested * fiatMul)),
            borderColor: '#666',
            borderDash: [5, 5],
            fill: false,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { labels: { color: textColor, font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y, curr)}`,
            },
          },
        },
        scales: {
          x: { ticks: { color: textColor, maxTicksLimit: 10 }, grid: { color: gridColor } },
          y: { ticks: { color: textColor, callback: (v) => formatCompact(v, curr) }, grid: { color: gridColor } },
        },
      },
    });
  }

  function renderScenarios(inputs, fiatMul, curr) {
    const rates = {
      conservative: Math.max(0.03, inputs.annualReturn * 0.5),
      moderate: inputs.annualReturn,
      aggressive: Math.min(0.30, inputs.annualReturn * 1.5),
    };

    const scenarioData = {};
    const colors = { conservative: '#4fc3f7', moderate: '#f7931a', aggressive: '#ff5252' };

    for (const [key, rate] of Object.entries(rates)) {
      const snaps = computeProjection(inputs.initial, inputs.monthlyContrib, inputs.years, rate);
      const last = snaps[snaps.length - 1];
      scenarioData[key] = { snaps, last, rate };

      const col = $(`#scenario-${key}`);
      col.querySelector('.scenario-return').textContent = `${(rate * 100).toFixed(1)}% anual`;
      col.querySelector('.scenario-btc').textContent = `₿ ${(last.balance / state.btcPrice.usd).toFixed(4)}`;
      col.querySelector('.scenario-fiat').textContent = formatCurrency(last.balance * fiatMul, curr);
    }

    if (state.charts.scenarios) state.charts.scenarios.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#888' : '#666';

    state.charts.scenarios = new Chart(dom.chartScenarios, {
      type: 'line',
      data: {
        labels: scenarioData.moderate.snaps.map((s) => `${t('chart_year')} ${s.year}`),
        datasets: Object.entries(scenarioData).map(([key, d]) => ({
          label: key === 'conservative' ? t('scenario_conservative') : key === 'moderate' ? t('scenario_moderate') : t('scenario_aggressive'),
          data: d.snaps.map((s) => Math.round(s.balance * fiatMul)),
          borderColor: colors[key],
          fill: false,
          tension: 0.3,
          pointRadius: 1,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { intersect: false, mode: 'index' },
        plugins: { legend: { labels: { color: textColor } } },
        scales: {
          x: { ticks: { color: textColor, maxTicksLimit: 10 }, grid: { color: gridColor } },
          y: { ticks: { color: textColor, callback: (v) => formatCompact(v, curr) }, grid: { color: gridColor } },
        },
      },
    });
  }

  function renderWithdrawal(finalBalance, annualReturn, fiatMul, curr) {
    const { annualWithdrawal, snapshots } = computeWithdrawal(finalBalance, annualReturn, SWR_RATE, 50);

    dom.resSWRAnnual.textContent = formatCurrency(annualWithdrawal * fiatMul, curr);
    dom.resSWRMonthly.textContent = formatCurrency((annualWithdrawal / 12) * fiatMul, curr);
    dom.resSWRYears.textContent = `${snapshots.length}+`;

    if (state.charts.withdrawal) state.charts.withdrawal.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#888' : '#666';

    state.charts.withdrawal = new Chart(dom.chartWithdrawal, {
      type: 'bar',
      data: {
        labels: snapshots.map((s) => `${t('chart_year')} ${s.year}`),
        datasets: [
          {
            label: `${t('chart_remaining')} (${curr})`,
            data: snapshots.map((s) => Math.round(s.balance * fiatMul)),
            backgroundColor: snapshots.map((s) =>
              s.balance > finalBalance * 0.3 ? 'rgba(0,200,83,0.5)' : 'rgba(255,82,82,0.5)'
            ),
            borderColor: snapshots.map((s) =>
              s.balance > finalBalance * 0.3 ? '#00c853' : '#ff5252'
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { labels: { color: textColor } } },
        scales: {
          x: { ticks: { color: textColor, maxTicksLimit: 10 }, grid: { color: gridColor } },
          y: { ticks: { color: textColor, callback: (v) => formatCompact(v, curr) }, grid: { color: gridColor } },
        },
      },
    });
  }

  // ─── Share ────────────────────────────────────────────────
  function shareResults() {
    const btc = dom.resBtc.textContent;
    const fiat = dom.resFiat.textContent;
    const years = dom.inputYears.value;
    const text = t('share_text').replace('{years}', years).replace('{btc}', btc).replace('{fiat}', fiat);

    if (navigator.share) {
      navigator.share({ title: t('logo_text'), text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast(t('toast_copied')));
    } else {
      showToast(text);
    }
  }

  // ─── Save / Load Plans ────────────────────────────────────
  function savePlan() {
    const plan = {
      initial: dom.inputInitial.value,
      currency: dom.inputCurrency.value,
      contribution: dom.inputContribution.value,
      frequency: dom.inputFrequency.value,
      years: dom.inputYears.value,
      return: dom.inputReturn.value,
      inflation: dom.inputInflation.value,
      savedAt: new Date().toISOString(),
    };

    const plans = JSON.parse(localStorage.getItem(PLAN_KEY) || '[]');
    plans.unshift(plan);
    if (plans.length > 10) plans.pop();
    localStorage.setItem(PLAN_KEY, JSON.stringify(plans));

    saveToNostr(plan);
    showToast(t('toast_saved'));
  }

  async function saveToNostr(plan) {
    if (!state.hasNostr) return;
    try {
      const event = {
        kind: 30078,
        tags: [['d', 'btc-retirement-plan']],
        content: JSON.stringify(plan),
        created_at: Math.floor(Date.now() / 1000),
      };
      await window.nostr.signEvent(event);
    } catch (_) {}
  }

  function loadPlan() {
    const plans = JSON.parse(localStorage.getItem(PLAN_KEY) || '[]');
    if (plans.length === 0) {
      showToast(t('toast_no_plans'));
      return;
    }

    const plan = plans[0];
    dom.inputInitial.value = plan.initial;
    dom.inputCurrency.value = plan.currency;
    dom.inputContribution.value = plan.contribution;
    dom.inputFrequency.value = plan.frequency;
    dom.inputYears.value = plan.years;
    dom.inputReturn.value = plan.return;
    dom.inputInflation.value = plan.inflation;

    updateSliderDisplays();
    updateAureoVisibility();
    showToast(t('toast_loaded').replace('{date}', new Date(plan.savedAt).toLocaleDateString()));
  }

  // ─── PDF Export ───────────────────────────────────────────
  function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const inputs = getInputs();
    const snapshots = computeProjection(inputs.initial, inputs.monthlyContrib, inputs.years, inputs.annualReturn);
    const last = snapshots[snapshots.length - 1];
    const curr = inputs.currency === 'MXN' ? 'MXN' : 'USD';
    const fiatMul = curr === 'MXN' ? (state.btcPrice.mxn / state.btcPrice.usd) : 1;

    doc.setFontSize(20);
    doc.setTextColor(247, 147, 26);
    doc.text(t('pdf_title'), 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t('pdf_generated')} ${new Date().toLocaleDateString()} | ${t('pdf_btc_price')} $${formatNumber(state.btcPrice.usd)} USD`, 20, 33);

    doc.setDrawColor(247, 147, 26);
    doc.line(20, 37, 190, 37);

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(t('pdf_params'), 20, 48);

    doc.setFontSize(11);
    doc.setTextColor(60);
    const params = [
      `${t('pdf_initial')} ${formatCurrency(inputs.initial * fiatMul, curr)}`,
      `${t('pdf_monthly')} ${formatCurrency(inputs.monthlyContrib * fiatMul, curr)}`,
      `${t('pdf_horizon')} ${inputs.years} ${t('years_unit')}`,
      `${t('pdf_return')} ${(inputs.annualReturn * 100).toFixed(1)}%`,
      `${t('pdf_inflation')} ${(inputs.inflation * 100).toFixed(1)}%`,
    ];
    params.forEach((p, i) => doc.text(p, 25, 57 + i * 7));

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(t('pdf_results'), 20, 100);

    doc.setFontSize(12);
    doc.setTextColor(247, 147, 26);
    doc.text(`${t('pdf_final')} ₿ ${(last.balance / state.btcPrice.usd).toFixed(4)}`, 25, 110);
    doc.setTextColor(60);
    doc.text(`${t('pdf_equivalent')} ${formatCurrency(last.balance * fiatMul, curr)}`, 25, 118);
    doc.text(`${t('pdf_invested')} ${formatCurrency(last.invested * fiatMul, curr)}`, 25, 126);
    doc.text(`${t('pdf_gain')} +${formatCurrency(last.gains * fiatMul, curr)}`, 25, 134);

    if (inputs.inflation > 0) {
      const realVal = last.balance / Math.pow(1 + inputs.inflation, inputs.years);
      doc.text(`${t('pdf_real_power')} ${formatCurrency(realVal * fiatMul, curr)}`, 25, 142);
    }

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(t('pdf_projection'), 20, 158);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(t('pdf_year'), 25, 166);
    doc.text(t('pdf_balance'), 55, 166);
    doc.text(t('pdf_invested'), 100, 166);
    doc.text(t('pdf_gain_col'), 145, 166);

    let yPos = 173;
    doc.setTextColor(60);
    snapshots.forEach((s) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 25;
      }
      doc.text(`${s.year}`, 25, yPos);
      doc.text(formatCurrency(s.balance * fiatMul, curr), 55, yPos);
      doc.text(formatCurrency(s.invested * fiatMul, curr), 100, yPos);
      doc.text(`+${formatCurrency(s.gains * fiatMul, curr)}`, 145, yPos);
      yPos += 6;
    });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(t('pdf_disclaimer'), 20, 290);
    doc.text(t('pdf_footer'), 20, 295);

    doc.save('retiro-bitcoin.pdf');
    showToast(t('toast_pdf'));
  }

  // ─── Formatters ───────────────────────────────────────────
  function formatNumber(n) {
    return new Intl.NumberFormat('es-MX').format(n);
  }

  function formatCurrency(amount, currency) {
    const sym = currency === 'MXN' ? 'MX$' : '$';
    if (Math.abs(amount) >= 1_000_000) {
      return `${sym}${(amount / 1_000_000).toFixed(2)}M`;
    }
    return `${sym}${formatNumber(Math.round(amount))}`;
  }

  function formatCompact(value, currency) {
    const sym = currency === 'MXN' ? 'MX$' : '$';
    if (value >= 1_000_000) return `${sym}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${sym}${(value / 1_000).toFixed(0)}K`;
    return `${sym}${value}`;
  }

  // ─── UI Helpers ───────────────────────────────────────────
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
  }

  function openPremiumModal() {
    dom.modalPremium.classList.remove('hidden');
    updatePriceTags();
  }

  function closePremiumModal() {
    dom.modalPremium.classList.add('hidden');
    resetPaymentUI();
  }

  function openHelpModal() {
    dom.modalHelp.classList.remove('hidden');
  }

  function closeHelpModal() {
    dom.modalHelp.classList.add('hidden');
  }

  function closeAllModals() {
    closePremiumModal();
    closeHelpModal();
  }

  function updateSliderDisplays() {
    dom.yearsDisplay.textContent = dom.inputYears.value;
    dom.returnDisplay.textContent = dom.inputReturn.value;
    dom.inflationDisplay.textContent = dom.inputInflation.value;
  }

  // ─── Events ───────────────────────────────────────────────
  function bindEvents() {
    dom.inputLang.addEventListener('change', () => setLanguage(dom.inputLang.value));
    dom.btnHelp.addEventListener('click', openHelpModal);
    dom.helpClose.addEventListener('click', closeHelpModal);
    dom.btnTheme.addEventListener('click', toggleTheme);
    dom.btnCalculate.addEventListener('click', calculate);
    dom.btnShare.addEventListener('click', shareResults);
    dom.btnPremiumCta.addEventListener('click', openPremiumModal);
    dom.modalClose.addEventListener('click', closePremiumModal);
    dom.btnRestore.addEventListener('click', restorePurchase);

    dom.modalPremium.addEventListener('click', (e) => {
      if (e.target === dom.modalPremium) closePremiumModal();
    });

    dom.modalHelp.addEventListener('click', (e) => {
      if (e.target === dom.modalHelp) closeHelpModal();
    });

    dom.btnPayMonthly.addEventListener('click', () => handlePayment(MONTHLY_PRICE_USD));
    dom.btnPayLifetime.addEventListener('click', () => handlePayment(LIFETIME_PRICE_USD));

    dom.btnSave.addEventListener('click', savePlan);
    dom.btnExportPdf.addEventListener('click', exportPDF);
    dom.btnLoad.addEventListener('click', loadPlan);

    dom.inputCurrency.addEventListener('change', updateAureoVisibility);

    dom.btnCoingecko.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm(t('coingecko_confirm'))) {
        window.open(dom.btnCoingecko.href, '_blank', 'noopener');
      }
    });

    dom.returnContext.querySelector('.info-toggle').addEventListener('click', () => {
      const content = dom.returnContext.querySelector('.info-content');
      content.classList.toggle('hidden');
    });

    dom.inputYears.addEventListener('input', () => {
      dom.yearsDisplay.textContent = dom.inputYears.value;
    });
    dom.inputReturn.addEventListener('input', () => {
      dom.returnDisplay.textContent = dom.inputReturn.value;
    });
    dom.inputInflation.addEventListener('input', () => {
      dom.inflationDisplay.textContent = dom.inputInflation.value;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.closest('#calculator')) {
        e.preventDefault();
        calculate();
      }
      if (e.key === 'Escape') closeAllModals();
    });
  }

  // ─── Boot ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
})();
