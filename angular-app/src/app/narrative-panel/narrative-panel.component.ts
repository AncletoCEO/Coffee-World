import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine/game-engine.service';

interface NarrativeEntry {
  title: string;
  message: string;
}

@Component({
  selector: 'narrative-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './narrative-panel.component.html'
})
export class NarrativePanelComponent {
  protected readonly engine = inject(GameEngineService);
  protected readonly stories = signal<NarrativeEntry[]>([
    {
      title: 'Welcome to Coffee World',
      message: 'Your coffee empire begins with a single cup and a bold vision.'
    },
    {
      title: 'First Boss Looms',
      message: 'A rival CEO challenges your caffeine strategy. Stay focused and brew smarter.'
    },
    {
      title: 'Thursday Ritual',
      message: 'Unlock the Thursday bonus to amplify your production and claim the day.'
    }
  ]);

  protected get currentStory(): NarrativeEntry {
    const index = Math.min(this.engine.state().currentDialogueIndex, this.stories().length - 1);
    return this.stories()[index];
  }

  protected advanceNarrative(): void {
    this.engine.advanceDialogue();
  }
}
