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

### Entregables
- `js/game-engine.js` estable y testeable
- `js/game.js` enfocado en UI
- motor documentado y sin errores de estado
- easter egg de jueves definido

---

## Fase 2: Pruebas y cobertura

### Objetivo
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

---

## Fase 3: Migración Angular (preparación)

### Objetivo
Preparar el terreno para la UI Angular sin romper la lógica del motor.

### Tareas
1. Mantener el proyecto Angular dentro de `angular-app/`.
2. Migrar el motor a TS como librería reutilizable.
3. Implementar servicios Angular:
   - `GameEngineService`
   - `GameStateService`
   - `SaveLoadService`
4. Definir y crear componentes principales:
   - `StatsPanelComponent`
   - `UpgradesPanelComponent`
   - `DungeonPanelComponent`
   - `ConsoleComponent`
   - `ThursdayModePanelComponent`
   - `NarrativePanelComponent`
5. Añadir pruebas Angular para servicios y componentes.

### Entregables
- proyecto Angular inicializado
- motor TS disponible para UI
- servicios de estado y guardado
- componentes básicos listos

---

## Fase 4: Migración Angular (ejecución)

### Objetivo
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

---

## Fase 5: GitHub Pages y despliegue

### Objetivo
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

---

## Fase 6: Documentación y cleanup

### Objetivo
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

---

## Cronograma sugerido

- Semana 1: estabilización + tests.
- Semana 2: preparación Angular + componentes.
- Semana 3: migración UI + post-game.
- Semana 4: deploy + documentación.

---

## Criterios de éxito

- motor estable y testeable.
- cobertura en el motor >= 80%.
- UI Angular conectada y funcional.
- post-game definido e integrado.
- despliegue automatizado con tests previos.
- documentación clara y repo limpio.
