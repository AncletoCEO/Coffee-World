import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine/game-engine.service';

@Component({
  selector: 'upgrades-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrades-panel.component.html'
})
export class UpgradesPanelComponent {
  protected readonly engine = inject(GameEngineService);

  protected buy(upgradeKey: string): void {
    this.engine.buyUpgrade(upgradeKey);
  }
}
