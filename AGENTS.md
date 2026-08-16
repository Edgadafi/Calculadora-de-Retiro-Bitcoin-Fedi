# AGENTS.md

## Cursor Cloud specific instructions

Rito (chat) vive en el proyecto Vercel `retirobtc-agents`, no en el sitio estático. Cambios de tono o de `agents/public/widget/rito.js` solo se ven tras el deploy de ese servicio.

El widget se cachea 1 hora (`Cache-Control` en `agents/next.config.ts`). Si cambias el JS del chat, sube también `rito-loader.js` con un `?v=` nuevo para que el front estático pida el archivo fresco.

Comandos de agentes: `agents/README.md`. El loader usa `RETIROBTC_AGENTS_URL` de `agents-config.js` (en local apunta a `http://localhost:3000`).
