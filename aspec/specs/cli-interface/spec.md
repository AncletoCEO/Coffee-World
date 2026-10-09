# CLI Interface Specification

## Requirements

### Requirement: Interfaz de terminal única

El sistema SHALL presentar el juego como una terminal CLI (estilo Candy Box) con una única salida de consola (scrollback) y una única entrada de comandos, en lugar de paneles de botones.

#### Scenario: Toda la interacción ocurre en la terminal

- **WHEN** el jugador usa el juego
- **THEN** el estado y las acciones se muestran como texto en la salida de consola
- **AND** las acciones se ejecutan escribiendo comandos en la entrada

### Requirement: Estado por comandos

El sistema SHALL exponer las vistas de estadísticas, upgrades, dungeons y Feliz Jueves como salidas generadas por comandos.

#### Scenario: Consultar estado

- **WHEN** el jugador escribe `status`, `list upgrades`, `dungeons` o `jueves`
- **THEN** la terminal imprime la información correspondiente

### Requirement: Mapa de dungeon en ASCII

El sistema SHALL renderizar el mapa de la dungeon como arte ASCII dentro de la terminal.

#### Scenario: Explorar una dungeon

- **WHEN** el jugador entra a una dungeon y se mueve
- **THEN** la terminal imprime el mapa ASCII actualizado con la posición del jugador

### Requirement: Feedback de comandos veraz

El sistema SHALL reportar en la terminal el resultado real de cada comando, sin declarar éxito cuando la acción falla.

#### Scenario: Compra fallida reportada

- **WHEN** el jugador intenta comprar un upgrade sin café suficiente
- **THEN** la terminal informa el fallo y no anuncia una compra exitosa

#### Scenario: Ataque fallido reportado

- **WHEN** el jugador intenta atacar sin enemigo activo o durante el cooldown
- **THEN** la terminal informa el motivo y no anuncia un ataque exitoso

### Requirement: Sin controles muertos

El sistema SHALL eliminar de la interfaz todo control sin lógica o reemplazarlo por un comando equivalente funcional.

#### Scenario: No hay botones inertes

- **WHEN** el jugador revisa la interfaz
- **THEN** no existe ningún control que no ejecute una acción real

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
