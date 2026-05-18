/**
 * Brújula — Cuestionario de diagnóstico financiero
 * retirobtc.mx/brujula
 * Archivo externo para cumplir CSP script-src 'self'
 */
(function () {
  'use strict';

  var preguntas = [
    {
      id: 1,
      texto: '¿Qué edad tienes?',
      descripcion: 'Selecciona la opción que mejor describa tu situación actual.',
      opciones: [
        { texto: '18–24 años', puntos: 12 },
        { texto: '25–34 años', puntos: 10 },
        { texto: '35–44 años', puntos: 7 },
        { texto: '45–54 años', puntos: 4 },
        { texto: '55 años o más', puntos: 2 }
      ]
    },
    {
      id: 2,
      texto: '¿Cuánto ahorras al mes respecto a tu ingreso?',
      descripcion: 'Considera todas tus fuentes de ahorro, incluyendo AFORE.',
      opciones: [
        { texto: 'Más del 20%', puntos: 15 },
        { texto: 'Entre 10% y 20%', puntos: 10 },
        { texto: 'Entre 5% y 10%', puntos: 6 },
        { texto: 'Menos del 5%', puntos: 3 },
        { texto: 'No ahorro actualmente', puntos: 0 }
      ]
    },
    {
      id: 3,
      texto: '¿A qué edad planeas retirarte?',
      descripcion: 'El plazo de tiempo es uno de los factores más importantes en cualquier plan de retiro.',
      opciones: [
        { texto: 'Antes de los 50', puntos: 15 },
        { texto: 'Entre 50 y 55', puntos: 12 },
        { texto: 'Entre 56 y 60', puntos: 9 },
        { texto: 'Entre 61 y 65', puntos: 6 },
        { texto: 'Después de los 65', puntos: 3 }
      ]
    },
    {
      id: 4,
      texto: '¿Tienes AFORE o algún fondo de retiro institucional activo?',
      descripcion: 'Considera cualquier esquema de ahorro vinculado a tu empleo formal.',
      opciones: [
        { texto: 'Sí, y lo reviso regularmente', puntos: 12 },
        { texto: 'Sí, pero no lo he revisado recientemente', puntos: 7 },
        { texto: 'Sí, pero no sé cuánto tengo', puntos: 4 },
        { texto: 'No tengo AFORE', puntos: 0 }
      ]
    },
    {
      id: 5,
      texto: '¿Cómo describes tu conocimiento sobre inversiones?',
      descripcion: 'No hay respuesta incorrecta — esto nos ayuda a personalizar tu resultado.',
      opciones: [
        { texto: 'Tengo una cartera diversificada y la gestiono activamente', puntos: 12 },
        { texto: 'Tengo algunas inversiones pero no las reviso frecuentemente', puntos: 8 },
        { texto: 'Conozco los conceptos básicos pero aún no invierto', puntos: 5 },
        { texto: 'Apenas estoy aprendiendo sobre el tema', puntos: 2 },
        { texto: 'No sé cómo empezar', puntos: 0 }
      ]
    },
    {
      id: 6,
      texto: 'Si tuvieras una emergencia económica, ¿cuántos meses podrías sostenerte sin ingresos?',
      descripcion: 'El fondo de emergencia es la base de cualquier plan financiero sólido.',
      opciones: [
        { texto: 'Más de 12 meses', puntos: 15 },
        { texto: 'Entre 6 y 12 meses', puntos: 12 },
        { texto: 'Entre 3 y 6 meses', puntos: 8 },
        { texto: 'Entre 1 y 3 meses', puntos: 4 },
        { texto: 'Menos de 1 mes', puntos: 0 }
      ]
    },
    {
      id: 7,
      texto: '¿Qué tan familiarizado estás con Bitcoin como herramienta de ahorro a largo plazo?',
      descripcion: 'No necesitas ser experto — la Brújula funciona para cualquier nivel.',
      opciones: [
        { texto: 'Lo uso activamente como parte de mi estrategia de ahorro', puntos: 12 },
        { texto: 'He comprado algo pero no tengo una estrategia definida', puntos: 8 },
        { texto: 'Me interesa pero aún no he comprado', puntos: 5 },
        { texto: 'Lo he escuchado pero no entiendo bien cómo funciona', puntos: 2 },
        { texto: 'No lo considero en mis planes', puntos: 0 }
      ]
    },
    {
      id: 8,
      texto: '¿Tienes una meta clara de cuánto dinero necesitas para retirarte?',
      descripcion: 'Tener un número concreto es el primer paso para planear con dirección.',
      opciones: [
        { texto: 'Sí, tengo una cifra específica y un plan para alcanzarla', puntos: 15 },
        { texto: 'Tengo una idea aproximada pero no un plan definido', puntos: 10 },
        { texto: 'He pensado en ello pero no tengo un número claro', puntos: 5 },
        { texto: 'No he pensado en una cifra concreta', puntos: 0 }
      ]
    }
  ];

  var PUNTAJE_MAX = 98;
  var respuestas = new Array(8).fill(null);
  var preguntaActual = 0;

  function obtenerNivel(puntaje) {
    if (puntaje <= 25) return {
      nivel: 'Sin brújula',
      etiqueta: 'br-chip-red',
      mensaje: 'Aún no tienes un norte claro. La buena noticia: este es exactamente el momento para empezar. La calculadora te muestra cómo cambiaría tu panorama con pequeños ajustes consistentes.',
      boton: 'Quiero encontrar mi norte'
    };
    if (puntaje <= 50) return {
      nivel: 'Orientándote',
      etiqueta: 'br-chip-orange',
      mensaje: 'Vas en la dirección correcta, pero necesitas más consistencia. Tienes los ingredientes básicos — falta convertirlos en un plan con números reales.',
      boton: 'Ver mi proyección real'
    };
    if (puntaje <= 75) return {
      nivel: 'En camino',
      etiqueta: 'br-chip-gold',
      mensaje: 'Buen rumbo. Estás mejor preparado que la mayoría. Algunos ajustes estratégicos pueden marcar una diferencia enorme en tu retiro final.',
      boton: 'Afinar mi plan'
    };
    return {
      nivel: 'Rumbo firme',
      etiqueta: 'br-chip-green',
      mensaje: 'Estás bien posicionado para el retiro. La calculadora te ayuda a convertir esa preparación en proyecciones concretas y un plan de acción en Bitcoin.',
      boton: 'Ver mi proyección detallada'
    };
  }

  function animarPuntaje(objetivo, duracion) {
    duracion = duracion || 1200;
    var el = document.getElementById('resultado-puntaje');
    if (!el) return;
    var inicio = performance.now();
    function fotograma(ahora) {
      var progreso = Math.min((ahora - inicio) / duracion, 1);
      var suavizado = 1 - Math.pow(1 - progreso, 3);
      el.textContent = Math.round(suavizado * objetivo);
      if (progreso < 1) requestAnimationFrame(fotograma);
    }
    requestAnimationFrame(fotograma);
  }

  function renderPregunta(n) {
    var p = preguntas[n];
    var elPaso = document.getElementById('paso-actual');
    var elPct = document.getElementById('progreso-pct');
    var elBarra = document.getElementById('barra-progreso');
    var elTitulo = document.getElementById('cuestionario-pregunta');
    var elDesc = document.getElementById('cuestionario-descripcion');
    var elOpciones = document.getElementById('cuestionario-opciones');
    var elRegresar = document.getElementById('btn-regresar');

    if (!p || !elTitulo) return;

    var pct = Math.round((n / preguntas.length) * 100);
    if (elPaso) elPaso.textContent = n + 1;
    if (elPct) elPct.textContent = pct;
    if (elBarra) elBarra.style.width = pct + '%';
    elTitulo.textContent = p.texto;
    if (elDesc) elDesc.textContent = p.descripcion;

    if (elRegresar) {
      elRegresar.disabled = n === 0;
      elRegresar.style.opacity = n === 0 ? '0.35' : '1';
    }

    if (!elOpciones) return;
    elOpciones.innerHTML = '';
    p.opciones.forEach(function (op, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opcion-item' + (respuestas[n] === op.puntos && respuestas[n] !== null ? ' seleccionada' : '');
      btn.textContent = op.texto;
      btn.addEventListener('click', function () {
        seleccionarOpcion(op.puntos, n);
      });
      elOpciones.appendChild(btn);
    });
  }

  function seleccionarOpcion(puntos, n) {
    respuestas[n] = puntos;
    var opciones = document.querySelectorAll('#cuestionario-opciones .opcion-item');
    var p = preguntas[n];
    opciones.forEach(function (btn, i) {
      btn.classList.toggle('seleccionada', p.opciones[i].puntos === puntos);
    });

    setTimeout(function () {
      if (n < preguntas.length - 1) {
        preguntaActual = n + 1;
        renderPregunta(preguntaActual);
      } else {
        mostrarResultado();
      }
    }, 400);
  }

  function mostrarResultado() {
    var total = respuestas.reduce(function (acc, v) { return acc + (v || 0); }, 0);
    var puntaje = Math.round((total / PUNTAJE_MAX) * 100);
    var nivel = obtenerNivel(puntaje);

    var elNivel = document.getElementById('resultado-nivel');
    var elMensaje = document.getElementById('resultado-mensaje');
    var elBoton = document.getElementById('resultado-boton');

    if (elNivel) {
      elNivel.textContent = nivel.nivel;
      elNivel.className = 'br-chip ' + nivel.etiqueta;
    }
    if (elMensaje) elMensaje.textContent = nivel.mensaje;
    if (elBoton) elBoton.textContent = nivel.boton + ' →';

    var cuestionario = document.getElementById('contenedor-cuestionario');
    var pantalla = document.getElementById('pantalla-resultado');
    if (cuestionario) cuestionario.style.display = 'none';
    if (pantalla) pantalla.classList.add('visible');

    animarPuntaje(puntaje);
  }

  function init() {
    /* Cuestionario */
    renderPregunta(0);

    var btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
      btnRegresar.addEventListener('click', function () {
        if (preguntaActual > 0) {
          preguntaActual--;
          renderPregunta(preguntaActual);
        }
      });
    }

    /* CTA hero → cuestionario */
    var btnEmpezar = document.getElementById('btn-empezar');
    if (btnEmpezar) {
      btnEmpezar.addEventListener('click', function () {
        var target = document.getElementById('contenedor-cuestionario');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    /* Modal guía */
    var overlay = document.getElementById('ventana-guia');
    var btnGuia = document.getElementById('btn-guia');
    var btnCerrar = document.getElementById('btn-cerrar-ventana');

    if (btnGuia && overlay) {
      btnGuia.addEventListener('click', function () {
        overlay.classList.add('open');
      });
    }
    if (btnCerrar && overlay) {
      btnCerrar.addEventListener('click', function () {
        overlay.classList.remove('open');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    }

    /* Enviar guía (stub — sin backend activo) */
    var btnEnviar = document.getElementById('btn-enviar-guia');
    if (btnEnviar) {
      btnEnviar.addEventListener('click', function () {
        var nombre = document.getElementById('guia-nombre');
        var correo = document.getElementById('guia-correo');
        var consentimiento = document.getElementById('guia-consentimiento');
        if (!nombre || !nombre.value.trim()) { alert('Por favor ingresa tu nombre.'); return; }
        if (!correo || !correo.value.trim()) { alert('Por favor ingresa tu correo.'); return; }
        if (!consentimiento || !consentimiento.checked) { alert('Acepta el aviso de privacidad para continuar.'); return; }
        btnEnviar.textContent = 'Guía enviada — revisa tu correo';
        btnEnviar.disabled = true;
        if (overlay) setTimeout(function () { overlay.classList.remove('open'); }, 1800);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
