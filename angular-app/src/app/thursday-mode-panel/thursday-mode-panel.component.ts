import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine/game-engine.service';

@Component({
  selector: 'thursday-mode-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thursday-mode-panel.component.html'
})
export class ThursdayModePanelComponent {
  protected readonly engine = inject(GameEngineService);

  protected unlockThursdayMode(): void {
    this.engine.unlockThursdayMode();
  }

  protected increaseMultiplier(): void {
    const next = Math.min(this.engine.state().cpsMultiplier + 0.5, 3.0);
    this.engine.setCpsMultiplier(next);
  }
}
