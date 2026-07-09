# Calculadora de Retiro Bitcoin — Fedi Mini App

Planifica tu independencia financiera con Bitcoin. Una Single Page Application (SPA) diseñada como Mini App para [Fedi.xyz](https://fedi.xyz) con soporte para pagos Lightning Network.

### Documentación de producto

| Documento | Uso |
|-----------|-----|
| [`docs/product-brief.md`](docs/product-brief.md) | Resumen operativo: personas, roadmap, KPIs, decisiones de producto |
| [`docs/estudio-mercado-calculadora-retiro-bitcoin.md`](docs/estudio-mercado-calculadora-retiro-bitcoin.md) | Estudio de mercado completo (México/LATAM, Fedi, 2026) |
| [`docs/agentes-ia-arquitectura.md`](docs/agentes-ia-arquitectura.md) | Ecosistema agentes IA: Rito, leads, RAG, monitor legal |
| [`agents/README.md`](agents/README.md) | Deploy y env vars del servicio Next.js de agentes |

La regla de Cursor [`.cursor/rules/producto-estudio-mercado.mdc`](.cursor/rules/producto-estudio-mercado.mdc) carga este contexto en cada sesión del agente.

---

## Estructura del proyecto

```
├── index.html      # Landing institucional (en producción sirve exactamente la ruta /)
├── landing.html    # Alias legacy → redirección y meta refresh al inicio /
├── calc/index.html # SPA calculadora (producción: /calc y /calc/)
├── brujula.html    # Página embudo «Encuentra tu norte financiero» (/brujula)
├── vercel.json     # Redirect legados (/landing.html, /index.html → /); rewrites sólo /brujula
├── style.css       # Estilos (dark/light, mobile-first, brutalist-minimal)
├── styles/         # Design system + landing.css
├── assets/         # logo-app.png (banner nav), logo-fedi-*.png (ícono Fedi/PWA), logo.svg (favicon)
├── script.js       # Lógica: cálculos, gráficas, Fedi/WebLN, premium
├── manifest.json   # PWA manifest
├── package.json    # Dependencias npm (SDK Mercado Pago para APIs serverless)
├── api/            # Serverless: Mercado Pago (preferencia, verificación), LNbits, webhook MP
├── agents/         # Servicio Next.js: Rito, leads, RAG, cron DOF (deploy: agents.retirobtc.mx)
├── agents-config.js # URL del servicio de agentes (prod vs local)
├── rito-loader.js  # Carga widget Rito en landing, calc, brújula
├── docs/           # Estudio de mercado, product brief, arquitectura agentes
├── .cursor/rules/  # Reglas de contexto para Cursor (producto, etc.)
├── .env.example    # Plantilla de variables (copiar a .env.local)
└── README.md       # Esta documentación
```

## Entorno de desarrollo (Node.js + Mercado Pago SDK)

La integración de pagos con **Mercado Pago** usa el [SDK oficial para Node.js](https://www.npmjs.com/package/mercadopago) en las rutas `/api/*` (Vercel). El frontend sigue siendo HTML/JS estático.

**Requisitos:** Node.js **18** o superior (ver `.nvmrc`).

1. Instalar dependencias (incluye `mercadopago`):

   ```bash
   cd "Calculadora de Retiro Bitcoin_Fedi catalogo"
   npm install
   ```

2. Variables de entorno locales: copia `.env.example` a `.env.local` y pega tus **credenciales de prueba** desde [Tus integraciones](https://www.mercadopago.com.mx/developers/panel/app) (Public Key y Access Token de prueba).

3. Para probar endpoints que usen el SDK en local, usa [Vercel CLI](https://vercel.com/docs/cli) (`vercel dev`), que inyecta variables y ejecuta las funciones en `/api` igual que en producción.

El **Access Token** solo debe existir en el servidor o en `.env.local` / panel de Vercel; no lo pongas en `script.js` ni en el repositorio.

### Linux / WSL — checklist (entorno reproducible)

Usa estos pasos cuando desarrolles desde **Ubuntu (WSL)** u otro Linux para que coincida el comportamiento con `README` / Vercel. **GitHub no cambia** por usar WSL; el deploy en producción solo cambia cuando haces push y/o despliegue explícito.

1. **Clonar el repo dentro de Linux** (`~/proyectos/…`) cuando puedas (mejor rendimiento de E/S que solo trabajar desde `/mnt/c/...`; si igual usas disco Windows, igual funciona pero puede ser más lento).
2. **Abrir terminal en la raíz del repo**: el directorio donde está `vercel.json` (ej. `ls vercel.json` debe existir).
3. **Node 18 o superior**, alineado con [`.nvmrc`](./.nvmrc) (`nvm install` / `nvm use` si usas `nvm`):
   ```bash
   node -v    # debe ser >= 18
   ```
4. **Instalar dependencias**:
   ```bash
   npm install
   ```
5. **Variables locales**: copia `.env.example` → `.env.local` en esa misma raíz; rellena `MERCADOPAGO_ACCESS_TOKEN_TEST` (y demás vars). No subas `.env.local` a Git (está en `.gitignore`).
6. **`APP_BASE_URL` en local**: mismo origen que muestre el navegador, con **http** y el **puerto** que imprima `vercel dev` (ej. `http://127.0.0.1:3000`).
7. **Mercado Pago / APIs**: ejecuta **`npx vercel dev`** desde la raíz para que carguen `.env.local` y existan rutas `/api/*`. Si editas `.env.local`, **reinicia** el proceso.
8. **Vercel CLI en clone nuevo**: si no trajiste `.vercel/`, ejecuta [`vercel link`](https://vercel.com/docs/cli/link) una vez (`npx vercel link`). No borra tu proyecto remoto en Vercel; solo enlaza esta copia local.
9. **Probar sólo frontend estático**: si usas Python Live Server / `serve` / Live Server sin `vercel dev`, **las rutas `/api/*` no existen** ahí — el Premium con Mercado Pago requiere el paso 7.

### Checkout Pro (preferencia de pago)

El flujo premium usa la API de **preferencias** del SDK (`/api/create-preference`). Tras crear la preferencia, el usuario es redirigido al checkout de Mercado Pago. Al volver, la app llama a `/api/verify-mp-payment` con el `payment_id` de la URL para confirmar el pago y activar Premium.

Variables recomendadas en Vercel:

| Variable | Descripción |
|----------|-------------|
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token de producción (o prueba en desarrollo) |
| `APP_BASE_URL` | URL pública `https://...` (back_urls y webhook) |
| `MERCADOPAGO_PRICE_MONTHLY_MXN` | Precio del ítem mensual en MXN (default 20) |
| `MERCADOPAGO_PRICE_LIFETIME_MXN` | Precio del ítem de por vida en MXN (default 200) |

Configura la **URL de notificaciones** en el panel de Mercado Pago apuntando a `https://retirobtc.mx/api/mp-webhook` (opcional para registrar eventos; la activación inmediata usa la verificación al volver del checkout).

Antes del redirect el modal pide **correo válido**: se envía como `payer.email` en la preferencia para que Checkout Pro pueda habilitar flujos que lo exigen (p. ej. **SPEI**). Si ahí igual no avanza **“Meses sin tarjeta” / financiamiento**, suele ser **monto mínimo** por producto Mercado Crédito o permisos de la cuenta (prueba temporalmente subiendo `MERCADOPAGO_PRICE_*_MXN`; el plan mensual por defecto en MXN puede quedar muy bajo para ese medio).

**Pantalla en blanco o solo iconito de reCAPTCHA** en `mercadopago.com.mx/checkout/...`: el checkout de MP usa Google reCAPTCHA; **Brave Escudos**, bloqueadores, extensiones de privacidad o **ventana privada** suelen impedir cargar el desafío. Prueba Escudos **apagados** para `mercadopago.com.mx` (y permisos a `google.com` / contenido incrustado si el navegador lo pide), o el mismo flujo en **Chrome sin extensiones** y sin incógnito para descartar el bloqueo.

**«Revisa tu pago», OXXO y «Pagar» gris**: baja hasta el final del formulario antes de clicar; suele aparecer una **casilla de términos** y/o hay que cerrar **reCAPTCHA**. **Brave Escudos** o extensiones pueden impedir que el JS habilite **Pagar**. Esta app ya **no manda opciones sólo-de-cuotas** en la preferencia (eso podía trabar rutas efectivo); **redespliega** con el último cambio antes de repetir la prueba.

Para volver a **Lightning** en lugar de Mercado Pago, en `script.js` pon `PAYMENT_USE_MERCADOPAGO = false`.

## Funcionalidades

### Versión Gratuita
- Proyección de retiro con ahorro inicial + aportes periódicos
- Soporte para USD, MXN, BTC y sats
- Aportes diarios, semanales o mensuales
- Rendimiento anual configurable (3%–30%)
- Ajuste por inflación local
- Gráfica interactiva (Chart.js)
- Compartir resultados como texto

### Versión Premium (pago vía Mercado Pago — Checkout Pro)
- Comparar 3 escenarios (conservador, moderado, agresivo)
- Simulación de retiro (Safe Withdrawal Rate — 4%)
- Guardar planes en localStorage cifrado
- Exportar reporte PDF profesional
- Sin anuncios

### Integración Fedi.xyz
- Detecta `window.fedi` para preferencias de moneda
- Pagos Premium vía Mercado Pago (Checkout Pro); opcional Lightning si desactivas Mercado Pago en código
- Usa `window.nostr` para guardar planes (NIP-78)
- Funciona standalone si no hay Fedi

---

## Probar localmente

### Landing y páginas estáticas

Abre **`index.html`** (landing), **`calc/index.html`** (calculadora) o **`brujula.html`**. Rutas **`/`**, **`/calc`** y **`/brujula`** en producción o con **`npx vercel dev`** (lee `vercel.json`). Sin Vercel, usa las rutas archivo indicadas.

### Opción 1: Servidor simple con Python

**Windows (PowerShell o CMD),** dentro de la carpeta del proyecto:

```powershell
cd "c:\Users\edgar\Calculadora de Retiro Bitcoin_Fedi catalogo"
python -m http.server 8080
```

**Linux nativo / WSL (bash):** no uses rutas tipo `c:\...`; monta Windows como `/mnt/c/`. En Ubuntu suele estar solo **`python3`**, no **`python`**:

```bash
cd "/mnt/c/Users/edgar/Calculadora de Retiro Bitcoin_Fedi catalogo"
python3 -m http.server 8080
```

Abre **`http://127.0.0.1:8080/index.html`** (landing), **`…/calc/index.html`** (calculadora) o **`…/brujula.html`**. Si abres sólo **`/`**, el listado depende del servidor (no equivale siempre al landing si no está configurado como índice).

### Opción 2: Live Server (VS Code)

1. Instala la extensión **Live Server** en VS Code/Cursor
2. Click derecho en **`calc/index.html`** → **Open with Live Server** para el flujo cercano a producción (**`/calc`**), o en **`index.html`** para trabajar sólo landing.

### Opción 3: npx serve

```bash
npx serve .
```

---

## Desplegar en Vercel

1. Instala [Vercel CLI](https://vercel.com/docs/cli):
   ```bash
   npm i -g vercel
   ```

2. Despliega:
   ```bash
   cd "Calculadora de Retiro Bitcoin_Fedi catalogo"
   vercel
   ```

3. Sigue las instrucciones. Vercel detectará los archivos estáticos automáticamente.

4. Tu app tendrá una URL tipo `https://tu-proyecto.vercel.app`, o tu dominio propio (ej. producción **`https://retirobtc.mx`**).

### Dominio personalizado (HTTPS propio)

Producción actual: **`https://retirobtc.mx`** (apex). Checklist cuando añadas o muevas dominio:

1. En [Vercel](https://vercel.com/dashboard) → tu proyecto → **Settings** → **Domains** → **Add** (`retirobtc.mx`, `www` opcional si aplica).
2. En el **registrar**, los registros **A/CNAME** que indique Vercel hasta estado **Valid** (SSL automático).
3. Variables **Environment**: `APP_BASE_URL` = `https://retirobtc.mx` (sin barra final), alineado con el origen desde el que cargan los usuarios.
4. Mercado Pago → **URL de notificaciones**: `https://retirobtc.mx/api/mp-webhook`.
5. **Fedi Mini App (catálogo):** usa la URL **`https://retirobtc.mx/calc`** (la SPA). **`https://retirobtc.mx`** es landing; **`https://retirobtc.mx/brujula`** embudo/educativo.

**Rutas en producción (Vercel):** **`/`** sirve **`index.html`** del raíz (**landing**, no se usa rewrite porque Vercel resuelve `index.html` primero). **`/calc`** sirve **`calc/index.html`**. **`/brujula`** tiene rewrite explícito a **`brujula.html`**.

**Redirecciones 301:** `/landing.html` → `/`; `/index.html` → `/`. El archivo **`landing.html`** sólo existe como salvavidas (**meta refresh**) y compatibilidad; el mensaje institucional vive en **`index.html`** en la raíz.

En servidor estático plano (**`python -m http.server`**), navega archivo por archivo (véase arriba).

Tras cambiar variables, **Redeploy** desde Vercel.

### Desplegar en Netlify

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Arrastra la carpeta del proyecto al panel de Netlify
3. Tu app estará lista en segundos

---

## Emular entorno Fedi (para desarrollo)

Abre la consola del navegador (F12) y ejecuta antes de cargar la app:

```javascript
// Simular Fedi
window.fedi = {
  getPreferences: async () => ({ currency: 'MXN' })
};

// Simular WebLN
window.webln = {
  enable: async () => true,
  sendPayment: async (invoice) => {
    console.log('Payment sent:', invoice);
    return { preimage: 'demo_preimage_123' };
  },
  makeInvoice: async ({ amount, defaultMemo }) => {
    console.log('Invoice created:', amount, defaultMemo);
    return { paymentRequest: `lnbc${amount}n1demo` };
  }
};

// Simular Nostr (NIP-07)
window.nostr = {
  getPublicKey: async () => 'npub1demo...',
  signEvent: async (event) => ({ ...event, sig: 'demo_sig' })
};
```

Luego recarga la página. Verás el banner "Conectado a Fedi".

### Activar Premium para pruebas

```javascript
localStorage.setItem('btc_retirement_premium', JSON.stringify({
  type: 'lifetime',
  activated: new Date().toISOString()
}));
location.reload();
```

---

## Integración con Fedi.xyz — Catálogo de Mini Apps

### Requisitos para publicar

1. La app debe ser una URL pública accesible (HTTPS)
2. Debe ser responsiva y mobile-first
3. No debe requerir backend propio (funciona offline)

### Formulario de envío

Para enviar tu Mini App al catálogo de Fedi:

1. Despliega la app en Vercel/Netlify (obtén la URL pública)
2. Ve a la [página de desarrolladores de Fedi](https://www.fedi.xyz/developers)
3. Completa el formulario con:
   - **Nombre**: Calculadora de Retiro Bitcoin
   - **URL** (Mini App): `https://retirobtc.mx/calc`
   - **Icono** (`iconUrl`): `https://retirobtc.mx/assets/logo-fedi-512.png` (cuadrado, brújula v2, fondo navy)
   - **Descripción**: Planifica tu independencia financiera con Bitcoin. Proyecta tu retiro con ahorro periódico, múltiples escenarios y simulación de retiro.
   - **Categoría**: Finance / Tools
   - **Idiomas**: Español
   - **Permisos requeridos**: `webln` (para pagos Premium)
   - **Captura de pantalla**: Incluye screenshots de la app en modo oscuro y claro (`assets/screenshots/fedi/`)

**Íconos en el repo:** el banner horizontal `logo-app.png` es para nav/landing; el **catálogo Fedi y PWA** usan `logo-fedi-512.png` (solo brújula). Regenerar con `python scripts/make-fedi-icon.py`.

PR al catálogo oficial: ver [`docs/fedi-catalog-pr.md`](docs/fedi-catalog-pr.md).

### APIs de Fedi utilizadas

| API | Uso | Requerido |
|-----|-----|-----------|
| `window.fedi` | Preferencias de moneda del usuario | No |
| `window.webln` | Pagos Lightning para Premium | No (funciona sin Fedi) |
| `window.nostr` | Guardar planes en Nostr (NIP-78) | No |

---

## Variables de entorno

**No se requieren variables de entorno.** Todo funciona client-side.

La app usa la API pública de CoinGecko para el precio de BTC. Si la API falla, usa precios por defecto ($65,000 USD).

---

## Modelo de monetización

| Plan | Precio | Duración |
|------|--------|----------|
| Mensual | ~$3 USD (en sats) | 30 días |
| Perpetuo | ~$15 USD (en sats) | Para siempre |

Los pagos se procesan vía Lightning Network usando WebLN.

---

## Estrategia de marketing (30 días)

> Plan detallado, personas y campaña **«Tu AFORE Soberana»**: ver [`docs/product-brief.md`](docs/product-brief.md) (secciones 9–10).

### Semana 1: Lanzamiento
- Publicar en Twitter/X con hashtags: #Bitcoin #Fedi #LightningNetwork #RetiroBTC
- Post en comunidades de Telegram de Bitcoin LATAM
- Enviar al catálogo de Fedi Mini Apps
- Thread explicando el modelo freemium + Lightning
- Narrativa Ley de Infraestructura 2026 / soberanía vs AFORE (ver estudio de mercado)

### Semana 2: Contenido educativo
- Tutorial en video: "Cómo planificar tu retiro con Bitcoin en 5 minutos"
- Infografía comparativa: ahorro en BTC vs ahorro tradicional
- AMA en Nostr sobre planificación financiera con Bitcoin

### Semana 3: Comunidad
- Challenge: "Comparte tu proyección de retiro" (usando el botón compartir)
- Colaborar con podcasters de Bitcoin en español
- Guest post en blogs de finanzas personales LATAM

### Semana 4: Iteración
- Recoger feedback de usuarios de Fedi
- Publicar actualización con mejoras (basada en feedback)
- Caso de uso: "Cómo un freemium en Lightning genera ingresos pasivos"
- Métricas: compartir números de conversión free→premium

### KPIs a trackear
- Descargas / visitas únicas
- Conversión free → premium
- Retención a 7 días
- Compartidos (shares) generados
- Revenue en sats

---

## Stack técnico

- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- **Gráficas**: Chart.js v4
- **PDF**: jsPDF v2
- **Pagos**: WebLN (Lightning Network)
- **Identidad**: Nostr (NIP-07, NIP-78)
- **Almacenamiento**: localStorage
- **Precio BTC**: CoinGecko API (pública, sin API key)

---

## Agentes IA (Rito)

El front estático integra **Rito** (chat 24/7) y captura de leads del formulario guía en `/brujula` vía el servicio en [`agents/`](agents/).

| Componente | Descripción |
|------------|-------------|
| `agents-config.js` | URL prod (`https://agents.retirobtc.mx`) vs local (`http://localhost:3000`) |
| `rito-loader.js` | Carga el widget desde el servicio de agentes |
| `brujula-quiz.js` | `POST /api/leads` al enviar la guía |

**Deploy:** proyecto Vercel separado con root `agents/`. Ver [`agents/README.md`](agents/README.md) y [`docs/agentes-ia-arquitectura.md`](docs/agentes-ia-arquitectura.md).

---

## Licencia

MIT — Úsalo, modifícalo, compártelo. Hecho con ₿ para la comunidad Fedi.
