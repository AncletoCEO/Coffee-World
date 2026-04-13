import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine/game-engine.service';
import { getCurrentAct } from '../game-engine/game-engine';

@Component({
  selector: 'stats-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-panel.component.html'
})
export class StatsPanelComponent {
  protected readonly engine = inject(GameEngineService);

  protected get currentAct(): number {
    return getCurrentAct(this.engine.state().totalCoffee);
  }
}
