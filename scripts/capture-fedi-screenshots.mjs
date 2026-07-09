#!/usr/bin/env node
/**
 * Captura screenshots reales de retirobtc.mx/calc para catálogo Fedi.
 * Uso: node scripts/capture-fedi-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'screenshots', 'fedi');

const BASE =
  'https://www.retirobtc.mx/calc/?autocalc=0&initial=500&contribution=100&years=15&return=15&currency=USD';

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'es-MX',
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });

    // Español
    await page.selectOption('#input-lang', 'es');

    // Tema oscuro (toggle si está en claro)
    const htmlTheme = await page.getAttribute('html', 'data-theme');
    if (htmlTheme !== 'dark') {
      await page.click('#btn-theme');
      await page.waitForTimeout(300);
    }

    // 1) Formulario
    const calc = page.locator('#calculator');
    await calc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await calc.screenshot({
      path: path.join(OUT_DIR, 'calc-input-dark.png'),
    });
    console.log('OK calc-input-dark.png');

    // 2) Calcular y resultados
    await page.click('#btn-calculate');
    await page.waitForSelector('#results:not(.hidden)', { timeout: 15000 });
    await page.waitForTimeout(800);

    const results = page.locator('#results');
    await results.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await results.screenshot({
      path: path.join(OUT_DIR, 'calc-result-dark.png'),
    });
    console.log('OK calc-result-dark.png');

    // 3) Comparador AFORE
    const afore = page.locator('#afore-comparison');
    await page.waitForSelector('#afore-comparison:not(.hidden)', { timeout: 10000 });
    await afore.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await afore.screenshot({
      path: path.join(OUT_DIR, 'calc-afore-dark.png'),
    });
    console.log('OK calc-afore-dark.png');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
