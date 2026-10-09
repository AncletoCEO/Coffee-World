import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the terminal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-terminal')).toBeTruthy();
    expect(compiled.querySelector('.prompt-input')).toBeTruthy();
  });

  it('should render a live status bar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const bar = compiled.querySelector('.status-bar') as HTMLElement;
    expect(bar).toBeTruthy();
    expect(bar.textContent).toContain('Café');
    expect(bar.textContent).toContain('Acto');
  });
});
