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
});
