# Ancleto's Coffee World: El Mundo Cafetero Incremental de Ancleto

## 🎮 Descripción del Proyecto

Ancleto's Coffee World es un juego incremental de navegador enfocado en el universo de Ancleto. El jugador recolecta "granos de café" para mejorar habilidades, derrotar amenazas y construir un imperio cafetero. Combina elementos idle, RPG y humor corporativo con un diseño retro terminal.

El juego se ejecuta directamente en el navegador, sin instalación, con progreso automático y sistema de guardado robusto.

## ✨ Características Principales

### 🎯 Mecánicas Core
- **Producción automática** de café cada segundo
- **10 upgrades únicos** con escalado de precio dinámico
- **Sistema de estadísticas** (Café, CPS, Carisma, Fuerza Cafetera)
- **Combate automático** contra 3 bosses principales
- **Cooldowns estratégicos** (Mail: 2min, Work: 5seg)

### 📖 Historia Narrativa
- **7 actos completos** con progresión rica
- **Personajes del universo Ancleto** (Damian, Matías, Lucía)
- **Narrativa dinámica** que evoluciona con el progreso
- **Humor corporativo** integrado en gameplay

### 🎮 Funcionalidades Avanzadas
- **Sistema de consola** con 20+ comandos
- **Dungeons ASCII explorables** (2 mazmorras)
- **Sistema de logros** expandido (25+ achievements)
- **Guardado automático** + export/import CSV
- **Botón de reset** con confirmación

### 🎨 Diseño Retro Terminal
- **Estética terminal** con verde sobre negro (#00ff00/#000000)
- **Fuente monoespaciada** Courier New
- **Efectos de resplandor** y animaciones CSS
- **UI responsive** con CSS Grid
- **Feedback sonoro** para todas las acciones

## 🚀 Cómo Empezar

1. **Clona el repositorio**: `git clone https://github.com/noctamjam/Coffee-World.git`
2. **Abre `index.html`** en cualquier navegador moderno
3. **Comienza recolectando café** automáticamente
4. **Compra upgrades** para acelerar tu progreso
5. **Explora la consola** escribiendo `help` para comandos

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+) vanilla
- **Almacenamiento**: LocalStorage + CSV backup
- **Audio**: Web Audio API para efectos de sonido
- **Estilo**: CSS Grid, Terminal aesthetics

## 📁 Estructura del Proyecto

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

## 🎯 Progresión del Juego

### Etapas de Progreso
- **0-100 café**: Fundación básica
- **100-1,000 café**: Crisis de Arganaraz
- **1,000-5,000 café**: Cruzada contra Lucía
- **5,000-20,000 café**: Ascenso y reconocimientos
- **20,000-50,000 café**: Viajes globales
- **50,000-100,000 café**: Revolución tecnológica
- **100,000+ café**: Maestría absoluta

### Bosses
1. **Minion de Lucía** (1,000 café) - Recompensa: 25 café
2. **Niebla Azul** (5,000 café) - Recompensa: 200 café
3. **Lucía** (100,000 café) - Recompensa: 1,000 café

## 🎮 Comandos de Consola

```bash
# Comandos básicos
help                    # Lista todos los comandos
status                  # Muestra estadísticas actuales
save / load            # Guardar/cargar progreso

# Compras y acciones
buy [upgrade]          # Comprar mejora específica
work                   # Trabajar por café (5s cooldown)
mail                   # Enviar mail corporativo (2min cooldown)
fight                  # Atacar boss actual

# Exploración
dungeons               # Listar mazmorras disponibles
explore [mazmorra]     # Entrar a mazmorra
go [north/south/east/west]  # Moverse en mazmorra
exit                   # Salir de mazmorra

## 🏰 Sistema de Dungeons

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

## 🛠️ Utilidades
list upgrades          # Listar todas las mejoras
list achievements      # Mostrar logros obtenidos
savecsv / loadcsv     # Backup/restore en CSV
fixnan                # Corregir valores corruptos
```

## 🏆 Logros Principales

- 🌱 **Primeros 100 granos** - Alcanza 100 café total
- ⚡ **Producción decente** - Logra 10 CPS
- 😊 **Carismático** - Obtén 10 de carisma
- 💪 **Fuerte Cafetero** - Consigue 20 de fuerza
- 🏆 **Café Milenario** - Recolecta 1,000 café total
- 👑 **Emperador del Café** - Domina con 100,000 café
- 🏅 **Maestro Cafetero** - Derrota a los 3 bosses

## 🔧 Solución de Problemas

### Si aparecen valores "NaN":
1. Abre la consola del juego
2. Escribe `fixnan`
3. El problema se corregirá automáticamente

### Para resetear completamente:
1. Usa el botón "Reset" en la interfaz
2. O comando `reset` en consola (requiere confirmación)

## 🎨 Personalización

El juego utiliza variables CSS para fácil personalización:
- `--terminal-green`: #00ff00 (texto principal)
- `--terminal-black`: #000000 (fondo)
- `--terminal-cyan`: #00ffff (acentos)

## 🤝 Contribución

Este es un proyecto educativo. Las contribuciones son bienvenidas:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Abre un Pull Request

## 📜 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💼 Créditos

**Creado por**: El universo de Ancleto  
**Inspirado en**: Cultura cafetera y juegos incrementales clásicos  
**Desarrollado con**: Mucho café y amor por los juegos incrementales  

---

*"Confía en mí: soy Ancleto, el mejor CEO del mundo. ¡Este juego será un éxito!"* ☕👑
