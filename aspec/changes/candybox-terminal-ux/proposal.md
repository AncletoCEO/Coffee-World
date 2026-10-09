# Proposal: Terminal viva estilo Candy Box (contadores en vivo y narración automática)

## Problem

La terminal desplegada **funciona pero se siente muerta**: en reposo sólo muestra dos líneas de bienvenida y el prompt. Nada cambia en pantalla salvo que el jugador escriba un comando.

Verificado en el sitio en vivo (`https://ancletoceo.github.io/Coffee-World/`, Chrome headless):

- Al cargar: `Bienvenido a Ancleto's Coffee World.` + `Escribe "help" para ver los comandos.` y el prompt `ancleto@coffee:~$`.
- Escribir `help` y `status` produce salida correcta (el motor funciona).

El problema es de experiencia, no de motor:

1. **Los contadores no se ven**: café, CPS y acto sólo aparecen si el jugador escribe `status`. No hay ningún indicador que se actualice solo. En Candy Box el contador de caramelos está siempre a la vista y sube solo; acá nada "pasa".
2. **No hay narración automática**: la historia (diálogos por umbral, logros, cambios de acto, bosses disponibles) sólo se emite en algunos eventos del tick y no hay líneas de apertura, así que en los primeros segundos la pantalla queda vacía y sin dirección.

Esto contradice el espíritu de la spec `cli-interface` ("estilo Candy Box"), que hoy sólo describe una terminal con salida por comandos.

## Proposed change

Hacer la terminal **viva**, sin agregar botones (se mantiene la entrada por comandos):

1. **Barra de estado en vivo (HUD)**: una franja fija dentro de la terminal, siempre visible, con **Café, CPS, Acto y progreso** (y Jueves/puntos cuando aplique), que se actualiza cada tick sin que el jugador escriba nada.
2. **Narración automática**: la terminal imprime sola líneas de historia/estado ante eventos relevantes — apertura de partida, nuevo diálogo por umbral, cambio de acto, boss disponible y logros — sin que el jugador tenga que tipear.

## Scope

### In scope
- Indicador de estado persistente y reactivo (contadores en vivo) en la terminal.
- Emisión automática de líneas narrativas ante eventos de progresión (incluye una línea de apertura).
- Ajustes mínimos de estilo para que el HUD no rompa la estética verde-sobre-negro.

### Out of scope
- Acciones clickeables / links en la salida (no seleccionado).
- Botón de ayuda fijo (no seleccionado).
- Cambios de motor, balance, contenido narrativo o persistencia.
- Reintroducir paneles de botones (la entrada sigue siendo por comandos).

## Risks
- **Rendimiento**: re-renderizar el HUD cada segundo es barato si se deriva de la señal de estado existente; evitar recalcular vistas pesadas por tick.
- **Spam en el scrollback**: la narración automática debe emitir por **evento**, no cada segundo, y no repetir líneas ya mostradas (evitar inundar la consola).
- **Tensión con la spec `cli-interface`**: el HUD es información, no un panel de botones; se aclara en el delta para no contradecir "interfaz de terminal única".
- **Persistencia del HUD**: al cargar un guardado, el HUD debe reflejar el estado restaurado desde el primer render.
