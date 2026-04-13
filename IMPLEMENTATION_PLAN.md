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

### Entregables
- `js/game-engine.js` estable y testeable
- `js/game.js` enfocado en UI
- errores de diseño corregidos

---

## Fase 2: Pruebas y cobertura

### Objetivo
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

---

## Fase 3: Migración Angular (preparación)

### Objetivo
Preparar la transición de la UI estática hacia Angular sin romper la lógica del motor.

### Tareas
1. Generar un proyecto Angular dentro del repo.
2. Migrar `js/game-engine.js` a TypeScript como librería reutilizable.
3. Crear servicios en Angular:
   - `GameEngineService`
   - `GameStateService`
   - `SaveLoadService`
4. Definir componentes principales:
   - `StatsPanelComponent`
   - `UpgradesPanelComponent`
   - `DungeonPanelComponent`
   - `ConsoleComponent`
   - `ThursdayModePanelComponent`
   - `NarrativePanelComponent`
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

---

## Fase 4: Migración Angular (ejecución)

### Objetivo
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

---

## Fase 5: GitHub Pages y despliegue

### Objetivo
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

---

## Fase 6: Documentación y cleanup

### Objetivo
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

---

## Cronograma sugerido

- Semana 1: estabilización y tests.
- Semana 2: preparación Angular y primeros componentes.
- Semana 3: migración UI y pruebas.
- Semana 4: ajuste final, documentación y cleanup.

---

## Criterios de éxito

- motor de juego estable, testeable y con coverage.
- tests automáticos ejecutables.
- UI Angular planificada y lista para implementar.
- documentación clara y repo limpio.
