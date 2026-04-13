import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine/game-engine.service';
import { getCurrentAct } from '../game-engine/game-engine';

@Component({
  selector: 'dungeon-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dungeon-panel.component.html'
})
export class DungeonPanelComponent {
  protected readonly engine = inject(GameEngineService);
  protected readonly currentAct = computed(() => getCurrentAct(this.engine.state().totalCoffee));

  protected get pendingBosses() {
    return this.engine.state().bosses.filter(boss =>
      boss.act === this.currentAct() && !this.engine.state().defeatedBosses.includes(boss.name)
    );
  }
}
