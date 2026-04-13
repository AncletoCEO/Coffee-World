import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameEngineService } from '../game-engine/game-engine.service';

@Component({
  selector: 'console-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './console-panel.component.html'
})
export class ConsolePanelComponent {
  protected readonly engine = inject(GameEngineService);
  protected achievementText = '';

  protected addAchievement(): void {
    if (this.achievementText.trim()) {
      this.engine.addAchievement(this.achievementText.trim());
      this.achievementText = '';
    }
  }
}
