// Motor puro de Coffee World (sin DOM). Fuente única de verdad de reglas.
import {
  ACTS,
  ACHIEVEMENTS,
  BASE_FRIDAY_POINTS,
  BOSS_DAMAGE_FACTOR,
  DIALOGUES,
  DONATE_COOLDOWN_MS,
  DONATE_DURATION_MS,
  FIGHT_COOLDOWN_BOSS_MS,
  FIGHT_COOLDOWN_MONSTER_MS,
  FRIDAY_DURATION_MS,
  INITIAL_BOSSES,
  INITIAL_UPGRADES,
  MAIL_COOLDOWN_MS,
  MONSTER_DAMAGE_FACTOR,
  POST_GAME_COMPLETION_FRIDAY_LEVEL,
  SAVE_VERSION,
  THURSDAY_EVENT_CHECK_INTERVAL,
  THURSDAY_EVENT_PROBABILITY,
  THURSDAY_EVENTS,
  THURSDAY_POINTS,
  THURSDAY_POINT_RETENTION_RATIO,
  WORK_COOLDOWN_MS,
  actByNumber,
  cloneDungeonMap,
  createDungeons,
  type Boss,
  type DungeonDef,
  type DungeonMonster,
  type Upgrade
} from './content';

export interface ActiveEvent {
  name: string;
  type: 'curse' | 'blessing';
  duration: number;
  factor?: number;
  cooldownFactor?: number;
}

export interface CurrentMonster extends DungeonMonster {
  x: number;
  y: number;
  maxHealth: number;
}

export interface ThursdayStats {
  thursdaysSurvived: number;
  totalThursdayTime: number;
  eventsEncountered: Record<string, number>;
  fridaysUnlocked: number;
  bestPointsRecord: number;
}

export interface GameState {
  saveVersion: number;
  coffee: number;
  totalCoffee: number;
  cps: number;
  charisma: number;
  coffeeStrength: number;
  upgrades: Record<string, Upgrade>;
  achievements: string[];
  currentBoss: Boss | null;
  defeatedBosses: string[];
  bosses: Boss[];
  currentDialogueIndex: number;
  lastMailTime: number;
  lastWorkTime: number;
  lastFightTime: number;
  donateEndTime: number;
  lastDonateTime: number;
  inDungeon: boolean;
  currentDungeonKey: string | null;
  playerPos: { x: number; y: number };
  dungeonMaps: Record<string, string[][]>;
  currentMonster: CurrentMonster | null;
  thursdayModeUnlocked: boolean;
  thursdayTime: number;
  buenFindePoints: number;
  fridayLevel: number;
  fridayUnlocked: boolean;
  fridayEndTime: number;
  activeThursdayEvents: ActiveEvent[];
  postGameCompleted: boolean;
  thursdayStats: ThursdayStats;
  roguelikeModeActive: boolean;
  roguelikeRuns: number;
  persistentBonuses: { cps: number };
  nextRunMultiplier: number;
  godMode: boolean;
}

export interface ActionResult {
  ok: boolean;
  messages: string[];
}

// ── Normalización / validación ────────────────────────────────────────
export function normalizeInteger(value: unknown, defaultValue = 0): number {
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
}

export function normalizeFloat(value: unknown, defaultValue = 0): number {
  const parsed = parseFloat(String(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
}

function emptyThursdayStats(): ThursdayStats {
  return { thursdaysSurvived: 0, totalThursdayTime: 0, eventsEncountered: {}, fridaysUnlocked: 0, bestPointsRecord: 0 };
}

export function createInitialState(): GameState {
  const maps: Record<string, string[][]> = {};
  const dungeons = createDungeons();
  for (const key of Object.keys(dungeons)) {
    maps[key] = cloneDungeonMap(dungeons[key].map);
  }
  return {
    saveVersion: SAVE_VERSION,
    coffee: 0,
    totalCoffee: 0,
    cps: 0,
    charisma: 0,
    coffeeStrength: 0,
    upgrades: JSON.parse(JSON.stringify(INITIAL_UPGRADES)),
    achievements: [],
    currentBoss: null,
    defeatedBosses: [],
    bosses: JSON.parse(JSON.stringify(INITIAL_BOSSES)),
    currentDialogueIndex: 0,
    lastMailTime: 0,
    lastWorkTime: 0,
    lastFightTime: 0,
    donateEndTime: 0,
    lastDonateTime: 0,
    inDungeon: false,
    currentDungeonKey: null,
    playerPos: { x: 0, y: 0 },
    dungeonMaps: maps,
    currentMonster: null,
    thursdayModeUnlocked: false,
    thursdayTime: 0,
    buenFindePoints: 0,
    fridayLevel: 0,
    fridayUnlocked: false,
    fridayEndTime: 0,
    activeThursdayEvents: [],
    postGameCompleted: false,
    thursdayStats: emptyThursdayStats(),
    roguelikeModeActive: false,
    roguelikeRuns: 0,
    persistentBonuses: { cps: 1.0 },
    nextRunMultiplier: 1.0,
    godMode: false
  };
}

export function validateGameValues(state: GameState): void {
  state.saveVersion = SAVE_VERSION;
  state.coffee = normalizeFloat(state.coffee);
  state.totalCoffee = normalizeFloat(state.totalCoffee);
  state.cps = normalizeFloat(state.cps);
  state.charisma = normalizeInteger(state.charisma);
  state.coffeeStrength = normalizeInteger(state.coffeeStrength);
  state.lastMailTime = normalizeInteger(state.lastMailTime);
  state.lastWorkTime = normalizeInteger(state.lastWorkTime);
  state.lastFightTime = normalizeInteger(state.lastFightTime);
  state.donateEndTime = normalizeInteger(state.donateEndTime);
  state.lastDonateTime = normalizeInteger(state.lastDonateTime);
  state.currentDialogueIndex = normalizeInteger(state.currentDialogueIndex);
  state.thursdayTime = normalizeInteger(state.thursdayTime);
  state.buenFindePoints = normalizeInteger(state.buenFindePoints);
  state.fridayLevel = normalizeInteger(state.fridayLevel);
  state.fridayEndTime = normalizeInteger(state.fridayEndTime);
  state.roguelikeRuns = normalizeInteger(state.roguelikeRuns);
  state.nextRunMultiplier = normalizeFloat(state.nextRunMultiplier, 1.0) || 1.0;

  if (!Array.isArray(state.achievements)) state.achievements = [];
  if (!Array.isArray(state.defeatedBosses)) state.defeatedBosses = [];
  if (!Array.isArray(state.bosses) || state.bosses.length === 0) {
    state.bosses = JSON.parse(JSON.stringify(INITIAL_BOSSES));
  }
  if (!Array.isArray(state.activeThursdayEvents)) state.activeThursdayEvents = [];
  if (!state.persistentBonuses || typeof state.persistentBonuses !== 'object') {
    state.persistentBonuses = { cps: 1.0 };
  }
  state.persistentBonuses.cps = normalizeFloat(state.persistentBonuses.cps, 1.0) || 1.0;
  if (!state.thursdayStats || typeof state.thursdayStats !== 'object') {
    state.thursdayStats = emptyThursdayStats();
  }
  if (!state.playerPos || typeof state.playerPos !== 'object') {
    state.playerPos = { x: 0, y: 0 };
  }
  if (!state.dungeonMaps || typeof state.dungeonMaps !== 'object') {
    state.dungeonMaps = {};
  }
  const defaults = createDungeons();
  for (const key of Object.keys(defaults)) {
    if (!Array.isArray(state.dungeonMaps[key])) {
      state.dungeonMaps[key] = cloneDungeonMap(defaults[key].map);
    }
  }
  state.currentMonster = state.currentMonster ?? null;
  if (!state.inDungeon) {
    state.currentDungeonKey = null;
  }

  for (const key in state.upgrades) {
    const upgrade = state.upgrades[key];
    if (!upgrade || typeof upgrade !== 'object') {
      state.upgrades[key] = { ...INITIAL_UPGRADES[key] };
      continue;
    }
    upgrade.owned = normalizeInteger(upgrade.owned);
    if (!Number.isFinite(upgrade.cost) || upgrade.cost <= 0) {
      upgrade.cost = INITIAL_UPGRADES[key]?.cost ?? 0;
    }
  }
}

// ── Actos ─────────────────────────────────────────────────────────────
export function getCurrentAct(state: GameState): number {
  return Math.min(ACTS.length, state.defeatedBosses.length + 1);
}

export function getActRange(act: number): { start: number; end: number } {
  const def = actByNumber(act);
  return { start: def.start, end: def.end };
}

export function getActProgress(state: GameState): number {
  const { start, end } = getActRange(getCurrentAct(state));
  const range = end - start;
  if (range <= 0) return 1;
  return Math.min(Math.max((state.totalCoffee - start) / range, 0), 1);
}

export function isBossDefeated(state: GameState, name: string): boolean {
  return state.defeatedBosses.includes(name);
}

export function isBossAvailable(state: GameState, boss: Boss): boolean {
  return boss.act === getCurrentAct(state) && state.totalCoffee >= boss.spawnAt && !isBossDefeated(state, boss.name);
}

export function isDungeonUnlocked(state: GameState, dungeonKey: string): boolean {
  const boss = state.bosses.find(b => b.dungeon === dungeonKey);
  if (!boss) return false;
  return boss.act <= getCurrentAct(state);
}

export function getPendingBoss(state: GameState): Boss | undefined {
  return state.bosses.find(b => isBossAvailable(state, b));
}

// ── Costos y compras ──────────────────────────────────────────────────
export function getUpgradeCost(upgrade: Upgrade): number {
  return upgrade.cost * Math.pow(1.15, upgrade.owned);
}

export function buyUpgrade(state: GameState, upgradeKey: string): ActionResult {
  const upgrade = state.upgrades[upgradeKey];
  if (!upgrade) return { ok: false, messages: ['Upgrade no encontrado.'] };

  const cost = getUpgradeCost(upgrade);
  if (state.coffee < cost) {
    return { ok: false, messages: [`No tienes suficiente café (necesitas ${Math.floor(cost)}).`] };
  }

  const act = getCurrentAct(state);
  const { end } = getActRange(act);
  const pending = getPendingBoss(state);
  const combatUpgrade = Boolean(upgrade.coffeeStrengthIncrease || upgrade.charismaIncrease);
  if (state.totalCoffee >= end && !(pending && combatUpgrade)) {
    return { ok: false, messages: [`Acto ${act} bloqueado: derrota a ${actByNumber(act).bossName} para seguir comprando.`] };
  }

  state.coffee -= cost;
  upgrade.owned += 1;
  state.cps += upgrade.cpsIncrease || 0;
  state.charisma += upgrade.charismaIncrease || 0;
  state.coffeeStrength += upgrade.coffeeStrengthIncrease || 0;

  if (state.thursdayModeUnlocked) {
    earnBuenFindePoints(state, 'completar_upgrade');
  }
  return { ok: true, messages: [`Compraste ${upgrade.name}. CPS: ${state.cps}.`] };
}

// ── Producción ────────────────────────────────────────────────────────
export function getCpsMultiplier(state: GameState): number {
  let multiplier = 1;
  if (state.thursdayModeUnlocked) {
    for (const event of state.activeThursdayEvents) {
      if (typeof event.factor === 'number') multiplier *= event.factor;
    }
  }
  if (state.fridayUnlocked) multiplier *= 3;
  if (state.persistentBonuses && state.persistentBonuses.cps !== 1.0) {
    multiplier *= state.persistentBonuses.cps;
  }
  return multiplier;
}

export function calculateEffectiveCPS(state: GameState, now = Date.now()): number {
  let effective = state.cps;
  if (now < state.donateEndTime) effective *= 1.1;
  effective *= getCpsMultiplier(state);
  return effective;
}

export function produceCoffee(state: GameState, now = Date.now()): number {
  const effective = calculateEffectiveCPS(state, now);
  state.coffee += effective;
  state.totalCoffee += effective;
  return effective;
}

// ── Narrativa / logros ────────────────────────────────────────────────
export function getLatestDialogueIndex(state: GameState): number {
  const act = getCurrentAct(state);
  let index = 0;
  for (let i = 0; i < DIALOGUES.length; i++) {
    const dialogue = DIALOGUES[i];
    if (dialogue.act <= act && state.totalCoffee >= dialogue.threshold) {
      index = i;
    }
  }
  return index;
}

export function checkAchievements(state: GameState): string[] {
  const unlocked: string[] = [];
  const valueOf = (stat: string): number => {
    switch (stat) {
      case 'totalCoffee': return state.totalCoffee;
      case 'cps': return state.cps;
      case 'charisma': return state.charisma;
      case 'coffeeStrength': return state.coffeeStrength;
      case 'defeatedBosses': return state.defeatedBosses.length;
      default: return 0;
    }
  };
  for (const achievement of ACHIEVEMENTS) {
    if (valueOf(achievement.stat) >= achievement.threshold && !state.achievements.includes(achievement.key)) {
      state.achievements.push(achievement.key);
      unlocked.push(`${achievement.icon} ¡LOGRO DESBLOQUEADO: ${achievement.key}!`);
    }
  }
  const totalOwned = Object.values(state.upgrades).reduce((sum, u) => sum + u.owned, 0);
  const unlockedDungeons = Object.keys(state.dungeonMaps).filter(key => isDungeonUnlocked(state, key)).length;
  const specials: Array<[boolean, string]> = [
    [totalOwned >= 10, 'Coleccionista'],
    [totalOwned >= 50, 'Acumulador Supremo'],
    [unlockedDungeons >= 2, 'Explorador de Mazmorras'],
    [state.totalCoffee >= 1000 && state.charisma >= 10 && state.coffeeStrength >= 10, 'Triple Amenaza'],
    [state.cps >= 100 && state.totalCoffee < 50000, 'Eficiencia Extrema']
  ];
  for (const [condition, key] of specials) {
    if (condition && !state.achievements.includes(key)) {
      state.achievements.push(key);
      unlocked.push(`⭐ ¡LOGRO ESPECIAL: ${key}!`);
    }
  }
  return unlocked;
}

// ── Acciones económicas ───────────────────────────────────────────────
export function sendMail(state: GameState, now = Date.now()): ActionResult {
  const cooldown = getMailCooldown(state);
  const remaining = cooldown - (now - state.lastMailTime);
  if (remaining > 0) {
    return { ok: false, messages: [`Espera ${Math.ceil(remaining / 1000)}s antes de enviar otro mail.`] };
  }
  state.coffee += 50;
  state.totalCoffee += 50;
  state.lastMailTime = now;
  return { ok: true, messages: ['Mail corporativo enviado. +50 café.'] };
}

export function getMailCooldown(state: GameState): number {
  let factor = 1;
  for (const event of state.activeThursdayEvents) {
    if (typeof event.cooldownFactor === 'number') factor *= event.cooldownFactor;
  }
  return MAIL_COOLDOWN_MS * factor;
}

export function work(state: GameState, now = Date.now()): ActionResult {
  if (now - state.lastWorkTime < WORK_COOLDOWN_MS) {
    return { ok: false, messages: ['Espera 5 segundos antes de trabajar de nuevo.'] };
  }
  const earned = 20 + Math.floor(state.charisma / 2);
  state.coffee += earned;
  state.totalCoffee += earned;
  state.lastWorkTime = now;
  return { ok: true, messages: [`Trabajaste duro. Ganaste ${earned} café.`] };
}

export function donate(state: GameState, now = Date.now()): ActionResult {
  if (now - state.lastDonateTime < DONATE_COOLDOWN_MS) {
    return { ok: false, messages: [`Espera ${Math.ceil((DONATE_COOLDOWN_MS - (now - state.lastDonateTime)) / 1000)}s antes de donar de nuevo.`] };
  }
  if (state.coffee < 100) {
    return { ok: false, messages: ['Necesitas al menos 100 café para donar.'] };
  }
  state.coffee -= 100;
  state.donateEndTime = now + DONATE_DURATION_MS;
  state.lastDonateTime = now;
  return { ok: true, messages: ['¡Gracias por donar! +10% de producción por 1 minuto.'] };
}

// ── Dungeons y combate ────────────────────────────────────────────────
export function getDungeonMap(state: GameState, key: string): string[][] {
  return state.dungeonMaps[key] ?? [];
}

export function enterDungeon(state: GameState, key: string): ActionResult {
  const dungeons = createDungeons();
  const dungeon = dungeons[key];
  if (!dungeon) return { ok: false, messages: ['Mazmorra desconocida.'] };
  if (!isDungeonUnlocked(state, key)) return { ok: false, messages: ['Mazmorra no disponible: derrota al boss del acto anterior.'] };

  state.inDungeon = true;
  state.currentDungeonKey = key;
  state.playerPos = { ...dungeon.start };
  state.currentMonster = null;

  const messages = [`Entrando a ${dungeon.displayName}...`];
  const boss = state.bosses.find(b => b.dungeon === key);
  if (boss && isBossAvailable(state, boss)) {
    messages.push(`⚔️ BOSS DETECTADO: ${boss.name} está esperándote en esta dungeon.`);
  }
  messages.push(renderMap(state));
  return { ok: true, messages };
}

export function exitDungeon(state: GameState): ActionResult {
  state.inDungeon = false;
  state.currentDungeonKey = null;
  state.currentMonster = null;
  state.currentBoss = null;
  return { ok: true, messages: ['Saliendo de la mazmorra.'] };
}

export function renderMap(state: GameState): string {
  if (!state.inDungeon || !state.currentDungeonKey) return '';
  const map = getDungeonMap(state, state.currentDungeonKey);
  const lines: string[] = [];
  for (let y = 0; y < map.length; y++) {
    let row = '';
    for (let x = 0; x < map[y].length; x++) {
      row += x === state.playerPos.x && y === state.playerPos.y ? '@' : map[y][x];
    }
    lines.push(row);
  }
  lines.push('@ = Tú, M = Monstruo, B = Boss, E = Salida, # = Pared');
  if (state.currentMonster) {
    lines.push(`⚔️ En combate: ${state.currentMonster.name} (${Math.max(0, state.currentMonster.health)}/${state.currentMonster.maxHealth} HP)`);
  }
  if (state.currentBoss) {
    lines.push(`👑 Boss: ${state.currentBoss.name} (${Math.max(0, state.currentBoss.health)}/${state.currentBoss.maxHealth} HP)`);
  }
  return lines.join('\n');
}

export function movePlayer(state: GameState, dx: number, dy: number): ActionResult {
  if (!state.inDungeon || !state.currentDungeonKey) {
    return { ok: false, messages: ['No estás en una mazmorra.'] };
  }
  const map = getDungeonMap(state, state.currentDungeonKey);
  const newX = state.playerPos.x + dx;
  const newY = state.playerPos.y + dy;
  if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
    return { ok: false, messages: ['No puedes ir ahí.'] };
  }
  const tile = map[newY][newX];
  if (tile === '#') return { ok: false, messages: ['¡Pared! No puedes pasar.'] };

  state.playerPos = { x: newX, y: newY };
  const messages: string[] = [];

  if (tile === 'M') {
    const dungeons = createDungeons();
    const monster = dungeons[state.currentDungeonKey].monsters['M'];
    state.currentMonster = { ...monster, x: newX, y: newY, maxHealth: monster.health };
    messages.push(`¡Encuentras a ${monster.name}! (Vida: ${monster.health}). Usa 'fight'.`);
  } else if (tile === 'B') {
    const boss = state.bosses.find(b => b.dungeon === state.currentDungeonKey);
    if (boss && isBossAvailable(state, boss)) {
      state.currentBoss = { ...boss };
      messages.push(`⚔️ ¡Encuentras a ${boss.name}! Usa 'fight'.`);
    } else if (boss && isBossDefeated(state, boss.name)) {
      messages.push(`El lugar donde derrotaste a ${boss.name}. Solo quedan recuerdos.`);
    } else {
      messages.push('El boss de esta mazmorra aún no está disponible.');
    }
  } else if (newX === dungeonsExit(state).x && newY === dungeonsExit(state).y) {
    messages.push(...exitDungeon(state).messages);
    return { ok: true, messages };
  }

  messages.push(renderMap(state));
  return { ok: true, messages };
}

function dungeonsExit(state: GameState): { x: number; y: number } {
  const dungeons = createDungeons();
  const dungeon = state.currentDungeonKey ? dungeons[state.currentDungeonKey] : undefined;
  return dungeon ? dungeon.exit : { x: -1, y: -1 };
}

export function fightMonster(state: GameState, now = Date.now()): ActionResult {
  if (!state.inDungeon || !state.currentMonster) {
    return { ok: false, messages: ['No hay monstruo para luchar.'] };
  }
  if (now - state.lastFightTime < FIGHT_COOLDOWN_MONSTER_MS) {
    return { ok: false, messages: ['Espera antes de atacar de nuevo.'] };
  }
  const monster = state.currentMonster;
  const damage = Math.max(1, Math.floor((state.charisma + state.coffeeStrength) * MONSTER_DAMAGE_FACTOR));
  monster.health -= damage;
  state.lastFightTime = now;
  const messages = [`¡Atacas a ${monster.name}! Daño: ${damage}. Vida: ${Math.max(0, monster.health)}/${monster.maxHealth}`];

  if (monster.health <= 0) {
    state.coffee += monster.reward;
    state.totalCoffee += monster.reward;
    messages.push(`🏆 ¡Derrotaste a ${monster.name}! +${monster.reward} café.`);
    const map = getDungeonMap(state, state.currentDungeonKey as string);
    map[monster.y][monster.x] = '.';
    state.currentMonster = null;
    messages.push(renderMap(state));
  }
  return { ok: true, messages };
}

export function fightBoss(state: GameState, now = Date.now()): ActionResult {
  if (!state.currentBoss || !state.inDungeon) {
    return { ok: false, messages: ['No hay boss activo.'] };
  }
  if (now - state.lastFightTime < FIGHT_COOLDOWN_BOSS_MS) {
    return { ok: false, messages: ['Espera antes de atacar de nuevo.'] };
  }
  const boss = state.currentBoss;
  const damage = Math.max(1, Math.floor((state.charisma + state.coffeeStrength) * BOSS_DAMAGE_FACTOR));
  boss.health -= damage;
  state.lastFightTime = now;
  const messages = [`¡Atacas a ${boss.name}! Daño: ${damage}. Vida: ${Math.max(0, boss.health)}/${boss.maxHealth}`];

  if (boss.health <= 0) {
    state.coffee += boss.reward;
    state.totalCoffee += boss.reward;
    if (!state.defeatedBosses.includes(boss.name)) state.defeatedBosses.push(boss.name);
    state.achievements.push(`Derrotaste a ${boss.name}`);
    state.currentBoss = null;
    messages.push(`🏆 ¡Victoria! Derrotaste a ${boss.name}. +${boss.reward} café.`);
    if (state.thursdayModeUnlocked) earnBuenFindePoints(state, 'derrotar_boss');
  }
  return { ok: true, messages };
}

// ── Feliz Jueves Mode ─────────────────────────────────────────────────
export function checkThursdayUnlock(state: GameState): string[] {
  if (!state.thursdayModeUnlocked && state.totalCoffee >= 100000 && state.defeatedBosses.length >= 6) {
    state.thursdayModeUnlocked = true;
    return [
      '🎉 ¡FELIZ JUEVES MODE DESBLOQUEADO!',
      'El jueves nunca termina. Usa el comando "jueves" para activarlo.'
    ];
  }
  return [];
}

export function toggleThursday(state: GameState): ActionResult {
  if (!state.thursdayModeUnlocked) {
    return { ok: false, messages: ['❌ Debes completar la historia para desbloquear el Feliz Jueves Mode.'] };
  }
  if (state.thursdayTime === 0) {
    state.thursdayTime = 32400;
    return { ok: true, messages: ['⏰ Feliz Jueves Mode activado. Son las 9:00 AM del jueves.'] };
  }
  return { ok: true, messages: ['⏰ Feliz Jueves Mode activo.'] };
}

export function getRequiredFridayPoints(state: GameState): number {
  return BASE_FRIDAY_POINTS * Math.pow(2, state.fridayLevel);
}

export function earnBuenFindePoints(state: GameState, action: string): void {
  if (!state.thursdayModeUnlocked) return;
  const points = THURSDAY_POINTS[action] ?? 0;
  state.buenFindePoints = Math.max(0, state.buenFindePoints + points);
  if (state.buenFindePoints > state.thursdayStats.bestPointsRecord) {
    state.thursdayStats.bestPointsRecord = state.buenFindePoints;
  }
}

// Un tick del jueves: incrementa el reloj una sola vez y resuelve eventos/ciclo.
export function tickThursday(state: GameState, random: () => number = Math.random): string[] {
  if (!state.thursdayModeUnlocked || state.thursdayTime === 0) return [];
  const messages: string[] = [];
  state.thursdayTime += 1;
  state.thursdayStats.totalThursdayTime += 1;

  state.activeThursdayEvents = state.activeThursdayEvents.filter(event => {
    event.duration -= 1;
    if (event.duration <= 0) {
      messages.push(`✅ Evento terminado: ${event.name}`);
      return false;
    }
    return true;
  });

  if (state.thursdayTime % THURSDAY_EVENT_CHECK_INTERVAL === 0 && random() < THURSDAY_EVENT_PROBABILITY) {
    messages.push(...triggerThursdayEvent(state, random));
  }

  if (state.thursdayTime >= 86400) {
    messages.push(...completeThursday(state));
  }
  return messages;
}

export function triggerThursdayEvent(state: GameState, random: () => number = Math.random): string[] {
  const rand = random();
  let cumulative = 0;
  for (const template of THURSDAY_EVENTS) {
    cumulative += template.probability;
    if (rand <= cumulative) {
      state.activeThursdayEvents.push({
        name: template.name,
        type: template.type,
        duration: template.duration,
        factor: template.factor,
        cooldownFactor: template.cooldownFactor
      });
      state.thursdayStats.eventsEncountered[template.name] = (state.thursdayStats.eventsEncountered[template.name] || 0) + 1;
      if (template.type === 'curse') {
        earnBuenFindePoints(state, 'sobrevivir_evento');
      }
      return [template.message];
    }
  }
  return [];
}

export function completeThursday(state: GameState): string[] {
  state.thursdayStats.thursdaysSurvived += 1;
  if (state.buenFindePoints >= getRequiredFridayPoints(state)) {
    return unlockFriday(state);
  }
  return resetThursday(state);
}

export function unlockFriday(state: GameState): string[] {
  state.fridayUnlocked = true;
  state.fridayLevel += 1;
  state.thursdayStats.fridaysUnlocked += 1;
  state.fridayEndTime = Date.now() + FRIDAY_DURATION_MS;
  state.thursdayTime = 32400; // reinicia el ciclo para no re-desbloquear
  state.activeThursdayEvents = [];
  const messages = [
    '🎉 ¡BUEN FINDE DESBLOQUEADO!',
    `Has alcanzado el nivel ${state.fridayLevel} de Buen Finde (+200% CPS por 2 horas).`
  ];
  messages.push(...checkPostGameCompletion(state));
  return messages;
}

function checkPostGameCompletion(state: GameState): string[] {
  if (!state.postGameCompleted && state.fridayLevel >= POST_GAME_COMPLETION_FRIDAY_LEVEL) {
    state.postGameCompleted = true;
    return ['🏆 ¡HAS COMPLETADO EL POST-GAME! Escribe "rogue" para el modo roguelike.'];
  }
  return [];
}

export function endFriday(state: GameState): string[] {
  state.fridayUnlocked = false;
  state.fridayEndTime = 0;
  return ['⏰ El Buen Finde ha terminado. Vuelta al jueves...', ...resetThursday(state)];
}

export function resetThursday(state: GameState): string[] {
  state.thursdayTime = 32400;
  state.buenFindePoints = Math.floor(state.buenFindePoints * THURSDAY_POINT_RETENTION_RATIO);
  state.activeThursdayEvents = [];
  state.fridayEndTime = 0;
  return [`🔄 Nuevo jueves. Puntos Buen Finde: ${state.buenFindePoints}/${getRequiredFridayPoints(state)}.`];
}

export function getThursdayClock(state: GameState): string {
  const hours = Math.floor(state.thursdayTime / 3600) % 24;
  const minutes = Math.floor((state.thursdayTime % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function useBlessing(state: GameState): ActionResult {
  if (!state.thursdayModeUnlocked) return { ok: false, messages: ['El Feliz Jueves Mode no está activo.'] };
  if (state.buenFindePoints < 100) return { ok: false, messages: ['Necesitas 100 puntos Buen Finde para una bendición.'] };
  state.buenFindePoints -= 100;
  state.activeThursdayEvents.push({ name: 'Bendición', type: 'blessing', duration: 600, factor: 2.0 });
  return { ok: true, messages: ['🙏 Bendición usada: +100% CPS por 10 min.'] };
}

export function emergencyCoffee(state: GameState): ActionResult {
  if (!state.thursdayModeUnlocked) return { ok: false, messages: ['El Feliz Jueves Mode no está activo.'] };
  if (state.buenFindePoints < 50) return { ok: false, messages: ['Necesitas 50 puntos Buen Finde.'] };
  state.buenFindePoints -= 50;
  const amount = 100 + Math.floor(state.cps * 60);
  state.coffee += amount;
  state.totalCoffee += amount;
  return { ok: true, messages: [`☕ Café de emergencia: +${amount} café.`] };
}

// ── Roguelike post-postgame ───────────────────────────────────────────
export function enterRoguelikeMode(state: GameState): ActionResult {
  if (!state.postGameCompleted) {
    return { ok: false, messages: ['❌ Debes completar el post-game para el modo roguelike.'] };
  }
  if (state.roguelikeModeActive) {
    return { ok: false, messages: ['⚠️ Ya estás en una run roguelike.'] };
  }
  state.roguelikeModeActive = true;
  state.roguelikeRuns += 1;
  state.nextRunMultiplier = 1 + Math.min(0.5, 0.1 * state.roguelikeRuns);
  applyPermanentBonuses(state);
  return { ok: true, messages: [`🎮 Run #${state.roguelikeRuns} iniciada. Bonus CPS x${state.persistentBonuses.cps.toFixed(2)}.`] };
}

export function processRoguelikeEvent(state: GameState, risk: boolean): ActionResult {
  if (!state.roguelikeModeActive) return { ok: false, messages: ['No hay run roguelike activa.'] };
  if (risk) {
    const lost = Math.min(state.coffee, Math.floor(state.coffee * 0.25));
    state.coffee -= lost;
    const bonus = 50 * state.nextRunMultiplier;
    state.buenFindePoints += Math.floor(bonus);
    return { ok: true, messages: [`🎲 Arriesgaste: -${lost} café, +${Math.floor(bonus)} puntos.`] };
  }
  state.coffee += 20;
  return { ok: true, messages: ['🛡️ Conservador: +20 café.'] };
}

export function completeRoguelikeRun(state: GameState): ActionResult {
  if (!state.roguelikeModeActive) return { ok: false, messages: ['No hay run roguelike activa.'] };
  state.roguelikeModeActive = false;
  applyPermanentBonuses(state);
  return { ok: true, messages: [`🏁 Run completada. Runs totales: ${state.roguelikeRuns}. Bonus CPS x${state.persistentBonuses.cps.toFixed(2)}.`] };
}

export function applyPermanentBonuses(state: GameState): void {
  state.persistentBonuses.cps = 1 + Math.min(1, 0.1 * state.roguelikeRuns);
}

// ── Serialización ─────────────────────────────────────────────────────
export function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

export function deserializeState(jsonString: string): GameState {
  const parsed = JSON.parse(jsonString);
  const defaults = createInitialState();
  const state: GameState = {
    ...defaults,
    ...parsed,
    upgrades: parsed.upgrades ? { ...defaults.upgrades, ...parsed.upgrades } : { ...defaults.upgrades },
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    defeatedBosses: Array.isArray(parsed.defeatedBosses) ? parsed.defeatedBosses : [],
    bosses: Array.isArray(parsed.bosses) && parsed.bosses.length ? parsed.bosses : defaults.bosses,
    activeThursdayEvents: Array.isArray(parsed.activeThursdayEvents) ? parsed.activeThursdayEvents : [],
    thursdayStats: parsed.thursdayStats ?? defaults.thursdayStats,
    dungeonMaps: parsed.dungeonMaps ?? defaults.dungeonMaps,
    persistentBonuses: parsed.persistentBonuses ?? defaults.persistentBonuses
  };
  state.inDungeon = false;
  state.currentDungeonKey = null;
  state.currentMonster = null;
  state.currentBoss = null;
  validateGameValues(state);
  // Migración: recalcular índice de diálogo desde el progreso real.
  state.currentDialogueIndex = getLatestDialogueIndex(state);
  return state;
}
