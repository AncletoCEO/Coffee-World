import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from './game-engine/game-engine.service';
import { StatsPanelComponent } from './stats-panel/stats-panel.component';
import { UpgradesPanelComponent } from './upgrades-panel/upgrades-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StatsPanelComponent, UpgradesPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
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
