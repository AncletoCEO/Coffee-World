# Thursday Mode Specification

## Requirements

### Requirement: Reloj del jueves de un único tick

El sistema SHALL avanzar `thursdayTime` exactamente una vez por segundo de juego, sin incrementos duplicados.

#### Scenario: Un tick produce un incremento

- **WHEN** transcurre un segundo de juego con el Feliz Jueves Mode activo
- **THEN** `thursdayTime` aumenta en 1

### Requirement: Ciclo del jueves sin bucle de desbloqueo

El sistema SHALL completar el jueves una sola vez por ciclo: al llegar a 86400 segundos decide entre desbloquear el viernes o reiniciar el jueves, y en ambos casos reinicia `thursdayTime` sin re-disparar el desbloqueo.

#### Scenario: Desbloqueo del viernes una sola vez

- **WHEN** el jueves se completa con puntos suficientes
- **THEN** `fridayLevel` aumenta en 1 y `cpsMultiplier` se multiplica por 3 una sola vez
- **AND** en los siguientes ticks no se vuelve a desbloquear el viernes dentro del mismo ciclo

### Requirement: Eventos del jueves serializables y re-aplicables

El sistema SHALL modelar los efectos de eventos como datos serializables y SHALL recalcular `cpsMultiplier` desde los eventos activos al cargar el estado.

#### Scenario: Efecto de evento tras recargar

- **WHEN** hay un evento activo y el juego se guarda y recarga
- **THEN** el efecto del evento sigue aplicándose y `cpsMultiplier` refleja su factor
- **AND** al expirar, `cpsMultiplier` vuelve a reflejar sólo los efectos restantes

### Requirement: Mail del Jefe con cooldown declarativo

El sistema SHALL implementar el evento "Mail del Jefe" mediante un multiplicador de cooldown declarativo aplicado a los envíos de mail y a su indicador.

#### Scenario: Cooldown de mail duplicado durante el evento

- **WHEN** el evento "Mail del Jefe" está activo
- **THEN** el cooldown efectivo de mail es el doble y el indicador lo refleja
- **AND** al terminar el evento el cooldown vuelve a la normalidad

### Requirement: Puntos de Buen Finde por acción

El sistema SHALL otorgar puntos según una tabla por acción (derrotar boss, sobrevivir evento, completar upgrade, mantener producción, usar bendición).

#### Scenario: Puntos otorgados según la acción

- **WHEN** el jugador realiza una acción listada en la tabla
- **THEN** recibe los puntos correspondientes a esa acción

### Requirement: Bendiciones y Café de Emergencia funcionales

El sistema SHALL proveer comportamiento real para las acciones "Usar Bendición" y "Café de Emergencia", o bien SHALL eliminarlas de la interfaz si el diseño las descarta.

#### Scenario: Acción disponible ejecuta su efecto

- **WHEN** el jugador activa una bendición o pide café de emergencia estando disponible
- **THEN** el efecto correspondiente se aplica y se descuenta su costo
