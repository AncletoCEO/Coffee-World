import { describe, it, expect } from 'vitest';
import {
  buyUpgrade,
  checkAchievements,
  checkThursdayUnlock,
  completeRoguelikeRun,
  completeThursday,
  createInitialState,
  deserializeState,
  donate,
  emergencyCoffee,
  endFriday,
  enterDungeon,
  enterRoguelikeMode,
  fightBoss,
  fightMonster,
  getActProgress,
  getCpsMultiplier,
  getCurrentAct,
  getLatestDialogueIndex,
  getRequiredFridayPoints,
  getThursdayClock,
  getUpgradeCost,
  isBossAvailable,
  isDungeonUnlocked,
  movePlayer,
  processRoguelikeEvent,
  sendMail,
  serializeState,
  tickThursday,
  toggleThursday,
  triggerThursdayEvent,
  useBlessing,
  validateGameValues,
  work
} from './game-engine';
import { DIALOGUES, INITIAL_BOSSES } from './content';

describe('Progresión (Fase 1)', () => {
  it('el acto depende de los bosses derrotados', () => {
    const state = createInitialState();
    expect(getCurrentAct(state)).toBe(1);
    state.defeatedBosses = ['Damián Rebelde'];
    expect(getCurrentAct(state)).toBe(2);
    state.defeatedBosses = INITIAL_BOSSES.map(b => b.name);
    expect(getCurrentAct(state)).toBe(6);
  });

  it('el progreso del acto se calcula sobre el rango del acto actual', () => {
    const state = createInitialState();
    state.totalCoffee = 2000;
    expect(getActProgress(state)).toBeCloseTo(0.5, 5);
  });

  it('los diálogos del Acto 6 son alcanzables', () => {
    const state = createInitialState();
    state.defeatedBosses = INITIAL_BOSSES.map(b => b.name);
    state.totalCoffee = 100000;
    expect(getLatestDialogueIndex(state)).toBe(DIALOGUES.length - 1);
  });

  it('la dungeon se desbloquea en el acto de su boss', () => {
    const state = createInitialState();
    expect(isDungeonUnlocked(state, 'cafeteriaOscura')).toBe(false);
    state.defeatedBosses = ['Damián Rebelde'];
    expect(isDungeonUnlocked(state, 'cafeteriaOscura')).toBe(true);
  });

  it('el boss sólo está disponible en su acto y con café suficiente', () => {
    const state = createInitialState();
    const boss = state.bosses.find(b => b.act === 2)!;
    expect(isBossAvailable(state, boss)).toBe(false);
    state.defeatedBosses = ['Damián Rebelde'];
    state.totalCoffee = 4000;
    expect(isBossAvailable(state, boss)).toBe(true);
  });

  it('bloquea compras al superar el rango del acto sin boss pendiente', () => {
    const state = createInitialState();
    state.defeatedBosses = ['Damián Rebelde'];
    state.totalCoffee = 9999; // acto 2 (4000-8500) ya superado, boss derrotado
    state.coffee = 1e9;
    const result = buyUpgrade(state, 'upgrade6'); // sólo CPS: no ayuda en combate
    expect(result.ok).toBe(false);
  });

  it('el costo del upgrade se preserva entre serialización y carga', () => {
    const state = createInitialState();
    state.coffee = 1000;
    state.totalCoffee = 1000;
    buyUpgrade(state, 'upgrade1');
    const before = getUpgradeCost(state.upgrades.upgrade1);
    const restored = deserializeState(serializeState(state));
    expect(getUpgradeCost(restored.upgrades.upgrade1)).toBeCloseTo(before, 10);
  });

  it('cada boss es vencible con estadísticas razonables del acto', () => {
    for (const boss of INITIAL_BOSSES) {
      const charisma = boss.act * 10;
      const strength = boss.act * 20;
      const damage = Math.max(1, Math.floor((charisma + strength) * 0.5));
      const hits = Math.ceil(boss.maxHealth / damage);
      expect(hits).toBeLessThanOrEqual(40);
    }
  });
});

describe('Feliz Jueves (Fase 2)', () => {
  it('un tick incrementa el reloj exactamente una vez', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.thursdayTime = 32400;
    tickThursday(state, () => 1);
    expect(state.thursdayTime).toBe(32401);
  });

  it('no re-desbloquea el viernes dentro del mismo ciclo', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.thursdayTime = 86399;
    state.buenFindePoints = getRequiredFridayPoints(state) + 100;
    tickThursday(state, () => 1);
    expect(state.fridayLevel).toBe(1);
    expect(state.thursdayTime).toBe(32400);
    tickThursday(state, () => 1);
    tickThursday(state, () => 1);
    expect(state.fridayLevel).toBe(1);
  });

  it('los eventos del jueves se re-aplican al cargar', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.activeThursdayEvents = [{ name: 'Café Agotado', type: 'curse', duration: 100, factor: 0.3 }];
    expect(getCpsMultiplier(state)).toBeCloseTo(0.3, 5);
    const restored = deserializeState(serializeState(state));
    expect(getCpsMultiplier(restored)).toBeCloseTo(0.3, 5);
  });

  it('el mail del jefe duplica el cooldown de mail', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.activeThursdayEvents = [{ name: 'Mail del Jefe', type: 'curse', duration: 100, cooldownFactor: 2 }];
    const restored = deserializeState(serializeState(state));
    expect(restored.activeThursdayEvents[0].cooldownFactor).toBe(2);
  });

  it('otorga puntos según la tabla por acción', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.activeThursdayEvents = [];
    state.buenFindePoints = 0;
    triggerThursdayEvent(state, () => 0); // primer evento: maldición → +50
    expect(state.buenFindePoints).toBe(50);
  });

  it('completeThursday desbloquea viernes sólo una vez', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.buenFindePoints = getRequiredFridayPoints(state) + 1;
    const messages = completeThursday(state);
    expect(messages.join(' ')).toContain('BUEN FINDE');
    expect(state.fridayLevel).toBe(1);
    expect(state.thursdayTime).toBe(32400);
  });
});

describe('Roguelike (Fase 3)', () => {
  it('bloquea la entrada sin completar el post-game', () => {
    const state = createInitialState();
    expect(enterRoguelikeMode(state).ok).toBe(false);
  });

  it('aplica bonus persistentes al entrar', () => {
    const state = createInitialState();
    state.postGameCompleted = true;
    const result = enterRoguelikeMode(state);
    expect(result.ok).toBe(true);
    expect(state.roguelikeRuns).toBe(1);
    expect(state.persistentBonuses.cps).toBeCloseTo(1.1, 5);
    expect(getCpsMultiplier(state)).toBeCloseTo(1.1, 5);
  });
});

describe('Acciones y combate', () => {
  it('mail, work y donate otorgan recursos y respetan cooldowns', () => {
    const state = createInitialState();
    expect(sendMail(state, 200000).ok).toBe(true);
    expect(state.coffee).toBe(50);
    expect(sendMail(state, 200001).ok).toBe(false);
    expect(work(state, 300000).ok).toBe(true);
    state.coffee = 200;
    expect(donate(state, 400000).ok).toBe(true);
    expect(state.coffee).toBe(100);
  });

  it('derrota a un monstruo en la dungeon', () => {
    const state = createInitialState();
    state.charisma = 100;
    state.coffeeStrength = 100;
    enterDungeon(state, 'salaReuniones');
    movePlayer(state, -1, 0); // se mueve al monstruo en (1,2)
    let now = 100000;
    for (let i = 0; i < 5 && state.currentMonster; i++) {
      fightMonster(state, now);
      now += 2000;
    }
    expect(state.currentMonster).toBeNull();
    expect(state.coffee).toBeGreaterThan(0);
  });

  it('derrota al boss del acto', () => {
    const state = createInitialState();
    state.charisma = 500;
    state.coffeeStrength = 500;
    enterDungeon(state, 'salaReuniones');
    state.currentBoss = { ...state.bosses[0] };
    let now = 100000;
    for (let i = 0; i < 5 && state.currentBoss; i++) {
      fightBoss(state, now);
      now += 3000;
    }
    expect(state.defeatedBosses).toContain('Damián Rebelde');
  });

  it('bendición y café de emergencia consumen puntos', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.buenFindePoints = 500;
    expect(useBlessing(state).ok).toBe(true);
    expect(state.buenFindePoints).toBe(400);
    expect(emergencyCoffee(state).ok).toBe(true);
    expect(state.buenFindePoints).toBe(350);
  });

  it('eventos roguelike de riesgo y seguro', () => {
    const state = createInitialState();
    state.postGameCompleted = true;
    state.roguelikeModeActive = true;
    state.coffee = 1000;
    expect(processRoguelikeEvent(state, true).ok).toBe(true);
    expect(state.coffee).toBe(750);
    expect(processRoguelikeEvent(state, false).ok).toBe(true);
    expect(completeRoguelikeRun(state).ok).toBe(true);
    expect(state.roguelikeModeActive).toBe(false);
  });

  it('endFriday vuelve al jueves', () => {
    const state = createInitialState();
    state.thursdayModeUnlocked = true;
    state.fridayUnlocked = true;
    const messages = endFriday(state);
    expect(state.fridayUnlocked).toBe(false);
    expect(state.thursdayTime).toBe(32400);
    expect(messages.join(' ')).toContain('Buen Finde');
  });

  it('reloj y desbloqueo del jueves', () => {
    const state = createInitialState();
    state.thursdayTime = 3600 * 9 + 60 * 30;
    expect(getThursdayClock(state)).toBe('09:30');
    state.totalCoffee = 100000;
    state.defeatedBosses = INITIAL_BOSSES.map(b => b.name);
    expect(checkThursdayUnlock(state).length).toBeGreaterThan(0);
    expect(toggleThursday(state).ok).toBe(true);
  });

  it('checkAchievements acumula logros nuevos', () => {
    const state = createInitialState();
    state.totalCoffee = 100;
    const unlocked = checkAchievements(state);
    expect(unlocked.length).toBeGreaterThan(0);
    expect(state.achievements).toContain('Primeros 100 granos');
  });
});

describe('Persistencia (Fase 4)', () => {
  it('round-trip con caracteres especiales', () => {
    const state = createInitialState();
    state.achievements = ['Logro, con coma', 'Logro "con" comillas'];
    const restored = deserializeState(serializeState(state));
    expect(restored.achievements).toEqual(state.achievements);
  });

  it('migra un guardado viejo sin versión', () => {
    const legacy = JSON.stringify({ coffee: 500, totalCoffee: 4000, cps: 10, defeatedBosses: ['Damián Rebelde'] });
    const state = deserializeState(legacy);
    expect(state.saveVersion).toBeGreaterThanOrEqual(2);
    expect(state.coffee).toBe(500);
    expect(getCurrentAct(state)).toBe(2);
  });

  it('normaliza valores inválidos', () => {
    const state = createInitialState();
    state.coffee = NaN as unknown as number;
    validateGameValues(state);
    expect(Number.isFinite(state.coffee)).toBe(true);
  });
});
