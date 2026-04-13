import { Injectable, signal } from '@angular/core';
import { createInitialState, GameState } from './game-engine/game-engine';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public readonly state = signal<GameState>(createInitialState());

  reset(): void {
    this.state.set(createInitialState());
  }

  setState(nextState: GameState): void {
    this.state.set(nextState);
  }

  getState(): GameState {
    return this.state();
  }
}
