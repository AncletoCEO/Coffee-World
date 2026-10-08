import { Component } from '@angular/core';
import { TerminalComponent } from './terminal/terminal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TerminalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
