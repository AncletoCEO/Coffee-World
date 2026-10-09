## ADDED Requirements

### Requirement: El sitio de Pages sirve el juego

El despliegue SHALL publicar la aplicación Angular de Coffee World como la página raíz del sitio de GitHub Pages, y NO el `README.md` del repositorio.

#### Scenario: Abrir el sitio

- **WHEN** un usuario visita `https://ancletoceo.github.io/Coffee-World/`
- **THEN** se carga la terminal del juego (`index.html` de la app)
- **AND** no se muestra el README renderizado

### Requirement: Contenido correcto del artefacto

El despliegue SHALL publicar el contenido de la subcarpeta de build `browser/` en la raíz del sitio, de modo que `index.html` y los assets queden en el nivel superior del subpath.

#### Scenario: Assets en la raíz del subpath

- **WHEN** el navegador resuelve `index.html`, `main-*.js`, `styles-*.css` y `favicon.ico` bajo `/Coffee-World/`
- **THEN** todos responden correctamente y ninguno devuelve `404` por una ruta anidada `browser/`

### Requirement: Base href relativo al subpath

El build publicado SHALL usar un `base href` relativo para que los assets resuelvan bajo el subpath del proyecto (`/Coffee-World/`).

#### Scenario: Build con base relativo

- **WHEN** el workflow compila la app
- **THEN** el build se genera con `--base-href ./`

### Requirement: Despliegue por el flujo oficial de Actions

El despliegue SHALL usar el flujo oficial de GitHub Pages basado en Actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`) y SHALL tener la fuente de Pages configurada en `workflow`, sin depender de una rama `gh-pages`.

#### Scenario: Fuente de Pages en workflow

- **WHEN** se inspecciona la configuración de Pages del repositorio
- **THEN** `build_type` es `workflow`
- **AND** no se publica a la rama `gh-pages`

### Requirement: Despliegue observable y fallo visible

El despliegue SHALL exponer la URL publicada y SHALL fallar de forma visible si GitHub Pages no está habilitado o configurado.

#### Scenario: URL publicada reportada

- **WHEN** el job de despliegue finaliza
- **THEN** reporta la `page_url` del sitio publicado

#### Scenario: Pages no habilitado

- **WHEN** la fuente de Pages no está disponible para el workflow
- **THEN** el job de despliegue falla con un error visible en lugar de completar en falso
