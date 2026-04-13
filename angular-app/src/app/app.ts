import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from './game-engine/game-engine.service';
import { StatsPanelComponent } from './stats-panel/stats-panel.component';
import { UpgradesPanelComponent } from './upgrades-panel/upgrades-panel.component';
import { SaveLoadPanelComponent } from './save-load-panel/save-load-panel.component';
import { DungeonPanelComponent } from './dungeon-panel/dungeon-panel.component';
import { ConsolePanelComponent } from './console-panel/console-panel.component';
import { ThursdayModePanelComponent } from './thursday-mode-panel/thursday-mode-panel.component';
import { NarrativePanelComponent } from './narrative-panel/narrative-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    StatsPanelComponent,
    UpgradesPanelComponent,
    SaveLoadPanelComponent,
    DungeonPanelComponent,
    ConsolePanelComponent,
    ThursdayModePanelComponent,
    NarrativePanelComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Coffee World Angular');
  protected readonly engine = inject(GameEngineService);

  protected produceCoffee(): void {
    this.engine.produceCoffee();
  }

  protected resetGame(): void {
    this.engine.reset();
  }

  protected exportState(): void {
    const data = this.engine.exportState();
    console.log('Game state export:', data);
  }
}
