(function () {
  'use strict';

  var AGENTS_URL = (function () {
    var s = document.currentScript;
    return (s && s.getAttribute('data-agents-url')) || 'https://agents.retirobtc.mx';
  })();

  var SESSION_KEY = (function () {
    try {
      var k = localStorage.getItem('rito_session');
      if (!k) {
        k = localStorage.getItem('lidia_session');
        if (k) localStorage.removeItem('lidia_session');
      }
      if (k) return k;
      k = 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('rito_session', k);
      return k;
    } catch (e) {
      return 's_anon_' + Date.now();
    }
  })();

  var styles = document.createElement('style');
  styles.textContent =
    '#rito-root{font-family:system-ui,-apple-system,sans-serif;z-index:99999}' +
    '#rito-toggle{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;border:none;background:#f7931a;color:#111;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.35)}' +
    '#rito-panel{display:none;position:fixed;bottom:88px;right:20px;width:min(360px,calc(100vw - 40px));height:480px;background:#141414;border:1px solid #333;border-radius:12px;flex-direction:column;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)}' +
    '#rito-panel.open{display:flex}' +
    '#rito-header{padding:12px 14px;background:#1a1a1a;border-bottom:1px solid #333;font-size:14px;font-weight:600;color:#f5f5f5}' +
    '#rito-header span{font-weight:400;color:#888;font-size:11px;display:block;margin-top:2px}' +
    '#rito-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}' +
    '.rito-msg{max-width:90%;padding:8px 12px;border-radius:10px;font-size:13px;line-height:1.45;white-space:pre-wrap}' +
    '.rito-msg.user{align-self:flex-end;background:#f7931a;color:#111}' +
    '.rito-msg.bot{align-self:flex-start;background:#252525;color:#eee}' +
    '#rito-form{display:flex;border-top:1px solid #333;padding:8px;gap:8px}' +
    '#rito-input{flex:1;border:1px solid #444;background:#111;color:#eee;border-radius:8px;padding:8px 10px;font-size:13px;resize:none;height:40px}' +
    '#rito-send{background:#f7931a;border:none;border-radius:8px;padding:0 14px;font-weight:600;cursor:pointer;color:#111}' +
    '#rito-disclaimer{font-size:10px;color:#666;padding:6px 12px;border-top:1px solid #222}';

  var root = document.createElement('div');
  root.id = 'rito-root';
  root.innerHTML =
    '<button type="button" id="rito-toggle" aria-label="Abrir chat Rito">Rito</button>' +
    '<div id="rito-panel" role="dialog" aria-label="Chat Rito">' +
    '<div id="rito-header">Rito · Soporte retirobtc.mx<span>Información educativa · no es asesoría legal/fiscal</span></div>' +
    '<div id="rito-messages"></div>' +
    '<div id="rito-disclaimer">No compartas datos de pago ni montos personales.</div>' +
    '<form id="rito-form"><textarea id="rito-input" placeholder="Pregunta sobre AFORE, Fedi, calculadora…" rows="1"></textarea><button type="submit" id="rito-send">→</button></form>' +
    '</div>';

  document.head.appendChild(styles);
  document.body.appendChild(root);

  var toggle = document.getElementById('rito-toggle');
  var panel = document.getElementById('rito-panel');
  var messagesEl = document.getElementById('rito-messages');
  var form = document.getElementById('rito-form');
  var input = document.getElementById('rito-input');
  var messages = [];

  function appendMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'rito-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  toggle.addEventListener('click', function () {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && messages.length === 0) {
      appendMsg(
        'bot',
        'Hola, soy Rito. Te ayudo con la calculadora, Fedi, AFORE y tu retiro en México. ¿En qué te apoyo?'
      );
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = (input.value || '').trim();
    if (!text) return;
    input.value = '';
    messages.push({ role: 'user', content: text });
    appendMsg('user', text);

    var botEl = document.createElement('div');
    botEl.className = 'rito-msg bot';
    botEl.textContent = '…';
    messagesEl.appendChild(botEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    fetch(AGENTS_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages, sessionKey: SESSION_KEY }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status === 429 ? 'Límite de mensajes. Intenta más tarde.' : 'Error de chat');
        if (!res.body) throw new Error('Sin respuesta');
        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var full = '';
        function read() {
          return reader.read().then(function (result) {
            if (result.done) {
              messages.push({ role: 'assistant', content: full });
              return;
            }
            full += decoder.decode(result.value, { stream: true });
            botEl.textContent = full || '…';
            messagesEl.scrollTop = messagesEl.scrollHeight;
            return read();
          });
        }
        return read();
      })
      .catch(function (err) {
        botEl.textContent = err.message || 'No pude conectar con Rito. Intenta de nuevo.';
      });
  });

  window.Rito = { open: function () { panel.classList.add('open'); } };
})();
