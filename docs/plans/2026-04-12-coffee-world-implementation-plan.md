# Coffee World Implementation Plan

## Objetivo
Crear un plan de implementación para estabilizar el juego actual, agregar pruebas obligatorias y migrar la UI a Angular en fases.

## Resumen
El proyecto actual es una web estática con HTML/CSS/JS monolítico y sin tests. La implementación propuesta consta de tres fases:

1. Estabilización y auditoría del motor actual
2. Crear cobertura de pruebas obligatoria
3. Migrar la interfaz a Angular manteniendo el motor de juego probado

---

## Fase 1: Auditoría y estabilización del juego existente

### Objetivo
Detectar y corregir errores visibles, eliminar dependencias rotas y dejar la lógica de juego lista para tests.

### Tareas

1. Revisar y documentar las funcionalidades actuales del juego:
   - progresión de café y CPS
   - upgrades
   - mazmorras y bosses
   - consola de comandos
   - guardado/carga en LocalStorage
   - export/import CSV
   - modo post-game / Thursday Mode

2. Corregir fallos identificados:
   - agregar el elemento `csvFileInput` en `index.html` o eliminar la funcionalidad CSV si no se usará
   - eliminar `console.log` de depuración de la lógica de producción y dungeon
   - validar que los bosses y dungeons se desbloquean correctamente
   - corregir la lógica de combate de monstruos y bosses en mazmorras
   - asegurar que `saveGame()` y `loadGame()` manejan datos corruptos sin dejar el juego en estado inconsistente

3. Extraer la lógica del juego en unidades más pequeñas:
   - crear un archivo `js/game-engine.js` o similar para la lógica no dependiente del DOM
   - dejar en `game.js` solo la capa de UI y eventos DOM
   - separar funciones como `buyUpgrade`, `produceCoffee`, `fightDungeonBoss`, `fightDungeonMonster`, `validateGameValues`, `getCurrentAct`, `updateStory`, etc.

4. Definir la «versión mínima estable» actual y conservarla como referencia antes de migrar.

### Productos finales de la fase 1
- `README.md` actualizado con estado actual real
- `js/game-engine.js` o lógica modularizada
- `index.html` sin elementos faltantes
- lista de bugs/fallos resueltos

---

## Fase 2: Arquitectura de pruebas y cobertura mínima

### Objetivo
Agregar un entorno de tests que permita una cobertura mínima del 80% y un test de flujo completo de principio a fin.

### Tareas

1. Configurar el entorno de testing:
   - instalar `vitest` o `jest` (preferible `vitest` para JS moderno y simple)
   - agregar scripts `test`, `test:coverage`, `test:watch` en `package.json`
   - crear `test/` o `__tests__/` para los casos

2. Escribir pruebas unitarias para los bloques críticos:
   - `buyUpgrade()` con escenarios de compra exitosa, recursos insuficientes y límites por acto
   - `produceCoffee()` con bonus de donación y Thursday Mode
   - `saveGame()` / `loadGame()` con datos válidos, datos corruptos y fallback
   - `fightDungeonMonster()` y `fightDungeonBoss()` con estados de daño, derrota y recompensas
   - `checkAchievements()` para logros básicos y especiales
   - `getCurrentAct()` y lógica de dungeons desbloqueables

3. Escribir un test de integración de flujo completo:
   - iniciar estado limpio
   - comprar upgrades hasta tener CPS
   - producir café varias veces
   - desbloquear dungeon, entrar y derrotar un boss
   - guardar, cargar y verificar que el estado se restaura

4. Agregar cobertura de tests obligatoria:
   - revisar reporte de coverage y asegurar al menos 80% en el core del motor de juego
   - excluir CSS/HTML no testeable si es necesario, pero probar lógica principal

5. Definir criterios de deploy en CI:
   - `npm test -- --coverage` debe pasar
   - `coverage` debe ser >= 80% para los archivos de lógica

### Productos finales de la fase 2
- `package.json` con scripts de test
- conjunto de tests unitarios e integración
- reporte de coverage
- paso de CI listo para validación

---

## Fase 3: Migración a Angular por fases

### Objetivo
Crear una UI modernizada en Angular sin destruir la lógica testeada del juego.

### Estrategia
- migrar la interfaz paso a paso
- mantener la lógica de juego probada como librería independiente
- usar Angular para la presentación, interacción y estilo

### Tareas fase 3.1: Preparación

1. Generar proyecto Angular dentro del repo:
   - `ng new coffee-world-angular --routing=false --style=css` o `npx @angular/cli new ...`
   - incluir el motor de juego en `libs/` o en `src/app/game-engine/`

2. Reusar la lógica existente
   - mover `js/game-engine.js` a TypeScript dentro del proyecto Angular
   - escribir wrappers ligeros que expongan la API del motor al front Angular
   - mantener la lógica de estado y reglas separadas de la vista

3. Configurar tests Angular:
   - `ng test` para componentes
   - `vitest` / `jest` para la librería de juego si se desea
   - crear pruebas unitarias de componentes clave: stats, upgrades, dungeon, consola

### Tareas fase 3.2: UI y componentes

1. Componentes principales a crear:
   - `GameShellComponent` (layout general)
   - `StatsPanelComponent`
   - `UpgradesPanelComponent`
   - `DungeonPanelComponent`
   - `ConsoleComponent`
   - `ThursdayModePanelComponent`
   - `NarrativePanelComponent`

2. Datos y servicios:
   - `GameStateService` para manejar el estado compartido
   - `GameEngineService` para llamar a la lógica del motor
   - `SaveLoadService` para persistencia en LocalStorage

3. UI moderna y responsive:
   - rediseñar con `CSS Grid` / `Flexbox`
   - mejorar paleta de colores y tipografía
   - aplicar temas claros/oscuro si conviene
   - mantener la esencia “retro cafetera” pero más limpio

4. Integración con la lógica:
   - botones de compra usan `GameEngineService.buyUpgrade()`
   - loop de producción usa `setInterval()` o `RxJS timer`
   - dungeon usa un componente visual con estado de mapa
   - consola procesa comandos y muestra salida en un componente

### Tareas fase 3.3: Migración final y remoción del monolito

1. Verificar que el proyecto Angular reproduce las mismas funciones clave
   - producción de café
   - upgrades
   - dungeons/bosses
   - guardado/carga
   - logros
   - Thursday Mode mínimo funcional

2. Eliminar o archivar la versión antigua estática
   - conservar `index.html` antiguo solo como referencia si se desea
   - dejar el repo con el proyecto Angular principal

3. Actualizar CI/CD si existe
   - configurar `github-actions` para `npm install` + `ng test --watch=false`
   - despliegue a GitHub Pages o `ng deploy`

### Productos finales de la fase 3
- aplicación Angular con UI moderna
- motor de juego independiente y probado
- tests Angular para componentes y flujo
- README actualizado con el nuevo setup

---

## Fase 4: Documentación final y cleanup

### Objetivo
Reescribir la documentación para reflejar la versión final estable y la migración Angular.

### Tareas

1. Reescribir `README.md` con secciones claras:
   - descripción del juego
   - features reales actuales
   - cómo ejecutar localmente
   - cómo correr tests
   - cómo desplegar
   - roadmap si aplica

2. Convertir `POSTGAME-PROPOSAL.md` en:
   - roadmap de mejoras futuras
   - si la funcionalidad está implementada, mover al README o roadmap específico

3. Limpiar el repo:
   - eliminar archivos y debug logs obsoletos
   - dejar sólo lo necesario para la app Angular
   - asegurar que `package.json` contiene solo dependencias útiles

### Productos finales de la fase 4
- `README.md` nuevo y profesional
- documentación de tests y deploy
- repo limpio y listo para producción

---

## Prioridad y calendario sugerido

1. **Semana 1**: auditoría, corrección de bugs y modularización del motor
2. **Semana 2**: configurar tests, escribir casos críticos y alcanzar cobertura mínima
3. **Semana 3**: generar proyecto Angular, mover motor y crear componentes clave
4. **Semana 4**: pulir UI, pruebas de componente, cleanup y documentación final

> Si se necesita entregar más rápido, se puede comprimir a 2-3 semanas manteniendo las fases: primero estabilidad y tests, luego Angular.

---

## Criterios de éxito

- juego estable y reproducible en la versión actual
- tests automáticos que cubran el 80% del motor crítico
- Angular UI funcional con la misma experiencia básica
- README claro con instrucciones de desarrollo, tests y deploy
- backlog de mejoras post-game documentado y útil
