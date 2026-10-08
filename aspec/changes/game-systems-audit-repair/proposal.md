# Proposal: Auditoría y reparación integral de los sistemas de Coffee World

## Problem

Coffee World está inspirado en Candy Box 2 y su diseño pide que se vea y se juegue **como una CLI**. El repositorio contiene hoy dos implementaciones divergentes (la vanilla de `index.html` + `js/game.js` y el preview Angular en `angular-app/`) y varios sistemas documentados en el diseño (`README.md`, `POSTGAME-PROPOSAL.md`, `POST POSTGAME.md`) **no funcionan o nunca fueron implementados**. Auditoría realizada sobre el código actual (no sobre la documentación):

### Progresión narrativa y actos
1. **Tablas de actos inconsistentes.** `getCurrentAct` (`js/game-engine.js:80`, `angular-app/.../game-engine.ts:140`) define actos en 5000/10000/20000/35000/50000, pero `getActProgress`/`getRelativeThreshold` (`js/game.js:1408-1479`) usan rangos 5000-15000/15000-30000/30000-50000/50000-75000/75000-100000. Los umbrales relativos de los diálogos se calculan contra rangos que no son los del acto real.
2. **El Acto 6 nunca se muestra.** Sus diálogos usan `threshold` absoluto (`js/game.js:371-418`) pero `updateStory` sólo lee `relativeThreshold` (`js/game.js:1264,1329,1351`) → `actProgress >= undefined` es siempre falso. Toda la narrativa del Acto 6 está rota.
3. **`getLastDialogueIndexForAct` no coincide con el array real.** Counts `{1:10,2:10,3:5,4:4,5:4,6:1}` (`js/game.js:863-870`) vs realidad (Acto 1 = 9, Acto 2 = 12, Acto 4 = 5, Acto 6 = 9). Los desbloqueos de dungeons por índice de diálogo (`js/game.js:2012-2040`) disparan en momentos incorrectos.
4. **Triple gating contradictorio de dungeons/bosses:** `unlockAt` por café, desbloqueo por `currentDialogueIndex`, y `spawnAt` del boss en `movePlayer`/`enterDungeon`. Reglas redundantes que se contradicen.

### Feliz Jueves Mode (post-game)
5. **El reloj del jueves corre al doble.** `updateThursdayMode` se invoca desde `produceCoffee` (`js/game.js:2270`) y desde `updateStory` (`js/game.js:1388`), y `produceCoffee` llama a `updateStory` (`js/game.js:2288`): `thursdayTime` sube ~2 por segundo.
6. **Bucle infinito de desbloqueo del viernes.** `completeThursday` (`js/game.js:1686`) llama `unlockFriday`, que **no** reinicia `thursdayTime` ni los puntos; el siguiente tick vuelve a completar el jueves y a multiplicar `cpsMultiplier *= 3.0` (`js/game.js:1724`) y `fridayLevel++` cada segundo. Explosión exponencial de CPS y nivel de finde hasta que expira `fridayEndTime`.
7. **Los efectos de eventos no persisten.** `activeThursdayEvents` se serializa a JSON perdiendo `effect`/`removeEffect`; al recargar, `cpsMultiplier` no refleja los eventos activos y `removeEffect` es no-op.
8. **Evento "Mail del Jefe" roto.** Su `effect` hace aritmética inválida sobre `lastMailTime` y su `removeEffect` está vacío (`js/game.js:541-553`); "cooldowns duplicados" nunca se implementa.
9. **`cpsMultiplier` no se restaura de forma simétrica.** `endFriday` divide x3 una vez (`js/game.js:1835`) y `resetThursday` lo fuerza a `1.0` (`js/game.js:1848`), perdiendo bendiciones legítimas.
10. **Botones muertos:** "Usar Bendición" y "Café de Emergencia" existen en `index.html:206-207` y se capturan en `js/game.js:640-641`, pero no tienen listener ni lógica.
11. **Puntos de Buen Finde incompletos.** El diseño (`POSTGAME-PROPOSAL.md:71-80`) define una tabla por acción; la implementación sólo da +50 por maldición y +100 por boss, e ignora el parámetro `action` de `earnBuenFindePoints`.

### Roguelike (post-postgame)
12. **El modo es un stub.** `enterRoguelikeMode` (`js/game.js:1755-1780`) sólo incrementa contadores. `processRoguelikeEvent`, `completeRoguelikeRun`, `applyPermanentBonuses`, `saveRoguelikeState` (definidos en `POST POSTGAME.md:49-54`) no existen. `nextRunMultiplier` se asigna y nunca se usa.

### Persistencia
13. **`resetGameData` no resetea el estado post-game** (`js/game.js:706-746`) ni la vida de bosses, y tiene una carrera: `produceCoffee` auto-guarda cada segundo y el reset recarga tras 1 s, pudiendo reescribir el guardado antes del reload.
14. **Export/import CSV roto.** Los campos JSON se unen con `,` sin quoting (`js/game.js:803-805`) y se parsean con `split(',')` (`js/game.js:823-824`); cualquier coma interna del JSON rompe el import.
15. **`deserializeState` no restaura el estado post-game** (`js/game-engine.js:151-165`): falta `thursdayTime`, `buenFindePoints`, `fridayLevel`, `thursdayStats`, `roguelike*`, `persistentBonuses`. `applyEngineState` (`js/game.js:91-110`) tampoco los sincroniza.

### Interfaz (no es una CLI)
16. `index.html` es un dashboard de secciones, tarjetas y botones. El diseño del usuario exige una experiencia tipo Candy Box: **todo ocurre en una consola/terminal**, con texto plano y comandos, no paneles de botones.

### Motor / balance
17. **`actLimits` mal alineado** con `getCurrentAct`: `buyUpgrade` bloquea compras cuando `totalCoffee >= limits.maxCoffee` salvo boss pendiente + upgrade de fuerza (`js/game-engine.js:103-111`), produciendo paredes de progresión erráticas.
18. **Costo de upgrade mutado:** `validateGameValues` hace `parseInt(cost)` en cada carga (`js/game-engine.js:72`), perdiendo decimales.
19. **Balance de combate sin verificar:** bosses de hasta 3000 HP contra stats capadas por `actLimits`; posible boss invencible sin cheats.
20. **Reporte de éxito falso en consola:** `handleBuyCommand` (`js/game.js:880-901`) y `handleFightCommand` (`js/game.js:903-914`) imprimen éxito aunque la acción falle.

### Repo / build
21. **`node_modules/` y `package-lock.json` están commiteados** con symlinks corruptos (`node_modules/.bin/vitest` contiene un shebang en vez de un enlace) → `npm test` falla con `vitest: command not found`.
22. **Doble inicialización** de `checkThursdayEasterEgg` en `DOMContentLoaded` (`js/game.js:3223` y `3247`): `loadGame`/`startGameLoop` corren dos veces y en jueves se montan dos overlays de video.

## Proposed change

Ejecutar una **reparación por fases** que primero fija la base (repo/tests), luego el motor y la progresión, después los modos post-game, la persistencia y finalmente el rediseño de la interfaz a CLI, dejando una única fuente de verdad para el motor.

1. **Base:** des-trackear `node_modules/` y `package-lock.json`, reparar el entorno de tests, correr `npm test` en verde y fijar un baseline reproducible.
2. **Progresión:** unificar una única tabla de actos y umbrales; corregir `updateStory` para soportar diálogos por `threshold` y por `relativeThreshold`; alinear `getLastDialogueIndexForAct`; unificar el gating de dungeons/bosses a una sola regla por acto.
3. **Feliz Jueves:** corregir el doble tick del reloj, cortar el bucle de desbloqueo del viernes, persistir/re-aplicar efectos de eventos, arreglar "Mail del Jefe", implementar bendiciones/emergencia y la tabla de puntos.
4. **Roguelike:** implementar el ciclo, decisiones, bonus permanentes y guardado definidos en `POST POSTGAME.md`.
5. **Persistencia:** reset completo y atómico, CSV con quoting correcto, serialización que incluya todo el estado post-game.
6. **CLI:** rediseñar la capa de presentación para que el juego se vea y se juegue como una terminal (salida única de consola, entrada de comandos, mapa ASCII, sin paneles de botones).
7. **Unificación:** consolidar el motor en una sola implementación consumida por la UI elegida y eliminar/archivar la copia divergente.

## Scope

### In scope
- Corrección de los 22 hallazgos de la auditoría.
- Unificación de la lógica de actos/diálogos/dungeons/bosses.
- Feliz Jueves Mode funcional (reloj, eventos, puntos, bendiciones, finde).
- Modo roguelike post-postgame implementado según el diseño.
- Persistencia robusta (LocalStorage + export/import + reset).
- Rediseño de la interfaz a estética CLI tipo Candy Box.
- Entorno de tests reparado y ampliado.

### Out of scope
- Cambios de narrativa/contenido (textos de diálogos, créditos, lore).
- Nuevos bosses, dungeons o upgrades no presentes en el diseño.
- Backend, cuentas de usuario o multijugador.
- Monetización, leaderboards o notificaciones (mencionados como expansiones futuras en `POSTGAME-PROPOSAL.md`).
- Reescritura completa a otro framework distinto del ya presente.

## Risks
- **Superficie amplia (22 hallazgos, ~3.2k líneas):** entregar por fases independientes y verificables, cada una con tests; no tocar dos fases a la vez.
- **Reescribir la UI puede romper el guardado existente:** versionar el esquema de guardado y mantener migración/fallback en `deserializeState`.
- **Cambiar la tabla de actos puede desbloquear progreso ya guardado:** añadir migración que re-derive actos desde `totalCoffee` y `defeatedBosses` sin perder logros.
- **Balance de combate sin datos de playtest:** parametrizar daño/HP en un único módulo y validar con un test de "boss vencible en el acto esperado".
- **Dos implementaciones (vanilla/Angular) pueden divergir más:** decidir la UI canónica en el diseño y eliminar la otra como parte de la fase de unificación.
