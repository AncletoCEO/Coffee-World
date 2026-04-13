import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from './game-engine/game-engine.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Coffee World Angular Preview');
  protected readonly engine = inject(GameEngineService);

  protected buyUpgrade(upgradeKey: string): void {
    this.engine.buyUpgrade(upgradeKey);
  }

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
