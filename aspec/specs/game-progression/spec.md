# Game Progression Specification

## Requirements

### Requirement: Tabla única de actos

El sistema SHALL derivar `getCurrentAct`, `getActProgress` y `getRelativeThreshold` de una única tabla de actos con cortes y rangos consistentes, de modo que el acto actual y el progreso relativo nunca se calculen sobre rangos distintos.

#### Scenario: Acto y progreso coherentes en el límite

- **WHEN** `totalCoffee` es exactamente el inicio de un acto
- **THEN** `getCurrentAct` devuelve ese acto y `getActProgress` devuelve 0
- **AND** no existe ningún rango de acto que contradiga el corte de `getCurrentAct`

### Requirement: Progresión narrativa por umbral

El sistema SHALL mostrar todos los diálogos cuyo umbral se haya alcanzado, incluyendo los diálogos del Acto 6 definidos por umbral absoluto.

#### Scenario: Diálogos del Acto 6 visibles

- **WHEN** el jugador alcanza un umbral de diálogo del Acto 6
- **THEN** `updateStory` muestra ese diálogo en la sección de historia

#### Scenario: Índice de fin de acto correcto

- **WHEN** se consulta el último índice de diálogo de un acto
- **THEN** el valor se deriva del array real de diálogos y coincide con el último diálogo de ese acto

### Requirement: Gating unificado de dungeons y bosses

El sistema SHALL determinar la disponibilidad de una dungeon y de su boss con una sola regla basada en el acto alcanzado y los bosses anteriores derrotados, eliminando condiciones redundantes por café, índice de diálogo y `spawnAt` dispersas.

#### Scenario: Dungeon disponible en el umbral correcto

- **WHEN** el jugador alcanza el acto del boss y ha derrotado los bosses anteriores
- **THEN** la dungeon correspondiente está desbloqueada y su boss es enfrentable

#### Scenario: Boss no enfrentable fuera de su acto

- **WHEN** el jugador aún no alcanzó el acto del boss
- **THEN** la dungeon y el boss no están disponibles, independientemente del café total

### Requirement: Límites de progresión por acto

El sistema SHALL aplicar los límites de progresión de forma consistente con la tabla de actos, sin bloquear compras normales ni permitir saltos de acto.

#### Scenario: Compra permitida dentro del acto

- **WHEN** el jugador tiene café suficiente y no hay boss pendiente
- **THEN** puede comprar upgrades del acto actual dentro de los límites definidos

### Requirement: Costo de upgrade estable

El sistema SHALL preservar el valor del costo de un upgrade sin truncarlo al cargar el estado; el redondeo SHALL aplicarse sólo al mostrar.

#### Scenario: Costo no deriva entre cargas

- **WHEN** se guarda y carga el estado varias veces
- **THEN** el costo calculado del upgrade es el mismo que antes de guardar

### Requirement: Balance de combate verificable

El sistema SHALL parametrizar el daño y la vida de los enemigos en constantes del motor y garantizar que cada boss sea vencible en el acto esperado.

#### Scenario: Boss vencible en su acto

- **WHEN** el jugador tiene las estadísticas razonables esperadas para el acto del boss
- **THEN** puede derrotar al boss sin recurrir a comandos de desarrollo
