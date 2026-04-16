# Calculadora de Retiro Bitcoin — Fedi Mini App

Planifica tu independencia financiera con Bitcoin. Una Single Page Application (SPA) diseñada como Mini App para [Fedi.xyz](https://fedi.xyz) con soporte para pagos Lightning Network.

---

## Estructura del proyecto

```
├── index.html      # SPA principal
├── style.css       # Estilos (dark/light, mobile-first, brutalist-minimal)
├── script.js       # Lógica: cálculos, gráficas, Fedi/WebLN, premium
├── manifest.json   # PWA manifest
└── README.md       # Esta documentación
```

## Funcionalidades

### Versión Gratuita
- Proyección de retiro con ahorro inicial + aportes periódicos
- Soporte para USD, MXN, BTC y sats
- Aportes diarios, semanales o mensuales
- Rendimiento anual configurable (3%–30%)
- Ajuste por inflación local
- Gráfica interactiva (Chart.js)
- Compartir resultados como texto

### Versión Premium (pago vía Lightning)
- Comparar 3 escenarios (conservador, moderado, agresivo)
- Simulación de retiro (Safe Withdrawal Rate — 4%)
- Guardar planes en localStorage cifrado
- Exportar reporte PDF profesional
- Sin anuncios

### Integración Fedi.xyz
- Detecta `window.fedi` para preferencias de moneda
- Usa `window.webln` para pagos Lightning (Premium)
- Usa `window.nostr` para guardar planes (NIP-78)
- Funciona standalone si no hay Fedi

---

## Probar localmente

### Opción 1: Servidor simple con Python

```bash
cd "Calculadora de Retiro Bitcoin_Fedi catalogo"
python -m http.server 8080
```

Abre http://localhost:8080 en tu navegador.

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

4. Tu app estará en `https://tu-proyecto.vercel.app`

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
   - **URL**: `https://tu-deploy.vercel.app`
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
