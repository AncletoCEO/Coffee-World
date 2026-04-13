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
  public state = signal<GameState>(createInitialState());

  reset(): void {
    this.state.set(createInitialState());
  }

  buyUpgrade(upgradeKey: string): boolean {
    const nextState = { ...this.state(), upgrades: { ...this.state().upgrades }, bosses: [...this.state().bosses] };
    const success = buyUpgrade(nextState, upgradeKey);
    if (success) {
      this.state.set(nextState);
    }
    return success;
  }

  produceCoffee(): number {
    const nextState = { ...this.state(), upgrades: { ...this.state().upgrades }, bosses: [...this.state().bosses] };
    const produced = produceCoffee(nextState);
    this.state.set(nextState);
    return produced;
  }

  getUpgradeCost(upgradeKey: string): number {
    return getUpgradeCost(this.state().upgrades[upgradeKey]);
  }

  importState(json: string): void {
    const nextState = deserializeState(json);
    this.state.set(nextState);
  }

  exportState(): string {
    return serializeState(this.state());
  }
}
