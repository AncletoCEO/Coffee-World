import { Injectable, signal } from '@angular/core';
import {
  GameState,
  createInitialState,
  buyUpgrade,
  produceCoffee,
  getUpgradeCost,
  serializeState,
  deserializeState
} from './game-engine';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  private readonly storageKey = 'coffee-world-state';
  public state = signal<GameState>(createInitialState());

  constructor() {
    this.loadState();
  }

  reset(): void {
    const nextState = createInitialState();
    this.state.set(nextState);
    this.saveState(nextState);
  }

  buyUpgrade(upgradeKey: string): boolean {
    const nextState = structuredClone(this.state());
    const success = buyUpgrade(nextState, upgradeKey);
    if (success) {
      this.state.set(nextState);
      this.saveState(nextState);
    }
    return success;
  }

  produceCoffee(): number {
    const nextState = structuredClone(this.state());
    const produced = produceCoffee(nextState);
    this.state.set(nextState);
    this.saveState(nextState);
    return produced;
  }

  getUpgradeCost(upgradeKey: string): number {
    return getUpgradeCost(this.state().upgrades[upgradeKey]);
  }

  importState(json: string): void {
    const nextState = deserializeState(json);
    this.state.set(nextState);
    this.saveState(nextState);
  }

  exportState(): string {
    return serializeState(this.state());
  }

  private saveState(state: GameState): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, serializeState(state));
    }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.state.set(deserializeState(saved));
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }
  }
}
