<<<<<<< HEAD
# Coffee World - Plan de Implementación

## Objetivo general
Implementar el diseño aprobado para estabilizar el juego actual, cubrirlo con pruebas robustas, migrar la UI a Angular de forma segura y agregar el post-game `Feliz Jueves` junto con el modo post-postgame roguelike.

## Estado de referencia
- El juego base es una app web estática con `index.html`, CSS y `js/game.js`.
- Existe un motor de juego parcial en `js/game-engine.js` y un preview Angular en `angular-app/`.
- Vitest está configurado en el root y actualmente cubre 9 tests.
- Se han agregado componentes de Angular iniciales y servicios de estado.
- Se debe conservar el easter egg del jueves y agregar el post-game completo.

---

## Fase 1: Estabilización del motor y modularización

### Objetivo
Separar claramente la lógica del juego de la UI, estabilizar el motor y asegurar que el estado sea válido.

### Tareas
1. Auditar el motor existente y documentar las funciones clave:
   - producción de café
   - upgrades y coste escalable
   - dungeons y bosses
   - guardado/carga de estado
   - validación de valores y correcciones de `NaN`
2. Consolidar la lógica en `js/game-engine.js`:
   - `produceCoffee` / `calculateEffectiveCPS`
   - `buyUpgrade`
   - `serializeState` / `deserializeState`
   - `validateGameValues`
3. Mantener `js/game.js` como capa UI/DOM:
   - listeners y botones
   - renderizado de estadísticas
   - paneles de logros y consola
4. Corregir la sincronización de estado compartido:
   - `buildEngineState()` completo
   - incluir `bosses`, `currentBoss`, `defeatedBosses` y campos post-game
   - aplicar el estado validado de vuelta a la UI
5. Mantener el easter egg del jueves:
   - registrar en el plan que si la página se abre un jueves debe reproducirse el video `https://www.youtube.com/watch?v=BvtUSsok4JA` antes de cargar el juego
=======
# Coffee World Implementation Plan

## Objetivo
Implementar el diseño aprobado para estabilizar el juego actual, crear pruebas obligatorias y preparar la migración de la UI a Angular.

## Estado actual
- El proyecto es una app web estática con `index.html`, CSS y `js/game.js`.
- Se ha creado `js/game-engine.js` para encapsular la lógica central del juego.
- El entorno de pruebas con `vitest` ya está configurado.
- La suite actual cubre 9 tests y pasa correctamente.
- El proyecto Angular preliminar ya existe en `angular-app/` y compila correctamente.
- Se ha creado una pipeline de despliegue en `.github/workflows/deploy-pages.yml` para publicar `angular-app/dist/angular-app` a GitHub Pages después de ejecutar los tests.
- Se implementó un `GameStateService` compartido para separar estado y lógica de motor en Angular.
- El despliegue de Angular debe alinearse con la configuración real de GitHub Pages (rama/fuente) antes de activar la publicación.
- `docs/` está ignorado en git para mantener el plan local.

---

## Fase 1: Estabilización y modularización

### Objetivo
Asegurar que el motor del juego sea estable, modular y mantenible.

### Tareas
1. Auditar la implementación actual y documentar funciones clave:
   - producción de café
   - upgrades
   - mazmorras y bosses
   - guardado/carga
   - control de estado y validaciones
2. Extraer lógica de negocio al motor de juego:
   - `produceCoffee` / `calculateEffectiveCPS`
   - `buyUpgrade`
   - serialización y deserialización de estado
   - validación de valores
3. Crear una separación clara entre el motor y la capa UI:
   - `js/game-engine.js` contiene reglas del juego
   - `js/game.js` contiene interacción DOM y eventos
4. Corregir el diseño de estado compartido:
   - usar un `buildEngineState()` completo
   - incluir `bosses` y otros campos requeridos
   - aplicar el estado validado de vuelta a la UI
5. Limpiar el código:
   - eliminar logs de depuración innecesarios
   - consolidar validaciones duplicadas
>>>>>>> 7d4ce85 (Superpowers (#8))

### Entregables
- `js/game-engine.js` estable y testeable
- `js/game.js` enfocado en UI
<<<<<<< HEAD
- motor documentado y sin errores de estado
- easter egg de jueves definido
=======
- errores de diseño corregidos
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Fase 2: Pruebas y cobertura

### Objetivo
<<<<<<< HEAD
Asegurar comportamiento correcto con pruebas unitarias e integración, y garantizar alta cobertura en el motor.

### Tareas
1. Validar configuración de `vitest` con `jsdom`.
2. Crear tests unitarios para motor:
   - `getUpgradeCost`
   - `buyUpgrade` en escenarios varios
   - `produceCoffee` con bonificaciones (donación/viernes)
   - validación de entrada y `NaN`
   - serialización/deserialización
3. Crear un test de flujo completo:
   - compra un upgrade
   - produce café
   - guarda y carga estado
4. Ejecutar coverage y ajustar para cubrir ramas críticas.
5. Excluir la UI antigua sin tests del reporte de coverage si es necesario.

### Entregables
- `test/game-engine.test.js`
- `npm test` pasando
- `npm run coverage` pasando con cobertura mínima del 80% en `js/game-engine.js`
=======
Agregar pruebas unitarias e integración obligatorias y alcanzar cobertura mínima del 80% en el motor.

### Tareas
1. Configurar `vitest` con soporte `jsdom`.
2. Añadir tests unitarios para:
   - `getUpgradeCost`
   - `buyUpgrade` en escenarios felices y límites
   - `produceCoffee` con bonificaciones
   - validación de estado y corrección de `NaN`
   - serialización/deserialización de estado
3. Añadir un test de flujo completo:
   - comprar un upgrade
   - producir café
   - guardar y cargar estado
4. Ejecutar coverage y ajustar tests para cubrir ramas críticas.
5. Excluir archivos UI sin tests del reporte de coverage si es necesario.

### Entregables
- `test/game-engine.test.js`
- `npm test` y `npm run coverage` pasando
- reporte de coverage con al menos 80% en el motor
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Fase 3: Migración Angular (preparación)

### Objetivo
<<<<<<< HEAD
Preparar el terreno para la UI Angular sin romper la lógica del motor.

### Tareas
1. Mantener el proyecto Angular dentro de `angular-app/`.
2. Migrar el motor a TS como librería reutilizable.
3. Implementar servicios Angular:
   - `GameEngineService`
   - `GameStateService`
   - `SaveLoadService`
4. Definir y crear componentes principales:
=======
Preparar la transición de la UI estática hacia Angular sin romper la lógica del motor.

### Tareas
1. Generar un proyecto Angular dentro del repo.
2. Migrar `js/game-engine.js` a TypeScript como librería reutilizable.
3. Crear servicios en Angular:
   - `GameEngineService`
   - `GameStateService`
   - `SaveLoadService`
4. Definir componentes principales:
>>>>>>> 7d4ce85 (Superpowers (#8))
   - `StatsPanelComponent`
   - `UpgradesPanelComponent`
   - `DungeonPanelComponent`
   - `ConsoleComponent`
   - `ThursdayModePanelComponent`
   - `NarrativePanelComponent`
<<<<<<< HEAD
5. Añadir pruebas Angular para servicios y componentes.

### Entregables
- proyecto Angular inicializado
- motor TS disponible para UI
- servicios de estado y guardado
- componentes básicos listos
=======
5. Configurar pruebas Angular para componentes y servicios.

### Estado actual
- Se generó el proyecto Angular en `angular-app/`.
- Se instaló el entorno de dependencias Angular.
- Se creó la librería de motor TS en `angular-app/src/app/game-engine/`.
- Se creó `GameEngineService` y se integró en `App`.
- El proyecto Angular compila y los tests iniciales pasan.

### Entregables
- proyecto Angular inicializado
- motor de juego migrado a TS
- componentes de UI esbozados
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Fase 4: Migración Angular (ejecución)

### Objetivo
<<<<<<< HEAD
Construir la UI Angular completa y conectar la lógica del motor con la interfaz.

### Tareas
1. Implementar la UI Angular con componentes y servicios.
2. Conectar el motor:
   - buttons de compra
   - loop de producción
   - actualizaciones de estado en tiempo real
   - persistencia en `localStorage`
3. Migrar las mecánicas existentes:
   - dungeons y bosses
   - consola de comandos
   - panel de logros
4. Mantener la UI estática antigua como referencia durante la migración.

### Entregables
- Angular UI funcional
- integración completa del motor
- pruebas de flujo Angular

---

## Fase 4.5: Post-Game y expansión infinita

### Objetivo
Agregar y estabilizar el modo post-game `Feliz Jueves` y la siguiente expansión roguelike.

### Tareas
1. Implementar el post-game `Feliz Jueves`:
   - reloj de jueves, eventos aleatorios, puntos de Buen Finde
   - bendiciones/maldiciones y niveles de viernes
   - créditos especiales del Buen Finde
2. Definir el modo post-postgame roguelike:
   - desbloqueo tras completar el post-game
   - ciclo infinito de supervivencia
   - progresión acumulativa entre runs
3. Integrar el post-game con el motor y el guardado:
   - persistir estado post-game
   - mostrar paneles especializados en la UI
   - asegurar que no rompe el flujo principal
4. Documentar el post-game y el post-postgame:
   - crear documento de diseño detallado
   - describir mecánicas, UI y balance

### Entregables
- post-game `Feliz Jueves` implementado
- post-postgame roguelike definido
- documentación dedicada
=======
Reemplazar la UI estática con una aplicación Angular moderna y responsive.

### Tareas
1. Implementar la UI Angular usando componentes y servicios.
2. Conectar la lógica del motor con la UI:
   - botones de compra
   - loop de producción
   - actualizaciones de estado
   - persistencia en LocalStorage
3. Migrar y probar dungeons, bosses y consola.
4. Mantener el antiguo código como referencia hasta completar la migración.

### Entregables
- UI Angular funcional
- interacción completa del juego
- tests de componentes y flujo
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Fase 5: GitHub Pages y despliegue

### Objetivo
<<<<<<< HEAD
Estabilizar la arquitectura de despliegue con pruebas previas a publicar.

### Tareas
1. Auditar el despliegue de GitHub Pages existente:
   - rama de Pages: `main` / `gh-pages` / `docs/`
   - origen de archivos servidos
2. Definir la estrategia de despliegue Angular:
   - mantener el sitio actual durante migración, o
   - migrar al build Angular cuando el preview esté listo
3. Implementar workflow de CI/CD:
   - tests root y Angular antes de deploy
   - build Angular y publicación de `angular-app/dist/angular-app`
   - deploy a la rama/fuente de Pages correcta
4. Documentar en `README.md` la configuración de Pages.

### Entregables
- workflow de despliegue en `.github/workflows/`
- documentación de Pages
- pipeline testeado y listo
=======
Definir y estabilizar la arquitectura de despliegue para que la migración Angular pueda publicarse de forma segura.

### Tareas
1. Auditar el despliegue actual de GitHub Pages:
   - confirmar si Pages usa la rama `main`, `gh-pages`, o una configuración de `docs/`.
   - identificar si el sitio live depende de archivos estáticos en el root.
2. Definir la estrategia de despliegue:
   - mantener el sitio actual en producción mientras se prepara Angular, o
   - migrar directamente al nuevo build Angular cuando el preview esté completo.
3. Implementar una pipeline de GitHub Actions para despliegue SOLO después de confirmar la fuente de Pages:
   - construir `angular-app` y publicar `angular-app/dist/angular-app` a GitHub Pages,
   - ejecutar tests antes de deploy: `npm test` + `cd angular-app && npm test -- --watch=false`,
   - opcionalmente incluir `npm run build` y un paso de validación de artefacto.
   - si la página actual apunta a `main` o `docs/`, ajustar la configuración de la acción o la rama de Pages según corresponda.
4. Documentar la configuración de Pages y la rama de despliegue:
   - agregar instrucciones de publicación al `README.md`.
   - documentar si la rama de Pages debe ser `main`, `gh-pages`, o `docs/`.

### Entregables
- `./github/workflows/deploy-pages.yml` o flujo equivalente
- documentación de despliegue en `README.md`
- despliegue de Angular preparado sin romper la versión actual del sitio
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Fase 6: Documentación y cleanup

### Objetivo
<<<<<<< HEAD
Dejar el repositorio listo para entrega.

### Tareas
1. Actualizar `README.md` con desarrollo, pruebas y deploy.
2. Mantener el plan en `IMPLEMENTATION_PLAN.md`.
3. Archivar o eliminar la UI antigua si Angular es definitiva.
4. Asegurar `.gitignore` limpio.

### Entregables
- README actualizado
- plan definitivo
- repo libre de archivos generados
=======
Dejar el repo listo para deploy con documentación actualizada.

### Tareas
1. Reescribir `README.md` con instrucciones de desarrollo y pruebas.
2. Mover el plan a un archivo raíz si el plan no debe quedarse en `docs/`.
3. Eliminar o archivar el código estático antiguo si Angular queda completo.
4. Mantener `.gitignore` actualizado y no subir archivos generados.

### Entregables
- README final
- plan de implementación documentado
- repo limpio
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Cronograma sugerido

<<<<<<< HEAD
- Semana 1: estabilización + tests.
- Semana 2: preparación Angular + componentes.
- Semana 3: migración UI + post-game.
- Semana 4: deploy + documentación.
=======
- Semana 1: estabilización y tests.
- Semana 2: preparación Angular y primeros componentes.
- Semana 3: migración UI y pruebas.
- Semana 4: ajuste final, documentación y cleanup.
>>>>>>> 7d4ce85 (Superpowers (#8))

---

## Criterios de éxito

<<<<<<< HEAD
- motor estable y testeable.
- cobertura en el motor >= 80%.
- UI Angular conectada y funcional.
- post-game definido e integrado.
- despliegue automatizado con tests previos.
=======
- motor de juego estable, testeable y con coverage.
- tests automáticos ejecutables.
- UI Angular planificada y lista para implementar.
>>>>>>> 7d4ce85 (Superpowers (#8))
- documentación clara y repo limpio.
