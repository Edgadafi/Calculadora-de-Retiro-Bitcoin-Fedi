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
    '#rito-root{position:relative;z-index:99999;font-family:system-ui,-apple-system,sans-serif}' +
    '#rito-toggle,#rito-panel,#rito-close,#rito-send,#rito-input{box-sizing:border-box}' +
    '#rito-toggle{position:fixed;z-index:100000;bottom:max(16px,env(safe-area-inset-bottom,0px));right:max(16px,env(safe-area-inset-right,0px));width:56px;height:56px;min-width:56px;min-height:56px;padding:0;border-radius:50%;border:none;background:#F07D38;color:#111;font-weight:700;font-size:13px;line-height:1;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 20px rgba(0,0,0,.35)}' +
    '#rito-panel{display:none;position:fixed;z-index:100000;bottom:calc(80px + env(safe-area-inset-bottom,0px));right:max(16px,env(safe-area-inset-right,0px));width:min(360px,calc(100vw - 32px));height:min(480px,calc(100dvh - 100px - env(safe-area-inset-bottom,0px)));max-height:calc(100dvh - 96px);background:#141414;border:1px solid #333;border-radius:12px;flex-direction:column;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)}' +
    '#rito-panel.open{display:flex}' +
    '#rito-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:12px 10px 12px 14px;background:#1a1a1a;border-bottom:1px solid #333;font-size:14px;font-weight:600;color:#f5f5f5}' +
    '#rito-header-copy{min-width:0}' +
    '#rito-header span{font-weight:400;color:#888;font-size:11px;display:block;margin-top:2px}' +
    '#rito-close{flex:0 0 auto;width:36px;height:36px;min-width:36px;min-height:36px;padding:0;border:none;border-radius:8px;background:transparent;color:#ccc;font-size:22px;line-height:1;cursor:pointer;touch-action:manipulation}' +
    '#rito-messages{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px;display:flex;flex-direction:column;gap:10px}' +
    '.rito-msg{max-width:90%;padding:9px 12px;border-radius:12px;font-size:14px;line-height:1.5;white-space:pre-wrap}' +
    '.rito-msg.user{align-self:flex-end;background:#F07D38;color:#111}' +
    '.rito-msg.bot{align-self:flex-start;background:#252525;color:#eee}' +
    '.rito-msg.bot.rito-rich{white-space:normal}' +
    '.rito-msg.bot.rito-rich p{margin:0 0 0.55em}' +
    '.rito-msg.bot.rito-rich p:last-child{margin-bottom:0}' +
    '.rito-msg.bot.rito-rich ul,.rito-msg.bot.rito-rich ol{margin:0.2em 0 0.55em;padding-left:1.2em}' +
    '.rito-msg.bot.rito-rich li{margin:0.2em 0}' +
    '.rito-msg.bot.rito-rich strong{font-weight:700;color:#fff}' +
    '.rito-msg.bot.rito-rich a{color:#F07D38;text-decoration:underline;word-break:break-word}' +
    '.rito-msg.bot.rito-rich code{font-size:12px;background:#111;padding:1px 4px;border-radius:4px}' +
    '#rito-form{display:flex;align-items:stretch;border-top:1px solid #333;padding:8px;gap:8px}' +
    '#rito-input{flex:1;min-width:0;border:1px solid #444;background:#111;color:#eee;border-radius:8px;padding:8px 10px;font-size:16px;resize:none;height:40px}' +
    '#rito-send{background:#F07D38;border:none;border-radius:8px;padding:0 14px;min-width:44px;font-weight:600;cursor:pointer;color:#111;touch-action:manipulation}' +
    '#rito-disclaimer{font-size:10px;color:#666;padding:6px 12px;border-top:1px solid #222}' +
    '@media (max-width:640px){' +
      '#rito-toggle{width:52px;height:52px;min-width:52px;min-height:52px;bottom:max(12px,env(safe-area-inset-bottom,0px));right:max(12px,env(safe-area-inset-right,0px))}' +
      '#rito-panel{left:10px;right:10px;width:auto;bottom:calc(72px + env(safe-area-inset-bottom,0px));height:min(70dvh,calc(100dvh - 84px - env(safe-area-inset-bottom,0px)));max-height:none;border-radius:14px}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){#rito-toggle,#rito-panel{transition:none}}';

  var root = document.createElement('div');
  root.id = 'rito-root';
  root.innerHTML =
    '<button type="button" id="rito-toggle" aria-label="Abrir chat Rito" aria-expanded="false" aria-controls="rito-panel">Rito</button>' +
    '<div id="rito-panel" role="dialog" aria-label="Chat Rito" aria-modal="true">' +
    '<div id="rito-header"><div id="rito-header-copy">Rito · Soporte retirobtc.mx<span>Información educativa · no es asesoría legal/fiscal</span></div><button type="button" id="rito-close" aria-label="Cerrar chat">×</button></div>' +
    '<div id="rito-messages"></div>' +
    '<div id="rito-disclaimer">No compartas datos de pago ni montos personales.</div>' +
    '<form id="rito-form"><textarea id="rito-input" placeholder="Escríbeme: AFORE, Fedi, calculadora…" rows="1" autocomplete="off"></textarea><button type="submit" id="rito-send">→</button></form>' +
    '</div>';

  document.head.appendChild(styles);
  document.body.appendChild(root);

  var toggle = document.getElementById('rito-toggle');
  var panel = document.getElementById('rito-panel');
  var closeBtn = document.getElementById('rito-close');
  var messagesEl = document.getElementById('rito-messages');
  var form = document.getElementById('rito-form');
  var input = document.getElementById('rito-input');
  var messages = [];

  function setOpen(open) {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar chat Rito' : 'Abrir chat Rito');
    if (open && messages.length === 0) {
      var greet =
        'Hola, soy Rito. Si quieres, vemos tu retiro con Bitcoin: la calculadora, Fedi o cómo se compara con una AFORE.\n\n¿Por dónde empezamos?';
      messages.push({ role: 'assistant', content: greet });
      appendMsg('bot', greet);
    }
  }

  function isSafeHttpUrl(url) {
    return /^https?:\/\//i.test(url);
  }

  function makeLink(href, label) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }

  function appendInline(parent, text) {
    var re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s<]+))/g;
    var last = 0;
    var m;
    while ((m = re.exec(text))) {
      if (m.index > last) {
        parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      if (m[2]) {
        var strong = document.createElement('strong');
        strong.textContent = m[2];
        parent.appendChild(strong);
      } else if (m[3]) {
        var code = document.createElement('code');
        code.textContent = m[3];
        parent.appendChild(code);
      } else if (m[4] && m[5] && isSafeHttpUrl(m[5])) {
        parent.appendChild(makeLink(m[5], m[4]));
      } else if (m[6] && isSafeHttpUrl(m[6])) {
        var rawUrl = m[6];
        var trail = '';
        while (/[),.;:!?]$/.test(rawUrl)) {
          trail = rawUrl.slice(-1) + trail;
          rawUrl = rawUrl.slice(0, -1);
        }
        if (isSafeHttpUrl(rawUrl)) {
          parent.appendChild(makeLink(rawUrl, rawUrl));
          if (trail) parent.appendChild(document.createTextNode(trail));
        } else {
          parent.appendChild(document.createTextNode(m[0]));
        }
      } else {
        parent.appendChild(document.createTextNode(m[0]));
      }
      last = re.lastIndex;
    }
    if (last < text.length) {
      parent.appendChild(document.createTextNode(text.slice(last)));
    }
  }

  function isBullet(line) {
    return /^\s*[-*•]\s+\S/.test(line);
  }

  function isOrdered(line) {
    return /^\s*\d+[.)]\s+\S/.test(line);
  }

  function renderRich(el, text) {
    el.textContent = '';
    el.classList.add('rito-rich');
    var blocks = String(text || '').replace(/\r\n/g, '\n').split(/\n{2,}/);
    var i;
    for (i = 0; i < blocks.length; i++) {
      var block = blocks[i].trim();
      if (!block) continue;
      var lines = block.split('\n');
      var nonempty = lines.filter(function (ln) {
        return ln.trim();
      });
      if (nonempty.length && nonempty.every(isBullet)) {
        var ul = document.createElement('ul');
        nonempty.forEach(function (ln) {
          var li = document.createElement('li');
          appendInline(li, ln.replace(/^\s*[-*•]\s+/, ''));
          ul.appendChild(li);
        });
        el.appendChild(ul);
      } else if (nonempty.length && nonempty.every(isOrdered)) {
        var ol = document.createElement('ol');
        nonempty.forEach(function (ln) {
          var li = document.createElement('li');
          appendInline(li, ln.replace(/^\s*\d+[.)]\s+/, ''));
          ol.appendChild(li);
        });
        el.appendChild(ol);
      } else {
        var p = document.createElement('p');
        lines.forEach(function (ln, idx) {
          if (idx) p.appendChild(document.createElement('br'));
          appendInline(p, ln);
        });
        el.appendChild(p);
      }
    }
    if (!el.childNodes.length) {
      el.classList.remove('rito-rich');
      el.textContent = text;
    }
  }

  function appendMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'rito-msg ' + (role === 'user' ? 'user' : 'bot');
    if (role === 'user') {
      div.textContent = text;
    } else {
      renderRich(div, text);
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  toggle.addEventListener('click', function () {
    setOpen(!panel.classList.contains('open'));
  });

  closeBtn.addEventListener('click', function () {
    setOpen(false);
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
        if (!res.ok) {
          return res.json().then(
            function (body) {
              var msg =
                res.status === 429
                  ? 'Límite de mensajes. Intenta más tarde.'
                  : (body && body.error) || 'Error de chat';
              throw new Error(msg);
            },
            function () {
              throw new Error(res.status === 429 ? 'Límite de mensajes. Intenta más tarde.' : 'Error de chat');
            }
          );
        }
        if (!res.body) throw new Error('Sin respuesta');
        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var full = '';
        function read() {
          return reader.read().then(function (result) {
            if (result.done) {
              messages.push({ role: 'assistant', content: full });
              renderRich(botEl, full || '…');
              messagesEl.scrollTop = messagesEl.scrollHeight;
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

  window.Rito = {
    open: function () { setOpen(true); },
    close: function () { setOpen(false); }
  };
})();
