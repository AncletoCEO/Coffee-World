# Tasks: Terminal viva estilo Candy Box

## Fase 1 — HUD en vivo
- [x] 1.1 Agregar una franja `status-bar` fija arriba del `scrollback` en `terminal.component.html`.
- [x] 1.2 Estilar la franja en `terminal.component.css` (monoespaciada, verde sobre negro, sin tapar el scrollback).
- [x] 1.3 Exponer en `TerminalComponent` un `computed()` que derive el texto del HUD desde la señal de estado (`Café`, `CPS`, `Acto` + progreso, y Jueves/puntos si aplica).
- [x] 1.4 Verificar que el HUD se actualiza solo cada segundo sin escribir comandos.

## Fase 2 — Narración automática
- [x] 2.1 Emitir una línea de apertura una vez por arranque de partida (kickoff narrativo).
- [x] 2.2 Detectar y narrar el **cambio de acto** (`🎬 Acto N: <name>`) una sola vez por transición.
- [x] 2.3 Detectar y narrar cuando un **boss pasa a disponible** (`⚔️ ... espera en <dungeon>`).
- [x] 2.4 Mantener los mensajes existentes (nuevo diálogo, logros, jueves) y evitar re-emitir líneas repetidas.
- [x] 2.5 Garantizar que la narración es **por evento** (sin inundar el scrollback con estado cada segundo).

## Fase 3 — Tests y verificación
- [x] 3.1 Test de transición: primer diálogo se narra al cruzar el umbral.
- [x] 3.2 Test de transición: cambio de acto se narra una sola vez.
- [x] 3.3 Test: correr varios ticks sin eventos no agrega líneas repetidas.
- [x] 3.4 `npm test` (raíz) y `cd angular-app && npm test -- --watch=false` en verde. (raíz 47 ✓, Angular 65 ✓)
- [x] 3.5 Verificación en vivo (build + Chrome headless): HUD sube solo y aparece narración sin escribir comandos. (5/5 checks PASS)

## Fase 4 — Cierre
- [x] 4.1 Sincronizar la spec de `cli-interface` y archivar el change.
