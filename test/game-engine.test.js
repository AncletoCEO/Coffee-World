import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getUpgradeCost,
  getCurrentAct,
  buyUpgrade,
  produceCoffee,
  serializeState,
  deserializeState,
  normalizeInteger
} from '../js/game-engine.js';

describe('Game Engine Core', () => {
  it('calculates upgrade cost correctly for an owned upgrade', () => {
    const state = createInitialState();
    state.upgrades.upgrade1.owned = 2;
    expect(getUpgradeCost(state.upgrades.upgrade1)).toBeCloseTo(10 * Math.pow(1.15, 2));
  });

  it('returns the correct current act from total coffee', () => {
    expect(getCurrentAct(0)).toBe(1);
    expect(getCurrentAct(5000)).toBe(2);
    expect(getCurrentAct(12000)).toBe(3);
    expect(getCurrentAct(25000)).toBe(4);
    expect(getCurrentAct(52000)).toBe(6);
  });

  it('buys an upgrade when there is enough coffee', () => {
    const state = createInitialState();
    state.coffee = 100;
    state.totalCoffee = 100;

    const success = buyUpgrade(state, 'upgrade1');
    expect(success).toBe(true);
    expect(state.upgrades.upgrade1.owned).toBe(1);
    expect(state.coffee).toBeLessThan(100);
    expect(state.cps).toBe(1);
    expect(state.charisma).toBe(1);
  });

  it('rejects buying an upgrade when coffee is insufficient', () => {
    const state = createInitialState();
    state.coffee = 5;
    state.totalCoffee = 5;

    const success = buyUpgrade(state, 'upgrade1');
    expect(success).toBe(false);
    expect(state.upgrades.upgrade1.owned).toBe(0);
  });

  it('rejects upgrade purchase if act limit is reached and no pending boss exists', () => {
    const state = createInitialState();
    state.coffee = 100000;
    state.totalCoffee = 100000;
    state.coffeeStrength = 150;
    state.defeatedBosses = []; // no boss defeated

    const success = buyUpgrade(state, 'upgrade1');
    expect(success).toBe(false);
  });

  it('produces coffee correctly including donation and Thursday multiplier', () => {
    const state = createInitialState();
    state.cps = 10;
    state.donateEndTime = Date.now() + 100000;
    state.thursdayModeUnlocked = true;
    state.cpsMultiplier = 1.5;

    const produced = produceCoffee(state);
    expect(produced).toBeCloseTo(10 * 1.1 * 1.5);
    expect(state.coffee).toBeCloseTo(produced);
    expect(state.totalCoffee).toBeCloseTo(produced);
  });

  it('performs a full upgrade and persistence cycle', () => {
    const state = createInitialState();
    state.coffee = 100;
    state.totalCoffee = 100;

    const upgradeCost = getUpgradeCost(state.upgrades.upgrade1);
    const success = buyUpgrade(state, 'upgrade1');
    expect(success).toBe(true);
    expect(state.upgrades.upgrade1.owned).toBe(1);

    const produced = produceCoffee(state);
    expect(state.coffee).toBeCloseTo(100 - upgradeCost + produced);
    expect(state.totalCoffee).toBeCloseTo(100 + produced);

    const json = serializeState(state);
    const restored = deserializeState(json);
    expect(restored.totalCoffee).toBeCloseTo(state.totalCoffee);
    expect(restored.upgrades.upgrade1.owned).toBe(1);
  });

  it('serializes and deserializes state preserving core values', () => {
    const state = createInitialState();
    state.coffee = 42;
    state.totalCoffee = 100;
    state.cps = 5;
    state.upgrades.upgrade1.owned = 1;
    state.achievements = ['Primeros 100 granos'];

    const json = serializeState(state);
    const restored = deserializeState(json);

    expect(restored.coffee).toBe(42);
    expect(restored.totalCoffee).toBe(100);
    expect(restored.cps).toBe(5);
    expect(restored.upgrades.upgrade1.owned).toBe(1);
    expect(restored.achievements).toContain('Primeros 100 granos');
  });

  it('normalizes integers for invalid inputs', () => {
    expect(normalizeInteger('abc', 7)).toBe(7);
    expect(normalizeInteger(-5, 10)).toBe(10);
    expect(normalizeInteger('15')).toBe(15);
  });
});
