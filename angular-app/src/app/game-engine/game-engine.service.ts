import { Injectable } from '@angular/core';
import {
  GameState,
  createInitialState,
  buyUpgrade,
  produceCoffee,
  getUpgradeCost,
  serializeState,
  deserializeState
} from './game-engine';
import { GameStateService } from '../game-state.service';
import { SaveLoadService } from '../save-load.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  public get state() {
    return this.gameStateService.state;
  }

  constructor(
    private readonly saveLoadService: SaveLoadService,
    private readonly gameStateService: GameStateService
  ) {
    this.loadState();
  }

  reset(): void {
    this.gameStateService.reset();
    this.saveState(this.gameStateService.getState());
  }

  buyUpgrade(upgradeKey: string): boolean {
    const nextState = this.cloneState(this.state());
    const success = buyUpgrade(nextState, upgradeKey);
    if (success) {
      this.gameStateService.setState(nextState);
      this.saveState(nextState);
    }
    return success;
  }

  produceCoffee(): number {
    const nextState = this.cloneState(this.state());
    const produced = produceCoffee(nextState);
    this.gameStateService.setState(nextState);
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
    this.gameStateService.setState(nextState);
    this.saveState(nextState);
  }

  exportState(): string {
    return serializeState(this.state());
  }

  addAchievement(message: string): void {
    const nextState = this.cloneState(this.state());
    if (!nextState.achievements.includes(message)) {
      nextState.achievements.push(message);
      this.gameStateService.setState(nextState);
      this.saveState(nextState);
    }
  }

  unlockThursdayMode(): void {
    const nextState = this.cloneState(this.state());
    nextState.thursdayModeUnlocked = true;
    if (nextState.cpsMultiplier === 1.0) {
      nextState.cpsMultiplier = 1.5;
    }
    this.gameStateService.setState(nextState);
    this.saveState(nextState);
  }

  setCpsMultiplier(value: number): void {
    const nextState = this.cloneState(this.state());
    nextState.cpsMultiplier = Math.max(1.0, Math.min(3.0, value));
    this.gameStateService.setState(nextState);
    this.saveState(nextState);
  }

  advanceDialogue(): void {
    const nextState = this.cloneState(this.state());
    nextState.currentDialogueIndex += 1;
    this.gameStateService.setState(nextState);
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
        this.gameStateService.setState(deserializeState(saved));
      } catch {
        this.saveLoadService.clear();
      }
    }
  }
}
