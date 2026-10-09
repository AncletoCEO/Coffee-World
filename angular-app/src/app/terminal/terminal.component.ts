import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameEngineService } from '../game-engine/game-engine.service';
import { getActProgress, getCurrentAct, getRequiredFridayPoints, getThursdayClock } from '../game-engine/game-engine';
import { actByNumber } from '../game-engine/content';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit, OnDestroy {
  protected readonly engine = inject(GameEngineService);
  protected command = '';

  protected readonly hud = computed(() => {
    const state = this.engine.state;
    const act = getCurrentAct(state);
    const progress = Math.floor(getActProgress(state) * 100);
    const parts = [
      `Café: ${Math.floor(state.coffee)}`,
      `CPS: ${Math.floor(state.cps)}`,
      `Acto ${act}: ${actByNumber(act).name} (${progress}%)`
    ];
    if (state.thursdayModeUnlocked) {
      parts.push(`⏰ Jueves ${getThursdayClock(state)}`);
      parts.push(`Puntos: ${state.buenFindePoints}/${getRequiredFridayPoints(state)}`);
    }
    return parts.join('  |  ');
  });

  @ViewChild('scrollback') private scrollback?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.engine.start();
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.engine.stop();
  }

  protected submit(): void {
    const value = this.command.trim();
    if (!value) return;
    this.engine.pushLog([`> ${value}`]);
    this.engine.execute(value);
    this.command = '';
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    queueMicrotask(() => {
      const element = this.scrollback?.nativeElement;
      if (element) element.scrollTop = element.scrollHeight;
    });
  }
}
