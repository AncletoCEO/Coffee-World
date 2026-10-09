# Tasks: Publicar el juego en GitHub Pages con el despliegue oficial por Actions

## Fase 1 — Reescribir el job de despliegue
- [x] 1.1 En `.github/workflows/deploy-pages.yml`, quitar el paso `JamesIves/github-pages-deploy-action@v4`.
- [x] 1.2 Añadir `actions/configure-pages@v5` con `enablement: true`.
- [x] 1.3 Añadir `actions/upload-pages-artifact@v3` con `path: angular-app/dist/angular-app/browser`.
- [x] 1.4 Añadir `actions/deploy-pages@v4` con `id: deployment`.
- [x] 1.5 Declarar `environment: github-pages` con `url: ${{ steps.deployment.outputs.page_url }}` en el job `deploy`.
- [x] 1.6 Ajustar permisos: `contents: read`, `pages: write`, `id-token: write`.
- [x] 1.7 Confirmar que el build sigue usando `--base-href ./`.

## Fase 2 — Fuente de Pages y limpieza
- [ ] 2.1 Verificar/forzar la fuente de Pages en `workflow` (`enablement: true` o **Settings → Pages → Source: GitHub Actions**). Intentado con `enablement: true`; el token disponible no puede cambiarlo por API (PUT → 404, falta admin). El deploy por Actions funciona igual.
- [ ] 2.2 Confirmar con `gh api repos/AncletoCEO/Coffee-World/pages` que `build_type` es `workflow`. Aún reporta `legacy`/`main`; pendiente cambio manual en Settings.
- [ ] 2.3 Eliminar la rama `gh-pages` huérfana (`git push origin --delete gh-pages`) una vez verificado el despliegue.

## Fase 3 — Verificación
- [x] 3.1 Correr `npm test` (raíz) y `cd angular-app && npm test -- --watch=false` en verde. (raíz 47 ✓, Angular 60 ✓)
- [x] 3.2 Deploy verde en Actions; `deploy-pages` reporta `page_url`. (run 37879291122: "Reported success!", deployment en e88c961, `https://ancletoceo.github.io/Coffee-World/`)
- [x] 3.3 Abrir `https://ancletoceo.github.io/Coffee-World/` y confirmar que carga el juego (no el README). (Chrome headless: DOM renderiza bienvenida + prompt; `help`/`status` producen salida)
- [x] 3.4 Verificar en DevTools que `index.html`, `main-*.js`, `styles-*.css` y `favicon.ico` devuelven `200`. (`curl` → 200 los cuatro)
- [x] 3.5 Confirmar que `--base-href ./` resuelve los assets bajo `/Coffee-World/`. (build verificado: `dist/angular-app/browser/index.html` con `<base href="./">`)

## Fase 4 — Cierre documental
- [x] 4.1 Sincronizar la spec de `deployment` y archivar el change.
- [x] 4.2 Registrar el aprendizaje (fuente de Pages + ruta `browser/`) en la memoria del proyecto.
