import { Injectable, signal } from '@angular/core';
import {
  GameState,
  checkAchievements,
  checkThursdayUnlock,
  createInitialState,
  deserializeState,
  getCurrentAct,
  getLatestDialogueIndex,
  getPendingBoss,
  produceCoffee,
  serializeState,
  tickThursday,
  endFriday
} from './game-engine';
import { actByNumber, DIALOGUES } from './content';
import { runCommand, CommandResult } from './commands';
import { GameStateService } from '../game-state.service';
import { SaveLoadService } from '../save-load.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  public readonly log = signal<string[]>([]);
  public readonly devMode = signal(false);

  private interval: ReturnType<typeof setInterval> | null = null;
  private ticksSinceSave = 0;
  private lastAct = 1;
  private lastBossName: string | null = null;
  private static readonly SAVE_EVERY_TICKS = 15;

  constructor(
    private readonly saveLoadService: SaveLoadService,
    private readonly gameStateService: GameStateService
  ) {
    this.loadState();
    this.syncNarrationTrackers();
    this.narrateOpening();
  }

  get state(): GameState {
    return this.gameStateService.state();
  }

  start(): void {
    if (this.interval !== null) return;
    this.interval = setInterval(() => this.tick(), 1000);
  }

  stop(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  pushLog(lines: string[]): void {
    if (!lines.length) return;
    this.log.update(current => [...current, ...lines]);
  }

  execute(input: string): string[] {
    const result = runCommand(this.state, input, {
      devMode: this.devMode(),
      now: Date.now(),
      random: Math.random
    });
    this.applyResult(result);
    this.pushLog(result.messages);
    return result.messages;
  }

  tick(now = Date.now()): void {
    const state = this.state;
    const messages: string[] = [];

    produceCoffee(state, now);

    if (state.thursdayModeUnlocked) {
      messages.push(...tickThursday(state));
    }
    if (state.fridayUnlocked && state.fridayEndTime > 0 && now >= state.fridayEndTime) {
      messages.push(...endFriday(state));
    }

    messages.push(...checkAchievements(state));
    messages.push(...checkThursdayUnlock(state));

    const previousDialogue = state.currentDialogueIndex;
    state.currentDialogueIndex = getLatestDialogueIndex(state);
    if (state.currentDialogueIndex > previousDialogue) {
      const dialogue = DIALOGUES[state.currentDialogueIndex];
      messages.push(`📧 Nueva historia: "${dialogue.title}" (${dialogue.narrator}).`);
    }

    const act = getCurrentAct(state);
    if (act > this.lastAct) {
      messages.push(`🎬 Acto ${act}: ${actByNumber(act).name}`);
      this.lastAct = act;
    }

    const pendingBoss = getPendingBoss(state);
    if (pendingBoss && pendingBoss.name !== this.lastBossName) {
      messages.push(`⚔️ ¡${pendingBoss.name} espera en ${pendingBoss.dungeon}!`);
      this.lastBossName = pendingBoss.name;
    }

    this.gameStateService.setState({ ...state });
    if (messages.length) this.pushLog(messages);

    this.ticksSinceSave += 1;
    if (this.ticksSinceSave >= GameEngineService.SAVE_EVERY_TICKS) {
      this.ticksSinceSave = 0;
      this.saveState();
    }
  }

  private syncNarrationTrackers(): void {
    this.lastAct = getCurrentAct(this.state);
    this.lastBossName = getPendingBoss(this.state)?.name ?? null;
  }

  private narrateOpening(): void {
    this.pushLog(["Bienvenido a Ancleto's Coffee World.", 'Escribe "help" para ver los comandos.']);
    this.narrateObjective();
  }

  private narrateObjective(): void {
    this.pushLog(['🥅 Objetivo: producí café, comprá mejoras y derrotá al primer boss.']);
  }

  private applyResult(result: CommandResult): void {
    if (result.devMode) this.devMode.set(true);
    if (result.reset) {
      this.reset();
      return;
    }
    if (result.load) this.loadState();
    if (result.save) this.saveState();
  }

  reset(): void {
    this.stop();
    this.saveLoadService.clear();
    this.gameStateService.reset();
    this.devMode.set(false);
    this.lastAct = 1;
    this.lastBossName = null;
    this.pushLog(['Juego reseteado. Nueva partida.']);
    this.narrateObjective();
    this.start();
  }

  exportState(): string {
    return serializeState(this.state);
  }

  importState(json: string): boolean {
    try {
      const state = deserializeState(json);
      this.gameStateService.setState(state);
      this.saveState();
      return true;
    } catch {
      return false;
    }
  }

  private saveState(): void {
    this.saveLoadService.save(serializeState(this.state));
  }

  private loadState(): void {
    const saved = this.saveLoadService.load();
    if (!saved) return;
    try {
      this.gameStateService.setState(deserializeState(saved));
    } catch {
      this.saveLoadService.clear();
      this.gameStateService.setState(createInitialState());
    }
  }
}
