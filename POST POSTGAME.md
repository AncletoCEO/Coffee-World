<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 73a9938 (Refactor implementation plan and define post-postgame roguelike mechanics)
# Post-Postgame Design: Roguelike de Buen Finde

## Objetivo
Definir un modo post-postgame llamado "Buen Finde" que se desbloquea después de completar el post-game "Feliz Jueves". Este modo debe ser una experiencia de supervivencia infinita con progresión roguelike que permita a los jugadores continuar jugando tras desbloquear el Buen Finde.

## Visión General
El post-postgame es una expansión del modo post-game existente. Una vez el jugador alcanza el nivel máximo de Buen Finde, se abre un modo roguelike de supervivencia donde cada ciclo de juego ofrece nuevos desafíos, recursos limitados y decisiones de riesgo/recompensa.

## Desbloqueo
- Completar los 6 bosses principales de la historia.
- Alcanzar al menos el nivel de Buen Finde requerido para completar el post-game.
- Obtener el estado `postGameCompleted` en la partida.

## Mecánicas Principales
### 1. Ciclo Roguelike
- Cada sesión post-postgame es un viaje con niveles o "jueves" consecutivos.
- El jugador debe avanzar mediante eventos aleatorios y tomar decisiones para mantener la producción.
- Si el jugador pierde, conserva algunas bonificaciones permanentes pero reinicia el ciclo.

### 2. Recursos y Riesgo
- El modo usa recursos limitados como café guardado, bendiciones y puntos de Buen Finde.
- Decisiones clave permiten gastar recursos para evitar maldiciones o arriesgarse a bonificaciones más altas.

### 3. Eventos Aleatorios
- Reuniones urgentes
- Correos del jefe
- Fallas de maquinaria
- Oportunidades de Boost
- Bosses sorpresa

### 4. Progresión
- El jugador acumula ``fridayLevel`` y ``buenFindePoints`` dentro del modo.
- Cada ciclo completado otorga bonificaciones permanentes o desbloqueos temporales.
- El objetivo es llegar al siguiente "Buen Finde" con mayor dificultad.

## UI Recomendada
- Panel de estado del Jueves: hora, puntos, eventos activos.
- Barra de progreso de Buen Finde.
- Sección de decisiones rápidas con botones de riesgo/recompensa.
- Indicador de estado de ciclo roguelike.

## Implementación Técnica
### Variables nuevas
- `roguelikeModeActive`
- `roguelikeRuns`
- `persistentBonuses`
- `nextRunMultiplier`

### Funciones clave
- `enterRoguelikeMode()`
- `processRoguelikeEvent()`
- `completeRoguelikeRun()`
- `applyPermanentBonuses()`
- `saveRoguelikeState()`

## Fases de Desarrollo
1. Añadir el modo post-game actual en la UI y validarlo.
2. Crear el flujo de desbloqueo del post-postgame.
3. Implementar eventos roguelike y decisiones.
4. Añadir guardado persistente y balance.
5. Documentar y testear el modo.

## Métricas de Éxito
- El jugador puede entrar en el modo roguelike una vez completado el post-game.
- La experiencia es rejugable y ofrece progresión acumulativa.
- El modo no rompe el guardado existente ni el flujo del juego principal.
- La documentación cubre el diseño y la lógica del modo.
<<<<<<< HEAD
=======
Pendiente de diseña un post game sin fin que seria un dungeon rogelike que se desbloquea despues de terminar el post game
>>>>>>> 0d7b54d (Add Easter egg for Thursdays and create post-game design document)
=======
>>>>>>> 73a9938 (Refactor implementation plan and define post-postgame roguelike mechanics)
