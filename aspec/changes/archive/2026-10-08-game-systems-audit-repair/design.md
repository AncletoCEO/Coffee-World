# Design: Auditoría y reparación integral de los sistemas de Coffee World

## Approach

Reparación por fases con una regla central: **una sola fuente de verdad para el motor** y **una sola UI canónica**. El motor puro (sin DOM) vive en `js/game-engine.js` y se prueba con Vitest; la UI consume ese motor y no reimplementa reglas. La UI canónica pasa a ser una **terminal CLI** (estilo Candy Box), y la copia Angular se archiva o se adapta a esa terminal según se decida en la fase de unificación.

Orden de trabajo (de base a superficie), cada fase autocontenida y verificable:

1. Base del repo y tests.
2. Progresión (actos, diálogos, dungeons, bosses).
3. Feliz Jueves Mode.
4. Roguelike post-postgame.
5. Persistencia.
6. Interfaz CLI.
7. Unificación y limpieza.

## Architecture

### Motor (fuente única de verdad)
- `js/game-engine.js`: estado, actos, costos, compras, producción, combate y serialización. Sin referencias al DOM.
- **Nueva tabla de actos única** exportada por el motor, con los cortes reales por `totalCoffee` y los rangos de cada acto usados por los umbrales relativos, para que `getCurrentAct`, `getActProgress` y `getRelativeThreshold` deriven de la misma estructura. Eliminar las tablas duplicadas en `js/game.js`.
- **Progresión por diálogo:** cada diálogo declara su umbral en un único campo (`relativeThreshold`) o, para el Acto 6, se normaliza a `relativeThreshold`; `updateStory` deja de asumir un solo campo. `getLastDialogueIndexForAct` se calcula derivado del array real (contando diálogos por acto), no de constantes a mano.
- **Gating unificado de dungeons/bosses:** una sola función `isBossAvailable(boss, state)` / `isDungeonUnlocked(dungeon, state)` que combine acto alcanzado + boss anterior derrotado. Eliminar la triple condición dispersa.
- **Balance parametrizado:** daño, HP y multiplicadores en constantes del motor, con un test que verifique que cada boss es vencible en el acto esperado con stats razonables.
- `validateGameValues` deja de truncar el costo (`Math.floor` en la presentación, no en el estado).

### Feliz Jueves Mode
- **Reloj:** `updateThursdayMode` se llama exactamente una vez por tick. Se elimina la llamada desde `updateStory`; el reloj avanza sólo en el loop de producción.
- **Ciclo:** al alcanzar 86400 s, `completeThursday` decide `unlockFriday` **o** `resetThursday` y en ambos casos reinicia `thursdayTime`. `unlockFriday` no puede re-dispararse en el mismo ciclo (flag de "finde activo").
- **Eventos:** los efectos se modelan como datos serializables (tipo, factor, duración) y se **re-aplican** al cargar recalculando `cpsMultiplier` desde cero, en lugar de multiplicar/desmultiplicar en caliente. `removeEffect` desaparece; `cpsMultiplier` se deriva de la lista de eventos activos + bendiciones del finde.
- **"Mail del Jefe":** implementado con un multiplicador de cooldown declarativo (`cooldownMultiplier`) aplicado en `sendMail`/`updateMailButton`.
- **Puntos:** tabla `pointsTable` por acción (diseño `POSTGAME-PROPOSAL.md:71-80`) usada por `earnBuenFindePoints(action)`.
- **Bendiciones/Emergencia:** botones con lógica real (gastar puntos / otorgar café de emergencia con costo), o se eliminan de la UI si la decisión de diseño los descarta (no dejarlos muertos).

### Roguelike
- Implementar las funciones del diseño: `enterRoguelikeMode`, `processRoguelikeEvent`, `completeRoguelikeRun`, `applyPermanentBonuses`, `saveRoguelikeState`.
- `persistentBonuses` y `nextRunMultiplier` se aplican en `calculateEffectiveCPS` y se consumen al iniciar run.

### Persistencia
- **Esquema versionado** (`saveVersion`) con migración en `deserializeState`.
- **CSV correcto:** serializar con un encoder/decoder real (JSON embebido con quoting/escape) o, preferible, migrar export/import a **JSON** y dejar CSV sólo si se documenta su formato.
- **Reset atómico:** detener el loop, limpiar estado, limpiar storage y reiniciar sin carrera de auto-guardado.
- **Estado completo:** `deserializeState` + `applyEngineState` cubren todo el estado post-game y de roguelike.

### Interfaz CLI
- `index.html` reduce el juego a una **terminal**: una salida única (scrollback) + un input de comando. Los paneles actuales (stats/upgrades/dungeons/thursday) se convierten en **salidas renderizadas por comandos** (`status`, `list upgrades`, `dungeons`, `jueves`, `map`).
- El mapa de dungeon se imprime como ASCII dentro de la terminal.
- Comandos existentes se preservan; se eliminan botones muertos o se reemplazan por comandos equivalentes.
- Se mantiene la estética verde-sobre-negro y monoespaciada ya presente en `css/`.

### Unificación
- Elegir la UI canónica. Si es la vanilla, el preview Angular se archiva; si es Angular, la terminal se implementa allí y la vanilla se archiva. El motor puro se comparte (versión JS + TS espejo o un único paquete consumido por ambos).

## Validation

- `npm test` (Vitest) en verde en cada fase; cobertura del motor ≥ 80%.
- Tests nuevos por fase:
  - Progresión: actos y umbrales derivados de una tabla; diálogos de Acto 6 visibles; desbloqueo de dungeons en el umbral correcto; boss vencible por acto.
  - Jueves: un tick = un incremento; `unlockFriday` no se repite dentro del ciclo; eventos se re-aplican al cargar; puntos por tabla.
  - Roguelike: entrar, procesar evento, completar run y aplicar bonus persistente.
  - Persistencia: reset no reescribe tras limpiar; CSV/JSON round-trip con comas y comillas; migración de guardado viejo.
- Test de flujo end-to-end: partida limpia → comprar upgrades → producir → desbloquear dungeon → derrotar boss → avanzar acto → guardar/cargar → estado idéntico.
- Verificación manual: abrir la terminal, jugar una run completa por comandos, recargar y confirmar continuidad; el juego se ve como una CLI.
- `npm run coverage` sin regresiones.
