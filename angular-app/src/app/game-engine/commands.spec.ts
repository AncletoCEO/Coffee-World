import { describe, it, expect } from 'vitest';
import { runCommand } from './commands';
import { createInitialState, GameState } from './game-engine';
import { DEV_SECRET } from './content';

function ctx(devMode = false) {
  return { devMode, now: Date.now(), random: () => 1 };
}

describe('CLI commands (Fase 5)', () => {
  it('help lista comandos', () => {
    const out = runCommand(createInitialState(), 'help', ctx());
    expect(out.messages.join('\n')).toContain('COMANDOS');
  });

  it('status reporta estadísticas y acto', () => {
    const state = createInitialState();
    state.coffee = 42;
    const out = runCommand(state, 'status', ctx());
    expect(out.messages.join(' ')).toContain('Café: 42');
    expect(out.messages.join(' ')).toContain('Acto 1');
  });

  it('buy informa éxito real', () => {
    const state = createInitialState();
    state.coffee = 100;
    state.totalCoffee = 100;
    const out = runCommand(state, 'buy machine', ctx());
    expect(out.messages.join(' ')).toContain('Compraste Máquina Verde');
    expect(state.upgrades.upgrade1.owned).toBe(1);
  });

  it('buy informa fallo sin café suficiente', () => {
    const state = createInitialState();
    state.coffee = 1;
    const out = runCommand(state, 'buy machine', ctx());
    expect(out.messages.join(' ')).toContain('suficiente');
    expect(out.messages.join(' ')).not.toContain('Compraste');
  });

  it('list upgrades muestra costos', () => {
    const out = runCommand(createInitialState(), 'list upgrades', ctx());
    expect(out.messages.length).toBeGreaterThan(1);
    expect(out.messages[1]).toContain('Máquina Verde');
  });

  it('dungeons lista la primera mazmorra del acto 1', () => {
    const out = runCommand(createInitialState(), 'dungeons', ctx());
    expect(out.messages.join(' ')).toContain('salaReuniones');
  });

  it('explore bloqueado no entra', () => {
    const state = createInitialState();
    const out = runCommand(state, 'explore cafeteria oscura', ctx());
    expect(out.messages.join(' ')).toContain('no disponible');
    expect(state.inDungeon).toBe(false);
  });

  it('explore + go + fight en dungeon', () => {
    const state = createInitialState();
    state.defeatedBosses = ['Damián Rebelde'];
    state.totalCoffee = 4000;
    runCommand(state, 'explore cafeteria oscura', ctx());
    expect(state.inDungeon).toBe(true);
    const startX = state.playerPos.x;
    runCommand(state, 'go east', ctx());
    expect(state.playerPos.x).toBe(startX + 1);
  });

  it('fight sin enemigos informa', () => {
    const out = runCommand(createInitialState(), 'fight', ctx());
    expect(out.messages.join(' ')).toContain('No hay enemigos');
  });

  it('mail respeta cooldown', () => {
    const state = createInitialState();
    runCommand(state, 'mail', ctx());
    const second = runCommand(state, 'mail', ctx());
    expect(second.messages.join(' ')).toContain('Espera');
  });

  it('reset exige confirmación', () => {
    const state = createInitialState();
    expect(runCommand(state, 'reset', ctx()).reset).toBeUndefined();
    expect(runCommand(state, 'reset confirm', ctx()).reset).toBe(true);
  });

  it('jueves bloqueado sin desbloqueo', () => {
    const out = runCommand(createInitialState(), 'jueves', ctx());
    expect(out.messages.join(' ')).toContain('Debes completar');
  });

  it('comando secreto activa dev mode', () => {
    const out = runCommand(createInitialState(), DEV_SECRET, ctx());
    expect(out.devMode).toBe(true);
  });

  it('comandos dev funcionan', () => {
    const state = createInitialState();
    runCommand(state, 'setcoffee 5000', ctx(true));
    expect(state.coffee).toBe(5000);
    runCommand(state, 'godmode', ctx(true));
    expect(state.cps).toBe(9999);
    runCommand(state, 'defeatboss dam', ctx(true));
    expect(state.defeatedBosses).toContain('Damián Rebelde');
  });

  it('spawnboss entra a la dungeon del boss (bug corregido)', () => {
    const state = createInitialState();
    runCommand(state, 'spawnboss crisis', ctx(true));
    expect(state.currentBoss?.name).toBe('Crisis de Arganaraz');
    expect(state.inDungeon).toBe(true);
  });

  it('roguelike bloqueado sin post-game', () => {
    const out = runCommand(createInitialState(), 'rogue', ctx());
    expect(out.messages.join(' ')).toContain('completar el post-game');
  });

  it('bendición y emergencia requieren modo jueves', () => {
    expect(runCommand(createInitialState(), 'blessing', ctx()).messages.join(' ')).toContain('no está activo');
    expect(runCommand(createInitialState(), 'emergency', ctx()).messages.join(' ')).toContain('no está activo');
  });

  it('credits bloqueado antes de completar', () => {
    expect(runCommand(createInitialState(), 'credits', ctx()).messages.join(' ')).toContain('se desbloquean');
  });

  it('comando desconocido informa', () => {
    expect(runCommand(createInitialState(), 'xyz', ctx()).messages.join(' ')).toContain('desconocido');
  });

  it('map sin dungeon no rompe', () => {
    expect(() => runCommand(createInitialState(), 'map', ctx())).not.toThrow();
  });
});
