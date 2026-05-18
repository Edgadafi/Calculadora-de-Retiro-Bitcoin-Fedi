# Prompt para Cursor — Integración Design System Bitcoin Retiro

---

Copia y pega este prompt completo en Cursor (modo Composer, Ctrl+I / Cmd+I).
Selecciona todo el repo como contexto antes de ejecutarlo.

---

## PROMPT

Eres un frontend engineer experto integrando un nuevo design system a una calculadora Bitcoin existente. Tu trabajo es reemplazar todos los estilos actuales con el nuevo sistema de diseño sin romper ninguna funcionalidad.

### CONTEXTO DEL PROYECTO

- **App:** Calculadora de Retiro con Bitcoin
- **URL producción:** Landing `https://retirobtc.mx/`, calculadora `https://retirobtc.mx/calc`, brújula `https://retirobtc.mx/brujula`
- **Stack:** [Cursor debe detectar el stack leyendo el repo — puede ser HTML/CSS/JS vanilla, o framework como Vite/React]
- **Funcionalidades a preservar:** calculadora de proyección, premium con Lightning, multi-moneda, multi-idioma, comparación de escenarios, SWR 4%, exportar PDF, guardar plan

### ARCHIVO DE DESIGN SYSTEM

El archivo `bitcoin-retiro-design-system.css` ya está en el repo. Contiene:
- Variables CSS (tokens) en `:root` — todos con prefijo `--br-`
- Reset y estilos base de `body`
- Clases de tipografía: `.br-display`, `.br-title`, `.br-headline`, `.br-body`, `.br-data`, `.br-label`, `.br-label-muted`
- Clases de layout: `.br-container`, `.br-grid-2`, `.br-grid-3`, `.br-stack-*`, `.br-row`
- Botones: `.br-btn` + `.br-btn-primary`, `.br-btn-secondary`, `.br-btn-ghost`, `.br-btn-gold`, `.br-btn-lightning`
- Inputs: `.br-field`, `.br-input`, `.br-select`, `.br-segmented`, `.br-range`
- Tarjetas: `.br-card`, `.br-card-featured`, `.br-card-result`
- Stat cards: `.br-stat`, `.br-stat-label`, `.br-stat-value`
- Chips: `.br-chip-orange`, `.br-chip-gold`, `.br-chip-green`, `.br-chip-red`, `.br-chip-muted`, `.br-chip-lightning`
- Progress bars: `.br-progress-bar`, `.br-progress-fill`, `.br-fill-orange`
- Nav: `.br-nav`, `.br-nav-inner`, `.br-nav-brand`
- Modal: `.br-modal-overlay`, `.br-modal`, `.br-modal-close`
- Gráficas: `.br-chart-wrap`, `.br-chart-header`
- Animaciones: `.br-anim-fade-up`, `.br-pulse`, `.br-skeleton`, `.br-spinner`
- Utilidades: `.br-text-orange`, `.br-text-green`, `.br-mt-*`, `.br-mb-*`, etc.

### FUENTES A AGREGAR

En el `<head>` del HTML principal (o en el entry point si es un framework):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
```

### TAREAS EN ORDEN

**TAREA 1 — Importar el design system**

Importa `bitcoin-retiro-design-system.css` en el entry point correcto del proyecto (antes de cualquier otro CSS propio del proyecto).

Si el proyecto es HTML vanilla: añade `<link rel="stylesheet" href="bitcoin-retiro-design-system.css">` en el `<head>`, antes del CSS actual.

Si es Vite/React/Next: añade `import './bitcoin-retiro-design-system.css'` al inicio del archivo entry (main.js, App.jsx, _app.js, etc.).

---

**TAREA 2 — Agregar el div de atmósfera**

Dentro del `<body>` (o en el componente raíz), como primer hijo, añade:
```html
<div class="br-mesh" aria-hidden="true"></div>
```

---

**TAREA 3 — Migrar la navegación / topbar**

Encuentra el header o nav principal. Aplica estas clases:
- Elemento `<nav>` o `<header>`: añade clase `br-nav`
- Contenedor interno: añade clase `br-nav-inner br-container`
- Logo/brand link: añade clase `br-nav-brand`
- Texto del brand: enciérralo en `<span class="br-nav-brand-text">Bitcoin <span>Retiro</span></span>`
- Links de navegación: añade clase `br-nav-link`
- Botón de Premium/Lightning: reemplaza clases por `br-btn br-btn-lightning br-btn-sm`
- Selector de idioma: aplica `.br-select` si es un `<select>`, o `.br-segmented` si son botones

---

**TAREA 4 — Migrar el formulario principal**

Encuentra el formulario con los inputs de la calculadora (ahorro inicial, aporte, horizonte, rendimiento, inflación).

Para cada campo:
1. Envuelve label + input en `<div class="br-field">`
2. Al `<label>`: añade clase `br-field-label`
3. Si el input tiene un prefijo ($ o ₿ o %):
   - Envuelve el input en `<div class="br-input-wrap">`
   - Añade `<span class="br-input-prefix">$</span>` (o el símbolo que corresponda) antes del input
   - Al input: añade clase `br-input`
4. Si no tiene prefijo: al input añade solo `br-input`
5. A los `<select>`: aplica clase `br-select`
6. Para los controles de tipo Mensual/Semanal/Diario: si son botones tipo radio, aplica `.br-segmented`
7. Para cada slider `<input type="range">`:
   - Envuelve en `<div class="br-slider-field">`
   - Añade header: `<div class="br-slider-header"><span class="br-slider-label">etiqueta</span><span class="br-slider-value" id="val-X">valor</span></div>`
   - Al input range: añade clase `br-range`
   - Si hay hints de mín/máx: añade `<div class="br-slider-hints"><span>conservador</span><span>agresivo</span></div>`

---

**TAREA 5 — Migrar los botones**

Mapeo de botones:

| Botón actual          | Clase nueva                          |
|-----------------------|--------------------------------------|
| CTA principal "Calcular" | `br-btn br-btn-primary br-btn-full` |
| "Ver proyecciones"    | `br-btn br-btn-secondary`            |
| "Resetear"            | `br-btn br-btn-ghost br-btn-sm`      |
| "Exportar PDF"        | `br-btn br-btn-gold`                 |
| "⚡ Desbloquear Premium" | `br-btn br-btn-lightning`         |
| "Comprar en Aureo"    | `br-btn br-btn-secondary br-btn-sm`  |

Añade `br-pulse` al botón principal de calcular.

---

**TAREA 6 — Migrar la sección de resultados**

Encuentra el bloque donde se muestran los resultados (saldo BTC, equivalente USD, total invertido, ganancia neta, poder adquisitivo real).

1. Envuelve el bloque en `<div class="br-card br-card-glow">`
2. El resultado principal (saldo BTC): usa `<div class="br-card-result">` con estructura:
   ```html
   <div class="br-label-muted">Saldo final en BTC</div>
   <div class="br-data" id="resultado-btc">—</div>
   <div class="br-disclaimer">≈ <span id="resultado-usd">—</span></div>
   ```
3. Cada métrica secundaria: convierte en `<div class="br-stat">`:
   ```html
   <div class="br-stat">
     <div class="br-stat-label">Total invertido</div>
     <div class="br-stat-value muted" id="total-invertido">—</div>
   </div>
   ```
4. Añade clase `green` a ganancia neta, `gold` a poder adquisitivo.

---

**TAREA 7 — Migrar la sección de escenarios (Conservador / Moderado / Agresivo)**

Cada escenario: convierte en `<div class="br-card">` con chips:
```html
<div class="br-card">
  <div class="br-row br-row-between br-mb-4">
    <span class="br-chip br-chip-muted">🐢 Conservador</span>
    <span class="br-stat-value muted" id="esc-conservador">—</span>
  </div>
</div>
```

---

**TAREA 8 — Migrar chips y badges existentes**

Cualquier badge, pill, tag o etiqueta de estado existente:
- Estado positivo → `br-chip br-chip-green`
- Estado negativo → `br-chip br-chip-red`
- BTC / cripto → `br-chip br-chip-orange`
- Premium / Gold → `br-chip br-chip-gold`
- Lightning → `br-chip br-chip-lightning`
- Neutro → `br-chip br-chip-muted`

---

**TAREA 9 — Migrar el modal de Premium**

Al overlay del modal: añade clase `br-modal-overlay`
Al contenedor del modal: añade clase `br-modal`
Al botón de cierre (×): añade clase `br-modal-close`

El toggle de abrir/cerrar debe añadir/quitar la clase `open` al overlay.

---

**TAREA 10 — Migrar las gráficas**

Para cada contenedor de gráfica (Chart.js canvas u otra librería):
```html
<div class="br-chart-wrap">
  <div class="br-chart-header">
    <span class="br-chart-title">Proyección de crecimiento ₿</span>
    <div class="br-chart-legend">
      <span class="br-legend-item">
        <span class="br-legend-dot" style="background:var(--br-orange)"></span>
        Proyectado
      </span>
    </div>
  </div>
  <canvas id="grafica-retiro"></canvas>
</div>
```

En los options de Chart.js, actualiza los colores usando estas variables como valores literales:
- Grid lines: `rgba(42, 42, 66, 0.8)`
- Tick labels: `#7070A0`
- Línea principal: `#F7931A`
- Área bajo la línea: `rgba(247, 147, 26, 0.10)`
- Tooltip background: `#1C1C30`
- Tooltip border: `#2A2A42`

---

**TAREA 11 — Tipografía hero y títulos de sección**

- Título principal de la página: añade clase `br-display`
- Subtítulo descriptivo: añade clase `br-body`
- Títulos de sección ("Tu plan de retiro", "Tu proyección", etc.): añade clase `br-headline`
- Eyebrow labels encima de títulos: añade clase `br-label`
- Disclaimer final: añade clase `br-disclaimer`

---

**TAREA 12 — Animaciones de entrada**

A los bloques principales (hero, formulario, resultados) añade `br-anim-fade-up` con delays escalonados:
- Hero: `br-anim-fade-up`
- Formulario: `br-anim-fade-up br-anim-fade-up-1`
- Resultados: `br-anim-fade-up br-anim-fade-up-2`

Mientras los resultados no estén calculados, los valores `—` pueden tener clase `br-skeleton` aplicada con JS al elemento.

---

**TAREA 13 — Limpieza de CSS antiguo**

Después de completar las tareas anteriores:
1. Revisa el CSS anterior del proyecto
2. Elimina cualquier regla duplicada que ya esté cubierta por el design system
3. Conserva ÚNICAMENTE:
   - Lógica de JavaScript (cálculos, eventos, storage, Lightning)
   - Cualquier estilo muy específico de la app que no esté en el design system (animaciones propias de la gráfica, etc.)
4. No toques: funciones de cálculo, WebLN, Nostr, Fedi SDK, localStorage, ningún event listener

---

### REGLAS GENERALES

- **No romper nada:** si un elemento tiene lógica JS atada a una clase o ID, no cambies esa clase/ID — solo añade las nuevas clases del design system.
- **Prefijo seguro:** todas las clases del design system usan prefijo `br-`, no colisionan con clases existentes.
- **Mobile first:** el design system ya tiene breakpoints en 768px. No es necesario añadir media queries extra salvo casos muy específicos.
- **Variables sobre valores hardcoded:** nunca uses colores hex directamente en el HTML o en JS. Usa `var(--br-orange)` etc.
- **Preservar IDs:** todos los `id=""` usados por JS deben mantenerse intactos.

---

### VERIFICACIÓN FINAL

Después de aplicar todos los cambios, verifica:
- [ ] La calculadora calcula correctamente
- [ ] El flujo de Premium / Lightning sigue funcionando
- [ ] Los sliders actualizan los valores en pantalla
- [ ] Las gráficas renderizan con los nuevos colores
- [ ] El modal de Premium abre y cierra
- [ ] La exportación PDF funciona
- [ ] El selector de idioma funciona
- [ ] La app es responsive en móvil
- [ ] No hay errores en la consola del navegador

---

Empieza leyendo la estructura del proyecto para identificar el stack y los archivos principales, luego ejecuta las tareas en orden.
