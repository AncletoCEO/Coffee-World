# Tasks: Auditoría y reparación integral de los sistemas de Coffee World

## Fase 0 — Base del repo y tests
- [x] 0.1 Des-trackear `node_modules/` (`git rm -r --cached`); se conserva `package-lock.json` por reproducibilidad. **Commit pendiente** (no solicitado).
- [x] 0.2 Reparar el entorno: `npm install` regeneró `node_modules/.bin`; se dio permiso de ejecución a `@esbuild/linux-x64/bin/esbuild` (postinstall bloqueado). Igual en `angular-app`.
- [x] 0.3 `npm test` en verde (baseline 9 → ahora 47 tests).
- [x] 0.4 Baseline de coverage registrado (93.12% stmts motor vanilla).
- [x] 0.5 UI canónica: **Angular CLI**. Motor canónico en TS; vanilla archivada en `archive/vanilla/`.

## Fase 1 — Progresión (actos, diálogos, dungeons, bosses)
- [x] 1.1 Tabla única `ACTS` en `content.ts`; `getCurrentAct` = bosses derrotados + 1.
- [x] 1.2 `getActProgress`/`getActRange` derivados de `ACTS` (umbrales absolutos, sin tablas duplicadas).
- [x] 1.3 Acto 6 con `threshold` absoluto normalizado.
- [x] 1.4 `getLatestDialogueIndex` soporta umbrales absolutos (Acto 6 visible).
- [x] 1.5 Índice de diálogo derivado del array real (eliminado `getLastDialogueIndexForAct`).
- [x] 1.6 `isBossAvailable` / `isDungeonUnlocked` en el motor y usadas por comandos.
- [x] 1.7 Gating redundante por `currentDialogueIndex` eliminado.
- [x] 1.8 Límite de compra alineado al rango del acto + boss pendiente.
- [x] 1.9 Costo no truncado en `validateGameValues`.
- [x] 1.10 Daño/HP en constantes (`MONSTER_DAMAGE_FACTOR`, `BOSS_DAMAGE_FACTOR`).
- [x] 1.11 Tests: actos, Acto 6, dungeons, boss, bloqueo de compra, costo estable, balance.

## Fase 2 — Feliz Jueves Mode
- [x] 2.1 `tickThursday` se llama una sola vez por segundo (loop del servicio).
- [x] 2.2 `completeThursday`/`unlockFriday`/`resetThursday` reinician `thursdayTime`; sin re-desbloqueo.
- [x] 2.3 Eventos serializables; `cpsMultiplier` derivado de eventos activos (re-aplicado al cargar).
- [x] 2.4 "Mail del Jefe" con `cooldownFactor` declarativo.
- [x] 2.5 Bonus del finde simétrico (multiplicador derivado, no acumulado).
- [x] 2.6 `THURSDAY_POINTS` por acción en `earnBuenFindePoints(action)`.
- [x] 2.7 Bendiciones y Café de Emergencia implementados (`blessing` / `emergency`).
- [x] 2.8 Tests: tick único, sin bucle, re-aplicación de eventos, puntos.

## Fase 3 — Roguelike post-postgame
- [x] 3.1 `enterRoguelikeMode` con estado de run y `nextRunMultiplier`.
- [x] 3.2 `processRoguelikeEvent` con decisión riesgo/seguro.
- [x] 3.3 `completeRoguelikeRun` y `applyPermanentBonuses`.
- [x] 3.4 `persistentBonuses` aplicado en `getCpsMultiplier`/`calculateEffectiveCPS`.
- [x] 3.5 Estado roguelike incluido en la serialización.
- [x] 3.6 Comandos `rogue` / `risk` / `safe` / `endrun`.
- [x] 3.7 Tests: entrada bloqueada/ permitida, bonus persistente.

## Fase 4 — Persistencia
- [x] 4.1 `saveVersion` + migración en `deserializeState`.
- [x] 4.2 Estado post-game y roguelike completo en serialize/deserialize.
- [x] 4.3 Export/import en JSON (a prueba de comas/comillas); CSV eliminado.
- [x] 4.4 Reset atómico (detiene loop, limpia storage, reinicia).
- [x] 4.5 Auto-guardado cada 15 ticks (no cada segundo).
- [x] 4.6 Tests: round-trip, migración, normalización.

## Fase 5 — Interfaz CLI
- [x] 5.1 UI reducida a terminal (scrollback + prompt) en `terminal.component`.
- [x] 5.2 Stats/upgrades/dungeons/jueves como salidas de comandos.
- [x] 5.3 Mapa de dungeon renderizado en ASCII dentro de la terminal.
- [x] 5.4 Paneles/botones muertos eliminados (componentes archivados).
- [x] 5.5 Feedback veraz en `buy`/`fight`.
- [x] 5.6 Doble inicialización eliminada (arranque único del loop).
- [x] 5.7 Estética verde-sobre-negro monoespaciada.
- [x] 5.8 Test manual pendiente de navegador (cubierto por tests de comandos + build).

## Fase 6 — Unificación y limpieza
- [x] 6.1 UI canónica decidida (Angular); vanilla archivada en `archive/vanilla/`.
- [x] 6.2 Motor consolidado en TS como fuente única.
- [x] 6.3 `spawnboss` (dev) entra a la dungeon del boss.
- [x] 6.4 Comando secreto dev comparado en minúsculas.
- [x] 6.5 `README.md` reescrito al estado real.
- [x] 6.6 `npm test` (47) + cobertura motor ≥ 80% (game-engine 88%, commands 81%); Angular 60 tests + build OK.
