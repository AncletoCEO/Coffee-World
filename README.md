# Ancleto's Coffee World: El Mundo Cafetero Incremental de Ancleto

🎮 **¡JUEGA AHORA!** → [https://ancletoceo.github.io/Coffee-World/](https://ancletoceo.github.io/Coffee-World/)

[![Estado del Deployment](https://img.shields.io/website?url=https%3A//ancletoceo.github.io/Coffee-World/)](https://ancletoceo.github.io/Coffee-World/)
[![Versión](https://img.shields.io/github/package-json/v/AncletoCEO/Coffee-World)](https://github.com/AncletoCEO/Coffee-World)
[![Commits](https://img.shields.io/github/commit-activity/m/AncletoCEO/Coffee-World)](https://github.com/AncletoCEO/Coffee-World/commits/main)
[![GitHub Pages](https://img.shields.io/badge/deployment-github%20pages-blue)](https://ancletoceo.github.io/Coffee-World/)

## Descripción del Proyecto

Ancleto's Coffee World es un juego incremental de navegador enfocado en el universo de Ancleto. El jugador recolecta "granos de café" para mejorar habilidades, derrotar amenazas y construir un imperio cafetero. Combina elementos idle, RPG y humor corporativo con un diseño retro terminal.

**Disponible para jugar online**: El juego se ejecuta directamente en GitHub Pages, sin instalación, con progreso automático y sistema de guardado robusto.

## Características Principales

### Mecánicas Core

- **Producción automática** de café cada segundo
- **10 upgrades únicos** con escalado de precio dinámico
- **Sistema de estadísticas** (Café, CPS, Carisma, Fuerza Cafetera)
- **6 bosses específicos por acto** con progresión obligatoria
- **Cooldowns estratégicos** (Mail: 2min, Donaciones: cooldown variable)

### Historia Narrativa

- **6 actos completos** con progresión rica basada en derrota de bosses
- **Personajes del universo Ancleto** (Damián, Matías, Lucía, Crisis de Arganaraz)
- **40+ diálogos progresivos** que evolucionan con el progreso total
- **Humor corporativo** integrado en gameplay y narrativa
- **Sistema de bloqueo por bosses** - debes derrotar cada boss para avanzar la historia

### Funcionalidades Avanzadas

- **Sistema de consola** con 20+ comandos interactivos
- **6 Dungeons ASCII explorables** con bosses específicos
- **Sistema de logros** expandido (25+ achievements)
- **Guardado automático** en LocalStorage + export/import CSV
- **Sistema de versionado automático** con GitHub Actions
- **Botón de reset** con confirmación de seguridad

### Diseño Retro Terminal

- **Estética terminal** con verde sobre negro (#00ff00/#000000)
- **Fuente monoespaciada** Courier New para autenticidad
- **Efectos de resplandor** y animaciones CSS suaves
- **UI responsive** con CSS Grid moderno
- **Feedback sonoro** para todas las acciones importantes
- **Interfaz de dungeons** unificada y fácil de usar

## Cómo Empezar

### Opción 1: Jugar Online (Recomendado)
**¡Simplemente ve a**: [https://ancletoceo.github.io/Coffee-World/](https://ancletoceo.github.io/Coffee-World/) y comienza a jugar inmediatamente!

### Opción 2: Desarrollo Local
1. **Clona el repositorio**: `git clone https://github.com/AncletoCEO/Coffee-World.git`
2. **Abre `index.html`** en cualquier navegador moderno
3. **O usa servidor local**: `python -m http.server 8000` o `npm start`

### Primeros Pasos en el Juego
1. **Comienza recolectando café** automáticamente
2. **Compra tu primera mejora** (Máquina Verde - 10 café)
3. **Explora la consola** escribiendo `help` para comandos
4. **Ve a Dungeons** cuando tengas 750+ café para enfrentar tu primer boss
5. **Sigue la historia** - cada acto requiere derrotar un boss específico

## Tecnologías y Arquitectura

### Frontend
- **HTML5 Semántico**: Estructura accesible y bien organizada
- **CSS3 Moderno**: Grid, Flexbox, Custom Properties, Animaciones
- **JavaScript ES6+ Vanilla**: Sin frameworks, código limpio y eficiente
- **Web Audio API**: Efectos de sonido inmersivos
- **CSS Grid Layout**: Diseño responsive y adaptable

### Almacenamiento y Persistencia
- **LocalStorage**: Guardado automático del progreso
- **CSV Export/Import**: Backup manual y transferencia de datos
- **Validación de datos**: Protección contra corrupción (fixnan)
- **Auto-save**: Guardado continuo cada acción importante

### Deployment y CI/CD
- **GitHub Pages**: Hosting automático y gratuito
- **GitHub Actions**: Versionado automático en cada commit
- **Auto-versioning**: Numeración basada en cantidad de commits
- **Deployment continuo**: Actualización automática del sitio
- **Estilo**: CSS Grid, Terminal aesthetics

## Estructura del Proyecto

```
Coffee-World/
├── index.html              # Página principal del juego
├── css/
│   ├── style.css           # Estilos principales
│   └── terminal-styles.css # Estilos adicionales terminal
├── js/
│   └── game.js            # Lógica completa del juego
├── assets/                # Recursos multimedia
├── docs/                  # Documentación técnica
│   ├── GDD.md            # Game Design Document
│   ├── Roadmap.md        # Plan de desarrollo
│   ├── TechnicalSpec.md  # Especificaciones técnicas
│   ├── COMPLETITUD.md    # Análisis de completitud
│   └── SOLUCION_NAN.md   # Documentación técnica
└── README.md             # Este archivo
```

## Progresión del Juego y Sistema de Bosses

### Mecánica de Progresión Narrativa

**IMPORTANTE**: La historia ahora está **bloqueada por bosses**. Debes derrotar cada boss específico para avanzar al siguiente acto.

### Los 6 Actos y sus Bosses Obligatorios

1. **Acto 1: Fundación** (750+ café) → **Damián Rebelde** en Sala de Reuniones
2. **Acto 2: Crisis** (4,000+ café) → **Crisis de Arganaraz** en Cafetería Oscura  
3. **Acto 3: Confrontación** (8,500+ café) → **Minion de Lucía** en Casa de Damián
4. **Acto 4: Ascenso** (17,500+ café) → **Sonrisa Inquebrantable** en Bodega Secreta
5. **Acto 5: Viajes** (27,500+ café) → **Niebla Azul** en Posada de Perros
6. **Acto 6: Maestría** (47,500+ café) → **Lucía Final** en Oficina Central

### Dungeons y Ubicaciones

Cada boss tiene su dungeon específica que se desbloquea automáticamente:

- **Sala de Reuniones** (750 café) - Damián Rebelde
- **Cafetería Oscura** (4,000 café) - Crisis de Arganaraz  
- **Casa de Damián** (8,500 café) - Minion de Lucía
- **Bodega Secreta** (17,500 café) - Sonrisa Inquebrantable
- **Posada de Perros** (27,500 café) - Niebla Azul
- **Oficina Central** (47,500 café) - Lucía Final

## Comandos de Consola Completos

### Comandos Básicos
```bash
help                    # Lista todos los comandos disponibles
status                  # Muestra estadísticas actuales completas
save / load            # Guardar/cargar progreso manualmente
reset                  # Reiniciar juego (requiere confirmación)
```

### Compras y Economía
```bash
buy [upgrade]          # Comprar mejora específica (ej: buy machine)
list upgrades          # Ver todas las mejoras disponibles
work                   # Trabajar por café extra (5s cooldown)
mail                   # Enviar mail corporativo (+50 café, 2min cooldown)
donate                 # Donar café por bonus temporal CPS
```

### Exploración y Combate
```bash
dungeons               # Listar mazmorras disponibles
explore [mazmorra]     # Entrar a mazmorra específica
up/down/left/right     # Moverse en mazmorra (o go [dirección])
fight                  # Atacar enemigo o boss actual
exit                   # Salir de mazmorra actual
```

### Utilidades y Debug
```bash
list achievements      # Mostrar todos los logros obtenidos
savecsv / loadcsv     # Backup/restore en formato CSV
fixnan                # Corregir valores corruptos automáticamente
credits               # Mostrar créditos del juego
```

## Sistema de Dungeons

### Desbloqueando Mazmorras

Las dungeons se desbloquean automáticamente según tu progreso de café:

- **Cafetería Oscura**: Se desbloquea con 1,000 café total
- **Bodega Secreta**: Se desbloquea con 5,000 café total  
- **Oficina Central**: Se desbloquea con 50,000 café total

### Bosses en Dungeons

**¡IMPORTANTE!** Los bosses ya no aparecen automáticamente en el mundo. Ahora están ubicados en dungeons específicas:

- **Minion de Lucía** se encuentra en la **Cafetería Oscura**
- **Niebla Azul** custodia la **Bodega Secreta**
- **Lucía** ha establecido su cuartel en la **Oficina Central**

### Cómo Explorar Dungeons

1. **Listar mazmorras disponibles:**
   ```bash
   dungeons
   ```

2. **Entrar a una mazmorra:**
   ```bash
   explore cafeteria oscura
   explore bodega secreta
   explore oficina central
   ```

3. **Navegar:**
   ```bash
   go north    # Ir al norte
   go south    # Ir al sur  
   go east     # Ir al este
   go west     # Ir al oeste
   ```

4. **Combate:**
   - **M = Monstruo**: Usa `fight` repetidamente para atacar
   - **B = Boss**: Enfréntate al jefe final de la dungeon
   - Cooldown de 1 segundo entre ataques (dungeons) vs 2 segundos (bosses)

5. **Salir:**

   ```bash
   exit        # Salir de la mazmorra actual
   ```

### Monstruos y Recompensas

- **Café Amargo** (Cafetería Oscura): 150 HP, 30 café de recompensa
- **Grano Maldito** (Bodega Secreta): 300 HP, 100 café de recompensa
- **Empleado Hipnotizado** (Oficina Central): 400 HP, 150 café de recompensa

**Tip:** Mejora tu Carisma y Fuerza Cafetera para hacer más daño en dungeons.

## Utilidades

```bash
list upgrades          # Listar todas las mejoras
list achievements      # Mostrar logros obtenidos
savecsv / loadcsv     # Backup/restore en CSV
fixnan                # Corregir valores corruptos
```

## Logros Principales

- **Primeros 100 granos** - Alcanza 100 café total
- **Producción decente** - Logra 10 CPS
- **Carismático** - Obtén 10 de carisma
- **Fuerte Cafetero** - Consigue 20 de fuerza
- **Café Milenario** - Recolecta 1,000 café total
- **Emperador del Café** - Domina con 100,000 café
- **Maestro Cafetero** - Derrota a los 3 bosses

## Logros y Achievements

El juego incluye 25+ logros que reconocen diferentes hitos:

### Logros de Progreso

- **Primeros 100 granos** - Alcanza 100 café total
- **Producción decente** - Logra 10 CPS
- **Café Milenario** - Recolecta 1,000 café total
- **Emperador del Café** - Domina con 100,000 café total

### Logros de Combate

- **Maestro Cafetero** - Derrota a los 6 bosses principales
- **Derrotaste a [Boss]** - Por cada boss específico derrotado
- **Explorador de Dungeons** - Explora todas las mazmorras

### Logros de Estadísticas

- **Carismático** - Obtén 10 de carisma
- **Fuerte Cafetero** - Consigue 20 de fuerza cafetera
- **Producción Industrial** - Alcanza 200+ CPS

## Información de Desarrollo

### Estado del Proyecto

- **Estado**: ✅ Completamente funcional y deployado
- **Versión actual**: Auto-incrementada con cada commit
- **Última actualización**: Continua via GitHub Actions
- **Hosting**: GitHub Pages con deployment automático

### Tecnologías de Desarrollo

- **Control de versiones**: Git + GitHub
- **CI/CD**: GitHub Actions para versionado automático
- **Testing**: Manual + validación en múltiples navegadores
- **Deployment**: GitHub Pages con SSL automático

### Métricas del Proyecto

- **Líneas de código**: ~1,800 líneas JavaScript
- **Commits**: Auto-tracked en número de versión
- **Archivos**: HTML, CSS, JS completamente vanilla
- **Peso total**: < 500KB (sin dependencias externas)

## Performance y Compatibilidad

### Navegadores Soportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Características Técnicas

- **Framerate**: 60 FPS consistente
- **Memoria**: < 50MB uso típico
- **Almacenamiento**: LocalStorage (< 1MB)
- **Offline**: Funciona sin conexión después de la carga inicial
- **Mobile**: Responsive design para dispositivos móviles

## Solución de Problemas y FAQ

### Problemas Comunes

**P: Aparecen valores "NaN" en las estadísticas**
R: Abre la consola del juego y escribe `fixnan` - el problema se corregirá automáticamente

**P: Los botones no responden**
R: Recarga la página. Si persiste, limpia la caché del navegador

**P: Se perdió el progreso**
R: El juego guarda automáticamente. Verifica que LocalStorage esté habilitado

**P: No aparecen los bosses**
R: Los bosses están en dungeons específicas. Ve a la sección "Dungeons & Exploración"

### Comandos de Emergencia

```bash
reset               # Reiniciar completamente (con confirmación)
fixnan             # Reparar valores corruptos
savecsv            # Crear backup manual
loadcsv            # Restaurar desde backup
```

### Para Resetear Completamente

1. Usa el botón "Reset" en la interfaz
2. O comando `reset` en consola (requiere confirmación)
3. O limpia manualmente LocalStorage del navegador

## Personalización y Modding

### Variables CSS Disponibles

```css
:root {
  --terminal-green: #00ff00;    /* Texto principal */
  --terminal-black: #000000;    /* Fondo */
  --terminal-cyan: #00ffff;     /* Acentos */
  --terminal-red: #ff0000;      /* Errores/alertas */
  --terminal-yellow: #ffff00;   /* Advertencias */
}
```

### Archivos Modificables

- `css/style.css` - Estilos principales y colores
- `css/terminal-styles.css` - Efectos específicos de terminal
- `js/game.js` - Lógica del juego (¡cuidado con los cambios!)

## Enlaces y Recursos

### Enlaces Principales

- 🎮 **Juego en vivo**: [https://ancletoceo.github.io/Coffee-World/](https://ancletoceo.github.io/Coffee-World/)
- 📦 **Repositorio**: [https://github.com/AncletoCEO/Coffee-World](https://github.com/AncletoCEO/Coffee-World)
- 📋 **Issues/Bugs**: [GitHub Issues](https://github.com/AncletoCEO/Coffee-World/issues)
- 📝 **Documentación**: [Carpeta docs/](https://github.com/AncletoCEO/Coffee-World/tree/main/docs)

### Documentación Técnica

- [`GDD.md`](docs/GDD.md) - Game Design Document completo
- [`TechnicalSpec.md`](docs/TechnicalSpec.md) - Especificaciones técnicas
- [`COMPLETITUD.md`](docs/COMPLETITUD.md) - Análisis de completitud del proyecto
- [`Roadmap.md`](docs/Roadmap.md) - Plan de desarrollo y futuras características

## Contribución

Este es un proyecto educativo. Las contribuciones son bienvenidas:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT. Ver `LICENSE` para más detalles.

## Créditos

**Creado por**: El universo de Ancleto  
**Inspirado en**: Cultura cafetera y juegos incrementales clásicos  
**Desarrollado con**: Mucho café y amor por los juegos incrementales  

---

*"Confía en mí: soy Ancleto, el mejor CEO del mundo. ¡Este juego será un éxito!"*
