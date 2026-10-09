# Proposal: Publicar el juego en GitHub Pages con el despliegue oficial por Actions

## Problem

El sitio de GitHub Pages del proyecto (`https://ancletoceo.github.io/Coffee-World/`) **sólo muestra el README** renderizado en lugar del juego jugable.

### Evidencia

1. **La fuente de Pages apunta a la rama equivocada.** La configuración de GitHub Pages del repo es:

   ```json
   {
     "status": "built",
     "build_type": "legacy",
     "source": { "branch": "main", "path": "/" }
   }
   ```

   Con `source.branch = main` y `path = /`, Pages sirve la **raíz de `main`**. Ahí no existe `index.html`; el único Markdown renderizable es `README.md`, que es lo que se ve publicado.

2. **El workflow despliega a una rama que Pages ignora.** `.github/workflows/deploy-pages.yml:56-61` publica el build en la rama `gh-pages` con `JamesIves/github-pages-deploy-action@v4`, pero Pages nunca lee esa rama. El deploy tiene éxito pero no tiene efecto visible.

3. **Ruta de artefacto incorrecta (defecto latente).** El mismo paso usa `folder: angular-app/dist/angular-app` (`.github/workflows/deploy-pages.yml:60`). El builder de aplicaciones de Angular 21 deja el `index.html` en la subcarpeta `browser/`. Confirmado en la rama `gh-pages`:

   ```
   gh-pages/ (raíz)          ← sin index.html
     browser/index.html      ← index.html real, anidado
     3rdpartylicenses.txt
     prerendered-routes.json
   ```

   Por esto, incluso apuntando Pages a `gh-pages`, el sitio devolvería **404** (no hay `index.html` en la raíz de la rama).

`--base-href ./` (`.github/workflows/deploy-pages.yml:54`) ya es correcto para project pages en subruta, no requiere cambios.

## Proposed change

**Opción 2 — migrar al despliegue oficial de GitHub Pages basado en Actions** (elimina la rama `gh-pages` y el action de terceros):

1. Reescribir el job `deploy` de `.github/workflows/deploy-pages.yml` para usar el flujo oficial:
   - `actions/configure-pages@v5` (con `enablement: true` para fijar la fuente en `workflow` sin clic manual).
   - Build de Angular con `--base-href ./` (sin cambios).
   - `actions/upload-pages-artifact@v3` con `path: angular-app/dist/angular-app/browser` — **la subcarpeta `browser/`**, corrigiendo el defecto 3.
   - `actions/deploy-pages@v4` para publicar el artefacto.
2. Declarar `environment: github-pages` en el job `deploy` para obtener la URL de despliegue y usar `permissions: { pages: write, id-token: write }`.
3. Cambiar la fuente de Pages a **GitHub Actions** (`build_type: workflow`) y dejar de publicar en la rama `gh-pages`.
4. (Opcional) Eliminar la rama `gh-pages` huérfana una vez verificado el nuevo despliegue.

## Scope

### In scope
- `.github/workflows/deploy-pages.yml`: reescribir el job `deploy` con las acciones oficiales y la ruta `browser/`.
- Fuente de Pages en `workflow` (vía `configure-pages` o un ajuste único en Settings).
- Verificar que el sitio publicado sirva el juego en la raíz del subpath.

### Out of scope
- Código de la aplicación Angular (`angular-app/src/**`) y su build.
- El job `test` y el workflow `auto-version.yml`.
- Cambios de diseño, contenido o funcionalidad del juego.

## Risks
- **La fuente de Pages es un ajuste del repositorio, no del código:** versionarlo en el YAML es imposible; se resuelve con `enablement: true` de `configure-pages` (requiere permisos válidos) o un clic único en **Settings → Pages → Source: GitHub Actions**. Verificar tras el primer deploy.
- **Rama `gh-pages` huérfana:** puede confundir a futuro; eliminarla en cuanto el despliegue por Actions esté confirmado.
- **Cambio de estrategia de deploy:** si el nuevo flujo falla (permisos/entorno), el sitio dejaría de actualizarse; mantener una verificación explícita de la URL al final del job y un rollback documentado (volver a apuntar la fuente a `gh-pages`).
- **Ruta `browser/` dependiente del builder:** si se cambia el builder o la config de salida (`angular.json`), revisar el `outputPath` antes de asumir `browser/`.
