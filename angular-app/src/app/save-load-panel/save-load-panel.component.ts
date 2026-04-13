import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine/game-engine.service';

@Component({
  selector: 'save-load-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './save-load-panel.component.html'
})
export class SaveLoadPanelComponent {
  protected readonly engine = inject(GameEngineService);
  protected stateText = '';
  protected message = '';

  protected exportState(): void {
    this.stateText = this.engine.exportState();
    this.message = 'State exported successfully.';
  }

  protected importState(): void {
    try {
      this.engine.importState(this.stateText);
      this.message = 'State imported successfully.';
    } catch {
      this.message = 'Invalid state data. Please paste valid JSON.';
    }
  }

  protected clearSavedState(): void {
    this.engine.clearSavedState();
    this.message = 'Saved state cleared.';
  }
}
