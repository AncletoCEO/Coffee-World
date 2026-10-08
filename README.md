# ☕ Ancleto's Coffee World

Juego incremental basado en la idea de [Candy Box 2](https://github.com/candybox2/candybox), con estética y mecánica de **terminal CLI**: todo el juego se juega escribiendo comandos.

🎮 **Juega online**: [https://ancletoceo.github.io/Coffee-World/](https://ancletoceo.github.io/Coffee-World/)

## Arquitectura

- **UI canónica**: Angular (`angular-app/`), implementada como una terminal (scrollback + prompt de comandos).
- **Motor único (fuente de verdad)**: TypeScript puro en `angular-app/src/app/game-engine/`:
  - `content.ts` — datos: actos, upgrades, bosses, dungeons, diálogos, eventos del jueves, logros.
  - `game-engine.ts` — reglas puras (sin DOM): progresión, compras, producción, combate, Feliz Jueves, roguelike, serialización.
  - `commands.ts` — procesador de comandos de la CLI.
  - `game-engine.service.ts` — servicio Angular: loop, persistencia y ejecución de comandos.
- **Archivo histórico**: la implementación vanilla original (`index.html`, `css/`, `js/`, `test/`) quedó en `archive/vanilla/` y **no se mantiene**.

## Desarrollo

```bash
# App canónica (Angular CLI)
cd angular-app
npm install
npm start          # servidor de desarrollo

# Tests del motor (rápidos, sin Angular)
cd ..
npm test
npm run coverage

# Tests y build de Angular
npm run test:angular
cd angular-app && npm run build -- --base-href ./
```

El workflow `.github/workflows/deploy-pages.yml` corre los tests del motor, los tests de Angular, construye `angular-app/dist/angular-app` y publica en GitHub Pages.

## Comandos de la terminal

```
help                       Lista de comandos
status                     Estadísticas y acto actual
list upgrades|achievements Listar mejoras o logros
buy [upgrade]              Comprar mejora (ej: buy machine)
work / mail / donate       Acciones de café
dungeons                   Mazmorras disponibles
explore [dungeon]          Entrar a una mazmorra
go north|south|east|west   Moverse
map / fight / exit         Mapa ASCII, atacar, salir
boss                       Estado del boss
jueves                     Activar/consultar Feliz Jueves Mode
blessing / emergency       Acciones del Feliz Jueves
rogue / risk / safe / endrun  Modo roguelike post-postgame
save / load / reset confirm  Persistencia
credits / fixnan / help
```

Modo desarrollo (oculto): escribe `ancletomejorceodelmundotestcafetero` y luego `devhelp`.

## Sistemas

### Progresión
La historia está **bloqueada por bosses**. El acto actual = bosses derrotados + 1. Cada boss aparece en su dungeon cuando alcanzas su umbral de café. No puedes seguir comprando en un acto una vez superado su rango de café salvo que haya un boss pendiente (para mejoras de combate).

### Dungeons y combate
Mapas ASCII con `@` (tú), `M` (monstruo), `B` (boss), `E` (salida), `#` (pared). El daño depende de Carisma + Fuerza Cafetera.

### Feliz Jueves Mode (post-game)
Se desbloquea al completar la historia. Un reloj avanza una vez por segundo; eventos aleatorios (maldiciones/bendiciones) modifican la producción. Sobrevive el jueves para alcanzar el Buen Finde.

### Roguelike (post-postgame)
Tras completar el Feliz Jueves se desbloquea un modo de runs con decisiones de riesgo/recompensa y bonificaciones persistentes entre runs.

## Tests

- Motor: 47 tests (`npm test`) con cobertura ≥ 80% en `game-engine.ts` / `commands.ts`.
- Angular: 60 tests (`npm run test:angular`).

## Licencia

MIT. Ver `LICENSE`.
