# AI Coding Guidelines for Coffee World

## Project Overview
Coffee World is a vanilla JavaScript incremental/idle game with a terminal aesthetic. It's a single-page application built with HTML5, CSS3, and ES6+ JavaScript, featuring ASCII dungeon exploration, boss battles, and narrative progression through 6 acts.

## Architecture & Key Components

### Core Game Systems
- **Game State**: All state managed in global variables with LocalStorage persistence
- **Production Loop**: Automatic coffee generation via `setInterval` (see `gameLoop()`)
- **Upgrade System**: 10 upgrades with dynamic pricing and stat bonuses
- **Dungeon System**: ASCII map-based exploration with monsters and bosses
- **Console Commands**: 20+ interactive commands (see `handleCommand()`)
- **Narrative System**: Progressive dialogues based on total coffee collected

### File Structure
```
js/game.js          # Complete game logic (2,700+ lines)
css/style.css       # Main styling with terminal theme
css/terminal-styles.css  # Additional terminal effects
index.html          # Single-page app structure
```

## Critical Development Workflows

### Local Development
```bash
npm start           # Start dev server on port 8000
python -m http.server 8000  # Alternative server command
```

### Versioning & Deployment
- **Auto-versioning**: GitHub Actions increments patch version based on commit count
- **Deployment**: Automatic to GitHub Pages on main branch pushes
- **Version format**: `2.1.{commit_count}` (see `update-version.js`)

### Testing & Debugging
- **Dev Mode**: Activate with console command `ancletomejorceodelmundotestcafetero`
- **Console Logging**: Extensive debug logs throughout game.js
- **Manual Testing**: No automated tests; use dev mode for QA

## Project-Specific Patterns & Conventions

### Code Style
- **Language**: Spanish throughout (comments, strings, UI text)
- **State Management**: Global variables with manual save/load
- **Event Handling**: Direct DOM manipulation, no framework
- **Debugging**: Console logging with descriptive Spanish messages

### Game Mechanics
- **Boss-Locked Progression**: Must defeat specific bosses to advance acts
- **Cooldown System**: Actions like `mail` and `donate` have time-based limits
- **Stat System**: Three core stats - Coffee/sec, Charisma, Coffee Strength
- **Achievement System**: 25+ achievements triggered by specific conditions

### Dungeon System
- **ASCII Maps**: Use symbols `@`=player, `M`=monster, `B`=boss, `E`=exit, `#`=wall
- **Map Structure**: 2D arrays with coordinate system (x,y starting at 0,0)
- **Monster Placement**: Random spawning with fixed boss positions
- **Visual Display**: CSS Grid-based map rendering (see `updateVisualDungeonDisplay()`)

### Console Command Pattern
```javascript
// Standard command structure
function handleCommand(input) {
    const parts = input.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    switch(command) {
        case 'buy': return handleBuyCommand(args);
        case 'fight': return handleFightCommand();
        // ... more commands
    }
}
```

### Save/Load System
- **LocalStorage Keys**: `coffeeSaveData` for main state
- **CSV Export**: Manual backup via `savecsv` command
- **Data Validation**: `fixnan` command repairs corrupted numeric values
- **Auto-save**: Triggers on important actions (see `autoSave()`)

## Integration Points & Dependencies

### External Systems
- **GitHub Pages**: Hosting with automatic deployment
- **GitHub Actions**: Auto-versioning workflow
- **Web Audio API**: Sound effects (see `playSound()`)
- **LocalStorage**: Client-side persistence

### Build Process
- **No Build Tools**: Direct file serving, no compilation
- **Version Sync**: `update-version.js` keeps package.json and HTML in sync
- **Asset Management**: Static files in `/assets/` directory

## Common Development Tasks

### Adding New Content
1. **Upgrades**: Add to `upgrades` object with cost/cps/charisma/strength properties
2. **Bosses**: Add to `bosses` array with health/reward/spawn conditions
3. **Dungeons**: Define in `dungeons` object with ASCII map and monster data
4. **Commands**: Add case to `handleCommand()` switch statement
5. **Achievements**: Add condition check in `checkAchievements()`

### Debugging Issues
1. **State Corruption**: Use `fixnan` command to repair NaN values
2. **Dungeon Problems**: Check `inDungeon` flag and `currentDungeon` object
3. **Save Issues**: Clear LocalStorage and use `loadcsv` for recovery
4. **UI Problems**: Check CSS Grid layout and terminal styling variables

### Performance Considerations
- **Frame Rate**: Maintains 60 FPS with `setInterval` game loop
- **Memory**: <50MB typical usage, no memory leaks
- **Storage**: <1MB LocalStorage usage
- **Mobile**: Responsive design with touch controls

## Quality Assurance

### Testing Checklist
- [ ] All console commands work correctly
- [ ] Boss progression unlocks properly
- [ ] Save/load preserves all game state
- [ ] Dungeon navigation functions
- [ ] Achievement triggers work
- [ ] Dev mode tools are accessible
- [ ] No NaN values in stats
- [ ] Version numbers sync across files

### Browser Compatibility
- ✅ Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Testing**: Manual cross-browser validation
- **Fallbacks**: Graceful degradation for older browsers

## Key Files to Reference

- `js/game.js:886` - `handleDungeonsCommand()` - Dungeon listing logic
- `js/game.js:1521` - `enterDungeon()` - Dungeon entry system
- `js/game.js:2195` - `updateVisualDungeonDisplay()` - ASCII map rendering
- `js/game.js:358` - `dungeons` object - Dungeon definitions
- `css/style.css` - Terminal color scheme and layout
- `README.md` - Complete gameplay documentation</content>
<parameter name="filePath">c:\repos\AncletoCoffeeWorld\Coffee-World\.github\copilot-instructions.md