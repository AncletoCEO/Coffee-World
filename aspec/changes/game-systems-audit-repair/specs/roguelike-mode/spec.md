## ADDED Requirements

### Requirement: Entrada al modo roguelike

El sistema SHALL permitir iniciar una run roguelike sólo cuando `postGameCompleted` sea verdadero, registrando el número de run y consumiendo `nextRunMultiplier`.

#### Scenario: Entrada permitida tras completar el post-game

- **WHEN** el jugador completó el post-game e inicia el modo roguelike
- **THEN** se crea una nueva run con su multiplicador aplicado

#### Scenario: Entrada bloqueada sin completar el post-game

- **WHEN** el jugador no completó el post-game e intenta iniciar el modo roguelike
- **THEN** el sistema rechaza la entrada con un mensaje explicativo

### Requirement: Eventos roguelike con decisiones

El sistema SHALL procesar eventos de run que presenten decisiones de riesgo/recompensa sobre recursos limitados.

#### Scenario: Evento de run resuelto

- **WHEN** ocurre un evento de run y el jugador elige una opción
- **THEN** el estado de la run se actualiza según el riesgo o la recompensa elegida

### Requirement: Cierre de run y bonus permanentes

El sistema SHALL cerrar una run con `completeRoguelikeRun`, otorgar bonificaciones permanentes con `applyPermanentBonuses` y aplicarlas en la producción de café.

#### Scenario: Bonus persistente aplicado tras cerrar una run

- **WHEN** una run termina
- **THEN** `persistentBonuses` se actualiza y `calculateEffectiveCPS` lo aplica en la siguiente run

### Requirement: Persistencia del estado roguelike

El sistema SHALL guardar y restaurar el estado roguelike (`roguelikeModeActive`, `roguelikeRuns`, `persistentBonuses`, `nextRunMultiplier`) sin romper el guardado principal.

#### Scenario: Continuidad del modo tras recargar

- **WHEN** el juego se recarga durante o después de una run
- **THEN** el estado roguelike guardado se restaura correctamente
