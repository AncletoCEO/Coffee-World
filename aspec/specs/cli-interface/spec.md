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
