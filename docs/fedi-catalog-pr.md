# PR — Catálogo Fedi (fedibtc/catalog)

## Archivo a añadir

Copiar [`fedi-catalog-retirobtc.json`](./fedi-catalog-retirobtc.json) como:

`mods/finance/retirobtc/meta.json`

(Ajustar sección `finance` según estructura actual del repo upstream.)

## Comandos

```bash
git clone https://github.com/fedibtc/catalog.git
cd catalog
git checkout -b feat/retirobtc
mkdir -p mods/finance/retirobtc
# copiar meta.json
git add mods/finance/retirobtc/meta.json
git commit -m "feat: add Calculadora de Retiro Bitcoin mini app (retirobtc.mx)"
git push -u origin feat/retirobtc
gh pr create --title "feat: retirobtc.mx — Calculadora de Retiro Bitcoin" --body "Mini App: https://retirobtc.mx/calc — proyección DCA en sats, México/LATAM."
```

## Formulario Google (alternativa / paralelo)

https://docs.google.com/forms/d/e/1FAIpQLSfrvsoeaNYiGhoc8QwzLXEi4zMFVyxpa4ufJFTwEHp97AeUmQ/viewform

| Campo | Valor |
|-------|--------|
| Nombre | Calculadora de Retiro Bitcoin |
| URL | https://retirobtc.mx/calc |
| Icono | https://retirobtc.mx/assets/logo-fedi-512.png |
| Descripción | Proyecta tu retiro en Bitcoin (sats). DCA, escenarios, regla 4%, comparador vs AFORE. |
| Categoría | Finance |

Screenshots: `assets/screenshots/fedi/` en el repo principal.
