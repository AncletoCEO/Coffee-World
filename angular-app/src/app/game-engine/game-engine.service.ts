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
import { SaveLoadService } from '../save-load.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  public state = signal<GameState>(createInitialState());

  constructor(private readonly saveLoadService: SaveLoadService) {
    this.loadState();
  }

  reset(): void {
    const nextState = createInitialState();
    this.state.set(nextState);
    this.saveState(nextState);
  }

  buyUpgrade(upgradeKey: string): boolean {
    const nextState = this.cloneState(this.state());
    const success = buyUpgrade(nextState, upgradeKey);
    if (success) {
      this.state.set(nextState);
      this.saveState(nextState);
    }
    return success;
  }

  produceCoffee(): number {
    const nextState = this.cloneState(this.state());
    const produced = produceCoffee(nextState);
    this.state.set(nextState);
    this.saveState(nextState);
    return produced;
  }

  private cloneState(state: GameState): GameState {
    return typeof structuredClone === 'function'
      ? structuredClone(state)
      : JSON.parse(JSON.stringify(state));
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

  addAchievement(message: string): void {
    const nextState = this.cloneState(this.state());
    if (!nextState.achievements.includes(message)) {
      nextState.achievements.push(message);
      this.state.set(nextState);
      this.saveState(nextState);
    }
  }

  unlockThursdayMode(): void {
    const nextState = this.cloneState(this.state());
    nextState.thursdayModeUnlocked = true;
    if (nextState.cpsMultiplier === 1.0) {
      nextState.cpsMultiplier = 1.5;
    }
    this.state.set(nextState);
    this.saveState(nextState);
  }

  setCpsMultiplier(value: number): void {
    const nextState = this.cloneState(this.state());
    nextState.cpsMultiplier = Math.max(1.0, Math.min(3.0, value));
    this.state.set(nextState);
    this.saveState(nextState);
  }

  advanceDialogue(): void {
    const nextState = this.cloneState(this.state());
    nextState.currentDialogueIndex += 1;
    this.state.set(nextState);
    this.saveState(nextState);
  }

  clearSavedState(): void {
    this.saveLoadService.clear();
  }

  private saveState(state: GameState): void {
    this.saveLoadService.save(serializeState(state));
  }

  private loadState(): void {
    const saved = this.saveLoadService.load();
    if (saved) {
      try {
        this.state.set(deserializeState(saved));
      } catch {
        this.saveLoadService.clear();
      }
    }
  }
}
