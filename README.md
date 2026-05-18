# Calculadora de Retiro Bitcoin — Fedi Mini App

Planifica tu independencia financiera con Bitcoin. Una Single Page Application (SPA) diseñada como Mini App para [Fedi.xyz](https://fedi.xyz) con soporte para pagos Lightning Network.

---

## Estructura del proyecto

```
├── index.html      # SPA principal (calculadora)
├── landing.html    # Página pública de marketing → enlace a la calculadora
├── style.css       # Estilos (dark/light, mobile-first, brutalist-minimal)
├── styles/         # Design system + landing.css
├── assets/         # logo-app.png (3D nav+hero), logo-192/512.png (PWA), logo.svg (favicon/tab vector)
├── script.js       # Lógica: cálculos, gráficas, Fedi/WebLN, premium
├── manifest.json   # PWA manifest
├── package.json    # Dependencias npm (SDK Mercado Pago para APIs serverless)
├── api/            # Serverless: Mercado Pago (preferencia, verificación), LNbits, webhook MP
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

### Landing pública

Abre `landing.html` en el navegador (misma raíz que `index.html`), por ejemplo con cualquiera de las opciones de abajo: `http://localhost:PORT/landing.html`. La calculadora sigue en `/` o `index.html`; el manifest PWA no cambia.

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

Abre http://localhost:8080 en tu navegador (landing: `/landing.html`).

### Opción 2: Live Server (VS Code)

1. Instala la extensión **Live Server** en VS Code/Cursor
2. Click derecho en `index.html` → **Open with Live Server**

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
5. **Fedi catálogo** / enlaces públicos: `https://retirobtc.mx` (calculadora) y opcional **`https://retirobtc.mx/landing.html`** para marketing.

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
   - **URL**: `https://retirobtc.mx`
   - **Descripción**: Planifica tu independencia financiera con Bitcoin. Proyecta tu retiro con ahorro periódico, múltiples escenarios y simulación de retiro.
   - **Categoría**: Finance / Tools
   - **Idiomas**: Español
   - **Permisos requeridos**: `webln` (para pagos Premium)
   - **Captura de pantalla**: Incluye screenshots de la app en modo oscuro y claro

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

### Semana 1: Lanzamiento
- Publicar en Twitter/X con hashtags: #Bitcoin #Fedi #LightningNetwork #RetiroBTC
- Post en comunidades de Telegram de Bitcoin LATAM
- Enviar al catálogo de Fedi Mini Apps
- Thread explicando el modelo freemium + Lightning

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

## Licencia

MIT — Úsalo, modifícalo, compártelo. Hecho con ₿ para la comunidad Fedi.
