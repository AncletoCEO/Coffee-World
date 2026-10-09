# Design: Publicar el juego en GitHub Pages con el despliegue oficial por Actions

## Approach

Sustituir el despliegue híbrido actual (terceros + rama `gh-pages`) por el **flujo oficial de GitHub Pages basado en Actions**. La clave es que GitHub Pages consuma el artefacto que produce el propio workflow, en lugar de una rama que nunca se lee.

Tres piezas:

1. **Artefacto correcto:** subir la **subcarpeta `browser/`** del build de Angular (donde vive el `index.html`), no la carpeta padre.
2. **Publicación oficial:** `actions/upload-pages-artifact` + `actions/deploy-pages`, con `environment: github-pages`.
3. **Fuente de Pages = workflow:** `actions/configure-pages@v5` con `enablement: true` (o un clic único en Settings) fija `build_type: workflow` y elimina la dependencia de `main/` y de `gh-pages`.

Sin rama `gh-pages`, sin action de terceros, menos partes móviles.

## Architecture

### Workflow objetivo (`.github/workflows/deploy-pages.yml`)

El job `test` no cambia. El job `deploy` se reescribe:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Angular app dependencies
        run: cd angular-app && npm ci

      - name: Build Angular app
        run: cd angular-app && npm run build -- --base-href ./

      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: angular-app/dist/angular-app/browser

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Notas de diseño:

- **`path: angular-app/dist/angular-app/browser`** corrige el defecto latente: `upload-pages-artifact` sube el contenido tal cual a la raíz del sitio, así que `index.html` queda en la raíz del subpath.
- **`enablement: true`** intenta poner la fuente de Pages en `workflow` sin intervención manual; si el token/entorno no lo permite, se hace una vez en **Settings → Pages → Source: GitHub Actions**.
- **`contents: write` ya no es necesario** (no se escribe a `gh-pages`); se baja a `read`.
- **`--base-href ./`** se mantiene: el sitio vive en el subpath `/Coffee-World/`.
- Se elimina por completo `JamesIves/github-pages-deploy-action@v4` y la rama `gh-pages`.

### Separación de responsabilidades

| Responsabilidad | Antes | Después |
|---|---|---|
| Compilar | Angular en el job `deploy` | igual |
| Empaquetar sitio | action de terceros → rama `gh-pages` | `upload-pages-artifact` → artefacto |
| Publicar | Pages leía `main/` (ignoraba `gh-pages`) | `deploy-pages` lee el artefacto |
| Fuente | rama legacy `main/` | `workflow` |

## Validation

- El job `deploy` publica el artefacto y expone `page_url`; falla visiblemente si Pages no está habilitado.
- **Prueba end-to-end:** abrir `https://ancletoceo.github.io/Coffee-World/` y confirmar que carga la terminal del juego (no el README).
- **Prueba de assets:** verificar en DevTools que `index.html`, `main-*.js`, `styles-*.css` y `favicon.ico` responden `200` (sin `404` por ruta `browser/`).
- **Regresión:** `gh api repos/AncletoCEO/Coffee-World/pages` debe reportar `build_type: "workflow"` y `source` acorde.
- El job `test` (raíz + Angular) sigue en verde y sin cambios.

## Rollback

Si el nuevo flujo falla de forma sostenida: revertir el job `deploy` al commit anterior y volver la fuente de Pages a **Deploy from a branch → `gh-pages` / `(root)`** (el último build bueno sigue en esa rama hasta que se elimine).
