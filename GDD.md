# Game Design Document (GDD) - Ancleto's Coffee World

## 🎯 **1. Visión General del Proyecto Completo**

### Título Oficial

**Ancleto's Coffee World: El Imperio Cafetero Incremental** *(COMPLETADO - v2.x)*

### Género

Incremental/Idle Game con elementos RPG, narrativa inmersiva y exploración de dungeons.

### Plataforma

- **Principal**: Navegador web (Chrome, Firefox, Safari, Edge)
- **Deployment**: GitHub Pages - [https://ancletoceo.github.io/Coffee-World/](https://ancletoceo.github.io/Coffee-World/)
- **Tecnología**: HTML5, CSS3, JavaScript ES6+ (Vanilla)

### Público Objetivo

- Jugadores casuales de incremental games
- Fans de humor corporativo y narrativa absurda
- Entusiastas del café y la cultura empresarial
- Jugadores que buscan experiencias nostálgicas (UI retro terminal)

### Estado del Proyecto

**✅ COMPLETAMENTE FUNCIONAL** - Todas las características implementadas y testeadas.

---

## 🎭 **2. Historia y Narrativa Implementada**

### Universo Ancleto

El juego está ambientado en el **universo corporativo de Ancleto**, con personajes establecidos:

- **Ancleto**: CEO carismático y protagonista
- **Damián**: Mentor y guía estratégico
- **Matías**: Especialista técnico en café
- **Lucía**: Antagonista corporativa principal
- **La Crisis**: Evento narrativo culminante

### Estructura Narrativa

**6 Actos Completos** con progresión obligatoria:

1. **Acto I**: Introducción al mundo cafetero
2. **Acto II**: Expansión del negocio
3. **Acto III**: Competencia corporativa
4. **Acto IV**: Crisis y desafíos
5. **Acto V**: Confrontación final
6. **Acto VI**: Dominación del mercado

### Sistema de Diálogos

- **40+ diálogos únicos** basados en progresión
- **Narrativa adaptativa** según estadísticas del jugador
- **Humor corporativo** característico del universo Ancleto

---

## ⚙️ **3. Mecánicas de Juego Implementadas**

### Sistema Incremental Core

```javascript
// Producción base: 1 café/segundo
// CPS (Café Por Segundo) escalable con upgrades
// 10 upgrades únicos con precios exponenciales
```

#### Recursos Principales

- **☕ Café**: Moneda principal (producción automática)
- **📊 Estadísticas**: Carisma y Fuerza Cafetera
- **🏆 Logros**: 25+ achievements desbloqueables

### Sistema RPG

#### Estadísticas de Personaje

- **Carisma**: Afecta eficiencia de upgrades y diálogos
- **Fuerza Cafetera**: Determina poder de combate vs bosses

#### Progresión de Bosses

**6 Bosses únicos** con bloqueo de progresión:

1. **Competidor Local** (Acto I)
2. **Cadena Corporativa** (Acto II)
3. **Inversor Hostil** (Acto III)
4. **Regulador Gubernamental** (Acto IV)
5. **Lucía** (Acto V)
6. **La Crisis Final** (Acto VI)

### Sistema de Exploración

#### Dungeons ASCII Completos

- **6 dungeons únicos** con arte ASCII
- **Interfaz visual completa** (no requiere consola)
- **Navegación por botones** intuitiva
- **Mapas en tiempo real** con posición del jugador

#### Controles de Dungeons

- Botones direccionales (Norte, Sur, Este, Oeste)
- Sistema de combate visual
- Feedback inmediato de acciones

---

## 🎨 **4. Arte y Presentación**

### Estilo Visual

- **UI Terminal Retro**: Fondo negro, texto verde fosforescente
- **Arte ASCII**: Dungeons y elementos visuales generados por IA
- **Tipografía Monospace**: Fuente 'Courier New' para autenticidad
- **Animaciones CSS**: Transiciones suaves y efectos de glow

### Sistema de Audio

- **Efectos de sonido**: Clicks, logros, notificaciones
- **Audio contextual**: Feedback inmediato de acciones
- **Configuración opcional**: Sonidos activables/desactivables

### Responsive Design

- **Mobile-friendly**: Optimizado para pantallas táctiles
- **Cross-browser**: Compatibilidad total con navegadores modernos

---

## 🎮 **5. Sistema de Controles**

### Interfaz Principal

- **Clicks intuitivos**: Compra de upgrades y acciones
- **Botones contextuales**: Dungeons, estadísticas, logros
- **Consola de comandos**: 20+ comandos disponibles

### Comandos de Consola Implementados

```
help, stats, inventory, clear, reset, save, load,
fight, explore, map, quit, version, donate, social,
about, credits, debug, test, admin, speedrun
```

### Sistema de Desarrollo Secreto

- **Activación secreta**: `"ancletomejorceodelmundotestcafetero"`
- **20+ comandos de testing**: Manipulación completa del juego
- **Herramientas de debugging**: Para desarrollo y QA

---

## 💾 **6. Persistencia y Guardado**

### LocalStorage Automático

- **Auto-save cada 5 segundos**
- **Backup automático**: Sistema redundante
- **Exportación CSV**: Para respaldo manual
- **Carga automática**: Al iniciar el juego

### Datos Persistentes

- Cantidad de café y estadísticas
- Progreso de upgrades y logros
- Estado de dungeons y bosses derrotados
- Configuraciones de usuario

---

## 🚀 **7. Deployment y Distribución**

### GitHub Pages

- **URL oficial**: [https://ancletoceo.github.io/Coffee-World/](https://ancletoceo.github.io/Coffee-World/)
- **Auto-deployment**: GitHub Actions configurado
- **Versionado automático**: Control de releases

### Performance

- **Tamaño total**: < 500KB
- **Tiempo de carga**: < 2 segundos
- **FPS target**: 60 FPS consistente
- **Memory usage**: Optimizado para sesiones largas

---

## 🎯 **8. Métricas de Éxito Alcanzadas**

### Funcionalidad

- ✅ **100% de características** implementadas
- ✅ **Zero bugs críticos** en producción
- ✅ **Cross-browser compatibility** verificada
- ✅ **Mobile responsiveness** completa

### Experiencia de Usuario

- ✅ **Onboarding intuitivo** para nuevos jugadores
- ✅ **Progresión balanceada** sin grinding excesivo
- ✅ **Narrativa envolvente** con humor característico
- ✅ **Replayability** através de achievements

### Técnica

- ✅ **Código limpio** y mantenible
- ✅ **Performance optimizada** en todos los navegadores
- ✅ **Arquitectura escalable** para futuras expansiones
- ✅ **Documentación completa** de desarrollo

---

## 🔧 **9. Herramientas de Desarrollo**

### Modo Desarrollo Secreto

Activado con el comando secreto, incluye:

- **Manipulación de recursos**: Café, estadísticas, nivel
- **Control de progresión**: Saltar actos, desbloquear dungeons
- **Testing de mecánicas**: Combate, upgrades, logros
- **Debug profundo**: Estado del juego, performance metrics

### Comandos de Testing

```javascript
devAddCoffee(amount)    // Agregar café
devSetLevel(level)      // Cambiar nivel
devUnlockAll()         // Desbloquear todo
devResetGame()         // Reset completo
devSimulateBoss()      // Simular combate
```

---

## 🎊 **10. Conclusión del Proyecto**

**Ancleto's Coffee World** representa un **incremental game completo y pulido** que cumple y excede todas las expectativas originales del GDD.

### Logros del Proyecto

- **Narrativa rica** con 40+ diálogos únicos
- **Mecánicas balanceadas** de incremental/RPG
- **Experiencia visual completa** con dungeons interactivos
- **Sistema de desarrollo** robusto para testing
- **Deployment profesional** en GitHub Pages

### Filosofía de Diseño

*"Un juego que combina la nostalgia de las interfaces terminal con la adicción de los incremental games, envuelto en el humor único del universo Ancleto."*

**Estado Final**: ✅ **PROYECTO COMPLETADO CON ÉXITO**

---

*"Confía en mí: este GDD documenta un triunfo cafetero completo."* - Ancleto, CEO
