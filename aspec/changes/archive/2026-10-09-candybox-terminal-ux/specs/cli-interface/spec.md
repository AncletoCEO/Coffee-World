## ADDED Requirements

### Requirement: Barra de estado en vivo

El sistema SHALL mostrar una barra de estado persistente dentro de la terminal con el café, el CPS y el acto (con su progreso) que se actualiza automáticamente, sin que el jugador escriba ningún comando.

#### Scenario: El contador sube solo

- **WHEN** el juego produce café de forma automática
- **THEN** la barra de estado muestra el café y el CPS actualizados
- **AND** no fue necesario escribir `status`

#### Scenario: La barra refleja el guardado cargado

- **WHEN** el jugador carga una partida existente
- **THEN** la barra de estado muestra el café, el CPS y el acto restaurados desde el primer render

### Requirement: Narración automática por eventos

El sistema SHALL imprimir en la terminal líneas de historia y estado de forma automática ante eventos de progresión, sin que el jugador escriba comandos, y SHALL evitar repetir líneas ya mostradas.

#### Scenario: Apertura de partida

- **WHEN** comienza una partida nueva
- **THEN** la terminal imprime una línea de apertura con el primer objetivo

#### Scenario: Nuevo diálogo por umbral

- **WHEN** el café total cruza el umbral de un nuevo diálogo
- **THEN** la terminal imprime automáticamente la línea del nuevo diálogo

#### Scenario: Cambio de acto

- **WHEN** el jugador avanza al siguiente acto
- **THEN** la terminal imprime automáticamente el anuncio del nuevo acto
- **AND** lo imprime una sola vez por transición

#### Scenario: Boss disponible

- **WHEN** un boss pasa a estar disponible para enfrentar
- **THEN** la terminal lo anuncia automáticamente indicando su dungeon

#### Scenario: Sin repetición en reposo

- **WHEN** el juego corre varios segundos sin eventos de progresión
- **THEN** la terminal no agrega líneas repetidas de estado
