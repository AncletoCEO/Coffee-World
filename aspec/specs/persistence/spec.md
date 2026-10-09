# Persistence Specification

## Requirements

### Requirement: Esquema de guardado versionado

El sistema SHALL incluir una versión de guardado y SHALL migrar estados de versiones anteriores al cargar.

#### Scenario: Migración de guardado antiguo

- **WHEN** se carga un guardado sin versión o de una versión anterior
- **THEN** el sistema lo migra al esquema actual y deriva actos y progreso sin perder logros ni bosses derrotados

### Requirement: Estado completo en la serialización

El sistema SHALL serializar y deserializar todo el estado del juego, incluyendo el estado post-game y de roguelike.

#### Scenario: Round-trip completo

- **WHEN** se serializa y deserializa un estado con datos post-game y de roguelike
- **THEN** todos los campos se restauran con sus valores

### Requirement: Export/Import robusto

El sistema SHALL exportar e importar el guardado de forma que los datos con comas, comillas o caracteres especiales se preserven íntegramente.

#### Scenario: Import con caracteres especiales

- **WHEN** un guardado contiene comas o comillas dentro de sus datos y se importa
- **THEN** el estado se restaura correctamente sin corromperse

### Requirement: Reset atómico

El sistema SHALL reiniciar la partida de forma atómica: detener la producción, limpiar el estado y el almacenamiento, y reiniciar, sin que el auto-guardado reescriba datos tras la limpieza.

#### Scenario: Reset sin residuos

- **WHEN** el jugador confirma el reset
- **THEN** tras reiniciar no queda ningún dato de la partida anterior
- **AND** no se reescribe el guardado viejo durante el reinicio

### Requirement: Auto-guardado eficiente

El sistema SHALL guardar el progreso ante cambios relevantes sin escribir en almacenamiento en cada tick de producción.

#### Scenario: Producción no genera guardados por segundo

- **WHEN** el juego produce café de forma automática
- **THEN** no se realiza una escritura de guardado en cada segundo
