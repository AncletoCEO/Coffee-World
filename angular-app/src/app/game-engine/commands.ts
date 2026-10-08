// Procesador de comandos de la terminal CLI. Puro respecto del DOM.
import {
  DIALOGUES,
  DUNGEON_ALIASES,
  INITIAL_UPGRADES,
  UPGRADE_ALIASES,
  DEV_SECRET,
  actByNumber
} from './content';
import {
  GameState,
  ActionResult,
  buyUpgrade,
  checkAchievements,
  checkThursdayUnlock,
  completeRoguelikeRun,
  donate,
  emergencyCoffee,
  enterDungeon,
  enterRoguelikeMode,
  exitDungeon,
  fightBoss,
  fightMonster,
  getActProgress,
  getCurrentAct,
  getDungeonMap,
  getMailCooldown,
  getPendingBoss,
  getRequiredFridayPoints,
  getThursdayClock,
  getUpgradeCost,
  isBossAvailable,
  isDungeonUnlocked,
  movePlayer,
  processRoguelikeEvent,
  renderMap,
  sendMail,
  tickThursday,
  toggleThursday,
  useBlessing,
  work
} from './game-engine';

export interface CommandContext {
  devMode: boolean;
  now: number;
  random: () => number;
}

export interface CommandResult {
  messages: string[];
  devMode?: boolean;
  save?: boolean;
  load?: boolean;
  reset?: boolean;
}

const EMPTY: CommandResult = { messages: [] };

function merge(action: ActionResult, extra: Partial<CommandResult> = {}): CommandResult {
  return { messages: action.messages, ...extra };
}

export function runCommand(state: GameState, rawInput: string, ctx: CommandContext): CommandResult {
  const input = rawInput.trim();
  if (!input) return EMPTY;

  if (input.toLowerCase() === DEV_SECRET) {
    return { messages: ['🔧 MODO DESARROLLO ACTIVADO. Escribe "devhelp".'], devMode: true };
  }

  const parts = input.toLowerCase().split(/\s+/);
  const action = parts[0];
  const target = parts.slice(1).join(' ');

  if (ctx.devMode) {
    const dev = runDevCommand(state, action, target, ctx);
    if (dev) return dev;
  }

  switch (action) {
    case 'help': return help(ctx.devMode);
    case 'status': return status(state);
    case 'buy': return buy(state, target);
    case 'list': return list(state, target);
    case 'boss': return boss(state);
    case 'save': return { messages: ['Juego guardado.'], save: true };
    case 'load': return { messages: ['Juego cargado.'], load: true };
    case 'reset': return reset(state, target);
    case 'explore': return explore(state, target);
    case 'go': return go(state, target);
    case 'exit': return exitDungeon(state);
    case 'map': return { messages: [renderMap(state)] };
    case 'dungeons': return dungeons(state);
    case 'mail': return merge(sendMail(state, ctx.now), { save: true });
    case 'work': return merge(work(state, ctx.now), { save: true });
    case 'donate': return merge(donate(state, ctx.now), { save: true });
    case 'fight': return fight(state, ctx);
    case 'jueves':
    case 'thursday': return merge(toggleThursday(state), { save: true });
    case 'blessing': return merge(useBlessing(state), { save: true });
    case 'emergency': return merge(emergencyCoffee(state), { save: true });
    case 'rogue':
    case 'buenf': return merge(enterRoguelikeMode(state), { save: true });
    case 'risk': return merge(processRoguelikeEvent(state, true), { save: true });
    case 'safe': return merge(processRoguelikeEvent(state, false), { save: true });
    case 'endrun': return merge(completeRoguelikeRun(state), { save: true });
    case 'fixnan':
      return { messages: ['Valores inválidos corregidos.'], save: true };
    case 'credits': return credits(state);
    default:
      return { messages: [`Comando desconocido: "${action}". Escribe "help".`] };
  }
}

function help(devMode: boolean): CommandResult {
  const lines = [
    '=== COMANDOS ===',
    'status                     - Estadísticas',
    'list upgrades|achievements - Listar',
    'buy [upgrade]              - Comprar mejora',
    'work / mail / donate       - Acciones de café',
    'dungeons                   - Mazmorras disponibles',
    'explore [dungeon]          - Entrar a mazmorra',
    'go north|south|east|west   - Moverse',
    'map / fight / exit         - Mapa, atacar, salir',
    'jueves / blessing / emergency - Feliz Jueves',
    'rogue / risk / safe / endrun - Roguelike',
    'save / load / reset confirm - Persistencia',
    'credits / fixnan / help'
  ];
  if (devMode) {
    lines.push('=== DEV ===', 'devhelp - Comandos de desarrollo');
  }
  return { messages: lines };
}

function status(state: GameState): CommandResult {
  const act = getCurrentAct(state);
  const progress = Math.floor(getActProgress(state) * 100);
  const lines = [
    `Café: ${Math.floor(state.coffee)} | CPS: ${Math.floor(state.cps)} | Total: ${Math.floor(state.totalCoffee)}`,
    `Carisma: ${state.charisma} | Fuerza Cafetera: ${state.coffeeStrength}`,
    `Acto ${act}: ${actByNumber(act).name} (${progress}%) | Bosses derrotados: ${state.defeatedBosses.length}/6`,
    `Logros: ${state.achievements.length}`
  ];
  if (state.thursdayModeUnlocked) {
    lines.push(`⏰ Jueves ${getThursdayClock(state)} | Puntos: ${state.buenFindePoints}/${getRequiredFridayPoints(state)} | Finde nivel ${state.fridayLevel}`);
  }
  return { messages: lines };
}

function buy(state: GameState, target: string): CommandResult {
  const key = UPGRADE_ALIASES[target] ?? (state.upgrades[target] ? target : undefined);
  if (!key) return { messages: ['Upgrade no encontrado. Usa "list upgrades".'] };
  const result = buyUpgrade(state, key);
  const messages = [...result.messages];
  if (result.ok) {
    messages.push(...checkAchievements(state));
    messages.push(...checkThursdayUnlock(state));
  }
  return { messages, save: result.ok };
}

function list(state: GameState, target: string): CommandResult {
  if (target === 'upgrades' || target === '') {
    const lines = Object.entries(state.upgrades).map(([key, upgrade]) => {
      const cost = Math.floor(getUpgradeCost(upgrade));
      const effects: string[] = [];
      if (upgrade.cpsIncrease) effects.push(`+${upgrade.cpsIncrease} CPS`);
      if (upgrade.charismaIncrease) effects.push(`+${upgrade.charismaIncrease} Carisma`);
      if (upgrade.coffeeStrengthIncrease) effects.push(`+${upgrade.coffeeStrengthIncrease} Fuerza`);
      return `${key}: ${upgrade.name} ${effects.join(' ')} (x${upgrade.owned}, costo ${cost})`;
    });
    return { messages: ['Upgrades disponibles:', ...lines] };
  }
  if (target === 'achievements') {
    return { messages: state.achievements.length ? ['Logros:', ...state.achievements.map(a => `- ${a}`)] : ['Ningún logro aún.'] };
  }
  return { messages: ['Usa: list upgrades o list achievements'] };
}

function boss(state: GameState): CommandResult {
  if (state.currentBoss) {
    const dps = Math.max(1, Math.floor((state.charisma + state.coffeeStrength) * 0.5));
    return { messages: [`Boss: ${state.currentBoss.name} | Vida: ${state.currentBoss.health}/${state.currentBoss.maxHealth} | Daño: ${dps}`] };
  }
  const pending = getPendingBoss(state);
  if (pending) return { messages: [`Boss pendiente: ${pending.name} en ${pending.dungeon}. ¡Ve a enfrentarlo!`] };
  return { messages: ['No hay boss activo.'] };
}

function reset(state: GameState, target: string): CommandResult {
  if (target !== 'confirm') {
    return { messages: ['⚠️ Esto borra toda la partida. Escribe "reset confirm" para confirmar.'] };
  }
  return { messages: ['Juego reseteado.'], reset: true };
}

function explore(state: GameState, target: string): CommandResult {
  const key = DUNGEON_ALIASES[target.toLowerCase()];
  if (!key) {
    return { messages: ['Mazmorras: sala reuniones, cafeteria oscura, casa damian, bodega secreta, posada perros, oficina central.'] };
  }
  return merge(enterDungeon(state, key), { save: true });
}

function go(state: GameState, target: string): CommandResult {
  const directions: Record<string, [number, number]> = {
    north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0]
  };
  const dir = directions[target];
  if (!dir) return { messages: ['Direcciones: north, south, east, west.'] };
  return merge(movePlayer(state, dir[0], dir[1]), { save: true });
}

function dungeons(state: GameState): CommandResult {
  const entries = Object.keys(state.dungeonMaps).filter(key => isDungeonUnlocked(state, key));
  if (!entries.length) return { messages: ['Ninguna mazmorra disponible aún.'] };
  const lines = entries.map(key => {
    const boss = state.bosses.find(b => b.dungeon === key);
    const flag = boss && isBossAvailable(state, boss) ? ' ⚔️' : '';
    return `- ${key}${flag}`;
  });
  return { messages: ['Mazmorras disponibles:', ...lines] };
}

function fight(state: GameState, ctx: CommandContext): CommandResult {
  if (state.currentBoss) return merge(fightBoss(state, ctx.now), { save: true });
  if (state.currentMonster) return merge(fightMonster(state, ctx.now), { save: true });
  return { messages: ['No hay enemigos. Explora dungeons.'] };
}

function credits(state: GameState): CommandResult {
  if (state.totalCoffee < 100000 || state.defeatedBosses.length < 6) {
    return { messages: ['Los créditos se desbloquean al completar la historia.'] };
  }
  return { messages: ['🏆 Ancleto\'s Coffee World — creado por el universo de Ancleto. ¡Gracias por jugar!'] };
}

// ── Comandos de desarrollo ────────────────────────────────────────────
function runDevCommand(state: GameState, action: string, target: string, ctx: CommandContext): CommandResult | null {
  switch (action) {
    case 'devhelp':
      return { messages: [
        '🔧 setcoffee|settotal|setcps|setcharisma|setstrength [n]',
        '🔧 unlockall | listbosses | spawnboss [n] | defeatboss [n] | resetbosses',
        '🔧 jumpact [1-6] | forcedialogue [i] | nextdialogue',
        '🔧 addachievement [n] | clearachievements | godmode | devinfo'
      ] };
    case 'devinfo':
      return { messages: [
        `🔧 Dev: ON | Dungeon: ${state.currentDungeonKey ?? 'ninguna'} | Boss: ${state.currentBoss?.name ?? 'ninguno'}`,
        `🔧 Bosses: ${state.defeatedBosses.length}/6 | Acto: ${getCurrentAct(state)} | Logros: ${state.achievements.length}`
      ] };
    case 'setcoffee': state.coffee = parseInt(target, 10) || 0; return { messages: [`🔧 Café = ${state.coffee}`], save: true };
    case 'settotal': state.totalCoffee = parseInt(target, 10) || 0; return { messages: [`🔧 Total = ${state.totalCoffee}`], save: true };
    case 'setcps': state.cps = parseInt(target, 10) || 0; return { messages: [`🔧 CPS = ${state.cps}`], save: true };
    case 'setcharisma': state.charisma = parseInt(target, 10) || 0; return { messages: [`🔧 Carisma = ${state.charisma}`], save: true };
    case 'setstrength': state.coffeeStrength = parseInt(target, 10) || 0; return { messages: [`🔧 Fuerza = ${state.coffeeStrength}`], save: true };
    case 'unlockall':
      return { messages: ['🔧 (las dungeons se desbloquean por acto; usa jumpact o defeatboss)'] };
    case 'godmode':
      state.coffee = 999999; state.totalCoffee = 999999; state.cps = 9999; state.charisma = 999; state.coffeeStrength = 999;
      return { messages: ['🔧 MODO DIOS: recursos al máximo.'], save: true };
    case 'listbosses':
      return { messages: ['🔧 Bosses:', ...state.bosses.map(b => `🔧 ${b.name} ${state.defeatedBosses.includes(b.name) ? '✅' : '❌'} acto ${b.act}`)] };
    case 'spawnboss': {
      const boss = state.bosses.find(b => b.name.toLowerCase().includes(target.toLowerCase()));
      if (!boss) return { messages: ['🔧 Boss no encontrado.'] };
      state.currentBoss = { ...boss, health: boss.maxHealth };
      state.inDungeon = true;
      state.currentDungeonKey = boss.dungeon;
      return { messages: [`🔧 ${boss.name} spawneado en ${boss.dungeon}.`], save: true };
    }
    case 'defeatboss': {
      const boss = state.bosses.find(b => b.name.toLowerCase().includes(target.toLowerCase()));
      if (!boss) return { messages: ['🔧 Boss no encontrado.'] };
      if (!state.defeatedBosses.includes(boss.name)) {
        state.defeatedBosses.push(boss.name);
        state.coffee += boss.reward;
        state.totalCoffee += boss.reward;
      }
      return { messages: [`🔧 ${boss.name} derrotado.`], save: true };
    }
    case 'resetbosses':
      state.defeatedBosses = [];
      state.currentBoss = null;
      return { messages: ['🔧 Bosses reseteados.'], save: true };
    case 'jumpact': {
      const act = parseInt(target, 10);
      if (act < 1 || act > 6) return { messages: ['🔧 Acto inválido (1-6).'] };
      state.defeatedBosses = state.bosses.filter(b => b.act < act).map(b => b.name);
      state.totalCoffee = Math.max(state.totalCoffee, actByNumber(act).start);
      return { messages: [`🔧 Saltaste al Acto ${act}.`], save: true };
    }
    case 'forcedialogue': {
      const i = parseInt(target, 10);
      if (i < 0 || i >= DIALOGUES.length) return { messages: ['🔧 Índice inválido.'] };
      state.currentDialogueIndex = i;
      state.totalCoffee = Math.max(state.totalCoffee, DIALOGUES[i].threshold);
      return { messages: [`🔧 Diálogo: "${DIALOGUES[i].title}".`], save: true };
    }
    case 'nextdialogue':
      state.currentDialogueIndex = Math.min(DIALOGUES.length - 1, state.currentDialogueIndex + 1);
      return { messages: [`🔧 Diálogo ${state.currentDialogueIndex}.`], save: true };
    case 'addachievement':
      if (target && !state.achievements.includes(target)) state.achievements.push(target);
      return { messages: ['🔧 Logro agregado.'], save: true };
    case 'clearachievements':
      state.achievements = [];
      return { messages: ['🔧 Logros limpiados.'], save: true };
    case 'tickthursday':
      return { messages: tickThursday(state, ctx.random), save: true };
    default:
      return null;
  }
}

export function describeAvailableUpgrades(): string[] {
  return Object.keys(INITIAL_UPGRADES);
}
