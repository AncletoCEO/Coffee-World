# Design: Terminal viva estilo Candy Box

## Approach

Sin tocar el motor ni la entrada por comandos. Dos capas sobre lo que ya existe:

1. **HUD reactivo** derivado de la señal de estado (`GameStateService.state`), que ya se actualiza cada tick de `GameEngineService`.
2. **Narración por eventos** dentro del `tick()` existente, reutilizando los mensajes que ya se generan (diálogos, logros, jueves) y agregando las líneas que faltan (apertura, cambio de acto, boss disponible).

Principio: **una sola fuente de verdad** (el estado del motor). El HUD no recalcula reglas; lee del estado. La narración no inventa estado; reacciona a transiciones del mismo.

## Architecture

### HUD en vivo
- En `terminal.component.html`, agregar una franja `header`/`status-bar` **fuera** del `scrollback` (arriba), siempre visible.
- Alimentarla desde la señal de estado existente. En `TerminalComponent`, exponer un `computed()` que derive el texto:
  - `Café: <floor(coffee)>` · `CPS: <floor(cps)>` · `Acto <n>: <name> (<progress>%)`
  - Si `thursdayModeUnlocked`: añadir `⏰ Jueves <clock>` y puntos.
- Como `GameEngineService.tick()` hace `setState({ ...state })` cada segundo, el `computed` se re-evalúa y el HUD se actualiza solo. Sin subscripciones manuales ni intervalos nuevos.
- Formato monoespaciado, mismos colores; una sola línea (o dos en pantallas angostas) para no competir con el scrollback.

### Narración automática
Extender `GameEngineService.tick()` (y/o un helper `narrate(state, previous)`) para empujar al log **sólo ante transiciones**:

| Evento | Disparo | Mensaje |
|---|---|---|
| Apertura | primer arranque (log vacío / partida nueva) | kickoff narrativo con el primer objetivo |
| Nuevo diálogo | `getLatestDialogueIndex` aumentó | ya existe: `📧 Nueva historia: "..."` |
| Cambio de acto | `getCurrentAct` aumentó | `🎬 Acto N: <name>` |
| Boss disponible | `getPendingBoss` pasó de `undefined` a un boss | `⚔️ ¡<boss> espera en <dungeon>!` |
| Logro | `checkAchievements` devolvió logros | ya existe |

Reglas:
- Guardar el "último valor visto" por dimensión (acto, índice de diálogo, boss pendiente) en el servicio para detectar transiciones; no re-emitir.
- **No** emitir estado por segundo en el scrollback (eso es trabajo del HUD). La narración es por evento.
- La línea de apertura se emite una vez por arranque de servicio (no en cada tick).

## Validation

- **HUD**: al abrir la página, la franja muestra `Café: 0 | CPS: 0 | Acto 1 ...` y cambia sola al producir café (sin escribir comandos).
- **Narración**: al cruzar el umbral del primer diálogo (50 de café) aparece sola la línea `📧 Nueva historia: "..."`; al subir de acto aparece `🎬 Acto N`.
- **Sin spam**: dejar el juego corriendo N segundos sin eventos no llena el scrollback de líneas repetidas.
- **Persistencia**: recargar con un guardado existente muestra el HUD con el estado restaurado desde el primer render.
- `npm test` (raíz) y `cd angular-app && npm test -- --watch=false` siguen en verde; se agregan tests de transición de narración (cambio de acto, primer diálogo) en el motor.
