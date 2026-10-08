import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameEngineService } from '../game-engine/game-engine.service';

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
