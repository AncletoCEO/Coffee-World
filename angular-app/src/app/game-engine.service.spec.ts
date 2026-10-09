import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine/game-engine.service';
import { GameStateService } from './game-state.service';
import { DEV_SECRET } from './game-engine/content';

describe('GameEngineService', () => {
  let service: GameEngineService;
  let stateService: GameStateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [GameEngineService]
    });
    service = TestBed.inject(GameEngineService);
    stateService = TestBed.inject(GameStateService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should buy an upgrade through a command', () => {
    stateService.setState({ ...service.state, coffee: 100, totalCoffee: 100 });

    service.execute('buy machine');

    expect(service.state.upgrades.upgrade1.owned).toBe(1);
    expect(service.state.coffee).toBeLessThan(100);
  });

  it('should report command output in the log', () => {
    service.pushLog(['> status']);
    service.execute('status');
    expect(service.log().some(line => line.includes('Café'))).toBe(true);
  });

  it('should export and import state successfully', () => {
    stateService.setState({ ...service.state, coffee: 150, totalCoffee: 150 });
    const exported = service.exportState();

    service.reset();
    expect(service.state.coffee).toBe(0);

    expect(service.importState(exported)).toBe(true);
    expect(service.state.coffee).toBe(150);
  });

  it('should activate dev mode with the secret command', () => {
    service.execute(DEV_SECRET);
    expect(service.devMode()).toBe(true);
  });

  it('should produce coffee on tick', () => {
    stateService.setState({ ...service.state, cps: 10 });
    service.tick();
    expect(service.state.coffee).toBeCloseTo(10);
  });

  it('should reset to a clean state', () => {
    stateService.setState({ ...service.state, coffee: 500, totalCoffee: 500 });
    service.reset();
    expect(service.state.coffee).toBe(0);
    expect(service.state.totalCoffee).toBe(0);
  });

  it('narrates a new dialogue when crossing its threshold', () => {
    stateService.setState({ ...service.state, totalCoffee: 60, currentDialogueIndex: 0 });

    service.tick();

    expect(service.log().some(line => line.includes('Nueva historia'))).toBe(true);
  });

  it('narrates an act change once per transition', () => {
    stateService.setState({ ...service.state, defeatedBosses: ['Damián Rebelde'], totalCoffee: 5000 });

    service.tick();
    service.tick();

    const actLines = service.log().filter(line => line.startsWith('🎬'));
    expect(actLines.length).toBe(1);
    expect(actLines[0]).toContain('Acto 2');
  });

  it('does not add narration lines on idle ticks', () => {
    service.tick();
    const afterFirst = service.log().length;

    service.tick();
    service.tick();

    expect(service.log().length).toBe(afterFirst);
  });

  it('emits a kickoff objective line at startup', () => {
    expect(service.log().some(line => line.includes('Objetivo'))).toBe(true);
  });
});
